import { Coordinate, hexOpenType, HexOpenType, unitStatus, unitType } from "../../utilities/commonTypes";
import { los } from "../../utilities/los";
import { hexDistance } from "../../utilities/utilities";
import Counter from "../Counter";
import Game from "../Game";
import Map from "../Map";
import Unit from "../Unit";

export function openHexFiring(map: Map, from: Coordinate, to: Coordinate): HexOpenType {
  if (!map.game?.gameActionState?.fire) { return hexOpenType.Closed }
  const fire = map.game.gameActionState.fire
  if (!fire.doneSelect) {
    const leadership = leadershipRange(map.game)
    if (!leadership) {
      if (from.x === to.x && from.y === to.y) { return hexOpenType.Open }
    } else {
      if (hexDistance(from, to) <= leadership) { return hexOpenType.Open }
    }
  } else {
    if (inRange(map.game, to)) { return hexOpenType.Open }
  }
  return hexOpenType.Closed
}

export function leadershipRange(game: Game): number | false {
  if (!game?.gameActionState?.fire) { return false }
  const init = game.gameActionState.fire.initialSelection[0]
  let leadership = -1
  for (const sel of game.gameActionState.selection) {
    const unit = sel.counter.unit
    if (unit.type === unitType.Leader && sel.x === init.x && sel.y === init.y) {
      if (unit.currentLeadership > leadership) { leadership = unit.currentLeadership }
    }
  }
  return leadership < 0 ? false : leadership
}

export function canMultiSelectFire(game: Game, x: number, y: number, unit: Unit): boolean {
  if (unit.targetedRange || unit.isTracked || unit.isWheeled) { return false }
  if (unit.children.length > 0 && !unit.children[0].targetedRange &&
      unit.children[0].status === unitStatus.Normal) { return true }
  const counters = game.scenario.map.countersAt(new Coordinate(x, y))
  for (const c of counters) {
    if (c.hasUnit && c.unit.id !== unit.id && c.unit.type === unitType.Leader) { return true }
  }
  return false
}

export function rapidFire(game: Game): boolean {
  if (!game?.gameActionState?.fire) { return false }
  for (const sel of game.gameActionState.selection) {
    if (!sel.counter.unit.rapidFire) { return false }
  }
  return true
}

export function areaFire(game: Game) {
  if (!game?.gameActionState?.fire) { return false }
  const init = game.gameActionState.fire.initialSelection[0]
  if (init.counter.unit.areaFire) { return true }
  if (init.counter.unit.targetedRange) { return false }
  return true
}

export function unTargetSelectExceptChain(game: Game, x: number, y: number) {
  if (!game?.gameActionState?.fire) { return false }
  const hexes = [new Coordinate(x, y)]

  let check = true
  let count = 0
  while(check) {
    if (count++ > 999) {
      console.log("aborting possible infinite loop in unTargetSelectExceptChain")
      break
    }
    check = false
    for (const sel of game.gameActionState.fire.targetSelection) {
      let hexCheck = false
      for (const hex of hexes) {
        if (hex.x === sel.x && hex.y === sel.y) {
          hexCheck = true
          break
        }
      }
      if (!hexCheck) {
        let minDist = 99
        for (const hex of hexes) {
          const dist = hexDistance(hex, new Coordinate(sel.x, sel.y))
          if (dist < minDist) { minDist = dist }
        }
        if (minDist === 1) {
          hexes.push(new Coordinate(sel.x, sel.y))
          check = true
          break
        }
      }
    }
  }
  const units = game.scenario.map.allUnits
  for (const u of units) {
    check = false
    for (const h of hexes) {
      const hex = u.hex as Coordinate
      if (h.x === hex.x && h.y === hex.y) {
        check = true
        break
      }
    }
    if (!check && u.unit.targetSelected) { u.unit.targetSelect() }
  }
}

export function refreshTargetSelection(game: Game) {
  if (!game?.gameActionState?.fire) { return false }
  const targets = []
  const units = game.scenario.map.allUnits
  for (const u of units) {
    const hex = u.hex as Coordinate
    if (u.unit.targetSelected) {
      targets.push({ x: hex.x, y: hex.y, id: u.unit.id, counter: u })
    }
  }
  game.gameActionState.fire.targetSelection = targets
}

function inRange(game: Game, to: Coordinate): boolean {
  if (!game?.gameActionState?.fire) { return false }
  let leaderRange = true
  let leaderOnly = true
  for (const sel of game.gameActionState.selection) {
    const unit = sel.counter.unit
    const from = sel.counter.hex as Coordinate
    if (from.x === to.x && from.y === to.y) { return false }
    if (!los(game.scenario.map, from, to)) { return false }
    if (unit.type !== unitType.Leader) {
      if (unit.currentRange < hexDistance(from, to)) { return false }
      if (!inFiringArc(game, sel.counter, to)) { return false }
      leaderOnly = false
    } else {
      if (unit.currentRange < hexDistance(from, to)) { leaderRange = false }
    }
  }
  return leaderOnly ? leaderRange : true
}

function inFiringArc(game: Game, counter: Counter, to: Coordinate): boolean {
  if (!counter.unit.rotates) { return true }
  const map = game.scenario.map
  const from = counter.hex as Coordinate
  const start = new Coordinate(map.xOffset(from.x, from.y), map.yOffset(from.y))
  const end = new Coordinate(map.xOffset(to.x, to.y), map.yOffset(to.y))
  const dx = start.x - end.x
  const dy = end.y - start.y
  const last = game.lastPath
  const facing = (counter.unit.turreted && !game.sponsonFire ? last?.turret : counter.unit.facing) ?? 1
  const a = (Math.atan2(dy,dx) * 180 / Math.PI + facing * 60) % 360
  if (a > 29.99 && a < 90.01) { return true }
  return false
}