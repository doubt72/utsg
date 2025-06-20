import { Coordinate, Direction, markerType } from "../../utilities/commonTypes"
import {
  BadgeLayout, baseCounterPath, circlePath, clearColor, counterElite, counterGreen, CounterLayout,
  counterRed, dropSelectColor, lastSelectColor, loadedSelectColor, loaderSelectColor, markerYellow, nationalColors,
  selectColor, StatusLayout, SVGStyle
} from "../../utilities/graphics"
import Counter from "../Counter"
import Map from "../Map"

export function counterPath(counter: Counter, xOffset: number = 0, yOffset: number = 0): string {
  return baseCounterPath(counter.x + xOffset, counter.y + yOffset)
}

export function counterStyle(counter: Counter): SVGStyle {
  const color = counterColor(counter)
  if (counter.hasMarker && counter.marker.type === markerType.Turn) {
    return { fill: "#DFDFDF", stroke: "black", strokeWidth: 1 }
  }
  if (!counter.hasUnit) {
    return { fill: color, stroke: "black", strokeWidth: 1 }
  }
  if (counter.targetUF.selected) {
    return { fill: color, stroke: selectColor, strokeWidth: 4 }
  } else if (counter.unit.dropSelected) {
    return { fill: color, stroke: dropSelectColor, strokeWidth: 4 }
  } else if (counter.unit.loaderSelected) {
    return { fill: color, stroke: loaderSelectColor, strokeWidth: 4 }
  } else if (counter.unit.loadedSelected) {
    return { fill: color, stroke: loadedSelectColor, strokeWidth: 4 }
  } else if (counter.targetUF.lastSelected) {
    return { fill: color, stroke: lastSelectColor, strokeWidth: 4 }
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
  let size = counter.hasFeature ? 11 : 9
  if (counter.unit.smallName > 0) { size = 8.25 }
  if (counter.unit.smallName > 1) { size = 7.825 }
  if (counter.unit.smallName > 2) { size = 7.5 }
  const y = counter.hasFeature ? counter.y + 12 : counter.y + 10
  return {
    x: counter.x + 5, y: y, size: size, name: counter.targetUF.name,
    style: { fill: reverseName(counter) ? "white" : "black" }
  }
}

export function counterStatusLayout(counter: Counter): StatusLayout | boolean {
  if (!counter.hasUnit) { return false }
  const showAllCounters = counter.onMap ? counter.map?.showAllCounters : counter.showAllCounters
  if (counter.unit.isBroken || counter.unit.isWreck || showAllCounters) { return false }
  const loc = new Coordinate(counter.x + 40, counter.y + 46)
  let size = 20
  const path = circlePath(loc.yDelta(-6), 22)
  const style = { fill: markerYellow, stroke: "black", strokeWidth: 2 }
  const fStyle = { fill: "black" }
  if (counter.unit.isPinned || counter.unit.immobilized || counter.unit.turretJammed ||
      (counter.unit.jammed && counter.unit.hullArmor) || counter.unit.weaponBroken) {
    style.fill = counterRed
    style.stroke = "white"
    fStyle.fill = "white"
  }
  let text = []
  if (counter.unit.isActivated) { text.push("ACT") }
  if (counter.unit.isExhausted) { text.push("EXH") }
  if (counter.unit.isPinned) { text.push("PIN") }
  if (counter.unit.isTired) { text.push("TRD") }
  if (counter.unit.immobilized) { text.push("IMM") }
  if (counter.unit.turretJammed) { text.push("TRT") }
  if (counter.unit.jammed && counter.unit.hullArmor) { text.push("JAM") }
  if (counter.unit.weaponBroken) { text.push("WPN") }
  if (text.length === 0) { return false }
  if (text.length === 2) {
    size = 15
    loc.yShift(-9)
  } else if (text.length === 3) {
    size = 12
    loc.yShift(-14.5)
  } else if (text.length === 4) {
    size = 9
    loc.yShift(-17)
  } else if (text.length > 4) {
    size = 8.5
    loc.yShift(-8)
    text = [text.slice(0,2).join(" "), text.slice(2,4).join(" "), text.slice(4,6).join(" ")]
  }
  return {
    value: text, x: loc.x, y: loc.y, size: size, path: path,
    style: style, fStyle: fStyle
  }
}

export function counterInfoBadges(
  map: Map, x: number, y: number, maxY: number, counter: Counter, shift: number
): BadgeLayout[] {
  const badges: { text: string, color: string, tColor: string, arrow?: Direction}[] = []
  if (counter.targetUF.rotates && !(counter.hasUnit && counter.unit.isWreck) &&
      !(counter.hasMarker && counter.marker.hideOverlayRotation) && !counter.reinforcement) {
    const turret = counter.hasUnit && counter.unit.turreted && !counter.unit.isWreck
    const dir = turret ? counter.unit.turretFacing : counter.targetUF.facing
    badges.push({ text: `direction: ${dir}`, arrow: dir, color: "white", tColor: "black" })
  }
  if (counter.hasUnit && !counter.unit.isWreck) {
    const u = counter.unit
    const s = !map.showAllCounters
    if (u.eliteCrew > 0 && s) {
      badges.push({ text: "elite crew +1", color: counterElite, tColor: "white" })
    }
    if (u.eliteCrew < 0 && s) {
      badges.push({ text: "green crew -1", color: counterGreen, tColor: "black" })
    }
    if (u.isBroken) {
      badges.push({ text: "broken", color: counterRed, tColor: "white" })
    }
    if (u.isWreck) {
      badges.push({ text: "destroyed", color: counterRed, tColor: "white" })
    }
    if (u.immobilized && s) {
      badges.push({ text: "immobilized", color: counterRed, tColor: "white" })
    }
    if (u.turretJammed && s) {
      badges.push({ text: "turret jammed", color: counterRed, tColor: "white" })
    }
    if (u.jammed && u.turreted && s) {
      badges.push({ text: "weapon jammed", color: counterRed, tColor: "white" })
    } else if (u.jammed && !u.turreted) {
      badges.push({ text: "broken", color: counterRed, tColor: "white" })
    } else if (u.weaponBroken && s) {
      badges.push({ text: "weapon broken", color: counterRed, tColor: "white" })
    }
    if (u.isTired && s) {
      badges.push({ text: "tired", color: markerYellow, tColor: "black" })
    }
    if (u.isPinned && s) {
      badges.push({ text: "pinned", color: counterRed, tColor: "white" })
    }
    if (u.isExhausted && s) {
      badges.push({ text: "exhausted", color: markerYellow, tColor: "black" })
    }
    if (u.isActivated && s) {
      badges.push({ text: "activated", color: markerYellow, tColor: "black" })
    }
  }
  const size = 24
  let diff = size+4
  let start = y
  if (y + diff * badges.length > maxY) {
    diff = -diff
    start = y - 210 - shift
  }
  return badges.map((raw, i): BadgeLayout => {
    const b: BadgeLayout = raw
    b.x = x+5
    b.y = start + diff*i
    b.size = size-8
    b.path = [
      "M", x, b.y-size/2, "L", x+137.5, b.y-size/2, "L", x+137.5, b.y+size/2 ,
      "L", x, b.y+size/2, "L", x, b.y-size/2
    ].join(" ")
    if (b.arrow) {
      const c = x-size*0.6
      b.dirpath = [
        "M", c-size/2, b.y, "A", size/2, size/2, 0, 0, 1, c+size/2, b.y,
        "A", size/2, size/2, 0, 0, 1, c-size/2, b.y
      ].join(" ")
      b.dx = c
      b.dy = b.y
    }
    b.y = b.y + 5
    return b
  })
}

export function counterColor(counter: Counter): string {
  return nationalColors[counter.targetUF.nation]
}

function reverseName(counter: Counter): boolean {
  if(!counter.hasUnit) { return false }
  return counter.unit.isBroken || counter.unit.isWreck ||
    (counter.unit.jammed && !counter.unit.hullArmor)
}
