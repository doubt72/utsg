import {
  Coordinate, Direction, hexOpenType, HexOpenType, roadType, terrainType, unitType
} from "../../utilities/commonTypes"
import { normalDir, stackLimit } from "../../utilities/utilities"
import { actionType, MovePath } from "../Game"
import Hex from "../Hex"
import Map from "../Map"
import Unit from "../Unit"

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
  const next = map.nextUnit(counter)
  if (!counter.target.rotates && !(next && next.target.rotates)) { return false }
  const cost = openHexMovementCost(map, loc, loc, counter.target as Unit) +
               openHexMovementPastCost(map, counter.target as Unit)
  const length = game.gameActionState.move.path.length
  const move = counter.target.currentMovement as number
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
  if (!hex) { return false }
  if (!hex.terrain.move && !hex.road && !hex.railroad) { return false }
  if (!hex.terrain.vehicle && !(hex.road && hex.roadType !== roadType.Path) && !uf.isFeature &&
      (uf.isTracked || uf.isWheeled)) {
    if (hex.baseTerrain !== terrainType.Shallow || uf.isFeature || !uf.amphibious) {
      return hexOpenType.Closed
    }
  }
  if (hex.terrain.gun === false && !uf.isFeature && (uf.type === unitType.Gun)) { return false }
  if (uf.isFeature) {
    if (!hex.terrain.vehicle) { return hexOpenType.Closed }
    for (const f of map.countersAt(hex.coord)) {
      if (f.target.isFeature) { return hexOpenType.Closed }
    }
    if ((uf.type === "mines" || uf.type === "wire") && map.victoryAt(hex.coord)) {
      return hexOpenType.Closed
    }
  } else {
    const size = map.countersAt(hex.coord).reduce((sum, c) => {
      return c.target.isFeature ? sum : sum + c.target.size
    }, 0)
    if (uf.size + size > stackLimit) {
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
      const last = list[list.length - 1]
      if (uf.crewed) {
        if (last && (last.canTow && last.size >= (uf.towSize ?? 0) ||
            last.canHandle)) {
          rc = hexOpenType.Green
        } else {
          rc = hexOpenType.Red
        }
      } else if (uf.uncrewedSW) {
        if (last && last.canCarrySupport) {
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
  const lastPath = game.lastPath as MovePath
  const cost = openHexMovement(map, new Coordinate(lastPath.x, lastPath.y), new Coordinate(x, y))
  if (cost === false) {
    return hexOpenType.Closed
  } else {
    return cost
  }
}

function openHexAlongRoad(from: Hex, to: Hex, dir: Direction, pathOk: boolean = false): boolean {
  if (!from.road || !to.road || !to.roadDirections?.includes(normalDir(dir + 3)) ||
      !from.roadDirections?.includes(dir)) {
    return false
  }
  if (pathOk) { return true }
  if (from.roadType === roadType.Path || to.roadType === roadType.Path) {
    return false
  }
  return true
}

function openHexAlongStream(from: Hex, to: Hex, dir: Direction): boolean {
  if (!from.river || !to.river || !to.riverDirections?.includes(normalDir(dir + 3)) ||
      !from.riverDirections?.includes(dir)) {
    return false
  }
  return true
}

function openHexMovementCost(map: Map, from: Coordinate, to: Coordinate, target: Unit): number {
  const hexFrom = map.hexAt(from) as Hex;
  if (from.x === to.x && from.y === to.y) {  // When rotating in place
    if (hexFrom.road) {
      if (target.isWheeled && hexFrom.roadType !== roadType.Path) { return 0.5 }
      if (target.isTracked && hexFrom.roadType !== roadType.Path) { return 1 }
    }
    // all of these casts should have already been checked before we get here
    return hexFrom.terrain.move as number
  }
  const hexTo = map.hexAt(to) as Hex;
  const terrFrom = hexFrom.terrain
  const terrTo = hexTo.terrain
  let cost = terrTo.move as number
  const dir = map.relativeDirection(from, to) as Direction
  const roadMove = openHexAlongRoad(hexFrom, hexTo, dir)
  if (target.isWheeled && roadMove) {
    cost = 0.5
  } else if (target.isTracked && roadMove) {
    cost = 1
  } else if (openHexAlongRoad(hexFrom, hexTo, dir, true)) {
    cost = 1
  }
  if (hexFrom.border && hexFrom.borderEdges?.includes(dir)) {
    cost += terrFrom.borderMove as number
  }
  if (hexTo.border && hexTo.borderEdges?.includes(dir)) {
    cost += terrTo.borderMove as number
  }
  if (hexFrom.river && !openHexAlongStream(hexFrom, hexTo, dir)) {
    cost += hexTo.terrain.streamAttr.outMove
  }
  if (hexTo.river && !openHexAlongStream(hexFrom, hexTo, dir)) {
    cost += hexTo.terrain.streamAttr.inMove
  }
  if (openHexAlongStream(hexFrom, hexTo, dir)) {
    cost += hexTo.terrain.streamAttr.alongMove
  }
  if (hexTo.elevation > hexFrom.elevation) {
    cost += 1
  }
  if (target.rotates && normalDir(dir + 3) === target.facing) { cost *= 2 }
  return cost
}

function openHexMovementPastCost(map: Map, target: Unit): number {
  const game = map.game
  if (!game?.gameActionState?.move) { return 0 }
  const length = game.gameActionState.move.path.length
  let pastCost = 0
  for (let i = 0; i < length - 1; i++) {
    const p1 = game.gameActionState.move.path[i]
    const p2 = game.gameActionState.move.path[i+1]
    const loc1 = new Coordinate(p1.x, p1.y)
    const loc2 = new Coordinate(p2.x, p2.y)
    pastCost += openHexMovementCost(map, loc1, loc2, target)
  }
  return pastCost
}

function openHexAllRoad(map: Map): boolean {
  const game = map.game
  if (!game?.gameActionState?.move) { return false }
  const length = game.gameActionState.move.path.length
  for (let i = 0; i < length - 1; i++) {
    const p1 = game.gameActionState.move.path[i]
    const p2 = game.gameActionState.move.path[i+1]
    const loc1 = new Coordinate(p1.x, p1.y)
    const loc2 = new Coordinate(p2.x, p2.y)
    if (!openHexAlongRoad(
      map.hexAt(loc1) as Hex, map.hexAt(loc2) as Hex, map.relativeDirection(loc1, loc2) as Direction
    )) {
      return false
    }
  }
  return true
}

function openHexMovement(map: Map, from: Coordinate, to: Coordinate): HexOpenType {
  const game = map.game
  if (!game?.gameActionState?.move) { return false }
  if (from.x === to.x && from.y === to.y) {
    return false;
  }
  const hexFrom = map.hexAt(from) as Hex;
  const hexTo = map.hexAt(to) as Hex;
  const terrFrom = hexFrom.terrain
  const terrTo = hexTo.terrain
  if (!terrTo.move) { return false }
  const dir = map.relativeDirection(from, to)
  if (!dir) { return false }
  if (!game.gameActionState.selection) { return false }

  const countersAt = map.countersAt(to)
  const selection = game.gameActionState.selection[0].counter
  const moveSize = game.gameActionState.selection.reduce((sum, u) => sum + u.counter.target.size, 0)
  const toSize = countersAt.reduce((sum, u) => sum + u.target.size, 0)
  if (moveSize + toSize > stackLimit) { return false }
  for (const c of countersAt) {
    if (selection.target.playerNation !== c.target.playerNation) { return false }
  }

  const roadMove = openHexAlongRoad(hexFrom, hexTo, dir)
  if (selection.target.isWheeled || selection.target.isTracked) {
    if (!terrTo.vehicle && !roadMove) { return false }
    if (terrTo.vehicle === "amph" && !roadMove && !selection.target.amphibious) { return false }
  }
  const next = game.gameActionState.selection[1]
  const facing = game.lastPath?.facing as Direction
  if (next && next.counter.target.crewed) {
    if (!terrTo.gun && !roadMove) { return false }
    if (terrTo.gun === "back" && dir !== normalDir(facing + 3)) {
      return false
    }
  }
  if (hexFrom.border && hexFrom.borderEdges?.includes(dir)) {
    if (!terrFrom.borderMove) { return false }
    if ((selection.target.isWheeled || selection.target.isTracked) && !terrFrom.borderVehicle) {
      return false
    }
    if (next && next.counter.target.crewed && !terrFrom.borderGun) { return false }
  }
  if (hexTo.border && hexTo.borderEdges?.includes(dir)) {
    if (!terrTo.borderMove) { return false }
    if ((selection.target.isWheeled || selection.target.isTracked) && !terrTo.borderVehicle) {
      return false
    }
    if (next && next.counter.target.crewed && !terrTo.borderGun) { return false }
  }
  if (selection.target.rotates) {
    if (normalDir(dir + 3) !== facing && dir !== facing) { return false }
  }

  const length = game.gameActionState.move.path.length
  const cost = openHexMovementCost(map, from, to, selection.target as Unit)
  const pastCost = openHexMovementPastCost(map, selection.target as Unit)
  const road = openHexAllRoad(map)
  const allRoad = road && roadMove && !selection.target.isWheeled &&
                  !(next && next.counter.target.crewed) ? 1 : 0
  let move = selection.target.currentMovement as number + allRoad
  if (selection.target.canCarrySupport) {
    let minLdrMove = 99
    let minInfMove = 99
    for(const sel of game.gameActionState.selection) {
      const u = sel.counter.target
      const move = u.currentMovement as number
      if (u.canCarrySupport && u.type !== "ldr" && move < minInfMove) { minInfMove = move }
      if (u.type === "ldr" && move < minLdrMove) { minLdrMove = move }
    }
    if (minLdrMove === 99) {
      move = minInfMove + allRoad
    } else {
      minInfMove += 1
      move = (minInfMove < minLdrMove ? minInfMove : minLdrMove) + allRoad
    }
  }
  if (move < cost + pastCost && length > 1) { return false }
  for (const p of game.gameActionState.move.path) {
    if (to.x === p.x && to.y === p.y ) { return hexOpenType.Open }
  }
  return move > cost ? cost : "all"
}
