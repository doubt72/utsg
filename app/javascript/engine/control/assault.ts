import {
  baseTerrainType, Coordinate, featureType, terrainType,
  unitType
} from "../../utilities/commonTypes"
import Game from "../Game"
import Hex from "../Hex"

export function showClearObstacles(game: Game): boolean {
  if (!showCommon(game)) { return false }
  const selection = game.assaultState.selection
  const unit = selection[0].counter.unit
  if (!unit.engineer) { return false }
  const features = game.scenario.map.countersAt(new Coordinate(selection[0].x, selection[0].y))
  for (const f of features) {
    if (f.hasFeature && [featureType.Mines, featureType.Wire].includes(f.feature.type)) {
      return true
    }
  }
  return false
}

export function showEntrench(game: Game): boolean {
  if (!showCommon(game, false)) { return false }
  const selection = game.assaultState.selection
  if (selection.filter(s => s.counter.unit.parent === undefined).length > 1) { return false }
  if (game.scenario.specialRules.includes("winter")) { return false }
  if (![unitType.Squad, unitType.Team].includes(selection[0].counter.unit.type)) { return false }
  if (game.scenario.map.baseTerrain === baseTerrainType.Snow) { return false }
  if (game.scenario.map.baseTerrain === baseTerrainType.Mud) { return false }
  const loc = new Coordinate(selection[0].x, selection[0].y)
  const hex = game.scenario.map.hexAt(loc) as Hex
  if (!hex.terrain.vehicle || [terrainType.Sand, terrainType.Shallow].includes(hex.baseTerrain)) { return false }
  if (hex.river || hex.railroad) { return false }
  if (hex.building) { return false }
  const features = game.scenario.map.countersAt(loc)
  for (const f of features) {
    if (f.hasFeature && f.feature.name !== "Shell Scrape") { return false }
  }
  return true
}

export function showAbandon(game: Game): boolean {
  if (!showCommon(game)) { return false }
  const selection = game.assaultState.selection
  const unit = selection[0].counter.unit
  if (![unitType.Tank, unitType.SelfPropelledGun].includes(unit.type) || unit.isAbandoned) { return false }
  return true
}

export function showRepair(game: Game): boolean {
  if (!showCommon(game)) { return false }
  const selection = game.assaultState.selection
  const unit = selection[0].counter.unit
  if (!unit.tankCrew) { return false }
  const counters = game.scenario.map.countersAt(new Coordinate(selection[0].x, selection[0].y))
  for (const f of counters) {
    if (f.hasUnit && f.unit.isVehicle && f.unit.isImmobilized && f.unit.playerNation === unit.playerNation) {
      if (f.unit.isActivated || f.unit.isExhausted) { continue }
      return true
    }
  }
  return false
}

export function showCrew(game: Game): boolean {
  if (!showCommon(game)) { return false }
  const selection = game.assaultState.selection
  const unit = selection[0].counter.unit
  if (!unit.tankCrew) { return false }
  const counters = game.scenario.map.countersAt(new Coordinate(selection[0].x, selection[0].y))
  for (const f of counters) {
    if (f.hasUnit && [unitType.Tank, unitType.SelfPropelledGun].includes(f.unit.type) &&
        f.unit.isAbandoned && f.unit.playerNation === unit.playerNation) {
      return true
    }
  }
  return false
}

function showCommon(game: Game, multi: boolean = true): boolean {
  if (!game.gameState) { return false }
  const selection = game.assaultState.selection
  if (multi && selection.length > 1) { return false }
  if (game.scenario.map.contactAt(new Coordinate(selection[0].x, selection[0].y))) { return false }
  if (game.assaultState.path.length + game.assaultState.addActions.length > 1) { return false }
  return true
}

export function assaultMovement(game: Game): number {
  if (!game.gameState) { return 0 }
  const selection = game.assaultState.selection[0].counter
  let assault = selection.unit.currentMovement as number
  if (selection.unit.canCarrySupport) {
    let minMove = 99
    for(const sel of game.assaultState.selection) {
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
