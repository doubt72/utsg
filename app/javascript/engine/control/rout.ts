import { Coordinate, Direction, Player } from "../../utilities/commonTypes";
import { normalDir, stackLimit } from "../../utilities/utilities";
import Game from "../Game";
import Hex from "../Hex";
import Map from "../Map";
import Unit from "../Unit";
import { RoutPathTree } from "./gameActions";
import { alongRailroad, alongStream } from "./movement";

export function findRoutPathTree(
  game: Game, loc: Coordinate, move: number, player: Player, unit: Unit
): RoutPathTree | false {
  if (move === 0) { return { x: loc.x, y: loc.y, children: [] } }
  const map = game.scenario.map
  const dir = normalDir((player === 1 ? map.alliedDir : map.axisDir) + 3)
  const straight = dir === Math.floor(dir)
  const hexes: Coordinate[] = []
  if (straight) {
    const hex = map.neightborCoordinate(loc, dir)
    if (map.hexAt(hex)) { hexes.push(hex) }
  } else {
    const hex1 = map.neightborCoordinate(loc, normalDir(dir - 0.5))
    const hex2 = map.neightborCoordinate(loc, normalDir(dir + 0.5))
    if (map.hexAt(hex1)) { hexes.push(hex1) }
    if (map.hexAt(hex2)) { hexes.push(hex2) }
  }
  if (hexes.length < 1) { return false }
  const unblockedHexes = hexes.filter(h => !!movementCost(map, loc, h, unit))
  if (unblockedHexes.length < 1 && straight) {
    const hex1 = map.neightborCoordinate(loc, normalDir(dir - 1))
    const hex2 = map.neightborCoordinate(loc, normalDir(dir + 1))
    if (map.hexAt(hex1) && !!movementCost(map, loc, hex1, unit)) { unblockedHexes.push(hex1) }
    if (map.hexAt(hex2) && !!movementCost(map, loc, hex2, unit)) { unblockedHexes.push(hex2) }
  }
  if (unblockedHexes.length < 1) { return false }
  let reachableHexes = unblockedHexes.filter(h => movementCost(map, loc, h, unit) as number <= move)
  if (reachableHexes.length < 1 && straight) {
    const hex1 = map.neightborCoordinate(loc, normalDir(dir - 1))
    const hex2 = map.neightborCoordinate(loc, normalDir(dir + 1))
    if (map.hexAt(hex1) && !!movementCost(map, loc, hex1, unit)) { reachableHexes.push(hex1) }
    if (map.hexAt(hex2) && !!movementCost(map, loc, hex2, unit)) { reachableHexes.push(hex2) }
  }
  reachableHexes = reachableHexes.filter(h => movementCost(map, loc, h, unit) as number <= move)
  if (reachableHexes.length < 1) { return { x: loc.x, y: loc.y, children: [] }}
  const subPaths = reachableHexes.map(h =>
    findRoutPathTree(game, h, move - (movementCost(map, loc, h, unit) as number), player, unit)
  )
  const children = subPaths.filter(c => c) as RoutPathTree[]
  if (children.length < 1) { return false }
  return { x: loc.x, y: loc.y, children }
}

export function routPaths(tree: RoutPathTree): Coordinate[][] {
  const rc = []
  const loc = new Coordinate(tree.x, tree.y)
  if (tree.children.length > 0) {
    for (const c of tree.children) {
      const rp = routPaths(c)
      for (const rpc of rp) {
        rc.push([loc].concat(rpc))
      }
    }
  } else {
    rc.push([loc])
  }
  return rc
}

export function routEnds(tree: RoutPathTree): Coordinate[] {
  const rc = []
  const paths = routPaths(tree)
  for (const p of paths) {
    const length = p.length
    const last = p[length - 1]
    let check = false
    for (const c of rc) {
      if (c.x === last.x && c.y === last.y) { check = true }
    }
    if (!check) { rc.push(last) }
  }
  return rc
}

function movementCost(map: Map, from: Coordinate, to: Coordinate, unit: Unit): number | false {
  const hexFrom = map.hexAt(from) as Hex;
  for (const f of map.countersAt(from)) {
    if (f.hasFeature && f.feature.currentMovement === "A") { return unit.currentMovement }
  }
  const hexTo = map.hexAt(to) as Hex;
  const terrFrom = hexFrom.terrain
  const terrTo = hexTo.terrain
  let cost = terrTo.move
  if (!cost) { return false }
  let toSize = 0
  for (const c of map.countersAt(to)) {
    if (c.hasFeature && c.feature.currentMovement === "A") { return false }
    if (c.hasUnit) {
      if (c.unit.isVehicle || c.unit.canCarrySupport) {
        if (c.unit.nation !== unit.nation && !c.unit.isWreck) { return false }
        toSize += c.unit.size
      }
    }
  }
  if (toSize + unit.size > stackLimit) { return false }
  const dir = map.relativeDirection(from, to) as Direction
  if (!terrTo.move && alongRailroad(hexFrom, hexTo, dir)) { cost = 2 }
  if (hexFrom.border && hexFrom.borderEdges?.includes(dir)) {
    const move = terrFrom.borderMove
    if (!move) { return false }
    cost += move
  }
  if (hexTo.border && hexTo.borderEdges?.includes(normalDir(dir+3))) {
    const move = terrTo.borderMove
    if (!move) { return false }
    cost += move
  }
  if (hexFrom.river && !alongStream(hexFrom, hexTo, dir)) {
    cost += hexTo.terrain.streamAttr.outMove
  }
  if (hexTo.river && !alongStream(hexFrom, hexTo, dir)) {
    cost += hexTo.terrain.streamAttr.inMove
  }
  if (alongStream(hexFrom, hexTo, dir)) {
    cost += hexTo.terrain.streamAttr.alongMove
  }
  if (hexTo.elevation > hexFrom.elevation) {
    cost += 1
  }
  return cost
}