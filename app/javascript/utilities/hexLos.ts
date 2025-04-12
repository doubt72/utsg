import Hex from "../engine/Hex"
import { Direction } from "./commonTypes";
import { hexBuildingBuildingLosEdges } from "./hexBuilding";
import { normalDir } from "./utilities";

type HexLosData = {
  hindrance: number;
  los: boolean;
}

export function hexLosCounterLos(hex: Hex): HexLosData {
  if (hex.offmap) { return { hindrance: 0, los: true } }
  let hindrance = 0
  let los = false
  const counters = hex.map.counterDataAt(hex.coord)
  counters.forEach(c => {
    if (c.u.hindrance) { hindrance += c.u.hindrance }
    if (c.u.blocksLos) { los = true }
  })
  return { hindrance: hindrance, los: los}
}

function terrainBorderEdge(hex: Hex, dir: Direction): HexLosData {
  const neighbor = hex.map.neighborAt(hex.coord, dir)
  const same = hex.borderEdges?.includes(dir)
  const opp = neighbor?.borderEdges?.includes(normalDir(dir + 3))
  if (same && opp) {
    console.log(`edge along ${hex.coord.x},${hex.coord.y}-${dir} has misconfiged border on both sides`)
  }
  if (same) { return hex.terrain.borderAttr }
  // Border might be on opposite hex, we only configure one
  if (opp) { return (neighbor as Hex).terrain.borderAttr }
  // If neither, no effect on hindrance or LOS
  return { hindrance: 0, los: false }
}

export function hexLosHindrance(hex: Hex): number {
  return hex.terrain.baseAttr.hindrance
}

export function hexLosEdgeHindrance(hex: Hex, dir: Direction): number {
  return terrainBorderEdge(hex, dir).hindrance
}

function terrainCornerBorders(
  hex: Hex, dir: Direction, sign: -1 | 1
): { a: HexLosData, b: HexLosData } {
  const newDir = normalDir(dir + sign)
  const newHex = hex.map.neighborAt(hex.coord, newDir)
  const secondDir = normalDir(newDir + 4 * sign)
  return {
    a: terrainBorderEdge(hex, newDir),
    b: newHex ? terrainBorderEdge(newHex, secondDir) : { hindrance: 0, los: false }
  }
}

export function hexLosAlongEdgeHindrance(hex: Hex, dir: Direction, initialEdge: boolean): number {
  const neighbor = hex.map.neighborAt(hex.coord, dir)
  let rc = terrainBorderEdge(hex, dir).hindrance
  // If terrain crosses the edge, it may hinder (terrain considered to run off edge)
  if (hex.baseTerrain === (neighbor?.baseTerrain || hex.baseTerrain)) {
    rc += hex.terrain.baseAttr.hindrance
  }
  // Hinder if there are fences (or more) on both sides of the starting or ending edge
  if (initialEdge) {
    const e2 = terrainCornerBorders(hex, dir, 1)
    if (e2.a.hindrance && e2.b.hindrance) {
      rc += Math.min(e2.a.hindrance, e2.b.hindrance)
    } else if (e2.a.hindrance && e2.b.los) {
      rc += e2.a.hindrance
    } else if (e2.b.hindrance && e2.a.los) {
      rc += e2.b.hindrance
    }
  } else {
    const e1 = terrainCornerBorders(hex, dir, -1)
    if (e1.a.hindrance && e1.b.hindrance) {
      rc += Math.min(e1.a.hindrance, e1.b.hindrance)
    } else if (e1.a.hindrance && e1.b.los) {
      rc += e1.a.hindrance
    } else if (e1.b.hindrance && e1.a.los) {
      rc += e1.b.hindrance
    }
  }
  return rc
}

// LOS = true means LOS is BLOCKED
export function hexLos(hex: Hex): boolean {
  if (hex.building) { return true }
  return hex.terrain.baseAttr.los
}

export function hexLosEdgeLos(hex: Hex, dir: Direction): boolean {
  return terrainBorderEdge(hex, dir).los
}

export function hexLosAlongEdgeLos(hex: Hex, dir: Direction, initialEdge: boolean, finalEdge: boolean): boolean {
  const neighbor = hex.map.neighborAt(hex.coord, dir)
  if (terrainBorderEdge(hex, dir).los) { return true }
  // If terrain crosses the edge, it may block (terrain considered to run off edge)
  if (hex.baseTerrain === (neighbor?.baseTerrain || hex.baseTerrain)) {
    if (hex.terrain.baseAttr.los) { return true }
  }
  // Block if there is terrain on both sides of the starting or ending edge
  // Leading corner -- ignore if initialEdge
  const e1 = terrainCornerBorders(hex, dir, -1)
  if (e1.a.los && e1.b.los && !initialEdge) { return true }
  // Trailing corner -- ignore if finalEdge
  const e2 = terrainCornerBorders(hex, dir, 1)
  if (e2.a.los && e2.b.los && !finalEdge) { return true }
  // Buildings block if they cross edge
  const opp = dir > 3 ? dir - 3 : dir + 3
  if (hex.building && hexBuildingBuildingLosEdges(hex).includes(dir)) { return true }
  if (neighbor?.building && hexBuildingBuildingLosEdges(hex).includes(opp)) { return true }
  return false
}
