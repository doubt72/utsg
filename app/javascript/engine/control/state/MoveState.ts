import { Coordinate, CounterSelectionTarget, Direction, featureType, hexOpenType } from "../../../utilities/commonTypes";
import { normalDir, roll2d10, rolld10, stackLimit } from "../../../utilities/utilities";
import Counter from "../../Counter";
import Feature from "../../Feature";
import Game from "../../Game";
import GameAction, { gameActionAddActionType, GameActionDiceResult, GameActionPath } from "../../GameAction";
import Hex from "../../Hex";
import Map from "../../Map";
import Unit from "../../Unit";
import { alongRailroad, alongRoad, canBeLoaded, canLoadUnit, mapSelectMovement, movementCost, movementPastCost, smokeOpenHex } from "../movement";
import { removeStateSelection, samePlayer } from "../select";
import BaseState, { StateAddAction, StateSelection, stateType } from "./BaseState";

export default class MoveState extends BaseState {
  initialSelection: StateSelection[]
  addActions: StateAddAction[];

  path: GameActionPath[];

  loader?: Counter;

  doneSelect: boolean;
  rotatingTurret: boolean;
  smoke: boolean;
  dropping: boolean;
  loading: boolean;

  constructor(game: Game) {
    super(game, stateType.Move, game.currentPlayer)

    const selection = game.scenario.map.currentSelection[0]

    let facing = selection.unit.rotates ? selection.unit.facing : undefined
    const child = selection.unit.children[0]
    if (selection.unit.canHandle && child && child.crewed) { facing = child.facing }
    const hex = selection.hex as Coordinate
    const loc = {
      x: hex.x, y: hex.y, facing,
      turret: selection.unit.turreted ? selection.unit.turretFacing : undefined,
    }
    const units = selection.children
    units.forEach(c => c.unit.select())
    let canSelect = selection.unit.canCarrySupport && (units.length < 1 || !units[0].unit.crewed)
    if (canSelect) {
      let check = false
      game.scenario.map.countersAt(new Coordinate(hex.x, hex.y)).forEach(c => {
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
    this.selection = allSelection
    this.initialSelection = initialSelection
    this.addActions = []
    this.path = [loc]

    this.doneSelect = !canSelect
    this.rotatingTurret = false
    this.smoke = false
    this.dropping = false
    this.loading = false
    if (canSelect) {
      game.openOverlay = game.scenario.map.hexAt(hex)
    }
  }

  get lastPath() { return this.path[this.path.length - 1] }

  openHex(x: number, y: number) {
    const map = this.game.scenario.map
    const from = new Coordinate(this.lastPath.x, this.lastPath.y)
    const to = new Coordinate(x, y)
    if (this.dropping) { return hexOpenType.Closed }
    if (this.loading) { return hexOpenType.Closed }
    const selection = this.selection[0].counter
    if (this.smoke) { return smokeOpenHex(map, from, to, selection.unit) }
    if (from.x === to.x && from.y === to.y) { return hexOpenType.Closed }
    const hexFrom = map.hexAt(from) as Hex;
    const hexTo = map.hexAt(to) as Hex;
    const terrFrom = hexFrom.terrain
    const terrTo = hexTo.terrain
    const dir = map.relativeDirection(from, to)
    if (!dir) { return hexOpenType.Closed }
    const roadMove = alongRoad(hexFrom, hexTo, dir)
    const railroadMove = alongRailroad(hexFrom, hexTo, dir)
    if (!terrTo.move && !roadMove && !railroadMove) { return hexOpenType.Closed }
    const next = selection.children[0]
    if (!terrTo.move && railroadMove) {
      if (selection.unit.isVehicle) { return hexOpenType.Closed }
      if (next && next.unit.crewed) { return hexOpenType.Closed }
    }
  
    const moveSize = this.selection.filter(u => !u.counter.unit.parent).reduce(
      (sum, u) => sum + u.counter.unit.size + u.counter.unit.children.reduce((sum, u) => u.size, 0), 0
    )
    const toSize = map.sizeAt(to)
    const countersAt = map.countersAt(to)
    if (moveSize + toSize > stackLimit) { return hexOpenType.Closed }
    for (const c of countersAt) {
      if (c.hasUnit && selection.unit.playerNation !== c.unit.playerNation) { return hexOpenType.Closed }
    }
  
    if (selection.unit.isVehicle) {
      if (!terrTo.vehicle && !roadMove) { return hexOpenType.Closed }
      if (terrTo.vehicle === "amph" && !roadMove && !selection.unit.amphibious) { return hexOpenType.Closed }
    }
    const facing = this.lastPath?.facing as Direction
    if (next && next.unit.crewed) {
      if (!terrTo.gun && !roadMove) { return hexOpenType.Closed }
      if (terrTo.gun === "back" && dir !== normalDir(facing + 3)) { return hexOpenType.Closed }
    }
    if (hexFrom.border && hexFrom.borderEdges?.includes(dir)) {
      if (!terrFrom.borderMove) { return hexOpenType.Closed }
      if (selection.unit.isVehicle && !terrFrom.borderVehicle) {
        return hexOpenType.Closed
      }
      if (next && next.unit.crewed && !terrFrom.borderGun) { return hexOpenType.Closed }
    }
    if (hexTo.border && hexTo.borderEdges?.includes(normalDir(dir+3))) {
      if (!terrTo.borderMove) { return hexOpenType.Closed }
      if (selection.unit.isVehicle && !terrTo.borderVehicle) {
        return hexOpenType.Closed
      }
      if (next && next.unit.crewed && !terrTo.borderGun) { return hexOpenType.Closed }
    }
    if (selection.unit.canHandle && (next && next.unit.crewed)) {
      if (this.addActions.filter(a => a.id === next.unit.id).length < 1) {
        if (normalDir(dir + 3) !== facing && dir !== facing) { return hexOpenType.Closed }
      }
    }
    if (selection.unit.rotates) {
      if (normalDir(dir + 3) !== facing && dir !== facing) { return hexOpenType.Closed }
    }
  
    const length = this.path.length + this.addActions.length
    const cost = movementCost(map, from, to, selection.unit)
    const pastCost = movementPastCost(map, selection.unit)
    const move = mapSelectMovement(this.game, roadMove)
    if (move === 0) { return false }
    if (move < cost + pastCost && length > 1) { return false }
    for (const p of this.path) {
      if (to.x === p.x && to.y === p.y ) { return hexOpenType.Open }
    }
    return move >= cost + pastCost ? cost : hexOpenType.All
  }

  get rotateOpen(): boolean {
    const counter = this.selection[0].counter
    const child = counter.unit.children[0]
    if (!counter.unit.rotates && !(child && child.rotates)) { return false }
    if (counter.unit.canHandle && child && child.crewed) {
      for (const a of this.addActions) {
        if (a.type === gameActionAddActionType.Drop && a.id === child.id) { return false }
      }
    }
    return true
  }

  get rotatePossible(): boolean {
    const map = this.game.scenario.map
    const counter = this.selection[0].counter
    const loc = counter.hex as Coordinate
    const cost = movementCost(map, loc, loc, counter.unit) + movementPastCost(map, counter.unit)
    const length = this.path.length
    const move = mapSelectMovement(this.game, true)
    return move >= cost || length === 1
  }
  
  select( map: Map, selection: CounterSelectionTarget, callback: () => void) {
    if (selection.target.type === "reinforcement") { return }
    const x = selection.target.xy.x
    const y = selection.target.xy.y
    const id = selection.counter.target.id
    const counter = map.unitAtId(new Coordinate(x, y), id) as Counter
    const selected = counter.unit.selected
    counter.unit.select()
    const xx = this.lastPath?.x ?? 0 // But should always exist, type notwithstanding
    const yy = this.lastPath?.y ?? 0
    if (this.dropping) {
      counter.unit.dropSelect()
      const cost = counter.parent ? 1 : 0
      const facing = counter.unit.crewed ? this.lastPath?.facing : undefined
      this.addActions.push(
        {
          x: xx, y: yy, cost, type: gameActionAddActionType.Drop, id: counter.unit.id,
          parent_id: counter.unit.parent?.id, status: counter.unit.status,
          facing: facing && counter.unit.parent?.rotates && counter.unit.crewed ? normalDir(facing + 3) : facing,
          index: this.path.length,
        }
      )
      if (xx !== x || yy !== y) {
        map.addGhost(new Coordinate(xx, yy), counter.unit.clone() as Unit)
      }
      if (counter.children.length === 1) {
        const child = counter.children[0]
        child.unit.select()
        child.unit.dropSelect()
        map.addGhost(new Coordinate(xx, yy), child.unit.clone() as Unit)
      }
      this.doneSelect = true
      this.game.closeOverlay = true
    } else if (this.loading) {
      if (this.needPickUpDisambiguate) {
        counter.unit.loaderSelect()
        this.loader = counter
      } else {
        counter.unit.select()
        counter.unit.loadedSelect()
        let load = this.loader
        if (!load) { load = this.getLoader[0] }
        load.unit.select()
        load.unit.loaderSelect()
        this.loader = undefined
        this.loading = false
        this.doneSelect = true
        this.game.closeOverlay = true
        let cost = 1
        if (load?.unit.canCarrySupport) {
          if (counter.unit.crewed) {
            cost = load.unit.baseMovement + 1
          } else {
            cost = 1 - counter.unit.baseMovement
          }
        }
        const facing = counter.unit.rotates ? counter.unit.facing : undefined
        this.addActions.push({
          x: xx, y: yy, cost, type: gameActionAddActionType.Load, id: counter.unit.id, parent_id: load?.unit.id,
          facing, status: counter.unit.status, index: this.path.length,
        })
      }
    } else {
      counter.children.forEach(c => c.unit.select())
      if (selected) {
        removeStateSelection(this.game, x, y, counter.unit.id)
        counter.children.forEach(c => removeStateSelection(this.game, x, y, c.unit.id))
      } else {
        const sel = this.selection
        sel.push({ x, y, id: counter.unit.id, counter: counter })
        counter.children.forEach(c => sel.push({ x, y, id: c.unit.id, counter: c }))
        this.selection.sort((a, b) => {
          if (a.counter.unitIndex === b.counter.unitIndex) { return 0 }
          return a.counter.unitIndex > b.counter.unitIndex ? 1 : -1
        })
      }
    }
    callback()
  }

  selectable(selection: CounterSelectionTarget): boolean {
    const target = selection.counter.unit as Unit
    const same = samePlayer(this.game, target)
    if (!same) {return false}
    if (this.dropping) {
      const child = target.children[0]
      if (target.selected) {
        if (child && this.selection.length === 2) {
          this.game.addMessage("must select unit being carried")
          return false
        } else {
          return true
        }
      } else {
        this.game.addMessage("must select unit that started move")
        return false
      }
    }
    if (this.loading) {   
      if (this.needPickUpDisambiguate) {
        if (!target.selected) {
          this.game.addMessage("must select unit that started move or hasn't already been dropped")
          return false
        }
        if (canLoadUnit(this.game, target)) {
          return true
        } else {
          this.game.addMessage("can't carry/load any available units")
          return false
        }
      } else {
        if (target.selected || target.loaderSelected) {
          this.game.addMessage("unit is already selected")
          return false
        }
        if (canBeLoaded(this.game, target)) {
          return true
        } else {
          this.game.addMessage("can't be carried/loaded onto selected unit")
          return false
        }
      }
    }
    if (this.doneSelect) { return false }
    if (selection.target.type !== "map") { return false }
    for (const s of this.initialSelection) {
      if (s.x !== selection.target.xy.x || s.y !== selection.target.xy.y) {
        this.game.addMessage("all units moving together must start in same hex")
        return false
      }
      if (selection.counter.target.id === s.id) { return false }
    }
    const counter = this.game.scenario.map.unitAtId(
      selection.target.xy, selection.counter.target.id
    ) as Counter
    if (!this.canBeMultiselected(counter)) { return false }
    return true
  }

  get activeCounters(): Counter[] {
    const map = this.game.scenario.map
    if (!this.doneSelect || this.dropping ||
        (this.loading && this.needPickUpDisambiguate)) {
      const first = this.path[0]
      return map.countersAt(new Coordinate(first.x, first.y))
    }
    if (this.loading && !this.needPickUpDisambiguate) {
      const last = this.lastPath as GameActionPath
      return map.countersAt(new Coordinate(last.x, last.y))
    }
    return []
  }
  
  move(x: number, y: number) {
    const target = this.selection[0].counter.unit
    const lastPath = this.lastPath as GameActionPath
    const map = this.game.scenario.map
    if (this.smoke) {
      const id = `uf-${this.game.actions.length}-${this.addActions.length}`
      this.addActions.push({
        x, y, type: "smoke", cost: lastPath.x === x && lastPath.y === y ? 1 : 2, id,
        index: this.path.length
      })
      map.addGhost(
        new Coordinate(x, y),
        new Feature({ ft: 1, t: featureType.Smoke, n: "Smoke", i: "smoke", h: 0 })
      )
    } else {
      let facing = target.rotates ? lastPath.facing : undefined
      const child = target.children[0]
      if (target.canHandle && child && child.crewed) { facing = child.facing }
      this.path.push({
        x, y, facing, turret: target.turreted ? lastPath.turret : undefined
      })
      const vp = map.victoryAt(new Coordinate(x, y))
      if (vp && vp !== this.game.currentPlayer) {
        this.addActions.push({ x, y, type: gameActionAddActionType.VP, cost: 0,
        index: this.path.length })
      }
    }
    this.doneSelect = true
    this.game.closeOverlay = true
  }
  
  rotateToggle() {
    this.rotatingTurret = !this.rotatingTurret
  }
  
  rotate(dir: Direction) {
    const last = this.lastPath as GameActionPath
    if (this.rotatingTurret) {
      last.turret = dir
    } else {
      const lastDir = last.facing
      let turret = last.turret
      if (lastDir && turret) {
        turret = normalDir(turret + dir - lastDir)
      }
      this.path.push({
        x: last.x, y: last.y, facing: dir, turret,
      })
    }
  }
  
  smokeToggle() {
    this.smoke = !this.smoke
    this.loading = false
    this.dropping = false
  }
  
  dropToggle() {
    this.dropping = !this.dropping
    if (this.dropping) {
      const first = this.path[0]
      this.game.openOverlay = this.game.scenario.map.hexAt(new Coordinate(first.x, first.y))
    }
    this.loading = false
    this.smoke = false
  }
  
  loadToggle() {
    const map = this.game.scenario.map
    this.loading = !this.loading
    if (this.loading) {
      if (this.needPickUpDisambiguate) {
        const first = this.path[0]
        this.game.openOverlay = map.hexAt(new Coordinate(first.x, first.y))
      } else {
        const last = this.lastPath as GameActionPath
        this.game.openOverlay = map.hexAt(new Coordinate(last.x, last.y))
      }
      const last = this.lastPath as GameActionPath
      this.game.openOverlay = map.hexAt(new Coordinate(last.x, last.y))
    }
    this.dropping = false
    this.smoke = false
  }

  finish() {
    const lastPath = this.lastPath as GameActionPath
    const counters = this.game.scenario.map.countersAt(new Coordinate(lastPath.x, lastPath.y))
    let check = undefined
    for (const c of counters) {
      if (c.hasFeature && c.feature.type === featureType.Mines) { check = c.feature; break }
    }
    const moveData = check ? { mines:
      {
        firepower: check.baseFirepower as number, infantry: !check.antiTank,
        antitank: check.fieldGun || check.antiTank
      }
     } : undefined
    const dice: GameActionDiceResult[] = []
    if (moveData) {
      const unit = this.selection[0].counter.unit
      const mines = moveData.mines
      if ((unit.armored && mines.antitank) || (!unit.armored && mines.infantry)) {
        dice.push({ result: roll2d10(), type: "2d10" })
      }
    }
    for (const a of this.addActions) {
      if (a.type === gameActionAddActionType.Smoke) { dice.push({ result: rolld10(), type: "d10" }) }
    }
    const action = new GameAction({
      user: this.game.currentUser,
      player: this.player,
      data: {
        action: this.rushing ? "rush" : "move", old_initiative: this.game.initiative,
        path: this.path,
        origin: this.selection.map(s => {
          return { x: s.x, y: s.y, id: s.counter.unit.id, status: s.counter.unit.status }
        }),
        add_action: this.addActions.map(a => {
          return {
            type: a.type, x: a.x, y: a.y, id: a.id, parent_id: a.parent_id, facing: a.facing,
            status: a.status, index: a.index,
          }
        }),
        move_data: moveData,
        dice_result: dice,
      }
    }, this.game)
    this.execute(action)
  }

  get rushing(): boolean {
    return this.selection[0].counter.unit.isActivated
  }
  
  canBeMultiselected(counter: Counter): boolean {
    if (!counter.unit.canCarrySupport) {
      this.game.addMessage("only infantry units and leaders can move together")
      return false
    }
    const next = counter.children[0]
    if (next && next?.unit.crewed) {
      this.game.addMessage("unit manning a crewed weapon cannot move with other infantry")
      return false
    }
    if (counter.parent) {
      this.game.addMessage("unit being transported cannot move with other infantry")
      return false
    }
    if (counter.unit.isBroken) {
      this.game.addMessage("cannot move a broken unit")
    }
    if (counter.unit.isExhausted) {
      this.game.addMessage("cannot move an exhausted unit")
    }
    if (!this.rushing && counter.unit.isActivated) {
      this.game.addMessage("cannot move an activated unit")
    }
    return true
  }

  get needPickUpDisambiguate(): boolean {
    if (this.loader) { return false }
    const gl = this.getLoader
    return gl.length > 1 && !gl[0].unit.transport
  }

  get getLoader(): Counter[] {
    const lastPath = this.lastPath as GameActionPath
    const rc: Counter[] = []
    const counters = this.game.scenario.map.countersAt(new Coordinate(lastPath.x, lastPath.y))
    for (const c of counters) {
      if (c.hasFeature || c.unit.selected) { continue }
      for (const s of this.selection) {
        const unit = s.counter.unit
        const target = c.unit
        if (unit.canCarry(target)) { rc.push(s.counter) }
      }
    }
    return rc
  }
}
