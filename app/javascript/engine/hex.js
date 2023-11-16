import { Terrain } from "./terrain"

const Hex = class {
  constructor(x, y, data, map) {
    this.map = map
    this.x = x
    this.y = y
    this.baseTerrain = data.t
    this.direction = data.d
    this.road = !!data.r
    if (this.road) {
      this.roadType = data.r.t || "d"
      this.roadDirections = data.r.d
      this.roadCenter = data.r.c
    }
    this.river = !!data.s
    if (this.river) {
      this.riverDirections = data.s.d
    }
    this.elevation = data.h || 0
    this.border = data.b
    // Only need to do one side, and which side doesn't matter for most things,
    // but matters for cliffs and rendering elevation (i.e., put on higher
    // elevation edge)
    this.borderEdges = data.be
    this.building = !!data.st
    if (this.building) {
      this.buildingStyle = data.st.s
      this.buildingShape = data.st.sh
    }
  }

  get terrain() {
    return new Terrain(this)
  }

  // TODO: move LOS effects to own class
  get counterLos() {
    let hindrance = 0
    let los = false
    const counters = this.map.counterDataAt(this.x, this.y)
    counters.forEach(c => {
      if (c.u.hindrance) { hindrance += c.u.hindrance }
      if (c.u.blocksLos) { los = true }
    })
    return { hindrance: hindrance, los: los}
  }

  terrainBorderEdge(dir) {
    const neighbor = this.map.neighborAt(this.x, this.y, dir)
    const same = this.borderEdges?.includes(dir)
    const opp = neighbor?.borderEdges?.includes(dir > 3 ? dir - 3 : dir + 3)
    if (same && opp) {
      console.log(`edge along ${this.x},${this.y}-${dir} has misconfiged border on both sides`)
    }
    if (same) { return this.terrain.borderAttr }
    // Border might be on opposite hex, we only configure one
    if (opp) { return neighbor.terrain.borderAttr }
    // If neither, no effect on hindrance or LOS
    return { hindrance: 0, los: false }
  }

  get hindrance() {
    return this.terrain.baseAttr.hindrance + this.counterLos.hindrance
  }

  edgeHindrance(dir) {
    return this.terrainBorderEdge(dir).hindrance
  }

  terrainCornerBorders(dir, sign) {
    let newDir = dir + sign
    if (newDir > 6) { newDir -= 6 }
    if (newDir < 1) { newDir += 6 }
    const newHex = this.map.neighborAt(this.x, this.y, newDir)
    let secondDir = newDir + 4 * sign
    if (secondDir > 6) { secondDir -= 6 }
    if (secondDir < 1) { secondDir += 6 }
    return {
      a: this.terrainBorderEdge(newDir),
      b: newHex?.terrainBorderEdge(secondDir) || {}
    }
  }

  alongEdgeHindrance(dir, initialEdge = false) {
    const neighbor = this.map.neighborAt(this.x, this.y, dir)
    let rc = this.terrainBorderEdge(dir).hindrance
    // If terrain crosses the edge, it may hinder (terrain considered to run off edge)
    if (this.baseTerrain === (neighbor?.baseTerrain || this.baseTerrain)) {
      rc += this.terrain.baseAttr.hindrance
    }
    // If counters on both sides, apply effects
    if (!this.counterLos.los && !neighbor?.counterLOS?.los) {
      rc += Math.min(this.counterLos.hindrance, neighbor?.counterLos?.hindrance || 0)
    } else if (this.counterLos.los) {
      rc += this.counterLos.hindrance
    } else {
      rc += neighbor?.counterLos?.hindrance || 0
    }
    // Hinder if there are fences (or more) on both sides of the starting or ending edge
    // Leading corner -- ignore if initialEdge
    if (!initialEdge) {
      const e1 = this.terrainCornerBorders(dir, -1)
      if (e1.a.hindrance && e1.b.hindrance) {
        rc += Math.min(e1.a.hindrance, e1.b.hindrance)
      } else if (e1.a.hindrance && e1.b.los) {
        rc += e1.a.hindrance
      } else if (e1.b.hindrance && e1.a.los) {
        rc += e1.b.hindrance
      }
    }
    // Trailing corner
    const e2 = this.terrainCornerBorders(dir, 1)
    if (e2.a.hindrance && e2.b.hindrance) {
      rc += Math.min(e2.a.hindrance, e2.b.hindrance)
    } else if (e2.a.hindrance && e2.b.los) {
      rc += e2.a.hindrance
    } else if (e2.b.hindrance && e2.a.los) {
      rc += e2.b.hindrance
    }
    return rc
  }

  // LOS = true means LOS is BLOCKED
  get los() {
    if (this.building) { return true }
    return this.terrain.baseAttr.los
  }

  edgeLos(dir) {
    return this.terrainBorderEdge(dir).los
  }

  alongEdgeLos(dir, initialEdge = false) {
    const neighbor = this.map.neighborAt(this.x, this.y, dir)
    if (this.terrainBorderEdge(dir).los) { return true }
    // If terrain crosses the edge, it may block (terrain considered to run off edge)
    if (this.baseTerrain === (neighbor?.baseTerrain || this.baseTerrain)) {
      if (this.terrain.baseAttr.los) { return true }
    }
    if (this.counterLos.los && neighbor?.counterLos?.los) { return true }
    // Block if there is terrain on both sides of the starting or ending edge
    // Leading corner -- ignore if initialEdge
    const e2 = this.terrainCornerBorders(dir, 1)
    if (e2.a.los && e2.b.los) { return true }
    // Trailing corner
    const e1 = this.terrainCornerBorders(dir, -1)
    if (e1.a.los && e1.b.los && !initialEdge) { return true }
    // Buildings block if they cross edge
    const opp = dir > 3 ? dir - 3 : dir + 3
    console.log(`${this.x}, ${this.y} dir ${dir}: ${this.buildingLosEdges} - ${neighbor?.buildingLosEdges}`)
    if (this.building && this.buildingLosEdges.includes(dir)) { return true }
    if (neighbor?.building && neighbor.buildingLosEdges.includes(opp)) { return true }
    return false
  }

  get buildingLosEdges() {
    const dir = this.direction
    const opp = dir > 3 ? dir - 3 : dir + 3
    if (!this.building) { return [] }
    if (this.buildingShape === "m") { return [dir, opp] }
    if (this.buildingShape === "s") { return [opp] }
    if (this.buildingShape === "bm") { return [1, 2, 3, 4, 5, 6] }
    let sides = []
    if (this.buildingShape === "bs1") { return [dir+2, opp, opp+1] }
    if (this.buildingShape === "bs2") { return [dir, opp, opp+1, opp+2] }
    if (this.buildingShape === "bs3") { return [opp+1, opp+2] }
    if (this.buildingShape === "bc1") { return [opp, opp+1, opp+2] }
    if (this.buildingShape === "bc2") { return [dir, opp+1, opp+2] }
    sides = sides.map(s => s > 6 ? s - 6 : s)
    return sides
  }

  get mapColors() {
    return {
      g: "#D0EED0",
      d: "#EEB",
      s: "#EEE",
      m: "#F7C797",
      u: "#D7E0D0",
    }[this.map.baseTerrain]
  }

  get elevationStyles() {
    return [
      { fill: this.mapColors },
      { fill: "#DA7" },
      { fill: "#B85" },
      { fill: "#963" },
      { fill: "#741" },
      { fill: "#620" },
    ]
  }

  get night() {
    return this.map.night
  }

  // lightWater = "#59C"
  darkWater = "#46A"

  terrainStyles = {
    j: { fill: "rgba(47,191,47,0.33)" },
    w: { fill: this.darkWater }, // TODO: special shallow beach water?
  }

  patternStyles = {
    f: { fill: "url(#forest-pattern)" },
    b: { fill: "url(#brush-pattern)" },
    j: { fill: "url(#jungle-pattern)" },
    s: { fill: "url(#sand-pattern)" },
    r: { fill: "url(#rough-pattern)" },
    m: { fill: "url(#marsh-pattern)" },
    g: { fill: "url(#grain-pattern)" },
  }

  borderStyles = {
    f: { stroke: "#963", strokeWidth: 3 },
    w: { stroke: "#BBB", strokeWidth: 8, strokeLinecap: "round" },
    b: { stroke: "#060", strokeWidth: 8, strokeLinecap: "round" },
    c: { stroke: "#320", strokeWidth: 8, strokeLinecap: "round" },
  }

  borderDecorationStyles = {
    f: { stroke: "#963", strokeWidth: 8, strokeDasharray: [2, 11.1] },
    w: { stroke: "#888", strokeWidth: 8, strokeDasharray: [2, 2] },
    b: { stroke: "rgba(0,0,0,0)" },
    c: { stroke: "rgba(0,0,0,0)" },
  }

  // Base hex side, measuring flat side, and other common measurements
  get narrow() { return this.map.narrow }
  get radius() { return this.map.radius }
  get xOffset() { return this.map.xOffset(this.x, this.y) }
  get yOffset() { return this.map.yOffset(this.y) }

  // Corners and edges on demand (with offsets) for doing continous curves
  xCorner(i, inset = 0) { return this.xOffset - (this.radius - inset) * Math.cos((i-0.5)/3 * Math.PI) }
  yCorner(i, inset = 0) { return this.yOffset - (this.radius - inset) * Math.sin((i-0.5)/3 * Math.PI) }
  xEdge(i, inset = 0) { return this.xOffset - (this.narrow/2 - inset) * Math.cos((i-1)/3 * Math.PI) }
  yEdge(i, inset = 0) { return this.yOffset - (this.narrow/2 - inset) * Math.sin((i-1)/3 * Math.PI) }

  // When matching up hexes with continuous edges, use this to calculate how
  // far the open terrain crosses from the corner of the hex
  xCornerOffset(i, offset, dir, inset = 0) {
    const x = this.xCorner(i, inset)
    return x - offset * Math.cos((i - 0.5 + 2*dir)/3 * Math.PI)
  }
  yCornerOffset(i, offset, dir, inset = 0) {
    const y = this.yCorner(i, inset)
    return y - offset * Math.sin((i - 0.5 + 2*dir)/3 * Math.PI)
  }

  // When calculating connected vs. open hexes, offboard counts as any elevation or terrain
  get elevationEdges() {
    let all = true
    let none = true
    const edges = this.map.hexNeighbors(this.x, this.y).map((h, i) => {
      const check = (this.border === "c" && this.borderEdges.includes(i+1)) ||
                    !h || h.elevation >= this.elevation
      if (check) { none = false } else { all = false }
      return check ? 1 : 0
    })
    if (all) { return "all" }
    if (none) { return null }
    return edges
  }

  get terrainEdges() {
    let all = true
    let none = true
    const edges = this.map.hexNeighbors(this.x, this.y).map(h => {
      const check = !h || h.baseTerrain === this.baseTerrain
      if (check) { none = false } else { all = false }
      return check ? 1 : 0
    })
    if (all) { return "all" }
    if (none) { return null }
    return edges
  }

  get hexCoords() {
    return [0, 1, 2, 3, 4, 5, 6].map(i => {
      return `${this.xCorner(i)},${this.yCorner(i)}`
    }).join(" ")
  }

  edgeCoords(dir) {
    return [
      "M", this.xCorner(dir-1), this.yCorner(dir-1), "L", this.xCorner(dir), this.yCorner(dir),
    ].join(" ")
  }

  // "Solid" terrain (i.e., surrounded), no need for curves
  get backgroundTerrain() {
    return this.terrainEdges === "all"
  }

  get background() {
    if (this.backgroundTerrain && this.terrainStyles[this.baseTerrain]) {
      return this.terrainStyles[this.baseTerrain]
    }
    if (this.elevationEdges === "all") {
      return this.elevationStyles[this.elevation || 0]
    } else {
      return this.elevationStyles[this.elevation ? this.elevation - 1 : 0]
    }
  }

  get labelX() {
    return this.xOffset
  }

  get labelY() {
    return this.yOffset - this.radius + 21
  }

  get label() {
    if (!this.map.showCoords) { return "" }
    // handle up to 52 for now, easy to extend if we need it, but at 1" hexes,
    // 52 would be a somewhat ludicrous seven 8.5x11" pages wide
    const letters = [
      "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M",
      "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",
    ]
    letters.forEach(l => letters.push(l + l))
    return `${letters[this.x]}${this.y + 1}`
  }

  // Draw the orchard hex, rotated by direction
  get orchardDisplay() {
    if (this.baseTerrain !== "d") { return false }
    const trees = []
    for (let x = 0; x < 3; x++) {
      for (let y = 0; y < 2; y++) {
        const dir = -this.direction - 0.5
        const mag = this.radius*0.5
        const x0 = this.xOffset + (x-1) * mag * Math.sin(dir/3 * Math.PI) +
          (y-0.5) * mag * Math.sin((dir/3 + 0.5) * Math.PI)
        const y0 = this.yOffset + (x-1) * mag * Math.cos(dir/3 * Math.PI) +
          (y-0.5) * mag * Math.cos((dir/3 + 0.5) * Math.PI)
        trees.push({ x: x0, y: y0, r: this.radius/5, style: { fill: "#4A4" } })
      }
    }
    return trees
  }

  // These allow doing simple X, Y coords, but then rotate for direction (used
  // for doing all the "square" buildings)
  xRotated(direction, x, y) {
    const  dir = -direction - 0.5
    return this.xOffset + x * Math.sin(dir/3 * Math.PI) + y * Math.sin((dir/3 + 0.5) * Math.PI)
  }

  yRotated(direction, x, y) {
    const  dir = -direction - 0.5
    return this.yOffset + x * Math.cos(dir/3 * Math.PI) + y * Math.cos((dir/3 + 0.5) * Math.PI)
  }

  // Core of the "standard" multi-hex building
  drawCore(dir, x, y, inset, offset1, offset2) {
    const outset = inset*3
    return [
      "M", this.xRotated(dir, -x + offset2, -y), this.yRotated(dir, -x + offset2, -y),
      "L", this.xRotated(dir, -outset*1.5, -y), this.yRotated(dir, -outset*1.5, -y),
      "L", this.xRotated(dir, -outset*1.5, -y-outset), this.yRotated(dir, -outset*1.5, -y-outset),
      "L", this.xRotated(dir, outset*1.5, -y-outset), this.yRotated(dir, outset*1.5, -y-outset),
      "L", this.xRotated(dir, outset*1.5, -y), this.yRotated(dir, outset*1.5, -y),
      "L", this.xRotated(dir, x - offset1, -y), this.yRotated(dir, x - offset1, -y),
      "L", this.xRotated(dir, x - offset1, y), this.yRotated(dir, x - offset1, y),
      "L", this.xRotated(dir, outset*1.5, y), this.yRotated(dir, outset*1.5, y),
      "L", this.xRotated(dir, outset*1.5, y+outset), this.yRotated(dir, outset*1.5, y+outset),
      "L", this.xRotated(dir, -outset*1.5, y+outset), this.yRotated(dir, -outset*1.5, y+outset),
      "L", this.xRotated(dir, -outset*1.5, y), this.yRotated(dir, -outset*1.5, y),
      "L", this.xRotated(dir, -x + offset2, y), this.yRotated(dir, -x + offset2, y),
      "L", this.xRotated(dir, -x + offset2, -y), this.yRotated(dir, -x + offset2, -y),
    ]
  }

  // Eaves for all the "standard" buildings
  drawEave(dir, x, y) {
    return [
      "M", this.xRotated(dir, -x*1.5, y), this.yRotated(dir, -x*1.5, y),
      "L", this.xRotated(dir, 0, y-x), this.yRotated(dir, 0, y-x),
      "L", this.xRotated(dir, x*1.5, y), this.yRotated(dir, x*1.5, y),
      "L", this.xRotated(dir, 0, y-x), this.yRotated(dir, 0, y-x),
      "M", this.xRotated(dir, 0, y+x), this.yRotated(dir, 0, y+x),
      "L", this.xRotated(dir, 0, y-x), this.yRotated(dir, 0, y-x),
    ]
  }

  // End pieces for "standard" buildings
  drawEnd(dir, x, y, size, center) {
    return [
      "M", this.xRotated(dir, center, 0), this.yRotated(dir, center, 0),
      "L", this.xRotated(dir, x - size*6, 0), this.yRotated(dir, x - size*6, 0),
      "L", this.xRotated(dir, x - size*2, -y), this.yRotated(dir, x - size*2, -y),
      "L", this.xRotated(dir, x - size*6, 0), this.yRotated(dir, x - size*6, 0),
      "M", this.xRotated(dir, x - size*6, 0), this.yRotated(dir, x - size*6, 0),
      "L", this.xRotated(dir, x - size*2, y), this.yRotated(dir, x - size*2, y),
    ]
  }

  // TODO maybe split into another class?
  get buildingDisplay() {
    if (!this.building) { return false }
    let path = []
    let inset = 4
    const outset = inset*3
    let dir = this.direction
    if (this.buildingShape === "c" || this.buildingShape === "t") {
      // Circular "silo" type thing
      // Larger "tank"
      inset = 16
      if (this.buildingShape === "c") { inset = 32 }
      path = [
        "M", this.xCorner(0, inset), this.yCorner(0, inset),
        "A", this.radius - inset, this.radius - inset, 0, 1, 0,
        this.xCorner(3, inset), this.yCorner(3, inset),
        "A", this.radius - inset, this.radius - inset, 0, 1, 0,
        this.xCorner(0, inset), this.yCorner(0, inset)
      ]
      for (let i = 0; i < 6; i++) {
        path = path.concat(
          [
            "M", this.xCorner(i/2, inset), this.yCorner(i/2, inset),
            "L", this.xCorner(i/2 + 3, inset), this.yCorner(i/2 + 3, inset)
          ]
        )
      }
    } else if (this.buildingShape === "h") {
      const size = 15
      for (let i = 0; i < 4; i++) {
        const x = size*2*Math.sin((i+0.5)/2 * Math.PI)
        const y = size*2*Math.cos((i+0.5)/2 * Math.PI)
        path = path.concat([
          "M", this.xRotated(dir, x-size, y-size), this.yRotated(dir, x-size, y-size),
          "L", this.xRotated(dir, x+size, y-size), this.yRotated(dir, x+size, y-size),
          "L", this.xRotated(dir, x+size, y+size), this.yRotated(dir, x+size, y+size),
          "L", this.xRotated(dir, x-size, y+size), this.yRotated(dir, x-size, y+size),
          "L", this.xRotated(dir, x-size, y-size), this.yRotated(dir, x-size, y-size),
          "M", this.xRotated(dir, x-size, y-size), this.yRotated(dir, x-size, y-size),
          "L", this.xRotated(dir, x+size, y+size), this.yRotated(dir, x+size, y+size),
          "M", this.xRotated(dir, x-size, y+size), this.yRotated(dir, x-size, y+size),
          "L", this.xRotated(dir, x+size, y-size), this.yRotated(dir, x+size, y-size),
        ])
      }
    } else if (this.buildingShape === "m") {
      // Standard building m = center segment, s=sides (rotate to fit), l=lone (not multi-hex)
      const x = this.narrow/2
      const y = this.radius/2 - inset
      path = this.drawCore(dir, x, y, inset, 0, 0)
      path = path.concat([
        "M", this.xRotated(dir, -x, 0), this.yRotated(dir, -x, 0),
        "L", this.xRotated(dir, x, 0), this.yRotated(dir, x, 0),
      ])
      path = path.concat(this.drawEave(dir, -outset, -y))
      path = path.concat(this.drawEave(dir, outset, y))
    } else if (this.buildingShape === "s") {
      const x = this.narrow/2
      const y = this.radius/2 - inset
      path = this.drawCore(dir, x, y, inset, inset*2, 0)
      path = path.concat(this.drawEnd(dir, x, y, inset, -x))
      path = path.concat(this.drawEave(dir, -outset, -y))
      path = path.concat(this.drawEave(dir, outset, y))
    } else if (this.buildingShape === "l") {
      const x = this.narrow/2
      const y = this.radius/2 - inset
      path = this.drawCore(dir, x, y, inset, inset*2, inset*2)
      path = path.concat(this.drawEnd(dir, x, y, inset, 0))
      path = path.concat(this.drawEnd(dir, -x, y, -inset, 0))
      path = path.concat(this.drawEave(dir, -outset, -y))
      path = path.concat(this.drawEave(dir, outset, y))
    } else if (this.buildingShape === "x") {
      // Symmetrical "x" or "cross" building for some variety
      const mag1 = this.narrow/2 - inset*2
      const mag2 = mag1/2.5
      // This could be abstracted a bit, but it's probably not really worth it;
      // things rotate when they repeat, and swapping x and y is a pain
      path = [
        "M", this.xRotated(dir, mag1, mag2), this.yRotated(dir, mag1, mag2),
        "L", this.xRotated(dir, mag2, mag2), this.yRotated(dir, mag2, mag2),
        "L", this.xRotated(dir, mag2, mag1), this.yRotated(dir, mag2, mag1),
        "L", this.xRotated(dir, -mag2, mag1), this.yRotated(dir, -mag2, mag1),
        "L", this.xRotated(dir, -mag2, mag2), this.yRotated(dir, -mag2, mag2),
        "L", this.xRotated(dir, -mag1, mag2), this.yRotated(dir, -mag1, mag2),
        "L", this.xRotated(dir, -mag1, -mag2), this.yRotated(dir, -mag1, -mag2),
        "L", this.xRotated(dir, -mag2, -mag2), this.yRotated(dir, -mag2, -mag2),
        "L", this.xRotated(dir, -mag2, -mag1), this.yRotated(dir, -mag2, -mag1),
        "L", this.xRotated(dir, mag2, -mag1), this.yRotated(dir, mag2, -mag1),
        "L", this.xRotated(dir, mag2, -mag2), this.yRotated(dir, mag2, -mag2),
        "L", this.xRotated(dir, mag1, -mag2), this.yRotated(dir, mag1, -mag2),
        "L", this.xRotated(dir, mag1, mag2), this.yRotated(dir, mag1, mag2),
        "M", this.xRotated(dir, mag1, mag2), this.yRotated(dir, mag1, mag2),
        "L", this.xRotated(dir, mag1 - inset*4, 0), this.yRotated(dir, mag1 - inset*4, 0),
        "M", this.xRotated(dir, mag1, -mag2), this.yRotated(dir, mag1, -mag2),
        "L", this.xRotated(dir, mag1 - inset*4, 0), this.yRotated(dir, mag1 - inset*4, 0),
        "M", this.xRotated(dir, -mag1, mag2), this.yRotated(dir, -mag1, mag2),
        "L", this.xRotated(dir, -mag1 + inset*4, 0), this.yRotated(dir, -mag1 + inset*4, 0),
        "M", this.xRotated(dir, -mag1, -mag2), this.yRotated(dir, -mag1, -mag2),
        "L", this.xRotated(dir, -mag1 + inset*4, 0), this.yRotated(dir, -mag1 + inset*4, 0),
        "M", this.xRotated(dir, mag2, mag1), this.yRotated(dir, mag2, mag1),
        "L", this.xRotated(dir, 0, mag1 - inset*4), this.yRotated(dir, 0, mag1 - inset*4),
        "M", this.xRotated(dir, -mag2, mag1), this.yRotated(dir, -mag2, mag1),
        "L", this.xRotated(dir, 0, mag1 - inset*4), this.yRotated(dir, 0, mag1 - inset*4),
        "M", this.xRotated(dir, mag2, -mag1), this.yRotated(dir, mag2, -mag1),
        "L", this.xRotated(dir, 0, -mag1 + inset*4), this.yRotated(dir, 0, -mag1 + inset*4),
        "M", this.xRotated(dir, -mag2, -mag1), this.yRotated(dir, -mag2, -mag1),
        "L", this.xRotated(dir, 0, -mag1 + inset*4), this.yRotated(dir, 0, -mag1 + inset*4),
        "M", this.xRotated(dir, mag1 - inset*4, 0), this.yRotated(dir, mag1 - inset*4, 0),
        "L", this.xRotated(dir, -mag1 + inset*4, 0), this.yRotated(dir, -mag1 + inset*4, 0),
        "M", this.xRotated(dir, 0, mag1 - inset*4), this.yRotated(dir, 0, mag1 - inset*4),
        "L", this.xRotated(dir, 0, -mag1 + inset*4), this.yRotated(dir, 0, -mag1 + inset*4),
      ]
    } else if (this.buildingShape === "bm") {
      let pa = "M"
      for (let i = 0; i <= 6; i++) {
        path.push(pa)
        path.push(this.xCorner(i))
        path.push(this.yCorner(i))
        pa = "L"
      }
    } else if (this.buildingShape === "bs1") {
      const x1 = this.xCornerOffset(dir + 1, outset, 1)
      const y1 = this.yCornerOffset(dir + 1, outset, 1)
      const x2 = this.xCornerOffset(dir + 4, outset, -1)
      const y2 = this.yCornerOffset(dir + 4, outset, -1)
      const xOff = outset * Math.sin(Math.PI/3)
      path = [
        "M", x1, y1, "L", this.xCorner(dir + 2), this.yCorner(dir + 2),
        "L", this.xCorner(dir + 3), this.yCorner(dir + 3), "L", x2, y2,
        "L", this.xRotated(dir, -xOff, outset*3), this.yRotated(dir, -xOff, outset*3),
        "L", this.xRotated(dir, xOff*3, outset*3), this.yRotated(dir, xOff*3, outset*3),
        "L", this.xRotated(dir, xOff*3, -outset*3), this.yRotated(dir, xOff*3, -outset*3),
        "L", this.xRotated(dir, -xOff, -outset*3), this.yRotated(dir, -xOff, -outset*3),
        "L", x1, y1,
      ]
    } else if (this.buildingShape === "bs2") {
      const x1 = this.xCornerOffset(dir + 2, outset, 1)
      const y1 = this.yCornerOffset(dir + 2, outset, 1)
      const x2 = this.xCornerOffset(dir, outset, -1)
      const y2 = this.yCornerOffset(dir, outset, -1)
      path = [
        "M", x1, y1, "L", this.xCorner(dir + 3), this.yCorner(dir + 3),
        "L", this.xCorner(dir + 4), this.yCorner(dir + 4),
        "L", this.xCorner(dir + 5), this.yCorner(dir + 5),
        "L", x2, y2, "L", x1, y1,
      ]
    } else if (this.buildingShape === "bs3") {
      const x1 = this.xCornerOffset(dir - 1, outset, -1)
      const y1 = this.yCornerOffset(dir - 1, outset, -1)
      const x2 = this.xCornerOffset(dir + 3, outset, 1)
      const y2 = this.yCornerOffset(dir + 3, outset, 1)
      const xOff = this.narrow/2 - outset * Math.sin(Math.PI/3)
      path = [
        "M", x1, y1,
        "L", this.xRotated(dir, xOff, -outset*2), this.yRotated(dir, xOff, -outset*2),
        "L", this.xRotated(dir, -xOff, -outset*2), this.yRotated(dir, -xOff, -outset*2),
        "L", x2, y2, "L", this.xCorner(dir + 4), this.yCorner(dir + 4), "L", x1, y1,
      ]
    } else if (this.buildingShape === "bc1") {
      const x1 = this.xCornerOffset(dir - 1, outset, -1)
      const y1 = this.yCornerOffset(dir - 1, outset, -1)
      const x2 = this.xCornerOffset(dir + 2, outset, 1)
      const y2 = this.yCornerOffset(dir + 2, outset, 1)
      const xOff = this.narrow/2 - outset * Math.sin(Math.PI/3)
      path = [
        "M", x1, y1,
        "L", this.xRotated(dir, xOff, -this.radius/3),
             this.yRotated(dir, xOff, -this.radius/3),
        "L", x2, y2, "L", this.xCorner(dir + 3), this.yCorner(dir + 3),
        "L", this.xCorner(dir + 4), this.yCorner(dir + 4), "L", x1, y1,
      ]
    } else if (this.buildingShape === "bc2") {
      const x1 = this.xCornerOffset(dir, outset, -1)
      const y1 = this.yCornerOffset(dir, outset, -1)
      const x2 = this.xCornerOffset(dir + 3, outset, 1)
      const y2 = this.yCornerOffset(dir + 3, outset, 1)
      const xOff = this.narrow/2 - outset * Math.sin(Math.PI/3)
      path = [
        "M", x1, y1,
        "L", this.xRotated(dir + 3, xOff, this.radius/3),
             this.yRotated(dir + 3, xOff, this.radius/3),
        "L", x2, y2, "L", this.xCorner(dir + 4), this.yCorner(dir + 4),
        "L", this.xCorner(dir + 5), this.yCorner(dir + 5), "L", x1, y1,
      ]
    }
    return { d: path.join(" "), style: {
      fill: this.buildingStyle === "f" ? "#B97" : "#AAA",
      stroke: this.buildingShape === "fm" ? "rgba(0,0,0,0)" : "#333",
      strokeWidth: 1,
    }}
  }

  get terrainCircle() {
    if (this.terrainEdges || this.baseTerrain === "o") { return false }
    return {
      x: this.xOffset, y: this.yOffset, r: this.narrow/2 - 5,
      style: this.terrainStyles[this.baseTerrain] || { fill: "rgba(0,0,0,0" }
    }
  }

  // Used for "isolated" terrain hexes (e.g., summits)
  hexRoundCoordsInset(inset) {
    let path = ["M", this.xCornerOffset(-1, inset, 1, inset), this.yCornerOffset(-1, inset, 1, inset)]
    for (let i = 0; i < 6; i++) {
      path = path.concat(
        ["L", this.xCornerOffset(i, inset, -1, inset), this.yCornerOffset(i, inset, -1, inset)]
      )
      path = path.concat(
        [
          "A", inset*2, inset*2, 0, 0, 1,
          this.xCornerOffset(i, inset, 1, inset), this.yCornerOffset(i, inset, 1, inset)
        ]
      )
    }
    return path.join(" ")
  }

  get elevationHex() {
    if (this.elevationEdges || this.elevation < 1) { return false }
    return { d: this.hexRoundCoordsInset(5), style: this.elevationStyles[this.elevation] }
  }

  // When generating the continuous paths, we want to be able to start anywhere
  // with a flush edge, and commonly check next/last sides, so a generic check
  // to keep things in bounds
  checkSide(hexSides, i) {
    return hexSides[(i+6)%6]
  }

  // Used for both terrain and elevations; terrain has a deeper inset on open
  // sides to make it easier to pick out
  generatePaths(edges, edgeOffset) {
    let path = []
    for (let j = 0; j < 6; j++) {
      if (edges[j] !== 1) {
        continue
      }
      if (this.checkSide(edges, j-1) === 1) {
        path = ["M", this.xCorner(j), this.yCorner(j)]
      } else {
        path = ["M", this.xCornerOffset(j, edgeOffset, 1), this.yCornerOffset(j, edgeOffset, 1)]
      }
      for (let i = j; i < j + 6; i++) {
        if (this.checkSide(edges, i) === 1) {
          if (this.checkSide(edges, i+1) === 1) {
            path = path.concat(["L", this.xCorner(i+1), this.yCorner(i+1)])
          } else {
            path = path.concat(
              ["L", this.xCornerOffset(i+1, edgeOffset, -1), this.yCornerOffset(i+1, edgeOffset, -1)]
            )
          }
        } else {
          if (this.checkSide(edges, i-1) === 1) {
            path = path.concat(
              [
                "A", this.radius*2, this.radius*2, 0, 0, 0,
                this.xEdge(i+1, edgeOffset*2), this.yEdge(i+1, edgeOffset*2)
              ]
            )
          } else {
            path = path.concat(
              [
                "A", this.radius - edgeOffset*4, this.radius - edgeOffset*4, 0, 0, 1,
                this.xEdge(i+1, edgeOffset*2), this.yEdge(i+1, edgeOffset*2)
              ]
            )
          }
          if (this.checkSide(edges, i+1) === 1) {
            path = path.concat(
              [
                "A", this.radius*2, this.radius*2, 0, 0, 0,
                this.xCornerOffset(i+1, edgeOffset, 1), this.yCornerOffset(i+1, edgeOffset, 1)
              ]
            )
          } else {
            path = path.concat(
              [
                "A", this.radius - edgeOffset*4, this.radius - edgeOffset*4, 0, 0, 1,
                this.xCorner(i+1, edgeOffset*4), this.yCorner(i+1, edgeOffset*4)
              ]
            )
          }
        }
      }
      break
    }
    return path.join(" ")
  }

  get terrainContinuous() {
    const edges = this.terrainEdges
    if (!edges || edges === "all") { return false }
    return {
      d: this.generatePaths(edges, 4),
      style: this.terrainStyles[this.baseTerrain] || { fill: "rgba(0,0,0,0" }
    }
  }

  get terrainPattern() {
    if (!this.patternStyles[this.baseTerrain]) { return false }
    return this.patternStyles[this.baseTerrain]
  }

  get elevationContinuous() {
    const edges = this.elevationEdges
    if (!edges || edges === "all") { return false }
    return { d: this.generatePaths(edges, 2), style: this.elevationStyles[this.elevation || 0] }
  }

  path(directions, center = null) {
    if (directions.length === 2) {
      const d1 = directions[0]
      const d2 = directions[1]
      const x1 = this.xEdge(d1)
      const y1 = this.yEdge(d1)
      const x2 = this.xEdge(d2)
      const y2 = this.yEdge(d2)
      let xCenter = this.xOffset
      if (center === "l") {
        xCenter -= this.narrow / 4
      } else if (center === "r") {
        xCenter += this.narrow / 4
      }
      const c1x = (xCenter + x1)/2
      const c1y = (this.yOffset + y1)/2
      const c2x = (xCenter + x2)/2
      const c2y = (this.yOffset + y2)/2
      let path = ["M", x1, y1]
      // Center can be shifted left or right, used for doing vertical roads
      if (center) {
        path = path.concat(["L", xCenter, this.yOffset])
        path = path.concat(["L", x2, y2])
      } else {
        path = path.concat(["C", `${c1x},${c1y}`, `${c2x},${c2y}`, `${x2},${y2}`])
      }
      return path.join(" ")
    } else {
      let centerOff = 0
      if (center === "l") {
        centerOff = -this.narrow / 4
      } else if (center === "r") {
        centerOff = this.narrow / 4
      }
      const x1 = this.xOffset + centerOff
      const y1 = this.yOffset
      let path = []
      for (let i = 0; i < directions.length - 1; i++) {
        const d1 = directions[i]
        const d2 = directions[i+1]
        const x2 = this.xEdge(d1)
        const y2 = this.yEdge(d1)
        const x3 = this.xEdge(d2)
        const y3 = this.yEdge(d2)
        path = path.concat([
          "M", x2, y2, "L", x1, y1, "L", x3, y3
        ])
      }
      return path.join(" ")
    }
  }

  get riverPath() {
    return this.path(this.riverDirections)
  }

  get riverStyle() {
    return {
      fill: "rgba(0,0,0,0)",
      strokeWidth: 10,
      stroke: this.darkWater,
      strokeLinejoin: "round",
    }
  }

  get roadPath() {
    return this.path(this.roadDirections, this.roadCenter)
  }

  get roadOutlineStyle() {
    const width = this.roadType === "p" ? 10 : 28
    return {
      fill: "rgba(0,0,0,0)",
      strokeWidth: (["j", "f", "b"].includes(this.baseTerrain) || this.river) ? width : 0,
      stroke: this.elevationStyles[this.elevation || 0]["fill"],
      strokeLinejoin: "round",
    }
  }

  get bridgeStyle() {
    return {
      fill: "rgba(0,0,0,0)",
      strokeWidth: 28,
      stroke: this.roadType === "t" ? "#BBB" : "#975",
    }
  }

  get roadEdgeStyle() {
    return {
      fill: "rgba(0,0,0,0)",
      strokeWidth: this.roadType === "p" ? 0 : 16,
      stroke: this.roadType === "t" ? "#AAA" : "#FD7",
      strokeLinejoin: "round",
    }
  }

  get roadStyle() {
    return {
      fill: "rgba(0,0,0,0)",
      strokeWidth: this.roadType === "p" ? 2 : 12,
      stroke: this.roadType === "t" ? "#DDD" : "#B85",
      strokeDasharray: this.roadType === "p" ? [5, 5] : "",
      strokeLinejoin: "round",
    }
  }

  get edgePath() {
    if (!this.border) { return false }
    return this.borderEdges.map(d => {
      return [
        "M", this.xCorner(d-1), this.yCorner(d-1), "L", this.xCorner(d), this.yCorner(d)
      ].join(" ")
    }).join(" ")
  }

  get edgeCoreStyle() {
    return this.borderStyles[this.border]
  }

  get edgeDecorationStyle() {
    return this.borderDecorationStyles[this.border]
  }

  get helpText() {
    let text = [this.terrain.name]
    if (this.elevation > 0) {
      text.push(`elevation ${this.elevation}`)
    }
    if (this.terrain.cover !== false) {
      text.push(`cover ${this.terrain.cover}`)
    }
    if (this.terrain.hindrance) {
      text.push(`hindrance ${this.terrain.hindrance}`)
    }
    if (this.terrain.los) {
      text.push("blocks line-of-sight")
    }
    if (this.terrain.move !== false) {
      text.push(`movement cost ${this.terrain.move}`)
      if (this.river && this.road) {
        if (["m", "s"].includes(this.map.baseTerrain)) {
          text.push(`- cost +2 if not following road`)
        } else {
          text.push(`- cost +1 if not following road`)
        }
      } else if (this.road && ["m", "s"].includes(this.map.baseTerrain)) {
        text.push(`- cost +1 if not following road`)
      }
      let rise = false
      this.map.hexNeighbors(this.x, this.y).forEach(n => {
        if (n && n.elevation < this.elevation) {
          rise = true
        }
      })
      if (rise) {
        text.push(" cost +1 if moving from lower elevation")
      }
      if (!this.terrain.gun) {
        text.push("- crewed weapons cannot enter")
      } else if (this.terrain.gun === "back") {
        text.push("- crewed weapons can only back in")
      }
      if (!this.terrain.vehicle) {
        text.push("- vehicles cannot enter")
      }
    }
    if (this.road) {
      if (this.roadType === 'p') {
        text.push("path")
        text.push("- foot movement cost 1 if moving along path")
      } else if (this.roadType === 't') {
        if (this.river) {
          text.push("bridge")
        } else {
          text.push("paved road")
        }
        text.push("- movement bonus +1 if moving along road")
        text.push("- except wheeled movement cost 1/2")
        if (!this.terrain.gun || !this.terrain.vehicle) {
          text.push("- all units can move along road")
        }
      } else {
        if (this.river) {
          text.push("wooden bridge")
        } else {
          text.push("unpaved road")
        }
        text.push("- movement bonus +1 if moving along road")
        if (!["m", "s"].includes(this.map.baseTerrain)) {
          text.push("- except wheeled movement cost 1/2")
        }
        if (!this.terrain.gun || !this.terrain.vehicle) {
          text.push("- all units can move along road")
        }
      }
    }
    if (this.river && this.terrain.move) {
      text.push("stream")
      text.push("- movement cost +1 when leaving")
      if (this.road) {
        text.push("- unless following road")
      }
    }
    const borderText = {}
    let bd = this.terrain.borderText()
    if (bd) {
      borderText[bd.key] = bd.text
    }
    this.map.hexNeighbors(this.x, this.y).forEach((n, i) => {
      if (n) {
        bd = n.terrain.borderText(i + 1)
        if (bd) {
          borderText[bd.key] = bd.text
        }
      }
    })
    Object.keys(borderText).forEach(k => borderText[k].forEach(t => text.push(t)))
    return text
  }

  helpLayout(x, y) {
    const text = this.helpText
    const size = 22
    let width = 24.4
    text.forEach(t => {
      const n = t.length * 9.6 + 16
      if (n > width) { width = n }
    })
    let x1 = x
    let x2 = x + width
    let y1 = y
    let y2 = y + text.length * size + size/2
    if (x2 > this.map.xSize) {
      const diff = - (width + 20)
      x1 += diff
      x2 += diff
    }
    if (y2 > this.map.ySize) {
      const diff = this.map.ySize - y2
      y1 += diff
      y2 += diff
    }
    const layout = {
      path: [
        "M", x1, y1, "L", x2, y1, "L", x2, y2, "L", x1, y2, "L", x1, y1,
      ].join(" "), style: { fill: "black", stroke: "white", strokeWidth: 2 },
      size: size-6
    }
    const diff = size
    layout.texts = text.map((t, i) => {
      return { x: x1+8, y: y1 + i*diff + size, v: t }
    })
    return layout
  }
}

export { Hex }
