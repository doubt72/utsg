import { Coordinate, CounterSelectionTarget, Direction, featureType, hexOpenType } from "../../../utilities/commonTypes";
import { formatDieResult, passBlue, passGreen } from "../../../utilities/graphics";
import { normalDir, roll2d10, stackLimit } from "../../../utilities/utilities";
import Counter from "../../Counter";
import Feature from "../../Feature";
import Game from "../../Game";
import GameAction, { gameActionAddActionType, GameActionPath, GameActionUnit } from "../../GameAction";
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
  chooseRepair: boolean;
  chooseCrew: boolean;

  constructor(game: Game) {
    super(game, stateType.Assault, game.currentPlayer)
    const selection = game.scenario.map.selection as Counter
    const hex = selection.hex as Coordinate
    const loc = {
      x: hex.x, y: hex.y,
      facing: selection.unit.rotates ? selection.unit.facing : undefined ,
      turret: selection.unit.turreted ? selection.unit.turretFacing : undefined,
    }
    const units = selection.children
    units.forEach(c => this.map.select(c.unit))
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
    this.selection = [{
      x: loc.x, y: loc.y, id: selection.unit.id, name: selection.unit.name, counter: selection
    }]
    this.initialSelection = [{
      x: loc.x, y: loc.y, id: selection.unit.id, name: selection.unit.name, counter: selection
    }]
    units.forEach(u => {
      const hex = u.hex as Coordinate
      this.selection.push({
        x: hex.x, y: hex.y, id: u.unit.id, name: u.unit.name, counter: u
      })
      this.initialSelection.push({
        x: hex.x, y: hex.y, id: u.unit.id, name: u.unit.name, counter: u
      })
    })
    this.path = [loc]
    this.game.actionPathLength = 1
    this.addActions = []
    this.doneSelect = !canSelect
    if (canSelect) {
      game.openOverlay = game.scenario.map.hexAt(hex)
    }
    this.chooseRepair = false;
    this.chooseCrew = false;
    game.refreshCallback(game)
  }

  get lastPath() { return this.path[this.path.length - 1] }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  openHex(x: number, y: number) {
    const from = new Coordinate(this.lastPath.x, this.lastPath.y)
    const to = new Coordinate(x, y)
    if (from.x === to.x && from.y === to.y) {return hexOpenType.Closed }

    const hexFrom = this.map.hexAt(from) as Hex;
    const hexTo = this.map.hexAt(to) as Hex;
    const dir = this.map.relativeDirection(from, to)
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
    const countersAt = this.map.countersAt(to)
    for (const c of countersAt) {
      if (c.hasFeature && c.feature.type === featureType.Fire) { return hexOpenType.Closed }
    }
    if (selection.unit.isVehicle) {
      if ((!terrTo.vehicle || !terrFrom.vehicle) && !roadMove) { return hexOpenType.Closed }
      if ((terrTo.vehicle === "amph") && !roadMove && !selection.unit.amphibious) { return hexOpenType.Closed }
      for (const c of countersAt) {
        if (c.hasUnit && selection.unit.playerNation !== c.unit.playerNation && !c.unit.isWreck &&
            !c.unit.operated) {
          return hexOpenType.Closed
        }
        if (c.hasFeature && c.feature.type === featureType.Mines && c.feature.antiTank) {
          return hexOpenType.Closed
        }
      }
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
    const toSize = this.map.sizeAt(to)
    let check = false
    for (const c of countersAt) {
      if (c.hasUnit && selection.unit.playerNation !== c.unit.playerNation && !c.unit.isWreck &&
          !c.unit.operated) { check = true }
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

  select(selection: CounterSelectionTarget, callback: (refresh?: boolean) => void) {
    if (selection.target.type === "reinforcement") { return }
    const x = selection.target.xy.x
    const y = selection.target.xy.y
    const id = selection.counter.target.id
    const counter = this.map.unitAtId(new Coordinate(x, y), id) as Counter
    if (this.chooseRepair) {
      this.map.loadedSelect(counter.unit)
      this.selectRepair(id)
    } else if (this.chooseCrew) {
      this.map.loadedSelect(counter.unit)
      this.selectCrew(id, counter.unit.name)
    } else {
      const selected = counter.unit.selected
      this.map.select(counter.unit)
      counter.children.forEach(c => this.map.select(c.unit))
      if (selected) {
        removeStateSelection(this.game, x, y, counter.unit.id)
      } else {
        this.selection?.push({
          x, y, id: counter.unit.id, name: counter.unit.name, counter: counter,
        })
        this.selection.sort((a, b) => {
          if (a.counter.unitIndex === b.counter.unitIndex) { return 0 }
          return a.counter.unitIndex > b.counter.unitIndex ? 1 : -1
        })
      }
    }
    callback(true)
  }

  selectable(selection: CounterSelectionTarget): boolean {
    const target = selection.counter.unit as Unit
    const same = this.samePlayer(target)
    if (!same) {return false}
    if (this.chooseRepair) {
      if (target.isVehicle && target.isImmobilized && !target.isActivated && !target.isExhausted) {
        return true
      }
      this.game.addMessage("vehicle can't currently be repaired")
      return false
    }
    if (this.chooseCrew) {
      if (target.isVehicle && target.isAbandoned) {
        return true
      }
      this.game.addMessage("vehicle can't be manned")
      return false
    }
    if (this.doneSelect) { return false }
    if (selection.target.type !== "map") { return false }
    for (const s of this.initialSelection) {
      if (s.x !== selection.target.xy.x || s.y !== selection.target.xy.y) {
        this.game.addMessage("all units assaulting together must start in same hex")
        return false
      }
      if (selection.counter.target.id === s.id) { return false }
    }
    const counter = this.map.unitAtId(selection.target.xy, selection.counter.target.id) as Counter
    if (!this.canBeMultiselected(counter)) { return false }
    return true
  }

  get activeCounters(): Counter[] {
    const first = this.path[0]
    return this.map.countersAt(new Coordinate(first.x, first.y))
  }

  move(x: number, y: number) {
    const target = this.selection[0].counter.unit
    const path = this.path[0]
    const map = this.game.scenario.map
    const old = new Coordinate(path.x, path.y)
    const loc = new Coordinate(x, y)
    const facing = this.map.relativeDirection(old, loc) ?? 1
    this.path.push({
      x, y, facing, turret: target.turreted ?
        normalDir(target.turretFacing - this.selection[0].counter.unit.facing + facing) : undefined
    })
    const vp = this.map.victoryAt(loc)
    if (vp && vp !== this.game.currentPlayer && !map.enemyAt(loc, this.game.currentPlayer) &&
        this.selection.filter(u => !u.counter.unit.operated && !u.counter.unit.leader).length > 0) {
      this.addActions.push({x, y, type: gameActionAddActionType.VP, cost: 0, index: 0 })
    }
    const vp2 = this.map.victoryAt(old)
    if (vp2 && vp2 === this.game.currentPlayer && map.enemyAt(old, this.game.currentPlayer)) {
      let any = false
      for (const c of map.countersAt(old)) {
        if (c.hasUnit && !c.unit.operated && c.unit.playerNation === this.game.currentPlayerNation) {
          let check = false
          for (const s of this.selection) {
            if (s.counter.unit.id === c.unit.id) { check = true; break }
          }
          if (!check) { any = true; break }
        }
      }
      if (!any) {
        this.addActions.push({ x: path.x, y: path.y, type: gameActionAddActionType.VP, cost: 0, index: 0 })
      }
    }
    this.doneSelect = true
    this.game.closeOverlay = true
    this.game.actionPathLength = this.path.length
  }

  rotate(dir: Direction) {
    const last = this.lastPath as GameActionPath
    last.turret = dir
  }

  clear() {
    const x = this.selection[0].x
    const y = this.selection[0].y
    const f = this.map.countersAt(new Coordinate(x, y)).filter(c => c.hasFeature)[0]
    this.addActions.push({
      x, y, type: gameActionAddActionType.Clear, cost: 0, id: f.feature.id, name: f.feature.name, index: 0
    })
    this.map.targetSelect(f.feature)
    this.doneSelect = true
    this.game.closeOverlay = true
  }

  entrench() {
    const x = this.selection[0].x
    const y = this.selection[0].y
    const loc = new Coordinate(x, y)
    const counters = this.map.countersAt(loc)
    const ck = counters[0].hasFeature
    this.map.unshiftGhost(loc, new Feature({
      id: "scrape-ghost", ft: 1, n: ck ? "Foxhole" : "Shell Scrape",
      t: "foxhole", i: "foxhole", d: ck ? 2 : 1,
    }))
    this.addActions.push({
      x, y, type: gameActionAddActionType.Entrench, cost: 0, index: ck ? 1 : 0,
      id: `scrap-${loc.x}-${loc.y}`
    })
    this.doneSelect = true
    this.game.closeOverlay = true
  }

  abandon() {
    const x = this.selection[0].x
    const y = this.selection[0].y
    this.addActions.push({
      x, y, type: gameActionAddActionType.Abandon, cost: 0, index: 0,
      id: `uf-${this.game.actions.length + 1}`
    })
    this.doneSelect = true
    this.game.closeOverlay = true
  }

  repair() {
    const x = this.selection[0].x
    const y = this.selection[0].y
    const loc = new Coordinate(x, y)
    const counters = this.map.countersAt(loc)
    let id = ""
    for (const c of counters) {
      const unit = c.unit as Unit
      if (c.hasUnit && unit.isVehicle && unit.isImmobilized && !unit.isActivated &&
          !unit.isExhausted && unit.playerNation === this.selection[0].counter.unit.playerNation) {
        if (id === "") {
          id = unit.id
        } else {
          this.chooseRepair = true
          this.game.openOverlay = this.game.scenario.map.hexAt(loc)
          return
        }
      }
    }
    this.addActions.push({
      x, y, type: gameActionAddActionType.Repair, cost: 0, index: 0, id
    })
    this.doneSelect = true
    this.game.closeOverlay = true
  }

  crew() {
    const x = this.selection[0].x
    const y = this.selection[0].y
    const loc = new Coordinate(x, y)
    const counters = this.map.countersAt(loc)
    let id = ""
    let name = ""
    for (const c of counters) {
      const unit = c.unit as Unit
      if (c.hasUnit && unit.isVehicle && unit.isAbandoned &&
          unit.playerNation === this.selection[0].counter.unit.playerNation) {
        if (id === "") {
          id = unit.id
          name = unit.name
        } else {
          this.chooseCrew = true
          this.game.openOverlay = this.game.scenario.map.hexAt(loc)
          return
        }
      }
    }
    this.addActions.push({
      x, y, type: gameActionAddActionType.Crew, cost: 0, index: 0, id, name
    })
    this.doneSelect = true
    this.game.closeOverlay = true
  }

  selectRepair(id: string) {
    const x = this.selection[0].x
    const y = this.selection[0].y
    this.addActions.push({
      x, y, type: gameActionAddActionType.Repair, cost: 0, index: 0, id
    })
    this.doneSelect = true
    this.game.closeOverlay = true
  }

  selectCrew(id: string, name: string) {
    const x = this.selection[0].x
    const y = this.selection[0].y
    this.addActions.push({
      x, y, type: gameActionAddActionType.Crew, cost: 0, index: 0, id, name
    })
    this.doneSelect = true
    this.game.closeOverlay = true
  }

  finish() {
    const dice = []
    if (this.addActions.length > 0 && this.addActions[0].type === gameActionAddActionType.Repair) {
      const loc = new Coordinate(this.path[0].x, this.path[0].y)
      const counter = this.map.unitAtId(loc, this.addActions[0].id as string) as Counter
      const result = roll2d10()
      dice.push({
        result,
        description: `target ${10 + counter.unit.size}, rolled ${formatDieResult(result)}: ${
          result.result >= 10 + counter.unit.size ?
            `<span style="color: ${passGreen()};">repaired</span>` :
            `<span style="color: ${passBlue()};">no effect</span>`
        }`
      })
    }
    const target: GameActionUnit[] = []
    if (this.path.length > 1) {
      const loc = new Coordinate(this.path[1].x, this.path[1].y)
      const counters = this.map.countersAt(loc)
      for (const c of counters) {
        if (c.hasUnit && c.unit.isAbandoned &&
            c.unit.playerNation !== this.selection[0].counter.unit.playerNation) {
          target.push({
            x: loc.x, y: loc.y, id: c.unit.id, name: c.unit.name, status: c.unit.status,
            immobilized: c.unit.isImmobilized, turret: c.unit.turretJammed,
            weapon_jammed: c.unit.jammed, weapon_broken: c.unit.weaponDestroyed,
            sponson_jammed: c.unit.sponsonJammed, sponson_broken: c.unit.sponsonDestroyed,
          })
        }
      }
    }
    const action = new GameAction({
      user: this.game.currentUser,
      player: this.player,
      data: {
        action: "assault_move", old_initiative: this.game.initiative,
        path: this.path,
        origin: this.selection.map(s => {
          return {
            x: s.x, y: s.y, id: s.counter.unit.id, name: s.counter.unit.name,
            status: s.counter.unit.status
          }
        }),
        target,
        add_action: this.addActions.map(a => {
          return {
            type: a.type, x: a.x, y: a.y, id: a.id, name: a.name, index: a.index
          }
        }),
        dice_result: dice
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
    if (next && next.unit.crewed) {
      this.game.addMessage("unit manning a crewed weapon cannot assault with other infantry")
      return false
    }
    if (next && next.unit.uncrewedSW && counter.unit.encumberedMovement(false) < 1) {
      this.game.addMessage("cannot assault with a unit that has zero movement")
      return false
    }
    if (counter.parent) {
      this.game.addMessage("unit being transported cannot assault with other infantry")
      return false
    }
    if (counter.unit.isBroken) {
      this.game.addMessage("cannot assault with a broken unit")
      return false
    }
    if (counter.unit.isExhausted) {
      this.game.addMessage("cannot assault with an exhausted unit")
      return false
    }
    if (counter.unit.isActivated) {
      this.game.addMessage("cannot assault with an activated unit")
      return false
    }
    return true
  }
}
