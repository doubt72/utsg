import { Coordinate, Direction, hexOpenType, HexOpenType, roadType } from "../../utilities/commonTypes"
import { hexDistance, normalDir, stackLimit } from "../../utilities/utilities"
import Game from "../Game"
import { gameActionAddActionType } from "../GameAction"
import Hex from "../Hex"
import Map from "../Map"
import Unit from "../Unit"
import { rushing } from "./checks"

export function mapSelectMovement(game: Game, roadMove: boolean): number {
  if (!game.gameState) { return 0 }
  const map = game.scenario.map
  const road = allAlongRoad(map)
  const selection = game.gameState.selection[0].counter
  const next = selection.children[0]
  const allRoad = road && roadMove && !selection.unit.isWheeled &&
                  !(next && next.unit.crewed) ? 1 : 0
  let move = selection.unit.currentMovement as number
  if (rushing(game)) { move = Math.floor(move / 2) }
  move += allRoad
  if (selection.unit.canCarrySupport) {
    let minLdrMove = 99
    let minInfMove = 99
    for(const sel of game.gameState.selection) {
      let check = false
      if (game.gameState.move?.addActions) {
        for (const add of game.gameState.move.addActions) {
          if (add.type === gameActionAddActionType.Drop && add.id === sel.id) {
            check = true
            continue
          }
        }
      }
      if (check) { continue }
      const u = sel.counter.unit
      let iMove = u.currentMovement as number
      if (rushing(game)) { iMove = Math.floor(iMove / 2) }
      if (u.children.length > 0) {
        const child = u.children[0]
        if (child.crewed) { iMove = child.baseMovement }
        if (child.uncrewedSW) { iMove += child.baseMovement }
        if (child.uncrewedSW && u.leader) { iMove -= 2 }
      }
      if (u.canCarrySupport && !u.leader && iMove < minInfMove) { minInfMove = iMove }
      if (u.leader && iMove < minLdrMove) { minLdrMove = iMove }
    }
    if (minLdrMove === 99) {
      move = minInfMove + allRoad
    } else {
      minInfMove += 1
      move = (minInfMove < minLdrMove ? minInfMove : minLdrMove) + allRoad
    }
  }
  if (allRoad === 1 && move === 1) { return 0 }
  return move
}

export function openHexMovement(map: Map, from: Coordinate, to: Coordinate): HexOpenType {
  const game = map.game
  if (!game?.gameState?.move) { return hexOpenType.Closed }
  const action = game?.gameState.move
  if (action.droppingMove) { return hexOpenType.Closed }
  if (action.loadingMove) { return hexOpenType.Closed }
  if (!game.gameState.selection) { return hexOpenType.Closed }
  const selection = game.gameState.selection[0].counter
  if (action.placingSmoke) { return smokeOpenHex(map, from, to, selection.unit) }
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

  const moveSize = game.gameState.selection.filter(u => !u.counter.unit.parent).reduce(
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
  const facing = game.lastPath?.facing as Direction
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
    if (action.addActions.filter(a => a.id === next.unit.id).length < 1) {
      if (normalDir(dir + 3) !== facing && dir !== facing) { return hexOpenType.Closed }
    }
  }
  if (selection.unit.rotates) {
    if (normalDir(dir + 3) !== facing && dir !== facing) { return hexOpenType.Closed }
  }

  const length = action.path.length + action.addActions.length
  const cost = movementCost(map, from, to, selection.unit)
  const pastCost = movementPastCost(map, selection.unit)
  const move = mapSelectMovement(game, roadMove)
  if (move === 0) { return false }
  if (move < cost + pastCost && length > 1) { return false }
  for (const p of action.path) {
    if (to.x === p.x && to.y === p.y ) { return hexOpenType.Open }
  }
  return move >= cost + pastCost ? cost : hexOpenType.All
}

export function movementPastCost(map: Map, target: Unit): number {
  const game = map.game
  if (!game?.gameState?.move) { return 0 }
  const move = game.gameState.move
  const length = move.path.length
  let pastCost = 0
  move.addActions.forEach(a => pastCost += a.cost)
  for (let i = 0; i < length - 1; i++) {
    const p1 = move.path[i]
    const p2 = move.path[i+1]
    const loc1 = new Coordinate(p1.x, p1.y)
    const loc2 = new Coordinate(p2.x, p2.y)
    pastCost += movementCost(map, loc1, loc2, target)
  }
  return pastCost
}

export function movementCost(map: Map, from: Coordinate, to: Coordinate, target: Unit): number {
  const hexFrom = map.hexAt(from) as Hex;
  if (from.x === to.x && from.y === to.y) {  // When rotating in place
    if (hexFrom.road) {
      if (target.isVehicle && hexFrom.roadType !== roadType.Path) { return 1 }
    }
    // all of these casts should have already been checked before we get here
    return hexFrom.terrain.move as number
  }
  for (const f of map.countersAt(from)) {
    if (f.hasFeature && f.feature.currentMovement === "A") { return 99 }
  }
  const hexTo = map.hexAt(to) as Hex;
  const terrFrom = hexFrom.terrain
  const terrTo = hexTo.terrain
  let cost = terrTo.move as number
  const dir = map.relativeDirection(from, to) as Direction
  if (!terrTo.move && alongRailroad(hexFrom, hexTo, dir)) { cost = 2 }
  const roadMove = alongRoad(hexFrom, hexTo, dir)
  if (target.isWheeled && roadMove) {
    cost = 0.5
  } else if (target.isTracked && roadMove) {
    cost = 1
  } else if (alongRoad(hexFrom, hexTo, dir, true)) {
    cost = 1
  }
  if (hexFrom.border && hexFrom.borderEdges?.includes(dir)) {
    cost += terrFrom.borderMove as number
  }
  if (hexTo.border && hexTo.borderEdges?.includes(normalDir(dir+3))) {
    cost += terrTo.borderMove as number
  }
  if (hexFrom.river && !alongStream(hexFrom, hexTo, dir) && !roadMove) {
    cost += hexTo.terrain.streamAttr.outMove
  }
  if (hexTo.river && !alongStream(hexFrom, hexTo, dir) && !roadMove) {
    cost += hexTo.terrain.streamAttr.inMove
  }
  if (alongStream(hexFrom, hexTo, dir)) {
    cost += hexTo.terrain.streamAttr.alongMove
  }
  if (hexTo.elevation > hexFrom.elevation) {
    cost += 1
  }
  if (target.rotates && normalDir(dir + 3) === map.game?.lastPath?.facing) { cost *= 2 }
  return cost
}

export function showLaySmoke(game: Game): boolean {
  const move = game.gameState?.move
  const selection = game.gameState?.selection
  if (!move || !selection) { return false }
  if (move.loadingMove || move.droppingMove) { return false }
  let smoke = false
  for (const s of selection) {
    if (s.counter.unit.smokeCapable && !s.counter.unit.targetedRange) {
      smoke = true
      break
    }
  }
  if (!smoke) { return false }
  if (movementPastCost(game.scenario.map, selection[0].counter.unit) >= mapSelectMovement(game, false)) {
    return false
  }
  return true    
}

export function showDropMove(game: Game): boolean {
  const action = game.gameState
  if (!action?.move) { return false }
  if (action.move.loadingMove || action.move.placingSmoke) { return false }
  const selection = action.selection
  if ((!selection || selection.length === 1)) { return false }
  const unit = selection[0].counter.unit
  if (mapSelectMovement(game, true) <= movementPastCost(game.scenario.map, unit as Unit)) { return false }

  for (const s of selection) {
    if (s.counter.children.length > 0) { return true }
  }
  if (action.move.path.length === 1) { return false }
  return true
}

export function showLoadMove(game: Game): boolean {
  if (rushing(game)) { return false }
  const move = game.gameState?.move
  const selection = game.gameState?.selection
  if (!selection || move?.placingSmoke || move?.droppingMove) { return false }
  for (const s of selection) {
    if (canLoadUnit(game, s.counter.unit)) { return true }
  }
  return false
}

export function canBeLoaded(game: Game, target: Unit): boolean {
  if (!game.gameState) { return false }
    let unit = game.gameState.move?.loader?.unit as Unit
    if (!unit) { unit = game.gameState.selection[0].counter.unit as Unit }
    const path = game.gameState?.move?.path
    if (target.crewed && path && path.length > 1) { return false }
    return unit.canCarry(target)
}

export function canLoadUnit(game: Game, unit: Unit): boolean {
  const lastPath = game.lastPath
  if (!lastPath) { return false }
  const counters = game.scenario.map.countersAt(new Coordinate(lastPath.x, lastPath.y))
  for (const c of counters) {
    if (c.hasFeature || c.unit.selected || c.unit.loadedSelected) { continue }
    const path = game.gameState?.move?.path
    if (c.unit.crewed && path && path.length > 1) { continue}
    if (unit.canCarry(c.unit)) {
      return true
    }
  }
  return false
}

export function alongRoad(from: Hex, to: Hex, dir: Direction, pathOk: boolean = false): boolean {
  if (from.coord.x === to.coord.x && from.coord.y === to.coord.y && to.road) { return true }
  if (!from.road || !to.road || !rotateRoads(to)?.includes(normalDir(dir + 3)) ||
      !rotateRoads(from)?.includes(dir)) {
    return false
  }
  if (pathOk) { return true }
  if (from.roadType === roadType.Path || to.roadType === roadType.Path) {
    return false
  }
  return true
}

export function alongRailroad(from: Hex, to: Hex, dir: Direction,): boolean {
  if (from.coord.x === to.coord.x && from.coord.y === to.coord.y) { return true }
  if (!from.railroad || !to.railroad || !to.railroadDirections || !from.railroadDirections) {
    return false
  }
  for (const trr of to.railroadDirections) {
    for (const frr of from.railroadDirections) {
      if (trr.includes(normalDir(dir + 3)) && frr.includes(dir)) {
        return true
      }
    }
  }
  return false
}

export function alongStream(from: Hex, to: Hex, dir: Direction): boolean {
  if (!from.river || !to.river || !to.riverDirections?.includes(normalDir(dir + 3)) ||
      !from.riverDirections?.includes(dir)) {
    return false
  }
  return true
}

function smokeOpenHex(map: Map, from: Coordinate, to: Coordinate, selection: Unit): HexOpenType {
  const distance = hexDistance(from, to)
  const past = movementPastCost(map, selection)
  const move = mapSelectMovement(map.game as Game, false)
  if (distance < 1 && move > past) { return 1 }
  if (distance < 2 && move > past + 1) { return 2 }
  return hexOpenType.Closed
}

function allAlongRoad(map: Map): boolean {
  const game = map.game
  if (!game?.gameState?.move) { return false }
  if (game.gameState.move.addActions.filter(a => a.cost > 0).length > 0) { return false }
  const length = game.gameState.move.path.length
  for (let i = 0; i < length - 1; i++) {
    const p1 = game.gameState.move.path[i]
    const p2 = game.gameState.move.path[i+1]
    const loc1 = new Coordinate(p1.x, p1.y)
    const loc2 = new Coordinate(p2.x, p2.y)
    if (!alongRoad(
      map.hexAt(loc1) as Hex, map.hexAt(loc2) as Hex, map.relativeDirection(loc1, loc2) as Direction
    )) {
      return false
    }
  }
  return true
}

function rotateRoads(hex: Hex) {
  if (!hex.roadDirections) { return undefined }
  return hex.roadDirections.map(d => normalDir(d + (hex.roadRotation ?? 0)))
}
