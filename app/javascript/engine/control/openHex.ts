import {
  Coordinate, featureType, hexOpenType, HexOpenType, roadType, terrainType, unitType
} from "../../utilities/commonTypes"
import { stackLimit } from "../../utilities/utilities"
import { gameActionAddActionType, GameActionPath } from "../GameAction"
import Map from "../Map"
import Unit from "../Unit"
import { actionType } from "./actionState"
import { openHexAssaulting } from "./assault"
import { openHexFiring } from "./fire"
import { mapSelectMovement, movementCost, movementPastCost, openHexMovement } from "./movement"
import { routEnds } from "./rout"

export default function openHex(map: Map, x: number, y: number): HexOpenType {
  const game = map.game
  if (game?.gameState?.currentAction === actionType.Deploy) {
    return openHexReinforcement(map, x, y)
  } else if (game?.gameState?.currentAction === actionType.Fire) {
    return openHexFire(map, x, y)
  } else if (game?.gameState?.currentAction === actionType.Move) {
    return openHexMove(map, x, y)
  } else if (game?.gameState?.currentAction === actionType.Assault) {
    return openHexAssault(map, x, y)
  } else if (game?.gameState?.currentAction === actionType.Rout) {
    return openHexRout(map, x, y)
  } else if (game?.gameState?.currentAction === actionType.RoutAll) {
    return hexOpenType.Closed
  } else if (game?.gameState?.currentAction === actionType.RoutCheck) {
    return hexOpenType.Closed
  } else if (game?.gameState?.currentAction === actionType.MoraleCheck) {
    return hexOpenType.Closed
  } else if (game?.gameState?.currentAction === actionType.Breakdown) {
    return hexOpenType.Closed
  }
  return hexOpenType.Open
}

export function openHexRotateOpen(map: Map): boolean {
  const game = map.game
  if (!game?.gameState?.selection) { return false }
  const counter = game.gameState.selection[0].counter
  if (game.gameState.fire) {
    if (!game.gameState.fire.doneRotating) {
      return true
    }
  } else if (game.gameState.move) {
    const child = counter.unit.children[0]
    if (!counter.unit.rotates && !(child && child.rotates)) { return false }
    if (counter.unit.canHandle && child && child.crewed) {
      for (const a of game.gameState.move.addActions) {
        if (a.type === gameActionAddActionType.Drop && a.id === child.id) { return false }
      }
    }
    return true
  } else if (game.gameState.assault && game.gameState.assault.path.length > 1) {
    if (counter.unit.turreted && !counter.unit.turretJammed) { return true }
  }
  return false
}

export function openHexRotatePossible(map: Map): boolean {
  const game = map.game
  if (!game?.gameState?.selection) { return false }
  const counter = game.gameState.selection[0].counter
  if (game.gameState.fire) {
    if (!game.gameState.fire.doneRotating) {
      return true
    }
  } else if (game.gameState.move) {
    const loc = counter.hex as Coordinate
    const cost = movementCost(map, loc, loc, counter.unit) + movementPastCost(map, counter.unit)
    const length = game.gameState.move.path.length
    const move = mapSelectMovement(game, true)
    return move >= cost || length === 1
  } else if (game.gameState.assault && game.gameState.assault.path.length > 1) {
    if (counter.unit.turreted && !counter.unit.turretJammed) { return true }
  }
  return false
}

function openHexReinforcement(map: Map, x: number, y: number): HexOpenType {
  const game = map.game
  if (!game?.gameState?.deploy) { return hexOpenType.Open }
  if (game.gameState.currentAction === actionType.Deploy &&
      game.gameState.deploy.needsDirection
  ) {
    return hexOpenType.Closed
  }
  const player = game.gameState.player
  const turn = game.gameState.deploy.turn
  const index = game.gameState.deploy.index
  const hex = map.hexAt(new Coordinate(x, y))
  const uf = player === 1 ?
    game.scenario.alliedReinforcements[turn][index].counter :
    game.scenario.axisReinforcements[turn][index].counter
  const unit = uf as Unit
  if (!hex) { return false }
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

function openHexMove(map: Map, x: number, y: number): HexOpenType {
  const game = map.game
  if (!game?.gameState?.move) { return hexOpenType.Open }
  if (!game?.gameState?.selection) { return hexOpenType.Open }
  const lastPath = game.lastPath as GameActionPath
  return openHexMovement(map, new Coordinate(lastPath.x, lastPath.y), new Coordinate(x, y))
}

function openHexAssault(map: Map, x: number, y: number): HexOpenType {
  const game = map.game
  if (!game?.gameState?.assault) { return hexOpenType.Open }
  if (!game?.gameState?.selection) { return hexOpenType.Open }
  const lastPath = game.lastPath as GameActionPath
  return openHexAssaulting(map, new Coordinate(lastPath.x, lastPath.y), new Coordinate(x, y))
}

function openHexFire(map: Map, x: number, y: number): HexOpenType {
  const game = map.game
  if (!game?.gameState?.selection) { return hexOpenType.Open }
  if (!game?.gameState?.fire) { return hexOpenType.Open }
  if (!game?.gameState?.selection) { return hexOpenType.Open }
  const lastPath = game.lastPath as GameActionPath
  return openHexFiring(map, new Coordinate(lastPath.x, lastPath.y), new Coordinate(x, y))
}

function openHexRout(map: Map, x: number, y: number): HexOpenType {
  const game = map.game
  if (!game?.gameState?.rout) { return hexOpenType.Closed }
  if (!game.gameState.rout.routPathTree) { return hexOpenType.Closed }
  const hexes = routEnds(game.gameState.rout.routPathTree)
  for (const h of hexes) {
    if (h.x === x && h.y === y) { return hexOpenType.Open }
  }
  return hexOpenType.Closed
}