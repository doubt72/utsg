import { Coordinate, markerType } from "../../utilities/commonTypes"
import {
  CircleLayout, circlePath, clearColor, CounterLayout, counterRed, MarkerLayout, PathLayout,
  squarePath, TextArrayLayout
} from "../../utilities/graphics"
import Counter from "../Counter"
import Marker from "../Marker"

export function markerMoraleLayout(counter: Counter): CounterLayout | false {
  if (!counter.target.isMarker || counter.target.type !== markerType.Pinned) { return false }
  return {
    x: counter.x + 13, y: counter.y + 24, size: 16, value: "-1",
    tStyle: { fill: counterRed },
  }
}

export function markerFirepowerLayout(counter: Counter): CounterLayout | false {
  if (!counter.target.isMarker || counter.target.type !== markerType.Pinned) { return false }
  const loc = new Coordinate(counter.x + 16, counter.y + 67)
  const style = { stroke: clearColor, fill: clearColor, strokeWidth: 1 }
  const path = squarePath(loc)
  return {
    path: path, style: style, tStyle: { fill: counterRed },
    x: loc.x, y: loc.y + 4, size: 18, value: "½",
  }
}

export function markerRangeLayout(counter: Counter): CounterLayout | false {
  if (!counter.target.isMarker || counter.target.type !== markerType.Pinned) { return false }
  const loc = new Coordinate(counter.x + 40, counter.y + 67)
  const style = { stroke: clearColor, fill: clearColor, strokeWidth: 1 }
  const path = squarePath(loc)
  return {
    path: path, style: style, tStyle: { fill: counterRed }, x: loc.x, y: loc.y + 4,
    size: 18, value: "-",
  }
}

export function markerMovementLayout(counter: Counter): CounterLayout | false {
  if (!counter.target.isMarker || counter.target.type !== markerType.Pinned) { return false }
  const loc = new Coordinate(counter.x + 64, counter.y + 67)
  const style = { stroke: clearColor, fill: clearColor, strokeWidth: 1 }
  const path = circlePath(loc, 10)
  return {
    path: path, style: style, tStyle: { fill: counterRed }, x: loc.x, y: loc.y + 4,
    size: 18, value: "0",
  }
}

export function markerLayout(counter: Counter): MarkerLayout | false {
  if (!counter.target.isMarker || counter.target.type === markerType.TrackedHull ||
      counter.target.type === markerType.WheeledHull ||
      counter.target.type === markerType.Initiative) {
    return false
  }
  const loc = new Coordinate(counter.x + 40, counter.y + 40)
  const target = counter.target as Marker
  let size = (target.displayText[0] === "immobilized") ? 11 : 12
  let ty = loc.y + 9 - 6 * target.displayText.length
  if (counter.target.type === markerType.Wind || counter.target.type === markerType.Weather) {
    size = 15
    ty += 1
  } else if (counter.target.type === markerType.Turn) {
    size = 22
    ty -= 15
  }
  const text = target.displayText.map((t, i) => {
    return { x: loc.x, y: ty + size*i, value: t }
  })
  if (counter.target.type === markerType.Turn) {
    return { size: size, tStyle: { fill: counter.target.textColor }, text: text }
  } else {
    return {
      path: [
        "M", loc.x-39.5, loc.y-14, "L", loc.x+39.5, loc.y-14, "L", loc.x+39.5, loc.y+14,
        "L", loc.x-39.5, loc.y+14, "L", loc.x-39.5, loc.y-14
      ].join(" "),
      style: { fill: target.color }, size: size,
      tStyle: { fill: target.textColor }, text: text
    }
  }
}

export function turnLayout(counter: Counter): CircleLayout[] | false {
  if (!counter.target.isMarker || counter.target.type !== markerType.Turn ) { return false }
  return [
    {
      x: counter.x + 22, y: counter.y + 50, r: 16,
      style: {
        fill: `url(#nation-${counter.target.value}-16)`, strokeWidth: 1, stroke: "#000"
      }
    },
    {
      x: counter.x + 58, y: counter.y + 50, r: 16,
      style: {
        fill: `url(#nation-${counter.target.value2}-16)`, strokeWidth: 1, stroke: "#000"
      }
    }
  ]
}

export function windArrowLayout(counter: Counter): PathLayout | false {
  if (!counter.target.isMarker) { return false }
  if (counter.target.type !== markerType.Wind) { return false }

  const x = counter.x + 40
  const y = counter.y + 5
  return {
    path: [
      "M", x - 6, y + 6, "L", x, y, "L", x + 6, y + 6
    ].join(" "),
    style: { fill: "rgba(0,0,0,0", stroke: "black", strokeWidth: 1.5 },
  }
}

export function markerSubLayout(counter: Counter): TextArrayLayout | false {
  if (!counter.target.isMarker) { return false }
  const target = counter.target as Marker
  if (!target.subText) { return false }

  const x = counter.x + 40
  const y = [counter.y + 22, counter.y + 64, counter.y + 75]
  return { style: { fill: "#222" }, value: target.subText, x: x, y: y, size: 11.5 }
}
