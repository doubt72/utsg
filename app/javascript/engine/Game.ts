import { Direction, Player } from "../utilities/commonTypes";
import { getAPI, postAPI } from "../utilities/network";
import Scenario, { ReinforcementItem, ReinforcementSchedule, ScenarioData } from "./Scenario";
import GameAction, {
  GameActionData, GameActionPath, GameActionPhaseChange, AddActionType
} from "./GameAction";
import Feature from "./Feature";
import BaseAction from "./actions/BaseAction";
import IllegalActionError from "./actions/IllegalActionError";
import WarningActionError from "./actions/WarningActionError";
import Counter from "./Counter";
import { alliedCodeToName, axisCodeToName, togglePlayer } from "../utilities/utilities";
import Unit from "./Unit";
import { finishBreakdown, finishInitiative, finishMove, loadingMoveToggle, move, moveRotate, placeSmokeToggle, rotateToggle, shortingMoveToggle, startBreakdown, startInitiative, startMove } from "./control/gameActions";

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

export type ActionType = "d" | "m" | "bd" | "i"
export const actionType: { [index: string]: ActionType } = {
  Deploy: "d", Move: "m", Breakdown: "bd", Initiative: "i",
}

export type ActionSelection = {
  x: number, y: number, id: string, counter: Counter,
}

export type DeployActionState = {
  turn: number, index: number, needsDirection?: [number, number],
}

export type AddAction = {
  type: AddActionType, x: number, y: number, id?: string, parent_id?: string, cost: number,
  facing?: Direction,
}

export type MoveActionState = {
  initialSelection: ActionSelection[];
  doneSelect: boolean;
  path: GameActionPath[],
  addActions: AddAction[],
  rotatingTurret: boolean,
  placingSmoke: boolean,
  droppingMove: boolean,
  loadingMove: boolean,
  loader?: Counter,
}

export type GameActionState = {
  player: Player,
  currentAction: ActionType,
  selection: ActionSelection[],
  deploy?: DeployActionState,
  move?: MoveActionState,
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
  actions: BaseAction[] = [];
  lastActionIndex: number = -1;
  initiative: number = 0;
  alliedSniper?: Feature;
  axisSniper?: Feature;

  suppressNetwork: boolean = false;
  gameActionState?: GameActionState;

  closeReinforcementPanel: boolean = false;

  openOverlay?: { x: number, y: number }
  closeOverlay: boolean = false;

  messageQueue: string[]

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

    // Initial state, actions will modify
    this.currentPlayer = this.scenario.firstDeploy || 1
    this.turn = 0
    this.phase = gamePhaseType.Deployment
    this.playerOnePoints = 0
    this.playerTwoPoints = 0
    this.messageQueue = []
    this.loadAllActions()
  }

  loadAllActions() {
    if (this.suppressNetwork) { return }

    getAPI(`/api/v1/game_actions?game_id=${this.id}`, {
      ok: response => response.json().then(json => {
        for (let i = 0; i < json.length; i++) {
          const action = new GameAction(json[i], this, i)
          this.executeAction(action, true)
        }
      })
    })
  }

  loadNewActions(actionId?: number) {
    const limit = actionId ? actionId - 1 : this.actions[this.lastActionIndex].id
    getAPI(`/api/v1/game_actions?game_id=${this.id}&after_id=${limit}`, {
      ok: response => response.json().then(json => {
        for (let i = 0; i < json.length; i++) {
          const action = new GameAction(json[i], this, i)
          this.executeAction(action, true)
        }
      })
    })
  }

  addMessage(message: string) {
    this.messageQueue.push(message)
  }

  getMessage() {
    return this.messageQueue.pop()
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

  get alliedName(): string {
    return alliedCodeToName(this.playerOneNation)
  }

  get axisName(): string {
    return axisCodeToName(this.playerTwoNation)
  }

  nationNameForPlayer(player: Player): string {
    return player === 1 ? this.alliedName : this.axisName
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

  get currentHelpSection(): string {
    return ""
  }

  findActionBySequence(sequence: number): BaseAction | false {
    for (const a of this.actions) {
      if (a.sequence === sequence) { return a }
    }
    return false
  }

  get lastAction(): BaseAction | undefined {
    if (this.lastActionIndex < 0) { return undefined }
    return this.actions[this.lastActionIndex]
  }

  get lastSignificantAction(): BaseAction | undefined {
    for (let i = this.actions.length - 1; i >= 0; i--) {
      const a = this.actions[i]
      if (a.undone) { continue }
      if (a.data.action === "move") {
        this.scenario.map.setLastSelection(a)
        return a
      }
      // TODO: when reaction passes, return undefined
    }
    this.scenario.map.setLastSelection()
    return undefined
  }

  get reactionFire(): boolean {
    return false
  }

  get initiativeCheck(): boolean {
    if (this.gameActionState) { return false }
    let rc = false
    for (const a of this.actions) {
      if (a.type == "initiative") { rc = false }
      if (["move", "rush", "assault move", "fire", "intensive fire", "rout", "rout all"].includes(a.type)) {
        rc = true
      }
    }
    return rc
  }

  get breakdownCheck(): boolean {
    const action = this.lastAction
    if (!action || this.gameActionState) { return false }
    if (action.data.origin && action.data.origin.length > 0) {
      const id = action.data.origin[0].id
      const counter = this.findCounterById(id) as Counter
      if (action.data.action === "move" && counter.unit.breakdownRoll) {
        return true
      }
    }
    return false
  }

  findUnitById(id: string): Unit | undefined {
    const counter = this.findCounterById(id)
    return counter ? counter.unit : undefined
  }

  findCounterById(id: string): Counter | undefined {
    return this.scenario.map.findCounterById(id)
    // TODO: handle units that have been eliminated
    return undefined
  }

  previousActionUndoPossible(index: number): boolean {
    let check = index - 1

    while(check >= 0 && this.actions[check].undone) {
      check--
    }

    if (check < 0) { return false }
    return this.actions[check].undoPossible
  }

  executeAction(action: GameAction, backendSync: boolean) {
    const m = action.actionClass
    if (m.sequence) {
      const em = this.findActionBySequence(m.sequence)
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
          if (err instanceof WarningActionError) {
            if (!m.id) {
              this.refreshCallback(this, ["warn", err.message])
            }
          } else {
            throw err
          }
        }
        this.lastActionIndex = action.index
      }
      this.actions.push(m)
      if (!m.sequence) {
        this.currentSequence++
        m.sequence = this.currentSequence
      }
      if (!this.suppressNetwork && m.id === undefined) {
        postAPI(`/api/v1/game_actions`, {
          game_action: {
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
      if (err instanceof IllegalActionError) {
        this.refreshCallback(this, ["illegal", err.message])
      } else if (err instanceof Error) {
        this.refreshCallback(this, ["unknown", err.message])
      }
    }
  }

  get undoPossible() {
    if (!this.lastAction) { return false }
    return this.lastAction.undoPossible
  }

  executeUndo() {
    this.scenario.map.clearAllSelections()
    if (!this.lastAction) { return }
    const action = this.lastAction
    action.undo()

    while(this.lastActionIndex >= 0 && this.lastAction.undone) {
      this.lastActionIndex--
    }
    if (!this.suppressNetwork) {
      postAPI(`/api/v1/game_actions/${action.id}/undo`, {}, {
          ok: () => {}
      })
    }
    if (action.lastUndoCascade) {
      this.executeUndo()
    }
    this.gameActionState = undefined
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
    const oldPhase = this.phase
    const oldTurn = this.turn
    const phaseData: GameActionPhaseChange = {
      old_phase: oldPhase, new_phase: gamePhaseType.Deployment,
      old_turn: oldTurn, new_turn: oldTurn, new_player: this.currentPlayer,
    }
    const data: GameActionData = {
      player: this.currentPlayer, user: this.currentUser,
      data: { action: "phase", phase_data: phaseData, old_initiative: this.initiative }
    }
    if (oldPhase == gamePhaseType.Deployment) {
      const [count, initialCount] = this.reinforcementsCount
      if (count === 0) {
        if (initialCount === 0) {
          this.executeAction(new GameAction({
            player: this.currentPlayer, user: this.currentUser, data: {
              action: "info", message: "no units to deploy, skipping phase",
              old_initiative: this.initiative,
            }
          }, this, this.actions.length), backendSync)
        }
        if (oldTurn === 0) {
          phaseData.new_phase = gamePhaseType.Deployment
          if (this.currentPlayer === this.scenario.firstDeploy) {
            phaseData.new_player = togglePlayer(this.currentPlayer)
          } else {
            phaseData.new_player = this.scenario.firstAction
            phaseData.new_turn = 1
          }
        } else {
          phaseData.new_player = togglePlayer(this.currentPlayer)
          phaseData.new_phase = this.currentPlayer === this.scenario.firstAction ?
            gamePhaseType.Deployment : gamePhaseType.Prep
        }
        this.executeAction(new GameAction(data, this, this.actions.length), backendSync)
        this.closeReinforcementPanel = true
      }
    } else if (oldPhase === gamePhaseType.Prep) {
      if (this.scenario.map.anyBrokenUnits(this.currentPlayer)) {
        return
      }
      this.executeAction(new GameAction({
        player: this.currentPlayer, user: this.currentUser, data: {
          action: "info", message: "no broken units or jammed weapons, skipping phase",
          old_initiative: this.initiative,
        }
      }, this, this.actions.length), backendSync)
      // TODO: move this logic to something that can be reused for passing?
      if (this.currentPlayer === this.scenario.firstAction) {
        phaseData.new_player = togglePlayer(this.currentPlayer)
        phaseData.new_phase = oldPhase
      } else {
        phaseData.new_player = togglePlayer(this.currentPlayer)
        phaseData.new_phase = gamePhaseType.Main

      }
      this.executeAction(new GameAction(data, this, this.actions.length), backendSync)
    }
  }

  get currentReinforcementSelection(): DeployActionState | undefined {
    return this.gameActionState?.deploy
  }

  setReinforcementSelection(player: Player, deploy: DeployActionState | undefined) {
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
        this.gameActionState = { player, currentAction: actionType.Deploy, selection: [] }
        this.gameActionState.deploy = deploy
      }
    }
  }

  executeReinforcement(
    x: number, y: number, counter: ReinforcementItem, d: Direction, callback: (game: Game) => void
  ) {
    if (this.gameActionState?.deploy) {
      const id = `uf-${this.actions.length}`
      const action = new GameAction({
        user: this.currentUser,
        player: this.gameActionState.player,
        data: {
          action: "deploy", old_initiative: this.initiative,
          path: [{ x, y, facing: d }],
          deploy: [{ turn: this.turn, index: this.gameActionState.deploy.index, id }]
        }
      }, this, this.actions.length)
      this.executeAction(action, false)
      callback(this)
      this.gameActionState.deploy.needsDirection = undefined
      if (counter.x === counter.used) {
        this.cancelAction()
      }
    }
  }

  get lastPath(): GameActionPath | undefined {
    if (!this.gameActionState?.move) { return }
    const path = this.gameActionState.move.path
    return path[path.length - 1]
  }

  startInitiative() {
    startInitiative(this)
  }

  finishInitiative() {
    finishInitiative(this)
  }

  startMove() {
    startMove(this)
  }

  move(x: number, y: number) {
    move(this, x, y)
  }

  moveRotate(x: number, y: number, dir: Direction) {
    moveRotate(this, x, y, dir)
  }

  placeSmokeToggle() {
    placeSmokeToggle(this)
  }

  shortingMoveToggle() {
    shortingMoveToggle(this)
  }

  loadingMoveToggle() {
    loadingMoveToggle(this)
  }

  rotateToggle() {
    rotateToggle(this)
  }

  finishMove() {
    finishMove(this)
  }

  startBreakdown() {
    startBreakdown(this)
  }

  finishBreakdown() {
    finishBreakdown(this)
  }

  executePass() {}

  get actionInProgress(): boolean {
    if (this.gameActionState?.deploy && this.gameActionState.deploy.needsDirection) { return true }
    if (this.gameActionState?.move) { return true }
    return false
  }

  cancelAction() {
    this.scenario.map.clearAllSelections()
    this.scenario.map.clearGhosts()
    this.closeOverlay = true
    this.gameActionState = undefined
  }

  updateInitiative(amount: number) {
    if (this.currentPlayer === 1) {
      this.initiative += amount
    } else {
      this.initiative -= amount
    }
    if (this.initiative > 7) { this.initiative = 7 }
    if (this.initiative < -7) { this.initiative = -7 }
  }
}
