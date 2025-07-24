import { Coordinate, featureType, hexOpenType, HexOpenType, sponsonType, unitStatus, unitType } from "../../utilities/commonTypes";
import { los, losHexPath } from "../../utilities/los";
import { hexDistance, normalDir } from "../../utilities/utilities";
import Counter from "../Counter";
import Feature from "../Feature";
import Game from "../Game";
import { GameActionPath } from "../GameAction";
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
  }
  if (inRange(map.game, to)) { return hexOpenType.Open }
  return hexOpenType.Closed
}

export function leadershipRange(game: Game): number | false {
  if (!game?.gameActionState?.fire) { return false }
  const init = game.gameActionState.fire.initialSelection[0]
  let leadership = -1
  for (const sel of game.gameActionState.selection) {
    const unit = sel.counter.unit
    if (unit.leader && sel.x === init.x && sel.y === init.y) {
      if (unit.currentLeadership > leadership) { leadership = unit.currentLeadership }
    }
  }
  return leadership < 0 ? false : leadership
}

export function canMultiSelectFire(game: Game, x: number, y: number, unit: Unit): boolean {
  if (unit.targetedRange || unit.isVehicle || unit.incendiary) { return false }
  if (unit.leader) { return true }
  if (unit.areaFire) { return false }
  if (unit.uncrewedSW && unit.parent) { return true }
  if (unit.children.length > 0 && !unit.children[0].targetedRange &&
      (unit.children[0].status === unitStatus.Normal || (unit.children[0].status === unitStatus.Activated &&
       unit.status === unitStatus.Activated))) { return true }
  const counters = game.scenario.map.countersAt(new Coordinate(x, y))
  for (const c of counters) {
    if (c.hasUnit && c.unit.id !== unit.id && c.unit.leader) { return true }
  }
  return false
}

export function rapidFire(game: Game): boolean {
  if (!game?.gameActionState?.fire) { return false }
  for (const sel of game.gameActionState.selection) {
    if (sel.counter.unit.sponson && game.sponsonFire) {
      return false
    } else {
      if (!sel.counter.unit.rapidFire && !sel.counter.unit.leader) { return false }
    }
  }
  return true
}

export function areaFire(game: Game) {
  if (!game?.gameActionState?.fire) { return false }
  const init = game.gameActionState.fire.initialSelection[0]
  if (init.counter.unit.sponson && game.sponsonFire) {
    if (init.counter.unit.sponson.type !== sponsonType.Flame) { return false }
  } else {
    if (init.counter.unit.areaFire) { return true }
    if (init.counter.unit.targetedRange) { return false }
  }
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
  const coords = []
  const units = game.scenario.map.allUnits
  for (const u of units) {
    const hex = u.hex as Coordinate
    if (u.unit.targetSelected) {
      targets.push({ x: hex.x, y: hex.y, id: u.unit.id, counter: u })
      let check = false
      for (const c of coords) {
        if (c.x === hex.x && c.y === hex.y) { check = true; break }
      }
      if (!check) { coords.push(new Coordinate(hex.x, hex.y)) }
    }
  }
  game.gameActionState.fire.targetSelection = targets
  game.gameActionState.fire.targetHexes = coords
}

export function fireHindranceAll(
  game: Game, source: ActionSelection[], targetHexes: Coordinate[],
): boolean | number {
  let hindrance = -1
  for (let i = 0; i < source.length; i++) {
    const sel = source[i]
    for (let j = 0; j < targetHexes.length; j++) {
      const targ = targetHexes[j]
      const check = los(game.scenario.map, new Coordinate(sel.x, sel.y), targ)
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
): number {
  let hindrance = -1
  for (let i = 0; i < source.length; i++) {
    const sel = source[i]
    const check = los(game.scenario.map, new Coordinate(sel.x, sel.y), to)
    if (check !== true && check !== false && Number(check.value) > hindrance) {
      hindrance = Number(check.value)
    }
    if (check === true && hindrance < 0) { hindrance = 0 }
  }
  return hindrance < 0 ? 0 : hindrance
}

export function firepower(
  game: Game, source: ActionSelection[], target: Unit, to: Coordinate, sponson: boolean, wire: boolean[]
): { fp: number, why: string[] } {
  const why: string[] = []
  let fp = 0
  for (let i = 0; i < source.length; i++) {
    const sel = source[i]
    const sunit = sel.counter.unit
    const dist = hexDistance(new Coordinate(sel.x, sel.y), to)
    if (sponson && sunit.sponson) {
      if (sunit.sponson.range >= dist) { fp += sunit.sponson.firepower}
    } else {
      const leadership = sunit.targetedRange && !sunit.isVehicle ? 0 :
        leadershipAt(game, new Coordinate(sel.x, sel.y))
      if (sunit.currentRange >= dist || sunit.offBoard) {
        fp += sunit.currentFirepower / (wire[i] ? 2 : 1) + leadership
      }
    }
  }
  why.push(`base firepower ${fp}`)
  if (source.length === 1) {
    const sunit = source[0].counter.unit
    if (sunit.antiTank && (target.canCarrySupport)) {
      fp = Math.floor(fp/2)
      why.push("- halved: antitank vs. soft target")
    }
    if (target.armored && (sunit.fieldGun || sunit.areaFire) && !sunit.incendiary) {
      fp = Math.floor(fp/2)
      why.push("- halved: high-explosive vs. armor")
    }
    if (sunit.immobilized && (!sunit.turreted || sponson)) {
      fp = Math.floor(fp/2)
      why.push("- halved: vehicle immobilized")
    }
    if (sunit.turreted && sunit.turretJammed && !sponson) {
      fp = Math.floor(fp/2)
      why.push("- halved: turret jammed")
    }
  }
  return { fp, why }
}

function leadershipAt(game: Game, at: Coordinate): number {
  if (!game?.gameActionState?.fire) { return 0 }
  const counters = game.scenario.map.countersAt(at)
  let leadership = 0
  for (const c of counters) {
    if (!c.hasUnit) { continue }
    const unit = c.unit
    if (unit.leader) {
      if (unit.currentLeadership > leadership) { leadership = unit.currentLeadership }
    }
  }
  return leadership
}

export function untargetedModifiers(
  game: Game, source: ActionSelection[], targets: ActionSelection[], path: GameActionPath[]
): { mod: number, why: string[] } {
  // TODO: Break down by location
  const why: string[] = []
  let mod = 0
  let gthalf = false
  let adj = true
  let elev = -1
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
      if (dist > sunit.currentRange/2 && !sunit.leader) { gthalf = true }
      if (dist > 1) { adj = false }
      const check = (map.hexAt(to) as Hex).elevation - (map.hexAt(from) as Hex).elevation
      if (check === 0 && elev < 0) { elev = 0 }
      if (check > 0) { elev = 1}
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
  if (tired) {
    mod += 1
    why.push("- plus 1 for tired")
  }
  if (rapid) {
    mod += 1
    why.push("- plus 1 for rapid fire")
  }
  if (intense) {
    mod += 2
    why.push("- plus 2 intensive fire")
  }
  if (source[0].counter.unit.turreted && path.length > 1) {
    mod += 1
    why.push("- plus 1 for moving the turret")
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

export function armorAtArc(
  game: Game, target: Unit, from: Coordinate, to: Coordinate, turret: boolean
): number {
  if (!target.rotates || !target.armored) { return -1 }
  const armor = turret ? target.turretArmor as number[] : target.hullArmor as number[]
  return armor[hitFromArc(game, target, from, to, turret)]
}

export function armorHitModifiers(
  game: Game, source: Unit, target: Unit, from: Coordinate, to: Coordinate, turret: boolean
): { mod: number, why: string[] } {
  const why: string[] = []
  let mod = 0
  if (hitFromArc(game, target, from, to, turret) === 1 && !turret) {
    mod -= 1
    why.push("- minus 1 for targeting side of hull")
  }
  if (target.immobilized) {
    mod -= 1
    why.push("- minus 1 for target immobilized")
  }
  const dist = hexDistance(from, to)
  if (dist > Math.ceil(source.currentRange/2) ) {
    mod += 1
    why.push("- plus 1 for more than half range")
  }
  if (dist < 2 ) {
    mod -= 1
    why.push("- minus 1 for point-blank range")
  }
  return { mod, why }
}

export function moraleModifiers(
  game: Game, target: Unit, from: Coordinate[], to: Coordinate, incendiary: boolean
): { mod: number, why: string[] } {
  const why: string[] = []
  let mod = -target.currentMorale
  why.push(`- minus morale ${target.currentMorale}`)
  if (!target.leader) {
    const leadership = leadershipAt(game, to)
    if (leadership > 0) {
      mod -= leadership
      why.push(`- minus leadership ${leadership}`)
    }
  }
  if (!incendiary) {
    const cover = fireCover(game, from, to)
    if (cover > 0) {
      mod -= cover
      why.push(`- minus cover ${cover}`)
    }
  }
  if (target.pinned) {
    mod += 1
    why.push(` - plus 1 for being pinned`)
  }
  return { mod, why }
}

function fireCover(
  game: Game, from: Coordinate[], to: Coordinate
): number {
  const map = game.scenario.map
  let cover = 0
  const counters = map.countersAt(to)
  let check = false
  for (const c of counters) {
    if (c.hasFeature) {
      if (c.feature.type === featureType.Foxhole) {
        cover = c.feature.cover as number
        check = true
      } else if (c.feature.type === featureType.Bunker) {
        let minCover = 99
        for (const fc of from) {
          if (fc.x === to.x && fc.y === to.y) {
            const cover = (c.feature.coverSides as number[])[2]
            if (cover < minCover) { minCover = cover }
          } else {
            const dir = hitFromArc(game, c.feature, fc, to, false)
            const cover = (c.feature.coverSides as number[])[dir]
            if (cover < minCover) { minCover = cover }
          }
        }
        cover = minCover
        check = true
      }
    }
  }
  if (!check) {
    const toHex = map.hexAt(to) as Hex
    const terrain = toHex.terrain
    cover = !terrain.cover ? 0 : terrain.cover
    for (const c of from) {
      if (c.x !== to.x || c.y !== to.y) {
        const fromHex = map.hexAt(c) as Hex
        const path = losHexPath(map, toHex, fromHex)
        if (path[0].edgeHex?.border && path[0].edgeHex.borderEdges?.includes(path[0].edge ?? 1)) {
          cover += path[0].edgeHex.terrain.borderAttr.cover
        }
        if (path[1].hex?.border && path[1].hex.borderEdges?.includes(normalDir((path[0].edge ?? 1) + 3))) {
          cover += path[1].hex.terrain.borderAttr.cover
        }
      }
    }
  }
  return cover
}

function hitFromArc(
  game: Game, target: Unit | Feature, from: Coordinate, to: Coordinate, turret: boolean
): 0 | 1 | 2 {
  const map = game.scenario.map
  const start = new Coordinate(map.xOffset(from.x, from.y), map.yOffset(from.y))
  const end = new Coordinate(map.xOffset(to.x, to.y), map.yOffset(to.y))
  const dx = start.x - end.x
  const dy = end.y - start.y
  const facing = turret && !target.isFeature ? (target as Unit).turretFacing : target.facing
  const a = (Math.atan2(dy,dx) * 180 / Math.PI + facing * 60) % 360
  if (a > 29.99 && a < 90.01) { return 0 }
  if (a > 209.99 && a < 270.01) { return 2 }
  return 1
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
    if (!unit.leader) {
      const dist = hexDistance(from, to)
      if (unit.currentRange < dist) { return false }
      if ((unit.minimumRange ?? 0) > dist) { return false }
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
