import {
  Coordinate, hexOpenType, HexOpenType, roadType, terrainType, unitType
} from "../../utilities/commonTypes"
import { stackLimit } from "../../utilities/utilities"
import { actionType } from "../Game"
import { GameActionPath } from "../GameAction"
import Map from "../Map"
import Unit from "../Unit"
import { mapSelectMovement, movementCost, movementPastCost, openHexMovement } from "./movement"

export default function openHex(map: Map, x: number, y: number): HexOpenType {
  const game = map.game
  if (game?.gameActionState?.currentAction === actionType.Deploy) {
    return openHexReinforcement(map, x, y)
  }
  if (game?.gameActionState?.currentAction === actionType.Move) {
    return openHexMove(map, x, y)
  }
  return hexOpenType.Open
}

export function openHexRotateOpen(map: Map, loc: Coordinate): boolean {
  const game = map.game
  if (!game?.gameActionState?.move) { return false }
  if (!game.gameActionState.selection) { return false }
  const counter = game.gameActionState.selection[0].counter
  if (!counter.unit.rotates && !(counter.children.length > 0 && counter.children[0].unit.rotates)) {
    return false
  }
  const cost = movementCost(map, loc, loc, counter.unit) + movementPastCost(map, counter.unit)
  const length = game.gameActionState.move.path.length
  const move = mapSelectMovement(game, true)
  return move >= cost || length === 1
}

function openHexReinforcement(map: Map, x: number, y: number): HexOpenType {
  const game = map.game
  if (!game?.gameActionState?.deploy) { return hexOpenType.Open }
  if (game.gameActionState.currentAction === actionType.Deploy &&
      game.gameActionState.deploy.needsDirection
  ) {
    return hexOpenType.Closed
  }
  const player = game.gameActionState.player
  const turn = game.gameActionState.deploy.turn
  const index = game.gameActionState.deploy.index
  const hex = map.hexAt(new Coordinate(x, y))
  const uf = player === 1 ?
    game.scenario.alliedReinforcements[turn][index].counter :
    game.scenario.axisReinforcements[turn][index].counter
  const unit = uf as Unit
  if (!hex) { return false }
  if (!hex.terrain.move && !hex.road && !hex.railroad) { return false }
  if (!hex.terrain.vehicle && !(hex.road && hex.roadType !== roadType.Path) && !uf.isFeature &&
      (unit.isTracked || unit.isWheeled)) {
    if (hex.baseTerrain !== terrainType.Shallow || uf.isFeature || !unit.amphibious) {
      return hexOpenType.Closed
    }
  }
  if (hex.terrain.gun === false && !uf.isFeature && (uf.type === unitType.Gun)) { return false }
  if (uf.isFeature) {
    if (!hex.terrain.vehicle) { return hexOpenType.Closed }
    for (const f of map.countersAt(hex.coord)) {
      if (f.hasFeature) { return hexOpenType.Closed }
    }
    if ((uf.type === "mines" || uf.type === "wire") && map.victoryNationAt(hex.coord)) {
      return hexOpenType.Closed
    }
  } else {
    const size = map.countersAt(hex.coord).reduce((sum, c) => {
      return c.hasFeature ? sum : sum + c.unit.size
    }, 0)
    if (unit.size + size > stackLimit) {
      return hexOpenType.Closed
    }
  }
  const ts = `${turn}`
  if (!map.alliedSetupHexes || !map.axisSetupHexes) { return hexOpenType.Closed }
  const hexes = player === 1 ? map.alliedSetupHexes[ts] : map.axisSetupHexes[ts]
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
          rc = hexOpenType.Green
        } else {
          rc = hexOpenType.Red
        }
      } else if (unit.uncrewedSW) {
        if ((last && !last.isFeature) && last.canCarrySupport) {
          rc = hexOpenType.Green
        } else {
          rc = hexOpenType.Red
        }
      }
      return rc
    }
  }
  return hexOpenType.Closed
}

function openHexMove(map: Map, x: number, y: number): HexOpenType {
  const game = map.game
  if (!game?.gameActionState?.move) { return hexOpenType.Open }
  if (!game?.gameActionState?.selection) { return hexOpenType.Open }
  const lastPath = game.lastPath as GameActionPath
  const cost = openHexMovement(map, new Coordinate(lastPath.x, lastPath.y), new Coordinate(x, y))
  if (cost === false) {
    return hexOpenType.Closed
  } else {
    return cost
  }
}
