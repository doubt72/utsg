import { Point, doesIntersect, orientation } from "../utilities/lines"
import { Counter } from "./counter"
import { Hex } from "./hex"
import { Marker, markerType } from "./marker"

const Map = class {
  constructor (data) {
    this.loadConfig(data.layout)

    this.alliedEdge = data.allied_edge
    this.axisEdge = data.axis_edge
    this.victoryHexes = data.victory_hexes
    this.alliedSetupHexes = data.allied_setup
    this.axisSetupHexes = data.axis_setup

    this.loadMap(data.hexes, this)

    this.units = []
    for (let i = 0; i < this.height; i++) {
      const array = []
      for (let j = 0; j < this.width; j++) {
          array.push([])
      }
      this.units.push(array)
    }

    this.baseTerrain = data.base_terrain || "g"
    this.night = data.night

    this.showCoords = true
    this.showAllCounters = false
    this.hideCounters = false
  }

  loadConfig(data) {
    // Other values of width/height will work, but in only really matters for
    // display, and technically we're designing for horizontal 1" (flat-width) hexes.

    // hexes = x: sheets * 8 - 1, y: sheets * 12 - 1 (packed slightly more)
    // 2x1 sheet = 16x10.5" = 15x11 hexes
    // 3x1 sheet = 24x10.5" = 23x11 hexes
    // 2x2 sheet = 16x21" = 15x21 hexes
    // 3x2 sheet = 24x21" = 23x21 hexes
    // 4x2 sheet = 32x21" = 31x21 hexes

    this.height = data[1]
    this.width = data[0]
    // Using anything besides x will either do nothing or possibly break things (eventually)
    this.horizontal = data[2] === "x"
  }

  loadMap(data, map) {
    this.mapHexes = data.map((row, y) => {
      return row.map((hex, x) => new Hex(x, y, hex, map))
    })
  }

  get narrow() { return 115 }
  get radius() { return this.narrow / 2 / Math.sin(1/3 * Math.PI) }
  xOffset(x, y) { return this.narrow * (x + y%2/2 + 0.5) + 1 }
  yOffset(y) { return this.radius * (y*1.5 + 1) + 1 }
  get xSize() { return this.narrow * (this.width + 0.5) + 2 }
  get ySize() { return 1.5 * this.radius * (this.height + 0.3333) + 2 }

  hexAt(x, y) {
    if (x < 0 || y < 0 || x >= this.width || y >= this.height) {
      return null
    }
    return this.mapHexes[y][x]
  }

  hexNeighbors(x, y) {
    const offset = y%2
    return [
      this.hexAt(x - 1, y),
      this.hexAt(x - 1 + offset, y - 1),
      this.hexAt(x + offset, y - 1),
      this.hexAt(x + 1, y),
      this.hexAt(x + offset, y + 1),
      this.hexAt(x - 1 + offset, y + 1),
    ]
  }

  neighborAt(x, y, dir) {
    return this.hexNeighbors(x, y)[dir - 1]
  }

  addUnit(x, y, unit) {
    const list = this.units[y][x]
    list.push(unit)
  }

  counterDataAt(x, y) {
    const c = []
    const list = this.units[y][x]
    let index = 0
    let trueIndex = 0
    list.forEach(u => {
      const r = u.rotates
      const f = u.turreted && !u.isWreck ? u.turretFacing : u.facing
      if (u.turreted && !u.isWreck) {
        const type = u.isWheeled ? markerType.WheeledHull : markerType.TrackedHull
        c.push({ x: x, y: y, u: new Marker(
          { type: type, nation: u.nation, rotates: true, facing: u.facing, x: x, y: y }
        ), s: index++ })
      }
      c.push({ x: x, y: y, u: u, s: index++, ti: trueIndex++ })
      if (this.showAllCounters) {
        const markerTypes = []
        if (u.immobilized) { markerTypes.push(markerType.Immobilized) }
        if (u.turretJammed) { markerTypes.push(markerType.TurretJammed) }
        if (u.jammed && u.turreted) { markerTypes.push(markerType.Jammed) }
        if (u.isTired) { markerTypes.push(markerType.Tired) }
        if (u.isPinned) { markerTypes.push(markerType.Pinned) }
        if (u.isExhausted) { markerTypes.push(markerType.Exhausted) }
        if (u.isActivated) { markerTypes.push(markerType.Activated) }
        markerTypes.forEach(t => {
          c.push({
            x: x, y: y, u: new Marker({ type: t, rotates: r, facing: f }), s: index++
          })
        })
      }
    })
    return c
  }

  countersAt(x, y) {
    const c = []
    this.counterDataAt(x, y).forEach(data => {
      const counter = new Counter(data.x, data.y, data.u, this)
      counter.stackingIndex = data.s
      if (data.ti) {
        counter.trueIndex = data.ti
      }
      c.push(counter)
    })
    return c
  }

  get counters() {
    let c = []
    if (this.hideCounters) { return c }
    for (let y = 0; y < this.height; y++) {
      for (let x = this.width - 1; x >= 0; x--) {
        c = c.concat(this.countersAt(x, y))
      }
    }
    return c
  }

  // TODO move LOS code to own class

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
  hexPath(x0, y0, x1, y1) {
    const hexes = []
    if (x0 === x1 && y0 === y1) { return hexes }

    let hex = this.mapHexes[y0][x0]
    const target = this.mapHexes[y1][x1]
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
        hex = this.neighborAt(hex.x, hex.y, check.e)
        hexes.push({ hex: hex})

        fromEdge = check.e > 3 ? check.e - 3 : check.e + 3
        fromCorner = null
      } else if (check?.c) { // Corner crossings - travelling along hex edge
        // Add edge traversed, move to hex at end of traversal
        const x = hex.x
        const y = hex.y
        hex = this.neighborAt(x, y, check.c)
        // Handle when traversing off edge of map; next hex will be on it
        if (!hex) {
          hex = new Hex(x, y, {}, this)
        }
        const edge = check.c > 2 ? check.c - 2 : check.c + 4
        hexes.push({ edge: edge, edgeHex: hex, long: true })
        const dir = check.c == 1 ? 6 : check.c - 1
        hex = this.neighborAt(hex.x, hex.y, dir)
        hexes.push({ hex: hex })

        fromCorner = check.c > 3 ? check.c - 3 : check.c + 3
        fromEdge = null
      } else if (check?.cx) { // Corner crossing - hex-to-hex
        // Technically we cross the edge at the...  Edge of the edge, then move
        // to next hex.  An...  Edge case, but can happen at long range
        let dir = check.o > 0 ? check.cx : check.cx - 1
        if (dir < 1) { dir += 6 }
        hexes.push({ edge: dir, edgeHex: hex, long: false })
        hex = this.neighborAt(hex.x, hex.y, dir)
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
  hexDistance(x0, y0, x1, y1) {
    // Transform X into axial coordinates
    const x00 = x0 - Math.floor(y0/2)
    const x11 = x1 - Math.floor(y1/2)
    // Add a cubic component
    const z0 = -x00-y0
    const z1 = -x11-y1
    // And now things are simple
    return Math.max(Math.abs(x00 - x11), Math.abs(y0 - y1), Math.abs(z0 - z1))
  }

  elevationLos(x0, y0, x1, y1, hex) {
    if (hex.counterLos.los) { return true }
    const se = this.hexAt(x0, y0).elevation
    const te = this.hexAt(x1, y1).elevation
    if (hex.elevation > se && hex.elevation > te) { return true }
    if (se === te && hex.elevation == se) { return hex.los }
    if (hex.elevation < se && hex.elevation < te) { return false }
    const dist = this.hexDistance(x0, y0, x1, y1)
    const currDist = se > te ? this.hexDistance(x0, y0, hex.x, hex.y) :
      this.hexDistance(hex.x, hex.y, x1, y1)
    const lo = se > te ? te : se
    const hi = se > te ? se : te
    if (hex.elevation > lo && hex.elevation == hi) { return true }
    const mid = hex.elevation + ( hex.los ? 1 : 0 )
    console.log(`${hi} ${lo} ${mid} - ${dist - currDist} ${currDist}`)
    console.log((dist-currDist) * (hi - lo) / (currDist + 1) / (mid-lo))
    return (dist - currDist) * (hi - lo) / (currDist + 1) / (mid - lo) < 1
  }

  hexLos(x0, y0, x1, y1) {
    if (x0 === x1 && y0 === y1) {
      return true
    }
    let hindrance = 0
    const path = this.hexPath(x0, y0, x1, y1)
    for (let i = 0; i < path.length; i++) {
      const curr = path[i]
      if (curr.edge) {
        if (curr.long) {
          hindrance += curr.edgeHex.alongEdgeHindrance(curr.edge, i === 0)
          const los = curr.edgeHex.alongEdgeLos(curr.edge, i === 0)
          if (los) { return false }
        } else {
          if (i !== 0) {
            hindrance += curr.edgeHex.edgeHindrance(curr.edge)
          }
          const los = curr.edgeHex.edgeLos(curr.edge)
          const hex = path[i+1].hex
          if (los && (hex.x !== x1 || hex.y !== y1) && (i !== 0)) { return false }
        }
      } else {
        hindrance += curr.hex.hindrance
        const block = this.elevationLos(x0, y0, x1, y1, curr.hex)
        if (block && (curr.hex.x !== x1 || curr.hex.y !== y1)) { return false }
      }
    }
    const lastHex = path[path.length-1].hex
    const offset = Math.max(this.counterDataAt(x1, y1).length * 5 - 5, 0)
    if (hindrance === 0) { return true }
    return {
      text: hindrance, size: 80, x: lastHex.xOffset + offset, y: lastHex.yOffset + 24 - offset,
      style: { fill: "rgba(0,0,0,0.6)" }
    }
  }

  overlayLayout(x, y, size) {
    let x1 = this.xOffset(x, y) - 80
    let y1 = this.yOffset(y) - 80
    let x2 = x1 + size*170 + 10
    let y2 = y1 + 170 + 10
    if (x2 > this.xSize) {
      const diff = this.xSize - x2
      x1 += diff
      x2 += diff
    }
    if (x1 < 0) {
      const diff = -x1
      x1 += diff
      x2 += diff
    }
    if (y2 > this.ySize) {
      const diff = this.ySize - y2
      y1 += diff
      y2 += diff
    }
    if (y1 < 0) {
      const diff = -y1
      y1 += diff
      y2 += diff
    }
    const corner = 10
    const path = [
      "M", x1, y2-corner, "L", x1, y1+corner,
      "A", corner, corner, 0, 0, 1, x1+corner, y1, "L", x2-corner, y1,
      "A", corner, corner, 0, 0, 1, x2, y1+corner, "L", x2, y2-corner,
      "A", corner, corner, 0, 0, 1, x2-corner, y2, "L", x1+corner, y2,
      "A", corner, corner, 0, 0, 1, x1, y2-corner, "L", x1, y1+corner,
    ].join(" ")
    return {
      path: path, style: { fill: "rgba(0,0,0,0.4" }, x: x1 + 5, y: y1 + 7.5, y2: y2
    }
  }

  counterInfoBadges(x, y, counter) {
    const badges = []
    if (counter.target.rotates && !counter.target.isWreck && !counter.target.hideOverlayRotation) {
      const turret = counter.target.turreted && !counter.target.isWreck
      const dir = turret ? counter.target.turretFacing : counter.target.facing
      badges.push({ text: `direction: ${dir}`, arrow: dir, color: "white", tColor: "black" })
    }
    if (!counter.target.isMarker || !counter.target.isWreck) {
      const u = counter.target
      const s = !this.showAllCounters
      if (u.isBroken) {
        badges.push({ text: "broken", color: counter.red, tColor: "white" })
      }
      if (u.isWreck) {
        badges.push({ text: "destroyed", color: counter.red, tColor: "white" })
      }
      if (u.immobilized && s) {
        badges.push({ text: "immobilized", color: counter.red, tColor: "white" })
      }
      if (u.turretJammed && s) {
        badges.push({ text: "turret jammed", color: counter.red, tColor: "white" })
      }
      if (u.jammed && u.turreted && s) {
        badges.push({ text: "weapon broken", color: counter.red, tColor: "white" })
      } else if (u.jammed && !u.turreted) {
        badges.push({ text: "broken", color: counter.red, tColor: "white" })
      }
      if (u.isTired && s) {
        badges.push({ text: "tired", color: "yellow", tColor: "black" })
      }
      if (u.isPinned && s) {
        badges.push({ text: "pinned", color: counter.red, tColor: "white" })
      }
      if (u.isExhausted && s) {
        badges.push({ text: "exhausted", color: "yellow", tColor: "black" })
      }
      if (u.isActivated && s) {
        badges.push({ text: "activated", color: "yellow", tColor: "black" })
      }
    }
    const size = 24
    let diff = size+4
    let start = y
    if (y + diff * badges.length > this.ySize) {
      diff = -diff
      start = y - 196
    }
    return badges.map((b, i) => {
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
      b.y = b.y + 4
      return b
    })
  }

  counterHelpButtonLayout(x, y, counter) {
    if (counter.target.isMarker || counter.target.isWreck) { return false }
    const size = 24
    return { path: [
      "M", x-size/2, y, "A", size/2, size/2, 0, 0, 1, x+size/2, y,
      "A", size/2, size/2, 0, 0, 1, x-size/2, y
    ].join(" "), x: x, y: y+5, size: size-8 }
  }
}

export { Map }
