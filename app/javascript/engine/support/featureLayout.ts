import { CounterLayout, counterRed } from "../../utilities/graphics"
import Counter from "../Counter"
import Feature from "../Feature"

export function featureLayout(counter: Counter): CounterLayout | boolean {
  if (!counter.target.isFeature) { return false }
  const target = counter.target as Feature
  const x = counter.x + 0.5
  const y = counter.y + 0.5
  const corner = 3.5
  const path = [
    "M", x, y+54.5, "L", x+79, y+54.5, "L", x+79, y+79-corner,
    "A", corner, corner, 0, 0, 1, x+79-corner, y+79,
    "L", x+corner, y+79, "A", corner, corner, 0, 0, 1, x, y+79-corner, "L", x, y+54.5
  ].join(" ")
  let value = ""
  let size = 11
  if (counter.target.blocksLos) {
    value = "blocks LOS"
  } else if (target.hindrance && !target.impassableToVehicles) {
    value = `hindrance ${counter.target.hindrance}`
    size = 10.5
  } else if (target.cover && !target.impassableToVehicles) {
    size = 14
    value = `cover ${target.cover}`
  } else if (target.coverSides) {
    const cs = target.coverSides
    value = `cover ${cs[0]}-${cs[1]}-${cs[2]}`
    size = 10.5
  }
  const style = { fill: counterRed }
  const tStyle = { fill: "white" }
  if (["foxhole", "bunker"].includes(target.type)) {
    style.fill = "#999"
    tStyle.fill = "white"
  }
  if (["smoke"].includes(target.type)) {
    style.fill = "#DDD"
    tStyle.fill = "black"
  }
  return {
    path: path, style: style, value: value, tStyle: tStyle, x: x+40, y: y+70, size: size
  }
}
