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
      this.roadType = data.r.t
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
    return { hindrance: 0, los: true }
  }

  get hindrance() {
    let smoke = 0
    const counters = this.map.counterDataAt(this.x, this.y)
    for (let i = 0; i < counters.length; i++) {
      const check = counters[i].u.hindrance
      if (check) { smoke += check }
    }
    return this.terrain.baseAttr.hindrance + smoke
  }

  edgeHindrance(dir) {
    return this.terrainBorderEdge(dir).hindrance
  }

  alongEdgeHindrance(dir) {
    const neighbor = this.map.neighborAt(this.x, this.y, dir)
    let rc = this.terrainBorderEdge(dir).hindrance
    // If terrain crosses the edge, it may hinder (terrain considered to run off edge)
    if (this.baseTerrain === (neighbor?.baseTerrain || this.baseTerrain)) {
      rc += this.terrain.baseAttr.hindrance
    }
    let lSmoke = 0
    let rSmoke = 0
    const counters = this.map.counterDataAt(this.x, this.y)
    for (let i = 0; i < counters.length; i++) {
      const check = counters[i].u.hindrance
      if (check) { lSmoke += check }
    }
    if (neighbor) {
      const counters = this.map.counterDataAt(neighbor.x, neighbor.y)
      for (let i = 0; i < counters.length; i++) {
        const check = counters[i].u.hindrance
        if (check) { rSmoke += check }
      }
    } else {
      rSmoke = lSmoke
    }
    rc += Math.min(lSmoke, rSmoke)
    // Hinder if there are fences (or more) on both sides of the starting or ending edge
    // Leading corner
    const dir1 = dir === 6 ? 1 : dir + 1
    const b1 = this.terrainBorderEdge(dir1)
    const n1 = this.map.neighborAt(this.x, this.y, dir1)
    const b2 = n1.terrainBorderEdge(dir1 > 2 ? dir1 - 2 : dir1 + 4)
    if (b1.hindrance && b2.hindrance) {
      rc += Math.min(b1.hindrance, b2.hindrance)
    } else if (b1.hindrance && !b2.los) {
      rc += b1.hindrance
    } else if (b2.hindrance && !b1.los) {
      rc += b2.hindrance
    }
    // Trailing corner
    const dir2 = dir === 1 ? 6 : dir - 1
    const b3 = this.terrainBorderEdge(dir2)
    const n2 = this.map.neighborAt(this.x, this.y, dir2)
    const b4 = n2.terrainBorderEdge(dir2 < 5 ? dir2 + 2 : dir2 - 4)
    if (b3.hindrance && b4.hindrance) {
      rc += Math.min(b3.hindrance, b4.hindrance)
    } else if (b3.hindrance && !b4.los) {
      rc += b3.hindrance
    } else if (b4.hindrance && !b3.los) {
      rc += b4.hindrance
    }
    return rc
  }

  get los() {
    if (this.building) { return false }
    // Blaze blocks LOS
    const counters = this.map.counterDataAt(this.x, this.y)
    for (let i = 0; i < counters.length; i++) {
      if (counters[i].u.blocksLos) { return false }
    }
    return this.terrain.baseAttr.los
  }

  edgeLos(dir) {
    return this.terrainBorderEdge(dir).los
  }

  alongEdgeLos(dir) {
    const neighbor = this.map.neighborAt(this.x, this.y, dir)
    if (!this.terrainBorderEdge(dir).los) { return false }
    // If terrain crosses the edge, it may block (terrain considered to run off edge)
    if (this.baseTerrain === (neighbor?.baseTerrain || this.baseTerrain)) {
      if (!this.terrain.baseAttr.los) { return false }
    }
    // Handle blazes
    let lBlock = false
    let rBlock = false
    const counters = this.map.counterDataAt(this.x, this.y)
    for (let i = 0; i < counters.length; i++) {
      if (counters[i].u.blocksLos) { lBlock = true }
    }
    if (neighbor) {
      const counters = this.map.counterDataAt(neighbor.x, neighbor.y)
      for (let i = 0; i < counters.length; i++) {
        if (counters[i].u.blocksLos) { rBlock = true }
      }
    } else {
      rBlock = lBlock
    }
    if (lBlock && rBlock) { return false }
    // Block if there is terrain on both sides of the starting or ending edge
    // Leading corner
    const dir1 = dir === 6 ? 1 : dir + 1
    const b1 = this.terrainBorderEdge(dir1)
    const n1 = this.map.neighborAt(this.x, this.y, dir1)
    const b2 = n1.terrainBorderEdge(dir1 > 2 ? dir1 - 2 : dir1 + 4)
    if (!b1.los && !b2.los) { return false }
    // Trailing corner
    const dir2 = dir === 1 ? 6 : dir - 1
    const b3 = this.terrainBorderEdge(dir2)
    const n2 = this.map.neighborAt(this.x, this.y, dir2)
    const b4 = n2.terrainBorderEdge(dir2 < 5 ? dir2 + 2 : dir2 - 4)
    if (!b3.los && !b4.los) { return false }
    // Buildings block if they cross edge
    if (this.building && neighbor?.building) {
      const same = this.direction === dir
      const opp = this.direction === dir > 3 ? dir - 3 : dir + 3
      const blockLeft = (this.buildingStyle === "m" && (same || opp )) ||
        (this.buildingStyle === "s" && opp)
      const blockRight = (neighbor.buildingStyle === "m" && (same || opp )) ||
        (neighbor.buildingStyle === "s" && same)
      if (blockLeft && blockRight) { return false }
    }
    return true
  }

  get mapColors() {
    return {
      g: "#D0EED0",
      d: "#EEB",
      s: "#EEE",
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
    m: { fill: "#CEE" },
    g: { fill: "#DEA" },
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

  // When matching up hexes with continuous curves, use this to calculate how
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
    } 
    return { d: path.join(" "), style: {
      fill: this.buildingStyle === "f" ? "#B97" : "#AAA",
      stroke: "#333",
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
}

export { Hex }
