import {
  baseTerrainType, Coordinate, Direction, markerType, sponsonType, streamType, weatherType, windType
} from "../../utilities/commonTypes"
import { HelpLayout, roundedRectangle } from "../../utilities/graphics"
import { normalDir } from "../../utilities/utilities"
import { rangeMultiplier } from "../control/fire"
import Counter from "../Counter"
import Feature from "../Feature"
import Game from "../Game"
import Hex from "../Hex"
import Marker from "../Marker"
import Unit from "../Unit"

export function hexHelpLayout(
  hex: Hex, loc: Coordinate, max: Coordinate, scale: number
): HelpLayout {
  const text = hexHelpText(hex)
  return mapHelpLayout(loc, max, text, scale)
}

function hexHelpText(hex: Hex): string[] {
  const text = [hex.terrain.name]
  if (hex.terrain.name === "water" && hex.map.baseTerrain === baseTerrainType.Snow) {
    text.push("frozen")
    text.push("movement cost 2")
    text.push("- vehicles cannot enter")
  }
  if (hex.elevation > 0) {
    text.push(`elevation ${hex.elevation}`)
  }
  if (hex.elevation < 0) {
    text.push(`depression`)
  }
  if (hex.terrain.cover !== false) {
    text.push(`cover ${hex.terrain.cover}`)
  }
  if (hex.terrain.hindrance) {
    text.push(`hindrance ${hex.terrain.hindrance}`)
  }
  if (hex.terrain.los) {
    text.push("blocks line-of-sight")
  }
  if (hex.terrain.move !== false) {
    text.push(`movement cost ${hex.terrain.move}`)
    let rise = false
    hex.map.hexNeighbors(hex.coord).forEach(n => {
      if (n && n.elevation < hex.elevation) {
        rise = true
      }
    })
    if (rise) {
      text.push("- add 1 movement cost if moving from lower elevation")
    }
    if (!hex.terrain.gun) {
      text.push("- crewed weapons cannot enter")
    } else if (hex.terrain.gun === "back") {
      text.push("- crewed weapons can only back in")
    }
    if (!hex.terrain.vehicle) {
      text.push("- vehicles cannot enter")
    }
  }
  if (hex.road) {
    if (hex.roadType === 'p') {
      text.push("path")
      text.push("- foot movement cost 1 if moving along path")
    } else if (hex.roadType === 't') {
      if (hex.river) {
        text.push("bridge")
      } else {
        text.push("paved road")
      }
      text.push("- movement bonus +1 if moving along road")
      text.push("- except wheeled movement cost 1/2")
      if (!hex.terrain.gun || !hex.terrain.vehicle) {
        text.push("- all units can move along road")
      }
    } else {
      if (hex.river) {
        text.push("wooden bridge")
      } else {
        text.push("unpaved road")
      }
      text.push("- movement bonus +1 if moving along road")
      if (!["m", "s"].includes(hex.map.baseTerrain)) {
        text.push("- except wheeled movement cost 1/2")
      }
      if (!hex.terrain.gun || !hex.terrain.vehicle) {
        text.push("- all units can move along road")
      }
    }
  }
  if (hex.railroad) {
    text.push("railroad")
    text.push("- 1 cover")
  }
  if (hex.river && hex.terrain.move) {
    text.push(hex.terrain.streamAttr.name)
    if (hex.map.baseTerrain === baseTerrainType.Snow && hex.riverType === streamType.Stream) {
      text.push("- frozen, no movement effects")
    } else {
      let cost = hex.terrain.streamAttr.inMove
      if (cost > 0) { text.push(`- movement cost +${cost} when entering`) }
      cost = hex.terrain.streamAttr.outMove
      if (cost > 0) { text.push(`- movement cost +${cost} when leaving`) }
      cost = hex.terrain.streamAttr.alongMove
      if (cost > 0) { text.push(`- movement cost +${cost} when moving along`) }
      if (hex.road) {
        text.push("- unless following road")
      }
      const cover = hex.terrain.streamAttr.cover
      if (cover > 0) { text.push(`- ${cover} cover`) }
    }
  }
  const borderText: { [index: string]: string[] } = {}
  for (let i = 1; i <= 6; i++) {
    const bd = hex.terrain.borderText(i as Direction)
    if (bd) {
      borderText[bd.key] = bd.text
    }
  }
  hex.map.hexNeighbors(hex.coord).forEach((n, i) => {
    if (n) {
      const bd = n.terrain.borderText(normalDir(i + 1))
      if (bd) {
        borderText[bd.key] = bd.text
      }
    }
  })
  Object.keys(borderText).forEach(k => borderText[k].forEach(t => text.push(t)))
  return text
}

export function counterHelpLayout(
  game: Game, counter: Counter, loc: Coordinate, max: Coordinate, scale: number
): HelpLayout {
  if (!counter.map) { return { path: "", size: 0, style: {}, opacity: 0, tStyle: {}, texts: [] } }
  const text = counter.target.helpText(game, loc)
  return mapHelpLayout(loc, max, text, scale)
}

export function unitHelpText(game: Game, loc: Coordinate, unit: Unit): string[] {
  // let text = fireHelpText(game, loc, unit)
  let text = fireHelpText(game)
  text.push(unit.name)
  text = text.concat(unitTypeName(unit))
  text.push("")
  text.push("[from name, clockwise]")
  if (unit.size > 0) {
    text.push(`stacking/size ${unit.size} (${unit.armored ? "armored" : "soft"})`)
  }
  if (unit.topOpen) {
    text.push(`- open / vulnerable to indirect fire`)
  }
  if (unit.transport) {
    let size = unit.transport < 2 ? "leader" : "team or leader"
    if (unit.transport > 2) { size = "infantry units" }
    text.push(`- can transport ${size}`)
  }
  if (unit.canTow) {
    text.push(`- towing capable`)
  }
  if (unit.towSize) {
    text.push(`- minimum size ${unit.towSize} transport to tow`)
  }
  if (unit.turretArmor) {
    text.push("turret armor:")
    text.push(`- front ${unit.turretArmor[0]} / side ${unit.turretArmor[1]} / rear ${
      unit.turretArmor[2] < 0 ? "none" : unit.turretArmor[2]
    }`)
  }
  if (unit.hullArmor) {
    text.push("hull armor:")
    text.push(`- front ${unit.hullArmor[0]} / side ${unit.hullArmor[1]} / rear ${
      unit.hullArmor[2] < 0 ? "none" : unit.hullArmor[2]
    }`)
  }
  if (unit.baseMovement > 0) {
    text.push(`movement ${unit.currentMovement}`)
    if (unit.isTracked) {
      text.push("- tracked movement")
    } else if (unit.isWheeled) {
      text.push("- wheeled movement")
    } else if (unit.crewed) {
      text.push("- man handled")
    } else if (unit.isBroken) {
      text.push("- routing only")
    }
    if (unit.engineer) {
      text.push("- engineer unit")
    }
    if (unit.amphibious) {
      text.push("- amphibious")
    }
  } else {
    text.push(`movement modifier ${unit.baseMovement}`)
  }
  text.push(`range ${unit.currentRange}`)
  if (unit.minimumRange) {
    text.push(`minimum range ${unit.minimumRange}`)
  }
  if (unit.targetedRange && !unit.jammed) {
    text.push("- target roll required")
  }
  if (unit.turreted && !unit.jammed) {
    text.push("- turret mounted")
  }
  if (unit.rotatingMount) {
    text.push("- rotating mount")
  }
  if (unit.rapidFire && !unit.jammed) {
    text.push("- rapid fire")
  }
  if (unit.rotatingVehicleMount && !unit.jammed) {
    text.push("- unrestricted firing arc")
  }
  if (unit.backwardsMount && !unit.jammed) {
    text.push("- mounted rear")
  }
  if ((unit.minimumRange || unit.type === "sw") && unit.targetedRange) {
    text.push("- no crew targeting bonus")
  }
  text.push(`firepower ${unit.currentFirepower}`)
  if (unit.assault && !unit.isBroken && !unit.jammed) {
    text.push("- assault bonus")
  }
  if (unit.offBoard && !unit.jammed) {
    text.push("- offboard artillery")
  }
  if (unit.antiTank && !unit.jammed) {
    text.push("- anti-armor capable")
    text.push("- half firepower vs. soft targets")
  }
  if (unit.fieldGun && !unit.jammed) {
    text.push("- anti-armor capable")
    text.push("- half firepower vs. armor")
  }
  if (unit.singleFire) {
    text.push("- firing expends weapon")
  }
  if (unit.ignoreTerrain) {
    text.push("- negates cover")
  }
  if (unit.currentSmokeCapable) {
    if (unit.targetedRange) {
      text.push("- can fire smoke rounds")
    } else {
      text.push("- can lay smoke")
    }
  }
  if (unit.breakdownRoll && !unit.immobilized) {
    text.push(`breakdown roll ${unit.breakdownRoll}`)
  }
  if (unit.gunHandling && !unit.isBroken) {
    text.push(`gun operation bonus ${unit.gunHandling}`)
  }
  if (unit.currentLeadership) {
    text.push(`leadership ${unit.currentLeadership}`)
  }
  if (unit.breakWeaponRoll) {
    if (unit.jammed) {
      text.push(`weapon fixed on ${unit.repairRoll}`)
      text.push(`weapon breaks on ${unit.breakWeaponRoll}`)
    } else if (unit.breakDestroysWeapon) {
      text.push(`weapon breaks on ${unit.breakWeaponRoll}`)
    } else {
      text.push(`weapon jams on ${unit.breakWeaponRoll}`)
    }
  }
  if (unit.baseMorale) {
    text.push(`unit morale ${unit.currentMorale}`)
  }
  if (unit.sponson) {
    text.push("center / symbol bottom:")
    if (unit.sponson.type === sponsonType.Flame) {
      text.push("flamethrower mounted")
      text.push("- forward arc only")
      text.push(`- firepower ${unit.sponson.firepower}`)
      text.push(`- range ${unit.sponson.range}`)
      text.push("- ignores terrain")
    } else {
      text.push("sponson gun - forward arc only")
      text.push(`- firepower ${unit.sponson.firepower}`)
      text.push(`- range ${unit.sponson.range}`)
      text.push("- target roll required")
      text.push("- anti-armor capable")
      text.push("- half firepower vs. soft targets")
    }
  }
  text.push("")
  text.push("click for documentation")
  return text
}

export function featureHelpText(feature: Feature): string[] {
  const text = [feature.name]
  if (feature.hindrance) {
    text.push(`hindrance ${feature.hindrance}`)
  }
  if (feature.blocksLos) {
    text.push(`blocks LOS`)
  }
  if (feature.cover) {
    text.push(`cover ${feature.cover}`)
  }
  if (feature.coverSides) {
    text.push("cover:")
    text.push(`- front ${feature.coverSides[0]} / side ${feature.coverSides[1]} / rear ${feature.coverSides[2]}`)
  }
  if (feature.sniperRoll) {
    text.push(`trigger roll ${feature.sniperRoll}`)
  }
  if (feature.baseFirepower === "½") {
    text.push("halves firepower")
  } else if (feature.baseFirepower) {
    text.push(`firepower ${feature.baseFirepower}`)
  }
  if (feature.antiTank) {
    text.push("- anti-armor capable")
    text.push("- half firepower vs. soft targets")
  }
  if (feature.fieldGun) {
    text.push("- anti-armor capable")
    text.push("- half firepower vs. armor")
  }
  if (feature.currentMovement === "A") {
    text.push("uses all movement")
  }
  if (feature.impassable) {
    text.push("impassable")
  }
  if (feature.impassableToVehicles) {
    text.push("impassable to vehicles")
  }
  return text
}

export function markerHelpText(marker: Marker): string[] {
  const text = []
  if (marker.type === markerType.Wind) {
    if (marker.subType === windType.Calm) { text.push("wind: calm") }
    if (marker.subType === windType.Breeze) { text.push("wind: breeze") }
    if (marker.subType === windType.Moderate) { text.push("wind: moderate") }
    if (marker.subType === windType.Strong) { text.push("wind: strong") }
    text.push(`- direction ${marker.facing}`)
  } else if (marker.type === markerType.Weather) {
    if (marker.subType === weatherType.Dry) { text.push("dry") }
    if (marker.subType === weatherType.Fog) { text.push("fog") }
    if (marker.subType === weatherType.Rain) { text.push("rain") }
    if (marker.subType === weatherType.Snow) { text.push("snow") }
    if (marker.subType === weatherType.Sand) { text.push("sand") }
    if (marker.subType === weatherType.Dust) { text.push("dust") }
  }
  const subText = marker.subText
  const variable: string[] = []
  if (subText) {
    subText.forEach(t => {
      if (t === "") { return }
      if (t === "variable") {
        variable.push("weather variable")
        variable.push("- 10% chance of strength change")
        variable.push("- 20% chance of direction change")
      } else {
        const parts = t.split(" ")
        const d = {
          fs: "chance of fires spreading",
          fe: "chance of fires being extinguished",
          sd: "chance of smoke dispersing",
          chance: "chance of precipitation",
        }[parts[1]]
        text.push(["-", parts[0], d].join(" "))
      }
    })
  }
  return text.concat(variable)
}

export function mapHelpLayout(
  loc: Coordinate, max: Coordinate, text: string[], scale: number
): HelpLayout {
  const size = 20 / scale
  let width = 32
  const char = 0.42 * size
  const edge = 16 / scale
  text.forEach(t => {
    const n = t.length * char + edge
    if (n > width) { width = n }
  })
  let x1 = loc.x
  let x2 = x1 + width
  let y1 = loc.y
  let y2 = y1 + text.length * size + size/2
  if (x2 > max.x) {
    const diff = - (width + 20)
    x1 += diff
    x2 += diff
  }
  if (y2 > max.y) {
    const diff = y2 - max.y
    y1 -= diff
    y2 -= diff
  }
  const diff = size
  // const color = "#450"
  // const textColor = "#CE7"
  const color = "black"
  const textColor = "white"
  return {
    path: roundedRectangle(x1, y1, x2 - x1, y2 - y1), style: { fill: color },
    opacity: 0.9, size: size-(6/scale), texts: text.map((t, i) => {
      return { x: x1+(8/scale), y: y1 + i*diff + size - 1, value: t }
    }), tStyle: { fill: textColor }
  }
}

// function fireHelpText(game: Game, loc: Coordinate, unit: Unit): string[] {
function fireHelpText(game: Game): string[] {
  if (!game.gameActionState?.fire) { return [] }
  if (game.gameActionState.fire.targetSelection.length < 1) { return [] }
  let rc: string[] = []
  const firing = game.gameActionState.selection
  const target = game.gameActionState.fire.targetSelection
  // const from = new Coordinate(firing[0].x, firing[0].y)
  const to = new Coordinate(target[0].x, target[0].y)
  rc.push("fire action details:")
  // Show firepower
  const rotated = game.gameActionState.fire.path.length > 1
  if (firing[0].counter.unit.targetedRange) {
    const mult = rangeMultiplier(game.scenario.map, firing[0].counter, to, game.sponsonFire, rotated)
    // Add target roll
    rc.push(`target multiplier: ${mult.mult}`)
    rc = rc.concat(mult.why)
    // Range + hindrance
  } else {
    // Detect reaction fire
    // const mods = untargetedModifiers(game, firing, target, false)
  }
  rc.push("")
  return rc
}

function unitTypeName(unit: Unit): string[] {
  const names: { [index: string]: string[] } = {
    ac: ["armored car"], antitank: ["anti-tank rifle"], atgun: ["anit-tank gun"],
    crew: ["trained gun crew"], explosive: ["explosive"], flamethrower: ["flame thrower"],
    gun: ["field gun"], ht: ["infantry fighting vehicle"],
    htat: ["infantry fighting vehicle", "w/anti-tank gun"],
    htft: ["infantry fighting vehicle", "w/flame thrower"],
    htgun: ["infantry fighting vehicle", "w/mounted field gun"],
    htmtr: ["infantry fighting vehicle", "w/mounted mortar"],
    leader: ["leader"], mg: ["machine gun"], mortar: ["mortar"], radio: ["radio"],
    rocket: ["anti-tank rocket"], spat: ["tank destroyer"], spft: ["flame-thrower tank"],
    spg: ["self-propelled gun"], spgmg: ["armored vehicle"], squad: ["infantry squad"],
    "tank-amp": ["amphibious tank"], tank: ["tank"], team: ["infantry team"],
    "ht-amp": ["infantry fighting vehicle", "(amphibious)"],
    "htat-amp": ["infantry fighting vehicle", "(amphibious)"],
    "htgun-amp": ["infantry fighting vehicle", "(amphibious w/gun)"],
    truck: ["transport"], cav: ["horse transport"], "cav-wheel": ["light transport"],
    "truck-amp": ["amphibious transport"], acav: ["armored vehicle"],
    car: ["light vehicle"], supply: ["supply unit"],
  }
  if (unit.icon === "mortar" && unit.baseMovement > 0) { return ["crewed mortar"] }
  return names[unit.icon]
}
