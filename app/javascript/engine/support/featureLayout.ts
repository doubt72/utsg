import { CounterLayout, counterRed } from "../../utilities/graphics"
import Counter from "../Counter"

export function featureLayout(counter: Counter): CounterLayout | boolean {
  if (!counter.hasFeature) { return false }
  const feature = counter.feature
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
  if (feature.blocksLos) {
    value = "blocks LOS"
  } else if (feature.hindrance && !feature.impassableToVehicles) {
    value = `hindrance ${feature.hindrance}`
    size = 10.5
  } else if (feature.cover && !feature.impassableToVehicles) {
    size = 14
    value = `cover ${feature.cover}`
  } else if (feature.coverSides) {
    const cs = feature.coverSides
    value = `cover ${cs[0]}-${cs[1]}-${cs[2]}`
    size = 10.5
  }
  const style = { fill: counterRed }
  const tStyle = { fill: "white" }
  if (["foxhole", "bunker"].includes(feature.type)) {
    style.fill = "#999"
    tStyle.fill = "white"
  }
  if (["smoke"].includes(feature.type)) {
    style.fill = "#DDD"
    tStyle.fill = "black"
  }
  return {
    path: path, style: style, value: value, tStyle: tStyle, x: x+40, y: y+70, size: size
  }
}
