import {
  baseTerrainType, Coordinate, featureType, hexOpenType, HexOpenType, terrainType,
  unitType
} from "../../utilities/commonTypes"
import { normalDir, stackLimit } from "../../utilities/utilities"
import Game from "../Game"
import Hex from "../Hex"
import Map from "../Map"
import { alongRailroad, alongRoad } from "./movement"

export function openHexAssaulting(map: Map, from: Coordinate, to: Coordinate): HexOpenType {
  const game = map.game
  if (!game?.gameActionState?.assault) { return hexOpenType.Closed }
  if (!game.gameActionState.selection) { return hexOpenType.Closed }
  if (from.x === to.x && from.y === to.y) {return hexOpenType.Closed }

  const hexFrom = map.hexAt(from) as Hex;
  const hexTo = map.hexAt(to) as Hex;
  const dir = map.relativeDirection(from, to)
  if (!dir) { return hexOpenType.Closed }

  const action = game?.gameActionState.assault
  const selection = game.gameActionState.selection[0].counter
  const terrFrom = hexFrom.terrain
  const terrTo = hexTo.terrain
  const roadMove = alongRoad(hexFrom, hexTo, dir)
  const railroadMove = alongRailroad(hexFrom, hexTo, dir)

  if (!terrTo.move && !roadMove && !railroadMove) { return hexOpenType.Closed }
  if (!terrTo.move && railroadMove) {
    if (selection.unit.isVehicle) { return hexOpenType.Closed }
  }
  if (selection.unit.isVehicle) {
    if ((!terrTo.vehicle || !terrFrom.vehicle) && !roadMove) { return hexOpenType.Closed }
    if ((terrTo.vehicle === "amph") && !roadMove && !selection.unit.amphibious) { return hexOpenType.Closed }
  }
  if (hexFrom.border && hexFrom.borderEdges?.includes(dir)) {
    if (!terrFrom.borderMove) { return hexOpenType.Closed }
    if (selection.unit.isVehicle && !terrFrom.borderVehicle) {
      return hexOpenType.Closed
    }
  }
  if (hexTo.border && hexTo.borderEdges?.includes(normalDir(dir+3))) {
    if (!terrTo.borderMove) { return hexOpenType.Closed }
    if (selection.unit.isVehicle && !terrTo.borderVehicle) {
      return hexOpenType.Closed
    }
  }

  const moveSize = game.gameActionState.selection.filter(u => !u.counter.unit.parent).reduce(
    (sum, u) => sum + u.counter.unit.size + u.counter.unit.children.reduce((sum, u) => u.size, 0), 0
  )
  const toSize = map.sizeAt(to)
  const countersAt = map.countersAt(to)
  let check = false
  for (const c of countersAt) {
    if (c.hasUnit && selection.unit.playerNation !== c.unit.playerNation) { check = true }
  }
  if (moveSize + toSize > stackLimit && !check) { return hexOpenType.Closed }

    if (action.path.length + action.addActions.length > 1) { return hexOpenType.Closed }
  if (assaultMovement(game) === 0) { return hexOpenType.Closed }
  return hexOpenType.All
}

export function showClearObstacles(game: Game): boolean {
  const assault = game.gameActionState?.assault
  const selection = game.gameActionState?.selection
  if (!assault || !selection) { return false }
  if (selection.length > 1) { return false }
  if (assault.path.length + assault.addActions.length > 1) { return false }
  let eng = false
  for (const s of selection) {
    if (s.counter.unit.engineer) {
      eng = true
      break
    }
  }
  if (!eng) { return false }
  const features = game.scenario.map.countersAt(new Coordinate(selection[0].x, selection[0].y))
  for (const f of features) {
    if (f.hasFeature && [featureType.Mines, featureType.Wire].includes(f.feature.type)) {
      return true
    }
  }
  return true
}

export function showEntrench(game: Game): boolean {
  const assault = game.gameActionState?.assault
  const selection = game.gameActionState?.selection
  if (!assault || !selection) { return false }
  if (selection.length > 1) { return false }
  if (![unitType.Squad, unitType.Team].includes(selection[0].counter.unit.type)) { return false }
  if (assault.path.length + assault.addActions.length > 1) { return false }
  if (game.scenario.map.baseTerrain === baseTerrainType.Snow) { return false }
  const loc = new Coordinate(selection[0].x, selection[0].y)
  const hex = game.scenario.map.hexAt(loc) as Hex
  if (!hex.terrain.vehicle || [terrainType.Sand, terrainType.Shallow].includes(hex.baseTerrain)) { return false }
  if (hex.river || hex.railroad) { return false }
  if (hex.building) { return false }
  const features = game.scenario.map.countersAt(loc)
  for (const f of features) {
    if (f.hasFeature) { return false }
  }
  return true
}

function assaultMovement(game: Game): number {
  if (!game.gameActionState) { return 0 }
  const selection = game.gameActionState.selection[0].counter
  let assault = selection.unit.currentMovement as number
  if (selection.unit.canCarrySupport) {
    let minMove = 99
    for(const sel of game.gameActionState.selection) {
      const u = sel.counter.unit
      let move = u.currentMovement as number
      if (u.children.length > 0) {
        const child = u.children[0]
        if (child.uncrewedSW) { move += child.baseMovement }
        if (child.uncrewedSW && u.leader) { move -= 2 }
      }
      if (u.canCarrySupport && move < minMove) { minMove = move }
    }
    assault = minMove
  }
  return assault
}
