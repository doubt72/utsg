import { Coordinate, markerType } from "../../utilities/commonTypes"
import {
  CircleLayout, circlePath, clearColor, CounterLayout, counterRed, MarkerLayout, PathLayout,
  squarePath, TextArrayLayout
} from "../../utilities/graphics"
import Counter from "../Counter"

export function markerMoraleLayout(counter: Counter): CounterLayout | false {
  if (!counter.hasMarker || counter.marker.type !== markerType.Pinned) { return false }
  return {
    x: counter.x + 13, y: counter.y + 24, size: 16, value: "-1",
    tStyle: { fill: counterRed },
  }
}

export function markerBreakLayout(counter: Counter): CounterLayout | false {
  if (!counter.hasMarker || counter.marker.type !== markerType.Jammed) { return false }

  const loc = new Coordinate(counter.x + 40, counter.y + 14)
  return {
    path: circlePath(loc, 10),
    style: { strokeWidth: 0, fill: counterRed }, tStyle: { fill: "white" },
    x: loc.x, y: loc.y + 4.25, size: 16, value: "4",
  }
}

export function markerFixLayout(counter: Counter): CounterLayout | false {
  if (!counter.hasMarker || counter.marker.type !== markerType.Jammed) { return false }
  const loc = new Coordinate(counter.x + 40, counter.y + 63)
  return {
    path: circlePath(loc, 8),
    style: { stroke: "rgba(0,0,0,0)", strokeWidth: 1, fill: "rgba(0,0,0,0)" }, tStyle: { fill: "black" },
    x: loc.x, y: loc.y + 4.25, size: 16, value: "18",
  }
}

export function markerFirepowerLayout(counter: Counter): CounterLayout | false {
  if (!counter.hasMarker || counter.marker.type !== markerType.Pinned) { return false }
  const loc = new Coordinate(counter.x + 16, counter.y + 67)
  const style = { stroke: clearColor, fill: clearColor, strokeWidth: 1 }
  const path = squarePath(loc)
  return {
    path: path, style: style, tStyle: { fill: counterRed },
    x: loc.x, y: loc.y + 4, size: 18, value: "½",
  }
}

export function markerRangeLayout(counter: Counter): CounterLayout | false {
  if (!counter.hasMarker || counter.marker.type !== markerType.Pinned) { return false }
  const loc = new Coordinate(counter.x + 40, counter.y + 67)
  const style = { stroke: clearColor, fill: clearColor, strokeWidth: 1 }
  const path = squarePath(loc)
  return {
    path: path, style: style, tStyle: { fill: counterRed }, x: loc.x, y: loc.y + 4,
    size: 18, value: "-",
  }
}

export function markerMovementLayout(counter: Counter): CounterLayout | false {
  if (!counter.hasMarker || counter.marker.type !== markerType.Pinned) { return false }
  const loc = new Coordinate(counter.x + 64, counter.y + 67)
  const style = { stroke: clearColor, fill: clearColor, strokeWidth: 1 }
  const path = circlePath(loc, 10)
  return {
    path: path, style: style, tStyle: { fill: counterRed }, x: loc.x, y: loc.y + 4,
    size: 18, value: "0",
  }
}

export function markerLayout(counter: Counter): MarkerLayout | false {
  if (!counter.hasMarker || counter.marker.type === markerType.TrackedHull ||
      counter.marker.type === markerType.WheeledHull ||
      counter.marker.type === markerType.Initiative) {
    return false
  }
  const loc = new Coordinate(counter.x + 40, counter.y + 40)
  const marker = counter.marker
  let size = (marker.displayText[0] === "immobilized") ? 11 : 12
  let ty = loc.y + 9 - 6 * marker.displayText.length
  if (counter.marker.type === markerType.Wind || counter.marker.type === markerType.Weather) {
    size = 15
    ty += 1
  } else if (counter.marker.type === markerType.Turn) {
    size = 22
    ty -= 15
  }
  const text = marker.displayText.map((t, i) => {
    return { x: loc.x, y: ty + size*i, value: t }
  })
  if (counter.marker.type === markerType.Turn) {
    return { size: size, tStyle: { fill: counter.marker.textColor }, text: text }
  } else {
    return {
      path: [
        "M", loc.x-39.5, loc.y-14, "L", loc.x+39.5, loc.y-14, "L", loc.x+39.5, loc.y+14,
        "L", loc.x-39.5, loc.y+14, "L", loc.x-39.5, loc.y-14
      ].join(" "),
      style: { fill: marker.color }, size: size,
      tStyle: { fill: marker.textColor }, text: text
    }
  }
}

export function turnLayout(counter: Counter): CircleLayout[] | false {
  if (!counter.marker.isMarker || counter.marker.type !== markerType.Turn ) { return false }
  return [
    {
      x: counter.x + 22, y: counter.y + 50, r: 16,
      style: {
        fill: `url(#nation-${counter.marker.value}-16)`, strokeWidth: 1, stroke: "#000"
      }
    },
    {
      x: counter.x + 58, y: counter.y + 50, r: 16,
      style: {
        fill: `url(#nation-${counter.marker.value2}-16)`, strokeWidth: 1, stroke: "#000"
      }
    }
  ]
}

export function windArrowLayout(counter: Counter): PathLayout | false {
  if (!counter.hasMarker) { return false }
  if (counter.marker.type !== markerType.Wind) { return false }

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
  if (!counter.hasMarker) { return false }
  const target = counter.marker
  if (!target.subText) { return false }

  const x = counter.x + 40
  const y = [counter.y + 22, counter.y + 64, counter.y + 75]
  return { style: { fill: "#222" }, value: target.subText, x: x, y: y, size: 11.5 }
}
