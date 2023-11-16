const HexBuilding = class {
  constructor(hex) {
    this.hex = hex
  }

  // These allow doing simple X, Y coords, but then rotate for direction (used
  // for doing all the "square" buildings)
  xRotated(direction, x, y) {
    const  dir = -direction - 0.5
    return this.hex.xOffset + x * Math.sin(dir/3 * Math.PI) + y * Math.sin((dir/3 + 0.5) * Math.PI)
  }

  yRotated(direction, x, y) {
    const  dir = -direction - 0.5
    return this.hex.yOffset + x * Math.cos(dir/3 * Math.PI) + y * Math.cos((dir/3 + 0.5) * Math.PI)
  }

  // Silo (smaller circle)
  siloPath(inset = 32) {
    let path = [
      "M", this.hex.xCorner(0, inset), this.hex.yCorner(0, inset),
      "A", this.hex.radius - inset, this.hex.radius - inset, 0, 1, 0,
      this.hex.xCorner(3, inset), this.hex.yCorner(3, inset),
      "A", this.hex.radius - inset, this.hex.radius - inset, 0, 1, 0,
      this.hex.xCorner(0, inset), this.hex.yCorner(0, inset)
    ]
    for (let i = 0; i < 6; i++) {
      path = path.concat(
        [
          "M", this.hex.xCorner(i/2, inset), this.hex.yCorner(i/2, inset),
          "L", this.hex.xCorner(i/2 + 3, inset), this.hex.yCorner(i/2 + 3, inset)
        ]
      )
    }
    return path
  }

  // Tank (larger circle)
  get tankPath() { return this.siloPath(16) }

  // Huts (four small buildings in a set)
  get hutPath() {
    let path = []
    const dir = this.hex.direction
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
    return path
  }

  // Cross building
  get crossPath() {
    // Symmetrical "x" or "cross" building for some variety
    const inset = 4
    const dir = this.hex.direction
    const mag1 = this.hex.narrow/2 - inset*2
    const mag2 = mag1/2.5
    // This could be abstracted a bit, but it's probably not really worth it;
    // things rotate when they repeat, and swapping x and y is a pain
    return [
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

  // The single-hex-wide (eaved) "standard" buildings
  get lonePath() {
    let path = []
    const inset = 4
    const outset = inset*3
    const dir = this.hex.direction
    const x = this.hex.narrow/2
    const y = this.hex.radius/2 - inset
    path = this.drawCore(dir, x, y, inset, inset*2, inset*2)
    path = path.concat(this.drawEnd(dir, x, y, inset, 0))
    path = path.concat(this.drawEnd(dir, -x, y, -inset, 0))
    path = path.concat(this.drawEave(dir, -outset, -y))
    path = path.concat(this.drawEave(dir, outset, y))
    return path
  }

  get sidePath() {
    let path = []
    const inset = 4
    const outset = inset*3
    const dir = this.hex.direction
    const x = this.hex.narrow/2
    const y = this.hex.radius/2 - inset
    path = this.drawCore(dir, x, y, inset, inset*2, 0)
    path = path.concat(this.drawEnd(dir, x, y, inset, -x))
    path = path.concat(this.drawEave(dir, -outset, -y))
    path = path.concat(this.drawEave(dir, outset, y))
    return path
  }

  get middlePath() {
    let path = []
    const inset = 4
    const outset = inset*3
    const dir = this.hex.direction
    const x = this.hex.narrow/2
    const y = this.hex.radius/2 - inset
    path = this.drawCore(dir, x, y, inset, 0, 0)
    path = path.concat([
      "M", this.xRotated(dir, -x, 0), this.yRotated(dir, -x, 0),
      "L", this.xRotated(dir, x, 0), this.yRotated(dir, x, 0),
    ])
    path = path.concat(this.drawEave(dir, -outset, -y))
    path = path.concat(this.drawEave(dir, outset, y))
    return path
  }

  // Blocky "factory" building -- not all configurations are possible.
  get bigMiddle() {
    const path = []
    let pa = "M"
    for (let i = 0; i <= 6; i++) {
      path.push(pa)
      path.push(this.hex.xCorner(i))
      path.push(this.hex.yCorner(i))
      pa = "L"
    }
    return path
  }

  get bigSide1() {
    const inset = 4
    const outset = inset*3
    const dir = this.hex.direction
    const x1 = this.hex.xCornerOffset(dir + 1, outset, 1)
    const y1 = this.hex.yCornerOffset(dir + 1, outset, 1)
    const x2 = this.hex.xCornerOffset(dir + 4, outset, -1)
    const y2 = this.hex.yCornerOffset(dir + 4, outset, -1)
    const xOff = outset * Math.sin(Math.PI/3)
    return [
      "M", x1, y1, "L", this.hex.xCorner(dir + 2), this.hex.yCorner(dir + 2),
      "L", this.hex.xCorner(dir + 3), this.hex.yCorner(dir + 3), "L", x2, y2,
      "L", this.xRotated(dir, -xOff, outset*3), this.yRotated(dir, -xOff, outset*3),
      "L", this.xRotated(dir, xOff*4, outset*3), this.yRotated(dir, xOff*4, outset*3),
      "L", this.xRotated(dir, xOff*4, -outset*3), this.yRotated(dir, xOff*4, -outset*3),
      "L", this.xRotated(dir, -xOff, -outset*3), this.yRotated(dir, -xOff, -outset*3),
      "L", x1, y1,
    ]
  }

  get bigSide2() {
    const inset = 4
    const outset = inset*3
    const dir = this.hex.direction
    const x1 = this.hex.xCornerOffset(dir + 2, outset, 1)
    const y1 = this.hex.yCornerOffset(dir + 2, outset, 1)
    const x2 = this.hex.xCornerOffset(dir, outset, -1)
    const y2 = this.hex.yCornerOffset(dir, outset, -1)
    return [
      "M", x1, y1, "L", this.hex.xCorner(dir + 3), this.hex.yCorner(dir + 3),
      "L", this.hex.xCorner(dir + 4), this.hex.yCorner(dir + 4),
      "L", this.hex.xCorner(dir + 5), this.hex.yCorner(dir + 5),
      "L", x2, y2, "L", x1, y1,
    ]
  }

  get bigSide3() {
    const inset = 4
    const outset = inset*3
    const dir = this.hex.direction
    const x1 = this.hex.xCornerOffset(dir - 1, outset, -1)
    const y1 = this.hex.yCornerOffset(dir - 1, outset, -1)
    const x2 = this.hex.xCornerOffset(dir + 3, outset, 1)
    const y2 = this.hex.yCornerOffset(dir + 3, outset, 1)
    const xOff = this.hex.narrow/2 - outset * Math.sin(Math.PI/3)
    return [
      "M", x1, y1,
      "L", this.xRotated(dir, xOff, -outset*2), this.yRotated(dir, xOff, -outset*2),
      "L", this.xRotated(dir, -xOff, -outset*2), this.yRotated(dir, -xOff, -outset*2),
      "L", x2, y2, "L", this.hex.xCorner(dir + 4), this.hex.yCorner(dir + 4), "L", x1, y1,
    ]
  }

  get bigSide4() {
    const inset = 4
    const outset = inset*3
    const dir = this.hex.direction
    const x1 = this.hex.xCornerOffset(dir, outset, 1)
    const y1 = this.hex.yCornerOffset(dir, outset, 1)
    const x2 = this.hex.xCornerOffset(dir - 1, outset, -1)
    const y2 = this.hex.yCornerOffset(dir - 1, outset, -1)
    return [
      "M", x1, y1, "L", this.hex.xCorner(dir + 1), this.hex.yCorner(dir + 1),
      "L", this.hex.xCorner(dir + 2), this.hex.yCorner(dir + 2),
      "L", this.hex.xCorner(dir + 3), this.hex.yCorner(dir + 3),
      "L", this.hex.xCorner(dir + 4), this.hex.yCorner(dir + 4),
      "L", x2, y2, "L", x1, y1,
    ]
  }

  get bigCorner1() {
    const inset = 4
    const outset = inset*3
    const dir = this.hex.direction
    const x1 = this.hex.xCornerOffset(dir - 1, outset, -1)
    const y1 = this.hex.yCornerOffset(dir - 1, outset, -1)
    const x2 = this.hex.xCornerOffset(dir + 2, outset, 1)
    const y2 = this.hex.yCornerOffset(dir + 2, outset, 1)
    const xOff = this.hex.narrow/2 - outset * Math.sin(Math.PI/3)
    return [
      "M", x1, y1,
      "L", this.xRotated(dir, xOff, -this.hex.radius/3),
           this.yRotated(dir, xOff, -this.hex.radius/3),
      "L", x2, y2, "L", this.hex.xCorner(dir + 3), this.hex.yCorner(dir + 3),
      "L", this.hex.xCorner(dir + 4), this.hex.yCorner(dir + 4), "L", x1, y1,
    ]
  }

  get bigCorner2() {
    const inset = 4
    const outset = inset*3
    const dir = this.hex.direction
    const x1 = this.hex.xCornerOffset(dir, outset, -1)
    const y1 = this.hex.yCornerOffset(dir, outset, -1)
    const x2 = this.hex.xCornerOffset(dir + 3, outset, 1)
    const y2 = this.hex.yCornerOffset(dir + 3, outset, 1)
    const xOff = this.hex.narrow/2 - outset * Math.sin(Math.PI/3)
    return [
      "M", x1, y1,
      "L", this.xRotated(dir + 3, xOff, this.hex.radius/3),
           this.yRotated(dir + 3, xOff, this.hex.radius/3),
      "L", x2, y2, "L", this.hex.xCorner(dir + 4), this.hex.yCorner(dir + 4),
      "L", this.hex.xCorner(dir + 5), this.hex.yCorner(dir + 5), "L", x1, y1,
    ]
  }

  get bigCorner3() {
    const inset = 4
    const outset = inset*3
    const dir = this.hex.direction
    const x1 = this.hex.xCornerOffset(dir, outset, -1)
    const y1 = this.hex.yCornerOffset(dir, outset, -1)
    const x2 = this.hex.xCornerOffset(dir + 4, outset, 1)
    const y2 = this.hex.yCornerOffset(dir + 4, outset, 1)
    const xOff2 = outset * Math.sin(Math.PI/3)
    const xOff = this.hex.narrow/2 - xOff2
    return [
      "M", x1, y1,
      "L", this.xRotated(dir + 3, xOff, this.hex.radius/3),
           this.yRotated(dir + 3, xOff, this.hex.radius/3),
      "L", this.xRotated(dir + 3, xOff, -this.hex.radius/2),
           this.yRotated(dir + 3, xOff, -this.hex.radius/2),
      "L", this.xRotated(dir + 3, -xOff2, -this.hex.radius/2),
           this.yRotated(dir + 3, -xOff2, -this.hex.radius/2),
      "L", x2, y2, "L", this.hex.xCorner(dir + 5), this.hex.yCorner(dir + 5), "L", x1, y1,
    ]
  }

  get buildingDisplay() {
    if (!this.hex.building) { return false }
    let path = []
    if (this.hex.buildingShape === "c") {
      path = this.siloPath()
    } else if (this.hex.buildingShape === "t") {
      path = this.tankPath
    } else if (this.hex.buildingShape === "h") {
      path = this.hutPath
    } else if (this.hex.buildingShape === "x") {
      path = this.crossPath
    } else if (this.hex.buildingShape === "l") {
      path = this.lonePath
    } else if (this.hex.buildingShape === "s") {
      path = this.sidePath
    } else if (this.hex.buildingShape === "m") {
      path = this.middlePath
    } else if (this.hex.buildingShape === "bm") {
      path = this.bigMiddle
    } else if (this.hex.buildingShape === "bs1") {
      path = this.bigSide1
    } else if (this.hex.buildingShape === "bs2") {
      path = this.bigSide2
    } else if (this.hex.buildingShape === "bs3") {
      path = this.bigSide3
    } else if (this.hex.buildingShape === "bs4") {
      path = this.bigSide4
    } else if (this.hex.buildingShape === "bc1") {
      path = this.bigCorner1
    } else if (this.hex.buildingShape === "bc2") {
      path = this.bigCorner2
    } else if (this.hex.buildingShape === "bc3") {
      path = this.bigCorner3
    }
    return { d: path.join(" "), style: {
      fill: this.hex.buildingStyle === "f" ? "#B97" : "#AAA",
      stroke: this.hex.buildingShape === "fm" ? "rgba(0,0,0,0)" : "#333",
      strokeWidth: 1,
    }}
  }

  get buildingLosEdges() {
    const dir = this.hex.direction
    const opp = dir > 3 ? dir - 3 : dir + 3
    if (!this.hex.building) { return [] }
    if (this.hex.buildingShape === "m") { return [dir, opp] }
    if (this.hex.buildingShape === "s") { return [opp] }
    if (this.hex.buildingShape === "bm") { return [1, 2, 3, 4, 5, 6] }
    let sides = []
    if (this.hex.buildingShape === "bs1") { return [dir+2, opp, opp+1] }
    if (this.hex.buildingShape === "bs2") { return [dir, opp, opp+1, opp+2] }
    if (this.hex.buildingShape === "bs3") { return [opp+1, opp+2] }
    if (this.hex.buildingShape === "bs4") { return [dir+1, dir+2, opp, opp+1, opp+2] }
    if (this.hex.buildingShape === "bc1") { return [opp, opp+1, opp+2] }
    if (this.hex.buildingShape === "bc2") { return [dir, opp+1, opp+2] }
    if (this.hex.buildingShape === "bc3") { return [dir, opp+2] }
    sides = sides.map(s => s > 6 ? s - 6 : s)
    return sides
  }
}

export { HexBuilding }