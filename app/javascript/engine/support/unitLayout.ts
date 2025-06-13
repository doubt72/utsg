import { Coordinate, FeatureType, featureType, markerType } from "../../utilities/commonTypes"
import {
  baseCounterPath, circlePath, clearColor, counterElite, counterGreen, CounterLayout, counterRed,
  dropSelectColor, hexPath, loadedSelectColor, loaderSelectColor, markerYellow, nationalColors,
  selectColor, squarePath, SVGStyle
} from "../../utilities/graphics"
import Counter from "../Counter"
import Feature from "../Feature"
import Unit from "../Unit"

export function counterPath(counter: Counter, xOffset: number = 0, yOffset: number = 0): string {
  return baseCounterPath(counter.x + xOffset, counter.y + yOffset)
}

export function counterStyle(counter: Counter): SVGStyle {
  const color = counterColor(counter)
  if (counter.target.isMarker && counter.target.type === markerType.Turn) {
    return { fill: "#DFDFDF", stroke: "black", strokeWidth: 1 }
  }
  if (counter.target.selected) {
    return { fill: color, stroke: selectColor, strokeWidth: 4 }
  } else if (counter.target.dropSelected) {
    return { fill: color, stroke: dropSelectColor, strokeWidth: 4 }
  } else if (counter.target.loaderSelected) {
    return { fill: color, stroke: loaderSelectColor, strokeWidth: 4 }
  } else if (counter.target.loadedSelected) {
    return { fill: color, stroke: loadedSelectColor, strokeWidth: 4 }
  } else {
    return { fill: color, stroke: "black", strokeWidth: 1 }
  }
}

export function nameBackgroundPath(counter: Counter): string {
  const x = counter.x
  const y = counter.y
  const corner = 4
  return [
    "M", x+corner, y,
    "L", x+80-corner, y, "A", corner, corner, 0, 0, 1, x+80, y+corner,
    "L", x+80, y+12.8, "L", x, y+12.8, "L", x, y+corner,
    "A", corner, corner, 0, 0, 1, x+corner, y,
  ].join(" ")
}

export function nameBackgroundStyle(counter: Counter): SVGStyle {
  return { fill: reverseName(counter) ? "red" : clearColor }
}

export function shadowPath(counter: Counter): string | false {
  if (counter.hideShadow) { return false }
  const angle = counter.rotation ? counter.rotation.a : 0
  return counterPath(
    counter,
    -counter.stackOffset * Math.sqrt(2) * Math.cos((angle + 45)/ 180 * Math.PI),
    counter.stackOffset * Math.sqrt(2) * Math.sin((angle + 45) / 180 * Math.PI)
  )
}

export function nameLayout(counter: Counter): CounterLayout {
  let size = counter.target.isFeature ? 11 : 9
  if (counter.target.smallName > 0) { size = 8.25 }
  if (counter.target.smallName > 1) { size = 7.825 }
  if (counter.target.smallName > 2) { size = 7.5 }
  const y = counter.target.isFeature ? counter.y + 12 : counter.y + 10
  return {
    x: counter.x + 5, y: y, size: size, name: counter.target.name,
    style: { fill: reverseName(counter) ? "white" : "black" }
  }
}

export function moraleLayout(counter: Counter): CounterLayout | false {
  if (!counter.target.baseMorale) { return false }
  return {
    x: counter.x + 13, y: counter.y + 28, size: 18, value: counter.target.currentMorale,
    style: { fill: counter.target.currentMorale === counter.target.baseMorale ? "black" : counterRed }
  }
}

export function weaponBreakLayout(counter: Counter): CounterLayout | false {
  if (counter.target.isWreck) { return false }
  if (!counter.target.breakWeaponRoll) { return false }

  const x = counter.x + 14
  let y = counter.y + 25
  if (counter.target.breakdownRoll) { y -= 3 }
  const red = counter.target.breakDestroysWeapon || counter.target.jammed
  let fill = red ? counterRed : markerYellow
  let textColor = red ? "white" : "black"
  if (counter.target.weaponBroken) {
    fill = "rgba(0,0,0,0)"
    textColor = "rgba(0,0,0,0)"
  }
  return {
    path: circlePath(new Coordinate(x, y), 8),
    style: { stroke: textColor, strokeWidth: 1, fill: fill }, tStyle: { fill: textColor },
    x, y: y + 4.25, size: 15, value: counter.target.breakWeaponRoll,
  }
}

export function weaponFixLayout(counter: Counter): CounterLayout | false {
  if (!counter.target.repairRoll || !counter.target.jammed || counter.target.isWreck || counter.target.breakdownRoll) {
    return false
  }
  const loc = new Coordinate(counter.x + 14, counter.y + 40)
  return {
    path: circlePath(loc, 8),
    style: { stroke: "rgba(0,0,0,0)", strokeWidth: 1, fill: "rgba(0,0,0,0)" }, tStyle: { fill: "black" },
    x: loc.x, y: loc.y + 4.25, size: 12, value: counter.target.repairRoll,
  }
}

export function markerBreakLayout(counter: Counter): CounterLayout | false {
  if (!counter.target.isMarker || counter.target.type !== markerType.Jammed) { return false }

  const loc = new Coordinate(counter.x + 40, counter.y + 14)
  return {
    path: circlePath(loc, 10),
    style: { strokeWidth: 0, fill: counterRed }, tStyle: { fill: "white" },
    x: loc.x, y: loc.y + 4.25, size: 16, value: "4",
  }
}

export function markerFixLayout(counter: Counter): CounterLayout | false {
  if (!counter.target.isMarker || counter.target.type !== markerType.Jammed) { return false }
  const loc = new Coordinate(counter.x + 40, counter.y + 63)
  return {
    path: circlePath(loc, 8),
    style: { stroke: "rgba(0,0,0,0)", strokeWidth: 1, fill: "rgba(0,0,0,0)" }, tStyle: { fill: "black" },
    x: loc.x, y: loc.y + 4.25, size: 16, value: "18",
  }
}

export function sizeLayout(counter: Counter): CounterLayout | false {
  const x = counter.x + 66
  let y = counter.y + 23
  if (counter.target.icon === "cav" || counter.target.icon === "cav-wheel") { y -= 3 }
  if (!counter.target.size ) { return false }
  const stroke = counter.target.armored && !counter.target.isWreck ? "black" : clearColor
  const path = counter.target.armored && counter.target.topOpen ?
    squarePath(new Coordinate(x, y)) :
    circlePath(new Coordinate(x, y), 10)
  return {
    path,
    style: { stroke, strokeWidth: 1, fill: clearColor }, tStyle: { fill: "black" },
    x: x, y: y + 5, size: 18, value: counter.target.size,
  }
}

export function eliteLayout(counter: Counter): CounterLayout | false {
  if (!counter.isUnit) { return false }
  const showAllCounters = counter.onMap ? counter.map?.showAllCounters : counter.showAllCounters
  const elite = (counter.target as Unit).eliteCrew
  if (counter.target.isWreck || showAllCounters || elite === 0) {
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
  if (!counter.target.towSize) { return false }
  return {
    tStyle: { fill: "black" },
    x: counter.x + 73, y: counter.y + 21, size: 12, value: counter.target.towSize,
  }
}

export function canTowLayout(counter: Counter): CounterLayout | false {
  if (!counter.target.canTow) { return false }
  const x = counter.x + 66
  const y = counter.y + 30.5
  const size = 5
  const path = `M ${x - size} ${y} L ${x + size} ${y}`
  return { x, y, size, path, style: { stroke: "black", strokeWidth: 1 } }
}

export function transportLLayout(counter: Counter): CounterLayout | false {
  if (counter.target.transport !== 1 && counter.target.transport !== 3) { return false }
  const x = counter.x + 59
  let y = counter.y + 23
  if (counter.target.icon === "cav" || counter.target.icon === "cav-wheel") { y -= 3 }
  const size = 2
  const path = circlePath(new Coordinate(x, y), size)
  return { x, y, size, path, style: { fill: "black" } }
}

export function transportRLayout(counter: Counter): CounterLayout | false {
  if (counter.target.transport < 2) { return false }
  const x = counter.x + 73
  let y = counter.y + 23
  if (counter.target.icon === "cav" || counter.target.icon === "cav-wheel") { y -= 3 }
  const size = 2
  const path = circlePath(new Coordinate(x, y), size)
  return { x, y, size, path, style: { fill: "black" } }
}

export function leadershipLayout(counter: Counter): CounterLayout | false {
  if (!counter.target.currentLeadership) { return false }
  return {
    path: hexPath(new Coordinate(counter.x + 13, counter.y + 44), 10, true),
    style: { stroke: "black", strokeWidth: 1, fill: clearColor }, tStyle: { fill: "black" },
    x: counter.x + 13, y: counter.y + 49, size: 18, value: counter.target.currentLeadership,
  }
}

export function handlingLayout(counter: Counter): CounterLayout | false {
  if (!counter.target.currentGunHandling) { return false }
  const loc = new Coordinate(counter.x + 13, counter.y + 42)
  const path = circlePath(loc, 8)
  return {
    path: path, style: { stroke: "black", strokeWidth: 1, fill: clearColor },
    tStyle: { fill: "black" },
    x: loc.x, y: loc.y+4.25, size: 15, value: counter.target.currentGunHandling,
  }
}

export function breakdownLayout(counter: Counter): CounterLayout | false {
  if (!counter.target.breakdownRoll || counter.target.immobilized || counter.target.isWreck) {
    return false
  }
  const loc = new Coordinate(counter.x + 14, counter.y + 40)
  const path = circlePath(loc, 8)
  return {
    path: path, style: { stroke: "black", strokeWidth: 1, fill: markerYellow },
    tStyle: { fill: "black" },
    x: loc.x, y: loc.y+4.25, size: 15, value: counter.target.breakdownRoll,
  }
}

export function iconLayout(counter: Counter): CounterLayout | false {
  if (!counter.target.icon) { return false }
  const x = counter.x + (counter.target.fullIcon ? 0 : 20)
  let y = counter.y + (counter.target.fullIcon ? 0 : 13)
  if (counter.target.isFeature) {
    y = counter.y + 15
  }
  const size = counter.target.fullIcon ? 80 : 40
  return {
    x: x, y: y, size: size, icon: counter.target.isWreck ? "wreck" : counter.target.icon
  }
}

export function centerLabelLayout(counter: Counter): CounterLayout | false {
  if (!counter.target.sniperRoll) { return false }
  const x = counter.x + 40
  const y = counter.y + 48
  return {
    x: x, y: y, size: 40, value: counter.target.sniperRoll, style: { fill: counterRed }
  }
}

export function sponsonLayout(counter: Counter): CounterLayout | false {
  const gun = counter.target.sponson as [number, number] | [number, number, string]
  if (!gun || counter.target.isWreck) { return false }
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
    } else if (gun[2] === "g") {
      style.fill = "white"
    }
  }
  return {
    path: path, x: x, y: y, size: 9.5, style: style, value: `${gun[0]}-${gun[1]}`
  }
}

export function turretArmorLayout(counter: Counter): CounterLayout | false {
  const armor = counter.target.turretArmor as [number, number, number]
  if (!armor || counter.target.isWreck) { return false }
  const x = counter.x + 65
  const y = counter.y + 43
  const value = armor.map((v: number) => v < 0 ? "X" : v).join("-")
  return { x: x, y: y, size: 9.5, value: value}
}

export function hullArmorLayout(counter: Counter): CounterLayout | false {
  const armor = counter.target.hullArmor as [number, number, number]
  if (!armor || counter.target.isWreck) { return false }
  const x = counter.x + 65
  const y = counter.y + 53
  const value = armor.map(v => v < 0 ? "X" : v).join("-")
  return { x: x, y: y, size: 9.5, value: value}
}

export function firepowerLayout(counter: Counter): CounterLayout | false {
  if (counter.target.isMarker) { return false }
  const loc = new Coordinate(counter.x + 14 + (counter.target.minimumRange ? 0 : 2), counter.y + 67)
  const style = { stroke: clearColor, fill: clearColor, strokeWidth: 1 }
  let value = counter.target.baseFirepower
  let color = "black"
  let path = squarePath(loc)
  let size = value === "½" ? 18 : attrSizeFor(value as number)
  if (counter.target.noFire || counter.target.isPinned) {
    color = counterRed
    value = counter.target.currentFirepower
    size = 18
  } else {
    if (counter.target.antiTank || counter.target.fieldGun) {
      path = circlePath(loc, 10)
    }
    if (counter.target.offBoard) {
      path = hexPath(loc.yDelta(+0.5), 11, false)
      size = 12.5
    }
    if (counter.target.antiTank || counter.target.singleFire ||
        counter.target.assault || counter.target.offBoard) {
      style.stroke = "black"
    }
    if (counter.target.singleFire && counter.target.ignoreTerrain) {
      style.stroke = "red"
      style.fill = "red"
    } else if (counter.target.singleFire) {
      style.stroke = "black"
      style.fill = "black"
    } else if (counter.target.ignoreTerrain) {
      style.stroke = markerYellow
      style.fill = markerYellow
    }
    if (counter.target.fieldGun) {
      style.stroke = "black"
      style.fill = "white"
    }
    if (counter.target.singleFire) { color = "white" }
    if (value === 0) { value = "-" }
  }
  if (counter.target.isFeature) {
    if (!counter.target.fieldGun) {
      color = "white"
    }
    if (counter.target.antiTank) {
      style.stroke = "white"
    }
  }
  if (size < 16) { loc.yShift(-0.5) }
  return {
    path: path, style: style, tStyle: { fill: color },
    x: loc.x, y: loc.y+5, size: size, value: value,
  }
}

export function smokeLayout(counter: Counter): CounterLayout | false {
  if (!counter.target.currentSmokeCapable) { return false }
  let x = counter.x + 16
  let y = counter.y + 57
  const size = 2
  if (counter.target.assault || counter.target.targetedRange) { y -= 4 }
  if (counter.target.offBoard) { y -= 3 }
  if (counter.target.minimumRange) { x -= 2 }
  const path = circlePath(new Coordinate(x, y), size)
  return { x, y, size, path, style: { fill: "black" } }
}

export function rangeLayout(counter: Counter): CounterLayout | false {
  if (counter.target.isMarker) { return false }
  if (counter.target.isFeature &&
    [
      featureType.Smoke, featureType.Fire, featureType.Bunker, featureType.Foxhole,
      featureType.Rubble,
    ].includes(counter.target.type as FeatureType)) {
  return false
}
  let loc = new Coordinate(counter.x + 40, counter.y + 67)
  const style = { stroke: clearColor, fill: clearColor, strokeWidth: 1 }
  let value: number | string = counter.target.currentRange
  let color = "black"
  let path = squarePath(loc)
  let size = attrSizeFor(value)
  if (counter.target.noFire) {
    color = counterRed
    size = 18
  } else {
    if (counter.target.targetedRange) { path = circlePath(loc, 10) }
    if (counter.target.targetedRange || counter.target.rapidFire) { style.stroke = "black" }
    if (counter.target.type === "sw" && counter.target.targetedRange) {
      style.stroke = "black"
      style.fill = "black"
      color = "white"
    } else if (counter.target.turreted || counter.target.rotatingMount) {
      style.stroke = "white"
      style.fill = "white"
    }
    if (counter.target.targetedRange || counter.target.rapidFire) { style.stroke = "black" }
    if (value === 0) {
      style.stroke = clearColor
      value = "-"
    }
  }
  if (counter.target.isFeature) {
    color = "white"
  }
  if (size < 16) { loc.yShift(-0.5) }
  if (counter.target.minimumRange) {
    loc = new Coordinate(loc.x, counter.y + 65.25)
    path = [
      "M", loc.x-8, loc.y-4, "L", loc.x+8, loc.y-4,
      "A", 6, 6, 0, 0, 1, loc.x+8, loc.y+8,
      "L", loc.x-8, loc.y+8, "A", 6, 6, 0, 0, 1, loc.x-8, loc.y-4,
    ].join(" ")
    value = `${counter.target.minimumRange}-${value}`
    size = 10.5
  }
  return {
    path: path, style: style, tStyle: { fill: color }, x: loc.x, y: loc.y+5,
    size: size, value: value,
  }
}

export function gunForwardsLayout(counter: Counter): CounterLayout | false {
  if (!counter.target.rotatingVehicleMount) { return false }
  const x = counter.x + 40
  const y = counter.y + 60
  const size = 7
  const path = `M ${x - size} ${y} L ${x + size} ${y}`
  return { x, y, size, path, style: { stroke: "black", strokeWidth: 1 } }
}

export function gunBackwardsLayout(counter: Counter): CounterLayout | false {
  if (!counter.target.backwardsMount) { return false }
  const x = counter.x + 40
  const y = counter.y + 74.5
  const size = 2
  const path = circlePath(new Coordinate(x, y), size)
  return { x, y, size, path, style: { fill: "black" } }
}

export function movementLayout(counter: Counter): CounterLayout | false {
  if (counter.target.isMarker || counter.target.type === "rubble") { return false }
  const loc = new Coordinate(counter.x + 66 - (counter.target.minimumRange ? 0 : 2), counter.y + 67)
  const style = { stroke: clearColor, fill: clearColor, strokeWidth: 1 }
  let value = counter.target.currentMovement
  let color = "black"
  const path = circlePath(loc, 10)
  const size = attrSizeFor(value as number)
  if (counter.target.isBroken || counter.target.isPinned || counter.target.isTired ||
      value as number < 0 || counter.target.immobilized || counter.target.isWreck) {
    color = counterRed
  } else {
    if (counter.target.isTracked || counter.target.crewed || counter.target.isWheeled ) {
      style.stroke = "black"
    }
    if (counter.target.crewed) {
      style.fill = "black"
      color = "white"
    } else if (counter.target.isWheeled) {
      style.fill = "white"
    }
    if (value === 0) { value = "-" }
  }
  if (counter.target.isFeature) {
    color = "white"
    if ((counter.target as Feature).type === featureType.Roadblock) {
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
  if (!counter.target.engineer) { return false }
  const x = counter.x + 64
  const y = counter.y + 57
  const size = 2
  const path = circlePath(new Coordinate(x, y), size)
  return { x, y, size, path, style: { fill: "black" } }
}

export function amphibiousLayout(counter: Counter): CounterLayout | false {
  if (!counter.target.amphibious) { return false }
  const x = counter.x + 64
  const y = counter.y + 74
  const size = 4
  const path = `M ${x - size} ${y} L ${x + size} ${y}`
  return { x, y, size, path, style: { stroke: "black", strokeWidth: 1 } }
}

function counterColor(counter: Counter): string { return nationalColors[counter.target.nation] }

function reverseName(counter: Counter): boolean {
  return counter.target.isBroken || counter.target.isWreck ||
    (counter.target.jammed && !counter.target.hullArmor)
}

function attrSizeFor(n: number, circle: boolean = false): number {
  if (n > 9 || n < 0) {
    return circle ? 12.5 : 15
  } else {
    return 18
  }
}
