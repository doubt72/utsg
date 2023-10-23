const Hex = class {
  constructor(x, y, data, map) {
    this.map = map
    this.x = x
    this.y = y
    this.terrain = data.t
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
    // Hexes will check next hex, only need to do one side
    this.borderEdges = data.be
    this.building = !!data.st
    if (this.building) {
      this.buildingStyle = data.st.s
      this.buildingShape = data.st.sh
    }
  }

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
    const edges = this.map.hexNeighbors(this.x, this.y).map((h, i) => {
      const check = !h || h.terrain === this.terrain
      if (check) { none = false } else { all = false }
      return check ? 1 : 0
    })
    if (all) { return "all" }
    if (none) { return null }
    return edges
  }

  elevationStyles = [
    { fill: "#D7FFD0" },
    { fill: "#DA7" },
    { fill: "#B85" },
    { fill: "#963" },
    { fill: "#741" },
    { fill: "#620" },
  ]

  lightWater = "#59C"
  darkWater = "#46A"

  terrainStyles = {
    j: { fill: "rgba(47,191,47,0.33)" },
    s: { fill: "#DD9" },
    m: { fill: "#CEE" },
    g: { fill: "#DEA" },
    w: { fill: this.darkWater }, // TODO: special shallow beach water?
  }

  patternStyles = {
    f: { fill: "url(#forest-pattern)" },
    b: { fill: "url(#brush-pattern)" },
    j: { fill: "url(#jungle-pattern)" },
    s: { fill: "url(#sand-pattern)" },
    m: { fill: "url(#marsh-pattern)" },
    g: { fill: "url(#grain-pattern)" },
    // w: { fill: this.darkWater },
  }

  borderStyles = {
    f: { stroke: "#963", strokeWidth: 3 },
    w: { stroke: "#BBB", strokeWidth: 8, strokeLinecap: "round" },
    b: { stroke: "#060", strokeWidth: 8, strokeLinecap: "round" },
    c: { stroke: "#420", strokeWidth: 8, strokeLinecap: "round" },
  }

  borderDecorationStyles = {
    f: { stroke: "#963", strokeWidth: 8, strokeDasharray: [2, this.radius/5] },
    w: { stroke: "#888", strokeWidth: 8, strokeDasharray: [2, 2] },
    b: { stroke: "rgba(0,0,0,0)" },
    c: { stroke: "rgba(0,0,0,0)" },
  }

  get narrow() { return 96 } // Base hex side, measuring flat side
  get radius() { return this.narrow / 2 / Math.sin(1/3 * Math.PI) }
  get xOffset() { return this.narrow * (this.x + this.y%2/2 + 0.5) + 1 }
  get yOffset() { return this.radius * (this.y*1.5 + 1) + 1 }

  xCorner(i, inset = 0) { return this.xOffset - (this.radius - inset) * Math.cos((i-0.5)/3 * Math.PI) }
  yCorner(i, inset = 0) { return this.yOffset - (this.radius - inset) * Math.sin((i-0.5)/3 * Math.PI) }
  xEdge(i, inset = 0) { return this.xOffset - (this.narrow/2 - inset) * Math.cos((i-1)/3 * Math.PI) }
  yEdge(i, inset = 0) { return this.yOffset - (this.narrow/2 - inset) * Math.sin((i-1)/3 * Math.PI) }

  xCornerOffset(i, offset, dir, inset = 0) {
    const x = this.xCorner(i, inset)
    return x - offset * Math.cos((i - 0.5 + 2*dir)/3 * Math.PI)
  }
  yCornerOffset(i, offset, dir, inset = 0) {
    const y = this.yCorner(i, inset)
    return y - offset * Math.sin((i - 0.5 + 2*dir)/3 * Math.PI)
  }

  get hexCoords() {
    return [0, 1, 2, 3, 4, 5, 6].map(i => {
      return `${this.xCorner(i)},${this.yCorner(i)}`
    }).join(" ")
  }

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

  get backgroundTerrain() {
    return this.terrainEdges === "all"
  }

  get background() {
    if (this.backgroundTerrain && this.terrainStyles[this.terrain]) {
      return this.terrainStyles[this.terrain]
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
    return this.yOffset - this.radius + 18
  }

  get label() {
    // handle up to 52 for now
    const letters = [
      "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M",
      "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",
    ]
    letters.forEach(l => letters.push(l + l))
    return `${letters[this.x]}${this.y + 1}`
  }

  get orchardDisplay() {
    if (this.terrain !== "d") { return false }
    const trees = []
    [0, 1, 2].forEach((x) => {
      [0, 1].forEach((y) => {
        trees.push({
          x: this.xOffset - Math.round((x-1)/2) * this.radius*0.575 + this.radius*0.575,
          y: this.yOffset - x%2 * this.radius*0.575 + this.radius*0.275,
          r: this.radius/5,
          style: { fill: "#393" }
        })
      })
    })
    return trees
  }

  get buildingDisplay() {
    if (!this.building) { return false }
    let path = []
    let inset = 8
    let dir = this.direction
    if (this.buildingShape === "c") {
      inset = 16
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
    } else if (this.buildingShape === "x") {
      const outside = this.radius * 0.8
      const inside = outside * Math.sin(Math.PI/5.333)
      dir = (2/3 - this.direction/3) + Math.PI/4
      let angle = dir * Math.PI
      path = [
        "M", this.xOffset + outside * Math.sin(angle), this.yOffset + outside * Math.cos(angle)
      ]
      for (let i = 0; i < 4; i++) {
        angle = (i/2 + dir) * Math.PI
        path = path.concat([
          "L", this.xOffset + outside * Math.sin(angle), this.yOffset + outside * Math.cos(angle),
          "L", this.xOffset + inside * Math.sin(angle + Math.PI/8),
          this.yOffset + inside * Math.cos(angle + Math.PI/8),
          "L", this.xOffset + outside * Math.sin(angle + Math.PI/4),
          this.yOffset + outside * Math.cos(angle + Math.PI/4)
        ])
      }
      angle = (2 + dir) * Math.PI
      path = path.concat([
        "L", this.xOffset + outside * Math.sin(angle), this.yOffset + outside * Math.cos(angle)
      ])
      for (let i = 0; i < 4; i++) {
        angle = (i/2 + dir) * Math.PI
        path = path.concat([
          "M", this.xOffset + outside * Math.sin(angle), this.yOffset + outside * Math.cos(angle),
          "L", this.xOffset + inside * Math.sin(angle - Math.PI/8),
          this.yOffset + inside * Math.cos(angle - Math.PI/8),
          "L", this.xOffset, this.yOffset,
          "L", this.xOffset + inside * Math.sin(angle - Math.PI/8),
          this.yOffset + inside * Math.cos(angle - Math.PI/8),
          "L", this.xOffset + outside * Math.sin(angle - Math.PI/4),
          this.yOffset + outside * Math.cos(angle - Math.PI/4)
        ])
      }
    } else if (this.buildingShape === "m") {
      inset = 4
      path = [
        "M", this.xCornerOffset(dir-3, inset, -1), this.yCornerOffset(dir-3, inset, -1),
        "L", this.xCornerOffset(dir-1, inset, 1), this.yCornerOffset(dir-1, inset, 1),
        "L", this.xCornerOffset(dir, inset, -1), this.yCornerOffset(dir, inset, -1),
        "L", this.xCornerOffset(dir+2, inset, 1), this.yCornerOffset(dir+2, inset, 1),
        "L", this.xCornerOffset(dir+3, inset, -1), this.yCornerOffset(dir+3, inset, -1),
        "M", this.xEdge(dir), this.yEdge(dir),
        "L", this.xEdge(dir+3), this.yEdge(dir+3),
      ]
    } else if (this.buildingShape === "s") {
      inset = 4
      const xO = inset*4 * Math.sin((dir+0.5)/3 * Math.PI)
      const yO = -inset*4 * Math.cos((dir+0.5)/3 * Math.PI)
      path = [
        "M", this.xCornerOffset(dir-3, inset, -1), this.yCornerOffset(dir-3, inset, -1),
        "L", this.xCornerOffset(dir-1, inset, 1) + xO, this.yCornerOffset(dir-1, inset, 1) + yO,
        "L", this.xCornerOffset(dir, inset, -1) + xO, this.yCornerOffset(dir, inset, -1) + yO,
        "L", this.xCornerOffset(dir+2, inset, 1), this.yCornerOffset(dir+2, inset, 1),
        "L", this.xCornerOffset(dir+3, inset, -1), this.yCornerOffset(dir+3, inset, -1),
        "M", this.xEdge(dir, inset*8), this.yEdge(dir, inset*8),
        "L", this.xEdge(dir+3), this.yEdge(dir+3),
        "M", this.xEdge(dir, inset*8), this.yEdge(dir, inset*8),
        "L", this.xCornerOffset(dir-1, inset, 1) + xO, this.yCornerOffset(dir-1, inset, 1) + yO,
        "M", this.xEdge(dir, inset*8), this.yEdge(dir, inset*8),
        "L", this.xCornerOffset(dir, inset, -1) + xO, this.yCornerOffset(dir, inset, -1) + yO,
      ]
    } else if (this.buildingShape === "l") {
      path = ["M", this.xCorner(dir-3, inset), this.yCorner(dir-3, inset)]
      for (let i = 0; i < 2; i++) {
        path = path.concat([
          "L", this.xCorner(i*3-1+dir, inset), this.yCorner(i*3-1+dir, inset),
          "L", this.xCorner(i*3+dir, inset), this.yCorner(i*3+dir, inset),
        ])
      }
      for (let i = 0; i < 2; i++) {
        path = path.concat([
          "M", this.xCorner(i*3-1+dir, inset), this.yCorner(i*3-1+dir, inset),
          "L", this.xEdge(i*3+dir, inset*3), this.yEdge(i*3+dir, inset*3),
          "L", this.xOffset, this.yOffset,
          "M", this.xCorner(i*3+dir, inset), this.yCorner(i*3+dir, inset),
          "L", this.xEdge(i*3+dir, inset*3), this.yEdge(i*3+dir, inset*3),
        ])
      }
    }
    return { d: path.join(" "), style: {
      fill: this.buildingStyle === "f" ? "#B97" : "#AAA",
      stroke: "#333",
      strokeWidth: 1,
    }}
  }

  get terrainCircle() {
    if (this.terrainEdges || this.terrain === "o") { return false }
    return {
      x: this.xOffset, y: this.yOffset, r: this.narrow/2 - 5,
      style: this.terrainStyles[this.terrain] || { fill: "rgba(0,0,0,0" }
    }
  }

  get elevationHex() {
    if (this.elevationEdges || this.elevation < 1) { return false }
    return { d: this.hexRoundCoordsInset(5), style: this.elevationStyles[this.elevation] }
  }

  checkSide(hexSides, i) {
    return hexSides[(i+6)%6]
  }

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
      style: this.terrainStyles[this.terrain] || { fill: "rgba(0,0,0,0" }
    }
  }

  get terrainPattern() {
    if (!this.patternStyles[this.terrain]) { return false }
    return this.patternStyles[this.terrain]
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
      strokeWidth: (["j", "f", "b"].includes(this.terrain) || this.river) ? width : 0,
      stroke: this.elevationStyles[this.elevation || 0]["fill"],
      strokeLinejoin: "round",
    }
  }

  get bridgeStyle() {
    return {
      fill: "rgba(0,0,0,0)",
      strokeWidth: 28,
      stroke: "#BBB",
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
