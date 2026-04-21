import { Coordinate, featureType, hexOpenType, HexOpenType, unitType } from "../../../utilities/commonTypes";
import { normalDir, stackLimit } from "../../../utilities/utilities";
import Counter from "../../Counter";
import Game from "../../Game";
import GameAction, { GameActionAddAction, gameActionAddActionType, GameActionPath, GameActionUnit } from "../../GameAction";
import Hex from "../../Hex";
import BaseState, { StateAddAction, stateType } from "./BaseState";

export default class FireDisplaceState extends BaseState {
  path: GameActionPath[];
  addAction: StateAddAction | undefined;
  remove: boolean;

  constructor(game: Game) {
    super(game, stateType.FireDisplace, game.currentPlayer)

    const check = game.fireDisplaceNeeded[0]
    const counter = game.findCounterById(check.unit.id) as Counter

    this.selection = [{ x: check.loc.x, y: check.loc.y, id: check.unit.id, name: check.unit.name, counter }]
    this.path = [{ x: check.loc.x, y: check.loc.y }]
    this.game.actionPathLength = 1
    this.remove = false;

    if (!counter.unit.selected) { this.map.select(counter.unit) }
    if (game.currentPlayerNation !== counter.unit.playerNation) { game.togglePlayer() }
    game.openOverlay = game.scenario.map.hexAt(check.loc)
    game.refreshCallback(game)
  }

  get availableHexes(): Hex[] {
    const hexes: Hex[] = []
    const loc = new Coordinate(this.path[0].x, this.path[0].y)
    const thisHex = this.map.hexAt(loc) as Hex
    const unit = this.selection[0].counter.unit
    for (let dir = 0; dir < 6; dir++) {
      const hex = this.map.neighborAt(loc, normalDir(dir))
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
      const counters = this.map.countersAt(hex.coord)
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
    if (this.path.length > 1) { return hexOpenType.Closed }
    for (const h of this.availableHexes) {
      if (h.coord.x === x && h.coord.y === y) {
        return hexOpenType.Open
      }
    }
    return hexOpenType.Closed
  }

  get activeCounters(): Counter[] {
    return this.game.scenario.map.countersAt(new Coordinate(this.path[0].x, this.path[0].y))
  }

  move(x: number, y: number): void {
    if (this.path.length !== 1) { return }
    this.path.push({ x, y })
    const loc = new Coordinate(x, y)
    const vp = this.map.victoryAt(loc)
    if (vp && vp !== this.game.currentPlayer && !this.game.scenario.map.enemyAt(loc, this.game.currentPlayer)) {
      this.addAction = { x, y, type: gameActionAddActionType.VP, cost: 0, index: 0 }
    }
    this.game.closeOverlay = true
    this.game.actionPathLength = this.path.length
  }

  cancel(): void {
    this.remove = false
    if (this.path.length !== 2) { return }
    this.path.pop()
  }

  get actionInProgress(): boolean {
    return this.path.length > 0
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
        type: gameActionAddActionType.Drop, x: loc.x, y: loc.y, id: child.id, name: child.name,
        facing, index: 0
      })
    }
    if (this.addAction) {
      addAction.push({
        type: this.addAction.type, x: this.addAction.x, y: this.addAction.y,
        id: this.addAction.id, name: this.addAction.name, index: this.addAction.index
      })
    }
    const target: GameActionUnit = {
      x: loc.x, y: loc.y, id: unit.id, name: unit.name, status: unit.status
    }
    const action = new GameAction({
      user: this.game.currentUser, player: this.player,
      data: {
        action: "fire_displace", old_initiative: this.game.initiative,
        path: this.path.map(c => { return { x: c.x, y: c.y }}),
        target: [target], add_action: addAction,
      },
    }, this.game)
    this.execute(action)
  }
}
