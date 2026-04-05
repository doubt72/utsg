import { baseTerrainType, Coordinate, featureType, Player } from "../utilities/commonTypes";
import { getAPI, postAPI, putAPI } from "../utilities/network";
import Scenario, { ReinforcementList, ReinforcementSchedule, ScenarioData } from "./Scenario";
import GameAction from "./GameAction";
import Feature from "./Feature";
import BaseAction, { significantActions } from "./actions/BaseAction";
import IllegalActionError from "./actions/IllegalActionError";
import WarningActionError from "./actions/WarningActionError";
import Counter from "./Counter";
import { alliedCodeToName, axisCodeToName, counterKey, otherPlayer, serverVersion } from "../utilities/utilities";
import Unit from "./Unit";
import Hex from "./Hex";
import organizeStacks from "./support/organizeStacks";
import BaseState, { stateType } from "./control/state/BaseState";
import FireState from "./control/state/FireState";
import MoveState from "./control/state/MoveState";
import AssaultState from "./control/state/AssaultState";
import RoutState from "./control/state/RoutState";
import DeployState from "./control/state/DeployState";
import CloseCombatState from "./control/state/CloseCombatState";
import { checkPhase, GamePhase, gamePhaseType } from "./support/gamePhase";
import PrecipCheckState from "./control/state/PrecipCheckState";
import RallyState from "./control/state/RallyState";
import RallyAction from "./actions/RallyAction";
import SmokeCheckState from "./control/state/SmokeCheckState";
import FireCheckState from "./control/state/FireCheckState";
import WeatherState from "./control/state/WeatherState";
import FireDisplaceState from "./control/state/FireDisplaceState";
import ReactionState from "./control/state/ReactionState";
import { helpIndexByName } from "../components/help/helpData";
import SmokeCheckAction from "./actions/SmokeCheckAction";
import FireOutAction from "./actions/FireOutAction";
import FireSpreadAction from "./actions/FireSpreadAction";
import CloseCombatRollAction from "./actions/CloseCombatRollAction";
import CloseCombatReduceAction from "./actions/CloseCombatReduceAction";
import DeployAction from "./actions/DeployAction";

export type GameData = {
  id: number;
  name: string;
  scenario: ScenarioData;
  scenario_version: string;
  owner: string;

  state?: string;
  player_one: string;
  player_two: string;
  current_player: string;
  winner?: Player;
  server_version: string;
  metadata: {
    turn: number;
  }

  suppress_network?: boolean;
}

export type CloseProgress = "nr" | "nc" | "d"
export const closeProgress: { [index: string]: CloseProgress } = {
  NeedsRoll: "nr", NeedsCasualties: "nc", Done: "d",
}

export type SimpleUnitCheck = { unit: Unit, loc: Coordinate }
export type SimpleFeatureCheck = { feature: Feature, loc: Coordinate }
export type SimpleHexCheck = {
  loc: Coordinate, vehicle?: boolean, incendiary?: boolean, vehicle_incendiary?: boolean,
}
export type ComplexCheck = { unit: Unit, from: Coordinate[], to: Coordinate, incendiary: boolean }
export type CloseCheck = {
  loc: Coordinate, state: CloseProgress, p1Reduce: number, p2Reduce: number,
}

export type ActionAnimationDetails = {
  index: number, loc: Coordinate, message: string[], textColor: string, backgroundColor: string
}

export default class Game {
  id: number;
  name: string;
  scenario: Scenario;
  scenarioVersion: string;
  ownerName: string;
  playerOneName: string = "";
  playerTwoName: string = "";
  state?: string;
  currentSequence = 1;

  eliminatedUnits: (Unit | Feature)[]

  refreshCallback: (g: Game, error?: [string, string]) => void;

  internalCurrentPlayer: Player;
  internalInitiativePlayer: Player;
  winner?: Player;
  internalTurn: number = 0;
  phase: GamePhase;
  actions: BaseAction[] = [];
  lastActionIndex: number = -1;
  initiative: number = 0;
  alliedSniper?: Feature;
  axisSniper?: Feature;

  suppressNetwork: boolean = false;
  suppressAnimations: boolean = false;
  testGame: boolean = false;
  currentState?: BaseState;

  closeReinforcementPanel: boolean = false;

  openOverlay?: Hex;
  closeOverlay: boolean = false;

  messageQueue: string[];
  animationQueue: ActionAnimationDetails[];
  animationIndex: number = 1;
  updateTimer: NodeJS.Timeout | undefined;
  resignationLevel: number;

  moraleChecksNeeded: ComplexCheck[];
  sniperNeeded: SimpleUnitCheck[];
  routCheckNeeded: SimpleUnitCheck[];
  routNeeded: SimpleUnitCheck[];
  fireDisplaceNeeded: SimpleUnitCheck[];
  closeNeeded: CloseCheck[];
  smokeCheckNeeded: SimpleFeatureCheck[];
  fireStartCheckNeeded: SimpleHexCheck | undefined;
  fireOutCheckNeeded: SimpleFeatureCheck[];
  fireSpreadCheckNeeded: SimpleFeatureCheck[];
  checkWindDirection: boolean;
  checkWindSpeed: boolean;
  playerOneNotification: [string, string] | undefined;
  playerTwoNotification: [string, string] | undefined;

  serverVersion: string;

  constructor(data: GameData, refreshCallback: (g: Game, error?: [string, string]) => void = () => {}) {
    this.id = data.id
    this.name = data.name
    this.scenario = new Scenario(data.scenario, this)
    this.scenarioVersion = this.scenario.version
    this.ownerName = data.owner
    this.playerOneName = data.player_one
    this.playerTwoName = data.player_two
    this.state = data.state

    this.eliminatedUnits = []

    this.refreshCallback = refreshCallback

    if (data.suppress_network) {
      this.suppressNetwork = data.suppress_network
      this.testGame = data.suppress_network
    }

    // Initial state, actions will modify
    this.internalCurrentPlayer = this.scenario.firstDeploy || 1
    this.internalInitiativePlayer = this.scenario.firstAction || 1
    this.internalTurn = 0
    this.phase = gamePhaseType.Deployment

    this.messageQueue = []
    this.animationQueue = []
    this.resignationLevel = 0
    this.moraleChecksNeeded = []
    this.sniperNeeded = []
    this.routCheckNeeded = []
    this.routNeeded = []
    this.fireDisplaceNeeded = []
    this.closeNeeded = []
    this.smokeCheckNeeded = []
    this.fireStartCheckNeeded = undefined
    this.fireOutCheckNeeded = []
    this.fireSpreadCheckNeeded = []
    this.checkWindDirection = false
    this.checkWindSpeed = false

    this.serverVersion = data.server_version

    this.loadAllActions()
  }

  loadAllActions() {
    if (this.serverVersion !== serverVersion) { return }
    if (this.suppressNetwork) { return }

    getAPI(`/api/v1/game_actions?game_id=${this.id}`, {
      ok: response => response.json().then(json => {
        for (let i = 0; i < json.length; i++) {
          const action = new GameAction(json[i], this, i)
          this.suppressNetwork = true
          this.suppressAnimations = true
          this.executeAction(action, true)
          this.suppressAnimations = false
          this.suppressNetwork = false
        }
      })
    })
  }

  loadNewActions(actionId?: number) {
    if (this.serverVersion !== serverVersion) { return }

    const limit = actionId ? actionId - 1 : this.actions[this.lastActionIndex].id
    getAPI(`/api/v1/game_actions?game_id=${this.id}&after_id=${limit}`, {
      ok: response => response.json().then(json => {
        for (let i = 0; i < json.length; i++) {
          const action = new GameAction(json[i], this)
          this.suppressNetwork = true
          this.executeAction(action, true)
          this.suppressNetwork = false
        }
      })
    })
  }

  sortActions() {
    this.actions = this.sortedActions()
    for (let i = 0; i < this.actions.length; i++) { this.actions[i].index = i }
  }

  sortedActions(): BaseAction[] {
    return this.actions.sort((a, b) => {
      if (a.sequence !== undefined && b.sequence !== undefined) { return a.sequence - b.sequence }
      if (a.id !== undefined && b.id !== undefined) { return a.id - b.id }
      return a.index - b.index // fallback to current order
    })
  }

  get fullySynced(): boolean {
    const actions = this.sortedActions()
    let lastSequence = 0
    for (let i = 0; i < actions.length; i++) {
      if (lastSequence !== (actions[i].sequence ?? 0) - 1) { console.log("not in sync"); return false }
      lastSequence = actions[i].sequence as number
    }
    return true
  }

  get needsRectify(): boolean {
    if (!this.fullySynced) { return false }
    const actions = this.sortedActions()
    for (let i = 0; i < actions.length; i++) {
      if (!actions[i].executed) { console.log("needs rectify"); return true }
    }
    return false
  }

  canExecute(sequence: number): boolean {
    const actions = this.sortedActions()
    if (actions.length < 1) { return true }
    if ((this.findActionBySequence(sequence) as BaseAction).executed) { return false }
    for (let i = 0; i < actions.length; i++) {
      if (actions[i].executed && actions[i].sequence === sequence - 1) { return true }
    }
    return false
  }

  canExecuteUndo(sequence: number): boolean {
    const actions = this.sortedActions()
    if (actions[actions.length - 1].sequence === sequence) { return true }
    for (let i = actions.length - 1; i >= 0; i--) {
      if (actions[i].undone && actions[i].executedUndo && actions[i].sequence === sequence + 1) {
        return true
      }
    }
    return false
  }

  rectifyActions(backendSync: boolean) {
    if (!this.fullySynced) { return }
    this.sortActions()
    for (let i = 0; i < this.actions.length; i++) {
      const action = this.actions[i]
      if (!action.executed && this.canExecute(action.sequence ?? 0)) {
        this.executeAction(new GameAction(action, this), backendSync, false)
      }
    }
    this.refreshCallback(this)
  }

  increaseResignation() {
    this.resignationLevel += 1
    if (this.resignationLevel > 2) {
      const user = localStorage.getItem("username") as string
      let winner: Player = user === this.playerOneName ? 2 : 1
      if (this.playerOneName === this.playerTwoName) {
        winner = otherPlayer(this.currentPlayer)
      }
      this.executeAction(new GameAction({
        player: winner, user, data: {
          action: "resign", old_initiative: this.initiative,
        }
      }, this), false)
      this.refreshCallback(this)
    } 
  }

  clearResignation() {
    this.resignationLevel = 0
  }

  addMessage(message: string) {
    this.messageQueue.push(message)
  }

  getMessage() {
    return this.messageQueue.pop()
  }

  addActionAnimations(data: {loc: Coordinate, type: string}[]) {
    if (this.suppressAnimations) { return }
    const animations = data.map(d => {
      if (d.type === "hit") {
        return { loc: d.loc, message: ["hit"], textColor: "#FFF", backgroundColor: "#E00" }
      } else if (d.type === "miss") {
        return { loc: d.loc, message: ["miss"], textColor: "#FFF", backgroundColor: "#00E" }
      } else if (d.type === "effect") {
        return { loc: d.loc, message: ["effective"], textColor: "#FFF", backgroundColor: "#E00" }
      } else if (d.type === "noeffect") {
        return { loc: d.loc, message: ["no", "effect"], textColor: "#FFF", backgroundColor: "#00E" }
      } else if (d.type === "drift") {
        return { loc: d.loc, message: ["drifts"], textColor: "#FFF", backgroundColor: "#00E" }
      } else if (d.type === "jammed") {
        return { loc: d.loc, message: ["weapon", "broken"], textColor: "#FFF", backgroundColor: "#E00" }
      } else if (d.type === "destroyed") {
        return { loc: d.loc, message: ["weapon", "destroyed"], textColor: "#FFF", backgroundColor: "#E00" }
      } else if (d.type === "immobilized") {
        return  {loc: d.loc, message: ["immobilized"], textColor: "#FFF", backgroundColor: "#E00" }
      } else if (d.type === "turret") {
        return { loc: d.loc, message: ["turret", "jammed"], textColor: "#FFF", backgroundColor: "#E00" }
      } else if (d.type === "break") {
        return { loc: d.loc, message: ["breaks"], textColor: "#FFF", backgroundColor: "#E00" }
      } else if (d.type === "pinned") {
        return { loc: d.loc, message: ["pinned"], textColor: "#FFF", backgroundColor: "#E00" }
      } else if (d.type === "eliminate") {
        return { loc: d.loc, message: ["eliminated"], textColor: "#FFF", backgroundColor: "#E00" }
      } else if (d.type === "nobreak") {
        return { loc: d.loc, message: ["no", "effect"], textColor: "#FFF", backgroundColor: "#00E" }
      } else if (d.type === "rally") {
        return { loc: d.loc, message: ["rallies"], textColor: "#FFF", backgroundColor: "#080" }
      } else if (d.type === "fix") {
        return { loc: d.loc, message: ["weapon", "fixed"], textColor: "#FFF", backgroundColor: "#080" }
      } else if (d.type === "norally") {
        return { loc: d.loc, message: ["no", "effect"], textColor: "#FFF", backgroundColor: "#00E" }
      } else if (d.type === "sniper") {
        return { loc: d.loc, message: ["sniper"], textColor: "#FFF", backgroundColor: "#E00" }
      } else if (d.type === "rout") {
        return { loc: d.loc, message: ["routs"], textColor: "#FFF", backgroundColor: "#E00" }
      } else if (d.type === "norout") {
        return { loc: d.loc, message: ["no", "effect"], textColor: "#FFF", backgroundColor: "#00E" }
      } else if (d.type === "wreck") {
        return { loc: d.loc, message: ["destroyed"], textColor: "#FFF", backgroundColor: "#E00" }
      } else if (d.type === "nowreck") {
        return { loc: d.loc, message: ["no", "effect"], textColor: "#FFF", backgroundColor: "#00E" }
      } else if (d.type === "blaze") {
        return { loc: d.loc, message: ["blaze"], textColor: "#FFF", backgroundColor: "#E00" }
      } else if (d.type === "blazeout") {
        return { loc: d.loc, message: ["out"], textColor: "#FFF", backgroundColor: "#00E" }
      } else if (d.type === "smoke") {
        return { loc: d.loc, message: ["smoke"], textColor: "#FFF", backgroundColor: "#00E" }
      } else if (d.type === "smokecheck") {
        return { loc: d.loc, message: ["disperse"], textColor: "#FFF", backgroundColor: "#00E" }
      } else if (d.type === "combat") {
        return { loc: d.loc, message: ["combat"], textColor: "#FFF", backgroundColor: "#E00" }
      } else if (d.type === "clear") {
        return { loc: d.loc, message: ["clear"], textColor: "#FFF", backgroundColor: "#080" }
      } else if (d.type === "entrench") {
        return { loc: d.loc, message: ["digs in"], textColor: "#FFF", backgroundColor: "#080" }
      }
      console.log(`unexpected anim type ${d.type}`)
      return { loc: d.loc, message: ["???"], textColor: "#EE0", backgroundColor: "#000" }
    })
    // Stagger adding independent animations
    for (let i = 0; i < animations.length; i++) {
      const a = animations[i]
      const index = this.animationIndex++
      setTimeout(() => {
        this.animationQueue.push({
          index, loc: a.loc, message: a.message, textColor: a.textColor,
          backgroundColor: a.backgroundColor,
        })
        this.refreshCallback(this)
      }, i * 1000)
    }
  }

  getActionAnimations(): ActionAnimationDetails[] {
    const rc = this.animationQueue
    this.animationQueue = []
    return rc
  }

  get currentPlayer(): Player {
    return this.internalCurrentPlayer
  }

  get opponentPlayer(): Player {
    return otherPlayer(this.internalCurrentPlayer)
  }

  get currentInitiativePlayer(): Player {
    return this.internalInitiativePlayer
  }

  resetCurrentPlayer(): void {
    if (this.currentPlayer !== this.currentInitiativePlayer) {
      this.togglePlayer()
    }
  }

  setCurrentPlayer(player: Player) {
    if (player !== this.internalCurrentPlayer) {
      this.internalCurrentPlayer = player
      if (this.suppressNetwork) { return }
      if (this.updateTimer) { clearTimeout(this.updateTimer) }
      // Avoid doing a bunch of updates at the same time when (say) cycling
      // through skipped phases, this makes sure that only the last change goes
      // to the DB (i.e., that irregular network delays don't cause the updates
      // to happen out of order and have the wrong user change being the last
      // change stored).  This isn't needed for turns, those changes happen
      // infrequently.
      this.updateTimer = setTimeout(() => {
        this.updateTimer = undefined
        putAPI(`/api/v1/games/${this.id}`, { game: { current_player: this.currentUser } }, {
          ok: () => {}
        })
      }, 1000)
    }
  }

  setCurrentInitiativePlayer(player: Player) {
    if (player !== this.internalInitiativePlayer) { this.internalInitiativePlayer = player }
  }

  togglePlayer() {
    this.setCurrentPlayer(otherPlayer(this.currentPlayer))
  }

  toggleInitiative() {
    this.setCurrentInitiativePlayer(otherPlayer(this.currentInitiativePlayer))
    this.setCurrentPlayer(otherPlayer(this.currentPlayer))
  }

  get turn(): number {
    return this.internalTurn
  }

  setTurn(turn: number) {
    if (turn !== this.internalTurn) {
      this.internalTurn = turn
      if (this.suppressNetwork) { return }
      putAPI(`/api/v1/games/${this.id}`, { game: { metadata: JSON.stringify({ turn: turn }) } }, {
        ok: () => {}
      })
    }
  }

  get currentUser(): string {
    return this.currentPlayer === 1 ? this.playerOneName : this.playerTwoName
  }

  get opponentUser(): string {
    return this.currentPlayer === 1 ? this.playerTwoName : this.playerOneName
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

  get opponentPlayerNation(): string {
    return this.currentPlayer !== 1 ? this.playerOneNation : this.playerTwoNation
  }

  get alliedName(): string {
    return alliedCodeToName(this.playerOneNation)
  }

  get axisName(): string {
    return axisCodeToName(this.playerTwoNation)
  }

  get currentInitiativeNationName(): string {
    return this.currentInitiativePlayer === 1 ? this.alliedName : this.axisName
  }

  nationNameForPlayer(player: Player): string {
    return player === 1 ? this.alliedName : this.axisName
  }

  get gameState(): BaseState | undefined {
    return this.currentState
  }

  setGameState(state: BaseState): void {
    console.log(`setting game state: ${state.type}`)
    this.currentState = state
  }

  clearGameState(): void {
    console.log("clearing game state")
    this.currentState = undefined
  }

  get deployState(): DeployState {
    return this.gameState as DeployState
  }

  get precipCheckState(): PrecipCheckState {
    return this.gameState as PrecipCheckState
  }

  get fireState(): FireState {
    return this.gameState as FireState
  }

  get moveState(): MoveState {
    return this.gameState as MoveState
  }

  get assaultState(): AssaultState {
    return this.gameState as AssaultState
  }

  get routState(): RoutState {
    return this.gameState as RoutState
  }

  get reactionState(): ReactionState {
    return this.gameState as ReactionState
  }

  get closeCombatState(): CloseCombatState {
    return this.gameState as CloseCombatState
  }

  get rallyState(): RallyState {
    return this.gameState as RallyState
  }

  get fireDisplaceState(): FireDisplaceState {
    return this.gameState as FireDisplaceState
  }

  addSniper(unit: SimpleUnitCheck): void {
    this.sniperNeeded.push(unit)
  }

  freeRallyAvailable(player: Player): boolean {
    for (let i = this.actions.length - 1; i >= 0; i--) {
      const action = this.actions[i] as RallyAction
      if (action.type === "phase") { break }
      if (action.type === "rally" && !action.freeRally && action.player === player) { return false }
    }
    return true
  }

  get playerOneScore(): number {
    let points = 0
    for (let i = 0; i < this.scenario.map.victoryHexes.length; i++) {
      const vh = this.scenario.map.victoryHexes[i]
      if (vh.player === 1) { points += 10 }
    }
    for (const u of this.eliminatedUnits) {
      if (u.isFeature || u.nation === this.playerOneNation) { continue }
      const unit = u as Unit
      if (unit.leader) {
        points += 6
      } else if (!unit.operated) {
        points += unit.size
      }
    }
    return points
  }

  get playerTwoScore(): number {
    let points = 0
    for (let i = 0; i < this.scenario.map.victoryHexes.length; i++) {
      const vh = this.scenario.map.victoryHexes[i]
      if (vh.player === 2) { points += 10 }
    }
    for (const u of this.eliminatedUnits) {
      if (u.isFeature || u.nation === this.playerTwoNation) { continue }
      const unit = u as Unit
      if (unit.leader) {
        points += 6
      } else if (!unit.operated) {
        points += unit.size
      }
    }
    return points
  }

  get currentHelpSection(): string {
    if (this.gameState?.type === stateType.Fire ||
        this.gameState?.type === stateType.FireStart ||
        this.gameState?.type === stateType.MoraleCheck) {
      return helpIndexByName("Fire").join(".")
    } else if (this.gameState?.type === stateType.Move) {
      if (this.moveState.rushing) {
        return helpIndexByName("Rush Move").join(".")
      } else {
        return helpIndexByName("Movement").join(".")
      }
    } else if (this.gameState?.type === stateType.Breakdown) {
      if (this.lastSignificantAction?.type === "assault_move") {
        return helpIndexByName("Assault Move").join(".")
      } else {
        return helpIndexByName("Movement").join(".")
      }
    } else if (this.gameState?.type === stateType.Assault) {
      return helpIndexByName("Assault Move").join(".")
    } else if (this.gameState?.type === stateType.Rout ||
               this.gameState?.type === stateType.RoutAll ||
               this.gameState?.type === stateType.RoutCheck) {
      return helpIndexByName("Routing").join(".")
    } else if (this.gameState?.type === stateType.Reaction) {
      return helpIndexByName("Reaction Fire").join(".")
    } else if (this.phase === gamePhaseType.Deployment) {
      return helpIndexByName("Deployment Phase").join(".")
    } else if (this.phase === gamePhaseType.PrepRally) {
      return helpIndexByName("Rallying").join(".")
    } else if (this.phase === gamePhaseType.PrepPrecip) {
      return helpIndexByName("Precip Check").join(".")
    } else if (this.phase === gamePhaseType.Main) {
      return helpIndexByName("Main Phase").join(".")
    } else if (this.phase === gamePhaseType.CleanupCloseCombat) {
      return helpIndexByName("Close Combat").join(".")
    } else if ([
          gamePhaseType.CleanupOverstack, gamePhaseType.CleanupStatus, gamePhaseType.CleanupSmoke,
          gamePhaseType.CleanupFire, gamePhaseType.CleanupWeather,
        ].includes(this.phase)) {
      return helpIndexByName("Housekeeping").join(".")
    }
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
      if (significantActions.includes(a.data.action)) {
        this.scenario.map.setLastSelection(a)
        return a
      }
    }
    this.scenario.map.setLastSelection()
    return undefined
  }

  checkLastSAIsRout(player: Player): boolean {
    for (let i = this.actions.length - 1; i >= 0; i--) {
      const a = this.actions[i]
      if (a.undone || a.player !== player) { continue }
      if ([
        "move", "rush", "assault_move", "fire", "intensive_fire", "rout_self", "pass",
      ].includes(a.data.action)) { return false }
      if (a.data.action === "rout_all") { return true }
    }
    return false
  }

  addCloseCombatChecks() {
    const checks: CloseCheck[] = []
    for (let i = this.lastActionIndex; i >= 0; i--) {
      const action = this.actions[i]
      if (action.type === "phase") { break }
      if (action.type === "close_combat_roll") {
        const roll = action as CloseCombatRollAction
        checks.push({
          loc: new Coordinate(roll.origin[0].x, roll.origin[0].y),
          state: closeProgress.needsCasualties, p1Reduce: roll.p1Hits, p2Reduce: roll.p2Hits
        })
      }
      if (action.type === "close_combat_reduce") {
        const reduce = action as CloseCombatReduceAction
        for (const c of checks) {
          if (c.loc.x !== reduce.target.x || c.loc.y !== reduce.target.y) { continue }
          const unit = this.findUnitById(reduce.target.id) as Unit
          if (unit.playerNation === this.playerOneNation) {
            c.p1Reduce -= 1
          } else {
            c.p2Reduce -= 1
          }
          if (c.p1Reduce < 1 && c.p2Reduce < 1) { c.state = closeProgress.Done }
          break
        }
      }
    }
    const map = this.scenario.map
    for (let y = 0; y < map.height; y++) {
      for (let x = 0; x < map.width; x++) {
        let one = false
        let two = false
        map.units[y][x].forEach(uf => {
          if (uf.isFeature) { return }
          const u = uf as Unit
          if (u.operated) { return }
          if (u.playerNation === this.playerOneNation) { one = true }
          if (u.playerNation === this.playerTwoNation) { two = true }
        })
        if (one && two) {
          let found: CloseCheck | undefined = undefined
          for (const c of checks) {
            if (c.loc.x === x && c.loc.y === y) { found = c; break }
          }
          if (found === undefined) {
            checks.push({
              loc: new Coordinate(x, y), state: closeProgress.NeedsRoll, p1Reduce: 0, p2Reduce: 0,
            })
          }
        }
      }
    }
    this.closeNeeded = checks
  }

  get anyCloseCombatLeft(): boolean {
    return this.closeNeeded.filter(c => c.state !== closeProgress.Done).length > 0
  }

  addSmokeCheckState(): void {
    const done = []
    for (let i = this.lastActionIndex; i >= 0; i--) {
      const action = this.actions[i]
      if (action.type === "phase") { break }
      if (action.type === "smoke_check") {
        const smoke = action as SmokeCheckAction
        done.push(new Coordinate(smoke.target.x, smoke.target.y))
      }
    }
    const map = this.scenario.map
    this.smokeCheckNeeded = []
    for (let x = 0; x < map.width; x++) {
      for (let y = 0; y < map.height; y++) {
        const loc = new Coordinate(x, y)
        const counters = map.countersAt(loc)
        for (const c of counters) {
          if (c.feature.isFeature && c.feature.type === featureType.Smoke) {
            let found = false
            for (const d of done) {
              if (d.x === x && d.y === y) { found = true; break }
            }
            if (!found) { this.smokeCheckNeeded.push({ feature: c.feature, loc }) }
          }
        }
      }
    }
    if (this.smokeCheckNeeded.length > 0) {
      this.setGameState(new SmokeCheckState(this))
    }
  }

  addFireCheckState(): void {
    const out_done = []
    const spread_done = []
    for (let i = this.lastActionIndex; i >= 0; i--) {
      const action = this.actions[i]
      if (action.type === "phase") { break }
      if (action.type === "fire_out_check") {
        const fire = action as FireOutAction
        out_done.push(new Coordinate(fire.target.x, fire.target.y))
      } else if (action.type === "fire_spread_check") {
        const fire = action as FireSpreadAction
        spread_done.push(new Coordinate(fire.target.x, fire.target.y))
      }
    }
    const map = this.scenario.map
    this.fireOutCheckNeeded = []
    this.fireSpreadCheckNeeded = []
    for (let x = 0; x < map.width; x++) {
      for (let y = 0; y < map.height; y++) {
        const loc = new Coordinate(x, y)
        const counters = map.countersAt(loc)
        for (const c of counters) {
          if (c.feature.isFeature && c.feature.type === featureType.Fire) {
            let foundOut = false
            for (const d of out_done) {
              if (d.x === x && d.y === y) { foundOut = true; break }
            }
            if (!foundOut && spread_done.length < 1) {
              this.fireOutCheckNeeded.push({ feature: c.feature, loc })
            } else if (foundOut) {
              let foundSpread = false
              for (const d of spread_done) {
                if (d.x === x && d.y === y) { foundSpread = true; break }
              }
              if (!foundSpread && this.scenario.map.fireSpreadTarget() > 0) {
                const nat = map.neighborAt(loc, map.windDirection)
                if (nat) { this.fireSpreadCheckNeeded.push({ feature: c.feature, loc }) }
              }
            }
          }
        }
      }
    }
    if (this.fireOutCheckNeeded.length > 0 || this.fireSpreadCheckNeeded.length > 0) {
      this.setGameState(new FireCheckState(this))
    }
  }

  addVariableWindState(): void {
    if (this.lastAction?.type === "wind_speed") { return }
    if (this.scenario.map.windVariable) {
      if (this.lastAction?.type !== "wind_direction") { this.checkWindDirection = true }
      this.checkWindSpeed = true
      this.setGameState(new WeatherState(this))
    }
  }

  get specialRulesNegateTerrain(): boolean {
    const check = this.scenario.map.baseTerrain === baseTerrainType.Snow &&
      this.scenario.specialRules.includes("axis_ignore_snow")
    if (this.playerOneName === this.playerTwoName || this.suppressNetwork) {
      if (this.currentPlayer === 2 && check) { return true }
    } else {
      const player = localStorage.getItem("username") === this.playerOneName ? 1 : 2
      if (player === 2 && check) { return true }
    }
    return false
  }

  findUnitById(id: string): Unit | undefined {
    const counter = this.findCounterById(id)
    return counter ? counter.unit : undefined
  }

  findCounterById(id: string): Counter | undefined {
    const counter = this.scenario.map.findCounterById(id)
    if (counter) { return counter }
    for (const c of this.eliminatedUnits) {
      if (c.id === id) { return new Counter(undefined, c) }
    }
    return undefined
  }

  addEliminatedCounter(c: Unit | Feature) {
    if (c.isFeature && (c.type === featureType.Smoke || c.type === featureType.Fire)) {
      return
    }
    this.eliminatedUnits.push(c)
  }

  removeEliminatedCounter(id: string) {
    this.eliminatedUnits = this.eliminatedUnits.filter(c => c.id !== id)
  }

  panelCasualties(player: Player): ReinforcementList {
    const set: { [index: string]: { x: number, c: Unit } } = {}
    for (const c of this.eliminatedUnits) {
      if (c.isFeature || c.playerNation !== (player === 1 ? this.playerOneNation : this.playerTwoNation)) {
        continue
      }
      const key = counterKey(c)
      if (set[key] === undefined) {
        set[key] = { x: 1, c: c as Unit }
      } else {
        set[key].x++
      }
    }
    const rc: ReinforcementList = {}
    for (const key in set) {
      rc[key] = { x: set[key].x, used: 0, id: key, counter: set[key].c }
    }
    return rc
  }

  previousActionUndoPossible(index: number): boolean {
    let check = index - 1
    while(check >= 0 && this.actions[check].undone) {
      check--
    }
    if (check < 0) { return false }
    return this.actions[check].undoPossible
  }

  executeAction(action: GameAction, backendSync: boolean, checkRectify: boolean = true) {
    const m = action.actionClass
    if (m.sequence) {
      const em = this.findActionBySequence(m.sequence)
      if (em) {
        if (!em.id) {
          em.id = m.id
          this.refreshCallback(this)
        }
        if (m.undone && !em.undone) {
          if (this.canExecuteUndo(m.sequence)) {
            this.executeUndo(backendSync, m.sequence)
          } else { em.undone = true }
        }
        if (checkRectify && this.needsRectify) { this.rectifyActions(backendSync) }
        if (!m.undone && this.canExecute(m.sequence ?? this.currentSequence + 1)) {
          if (em.type !== "close_combat_start") {
            this.playerOneNotification = undefined
            this.playerTwoNotification = undefined
          }
          em.mutateGame()
          console.log(`executing[bounce] ${m.sequence} : ${m.type}`)
          em.executed = true
          if (this.phase !== gamePhaseType.Deployment) { organizeStacks(this.scenario.map) }
          this.refreshCallback(this)
        }
        return
      }
      if (m.sequence > this.currentSequence) { this.currentSequence = m.sequence }
    }
    try {
      if (!m.undone) {
        try {
          if (this.canExecute(m.sequence ?? this.currentSequence + 1)) {
            if (m.type !== "close_combat_start") {
              this.playerOneNotification = undefined
              this.playerTwoNotification = undefined
            }
            m.mutateGame()
            console.log(`executing[new] ${m.sequence ?? this.currentSequence + 1} : ${m.type}`)
            m.executed = true
            this.lastActionIndex = action.index
          }
        } catch(err) {
          if (err instanceof WarningActionError) {
            if (!m.id) { this.refreshCallback(this, ["warn", err.message]) }
            m.executed = true
            this.lastActionIndex = action.index
          } else { throw err }
        }
      }
      this.actions.push(m)
      if (!m.sequence) {
        this.currentSequence++
        m.sequence = this.currentSequence
      }
      if (checkRectify && this.needsRectify) { this.rectifyActions(backendSync) }
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
      if (m.type !== "info" && m.type !== "state" && !backendSync) { checkPhase(this, backendSync) }
      if (this.phase !== gamePhaseType.Deployment)  { organizeStacks(this.scenario.map) }
      this.refreshCallback(this)
    } catch(err) {
      if (err instanceof IllegalActionError) {
        this.refreshCallback(this, ["illegal", err.message])
      } else if (err instanceof Error) {
        this.refreshCallback(this, ["unknown", err.message])
      }
      if (!backendSync) {
        throw err
      }
    }
  }

  get undoPossible() {
    if (!this.lastAction) { return false }
    return this.lastAction.undoPossible
  }

  executeUndo(backendSync: boolean, seq?: number) {
    this.scenario.map.clearAllSelections()
    if (!this.lastAction) { return }
    const sequence = seq === undefined ? this.lastAction.sequence as number : seq
    const action = this.findActionBySequence(sequence)
    if (!action) { return }
    console.log(`undoing ${sequence} : ${action.type}`)
    action.undo()
    action.undone = true
    action.executedUndo = true
    if (this.lastActionIndex >= action.index) {
      for (let i = this.lastActionIndex; i >= 0; i--) {
        if (this.actions[i].undone) { continue }
        this.lastActionIndex = i
        break
      }
    }

    if (action.lastUndoCascade) {
      this.executeUndo(backendSync, sequence - 1)
    } else {
      if (!this.suppressNetwork && !backendSync) {
        postAPI(`/api/v1/game_actions/${action.id}/undo`, {}, { ok: () => {} })
      }
    }
    if (this.gameState?.type !== stateType.Deploy) {
      this.clearGameState()
    }
    this.refreshCallback(this)
  }

  availableReinforcements(player: Player): ReinforcementSchedule {
    const rc: ReinforcementSchedule = {}
    const schedule = player === 1 ? this.scenario.alliedReinforcements : this.scenario.axisReinforcements
    for (const turn in schedule) {
      rc[turn] = {}
      for (const pairs of Object.entries(schedule[turn])) {
        rc[turn][pairs[0]] = pairs[1]
      }
      if (Object.keys(rc[turn]).length === 0) { delete rc[turn] }
    }
    return rc
  }

  reinforcementsCount(turn: number, player: Player): [number, number] {
    const counters = player === 1 ?
      this.scenario.alliedReinforcements[turn] :
      this.scenario.axisReinforcements[turn]

    const initialCount = counters ? Object.values(counters).reduce((tot, u) => tot + u.x, 0) : 0
    const count = counters ? Object.values(counters).reduce((tot, u) => tot + u.x - u.used, 0) : 0
    return [count, initialCount]
  }

  undeploy() {
    const select = this.scenario.map.currentSelection[0]
    for (let i = this.lastActionIndex; i >= 0; i--) {
      const action = this.actions[i] as DeployAction
      if (action.undone) { continue }
      if (action.type === "phase") { break }
      if (action.type === "deploy" && select.unit.id === action.rId) {
        this.executeAction(new GameAction({
          user: this.currentUser,
          player: this.currentPlayer,
          data: {
            action: "undeploy", old_initiative: this.initiative,
            path: [{ x: action.target.x, y: action.target.y }],
            deploy: [{ turn: this.turn, key: action.rKey, id: action.rId }]
          }
        }, this), false)
        break
      }
    }
  }

  cancelAction() {
    let select: Unit | undefined = undefined
    if (this.gameState?.type === stateType.Move) {
      select = this.moveState.initialSelection[0].counter.unit
      this.scenario.map.clearAllSelections()
    } else if (this.gameState?.type === stateType.Assault) {
      select = this.assaultState.initialSelection[0].counter.unit
      this.scenario.map.clearAllSelections()
    } else if (this.gameState?.type === stateType.Fire) {
      select = this.fireState.initialSelection[0].counter.unit
      this.scenario.map.clearAllSelections()
    } else if (this.gameState?.type === stateType.RoutAll) {
      this.scenario.map.clearAllSelections()
    }
    if (select) {
      select.select()
    }
    this.scenario.map.clearGhosts()
    this.closeOverlay = true
    this.clearGameState()
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

  endTurnInitiative() {
    if (this.initiative > 3) { this.initiative = 3 }
    if (this.initiative < -3) { this.initiative = -3 }
  }

  split() {
    if (this.gameState?.type === stateType.Deploy) {
      this.deployState.split()
    } else {
      const map = this.scenario.map
      const selection = map.currentSelection[0]
      map.addCounter(selection.hex as Coordinate, selection.unit.split())
      organizeStacks(map)
    }
  }

  join() {
    if (this.gameState?.type === stateType.Deploy) {
      this.deployState.join()
    } else {
      // Need new state
    }
  }
}
