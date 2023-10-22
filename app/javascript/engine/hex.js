const Hex = class {
  constructor(x, y, data) {
    this.x = x
    this.y = y
    this.terrain = data.t
    this.terrainEdges = data.e
    this.road = !!data.r
    if (this.road) {
      this.roadType = data.r.t
      this.roadDirections = data.r.d
      this.roadCenter = data.r.c
    }
    this.elevation = data.h || 0
    this.elevationEdges = data.he
    this.border = data.b
    this.borderEdges = data.be
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
    f: { fill: "#080" },
    j: { fill: "#060" },
    b: { fill: "#9C9" },
    g: { fill: "#DEA" },
    s: { fill: "#DD9" },
    m: { fill: "#7F9" },
    w: { fill: this.lightWater },
    x: { fill: this.darkWater },
  }

  get narrow() { return 96 } // Base hex side, measuring flat side
  get radius() { return this.narrow / 2 / Math.sin(1/3 * Math.PI) }
  get xOffset() { return this.narrow * (this.x + this.y%2/2 + 0.5) + 1 }
  get yOffset() { return this.radius * (this.y*1.5 + 1) + 1 }

  xCorner(i, inset = 0) { return this.xOffset - (this.radius - inset) * Math.cos((i-0.5)/3 * Math.PI) }
  yCorner(i, inset = 0) { return this.yOffset - (this.radius - inset) * Math.sin((i-0.5)/3 * Math.PI) }
  xEdge(i, inset = 0) { return this.xOffset - (this.narrow/2 - inset) * Math.cos(i/3 * Math.PI) }
  yEdge(i, inset = 0) { return this.yOffset - (this.narrow/2 - inset) * Math.sin(i/3 * Math.PI) }

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

  get background() {
    if (this.terrainEdges === "all" && this.terrainStyles[this.terrain]) {
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

  get terrainCircle() {
    if (this.terrainEdges || this.terrain === "o") { return false }
    return {
      x: this.xOffset, y: this.yOffset, r: this.narrow/2 - 5, style: this.terrainStyles[this.terrain]
    }
  }

  get elevationHex() {
    if (this.elevationEdges || this.elevation < 1) { return false }
    return { d: this.hexRoundCoordsInset(4), style: this.elevationStyles[this.elevation] }
  }

  get terrainContinuousStyle() {
    return this.terrainStyles[this.terrain]
  }

  get elevationStyle() {
    return this.elevationStyles[this.elevation || 0]
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
                this.xEdge(i, edgeOffset*2), this.yEdge(i, edgeOffset*2)
              ]
            )
          } else {
            path = path.concat(
              [
                "A", this.radius - edgeOffset*4, this.radius - edgeOffset*4, 0, 0, 1,
                this.xEdge(i, edgeOffset*2), this.yEdge(i, edgeOffset*2)
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
    if (!edges || edges === "all") return false
    return this.generatePaths(edges, 4)
  }

  get elevationContinuous() {
    const edges = this.elevationEdges
    if (!edges || edges === "all") return false
    return this.generatePaths(edges, 2)
  }

  get roadPath() {
    if (this.roadDirections.length === 2) {
      const d1 = this.roadDirections[0]
      const d2 = this.roadDirections[1]
      const x1 = this.xEdge(d1)
      const y1 = this.yEdge(d1)
      const x2 = this.xEdge(d2)
      const y2 = this.yEdge(d2)
      let xCenter = this.xOffset
      if (this.roadCenter === "l") {
        xCenter -= this.narrow / 4
      } else if (this.roadCenter === "r") {
        xCenter += this.narrow / 4
      }
      const c1x = (xCenter + x1)/2
      const c1y = (this.yOffset + y1)/2
      const c2x = (xCenter + x2)/2
      const c2y = (this.yOffset + y2)/2
      let path = ["M", x1, y1]
      if (this.roadCenter) {
        path = path.concat(["L", xCenter, this.yOffset])
        path = path.concat(["L", x2, y2])
      } else {
        path = path.concat(["C", `${c1x},${c1y}`, `${c2x},${c2y}`, `${x2},${y2}`])
      }
      return path.join(" ")
    } else {
      let centerOff = 0
      if (this.roadCenter === "l") {
        centerOff = -this.narrow / 4
      } else if (this.roadCenter === "r") {
        centerOff = this.narrow / 4
      }
      const x1 = this.xOffset + centerOff
      const y1 = this.yOffset
      let path = []
      for (let i = 0; i < this.roadDirections.length - 1; i++) {
        const d1 = this.roadDirections[i]
        const d2 = this.roadDirections[i+1]
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

  get roadOutlineStyle() {
    const backgroundStyle = this.elevationStyles[this.elevation || 0]["fill"]
    return {
      fill: "rgba(0,0,0,0)",
      strokeWidth: this.roadType === "p" ? 10 : 28,
      stroke: this.roadType === "r" ? "rgba(0,0,0,0)" : backgroundStyle,
      strokeLinejoin: "round",
    }
  }

  get roadEdgeStyle() {
    const roadStyle = this.roadType === "t" ? "#AAA" : "#FD7"
    const width = this.roadType === "p" ? 0 : 16
    return {
      fill: "rgba(0,0,0,0)",
      strokeWidth: this.roadType === "r" ? 12 : width,
      stroke: this.roadType === "r" ? this.darkWater : roadStyle,
      strokeLinejoin: "round",
    }
  }

  get roadStyle() {
    const roadStyle = this.roadType === "t" ? "#DDD" : "#B85"
    return {
      fill: "rgba(0,0,0,0)",
      strokeWidth: this.roadType === "p" ? 2 : 12,
      stroke: this.roadType === "r" ? this.darkWater : roadStyle,
      strokeDasharray: this.roadType === "p" ? "5 5" : "",
      strokeLinejoin: "round",
    }
  }
}

export { Hex }
