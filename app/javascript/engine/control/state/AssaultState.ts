import { Coordinate, CounterSelectionTarget, Direction, hexOpenType } from "../../../utilities/commonTypes";
import { normalDir, stackLimit } from "../../../utilities/utilities";
import Counter from "../../Counter";
import Feature from "../../Feature";
import Game from "../../Game";
import GameAction, { gameActionAddActionType, GameActionPath } from "../../GameAction";
import Hex from "../../Hex";
import Unit from "../../Unit";
import { assaultMovement } from "../assault";
import { alongRailroad, alongRoad } from "../movement";
import { removeStateSelection } from "../select";
import BaseState, { StateAddAction, StateSelection, stateType } from "./BaseState";

export default class AssaultState extends BaseState {
  initialSelection: StateSelection[];
  addActions: StateAddAction[];
  path: GameActionPath[];

  doneSelect: boolean;

  constructor(game: Game) {
    super(game, stateType.Assault, game.currentPlayer)
    const selection = game.scenario.map.currentSelection[0]
    const hex = selection.hex as Coordinate
    const loc = {
      x: hex.x, y: hex.y,
      facing: selection.unit.rotates ? selection.unit.facing : undefined ,
      turret: selection.unit.turreted ? selection.unit.turretFacing : undefined,
    }
    const units = selection.children
    units.forEach(c => c.unit.select())
    let canSelect = selection.unit.canCarrySupport
    if (canSelect) {
      let check = false
      game.scenario.map.countersAt(hex).forEach(c => {
        if (selection.unitIndex !== c.unitIndex && !c.unit.isFeature && c.unit.canCarrySupport &&
            (c.children.length < 1 || !c.children[0].unit.crewed)) {
          check = true
        }
      })
      canSelect = check
    }
    this.selection = [{ x: loc.x, y: loc.y, id: selection.unit.id, counter: selection }]
    this.initialSelection = [{ x: loc.x, y: loc.y, id: selection.unit.id, counter: selection }]
    units.forEach(u => {
      const hex = u.hex as Coordinate
      this.selection.push({ x: hex.x, y: hex.y, id: u.unit.id, counter: u })
      this.initialSelection.push({ x: hex.x, y: hex.y, id: u.unit.id, counter: u })
    })
    this.path = [loc]
    this.addActions = []
    this.doneSelect = !canSelect
    if (canSelect) {
      game.openOverlay = game.scenario.map.hexAt(hex)
    }
    game.refreshCallback(game)
  }

  get lastPath() { return this.path[this.path.length - 1] }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  openHex(x: number, y: number) {
    // return openHexAssaulting(map, new Coordinate(lastPath.x, lastPath.y), new Coordinate(x, y))
    const map = this.game.scenario.map
    const from = new Coordinate(this.lastPath.x, this.lastPath.y)
    const to = new Coordinate(x, y)
    if (from.x === to.x && from.y === to.y) {return hexOpenType.Closed }

    const hexFrom = map.hexAt(from) as Hex;
    const hexTo = map.hexAt(to) as Hex;
    const dir = map.relativeDirection(from, to)
    if (!dir) { return hexOpenType.Closed }

    const selection = this.selection[0].counter
    const terrFrom = hexFrom.terrain
    const terrTo = hexTo.terrain
    const roadMove = alongRoad(hexFrom, hexTo, dir)
    const railroadMove = alongRailroad(hexFrom, hexTo, dir)

    if (!terrTo.move && !roadMove && !railroadMove) { return hexOpenType.Closed }
    if (!terrTo.move && railroadMove) {
      if (selection.unit.isVehicle) { return hexOpenType.Closed }
    }
    if (selection.unit.isVehicle) {
      if ((!terrTo.vehicle || !terrFrom.vehicle) && !roadMove) { return hexOpenType.Closed }
      if ((terrTo.vehicle === "amph") && !roadMove && !selection.unit.amphibious) { return hexOpenType.Closed }
    }
    if (hexFrom.border && hexFrom.borderEdges?.includes(dir)) {
      if (!terrFrom.borderMove) { return hexOpenType.Closed }
      if (selection.unit.isVehicle && !terrFrom.borderVehicle) {
        return hexOpenType.Closed
      }
    }
    if (hexTo.border && hexTo.borderEdges?.includes(normalDir(dir+3))) {
      if (!terrTo.borderMove) { return hexOpenType.Closed }
      if (selection.unit.isVehicle && !terrTo.borderVehicle) {
        return hexOpenType.Closed
      }
    }

    const moveSize = this.selection.filter(u => !u.counter.unit.parent).reduce(
      (sum, u) => sum + u.counter.unit.size + u.counter.unit.children.reduce((sum, u) => u.size, 0), 0
    )
    const toSize = map.sizeAt(to)
    const countersAt = map.countersAt(to)
    let check = false
    for (const c of countersAt) {
      if (c.hasUnit && selection.unit.playerNation !== c.unit.playerNation) { check = true }
    }
    if (moveSize + toSize > stackLimit && !check) { return hexOpenType.Closed }
    if (this.path.length + this.addActions.length > 1) { return hexOpenType.Closed }
    if (assaultMovement(this.game) === 0) { return hexOpenType.Closed }
    return hexOpenType.All
  }

  get rotateOpen(): boolean {
    const counter = this.selection[0].counter
    if (this.path.length > 1) {
      if (counter.unit.turreted && !counter.unit.turretJammed) { return true }
    }
    return false
  }

  get rotatePossible(): boolean {
    const counter = this.selection[0].counter
    if (this.path.length > 1) {
      if (counter.unit.turreted && !counter.unit.turretJammed) { return true }
    }
    return false
  }

  select(selection: CounterSelectionTarget, callback: () => void) {
    if (selection.target.type === "reinforcement") { return }
    const x = selection.target.xy.x
    const y = selection.target.xy.y
    const id = selection.counter.target.id
    const counter = this.game.scenario.map.unitAtId(new Coordinate(x, y), id) as Counter
    const selected = counter.unit.selected
    counter.unit.select()
    counter.children.forEach(c => c.unit.select())
    if (selected) {
      removeStateSelection(this.game, x, y, counter.unit.id)
    } else {
      this.selection?.push({
        x, y, id: counter.unit.id, counter: counter,
      })
      this.selection.sort((a, b) => {
        if (a.counter.unitIndex === b.counter.unitIndex) { return 0 }
        return a.counter.unitIndex > b.counter.unitIndex ? 1 : -1
      })
    }
    callback()
  }

  selectable(selection: CounterSelectionTarget): boolean {
    const target = selection.counter.unit as Unit
    const same = this.samePlayer(target)
    const map = this.game.scenario.map
    if (!same) {return false}
    if (this.doneSelect) { return false }
    if (selection.target.type !== "map") { return false }
    for (const s of this.initialSelection) {
      if (s.x !== selection.target.xy.x || s.y !== selection.target.xy.y) {
        this.game.addMessage("all units assaulting together must start in same hex")
        return false
      }
      if (selection.counter.target.id === s.id) { return false }
    }
    const counter = map.unitAtId(selection.target.xy, selection.counter.target.id) as Counter
    if (!this.canBeMultiselected(counter)) { return false }
    return true
  }

  get activeCounters(): Counter[] {
    if (!this.doneSelect) {
      const first = this.path[0]
      return this.game.scenario.map.countersAt(new Coordinate(first.x, first.y))
    }
    return []
  }

  move(x: number, y: number) {
    const map = this.game.scenario.map
    const target = this.selection[0].counter.unit
    const path = this.path[0]
    const facing = map.relativeDirection(
      new Coordinate(path.x, path.y), new Coordinate(x, y)) ?? 1
    this.path.push({
      x, y, facing, turret: target.turreted ?
        normalDir(target.turretFacing - this.selection[0].counter.unit.facing + facing) : undefined
    })
    const vp = map.victoryAt(new Coordinate(x, y))
    if (vp && vp !== this.game.currentPlayer) {
      this.addActions.push({ x, y, type: gameActionAddActionType.VP, cost: 0, index: 0 })
    }
    this.doneSelect = true
    this.game.closeOverlay = true
  }

  rotate(dir: Direction) {
    const last = this.lastPath as GameActionPath
    last.turret = dir
  }

  clear() {
    const x = this.selection[0].x
    const y = this.selection[0].y
    const f = this.game.scenario.map.countersAt(new Coordinate(x, y)).filter(c => c.hasFeature)[0]
    this.addActions.push({ x, y, type: gameActionAddActionType.Clear, cost: 0, id: f.feature.id, index: 0 })
    this.game.closeOverlay = true
  }

  entrench() {
    const x = this.selection[0].x
    const y = this.selection[0].y
    this.game.scenario.map.unshiftGhost(new Coordinate(x, y), new Feature({
      ft: 1, n: "Shell Scrape", t: "foxhole", i: "foxhole", d: 1,
    }))
    this.addActions.push({ x, y, type: gameActionAddActionType.Entrench, cost: 0, index: 0 })
    this.game.closeOverlay = true
  }

  finish() {
    const action = new GameAction({
      user: this.game.currentUser,
      player: this.player,
      data: {
        action: "assault_move", old_initiative: this.game.initiative,
        path: this.path,
        origin: this.selection.map(s => {
          return { x: s.x, y: s.y, id: s.counter.unit.id, status: s.counter.unit.status }
        }),
        add_action: this.addActions.map(a => {
          return { type: a.type, x: a.x, y: a.y, id: a.id, index: a.index }
        }),
      }
    }, this.game)
    this.execute(action)
  }

  canBeMultiselected(counter: Counter): boolean {
    if (!counter.unit.canCarrySupport) {
      this.game.addMessage("only infantry units and leaders can assault together")
      return false
    }
    const next = counter.children[0]
    if (next && next?.unit.crewed) {
      this.game.addMessage("unit manning a crewed weapon cannot assault with other infantry")
      return false
    }
    if (counter.parent) {
      this.game.addMessage("unit being transported cannot assault with other infantry")
      return false
    }
    if (counter.unit.isBroken) {
      this.game.addMessage("cannot assault with a broken unit")
    }
    if (counter.unit.isExhausted) {
      this.game.addMessage("cannot assault with an exhausted unit")
    }
    if (counter.unit.isActivated) {
      this.game.addMessage("cannot assault with an activated unit")
    }
    return true
  }
}
