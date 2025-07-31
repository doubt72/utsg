import { Coordinate, Direction, featureType, hexOpenType, roadType, terrainType, unitType } from "../../../utilities/commonTypes";
import { stackLimit } from "../../../utilities/utilities";
import Game from "../../Game";
import GameAction from "../../GameAction";
import Hex from "../../Hex";
import Unit from "../../Unit";
import BaseState, { stateType } from "./BaseState";

export default class DeployState extends BaseState {
  turn: number;
  index: number;

  needsDirection: boolean;
  location: Coordinate | undefined;
  direction: Direction | undefined;

  constructor(game: Game, turn: number, index: number) {
    super(game, stateType.Deploy, game.currentPlayer)
    this.needsDirection = false
    this.turn = turn
    this.index = index
    game.refreshCallback(game)
  }

  get actionInProgress(): boolean {
    return false
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  openHex(x: number, y: number) {
    if (this.needsDirection) {
      return hexOpenType.Closed
    }
    const map = this.game.scenario.map
    const hex = map.hexAt(new Coordinate(x, y)) as Hex
    const uf = this.player === 1 ?
      this.game.scenario.alliedReinforcements[this.turn][this.index].counter :
      this.game.scenario.axisReinforcements[this.turn][this.index].counter
    const unit = uf as Unit
    if (!hex.terrain.move && !hex.road && !hex.railroad) { return false }
    if (!hex.terrain.vehicle && !(hex.road && hex.roadType !== roadType.Path) && !uf.isFeature &&
        unit.isVehicle) {
      if (hex.baseTerrain !== terrainType.Shallow || uf.isFeature || !unit.amphibious) {
        return hexOpenType.Closed
      }
    }
    if (hex.terrain.gun === false && !uf.isFeature && (uf.type === unitType.Gun)) { return false }
    if (uf.isFeature) {
      if (!hex.terrain.vehicle) { return hexOpenType.Closed }
      if (hex.river && (featureType.Bunker || featureType.Foxhole)) { return hexOpenType.Closed}
      for (const f of map.countersAt(hex.coord)) {
        if (f.hasFeature) { return hexOpenType.Closed }
      }
      if ((uf.type === featureType.Mines || uf.type === featureType.Wire) && map.victoryNationAt(hex.coord)) {
        return hexOpenType.Closed
      }
    } else {
      if (unit.size + map.sizeAt(hex.coord) > stackLimit) {
        return hexOpenType.Closed
      }
    }
    const ts = `${this.turn}`
    if (!map.alliedSetupHexes || !map.axisSetupHexes) { return hexOpenType.Closed }
    const hexes = this.player === 1 ? map.alliedSetupHexes[ts] : map.axisSetupHexes[ts]
    for (const h of hexes) {
      let xMatch = false
      let yMatch = false
      if (typeof h[0] === "string" && h[0].includes("-")) {
        const [lo, hi] = h[0].split("-")
        if (x >= Number(lo) && x <= Number(hi)) { xMatch = true }
      } else if (h[0] === "*") {
        xMatch = true
      } else if (x === h[0]) { xMatch = true }

      if (typeof h[1] === "string" && h[1].includes("-")) {
        const [lo, hi] = h[1].split("-")
        if (y >= Number(lo) && y <= Number(hi)) { yMatch = true }
      } else if (h[1] === "*") {
        yMatch = true
      } else if (y === h[1]) { yMatch = true }

      if (xMatch && yMatch) {
        let rc = hexOpenType.Open
        const list = map.units[hex.coord.y][hex.coord.x]
        const last = list[list.length - 1] as Unit
        if (unit.crewed) {
          if ((last && !last.isFeature) &&
              ((last.canTow && last.size >= (unit.towSize ?? 0)) || last.canHandle)) {
            rc = hexOpenType.Open
          } else {
            rc = hexOpenType.Red
          }
        } else if (unit.uncrewedSW) {
          if ((last && !last.isFeature) && last.canCarrySupport) {
            rc = hexOpenType.Open
          } else {
            rc = hexOpenType.Red
          }
        }
        return rc
      }
    }
    return hexOpenType.Closed
  }

  toHex(x: number, y: number) {
    this.location = new Coordinate(x, y)
  }

  dir(dir: Direction) {
    this.direction = dir
  }

  finish() {
    if (!this.location) { return }
    const id = `uf-${this.game.actions.length}`
    const action = new GameAction({
      user: this.game.currentUser,
      player: this.player,
      data: {
        action: "deploy", old_initiative: this.game.initiative,
        path: [{ x: this.location.x, y: this.location.y, facing: this.direction }],
        deploy: [{ turn: this.turn, index: this.index, id }]
      }
    }, this.game)
    // Only clears state and "finishes" if all counters deployed
    const counter = this.player === 1 ?
      this.game.scenario.alliedReinforcements[this.turn][this.index] :
      this.game.scenario.axisReinforcements[this.turn][this.index]
    if (counter.x === counter.used) {
      this.game.cancelAction()
    }
    this.game.executeAction(action, false)
  }
}
