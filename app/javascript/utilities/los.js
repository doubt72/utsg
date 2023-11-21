import { Hex } from "../engine/hex"
import { Point, doesIntersect, orientation } from "./lines"

const Los = class {
  constructor(map) {
    this.map = map
  }

  // If you're doing a lot of hex manipulation (or any other sort of game
  // programming), I highly recomment my old classmate Amit Patel's page:
  // https://www.redblobgames.com/ -- the explanation and presentations of
  // various concepts there are exceptional.  Though really none of my code here
  // is based on anything there (most of my algorithms are either trivial and/or
  // have special requirements for edges and such, and I've prioritized making
  // it easy to build low-bandwidth configuration at the expense of elegance.
  // OTOH I did skim some of the hexagonal grid pages while thinking about how I
  // want to tackle things and they have help me focus my implementations). Some
  // of the LOS code could no doubt be decomposed into smaller helper functions,
  // and I may (probably will) refactor thigns a bit at some point; this code is
  // admittedly a hack-y mess.

  // All direction indexes are normalized here and in hexPath to be 1-6, not
  // 0-5. This made debugging easier, is consistent with the configuration data,
  // makes simpler existence checks for return values (since directions are
  // always truthy) at the expense of adding and subtracting numbers at times
  // that they would not otherwise be.  Not sure if there are any ideal choices
  // here, all of this is quite complicated either way.
  hexIntersection(hex, p0, p1, fromEdge, fromCorner) {
    for (let i = 0; i < 6; i++) {
      const h0 = new Point(hex.xCorner(i), hex.yCorner(i))
      // Prioritize corner intersections (technically each corner intersects two
      // edges as well, but if we hit a corner, that's what we care about);
      // exclude opposite corners if (1) it's the starting hex but doesn't
      // intersect the line or (2) it's a corner we just came from
      if (orientation(p0, h0, p1) === 0 && h0.onSegment(p0, p1) && i+1 !== fromCorner) {
        const center = new Point(hex.xOffset, hex.yOffset)
        const o = orientation(p0, center, p1)
        if (o === 0) {
          return { c: i+1 }
        } else {
          return { cx: i+1, o: o }
        }
      }
    }
    for (let i = 0; i < 6; i++) {
      const h0 = new Point(hex.xCorner(i), hex.yCorner(i))
      const h1 = new Point(hex.xCorner(i+1), hex.yCorner(i+1))
      // Exclude (1) edges we came from and (2) edges that intersect a corner we
      // came from if we hit it at an angle that doesn't match a hex edge
      if (doesIntersect(h0, h1, p0, p1) && i+1 !== fromEdge) {
        const nextCorner = fromCorner === 1 ? 6 : fromCorner - 1
        if (i+1 !== fromCorner && i+1 !== nextCorner) {
          return { e: i+1 }
        }
      }
    }
    console.log("hexIntersection: this shouldn't happen, something went wrong")
  }

  // We care about both specific edges and corners and hexes traversed for the
  // purposes of LOS and hindrance, so this is actually quite tricky.  We're
  // essentially doing a ray trace through hexes, and we also need to make sure
  // that we don't backtrack so we need to keep track of what direction we came
  // from so we can send that back to the intersection code so it will ignore
  // intersections we don't want.
  hexPath(start, target) {
    const hexes = []
    if (start.x === target.x && start.y === target.y) { return hexes }

    let hex = start
    const p0 = new Point(hex.xOffset, hex.yOffset)
    const p1 = new Point(target.xOffset, target.yOffset)

    let count = 0
    let fromEdge = null
    let fromCorner = null
    while (hex.x !== target.x || hex.y !== target.y) {
      // Should never ever need this but infinite loops are very, very bad
      if (count++ > 99) { console.log("aborting"); break }
      const check = this.hexIntersection(hex, p0, p1, fromEdge, fromCorner)
      if (check?.e) { // Edge crossing
        // Add edge crossed, move to next hex
        hexes.push({ edge: check.e, edgeHex: hex, long: false })
        hex = this.map.neighborAt(hex.x, hex.y, check.e)
        hexes.push({ hex: hex})

        fromEdge = check.e > 3 ? check.e - 3 : check.e + 3
        fromCorner = null
      } else if (check?.c) { // Corner crossings - travelling along hex edge
        // Add edge traversed, move to hex at end of traversal
        const x = hex.x
        const y = hex.y
        hex = this.map.neighborAt(x, y, check.c)
        // Handle when traversing off edge of map; next hex will be on it
        if (!hex) {
          if (check.c === 3) {
            hex = new Hex(x + 1, y - 1, { offmap: true }, this.map)
          } else if (check.c === 6) {
            hex = new Hex(x - 1, y + 1, { offmap: true }, this.map)
          }
        }
        const edge = check.c > 2 ? check.c - 2 : check.c + 4
        hexes.push({ edge: edge, edgeHex: hex, long: true })
        const dir = check.c == 1 ? 6 : check.c - 1
        hex = this.map.neighborAt(hex.x, hex.y, dir)
        hexes.push({ hex: hex })

        fromCorner = check.c > 3 ? check.c - 3 : check.c + 3
        fromEdge = null
      } else if (check?.cx) { // Corner crossing - hex-to-hex
        // Technically we cross the edge at the...  Edge of the edge, then move
        // to next hex.  An...  Edge case, but can happen at long range
        let dir = check.o > 0 ? check.cx : check.cx - 1
        if (dir < 1) { dir += 6 }
        hexes.push({ edge: dir, edgeHex: hex, long: false })
        hex = this.map.neighborAt(hex.x, hex.y, dir)
        hexes.push({ hex: hex })

        fromCorner = check.o > 0 ? check.cx - 2 : check.cx + 2
        if (fromCorner < 1) { fromCorner += 6 }
        if (fromCorner > 6) { fromCorner -= 6 }
        fromEdge = null
      } else {
        // If we had to break out of an infinite loop, we'll probably hit this
        console.log("hexPath: this shouldn't happen, something went wrong")
      }
    }
    return hexes
  }

  // TODO consider replacing some of the x, y's with Points?
  hexDistance(hex0, hex1) {
    // Transform X into axial coordinates
    const x00 = hex0.x - Math.floor(hex0.y/2)
    const x11 = hex1.x - Math.floor(hex1.y/2)
    // Add a cubic component
    const z0 = -x00-hex0.y
    const z1 = -x11-hex1.y
    // And now things are simple
    return Math.max(Math.abs(x00 - x11), Math.abs(hex0.y - hex1.y), Math.abs(z0 - z1))
  }

  elevationHindrance(start, target, elevation, currDist, hindrance) {
    if (start.elevation === target.elevation && elevation === start.elevation) { return hindrance }
    if (elevation < start.elevation && elevation < target.elevation) { return 0 }
    const dist = this.hexDistance(start, target)
    const lo = start.elevation > target.elevation ? target.elevation : start.elevation
    const hi = start.elevation > target.elevation ? start.elevation : target.elevation
    return ((dist - currDist) / dist) < ((elevation-lo+1)/(hi-lo+1)) ? hindrance : 0
  }

  hexElevationHindrance(start, target, hex) {
    if (hex.counterLos.hindrance > 0) { return hex.counterLos.hindrance }
    if (hex.elevation > start.elevation && hex.elevation > target.elevation) { return 0 }
    const currDist = start.elevation > target.elevation ? this.hexDistance(start, hex) :
      this.hexDistance(hex, target)
    return this.elevationHindrance(start, target, hex.elevation, currDist, hex.hindrance)
  }

  edgeElevationHindrance(start, target, hex, edge) {
    const currDist = start.elevation > target.elevation ? this.hexDistance(start, hex) + 1 :
      this.hexDistance(hex, target)
    return this.elevationHindrance(start, target, hex.elevation, currDist, hex.edgeHindrance(edge))
  }

  alongEdgeElevationHindrance(start, target, hex, edge, initialEdge) {
    const neighbor = hex.map.neighborAt(hex.x, hex.y, edge)
    const counterHindrance = neighbor ? neighbor.counterLos.hindrance : 0
    if (hex.counterLos.hindrance > 0 && counterHindrance > 0) {
      return Math.min(hex.counterLos.hindrance, counterHindrance)
    }
    const elevation = Math.min(hex.elevation, neighbor?.elevation || hex.elevation)
    if (elevation > start.elevation && elevation > target.elevation) { return true }
    const currDist = start.elevation > target.elevation ? this.hexDistance(start, hex) :
      this.hexDistance(hex, target)
    return this.elevationHindrance(
      start, target, hex.elevation, currDist, hex.alongEdgeHindrance(edge, initialEdge)
    )
  }

  elevationLos(start, target, elevation, currDist, los) {
    if (start.elevation === target.elevation && elevation === start.elevation) { return los }
    if (elevation < start.elevation && elevation < target.elevation) { return false }
    const dist = this.hexDistance(start, target)
    const lo = start.elevation > target.elevation ? target.elevation : start.elevation
    const hi = start.elevation > target.elevation ? start.elevation : target.elevation
    if (elevation > lo && elevation === hi) { return true }
    const mid = elevation + ( los ? 1 : 0 )
    return (dist - currDist) * (hi - lo) / (currDist + 1) / (mid - lo) < 1
  }

  hexElevationLos(start, target, hex) {
    if (hex.counterLos.los) { return true }
    if (hex.elevation > start.elevation && hex.elevation > target.elevation) { return true }
    const currDist = start.elevation > target.elevation ? this.hexDistance(start, hex) :
      this.hexDistance(hex, target)
    return this.elevationLos(start, target, hex.elevation, currDist, hex.los)
  }

  edgeElevationLos(start, target, hex, edge) {
    const currDist = start.elevation > target.elevation ? this.hexDistance(start, hex) :
      this.hexDistance(hex, target) - 1
    return this.elevationLos(start, target, hex.elevation, currDist, hex.edgeLos(edge))
  }

  alongEdgeElevationLos(start, target, hex, edge, initialEdge, finalEdge) {
    const neighbor = hex.map.neighborAt(hex.x, hex.y, edge)
    const counterLos = neighbor ? neighbor.counterLos.los : true
    if (hex.counterLos.los && counterLos) { return true }
    const elevation = Math.min(hex.elevation, neighbor?.elevation || hex.elevation)
    if (elevation > start.elevation && elevation > target.elevation) { return true }
    const currDist = start.elevation > target.elevation ? this.hexDistance(start, hex) :
      this.hexDistance(hex, target)
    return this.elevationLos(
      start, target, hex.elevation, currDist, hex.alongEdgeLos(edge, initialEdge, finalEdge)
    )
  }

  hexLos(x0, y0, x1, y1) {
    if (x0 === x1 && y0 === y1) {
      return true
    }
    const hex0 = this.map.hexAt(x0, y0)
    const hex1 = this.map.hexAt(x1, y1)
    let hindrance = 0
    const path = this.hexPath(hex0, hex1)
    for (let i = 0; i < path.length; i++) {
      const curr = path[i]
      if (curr.edge) {
        if (curr.long) {
          hindrance += this.alongEdgeElevationHindrance(hex0, hex1, curr.edgeHex, curr.edge, i === 0)
          const los = this.alongEdgeElevationLos(
            hex0, hex1, curr.edgeHex, curr.edge, i === 0, i === path.length - 2
          )
          if (los) { return false }
        } else {
          if (i !== 0) {
            hindrance += this.edgeElevationHindrance(hex0, hex1, curr.edgeHex, curr.edge)
          }
          const los = this.edgeElevationLos(hex0, hex1, curr.edgeHex, curr.edge)
          const hex = path[i+1].hex
          if (los && (hex.x !== x1 || hex.y !== y1) && (i !== 0)) { return false }
        }
      } else {
        hindrance += this.hexElevationHindrance(hex0, hex1, curr.hex)
        const block = this.hexElevationLos(hex0, hex1, curr.hex)
        if (block && (curr.hex.x !== x1 || curr.hex.y !== y1)) { return false }
      }
    }
    const lastHex = path[path.length-1].hex
    const offset = Math.max(this.map.counterDataAt(x1, y1).length * 5 - 5, 0)
    if (hindrance === 0) { return true }
    return {
      text: hindrance, size: 80, x: lastHex.xOffset + offset, y: lastHex.yOffset + 24 - offset,
      style: { fill: "rgba(0,0,0,0.6)" }
    }
  }
}

export { Los }