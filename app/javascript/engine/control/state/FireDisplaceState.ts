import { Coordinate, CounterSelectionTarget, featureType, hexOpenType, HexOpenType, unitType } from "../../../utilities/commonTypes";
import { normalDir, stackLimit } from "../../../utilities/utilities";
import Counter from "../../Counter";
import Game from "../../Game";
import GameAction, { GameActionAddAction, gameActionAddActionType, GameActionPath } from "../../GameAction";
import Hex from "../../Hex";
import BaseState, { stateType } from "./BaseState";

export default class FireDisplaceState extends BaseState {
  path: GameActionPath[];
  remove: boolean;

  constructor(game: Game) {
    super(game, stateType.FireDisplace, game.currentPlayer)

    const check = game.fireDisplaceNeeded[0]

    this.selection = [{
      x: check.loc.x, y: check.loc.y, id: check.unit.id, counter: game.findCounterById(check.unit.id) as Counter
    }]
    this.path = [{ x: check.loc.x, y: check.loc.y }]
    this.remove = false;

    game.refreshCallback(game)
  }

  get availableHexes(): Hex[] {
    const hexes: Hex[] = []
    const map = this.game.scenario.map
    const loc = new Coordinate(this.path[0].x, this.path[0].y)
    const thisHex = map.hexAt(loc) as Hex
    const unit = this.selection[0].counter.unit
    for (let dir = 0; dir < 6; dir++) {
      const hex = map.neighborAt(loc, normalDir(dir))
      if (!hex) { continue }
      if (!hex.terrain.move) { continue }
      if (!hex.terrain.vehicle && unit.isVehicle) { continue }
      if (thisHex.borderEdges?.includes(normalDir(dir))) {
        if (!thisHex.terrain.borderMove) { continue }
        if (!thisHex.terrain.borderVehicle && unit.isVehicle) { continue }
      }
      if (hex.borderEdges?.includes(normalDir(dir + 3))) {
        if (!hex.terrain.borderMove) { continue }
        if (!hex.terrain.borderVehicle && unit.isVehicle) { continue }
      }
      const counters = map.countersAt(hex.coord)
      let ok = true
      let total = unit.size
      for (const c of counters) {
        if (c.unit.playerNation !== unit.playerNation && !c.unit.isWreck) { ok = false; continue }
        if (c.hasFeature) {
          if (c.feature.type === featureType.Fire ) { ok = false; continue }
          if (c.feature.impassable ) { ok = false; continue }
          if (c.feature.impassableToVehicles && unit.isVehicle ) { ok = false; continue }
        } else {
          total += c.unit.size
        }
        if (total > stackLimit) { ok = false }
      }
      if (ok) { hexes.push(hex) }
    }
    return hexes
  }

  openHex(x: number, y: number): HexOpenType {
    if (this.remove) { return hexOpenType.Closed }
    for (const h of this.availableHexes) {
      if (h.coord.x === x && h.coord.y === y) {
        return hexOpenType.Open
      }
    }
    return hexOpenType.Closed
  }

  selectable(selection: CounterSelectionTarget): boolean {
    if (selection.target.type === "reinforcement") { return false }
    const loc = new Coordinate(this.path[0].x, this.path[0].y)
    const target = selection.target.xy
    if (target.x === loc.x && target.y === loc.y) { return true }
    for (let dir = 0; dir < 6; dir++) {
      const hexes = this.game.scenario.map.hexNeighbors(loc)
      for (const h of hexes) {
        if (!h) { continue }
        if (h.coord.x === target.x && h.coord.y === target.y) { return true }
      }
    }
    return false
  }

  move(x: number, y: number): void {
    if (this.path.length !== 1) { return }
    this.path.push({ x, y })
  }

  cancel(): void {
    this.remove = false
    if (this.path.length !== 2) { return }
    this.path.pop()
  }

  finish() {
    if (this.availableHexes.length > 0 && !this.remove && this.path.length < 2) { return }
    const unit = this.selection[0].counter.unit
    const loc = new Coordinate(this.path[0].x, this.path[0].y)
    const addAction: GameActionAddAction[] = []
    if (unit.canHandle && unit.children.length > 0 && unit.children[0].type === unitType.Gun) {
      const child = unit.children[0]
      const facing = child.facing
      addAction.push({
        type: gameActionAddActionType.Drop, x: loc.x, y: loc.y, id: child.id, facing, index: 0
      })
    }
    const action = new GameAction({
      user: this.game.currentUser, player: this.player,
      data: {
        action: "fire_displace", old_initiative: this.game.initiative,
        path: this.path.map(c => { return { x: c.x, y: c.y }}),
        target: [{ x: loc.x, y: loc.y, id: unit.id, status: unit.status }],
        add_action: addAction,
      },
    }, this.game)
    this.game.fireDisplaceNeeded.shift()
    this.execute(action)
  }
}
