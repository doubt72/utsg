import { Direction, GameAction, Player, ReinforcementSelection } from "../utilities/commonTypes";
import { getAPI, postAPI } from "../utilities/network";
import Scenario, { ReinforcementItem, ReinforcementSchedule, ScenarioData } from "./Scenario";
import GameMove, { GameMoveData } from "./GameMove";
import Feature from "./Feature";
import BaseMove from "./moves/BaseMove";

export type GameData = {
  id: number;
  name: string;
  scenario: ScenarioData;
  owner: string;

  state?: string;
  player_one: string;
  player_two: string;
  current_player: string;
  winner?: Player;
  metadata: {
    turn: number;
  }

  suppress_network?: boolean;
}

export type GamePhase = 0 | 1 | 2 | 3
export const gamePhaseType: { [index: string]: GamePhase } = {
  Deployment: 0, Prep: 1, Main: 2, Cleanup: 3
}

export default class Game {
  id: number;
  name: string;
  scenario: Scenario;
  ownerName: string;
  playerOneName: string = "";
  playerTwoName: string = "";
  state?: string;
  currentSequence = 1;

  refreshCallback: (g: Game) => void;

  currentPlayer: Player;
  winner?: Player;
  turn: number = 0;
  phase: GamePhase;
  playerOnePoints: number = 0;
  playerTwoPoints: number = 0;
  moves: BaseMove[] = [];
  lastMoveIndex: number = -1;
  initiativePlayer: Player = 1;
  initiative: number = 0;
  alliedSniper?: Feature;
  axisSniper?: Feature;

  suppressNetwork: boolean = false;
  reinforcementSelection?: ReinforcementSelection;
  reinforcementNeedsDirection?: [number, number]

  constructor(data: GameData, refreshCallback: (g: Game) => void = () => {}) {
    this.id = data.id
    this.name = data.name
    this.scenario = new Scenario(data.scenario, this)
    this.ownerName = data.owner
    this.playerOneName = data.player_one
    this.playerTwoName = data.player_two
    this.state = data.state

    this.refreshCallback = refreshCallback

    if (data.suppress_network) {
      this.suppressNetwork = data.suppress_network
    }

    // Initial state, moves will modify
    this.currentPlayer = this.scenario.firstSetup || 1
    this.turn = 0
    this.phase = gamePhaseType.Deployment
    this.playerOnePoints = 0
    this.playerTwoPoints = 0
    this.loadAllMoves()
  }

  loadAllMoves() {
    if (this.suppressNetwork) { return }

    getAPI(`/api/v1/game_moves?game_id=${this.id}`, {
      ok: response => response.json().then(json => {
        for (let i = 0; i < json.length; i++) {
          const move = new GameMove(json[i], this, i)
          this.executeMove(move)
        }
      })
    })
  }

  loadNewMoves() {
    const limit = this.moves[this.moves.length - 1].id
    getAPI(`/api/v1/game_moves?game_id=${this.id}&after_id=${limit}`, {
      ok: response => response.json().then(json => {
        for (let i = 0; i < json.length; i++) {
          const move = new GameMove(json[i], this, i)
          this.executeMove(move)
        }
      })
    })
  }

  get currentUser(): string {
    return this.currentPlayer === 1 ? this.playerOneName : this.playerTwoName
  }

  get playerOneNation(): string {
    if (!this.scenario.alliedFactions) { return "" }
    return this.scenario.alliedFactions[0]
  }

  get playerTwoNation(): string {
    if (!this.scenario.axisFactions) { return "" }
    return this.scenario.axisFactions[0]
  }

  get playerOneScore(): number {
    let victoryHexes = 0
    for (let i = 0; i < this.scenario.map.victoryHexes.length; i++) {
      const vh = this.scenario.map.victoryHexes[i]
      if (vh.player === 1) { victoryHexes += 10 }
    }
    return this.playerOnePoints + victoryHexes
  }

  get playerTwoScore(): number {
    let victoryHexes = 0
    for (let i = 0; i < this.scenario.map.victoryHexes.length; i++) {
      const vh = this.scenario.map.victoryHexes[i]
      if (vh.player === 2) { victoryHexes += 10 }
    }
    return this.playerTwoPoints + victoryHexes
  }

  checkSequence(sequence: number): boolean {
    for (const m of this.moves) {
      if (m.sequence === sequence) { return true }
    }
    return false
  }

  get lastMove(): BaseMove | undefined {
    if (this.lastMoveIndex < 0) { return undefined }
    return this.moves[this.lastMoveIndex]
  }

  previousMoveUndoPossible(index: number): boolean {
    let check = index - 1

    while(check >= 0 && this.moves[check].undone) {
      check--
    }

    if (check < 0) { return false }
    return this.moves[check].undoPossible
  }

  executeMove(move: GameMove) {
    const m = move.moveClass
    if (m.sequence) {
      if (this.checkSequence(m.sequence)) { return }
      if (m.sequence > this.currentSequence) { this.currentSequence = m.sequence }
    } else {
      this.currentSequence++
      m.sequence = this.currentSequence
    }
    this.moves.push(m)
    if (!m.undone) {
      this.lastMoveIndex = move.index
      m.mutateGame()
    }
    if (!this.suppressNetwork && m.id === undefined) {
      postAPI(`/api/v1/game_moves`, {
        game_move: {
          sequence: m.sequence, game_id: this.id, player: m.player, undone: false,
          data: JSON.stringify(m.data),
        }
      }, {
        ok: () => {}
      })
    }
    this.refreshCallback(this)
  }

  get undoPossible() {
    if (!this.lastMove) { return false }
    return this.lastMove.undoPossible
  }

  undo() {
    if (!this.lastMove) { return }
    this.lastMove.undo()

    while(this.lastMoveIndex >= 0 && this.lastMove.undone) {
      this.lastMoveIndex--
    }
    this.refreshCallback(this)
  }

  availableReinforcements(player: Player): ReinforcementSchedule {
    const rc: ReinforcementSchedule = {}
    const schedule = player === 1 ? this.scenario.alliedReinforcements : this.scenario.axisReinforcements
    for (const turn in schedule) {
      rc[turn] = []
      for (const counter of schedule[turn]) {
        rc[turn].push(counter)
      }
      if (rc[turn].length === 0) { delete rc[turn] }
    }
    return rc
  }

  checkPhase() {
    const data: GameMoveData = {
      player: this.currentPlayer, user: this.currentUser,
      data: { action: "phase" }
    }
    const oldPhase = this.phase
    const oldTurn = this.turn
    if (this.phase == gamePhaseType.Deployment) {
      const counters = this.currentPlayer === 1 ?
        this.scenario.alliedReinforcements[this.turn] :
        this.scenario.axisReinforcements[this.turn]

      const count = counters.reduce((tot, u) => tot + u.x - u.used, 0)
      if (count === 0) {
        if (this.turn === 0) {
          data.data.phase = [oldPhase, gamePhaseType.Deployment]
          if (this.currentPlayer === this.scenario.firstSetup) {
            data.data.player = this.currentPlayer === 1 ? 2 : 1
            data.data.turn = [oldTurn, 0]
          } else {
            data.data.player = this.scenario.firstMove
            data.data.turn = [oldTurn, 1]
          }
        } else {
          data.data.player = this.currentPlayer === 1 ? 2 : 1
          data.data.turn = [oldTurn, oldTurn]
          data.data.phase = this.currentPlayer === this.scenario.firstMove ?
            [oldPhase, gamePhaseType.Deployment] :
            [oldPhase, gamePhaseType.Prep]
        }
        this.executeMove(new GameMove(data, this, this.moves.length))
      }
    }
  }

  get currentReinforcementSelection(): ReinforcementSelection | undefined {
    return this.reinforcementSelection
  }

  setReinforcementSelection(select: ReinforcementSelection | undefined) {
    if (!select) {
      this.reinforcementSelection = select
      return
    }
    const current = this.reinforcementSelection
    if (select.player === current?.player && select.turn === current.turn && select.index === current.index) {
      this.reinforcementSelection = undefined
    } else {
      const counter = this.availableReinforcements(select.player)[select.turn][select.index]
      if (counter.x > counter.used) {
        this.reinforcementSelection = select
      }
    }
  }

  executeReinforcement(
    x: number, y: number, counter: ReinforcementItem, d: Direction, callback: (game: Game) => void
  ) {
    if (this.reinforcementSelection) {
      const move = new GameMove({
        user: this.currentUser,
        player: this.reinforcementSelection.player,
        data: {
          action: "deploy", origin_index: this.reinforcementSelection.index,
          target: [x, y], orientation: d, turn: this.turn
        }
      }, this, this.moves.length)
      this.executeMove(move)
      callback(this)
      if (counter.x == counter.used) {
        this.reinforcementSelection = undefined
      }
      this.reinforcementNeedsDirection = undefined
    }
  }

  actionsAvailable(activePlayer: string): GameAction[] {
    const moves = []
    if (this.lastMove?.undoPossible) {
      moves.push({ type: "undo" })
    }
    if (this.state === "needs_player") {
      if (this.ownerName === activePlayer || !activePlayer) {
        return [{ type: "none", message: "waiting for player to join" }]
      } else {
        return [{ type: "join" }]
      }
    } else if (this.state === "ready") {
      if (this.ownerName === activePlayer) {
        return [{ type: "start" }]
      } else if (activePlayer &&
        (this.playerOneName === activePlayer || this.playerTwoName === activePlayer)) {
        return [{ type: "leave" }]
      } else {
        return [{ type: "none", message: "waiting for game to start" }]
      }
    } else if (this.phase === gamePhaseType.Deployment) {
      moves.unshift({ type: "deploy" })
      return moves
    } else {
      return [{ type: "none", message: "not implemented yet" }]
    }
  }
}

