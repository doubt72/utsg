import { Coordinate, Direction, GameAction, Player } from "../utilities/commonTypes";
import { getAPI, postAPI } from "../utilities/network";
import Scenario, { ReinforcementItem, ReinforcementSchedule, ScenarioData } from "./Scenario";
import GameMove, { GameMoveData } from "./GameMove";
import Feature from "./Feature";
import BaseMove from "./moves/BaseMove";
import IllegalMoveError from "./moves/IllegalMoveError";
import WarningMoveError from "./moves/WarningMoveError";
import Counter from "./Counter";

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
  Deployment: 0, Prep: 1, Main: 2, Cleanup: 3,
}

export type ActionType = "d" | "m"
export const actionType: { [index: string]: ActionType } = {
  Deploy: "d", Move: "m",
}

export type ActionSelection = {
  x: number, y: number, ti: number, counter: Counter,
}

export type DeployAction = {
  turn: number, index: number, needsDirection?: [number, number],
}

export type MovePath = {
  x: number, y: number, facing?: number
}

export type MoveAction = {
  initialSelection: ActionSelection[];
  doneSelect: boolean;
  path: MovePath[],
}

export type GameActionState = {
  player: Player,
  currentAction?: ActionType,
  selection?: ActionSelection[],
  deploy?: DeployAction,
  move?: MoveAction,
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

  refreshCallback: (g: Game, error?: [string, string]) => void;

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
  gameActionState?: GameActionState;

  constructor(data: GameData, refreshCallback: (g: Game, error?: [string, string]) => void = () => {}) {
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
          this.executeMove(move, true)
        }
      })
    })
  }

  loadNewMoves(moveId?: number) {
    const limit = moveId ? moveId - 1 : this.moves[this.lastMoveIndex].id
    getAPI(`/api/v1/game_moves?game_id=${this.id}&after_id=${limit}`, {
      ok: response => response.json().then(json => {
        for (let i = 0; i < json.length; i++) {
          const move = new GameMove(json[i], this, i)
          this.executeMove(move, true)
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

  get currentPlayerNation(): string {
    return this.currentPlayer === 1 ? this.playerOneNation : this.playerTwoNation
  }

  get otherPlayerNation(): string {
    return this.currentPlayer !== 1 ? this.playerOneNation : this.playerTwoNation
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

  findBySequence(sequence: number): BaseMove | false {
    for (const m of this.moves) {
      if (m.sequence === sequence) { return m }
    }
    return false
  }

  get lastMove(): BaseMove | undefined {
    if (this.lastMoveIndex < 0) { return undefined }
    return this.moves[this.lastMoveIndex]
  }

  get opportunityFire(): boolean {
    // TODO: check last move
    return false
  }

  get reactionFire(): boolean {
    // TODO: check last move
    return false
  }

  previousMoveUndoPossible(index: number): boolean {
    let check = index - 1

    while(check >= 0 && this.moves[check].undone) {
      check--
    }

    if (check < 0) { return false }
    return this.moves[check].undoPossible
  }

  executeMove(move: GameMove, backendSync: boolean) {
    const m = move.moveClass
    if (m.sequence) {
      const em = this.findBySequence(m.sequence)
      if (em) {
        if (!em.id) {
          em.id = m.id
          this.refreshCallback(this)
        }
        if (m.undone && !em.undone) {
          this.executeUndo()
        }
        return
      }
      if (m.sequence > this.currentSequence) { this.currentSequence = m.sequence }
    }
    try {
      if (!m.undone) {
        try {
          m.mutateGame()
        } catch(err) {
          if (err instanceof WarningMoveError) {
            this.refreshCallback(this, ["warn", err.message])
          } else {
            throw err
          }
        }
        this.lastMoveIndex = move.index
      }
      this.moves.push(m)
      if (!m.sequence) {
        this.currentSequence++
        m.sequence = this.currentSequence
      }
      if (!this.suppressNetwork && m.id === undefined) {
        postAPI(`/api/v1/game_moves`, {
          game_move: {
            sequence: m.sequence, game_id: this.id, player: m.player, undone: false,
            data: JSON.stringify(m.data),
          }
        }, {
          ok: () => {},
        })
      }
      if (m.type !== "info" && m.type !== "state") { this.checkPhase(backendSync) }
      this.refreshCallback(this)
    } catch(err) {
      if (err instanceof IllegalMoveError) {
        this.refreshCallback(this, ["illegal", err.message])
      } else if (err instanceof Error) {
        this.refreshCallback(this, ["unknown", err.message])
      }
    }
  }

  get undoPossible() {
    if (!this.lastMove) { return false }
    return this.lastMove.undoPossible
  }

  executeUndo() {
    this.scenario.map.clearAllSelections()
    if (!this.lastMove) { return }
    const move = this.lastMove
    move.undo()

    while(this.lastMoveIndex >= 0 && this.lastMove.undone) {
      this.lastMoveIndex--
    }
    if (!this.suppressNetwork) {
      postAPI(`/api/v1/game_moves/${move.id}/undo`, {}, {
          ok: () => {}
      })
    }
    if (move.lastUndoCascade) {
      this.executeUndo()
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

  get reinforcementsCount(): [number, number] {
      const counters = this.currentPlayer === 1 ?
        this.scenario.alliedReinforcements[this.turn] :
        this.scenario.axisReinforcements[this.turn]

      const initialCount = counters ? counters.reduce((tot, u) => tot + u.x, 0) : 0
      const count = counters ? counters.reduce((tot, u) => tot + u.x - u.used, 0) : 0
      return [count, initialCount]
  }

  checkPhase(backendSync: boolean) {
    if (backendSync) { return }
    const data: GameMoveData = {
      player: this.currentPlayer, user: this.currentUser,
      data: { action: "phase" }
    }
    const oldPhase = this.phase
    const oldTurn = this.turn
    if (this.phase == gamePhaseType.Deployment) {
      const [count, initialCount] = this.reinforcementsCount
      if (count === 0) {
        if (initialCount === 0) {
          this.executeMove(new GameMove({
            player: this.currentPlayer, user: this.currentUser, data: {
              action: "info", message: "no units to deploy, skipping phase"
            }
          }, this, this.moves.length), backendSync)
        }
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
        this.executeMove(new GameMove(data, this, this.moves.length), backendSync)
      }
    } else if (this.phase === gamePhaseType.Prep) {
      if (this.scenario.map.anyBrokenUnits(this.currentPlayer)) {
        return
      }
      this.executeMove(new GameMove({
        player: this.currentPlayer, user: this.currentUser, data: {
          action: "info", message: "no broken units or jammed weapons, skipping phase"
        }
      }, this, this.moves.length), backendSync)
      // TODO: move this logic to something that can be reused for passing
      data.data.turn = [oldTurn, oldTurn]
      if (this.currentPlayer === this.scenario.firstMove) {
        data.data.player = this.currentPlayer === 1 ? 2 : 1
        data.data.phase = [oldPhase, oldPhase]
      } else {
        data.data.player = this.currentPlayer === 1 ? 2 : 1
        data.data.phase = [oldPhase, gamePhaseType.Main]

      }
      this.executeMove(new GameMove(data, this, this.moves.length), backendSync)
    }
  }

  get currentReinforcementSelection(): DeployAction | undefined {
    return this.gameActionState?.deploy
  }

  setReinforcementSelection(player: Player, deploy: DeployAction | undefined) {
    if (!deploy) {
      this.cancelAction()
      return
    }
    const current = this.gameActionState
    if (player === current?.player && deploy.turn === current.deploy?.turn &&
        deploy.index === current.deploy?.index) {
      this.cancelAction()
    } else {
      const counter = this.availableReinforcements(player)[deploy.turn][deploy.index]
      if (counter.x > counter.used) {
        this.gameActionState = { player, currentAction: actionType.Deploy }
        this.gameActionState.deploy = deploy
      }
    }
  }

  executeReinforcement(
    x: number, y: number, counter: ReinforcementItem, d: Direction, callback: (game: Game) => void
  ) {
    if (this.gameActionState?.deploy) {
      const move = new GameMove({
        user: this.currentUser,
        player: this.gameActionState.player,
        data: {
          action: "deploy", origin_index: this.gameActionState.deploy.index,
          target: [x, y], orientation: d, turn: this.turn
        }
      }, this, this.moves.length)
      this.executeMove(move, false)
      callback(this)
      this.gameActionState.deploy.needsDirection = undefined
      if (counter.x == counter.used) {
        this.cancelAction()
      }
    }
  }

  nextUnit(selection: Counter): Counter | undefined {
    return this.scenario.map.nextUnit(selection)
  }

  carriedUnits(selection: Counter): Counter[] {
    return this.scenario.map.carriedUnits(selection)
  }

  get lastPath(): MovePath | undefined {
    if (!this.gameActionState?.move) { return }
    const path = this.gameActionState.move.path
    return path[path.length - 1]
  }

  startMove() {
    const selection = this.scenario.map.currentSelection[0]
    if (selection && selection.hex) {
      const loc = {
        x: selection.hex.x, y: selection.hex.y,
        facing: selection.target.rotates ? selection.target.facing : undefined
      }
      const units = this.carriedUnits(selection)
      units.forEach(c => c.target.select())
      const canSelect = selection.target.canCarrySupport &&
        !(units.length === 1 && units[0].target.crewed)
      const allSelection = [{ x: loc.x, y: loc.y, ti: selection.trueIndex as number, counter: selection }]
      const initialSelection = [{ x: loc.x, y: loc.y, ti: selection.trueIndex as number, counter: selection }]
      units.forEach(u => {
        const hex = u.hex as Coordinate
        allSelection.push({ x: hex.x, y: hex.y, ti: u.trueIndex as number, counter: u })
        initialSelection.push({ x: hex.x, y: hex.y, ti: u.trueIndex as number, counter: u })
      })
      this.gameActionState = {
        player: this.currentPlayer,
        currentAction: actionType.Move,
        selection: allSelection,
        move: { initialSelection, doneSelect: !canSelect, path: [loc] }
      }
    }
  }

  move(x: number, y: number) {
    if (!this.gameActionState?.move) { return }
    if (!this.gameActionState?.selection) { return }
    const selection = this.gameActionState.selection
    const target = selection[0].counter.target
    const lastPath = this.lastPath as MovePath
    this.gameActionState.move.path.push({
      x: x, y: y, facing: target.rotates ? lastPath.facing : undefined,
    })
    this.gameActionState.move.doneSelect = true
  }

  moveRotate(x: number, y: number, dir: number) {
    if (!this.gameActionState?.move) { return }
    this.gameActionState.move.path.push({
      x: x, y: y, facing: dir,
    })
  }

  executePass() {}

  get moveInProgress(): boolean {
    if (this.gameActionState?.deploy && this.gameActionState.deploy.needsDirection) { return true }
    if (this.gameActionState?.move) { return true }
    return false
  }

  actionsAvailable(activePlayer: string): GameAction[] {
    if (this.lastMove?.id === undefined) {
      return [{ type: "sync" }]
    }
    const moves = []
    if (this.lastMove?.undoPossible && !this.moveInProgress) {
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
    } else if (this.phase === gamePhaseType.Main) {
      if ((activePlayer === this.playerOneName && this.currentPlayer === 1) ||
          (activePlayer === this.playerTwoName && this.currentPlayer === 2)) {
        if (this.gameActionState?.currentAction === actionType.Move) {
          if (this.gameActionState.move) {
            if (this.gameActionState.move.doneSelect) {
              moves.unshift({ type: "none", message: "select hex to move" })
            } else {
              moves.unshift({ type: "none", message: "select addtional units or select hex to move" })
            }
            if (this.gameActionState.move.path.length > 1) {
              moves.push({ type: "move_finish" })
            }
            moves.push({ type: "move_cancel" })
          } else {
            moves.unshift({ type: "none", message: "error: state.move undefined" })
          }
        } else if (this.opportunityFire) {
          moves.unshift({ type: "none", message: "opportunity fire" })
          moves.push({ type: "opportunity_fire" })
          moves.push({ type: "opportunity_intensive_fire" })
          moves.push({ type: "empty_pass" })
        } else if (this.reactionFire) {
          moves.unshift({ type: "none", message: "reaction fire" })
          moves.push({ type: "reaction_fire" })
          moves.push({ type: "reaction_intensive_fire" })
          moves.push({ type: "empty_pass" })
        } else if (this.scenario.map.noSelection) {
          moves.unshift({ type: "none", message: "select units to activate" })
          moves.push({ type: "enemy_rout" })
          moves.push({ type: "pass" })
        } else {
          moves.push({ type: "fire" })
          moves.push({ type: "intensive_fire" })
          if (!["sw", "gun", "other"].includes(this.scenario.map.currentSelection[0].target.type as string)) {
            moves.push({ type: "move" })
            moves.push({ type: "rush" })
            moves.push({ type: "assault_move" })
            moves.push({ type: "rout" })
          }
          moves.push({ type: "pass" })
        }
      } else {
        moves.unshift({ type: "none", message: "waiting for opponent to move" })
      }
      return moves
    } else {
      moves.unshift({ type: "none", message: "not implemented yet" })
      return moves
    }
  }

  cancelAction() {
    this.scenario.map.clearAllSelections()
    this.gameActionState = undefined
  }
}

