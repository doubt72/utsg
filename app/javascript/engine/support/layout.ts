import { Coordinate, Direction } from "../../utilities/commonTypes"
import {
  circlePath, counterRed, facingLayout, markerYellow, StatusLayout, SVGPathArray
} from "../../utilities/graphics"
import { normalDir } from "../../utilities/utilities"
import Counter from "../Counter"

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
