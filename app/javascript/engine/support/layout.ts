import { Coordinate, Direction } from "../../utilities/commonTypes"
import {
  BadgeLayout,
  circlePath, counterElite, counterGreen, counterRed, facingLayout, markerYellow, StatusLayout, SVGPathArray
} from "../../utilities/graphics"
import { normalDir } from "../../utilities/utilities"
import Counter from "../Counter"
import Map from "../Map"
import Unit from "../Unit"

export function counterStatusLayout(counter: Counter): StatusLayout | boolean {
  if (counter.target.isMarker) { return false }
  const showAllCounters = counter.onMap ? counter.map?.showAllCounters : counter.showAllCounters
  if (counter.target.isBroken || counter.target.isWreck || showAllCounters) { return false }
  const loc = new Coordinate(counter.x + 40, counter.y + 46)
  let size = 20
  const path = circlePath(loc.yDelta(-6), 22)
  const style = { fill: markerYellow, stroke: "black", strokeWidth: 2 }
  const fStyle = { fill: "black" }
  if (counter.target.isPinned || counter.target.immobilized || counter.target.turretJammed ||
      (counter.target.jammed && counter.target.hullArmor) || counter.target.weaponBroken) {
    style.fill = counterRed
    style.stroke = "white"
    fStyle.fill = "white"
  }
  let text = []
  if (counter.target.isActivated) { text.push("ACT") }
  if (counter.target.isExhausted) { text.push("EXH") }
  if (counter.target.isPinned) { text.push("PIN") }
  if (counter.target.isTired) { text.push("TRD") }
  if (counter.target.immobilized) { text.push("IMM") }
  if (counter.target.turretJammed) { text.push("TRT") }
  if (counter.target.jammed && counter.target.hullArmor) { text.push("JAM") }
  if (counter.target.weaponBroken) { text.push("WPN") }
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
  if (counter.target.rotates && !counter.target.isWreck &&
      !counter.target.hideOverlayRotation && !counter.reinforcement) {
    const turret = counter.target.turreted && !counter.target.isWreck
    const dir = turret ? counter.target.turretFacing : counter.target.facing
    badges.push({ text: `direction: ${dir}`, arrow: dir, color: "white", tColor: "black" })
  }
  if (!counter.target.isMarker || !counter.target.isWreck) {
    const u = counter.target
    const s = !map.showAllCounters
    if (!u.isFeature && (u as Unit).eliteCrew > 0 && s) {
      badges.push({ text: "elite crew +1", color: counterElite, tColor: "white" })
    }
    if (!u.isFeature && (u as Unit).eliteCrew < 0 && s) {
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

export function counterFacingLayout(counter: Counter): facingLayout | false {
  if ((!counter.target.turreted && !counter.target.rotates) || counter.target.isWreck ||
      counter.target.rotatingVehicleMount || counter.target.currentFirepower < 1) {
    return false
  }
  let dir = counter.target.turreted ? counter.target.turretFacing : counter.target.facing
  if (counter.target.backwardsMount) { dir = normalDir(dir + 3) }
  const path = facingLine(counter, dir).concat(facingLine(counter, normalDir(dir - 1))).join(" ")
  return {
    path: path, dash: "4 4", style: {
      fill: "rgba(0,0,0,0)", strokeWidth: 4, stroke: "rgba(255,255,255,1)"
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
