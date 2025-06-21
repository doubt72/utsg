import { Coordinate, Direction, featureType, Player } from "../utilities/commonTypes";
import { getAPI, postAPI } from "../utilities/network";
import Scenario, { ReinforcementItem, ReinforcementSchedule, ScenarioData } from "./Scenario";
import GameAction, {
  GameActionData, GameActionPath, GameActionPhaseChange, GameActionDiceResult, addActionType,
  AddActionType
} from "./GameAction";
import Feature from "./Feature";
import BaseAction from "./actions/BaseAction";
import IllegalActionError from "./actions/IllegalActionError";
import WarningActionError from "./actions/WarningActionError";
import Counter from "./Counter";
import { normalDir, rolld10, togglePlayer } from "../utilities/utilities";

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
  x: number, y: number, id: string, counter: Counter,
}

export type DeployActionState = {
  turn: number, index: number, needsDirection?: [number, number],
}

export type AddAction = {
  type: AddActionType, x: number, y: number, id?: string, parent_id?: string, cost: number,
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
  initiativePlayer: Player = 1;
  initiative: number = 0;
  alliedSniper?: Feature;
  axisSniper?: Feature;

  suppressNetwork: boolean = false;
  gameActionState?: GameActionState;

  closeReinforcementPanel: boolean = false;

  openOverlay?: { x: number, y: number }
  closeOverlay: boolean = false;

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

  get currentHelpSection(): string {
    return ""
  }

  findBySequence(sequence: number): BaseAction | false {
    for (const a of this.actions) {
      if (a.sequence === sequence) { return a }
    }
    return false
  }

  get lastAction(): BaseAction | undefined {
    if (this.lastActionIndex < 0) { return undefined }
    return this.actions[this.lastActionIndex]
  }

  get lastSignificatAction(): BaseAction | undefined {
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

  get opportunityFire(): boolean {
    // TODO: check last action
    return false
  }

  get reactionFire(): boolean {
    // TODO: check last action
    return false
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
      data: { action: "phase", phase_data: phaseData }
    }
    if (oldPhase == gamePhaseType.Deployment) {
      const [count, initialCount] = this.reinforcementsCount
      if (count === 0) {
        if (initialCount === 0) {
          this.executeAction(new GameAction({
            player: this.currentPlayer, user: this.currentUser, data: {
              action: "info", message: "no units to deploy, skipping phase"
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
          action: "info", message: "no broken units or jammed weapons, skipping phase"
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
          action: "deploy",
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

  startMove() {
    const selection = this.scenario.map.currentSelection[0]
    if (selection && selection.hex) {
      let facing = selection.unit.rotates ? selection.unit.facing : undefined
      const child = selection.unit.children[0]
      if (selection.unit.canHandle && child && child.crewed) { facing = child.facing }
      const loc = {
        x: selection.hex.x, y: selection.hex.y, facing,
        turret: selection.unit.turreted ? selection.unit.turretFacing : undefined,
      }
      const units = selection.children
      units.forEach(c => c.unit.select())
      let canSelect = selection.unit.canCarrySupport && (units.length < 1 || !units[0].unit.crewed)
      if (canSelect) {
        let check = false
        this.scenario.map.countersAt(new Coordinate(selection.hex.x, selection.hex.y)).forEach(c => {
          if (selection.unitIndex !== c.unitIndex && !c.unit.isFeature && c.unit.canCarrySupport &&
              (c.children.length < 1 || !c.children[0].unit.crewed)) {
            check = true
          }
        })
        canSelect = check
      }
      const allSelection = [{ x: loc.x, y: loc.y, id: selection.unit.id, counter: selection }]
      const initialSelection = [{ x: loc.x, y: loc.y, id: selection.unit.id, counter: selection }]
      units.forEach(u => {
        const hex = u.hex as Coordinate
        allSelection.push({ x: hex.x, y: hex.y, id: u.unit.id, counter: u })
        initialSelection.push({ x: hex.x, y: hex.y, id: u.unit.id, counter: u })
      })
      if (canSelect) {
        this.openOverlay = { x: selection.hex.x, y: selection.hex.y }
      }
      this.gameActionState = {
        player: this.currentPlayer,
        currentAction: actionType.Move,
        selection: allSelection,
        move: {
          initialSelection, doneSelect: !canSelect, path: [loc], addActions: [],
          rotatingTurret: false, placingSmoke: false, droppingMove: false, loadingMove: false,
        }
      }
    }
  }

  move(x: number, y: number) {
    if (!this.gameActionState?.move) { return }
    if (!this.gameActionState?.selection) { return }
    const selection = this.gameActionState.selection
    const move = this.gameActionState.move
    const target = selection[0].counter.unit
    const lastPath = this.lastPath as GameActionPath
    if (move.placingSmoke) {
      const id = `uf-${this.actions.length}-${move.addActions.length}`
      move.addActions.push({
        x, y, type: "smoke", cost: lastPath.x === x && lastPath.y === y ? 1 : 2, id
      })
      this.scenario.map.addGhost(
        new Coordinate(x, y),
        new Feature({ ft: 1, t: featureType.Smoke, n: "Smoke", i: "smoke", h: 0 })
      )
    } else {
      let facing = target.rotates ? lastPath.facing : undefined
      const child = target.children[0]
      if (target.canHandle && child && child.crewed) { facing = child.facing }
      move.path.push({
        x, y, facing, turret: target.turreted ? lastPath.turret : undefined
      })
      const vp = this.scenario.map.victoryAt(new Coordinate(x, y))
      if (vp && vp !== this.currentPlayer) {
        move.addActions.push({ x, y, type: addActionType.VP, cost: 0 })
      }
    }
    move.doneSelect = true
    this.closeOverlay = true
  }

  rotateToggle() {
    if (!this.gameActionState?.move) { return }
    this.gameActionState.move.rotatingTurret = !this.gameActionState.move.rotatingTurret
  }

  moveRotate(x: number, y: number, dir: Direction) {
    if (!this.gameActionState?.move) { return }
    const last = this.lastPath as GameActionPath
    if (this.gameActionState.move.rotatingTurret) {
      last.turret = dir
    } else {
      const lastDir = last.facing
      let turret = last.turret
      if (lastDir && turret) {
        turret = normalDir(turret + dir - lastDir)
      }
      this.gameActionState.move.path.push({
        x: x, y: y, facing: dir, turret,
      })
    }
  }

  placeSmokeToggle() {
    if (!this.gameActionState?.move) { return }
    this.gameActionState.move.placingSmoke = !this.gameActionState.move.placingSmoke
    this.gameActionState.move.loadingMove = false
    this.gameActionState.move.droppingMove = false
  }

  shortingMoveToggle() {
    if (!this.gameActionState?.move) { return }
    this.gameActionState.move.droppingMove = !this.gameActionState.move.droppingMove
    if (this.gameActionState.move.droppingMove) {
      const first = this.gameActionState.move.path[0]
      this.openOverlay = { x: first.x, y: first.y }
    }
    this.gameActionState.move.loadingMove = false
    this.gameActionState.move.placingSmoke = false
  }

  loadingMoveToggle() {
    if (!this.gameActionState?.move) { return }
    this.gameActionState.move.loadingMove = !this.gameActionState.move.loadingMove
    if (this.gameActionState.move.loadingMove) {
      if (this.needPickUpDisambiguate) {
        const first = this.gameActionState.move.path[0]
        this.openOverlay = { x: first.x, y: first.y }
      } else {
        const last = this.lastPath as GameActionPath
        this.openOverlay = { x: last.x, y: last.y }
      }
      const last = this.lastPath as GameActionPath
      this.openOverlay = { x: last.x, y: last.y }
    }
    this.gameActionState.move.droppingMove = false
    this.gameActionState.move.placingSmoke = false
  }

  get getLoader(): Counter[] {
    const action = this.gameActionState
    if (!action?.move) { return [] }
    const selection = action.selection
    if (!selection || !this.lastPath) { return [] }
    const rc: Counter[] = []
    const counters = this.scenario.map.countersAt(new Coordinate(this.lastPath.x, this.lastPath.y))
    for (const c of counters) {
      if (c.hasFeature || c.unit.selected) { continue }
      for (const s of selection) {
        const unit = s.counter.unit
        const target = c.unit
        if (unit.canCarry(target)) { rc.push(s.counter) }
      }
    }
    return rc
  }

  get needPickUpDisambiguate(): boolean {
    const action = this.gameActionState
    if (!action?.move) { return false }
    if (action.move.loader) { return false }
    return this.getLoader.length > 1
  }

  finishMove() {
    if (!this.gameActionState?.move) { return }
    const dice: GameActionDiceResult[] = []
    for (const a of this.gameActionState.move.addActions) {
      if (a.type === addActionType.Smoke) { dice.push({ result: rolld10() }) }
    }
    const move = new GameAction({
      user: this.currentUser,
      player: this.gameActionState.player,
      data: {
        action: "move",
        path: this.gameActionState.move.path,
        origin: this.gameActionState.selection.map(s => {
          return {
            x: s.x, y: s.y, id: s.counter.unit.id
          }
        }),
        add_action: this.gameActionState.move.addActions.map(a => {
          return {
            type: a.type, x: a.x, y: a.y, id: a.id, parent_id: a.parent_id,
          }
        }),
        dice_result: dice,
      }
    }, this, this.actions.length)
    this.executeAction(move, false)
    this.gameActionState = undefined
    this.scenario.map.clearGhosts()
    this.scenario.map.clearAllSelections()
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
}

