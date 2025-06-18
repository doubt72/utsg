import {
  baseTerrainType, Direction, RoadCenterType, roadType, streamType, terrainType
} from "../../utilities/commonTypes"
import { CircleLayout, PathLayout, SVGPathArray, SVGStyle } from "../../utilities/graphics"
import { hexBuildingBuildingDisplay } from "../../utilities/hexBuilding"
import { normalDir } from "../../utilities/utilities"
import Hex from "../Hex"
  
export function hexBackground(hex: Hex): SVGStyle {
  if (hex.elevationEdges === "all") {
    return elevationStyles(hex)[hex.elevation]
  } else {
    if (hex.elevation > 0) {
      return elevationStyles(hex)[hex.elevation ? hex.elevation - 1 : 0]
    } else {
      return elevationStyles(hex)[0]
    }
  }
}

export function hexTerrainCircle(hex: Hex): CircleLayout | false {
  if (hex.terrainEdges !== "none" || hex.baseTerrain === "o") { return false }
  return {
    x: hex.xOffset, y: hex.yOffset, r: hex.narrow/2 - 5,
    style: patternStyles(hex)[hex.baseTerrain] || { fill: "rgba(0,0,0,0" }
  }
}

export function hexTerrainContinuous(hex: Hex): PathLayout | false {
  const edges = hex.terrainEdges
  if (edges == "none" || edges === "all") { return false }
  return {
    path: generatePaths(hex, edges, 4),
    style: patternStyles(hex)[hex.baseTerrain] || { fill: "rgba(0,0,0,0" }
  }
}

export function hexTerrainPattern(hex: Hex): SVGStyle | false {
  if (!patternStyles(hex)[hex.baseTerrain]) { return false }
  return patternStyles(hex)[hex.baseTerrain]
}

export function hexEdgeCoords(hex: Hex, dir: Direction): string {
  return [
    "M", hex.xCorner(normalDir(dir-1)), hex.yCorner(normalDir(dir-1)),
    "L", hex.xCorner(dir), hex.yCorner(dir),
  ].join(" ")
}

// Draw the orchard hex, rotated by direction
export function orchardDisplay(hex: Hex): CircleLayout[] | false {
  if (hex.baseTerrain !== terrainType.Orchard) { return false }
  const trees = []
  for (let x = 0; x < 3; x++) {
    for (let y = 0; y < 2; y++) {
      const dir = -hex.direction - 0.5
      const mag = hex.radius*0.5
      const x0 = hex.xOffset + (x-1) * mag * Math.sin(dir/3 * Math.PI) +
        (y-0.5) * mag * Math.sin((dir/3 + 0.5) * Math.PI)
      const y0 = hex.yOffset + (x-1) * mag * Math.cos(dir/3 * Math.PI) +
        (y-0.5) * mag * Math.cos((dir/3 + 0.5) * Math.PI)
      // trees.push({ x: x0, y: y0, r: hex.radius/5, style: { fill: "#4A4" } })
      trees.push({ x: x0, y: y0, r: hex.radius/5, style: { fill: "#070" } })
    }
  }
  return trees
}

export function buildingDisplay(hex: Hex): PathLayout | false {
  return hexBuildingBuildingDisplay(hex)
}

export function hexEdgePath(hex: Hex): string | false {
  if (!hex.border || !hex.borderEdges) { return false }
  return hex.borderEdges.map(d => {
    return [
      "M", hex.xCorner(normalDir(d-1)), hex.yCorner(normalDir(d-1)),
      "L", hex.xCorner(d), hex.yCorner(d)
    ].join(" ")
  }).join(" ")
}

export function hexEdgeCoreStyle(hex: Hex): SVGStyle | false {
  if (!hex.border) { return false }
  return borderStyles[hex.border]
}

export function hexEdgeDecorationStyle(hex: Hex): SVGStyle | false {
  if (!hex.border) { return false }
  return borderDecorationStyles[hex.border]
}

export function hexElevation(hex: Hex): PathLayout | false {
  if (hex.elevationEdges !== "none" || hex.elevation < 1) { return false }
  return {
    path: hexRoundCoordsInset(hex, 5), style: elevationStyles(hex)[hex.elevation]
  }
}

export function hexElevationContinuous(hex: Hex): PathLayout | false {
  const edges = hex.elevationEdges
  if (edges === "none" || edges === "all") { return false }
  return {
    path: generatePaths(hex, edges, 2), style: elevationStyles(hex)[hex.elevation || 0]
  }
}

export function roadPath(hex: Hex): string {
  return path(hex, hex.roadDirections, hex.roadCenter)
}

export function roadOutlineStyle(hex: Hex): SVGStyle {
  const width = hex.roadType === "p" ? 10 : 28
  return {
    fill: "rgba(0,0,0,0)",
    strokeWidth: (["j", "f", "b"].includes(hex.baseTerrain) || hex.river) ? width : 0,
    stroke: elevationStyles(hex)[hex.elevation || 0]["fill"],
    strokeLinejoin: "round",
  }
}

export function bridgeStyle(hex: Hex): SVGStyle {
  return {
    fill: "rgba(0,0,0,0)",
    strokeWidth: 28,
    stroke: hex.roadType === "t" ? "#BBB" : "#975",
  }
}

export function roadEdgeStyle(hex: Hex): SVGStyle {
  const stroke = (hex.roadType === roadType.Tarmac || hex.roadType === roadType.Airfield) ?
    "#AAA" : "#FD7"
  let width = hex.roadType === roadType.Path ? 0 : 16
  if (hex.roadType === roadType.Airfield) { width = 64 }
  return {
    fill: "rgba(0,0,0,0)",
    strokeWidth: width,
    stroke: stroke,
    strokeLinejoin: hex.roadType === roadType.Airfield ? "miter" : "round",
  }
}

export function roadStyle(hex: Hex): SVGStyle {
  let stroke = hex.roadType === roadType.Tarmac ? "#DDD" : "#B85"
  let width = 12
  if (hex.roadType === roadType.Path) {
    stroke = "rgba(47, 31, 0, 0.5)"
    width = 2
  }
  if (hex.roadType === roadType.Airfield) {
    stroke = "#DCB"
    width = 56
  }
  return {
    fill: "rgba(0,0,0,0)",
    strokeWidth: width,
    stroke,
    strokeDasharray: hex.roadType === roadType.Path ? [5, 5] : undefined,
    strokeLinejoin: hex.roadType === roadType.Airfield ? "miter" : "round",
  }
}

export function roadRotate(hex: Hex): string {
  if (!hex.roadRotation) { return "" }
  return `rotate(${hex.roadRotation * 60} ${hex.xOffset} ${hex.yOffset})`
}

export function railroadPath(hex: Hex): string {
  if (!hex.railroadDirections) { return "" }
  return hex.railroadDirections.map(d => path(hex, d)).join(" ")
}

export function railroadBedStyle(): SVGStyle {
  return {
    fill: "rgba(0,0,0,0)",
    strokeWidth: 28,
    stroke: "rgba(127,63,0,0.25)",
    strokeLinejoin: "round",
  }
}

export function railroadBridgeStyle(): SVGStyle {
  return {
    fill: "rgba(0,0,0,0)",
    strokeWidth: 22,
    stroke: "#DDD",
  }
}

export function railroadtieStyle(): SVGStyle {
  return {
    fill: "rgba(0,0,0,0)",
    strokeWidth: 16,
    stroke: "#777",
    strokeDasharray: [3, 20],
    strokeLinejoin: "round",
  }
}

export function railroadTrackStyle(): SVGStyle {
  return {
    fill: "rgba(0,0,0,0)",
    strokeWidth: 6,
    stroke: "#777",
    strokeLinejoin: "round",
  }
}

export function riverPath(hex: Hex): string {
  return path(hex, hex.riverDirections)
}

export function riverStyle(hex: Hex): SVGStyle {
  let color = hex.map.baseTerrain === baseTerrainType.Snow ? iceWater : darkWater
  let dash = undefined
  if (hex.riverType === "g") {
    color = "#070"
    dash = [14, 14]
  } else if (hex.riverType === "t") {
    color = "#753"
    dash = [18, 5]
  }
  return {
    fill: "rgba(0,0,0,0)",
    strokeWidth: 10,
    stroke: color,
    strokeDasharray: dash,
    strokeLinejoin: "round",
  }
}

export function victoryLayout(hex: Hex): CircleLayout | false {
  const victory = hex.map.victoryNationAt(hex.coord)
  if (!victory) { return false }
  const x = hex.xCorner(5, 20)
  const y = hex.yCorner(5, 20)
  return {
    x: x, y: y, r: 12, style: {
      fill: `url(#nation-${victory}-12)`, strokeWidth: 1, stroke: "#000"
    },
  }
}

export function elevationStyles(hex: Hex): { [index: number]: SVGStyle } {
  return {
    "-1": { fill: "#ACA" },
    0: { fill: hex.map.baseTerrainColor },
    1: { fill: "#DB9" },
    2: { fill: "#CA8" },
    3: { fill: "#B97" },
    4: { fill: "#A86" },
    5: { fill: "#975" },
  }
}

const lightWater = "#59C"
const darkWater = "#46A"
const iceWater = "#DDE"

function patternStyles(hex: Hex): { [index: string]: SVGStyle } {
  return {
    f: { fill: "url(#forest-pattern)" },
    b: { fill: "url(#brush-pattern)" },
    j: { fill: "url(#jungle-pattern)" },
    p: { fill: "url(#palm-pattern)" },
    s: { fill: "url(#sand-pattern)" },
    r: { fill: "url(#rough-pattern)" },
    m: { fill: hex.map.baseTerrain === baseTerrainType.Snow ? "url(#frozen-marsh-pattern)" :
      "url(#marsh-pattern)" },
    g: { fill: "url(#grain-pattern)" },
    t: { fill: "url(#soft-pattern)" },
    x: { fill: "url(#debris-pattern)" },
    w: { fill: hex.map.baseTerrain === baseTerrainType.Snow ? iceWater : darkWater },
    y: { fill: lightWater },
  }
}

const borderStyles: { [index: string]: SVGStyle } = {
  f: { stroke: "#963", strokeWidth: 3 },
  w: { stroke: "#BBB", strokeWidth: 8, strokeLinecap: "round" },
  b: { stroke: "#070", strokeWidth: 8, strokeLinecap: "round" },
  c: { stroke: "#320", strokeWidth: 8, strokeLinecap: "round" },
}

const borderDecorationStyles: { [index: string]: SVGStyle } = {
  f: { stroke: "#963", strokeWidth: 8, strokeDasharray: [2, 11.1] },
  w: { stroke: "#888", strokeWidth: 8, strokeDasharray: [2, 2] },
  b: { stroke: "rgba(0,0,0,0)" },
  c: { stroke: "rgba(0,0,0,0)" },
}

// Used for "isolated" terrain hexes (e.g., summits)
function hexRoundCoordsInset(hex: Hex, inset: number): string {
  let path = [
    "M", hex.xCornerOffset(6, inset, 1, inset),
    hex.yCornerOffset(6, inset, 1, inset)
  ]
  for (let i = 1; i <= 6; i++) {
    path = path.concat([
      "L", hex.xCornerOffset(i as Direction, inset, -1, inset),
      hex.yCornerOffset(i as Direction, inset, -1, inset)
    ])
    path = path.concat([
      "A", inset*2, inset*2, 0, 0, 1,
      hex.xCornerOffset(i as Direction, inset, 1, inset),
      hex.yCornerOffset(i as Direction, inset, 1, inset)
    ])
  }
  return path.join(" ")
}
  
// Used for both terrain and elevations; terrain has a deeper inset on open
// sides to make it easier to pick out
function generatePaths(hex: Hex, edges: boolean[], edgeOffset: number): string {
  let path: SVGPathArray = []
  for (let j = 0; j < 6; j++) {
    if (!edges[j]) {
      continue
    }
    if (hex.checkSide(edges, j-1)) {
      path = ["M", hex.xCorner(normalDir(j)), hex.yCorner(normalDir(j))]
    } else {
      path = [
        "M", hex.xCornerOffset(normalDir(j), edgeOffset, 1),
        hex.yCornerOffset(normalDir(j), edgeOffset, 1)
      ]
    }
    for (let i = j; i < j + 6; i++) {
      if (hex.checkSide(edges, i)) {
        if (hex.checkSide(edges, i+1)) {
          path = path.concat([
            "L", hex.xCorner(normalDir(i+1)), hex.yCorner(normalDir(i+1))
          ])
        } else {
          path = path.concat([
            "L", hex.xCornerOffset(normalDir(i+1), edgeOffset, -1),
            hex.yCornerOffset(normalDir(i+1), edgeOffset, -1)
          ])
        }
      } else {
        if (hex.checkSide(edges, i-1)) {
          path = path.concat(
            [
              "A", hex.radius*2, hex.radius*2, 0, 0, 0,
              hex.xEdge(normalDir(i+1), edgeOffset*2),
              hex.yEdge(normalDir(i+1), edgeOffset*2)
            ]
          )
        } else {
          path = path.concat(
            [
              "A", hex.radius - edgeOffset*4, hex.radius - edgeOffset*4, 0, 0, 1,
              hex.xEdge(normalDir(i+1), edgeOffset*2),
              hex.yEdge(normalDir(i+1), edgeOffset*2)
            ]
          )
        }
        if (hex.checkSide(edges, i+1)) {
          path = path.concat(
            [
              "A", hex.radius*2, hex.radius*2, 0, 0, 0,
              hex.xCornerOffset(normalDir(i+1), edgeOffset, 1),
              hex.yCornerOffset(normalDir(i+1), edgeOffset, 1)
            ]
          )
        } else {
          path = path.concat(
            [
              "A", hex.radius - edgeOffset*4, hex.radius - edgeOffset*4, 0, 0, 1,
              hex.xCorner(normalDir(i+1), edgeOffset*4),
              hex.yCorner(normalDir(i+1), edgeOffset*4)
            ]
          )
        }
      }
    }
    break
  }
  return path.join(" ")
}

function path(hex: Hex, directions?: Direction[], center?: RoadCenterType): string {
  if (!directions) { return "" }
  if (directions.length === 2 && !(hex.river && hex.riverType === streamType.Trench) &&
    !(hex.road && hex.roadType === roadType.Airfield)) {
    const d1 = directions[0]
    const d2 = directions[1]
    const x1 = hex.xEdge(d1)
    const y1 = hex.yEdge(d1)
    const x2 = hex.xEdge(d2)
    const y2 = hex.yEdge(d2)
    let xCenter = hex.xOffset
    if (center === "l") {
      xCenter -= hex.narrow / 4
    } else if (center === "r") {
      xCenter += hex.narrow / 4
    }
    const c1x = (xCenter + x1)/2
    const c1y = (hex.yOffset + y1)/2
    const c2x = (xCenter + x2)/2
    const c2y = (hex.yOffset + y2)/2
    let path = ["M", x1, y1]
    // Center can be shifted left or right, used for doing vertical roads
    if (center) {
      path = path.concat(["L", xCenter, hex.yOffset])
      path = path.concat(["L", x2, y2])
    } else {
      path = path.concat(["C", `${c1x},${c1y}`, `${c2x},${c2y}`, `${x2},${y2}`])
    }
    return path.join(" ")
  } else {
    let centerOff = 0
    if (center === "l") {
      centerOff = -hex.narrow / 4
    } else if (center === "r") {
      centerOff = hex.narrow / 4
    }
    const x1 = hex.xOffset + centerOff
    const y1 = hex.yOffset
    let path: SVGPathArray = []
    for (let i = 0; i < directions.length - 1; i++) {
      const d1 = directions[i]
      const d2 = directions[i+1]
      const x2 = hex.xEdge(d1)
      const y2 = hex.yEdge(d1)
      const x3 = hex.xEdge(d2)
      const y3 = hex.yEdge(d2)
      path = path.concat([
        "M", x2, y2, "L", x1, y1, "L", x3, y3
      ])
    }
    return path.join(" ")
  }
}
