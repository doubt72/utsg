import { Coordinate, hexOpenType, HexOpenType, unitStatus, unitType } from "../../utilities/commonTypes";
import { los } from "../../utilities/los";
import { hexDistance } from "../../utilities/utilities";
import Counter from "../Counter";
import Game from "../Game";
import Hex from "../Hex";
import Map from "../Map";
import Unit from "../Unit";
import { ActionSelection } from "./gameActions";

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
    if (!sel.counter.unit.rapidFire && sel.counter.unit.type !== unitType.Leader) { return false }
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

export function fireHindranceAll(
  game: Game, source: ActionSelection[], targets: ActionSelection[]
): boolean | number {
  let hindrance = -1
  for (let i = 0; i < source.length; i++) {
    const sel = source[i]
    for (let j = 0; j < targets.length; j++) {
      const targ = targets[j]
      const check = los(game.scenario.map, new Coordinate(sel.x, sel.y), new Coordinate(targ.x, targ.y))
      if (check !== true && check !== false && Number(check.value) > hindrance) {
        hindrance = Number(check.value)
      }
      if (check === true && hindrance < 0) { hindrance = 0 }
    }
  }
  return hindrance < 0 ? false : hindrance
}

export function fireHindrance(
  game: Game, source: ActionSelection[], to: Coordinate
): boolean | number {
  let hindrance = -1
  for (let i = 0; i < source.length; i++) {
    const sel = source[i]
    const check = los(game.scenario.map, new Coordinate(sel.x, sel.y), to)
    if (check !== true && check !== false && Number(check.value) > hindrance) {
      hindrance = Number(check.value)
    }
    if (check === true && hindrance < 0) { hindrance = 0 }
  }
  return hindrance < 0 ? false : hindrance
}

export function firepower(source: ActionSelection[], target: Unit, to: Coordinate, sponson: boolean): number {
  let fp = 0
  for (let i = 0; i < source.length; i++) {
    const sel = source[i]
    const sunit = sel.counter.unit
    const dist = hexDistance(new Coordinate(sel.x, sel.y), to)
    if (sponson && sunit.sponson) {
      if (sunit.sponson.range >= dist) { fp += sunit.sponson.firepower}
    } else {
      if (sunit.currentRange >= dist) { fp += sunit.currentFirepower }
    }
  }
  console.log(fp)
  if (source.length === 1) {
    const sunit = source[0].counter.unit
    if (sunit.antiTank && (target.canCarrySupport)) {
      fp = Math.floor(fp/2)
    }
    if (target.armored && sunit.fieldGun) {
      fp = Math.floor(fp/2)
    }
    if (sunit.immobilized && (!sunit.turreted || sponson)) {
      fp = Math.floor(fp/2)
    }
    if (sunit.turreted && sunit.turretJammed && !sponson) {
      fp = Math.floor(fp/2)
    }
  }
  return fp
}

export function untargetedModifiers(
  game: Game, source: ActionSelection[], targets: ActionSelection[], react: boolean
): { mod: number, why: string[] } {
  // Break down by location
  const why: string[] = []
  let mod = 0
  let gthalf = false
  let adj = true
  let elev = -1
  let pinned = false
  let tired = false
  let rapid = false
  let intense = false
  const map = game.scenario.map
  const first = targets[0].counter.hex as Coordinate
  for (let i = 0; i < source.length; i++) {
    const sel = source[i]
    const sunit = sel.counter.unit
    for (let j = 0; j < targets.length; j++) {
      const targ = targets[j]
      const from = new Coordinate(sel.x, sel.y)
      const to = new Coordinate(targ.x, targ.y)
      const dist = hexDistance(from, to)
      if (dist > sunit.currentRange/2 && sunit.type !== unitType.Leader) { gthalf = true }
      if (dist > 1) { adj = false }
      const check = (map.hexAt(to) as Hex).elevation - (map.hexAt(from) as Hex).elevation
      if (check === 0 && elev < 0) { elev = 0 }
      if (check > 0) { elev = 1}
      if (sunit.isPinned) { pinned = true }
      if (sunit.isTired) { tired = true }
      if (sunit.isActivated) { intense = true }
      if (j > 0 && !rapid) {
        if (to.x !== first.x || to.y !== first.y) { rapid = true }
      }
    }
  }
  if (gthalf) {
    mod += 1
    why.push("- plus 1 for more than half range")
  }
  if (adj) {
    mod -= 1
    why.push("- minus 1 for adjacent")
  }
  if (elev > 0 ) {
    mod += 1
    why.push("- plus 1 for firing uphill")
  }
  if (elev < 0 ) {
    mod -= 1
    why.push("- minus 1 for firing downhill")
  }
  if (pinned || tired) {
    mod += 1
    if (pinned) {
      why.push("- plus 1 for pinned")
    } else {
      why.push("- plus 1 for tired")
    }
  }
  if (rapid) {
    mod += 2
    why.push("- plus 2 for rapid fire")
  }
  if (react) {
    mod += 1
    why.push("- plus 1 for reaction fire")
  }
  if (intense) {
    mod += 2
    why.push("- plus 2 intensive fire")
  }
  return { mod, why }
}

export function rangeMultiplier(
  map: Map, source: Counter, target: Coordinate, sponson: boolean, turretMoved: boolean,
): { mult: number, why: string[] } {
  const why: string[] = []
  let mult = 3
  if (source.unit.offBoard) {
    mult = 4
    why.push("- base multiplier 4")
    const leadership = source.unit.parent?.leadership ? source.unit.parent.leadership : undefined
    if (leadership) {
      mult -= leadership
      why.push(`- minus leadership ${leadership}`)
    }
  } else if (source.unit.type === unitType.SupportWeapon && source.unit.targetedRange) {
    mult = 3
    why.push("- base multiplier 3")
  } else if (source.unit.crewed) {
    mult = 4
    why.push("- base multiplier 4")
    const handling = source.unit.parent?.gunHandling ? source.unit.parent.gunHandling : undefined
    if (handling) {
      mult -= handling
      why.push(`- minus gun handling ${handling}`)
    }
  } else { why.push("- base multiplier 3") }
  if (source.unit.turreted && !sponson) {
    if (source.unit.turretJammed) {
      mult += 1
      why.push("- plus 1 for jammed turret")
    }
  } else {
    if (source.unit.immobilized) {
      mult += 1
      why.push("- plus 1 for immobilized")
    }
  }
  if (source.unit.eliteCrew) {
    mult -= source.unit.eliteCrew
    if (source.unit.eliteCrew > 0) { why.push("- minus 1 for elite crew") }
    if (source.unit.eliteCrew < 0) { why.push("- plus 1 for green crew") }
  }
  const eFrom = (map.hexAt(source.hex as Coordinate) as Hex).elevation
  const eTo = (map.hexAt(target) as Hex).elevation
  if (eFrom > eTo && !source.unit.offBoard) {
    if (source.unit.areaFire) {
      mult += 1
      why.push("- plus 1 for different elevation")
    } else {
      mult -= 1
      why.push("- minus 1 for firing downhill")
    }
  }
  if (eFrom < eTo && !source.unit.offBoard) {
      mult += 1
      why.push("- plus 1 for firing uphill")
  }
  if (source.unit.isActivated) {
      mult += 1
      why.push("- plus 1 for intensive fire")
  }
  if (turretMoved) {
      mult += 1
      why.push("- plus 1 for moving the turret")
  }
  // Weather/night here
  if (mult < 1) { mult = 1 }
  return { mult, why }
}

function inRange(game: Game, to: Coordinate): boolean {
  if (!game?.gameActionState?.fire) { return false }
  let leaderRange = true
  let leaderOnly = true
  for (const sel of game.gameActionState.selection) {
    const unit = sel.counter.unit
    const from = sel.counter.hex as Coordinate
    if (from.x === to.x && from.y === to.y) { return false }
    if (los(game.scenario.map, from, to) === false) { return false }
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