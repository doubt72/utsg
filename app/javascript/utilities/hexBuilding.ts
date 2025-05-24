import Hex from "../engine/Hex"
import { Coordinate, ExtendedDirection, buildingShape } from "./commonTypes"
import { PathLayout, SVGPathArray } from "./graphics"
import { normalDir } from "./utilities"

// These allow doing simple X, Y coords, but then rotate for direction (used
// for doing all the "square" buildings)
function xRotated(hex: Hex, direction: ExtendedDirection, center: Coordinate): number {
  const  dir = -direction - 0.5
  return hex.xOffset + center.x * Math.sin(dir/3 * Math.PI) +
    center.y * Math.sin((dir/3 + 0.5) * Math.PI)
}

function yRotated(hex: Hex, direction: ExtendedDirection, center: Coordinate): number {
  const  dir = -direction - 0.5
  return hex.yOffset + center.x * Math.cos(dir/3 * Math.PI) +
    center.y * Math.cos((dir/3 + 0.5) * Math.PI)
}

// Silo (smaller circle)
function siloPath(hex: Hex, inset: number = 32): SVGPathArray {
  let path = [
    "M", hex.xCorner(6, inset), hex.yCorner(6, inset),
    "A", hex.radius - inset, hex.radius - inset, 0, 1, 0,
    hex.xCorner(3, inset), hex.yCorner(3, inset),
    "A", hex.radius - inset, hex.radius - inset, 0, 1, 0,
    hex.xCorner(6, inset), hex.yCorner(6, inset)
  ]
  for (let i = 0; i < 6; i++) {
    path = path.concat(
      [
        "M", hex.xCorner(normalDir(i/2), inset), hex.yCorner(normalDir(i/2), inset),
        "L", hex.xCorner(normalDir(i/2 + 3), inset), hex.yCorner(normalDir(i/2 + 3), inset)
      ]
    )
  }
  return path
}

// Tank (larger circle)
function tankPath(hex: Hex): SVGPathArray {
  return siloPath(hex, 16)
}

type SVGPathSource = (string | [number, number])[]

function buildingRotatePoint(
  hex: Hex, dir: ExtendedDirection, coord: Coordinate
): Coordinate {
  return new Coordinate(
    xRotated(hex, dir, coord),
    yRotated(hex, dir, coord)
  )
}

function buildingRotatedMap(
  hex: Hex, dir: ExtendedDirection, source: SVGPathSource
): SVGPathArray {
  const path: SVGPathArray = []
  for (const e of source) {
    if (typeof e === "string") {
      path.push(e)
    } else {
      const point = buildingRotatePoint(hex, dir, new Coordinate(e[0], e[1]))
      path.push(point.x)
      path.push(point.y)
    }
  }
  return path
}

// Huts (four small buildings in a set)
function hutPath(hex: Hex): SVGPathArray {
  let path: SVGPathArray = []
  const dir = hex.direction
  const size = 15
  for (let i = 0; i < 4; i++) {
    const x = size*2*Math.sin((i+0.5)/2 * Math.PI)
    const y = size*2*Math.cos((i+0.5)/2 * Math.PI)
    path = path.concat(buildingRotatedMap(hex, dir, [
      "M", [x-size, y-size], "L", [x+size, y-size], "L", [x+size, y+size],
      "L", [x-size, y+size], "L", [x-size, y-size],
      "M", [x-size, y-size], "L", [x+size, y+size],
      "M", [x-size, y+size], "L", [x+size, y-size],
    ]))
    path = path.concat([
    ])
  }
  return path
}

// Cross building
function crossPath(hex: Hex): SVGPathArray {
  // Symmetrical "x" or "cross" building for some variety
  const inset = 4
  const dir = hex.direction 
  const mag1 = hex.narrow/2 - inset*2
  const mag2 = mag1/2.5
  // This could be abstracted a bit, but it's probably not really worth it;
  // things rotate when they repeat, but swapping x and y is a pain
  return buildingRotatedMap(hex, dir, [
    "M", [mag1, mag2], "L", [mag2, mag2], "L", [mag2, mag1], "L", [-mag2, mag1],
    "L", [-mag2, mag2], "L", [-mag1, mag2], "L", [-mag1, -mag2], "L", [-mag2, -mag2],
    "L", [-mag2, -mag1], "L", [mag2, -mag1], "L", [mag2, -mag2], "L", [mag1, -mag2],
    "L", [mag1, mag2],
    "M", [mag1, mag2], "L", [mag1 - inset*4, 0],
    "M", [mag1, -mag2], "L", [mag1 - inset*4, 0],
    "M", [-mag1, mag2], "L", [-mag1 + inset*4, 0],
    "M", [-mag1, -mag2], "L", [-mag1 + inset*4, 0],
    "M", [mag2, mag1], "L", [0, mag1 - inset*4],
    "M", [-mag2, mag1], "L", [0, mag1 - inset*4],
    "M", [mag2, -mag1], "L", [0, -mag1 + inset*4],
    "M", [-mag2, -mag1], "L", [0, -mag1 + inset*4],
    "M", [mag1 - inset*4, 0], "L", [-mag1 + inset*4, 0],
    "M", [0, mag1 - inset*4], "L", [0, -mag1 + inset*4],
  ])
}

// Core of the "standard" multi-hex building
function drawCore(
  hex: Hex, dir: ExtendedDirection,
  x: number, y: number, inset: number, offset1: number, offset2: number
): SVGPathArray {
  const outset = inset*3
  return buildingRotatedMap(hex, dir, [
    "M", [-x + offset2, -y], "L", [-outset*1.5, -y], "L", [-outset*1.5, -y-outset],
    "L", [outset*1.5, -y-outset], "L", [outset*1.5, -y], "L", [x - offset1, -y],
    "L", [x - offset1, y], "L", [outset*1.5, y], "L", [outset*1.5, y+outset],
    "L", [-outset*1.5, y+outset], "L", [-outset*1.5, y], "L", [-x + offset2, y],
    "L", [-x + offset2, -y],
  ])
}

// Core of the "standard" multi-hex building (no eaves)
function drawCore2(
  hex: Hex, dir: ExtendedDirection,
  x: number, y: number, inset: number, offset1: number, offset2: number
): SVGPathArray {
  return buildingRotatedMap(hex, dir, [
    "M", [-x + offset2, -y], "L", [x - offset1, -y], "L", [x - offset1, y],
    "L", [-x + offset2, y], "L", [-x + offset2, -y],
  ])
}

// Eaves for all the "standard" buildings
function drawEave(
  hex: Hex, dir: ExtendedDirection, x: number, y: number
): SVGPathArray {
  return buildingRotatedMap(hex, dir, [
    "M", [-x*1.5, y], "L", [0, y-x], "L", [x*1.5, y], "L", [0, y-x],
    "M", [0, y+x], "L", [0, y-x],
  ])
}

// End pieces for "standard" buildings
function drawEnd(
  hex: Hex, dir: ExtendedDirection, x: number, y: number, size: number, center: number
): SVGPathArray {
  return buildingRotatedMap(hex, dir, [
    "M", [center, 0], "L", [x - size*6, 0], "L", [x - size*2, -y], "L", [x - size*6, 0],
    "M", [x - size*6, 0], "L", [x - size*2, y],
  ])
}

// The single-hex-wide (eaved) "standard" buildings
function lonePath(hex: Hex): SVGPathArray {
  let path = []
  const inset = 4
  const outset = inset*3
  const dir = hex.direction 
  const x = hex.narrow/2
  const y = hex.radius/2 - inset
  path = drawCore(hex, dir, x, y, inset, inset*2, inset*2)
  path = path.concat(drawEnd(hex, dir, x, y, inset, 0))
  path = path.concat(drawEnd(hex, dir, -x, y, -inset, 0))
  path = path.concat(drawEave(hex, dir, -outset, -y))
  path = path.concat(drawEave(hex, dir, outset, y))
  return path
}

function sidePath(hex: Hex): SVGPathArray {
  let path = []
  const inset = 4
  const outset = inset*3
  const dir = hex.direction 
  const x = hex.narrow/2
  const y = hex.radius/2 - inset
  path = drawCore(hex, dir, x, y, inset, inset*2, 0)
  path = path.concat(drawEnd(hex, dir, x, y, inset, -x))
  path = path.concat(drawEave(hex, dir, -outset, -y))
  path = path.concat(drawEave(hex, dir, outset, y))
  return path
}

function middlePath(hex: Hex): SVGPathArray {
  let path = []
  const inset = 4
  const outset = inset*3
  const dir = hex.direction 
  const x = hex.narrow/2
  const y = hex.radius/2 - inset
  path = drawCore(hex, dir, x, y, inset, 0, 0)
  path = path.concat(buildingRotatedMap(hex, dir, [
    "M", [-x, 0], "L", [x, 0],
  ]))
  path = path.concat(drawEave(hex, dir, -outset, -y))
  path = path.concat(drawEave(hex, dir, outset, y))
  return path
}

// The single-hex-wide (non-eaved) "standard" buildings
function lonePath2(hex: Hex): SVGPathArray {
  let path = []
  const inset = 4
  const dir = hex.direction 
  const x = hex.narrow/2
  const y = hex.radius/2 - inset
  path = drawCore2(hex, dir, x, y, inset, inset*2, inset*2)
  path = path.concat(drawEnd(hex, dir, x, y, inset, 0))
  path = path.concat(drawEnd(hex, dir, -x, y, -inset, 0))
  return path
}

function sidePath2(hex: Hex): SVGPathArray {
  let path = []
  const inset = 4
  const dir = hex.direction 
  const x = hex.narrow/2
  const y = hex.radius/2 - inset
  path = drawCore2(hex, dir, x, y, inset, inset*2, 0)
  path = path.concat(drawEnd(hex, dir, x, y, inset, -x))
  return path
}

function middlePath2(hex: Hex): SVGPathArray {
  let path = []
  const inset = 4
  const dir = hex.direction 
  const x = hex.narrow/2
  const y = hex.radius/2 - inset
  path = drawCore2(hex, dir, x, y, inset, 0, 0)
  path = path.concat(buildingRotatedMap(hex, dir, [
    "M", [-x, 0], "L", [x, 0],
  ]))
  return path
}

// Blocky "factory" building -- not all configurations are possible.
function bigMiddle(hex: Hex): SVGPathArray {
  const path = []
  let pa = "M"
  for (let i = 0; i <= 6; i++) {
    path.push(pa)
    path.push(hex.xCorner(normalDir(i)))
    path.push(hex.yCorner(normalDir(i)))
    pa = "L"
  }
  return path
}

function bigSide1(hex: Hex): SVGPathArray {
  const inset = 4
  const outset = inset*3
  const dir = hex.direction 
  const x1 = hex.xCornerOffset(normalDir(dir + 1), outset, 1)
  const y1 = hex.yCornerOffset(normalDir(dir + 1), outset, 1)
  const x2 = hex.xCornerOffset(normalDir(dir + 4), outset, -1)
  const y2 = hex.yCornerOffset(normalDir(dir + 4), outset, -1)
  const xOff = outset * Math.sin(Math.PI/3)
  return [
    "M", x1, y1, "L", hex.xCorner(normalDir(dir + 2)), hex.yCorner(normalDir(dir + 2)),
    "L", hex.xCorner(normalDir(dir + 3)), hex.yCorner(normalDir(dir + 3)), "L", x2, y2,
    "L", ...buildingRotatePoint(hex, dir, new Coordinate(-xOff, outset*3)).tuple,
    "L", ...buildingRotatePoint(hex, dir, new Coordinate(xOff*4, outset*3)).tuple,
    "L", ...buildingRotatePoint(hex, dir, new Coordinate(xOff*4, -outset*3)).tuple,
    "L", ...buildingRotatePoint(hex, dir, new Coordinate(-xOff, -outset*3)).tuple,
    "L", x1, y1,
  ]
}

function bigSide2(hex: Hex): SVGPathArray {
  const inset = 4
  const outset = inset*3
  const dir = hex.direction 
  const x1 = hex.xCornerOffset(normalDir(dir + 2), outset, 1)
  const y1 = hex.yCornerOffset(normalDir(dir + 2), outset, 1)
  const x2 = hex.xCornerOffset(dir, outset, -1)
  const y2 = hex.yCornerOffset(dir, outset, -1)
  return [
    "M", x1, y1, "L", hex.xCorner(normalDir(dir + 3)), hex.yCorner(normalDir(dir + 3)),
    "L", hex.xCorner(normalDir(dir + 4)), hex.yCorner(normalDir(dir + 4)),
    "L", hex.xCorner(normalDir(dir + 5)), hex.yCorner(normalDir(dir + 5)),
    "L", x2, y2, "L", x1, y1,
  ]
}

function bigSide3(hex: Hex): SVGPathArray {
  const inset = 4
  const outset = inset*3
  const dir = hex.direction 
  const x1 = hex.xCornerOffset(normalDir(dir - 1), outset, -1)
  const y1 = hex.yCornerOffset(normalDir(dir - 1), outset, -1)
  const x2 = hex.xCornerOffset(normalDir(dir + 3), outset, 1)
  const y2 = hex.yCornerOffset(normalDir(dir + 3), outset, 1)
  const xOff = hex.narrow/2 - outset * Math.sin(Math.PI/3)
  return [
    "M", x1, y1,
    "L", ...buildingRotatePoint(hex, dir, new Coordinate(xOff, -outset*2)).tuple,
    "L", ...buildingRotatePoint(hex, dir, new Coordinate(-xOff, -outset*2)).tuple,
    "L", x2, y2, "L", hex.xCorner(normalDir(dir + 4)), hex.yCorner(normalDir(dir + 4)),
    "L", x1, y1,
  ]
}

function bigSide4(hex: Hex): SVGPathArray {
  const inset = 4
  const outset = inset*3
  const dir = hex.direction 
  const x1 = hex.xCornerOffset(dir, outset, 1)
  const y1 = hex.yCornerOffset(dir, outset, 1)
  const x2 = hex.xCornerOffset(normalDir(dir - 1), outset, -1)
  const y2 = hex.yCornerOffset(normalDir(dir - 1), outset, -1)
  return [
    "M", x1, y1, "L", hex.xCorner(normalDir(dir + 1)), hex.yCorner(normalDir(dir + 1)),
    "L", hex.xCorner(normalDir(dir + 2)), hex.yCorner(normalDir(dir + 2)),
    "L", hex.xCorner(normalDir(dir + 3)), hex.yCorner(normalDir(dir + 3)),
    "L", hex.xCorner(normalDir(dir + 4)), hex.yCorner(normalDir(dir + 4)),
    "L", x2, y2, "L", x1, y1,
  ]
}

function bigCorner1(hex: Hex): SVGPathArray {
  const inset = 4
  const outset = inset*3
  const dir = hex.direction 
  const x1 = hex.xCornerOffset(normalDir(dir - 1), outset, -1)
  const y1 = hex.yCornerOffset(normalDir(dir - 1), outset, -1)
  const x2 = hex.xCornerOffset(normalDir(dir + 2), outset, 1)
  const y2 = hex.yCornerOffset(normalDir(dir + 2), outset, 1)
  const xOff = hex.narrow/2 - outset * Math.sin(Math.PI/3)
  return [
    "M", x1, y1,
    "L", ...buildingRotatePoint(hex, dir, new Coordinate(xOff, -hex.radius/3)).tuple,
    "L", x2, y2, "L", hex.xCorner(normalDir(dir + 3)), hex.yCorner(normalDir(dir + 3)),
    "L", hex.xCorner(normalDir(dir + 4)), hex.yCorner(normalDir(dir + 4)), "L", x1, y1,
  ]
}

function bigCorner2(hex: Hex): SVGPathArray {
  const inset = 4
  const outset = inset*3
  const dir = hex.direction 
  const x1 = hex.xCornerOffset(dir, outset, -1)
  const y1 = hex.yCornerOffset(dir, outset, -1)
  const x2 = hex.xCornerOffset(normalDir(dir + 3), outset, 1)
  const y2 = hex.yCornerOffset(normalDir(dir + 3), outset, 1)
  const xOff = hex.narrow/2 - outset * Math.sin(Math.PI/3)
  return [
    "M", x1, y1,
    "L", ...buildingRotatePoint(hex, normalDir(dir + 3), new Coordinate(xOff, hex.radius/3)).tuple,
    "L", x2, y2, "L", hex.xCorner(normalDir(dir + 4)), hex.yCorner(normalDir(dir + 4)),
    "L", hex.xCorner(normalDir(dir + 5)), hex.yCorner(normalDir(dir + 5)), "L", x1, y1,
  ]
}

function bigCorner3(hex: Hex): SVGPathArray {
  const inset = 4
  const outset = inset*3
  const dir = hex.direction 
  const x1 = hex.xCornerOffset(dir, outset, -1)
  const y1 = hex.yCornerOffset(dir, outset, -1)
  const x2 = hex.xCornerOffset(normalDir(dir + 4), outset, 1)
  const y2 = hex.yCornerOffset(normalDir(dir + 4), outset, 1)
  const xOff2 = outset * Math.sin(Math.PI/3)
  const xOff = hex.narrow/2 - xOff2
  return [
    "M", x1, y1,
    "L", ...buildingRotatePoint(hex, normalDir(dir + 3), new Coordinate(xOff, hex.radius/3)).tuple,
    "L", ...buildingRotatePoint(hex, normalDir(dir + 3), new Coordinate(xOff, -hex.radius/2)).tuple,
    "L", ...buildingRotatePoint(hex, normalDir(dir + 3), new Coordinate(-xOff2, -hex.radius/2)).tuple,
    "L", x2, y2, "L", hex.xCorner(normalDir(dir + 5)), hex.yCorner(normalDir(dir + 5)), "L", x1, y1,
  ]
}

function bigCorner4(hex: Hex): SVGPathArray {
  const inset = 4
  const outset = inset*3
  const dir = hex.direction 
  const x1 = hex.xCornerOffset(normalDir(dir + 2), outset, 1)
  const y1 = hex.yCornerOffset(normalDir(dir + 2), outset, 1)
  const x2 = hex.xCornerOffset(normalDir(dir + 4), outset, -1)
  const y2 = hex.yCornerOffset(normalDir(dir + 4), outset, -1)
  const xOff2 = outset * Math.sin(Math.PI/3)
  const xOff = xOff2 - hex.narrow/2
  return [
    "M", x1, y1,
    "L", ...buildingRotatePoint(hex, normalDir(dir + 3), new Coordinate(xOff, hex.radius/3)).tuple,
    "L", ...buildingRotatePoint(hex, normalDir(dir + 3), new Coordinate(xOff, -hex.radius/2)).tuple,
    "L", ...buildingRotatePoint(hex, normalDir(dir + 3), new Coordinate(xOff2, -hex.radius/2)).tuple,
    "L", x2, y2, "L", hex.xCorner(normalDir(dir + 3)), hex.yCorner(normalDir(dir + 3)),
    "L", x1, y1,
  ]
}

export function hexBuildingBuildingDisplay(hex: Hex): PathLayout | false {
  if (!hex.building) { return false }
  let path: SVGPathArray = []
  if (hex.buildingShape === buildingShape.Silo) {
    path = siloPath(hex)
  } else if (hex.buildingShape === buildingShape.Tank) {
    path = tankPath(hex)
  } else if (hex.buildingShape === buildingShape.Hut) {
    path = hutPath(hex)
  } else if (hex.buildingShape === buildingShape.Cross) {
    path = crossPath(hex)
  } else if (hex.buildingShape === buildingShape.Lone) {
    path = lonePath(hex)
  } else if (hex.buildingShape === buildingShape.Side) {
    path = sidePath(hex)
  } else if (hex.buildingShape === buildingShape.Middle) {
    path = middlePath(hex)
  } else if (hex.buildingShape === buildingShape.Lone2) {
    path = lonePath2(hex)
  } else if (hex.buildingShape === buildingShape.Side2) {
    path = sidePath2(hex)
  } else if (hex.buildingShape === buildingShape.Middle2) {
    path = middlePath2(hex)
  } else if (hex.buildingShape === buildingShape.BigMiddle) {
    path = bigMiddle(hex)
  } else if (hex.buildingShape === buildingShape.BigSide1) {
    path = bigSide1(hex)
  } else if (hex.buildingShape === buildingShape.BigSide2) {
    path = bigSide2(hex)
  } else if (hex.buildingShape === buildingShape.BigSide3) {
    path = bigSide3(hex)
  } else if (hex.buildingShape === buildingShape.BigSide4) {
    path = bigSide4(hex)
  } else if (hex.buildingShape === buildingShape.BigCorner1) {
    path = bigCorner1(hex)
  } else if (hex.buildingShape === buildingShape.BigCorner2) {
    path = bigCorner2(hex)
  } else if (hex.buildingShape === buildingShape.BigCorner3) {
    path = bigCorner3(hex)
  } else if (hex.buildingShape === buildingShape.BigCorner4) {
    path = bigCorner4(hex)
  }
  const hcs = hex.elevationStyles[hex.elevation].fill as string
  // TODO: maybe generic versions of this?  If we ever do this anywhere else
  let base = hcs.length > 4 ?
    (parseInt(hcs.substring(1, 3), 16) + parseInt(hcs.substring(3, 5), 16) +
      parseInt(hcs.substring(5, 7), 16))/3 :
    (parseInt(hcs.substring(1, 2), 16) + parseInt(hcs.substring(2, 3), 16) +
      parseInt(hcs.substring(3, 4), 16))/3*17
  if (base > 191) { base = 191 }
  return { path: path.join(" "), style: {
    fill: hex.buildingStyle === "f" ? `rgb(${base * 1},${base * 0.75},${base * 0.5})` :
      `rgb(${base * 0.9},${base * 0.9},${base * 0.9})`,
    stroke: "#333", strokeWidth: 1,
  }}
}

export function hexBuildingBuildingLosEdges(hex: Hex): number[] {
  const dir = hex.direction
  const opp = normalDir (dir + 3)
  if (!hex.building) { return [] }
  if (hex.buildingShape === "m") { return [dir, opp] }
  if (hex.buildingShape === "s") { return [opp] }
  if (hex.buildingShape === "bm") { return [1, 2, 3, 4, 5, 6] }
  if (hex.buildingShape === "bs1") { return [dir+2, opp, opp+1] }
  if (hex.buildingShape === "bs2") { return [dir, opp, opp+1, opp+2] }
  if (hex.buildingShape === "bs3") { return [opp+1, opp+2] }
  if (hex.buildingShape === "bs4") { return [dir+1, dir+2, opp, opp+1, opp+2] }
  if (hex.buildingShape === "bc1") { return [opp, opp+1, opp+2] }
  if (hex.buildingShape === "bc2") { return [dir, opp+1, opp+2] }
  if (hex.buildingShape === "bc3") { return [dir, opp+2] }
  return []
}
