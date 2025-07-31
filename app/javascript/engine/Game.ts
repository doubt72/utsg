import { Coordinate, Player, unitType } from "../utilities/commonTypes";
import { getAPI, postAPI, putAPI } from "../utilities/network";
import Scenario, { ReinforcementList, ReinforcementSchedule, ScenarioData } from "./Scenario";
import GameAction, { GameActionData, GameActionPhaseChange } from "./GameAction";
import Feature from "./Feature";
import BaseAction from "./actions/BaseAction";
import IllegalActionError from "./actions/IllegalActionError";
import WarningActionError from "./actions/WarningActionError";
import Counter from "./Counter";
import { alliedCodeToName, axisCodeToName, counterKey, togglePlayer } from "../utilities/utilities";
import Unit from "./Unit";
import Hex from "./Hex";
import { sortValues } from "./support/organizeStacks";
import BaseState from "./control/state/BaseState";
import FireState from "./control/state/FireState";
import MoveState from "./control/state/MoveState";
import AssaultState from "./control/state/AssaultState";
import RoutState from "./control/state/RoutState";
import DeployState from "./control/state/DeployState";

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

export type SimpleCheck = { unit: Unit, loc: Coordinate }
export type ComplexCheck = { unit: Unit, from: Coordinate[], to: Coordinate, incendiary: boolean }

export default class Game {
  id: number;
  name: string;
  scenario: Scenario;
  ownerName: string;
  playerOneName: string = "";
  playerTwoName: string = "";
  state?: string;
  currentSequence = 1;

  eliminatedUnits: (Unit | Feature)[]

  refreshCallback: (g: Game, error?: [string, string]) => void;

  iCurrentPlayer: Player;
  winner?: Player;
  iTurn: number = 0;
  phase: GamePhase;
  actions: BaseAction[] = [];
  lastActionIndex: number = -1;
  initiative: number = 0;
  alliedSniper?: Feature;
  axisSniper?: Feature;

  suppressNetwork: boolean = false;
  gameState?: BaseState;

  closeReinforcementPanel: boolean = false;

  openOverlay?: Hex;
  closeOverlay: boolean = false;

  messageQueue: string[];
  updateTimer: NodeJS.Timeout | undefined;
  resignationLevel: number;

  moraleChecksNeeded: ComplexCheck[];
  sniperNeeded: SimpleCheck[];
  routCheckNeeded: SimpleCheck[];
  routNeeded: SimpleCheck[];

  constructor(data: GameData, refreshCallback: (g: Game, error?: [string, string]) => void = () => {}) {
    this.id = data.id
    this.name = data.name
    this.scenario = new Scenario(data.scenario, this)
    this.ownerName = data.owner
    this.playerOneName = data.player_one
    this.playerTwoName = data.player_two
    this.state = data.state

    this.eliminatedUnits = []

    this.refreshCallback = refreshCallback

    if (data.suppress_network) {
      this.suppressNetwork = data.suppress_network
    }

    // Initial state, actions will modify
    this.iCurrentPlayer = this.scenario.firstDeploy || 1
    this.iTurn = 0
    this.phase = gamePhaseType.Deployment

    this.messageQueue = []
    this.resignationLevel = 0
    this.moraleChecksNeeded = []
    this.sniperNeeded = []
    this.routCheckNeeded = []
    this.routNeeded = []

    this.loadAllActions()
  }

  loadAllActions() {
    if (this.suppressNetwork) { return }

    getAPI(`/api/v1/game_actions?game_id=${this.id}`, {
      ok: response => response.json().then(json => {
        for (let i = 0; i < json.length; i++) {
          const action = new GameAction(json[i], this, i)
          this.suppressNetwork = true
          this.executeAction(action, true)
          this.suppressNetwork = false
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
          this.suppressNetwork = true
          this.executeAction(action, true)
          this.suppressNetwork = false
        }
      })
    })
  }

  increaseResignation() {
    this.resignationLevel += 1
    if (this.resignationLevel > 2) {
      postAPI(`/api/v1/games/${this.id}/resign`, {}, {
        ok: () => {}
      })
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

  get currentPlayer(): Player {
    return this.iCurrentPlayer
  }

  get opponentPlayer(): Player {
    return togglePlayer(this.iCurrentPlayer)
  }

  setCurrentPlayer(player: Player) {
    if (player !== this.iCurrentPlayer) {
      this.iCurrentPlayer = player
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

  togglePlayer() {
    this.setCurrentPlayer(togglePlayer(this.currentPlayer))
  }

  get turn(): number {
    return this.iTurn
  }

  setTurn(turn: number) {
    if (turn !== this.iTurn) {
      this.iTurn = turn
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

  nationNameForPlayer(player: Player): string {
    return player === 1 ? this.alliedName : this.axisName
  }

  get deployState(): DeployState {
    return this.gameState as DeployState
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
    for (const u of this.scenario.map.allUnits) {
      if (u.hasFeature || u.unit.nation === this.playerOneNation) { continue }
      if (u.unit.isWreck) { points += u.unit.size }
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
    for (const u of this.scenario.map.allUnits) {
      if (u.hasFeature || u.unit.nation === this.playerTwoNation) { continue }
      if (u.unit.isWreck) { points += u.unit.size }
    }
    return points
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
      if ([
        "move", "rush", "assault_move", "fire", "intensive_fire", "rout_self", "rout_move",
        "reaction_fire", "intensive_reaction_fire",
      ].includes(a.data.action)) {
        this.scenario.map.setLastSelection(a)
        return a
      }
    }
    this.scenario.map.setLastSelection()
    return undefined
  }

  checkLastSAIsRush(player: Player): boolean {
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
    this.eliminatedUnits.push(c)
  }

  removeEliminatedCounter(id: string) {
    this.eliminatedUnits = this.eliminatedUnits.filter(c => c.id !== id)
  }

  sortedCasualties(player: Player): ReinforcementList {
    const set: { [index: string]: { x: number, c: Unit } } = {}
    for (const c of this.eliminatedUnits) {
      if (c.isFeature || c.nation !== (player === 1 ? this.playerOneNation : this.playerTwoNation)) {
        continue
      }
      const key = counterKey(c)
      if (set[key] === undefined) {
        set[key] = { x: 1, c: c as Unit }
      } else {
        set[key].x++
      }
    }
    const rc: ReinforcementList = []
    for (const key in set) {
      rc.push({ x: set[key].x, used: 0, counter: set[key].c })
    }
    return rc.sort((a, b) => {
      let an = a.counter.name
      an = String(99 - sortValues(a.counter)) + an
      an = String(99 - (a.counter as Unit).size) + an
      an = a.counter.type === unitType.Leader ? "0" : "1" + an
      let bn = b.counter.name
      bn = String(99 - sortValues(b.counter)) + bn
      bn = String(99 - (b.counter as Unit).size) + bn
      bn = b.counter.type === unitType.Leader ? "0" : "1" + bn
      if (an === bn) { return 0 }
      return an > bn ? 1 : -1
    })
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
      if (!backendSync) {
        throw err
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
    action.undone = true

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
    this.gameState = undefined
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
          }, this), backendSync)
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
        this.executeAction(new GameAction(data, this), backendSync)
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
      }, this), backendSync)
      if (this.currentPlayer === this.scenario.firstAction) {
        phaseData.new_player = togglePlayer(this.currentPlayer)
        phaseData.new_phase = oldPhase
      } else {
        phaseData.new_player = togglePlayer(this.currentPlayer)
        phaseData.new_phase = gamePhaseType.Main

      }
      this.executeAction(new GameAction(data, this), backendSync)
    } else if (oldPhase === gamePhaseType.Main) {
      let index = this.lastActionIndex - 1
      let previousAction = this.actions[index--]
      while (previousAction && previousAction.undone) {
        previousAction = this.actions[index--]
      }
      if (this.lastAction?.type === "pass" && previousAction?.type === "pass") {
        this.executeAction(new GameAction({
          player: this.currentPlayer, user: this.currentUser, data: {
            action: "info", message: "both players have passed, ending phase",
            old_initiative: this.initiative,
          }
        }, this), backendSync)
        phaseData.new_phase = gamePhaseType.Cleanup
        this.executeAction(new GameAction(data, this), backendSync)
      }
    }
  }

  // get currentReinforcementSelection(): DeployActionState | undefined {
  //   return this.gameObsoleteState?.deploy
  // }

  cancelAction() {
    this.scenario.map.clearAllSelections()
    this.scenario.map.clearGhosts()
    this.closeOverlay = true
    this.gameState = undefined
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
