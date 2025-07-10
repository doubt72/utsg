import { Coordinate, Direction, featureType } from "../../utilities/commonTypes"
import {
  circlePath, clearColor, counterElite, counterGreen, CounterLayout, counterRed,
  facingLayout, hexPath, markerYellow, squarePath, SVGPathArray
} from "../../utilities/graphics"
import { normalDir } from "../../utilities/utilities"
import Counter from "../Counter"
import { counterColor } from "./counterLayout"

export function moraleLayout(counter: Counter): CounterLayout | false {
  if (!counter.hasUnit || !counter.unit.baseMorale) { return false }
  return {
    x: counter.x + 13, y: counter.y + 28, size: 18, value: counter.unit.currentMorale,
    style: { fill: counter.unit.currentMorale === counter.unit.baseMorale ? "black" : counterRed }
  }
}

export function weaponBreakLayout(counter: Counter): CounterLayout | false {
  if (!counter.hasUnit || counter.unit.isWreck) { return false }
  if (!counter.unit.breakWeaponRoll) { return false }

  const x = counter.x + 14
  let y = counter.y + 25
  if (counter.unit.breakdownRoll) { y -= 3 }
  const red = counter.unit.breakDestroysWeapon || counter.unit.jammed
  let fill = red ? counterRed : markerYellow
  let textColor = red ? "white" : "black"
  if (counter.unit.weaponBroken) {
    fill = "rgba(0,0,0,0)"
    textColor = "rgba(0,0,0,0)"
  }
  return {
    path: circlePath(new Coordinate(x, y), 8),
    style: { stroke: textColor, strokeWidth: 1, fill: fill }, tStyle: { fill: textColor },
    x, y: y + 4.25, size: 15, value: counter.unit.breakWeaponRoll,
  }
}

export function weaponFixLayout(counter: Counter): CounterLayout | false {
  if (!counter.hasUnit || !counter.unit.repairRoll || !counter.unit.jammed ||
      counter.unit.isWreck || counter.unit.breakdownRoll) {
    return false
  }
  const loc = new Coordinate(counter.x + 14, counter.y + 40)
  return {
    path: circlePath(loc, 8),
    style: { stroke: "rgba(0,0,0,0)", strokeWidth: 1, fill: "rgba(0,0,0,0)" }, tStyle: { fill: "black" },
    x: loc.x, y: loc.y + 4.25, size: 12, value: counter.unit.repairRoll,
  }
}

export function sizeLayout(counter: Counter): CounterLayout | false {
  if (!counter.hasUnit || !counter.unit.size ) { return false }
  const x = counter.x + 66
  let y = counter.y + 23
  if (counter.unit.icon === "cav" || counter.unit.icon === "cav-wheel") { y -= 3 }
  const stroke = counter.unit.armored && !counter.unit.isWreck ? "black" : clearColor
  const path = counter.unit.armored && counter.unit.topOpen ?
    squarePath(new Coordinate(x, y)) :
    circlePath(new Coordinate(x, y), 10)
  return {
    path,
    style: { stroke, strokeWidth: 1, fill: clearColor }, tStyle: { fill: "black" },
    x: x, y: y + 5, size: 18, value: counter.unit.size,
  }
}

export function eliteLayout(counter: Counter): CounterLayout | false {
  if (!counter.hasUnit) { return false }
  const showAllCounters = counter.onMap ? counter.map?.showAllCounters : counter.showAllCounters
  const elite = counter.unit.eliteCrew
  if (counter.unit.isWreck || showAllCounters || elite === 0) {
    return false
  }
  const color = elite > 0 ? counterElite : counterGreen
  const stroke = elite > 0 ? "white" : "black"
  const tColor = elite > 0 ? "white" : "black"
  const rc: CounterLayout | false = sizeLayout(counter)
  if (!rc) { return false }
  if (!rc.style) { return rc }
  rc.style.fill = color
  rc.style.stroke = stroke
  if (!rc.tStyle) { return rc }
  rc.tStyle.fill = tColor
  return rc
}

export function towLayout(counter: Counter): CounterLayout | false {
  if (!counter.hasUnit || !counter.unit.towSize) { return false }
  return {
    tStyle: { fill: "black" },
    x: counter.x + 73, y: counter.y + 21, size: 12, value: counter.unit.towSize,
  }
}

export function canTowLayout(counter: Counter): CounterLayout | false {
  if (!counter.hasUnit || !counter.unit.canTow || counter.unit.isWreck) { return false }
  const x = counter.x + 66
  const y = counter.y + 30.5
  const size = 5
  const path = `M ${x - size} ${y} L ${x + size} ${y}`
  const color = counter.unit.eliteCrew > 0 ? "white" : "black"
  return { x, y, size, path, style: { stroke: color, strokeWidth: 1 } }
}

export function transportLLayout(counter: Counter): CounterLayout | false {
  if (!counter.hasUnit || (counter.unit.transport !== 1 && counter.unit.transport !== 3) ||
      counter.unit.isWreck) { return false }
  const x = counter.x + 59
  let y = counter.y + 23
  if (counter.unit.icon === "cav" || counter.unit.icon === "cav-wheel") { y -= 3 }
  const size = 2
  const path = circlePath(new Coordinate(x, y), size)
  const color = counter.unit.eliteCrew > 0 ? "white" : "black"
  return { x, y, size, path, style: { fill: color } }
}

export function transportRLayout(counter: Counter): CounterLayout | false {
  if (!counter.hasUnit || counter.unit.transport < 2 || counter.unit.isWreck) { return false }
  const x = counter.x + 73
  let y = counter.y + 23
  if (counter.unit.icon === "cav" || counter.unit.icon === "cav-wheel") { y -= 3 }
  const size = 2
  const path = circlePath(new Coordinate(x, y), size)
  const color = counter.unit.eliteCrew > 0 ? "white" : "black"
  return { x, y, size, path, style: { fill: color } }
}

export function leadershipLayout(counter: Counter): CounterLayout | false {
  if (!counter.hasUnit || !counter.unit.currentLeadership) { return false }
  return {
    path: hexPath(new Coordinate(counter.x + 13, counter.y + 44), 10, true),
    style: { stroke: "black", strokeWidth: 1, fill: clearColor }, tStyle: { fill: "black" },
    x: counter.x + 13, y: counter.y + 49, size: 18, value: counter.unit.currentLeadership,
  }
}

export function handlingLayout(counter: Counter): CounterLayout | false {
  if (!counter.hasUnit || !counter.unit.currentGunHandling) { return false }
  const loc = new Coordinate(counter.x + 13, counter.y + 42)
  const path = circlePath(loc, 8)
  return {
    path: path, style: { stroke: "black", strokeWidth: 1, fill: clearColor },
    tStyle: { fill: "black" },
    x: loc.x, y: loc.y+4.25, size: 15, value: counter.unit.currentGunHandling,
  }
}

export function breakdownLayout(counter: Counter): CounterLayout | false {
  if (!counter.hasUnit || !counter.unit.breakdownRoll || counter.unit.immobilized || counter.unit.isWreck) {
    return false
  }
  const loc = new Coordinate(counter.x + 14, counter.y + 40)
  const path = circlePath(loc, 8)
  return {
    path: path, style: { stroke: "black", strokeWidth: 1, fill: markerYellow },
    tStyle: { fill: "black" },
    x: loc.x, y: loc.y+4.25, size: 15, value: counter.unit.breakdownRoll,
  }
}

export function iconLayout(counter: Counter): CounterLayout | false {
  if (!counter.target.icon) { return false }
  const x = counter.x + ((counter.hasMarker && counter.marker.fullIcon) ? 0 : 20)
  let y = counter.y + ((counter.hasMarker && counter.marker.fullIcon) ? 0 : 13)
  if (counter.hasFeature) {
    y = counter.y + 15
  }
  const size = (counter.hasMarker && counter.marker.fullIcon) ? 80 : 40
  return {
    x: x, y: y, size: size,
    icon: (counter.hasUnit && counter.unit.isWreck) ? "wreck" : counter.targetUF.icon
  }
}

export function centerLabelLayout(counter: Counter): CounterLayout | false {
  if (!counter.hasFeature || !counter.feature.sniperRoll) { return false }
  const x = counter.x + 40
  const y = counter.y + 48
  return {
    x: x, y: y, size: 40, value: counter.feature.sniperRoll, style: { fill: counterRed }
  }
}

export function sponsonLayout(counter: Counter): CounterLayout | false {
  if (!counter.hasUnit) { return false }
  const gun = counter.unit.sponson as [number, number] | [number, number, string]
  if (!gun || counter.unit.isWreck) { return false }
  const x = counter.x + 38
  const y = counter.y + 53
  const width = 12.8
  const path = [
    "M", x-width, y-9, "L", x+width, y-9, "L", x+width, y+3, "L", x-width, y+3, "L", x-width, y-9
  ].join(" ")
  const style = { fill: counterColor(counter) }
  if (gun.length > 2) {
    if (gun[2] === "ft") {
      style.fill = markerYellow
    } else if (gun[2] === "p") {
      style.fill = "white"
    }
  }
  return {
    path: path, x: x, y: y, size: 9.5, style: style, value: `${gun[0]}-${gun[1]}`
  }
}

export function turretArmorLayout(counter: Counter): CounterLayout | false {
  if (!counter.hasUnit) { return false }
  const armor = counter.unit.turretArmor as [number, number, number]
  if (!armor || counter.unit.isWreck) { return false }
  const x = counter.x + 65
  const y = counter.y + 43
  const value = armor.map((v: number) => v < 0 ? "X" : v).join("-")
  return { x: x, y: y, size: 9.5, value: value}
}

export function hullArmorLayout(counter: Counter): CounterLayout | false {
  if (!counter.hasUnit) { return false }
  const armor = counter.unit.hullArmor as [number, number, number]
  if (!armor || counter.unit.isWreck) { return false }
  const x = counter.x + 65
  const y = counter.y + 53
  const value = armor.map(v => v < 0 ? "X" : v).join("-")
  return { x: x, y: y, size: 9.5, value: value}
}

export function firepowerLayout(counter: Counter): CounterLayout | false {
  if (counter.hasMarker) { return false }
  const loc = new Coordinate(
    counter.x + 14 + ((counter.hasUnit && counter.unit.minimumRange) ? 0 : 2), counter.y + 67
  )
  const style = { stroke: clearColor, fill: clearColor, strokeWidth: 1 }
  let value = counter.targetUF.baseFirepower
  let color = "black"
  let path = squarePath(loc)
  let size = value === "½" ? 18 : attrSizeFor(value as number)
  if (counter.hasUnit && (counter.unit.noFire || counter.unit.isPinned)) {
    color = counterRed
    value = counter.unit.currentFirepower
    size = 18
  } else if (counter.hasUnit) {
    if (counter.unit.antiTank || counter.unit.fieldGun || counter.unit.areaFire) {
      path = circlePath(loc, 10)
    }
    if (counter.unit.areaFire) {
      style.stroke = "black"
    }
    if (counter.unit.offBoard) {
      path = hexPath(loc.yDelta(+0.5), 11, false)
      size = 12.5
    }
    if (counter.unit.antiTank || counter.unit.singleFire ||
        counter.unit.assault || counter.unit.offBoard) {
      style.stroke = "black"
    }
    if (counter.unit.antiTank) {
      style.fill = "white"
    }
    if (counter.unit.singleFire && counter.unit.ignoreTerrain) {
      style.fill = counterRed
    } else if (counter.unit.singleFire) {
      style.stroke = "black"
      style.fill = "black"
    } else if (counter.unit.ignoreTerrain) {
      style.fill = markerYellow
    }
    if ((counter.unit.singleFire || counter.unit.ignoreTerrain) && !counter.unit.assault) {
      path = circlePath(loc, 10)
    }
    if (counter.unit.fieldGun) {
      style.stroke = "black"
    }
    if (counter.unit.singleFire) { color = "white" }
  }
  if (value === 0) { value = "-" }
  if (counter.hasFeature) {
    path = circlePath(loc, 10)
    color = "white"
    if (counter.feature.fieldGun) {
      style.stroke = counterRed
      style.fill = "white"
      color = counterRed
    }
    if (counter.feature.antiTank) {
      style.stroke = "white"
    }
  }
  if (size < 16) { loc.yShift(-0.5) }
  return {
    path: path, style: style, tStyle: { fill: color },
    x: loc.x, y: loc.y+5, size: size, value: value,
  }
}

export function areaLayout(counter: Counter): CounterLayout | false {
  if (!counter.hasUnit || !counter.unit.areaFire || counter.unit.isWreck ||
      counter.unit.weaponBroken || counter.unit.jammed) { return false }
  const x = counter.x + 14 + ((counter.hasUnit && counter.unit.minimumRange) ? 0 : 2)
  let y = counter.y + 59.75
  let size = 6
  if (counter.unit.currentFirepower > 9) { y += 1.25 } else { size -= 2 }
  if (counter.unit.offBoard) { y += 1.25 }
  const path = `M ${x - size} ${y} L ${x + size} ${y}`
  return { x, y, size, path, style: { stroke: "black", strokeWidth: 1 } }
}

export function smokeLayout(counter: Counter): CounterLayout | false {
  if (!counter.hasUnit || !counter.unit.currentSmokeCapable) { return false }
  let x = counter.x + 16
  let y = counter.y + 57
  const size = 2
  if (counter.unit.assault || counter.unit.targetedRange) { y -= 4 }
  if (counter.unit.offBoard) { y -= 3 }
  if (counter.unit.minimumRange) { x -= 2 }
  const path = circlePath(new Coordinate(x, y), size)
  return { x, y, size, path, style: { fill: "black" } }
}

export function rangeLayout(counter: Counter): CounterLayout | false {
  if (counter.hasMarker) { return false }
  if (counter.hasFeature && [
      featureType.Smoke, featureType.Fire, featureType.Bunker, featureType.Foxhole,
      featureType.Rubble,
    ].includes(counter.feature.type)) {
    return false
  }
  let loc = new Coordinate(counter.x + 40, counter.y + 67)
  const style = { stroke: clearColor, fill: clearColor, strokeWidth: 1 }
  let value: number | string = counter.targetUF.currentRange
  let color = "black"
  let path = squarePath(loc)
  let size = attrSizeFor(value)
  if (counter.hasUnit && counter.unit.noFire) {
    color = counterRed
    size = 18
  } else if (counter.hasUnit) {
    if (counter.unit.targetedRange) { path = circlePath(loc, 10) }
    if (counter.unit.targetedRange || counter.unit.rapidFire) { style.stroke = "black" }
    if (counter.unit.type === "sw" && counter.unit.targetedRange) {
      style.stroke = "black"
      style.fill = "black"
      color = "white"
    } else if (counter.unit.turreted || counter.unit.rotatingMount) {
      style.stroke = "white"
      style.fill = "white"
    }
    if (counter.unit.targetedRange || counter.unit.rapidFire) { style.stroke = "black" }
  }
  if (counter.hasFeature) {
    color = "white"
  }
  if (value === 0) {
    style.stroke = clearColor
    value = "-"
  }
  if (size < 16) { loc.yShift(-0.5) }
  if (counter.hasUnit && counter.unit.minimumRange && !counter.unit.isWreck && !counter.unit.weaponBroken) {
    loc = new Coordinate(loc.x, counter.y + 65.25)
    path = [
      "M", loc.x-8, loc.y-4, "L", loc.x+8, loc.y-4,
      "A", 6, 6, 0, 0, 1, loc.x+8, loc.y+8,
      "L", loc.x-8, loc.y+8, "A", 6, 6, 0, 0, 1, loc.x-8, loc.y-4,
    ].join(" ")
    value = `${counter.unit.minimumRange}-${value}`
    size = 10.5
  }
  return {
    path: path, style: style, tStyle: { fill: color }, x: loc.x, y: loc.y+5,
    size: size, value: value,
  }
}

export function gunForwardsLayout(counter: Counter): CounterLayout | false {
  if (!counter.hasUnit || !counter.unit.rotatingVehicleMount || counter.unit.isWreck ||
      counter.unit.jammed ) { return false }
  const x = counter.x + 40
  const y = counter.y + 60
  const size = 7
  const path = `M ${x - size} ${y} L ${x + size} ${y}`
  return { x, y, size, path, style: { stroke: "black", strokeWidth: 1 } }
}

export function gunBackwardsLayout(counter: Counter): CounterLayout | false {
  if (!counter.hasUnit || !counter.unit.backwardsMount || counter.unit.isWreck) { return false }
  const x = counter.x + 40
  const y = counter.y + 74.5
  const size = 2
  const path = circlePath(new Coordinate(x, y), size)
  return { x, y, size, path, style: { fill: "black" } }
}

export function movementLayout(counter: Counter): CounterLayout | false {
  if (counter.hasFeature && counter.feature.type === featureType.Rubble) { return false }
  const loc = new Coordinate(
    counter.x + 66 - ((counter.hasUnit && counter.unit.minimumRange) ? 0 : 2), counter.y + 67
  )
  const style = { stroke: clearColor, fill: clearColor, strokeWidth: 1 }
  let value = counter.targetUF.currentMovement
  let color = "black"
  const path = circlePath(loc, 10)
  const size = value === "A" ? 18 : attrSizeFor(value as number)
  if (counter.hasUnit && (counter.unit.isBroken || counter.unit.isPinned || counter.unit.isTired ||
      value as number < 0 || counter.unit.immobilized || counter.unit.isWreck)) {
    color = counterRed
  } else if (counter.hasUnit) {
    if (counter.unit.isTracked || counter.unit.crewed || counter.unit.isWheeled ) {
      style.stroke = "black"
    }
    if (counter.unit.crewed) {
      style.fill = "black"
      color = "white"
    } else if (counter.unit.isWheeled) {
      style.fill = "white"
    }
  }
  if (value === 0) { value = "-" }
  if (counter.hasFeature) {
    color = "white"
    if (counter.feature.type === featureType.Roadblock) {
      style.stroke = "white"
      value = "0"
    }
  }
  if (size < 16) { loc.xShift(0.5) }
  return {
    path: path, style: style, tStyle: { fill: color }, x: loc.x, y: loc.y+5,
    size: size, value: value,
  }
}

export function engineerLayout(counter: Counter): CounterLayout | false {
  if (!counter.hasUnit || !counter.unit.engineer || counter.unit.isBroken) { return false }
  const x = counter.x + 64
  const y = counter.y + 57
  const size = 2
  const path = circlePath(new Coordinate(x, y), size)
  return { x, y, size, path, style: { fill: "black" } }
}

export function amphibiousLayout(counter: Counter): CounterLayout | false {
  if (!counter.hasUnit || !counter.unit.amphibious || counter.unit.isWreck || counter.unit.immobilized ) {
    return false
  }
  const x = counter.x + 64
  const y = counter.y + 74
  const size = 4
  const path = `M ${x - size} ${y} L ${x + size} ${y}`
  return { x, y, size, path, style: { stroke: "black", strokeWidth: 1 } }
}

export function facingLayout(counter: Counter, hull: boolean = false): facingLayout | false {
  const unit = counter.unit
  if ((!unit.turreted && !unit.rotates) || unit.isWreck ||
      unit.rotatingVehicleMount || unit.currentFirepower < 1) {
    return false
  }
  let dir = unit.turreted && !hull ? unit.turretFacing : unit.facing
  if (unit.backwardsMount) { dir = normalDir(dir + 3) }
  const path = facingLine(counter, dir).concat(facingLine(counter, normalDir(dir - 1))).join(" ")
  return {
    path: path, dash: "4 4", style: {
      fill: "rgba(0,0,0,0)", strokeWidth: 4, stroke: hull ? "rgba(255,255,0,1)" : "rgba(255,255,255,1)"
    },
    style2: {
      fill: "rgba(0,0,0,0)", strokeWidth: 4, stroke: "rgba(0,0,0,1)"
    }
  }
}

function facingLine(counter: Counter, dir: Direction): SVGPathArray {
  if (!counter.map || !counter.hex) { return [] }
  const hex = counter.map.hexAt(counter.hex)
  if (!hex) { return [] }
  const x = hex.xCorner(dir)
  const y = hex.yCorner(dir)
  const len = counter.map.radius * (counter.map.height + counter.map.width)
  const x2 = x - len * Math.cos((dir-0.5)/3 * Math.PI)
  const y2 = y - len * Math.sin((dir-0.5)/3 * Math.PI)
  return ["M", x, y, "L", x2, y2]
}

function attrSizeFor(n: number, circle: boolean = false): number {
  if (n > 9 || n < 0) {
    return circle ? 12.5 : 15
  } else {
    return 18
  }
}
