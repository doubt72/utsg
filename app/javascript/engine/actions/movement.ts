import { Coordinate, Direction, hexOpenType, HexOpenType, roadType, unitType } from "../../utilities/commonTypes"
import { hexDistance, normalDir, stackLimit } from "../../utilities/utilities"
import Game from "../Game"
import Hex from "../Hex"
import Map from "../Map"
import Unit from "../Unit"
import { currSelection } from "./actionsAvailable"

export function mapSelectMovement(game: Game, roadMove: boolean): number {
  if (!game.gameActionState?.selection) { return 0 }
  const map = game.scenario.map
  const road = allAlongRoad(map)
  const selection = game.gameActionState.selection[0].counter
  const next = selection.children[0]
  const allRoad = road && roadMove && !selection.target.isWheeled &&
                  !(next && next.target.crewed) ? 1 : 0
  let move = selection.target.currentMovement as number + allRoad
  if (selection.target.canCarrySupport) {
    let minLdrMove = 99
    let minInfMove = 99
    for(const sel of game.gameActionState.selection) {
      let check = false
      if (game.gameActionState.move?.addActions) {
        for (const add of game.gameActionState.move.addActions) {
          if (add.type === "shortdrop" && add.meta?.fromIndex === sel.i) {
            check = true
            continue
          }
        }
      }
      if (check) { continue }
      const u = sel.counter.target
      const move = u.currentMovement as number
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
  if (action.shortDropMove) { return hexOpenType.Closed }
  if (action.loadingMove) { return hexOpenType.Closed }
  if (!game.gameActionState.selection) { return false }
  const selection = game.gameActionState.selection[0].counter
  if (action.placingSmoke) {
    return smokeOpenHex(map, from, to, selection.target as Unit)
  }
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

  const countersAt = map.countersAt(to)
  const moveSize = game.gameActionState.selection.reduce(
    (sum, u) => sum + u.counter.target.size + u.counter.children.reduce((sum, u) => u.target.size, 0), 0
  )
  const toSize = countersAt.reduce(
    (sum, u) => sum + u.target.size + u.children.reduce((sum, u) => u.target.size, 0), 0
  )
  if (moveSize + toSize > stackLimit) { return false }
  for (const c of countersAt) {
    if (selection.target.playerNation !== c.target.playerNation && !c.target.isFeature) { return false }
  }

  const roadMove = alongRoad(hexFrom, hexTo, dir)
  if (selection.target.isWheeled || selection.target.isTracked) {
    if (!terrTo.vehicle && !roadMove) { return false }
    if (terrTo.vehicle === "amph" && !roadMove && !selection.target.amphibious) { return false }
  }
  const next = selection.children[0]
  const facing = game.lastPath?.facing as Direction
  if (next && next.target.crewed) {
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
    if (next && next.target.crewed && !terrFrom.borderGun) { return false }
  }
  if (hexTo.border && hexTo.borderEdges?.includes(dir)) {
    if (!terrTo.borderMove) { return false }
    if ((selection.target.isWheeled || selection.target.isTracked) && !terrTo.borderVehicle) {
      return false
    }
    if (next && next.target.crewed && !terrTo.borderGun) { return false }
  }
  if (selection.target.rotates) {
    if (normalDir(dir + 3) !== facing && dir !== facing) { return false }
  }

  const length = action.path.length + action.addActions.length
  const cost = movementCost(map, from, to, selection.target as Unit)
  const pastCost = movementPastCost(map, selection.target as Unit)
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
  if (hexTo.border && hexTo.borderEdges?.includes(dir)) {
    cost += terrTo.borderMove as number
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
  if (target.rotates && normalDir(dir + 3) === target.facing) { cost *= 2 }
  return cost
}

export function showDropSmoke(game: Game): boolean {
  const move = game.gameActionState?.move
  if (move?.loadingMove || move?.shortDropMove) { return false }
  const moveSelect = currSelection(game, true)
  if (!moveSelect) { return false }
  return moveSelect.smokeCapable && !moveSelect.targetedRange &&
    movementPastCost(game.scenario.map, moveSelect) < mapSelectMovement(game, true)
}

export function showShortDropMove(game: Game): boolean {
  const action = game.gameActionState
  if (!action?.move) { return false }
  if (action?.move?.loadingMove || action?.move?.placingSmoke) { return false }
  const selection = action.selection
  if (!selection || selection.length === 1) { return false }
  const unit = selection[0].counter.target
  if (mapSelectMovement(game, true) <= movementPastCost(game.scenario.map, unit as Unit)) { return false }
  for (let i = 0; i < selection.length; i++) {
    let check = false
    for (const a of action.move.addActions) {
      if (a.type === "shortdrop" && a.meta?.fromIndex === selection[i].i) { check = true }
    }
    if (!check) { return true }
  }
  return false
}

export function canBeLoaded(game: Game, target: Unit): boolean {
    let unit = game.gameActionState?.move?.loader?.target as Unit
    if (!unit) {
      if (!game.gameActionState?.selection) {
        return false
      } else {
        unit = game.gameActionState.selection[0].counter.target as Unit
      }
    }
    return unit.canCarry(target)
}

export function canLoadUnit(game: Game, unit: Unit): boolean {
  const lastPath = game.lastPath
  if (!lastPath) { return false }
  const counters = game.scenario.map.countersAt(new Coordinate(lastPath.x, lastPath.y))
  for (const c of counters) {
    if (c.target.selected || c.target.loadedSelected || c.target.isFeature) { continue }
    if (unit.canCarry(c.target as Unit)) { return true }
  }
  return false
}

export function showLoadMove(game: Game): boolean {
  const move = game.gameActionState?.move
  if (move?.placingSmoke || move?.shortDropMove) { return false }
  const selection = game.gameActionState?.selection
  if (!selection) { return false }
  for (const s of selection) {
    if (canLoadUnit(game, s.counter.target as Unit)) { return true }
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

function alongRoad(from: Hex, to: Hex, dir: Direction, pathOk: boolean = false): boolean {
  if (from.coord.x === to.coord.x && from.coord.y === to.coord.y) { return true }
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

function alongStream(from: Hex, to: Hex, dir: Direction): boolean {
  if (!from.river || !to.river || !to.riverDirections?.includes(normalDir(dir + 3)) ||
      !from.riverDirections?.includes(dir)) {
    return false
  }
  return true
}
