import { Coordinate, Direction, hexOpenType, HexOpenType, roadType, unitType } from "../../utilities/commonTypes"
import { hexDistance, normalDir, stackLimit } from "../../utilities/utilities"
import Game from "../Game"
import { addActionType } from "../GameAction"
import Hex from "../Hex"
import Map from "../Map"
import Unit from "../Unit"

export function mapSelectMovement(game: Game, roadMove: boolean): number {
  if (!game.gameActionState) { return 0 }
  const map = game.scenario.map
  const road = allAlongRoad(map)
  const selection = game.gameActionState.selection[0].counter
  const next = selection.children[0]
  const allRoad = road && roadMove && !selection.unit.isWheeled &&
                  !(next && next.unit.crewed) ? 1 : 0
  let move = selection.unit.currentMovement as number + allRoad
  if (selection.unit.canCarrySupport) {
    let minLdrMove = 99
    let minInfMove = 99
    for(const sel of game.gameActionState.selection) {
      let check = false
      if (game.gameActionState.move?.addActions) {
        for (const add of game.gameActionState.move.addActions) {
          if (add.type === addActionType.Drop && add.id === sel.id) {
            check = true
            continue
          }
        }
      }
      if (check) { continue }
      const u = sel.counter.unit
      let move = u.currentMovement as number
      if (u.children.length > 0) {
        const child = u.children[0]
        if (child.crewed) { move = child.baseMovement }
        if (child.uncrewedSW) { move += child.baseMovement }
        if (child.uncrewedSW && u.type === "ldr") { move -= 1 }
      }
      if (u.canCarrySupport && u.type !== unitType.Leader && move < minInfMove) { minInfMove = move }
      if (u.type === unitType.Leader && move < minLdrMove) { minLdrMove = move }
    }
    if (minLdrMove === 99) {
      move = minInfMove + allRoad
    } else {
      minInfMove += 1
      move = (minInfMove < minLdrMove ? minInfMove : minLdrMove) + allRoad
    }
  }
  return move
}

export function openHexMovement(map: Map, from: Coordinate, to: Coordinate): HexOpenType {
  const game = map.game
  if (!game?.gameActionState?.move) { return false }
  const action = game?.gameActionState.move
  if (action.droppingMove) { return hexOpenType.Closed }
  if (action.loadingMove) { return hexOpenType.Closed }
  if (!game.gameActionState.selection) { return false }
  const selection = game.gameActionState.selection[0].counter
  if (action.placingSmoke) {
    return smokeOpenHex(map, from, to, selection.unit)
  }
  if (from.x === to.x && from.y === to.y) {
    return false;
  }
  const hexFrom = map.hexAt(from) as Hex;
  const hexTo = map.hexAt(to) as Hex;
  const terrFrom = hexFrom.terrain
  const terrTo = hexTo.terrain
  const dir = map.relativeDirection(from, to)
  if (!dir) { return false }
  const roadMove = alongRoad(hexFrom, hexTo, dir)
  const railroadMove = alongRailroad(hexFrom, hexTo, dir)
  if (!terrTo.move && !roadMove && !railroadMove) { return false }
  const next = selection.children[0]
  if (!terrTo.move && (roadMove || railroadMove)) {
    if (selection.unit.isWheeled || selection.unit.isTracked) { return false }
    if (next && next.unit.crewed) { return false }
  }

  const countersAt = map.countersAt(to)
  const moveSize = game.gameActionState.selection.filter(u => !u.counter.unit.parent).reduce(
    (sum, u) => sum + u.counter.unit.size + u.counter.unit.children.reduce((sum, u) => u.size, 0), 0
  )
  const toSize = countersAt.filter(u => !u.hasFeature && !u.unit.parent).reduce(
    (sum, u) => sum + u.unit.size + u.children.reduce((sum, u) => u.unit.size, 0), 0
  )
  if (moveSize + toSize > stackLimit) { return false }
  for (const c of countersAt) {
    if (c.hasUnit && selection.unit.playerNation !== c.unit.playerNation) { return false }
  }

  if (selection.unit.isWheeled || selection.unit.isTracked) {
    if (!terrTo.vehicle && !roadMove) { return false }
    if (terrTo.vehicle === "amph" && !roadMove && !selection.unit.amphibious) { return false }
  }
  const facing = game.lastPath?.facing as Direction
  if (next && next.unit.crewed) {
    if (!terrTo.gun && !roadMove) { return false }
    if (terrTo.gun === "back" && dir !== normalDir(facing + 3)) {
      return false
    }
  }
  if (hexFrom.border && hexFrom.borderEdges?.includes(dir)) {
    if (!terrFrom.borderMove) { return false }
    if ((selection.unit.isWheeled || selection.unit.isTracked) && !terrFrom.borderVehicle) {
      return false
    }
    if (next && next.unit.crewed && !terrFrom.borderGun) { return false }
  }
  if (hexTo.border && hexTo.borderEdges?.includes(dir)) {
    if (!terrTo.borderMove) { return false }
    if ((selection.unit.isWheeled || selection.unit.isTracked) && !terrTo.borderVehicle) {
      return false
    }
    if (next && next.unit.crewed && !terrTo.borderGun) { return false }
  }
  if (selection.unit.canHandle && (next && next.unit.crewed)) {
    if (action.addActions.filter(a => a.id === next.unit.id).length < 1) {
      if (normalDir(dir + 3) !== facing && dir !== facing) { return false }
    }
  }
  if (selection.unit.rotates) {
    if (normalDir(dir + 3) !== facing && dir !== facing) { return false }
  }

  const length = action.path.length + action.addActions.length
  const cost = movementCost(map, from, to, selection.unit)
  const pastCost = movementPastCost(map, selection.unit)
  const move = mapSelectMovement(game, roadMove)
  if (move < cost + pastCost && length > 1) { return false }
  for (const p of action.path) {
    if (to.x === p.x && to.y === p.y ) { return hexOpenType.Open }
  }
  return move >= cost + pastCost ? cost : "all"
}

export function movementPastCost(map: Map, target: Unit): number {
  const game = map.game
  if (!game?.gameActionState?.move) { return 0 }
  const move = game.gameActionState.move
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
      if ((target.isWheeled || target.isTracked) && hexFrom.roadType !== roadType.Path) { return 1 }
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
  const move = game.gameActionState?.move
  const selection = game.gameActionState?.selection
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
  const action = game.gameActionState
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
  const move = game.gameActionState?.move
  const selection = game.gameActionState?.selection
  if (!selection || move?.placingSmoke || move?.droppingMove) { return false }
  for (const s of selection) {
    if (canLoadUnit(game, s.counter.unit)) { return true }
  }
  return false
}

export function canBeLoaded(game: Game, target: Unit): boolean {
  if (!game.gameActionState) { return false }
    let unit = game.gameActionState.move?.loader?.unit as Unit
    if (!unit) { unit = game.gameActionState.selection[0].counter.unit as Unit }
    const path = game.gameActionState?.move?.path
    if (target.crewed && path && path.length > 1) { return false }
    return unit.canCarry(target)
}

export function canLoadUnit(game: Game, unit: Unit): boolean {
  const lastPath = game.lastPath
  if (!lastPath) { return false }
  const counters = game.scenario.map.countersAt(new Coordinate(lastPath.x, lastPath.y))
  for (const c of counters) {
    if (c.hasFeature || c.unit.selected || c.unit.loadedSelected) { continue }
    const path = game.gameActionState?.move?.path
    if (c.unit.crewed && path && path.length > 1) { continue}
    if (unit.canCarry(c.unit)) {
      return true
    }
  }
  return false
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
  if (!game?.gameActionState?.move) { return false }
  if (game.gameActionState.move.addActions.filter(a => a.cost > 0).length > 0) { return false }
  const length = game.gameActionState.move.path.length
  for (let i = 0; i < length - 1; i++) {
    const p1 = game.gameActionState.move.path[i]
    const p2 = game.gameActionState.move.path[i+1]
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

function alongRoad(from: Hex, to: Hex, dir: Direction, pathOk: boolean = false): boolean {
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

function alongRailroad(from: Hex, to: Hex, dir: Direction,): boolean {
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

function alongStream(from: Hex, to: Hex, dir: Direction): boolean {
  if (!from.river || !to.river || !to.riverDirections?.includes(normalDir(dir + 3)) ||
      !from.riverDirections?.includes(dir)) {
    return false
  }
  return true
}
