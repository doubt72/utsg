const Counter = class {
  constructor(x, y, unit, map) {
    this.xHex = x
    this.yHex = y
    this.xBase = map ? map.xOffset(x, y) - 40 : 3
    this.yBase = map ? map.yOffset(y) - 40 : 1
    this.unit = unit
    this.map = map
    this.stackingIndex = 0
  }

  get stackOffset() { return this.map ? 5 : 3 }
  get x() { return this.xBase + this.stackingIndex * this.stackOffset }
  get y() { return this.yBase - this.stackingIndex * this.stackOffset }

  get rotation() {
    if (!this.map || ["sw", "ldr", "sqd", "tm"].includes(this.unit.type)) {
      return false
    }
    return { a: this.unit.facing*60 - 150, x: this.x + 40, y: this.y + 40 }
  }

  // TODO: extract this into utilities?
  // TODO: need to keep in sync with CSS
  nationalColors = {
    ussr: "#DA7", usa: "#BC7", uk: "#DC9", fra: "#AAF", chi: "#CCF", alm: "#EA9",
    ger: "#BBB", ita: "#9DC", jap: "#ED4", fin: "#CCC", axm: "#7CB",
  }
  clear = "rgba(0,0,0,0)"
  red = "#E00"

  get color() { return this.nationalColors[this.unit.nation] }

  get counterStyle() { return { fill: this.color, stroke: "black", strokeWidth: 1 } }

  counterPath(xOffset = 0, yOffset = 0) {
    const x = this.x + xOffset
    const y = this.y + yOffset
    const corner = 4
    return [
      "M", x+corner, y,
      "L", x+80-corner, y, "A", corner, corner, 0, 0, 1, x+80, y+corner,
      "L", x+80, y+80-corner, "A", corner, corner, 0, 0, 1, x+80-corner, y+80,
      "L", x+corner, y+80, "A", corner, corner, 0, 0, 1, x, y+80-corner,
      "L", x, y+corner, "A", corner, corner, 0, 0, 1, x+corner, y,
    ].join(" ")
  }

  get shadowPath() {
    const angle = this.rotation ? this.rotation.a : 0
    return this.counterPath(
      -this.stackOffset * Math.sqrt(2) * Math.cos((angle + 45)/ 180 * Math.PI),
      this.stackOffset * Math.sqrt(2) * Math.sin((angle + 45) / 180 * Math.PI)
    )
  }

  get reverseName() {
    return this.unit.isBroken || this.unit.isWreck || (this.unit.jammed && !this.unit.hullArmor)
  }

  get nameBackgroundStyle() { return { fill: this.reverseName ? "red" : this.clear } }

  get nameBackgroundPath() {
    const x = this.x
    const y = this.y
    const corner = 4
    return [
      "M", x+corner, y,
      "L", x+80-corner, y, "A", corner, corner, 0, 0, 1, x+80, y+corner,
      "L", x+80, y+12.8, "L", x, y+12.8, "L", x, y+corner,
      "A", corner, corner, 0, 0, 1, x+corner, y,
    ].join(" ")
  }

  get nameLayout() {
    let size = 9
    if (this.unit.smallName > 0) { size = 8.25 }
    if (this.unit.smallName > 1) { size = 7.825 }
    if (this.unit.smallName > 2) { size = 7.5 }
    return {
      x: this.x + 3, y: this.y+10, size: size, name: this.unit.name,
      style: { fill: this.reverseName ? "white" : "black" }
    }
  }

  circlePath(x, y, r) {
    return ["M", x, y-r, "A", r, r, 0, 0, 1, x, y+r, "A", r, r, 0, 0, 1, x, y-r].join(" ")
  }

  squarePath(x, y) {
    return ["M", x-10, y-10, "L", x+10, y-10, "L", x+10, y+10, "L", x-10, y+10, "L", x-10, y-10].join(" ")
  }

  hexPath(x, y, r, rotated) {
    let a = (rotated ? -0.5 : -1)/3 * Math.PI
    let path = ["M", x + r * Math.cos(a), y + r * Math.sin(a)]
    for (let i = 0; i < 6; i++) {
      a = (i + (rotated ? 0.5 : 0))/3 * Math.PI
      path = path.concat(["L", x + r * Math.cos(a), y + r * Math.sin(a)])
    }
    return path.join(" ")
  }

  sizeFor(n, circle) {
    if (n > 9 || n < 0) {
      return circle ? 12.5 : 13.5
    } else {
      return 16
    }
  }

  get moraleLayout() {
    if (!this.unit.baseMorale) { return false }
    return {
      x: this.x + 13, y: this.y + 28, size: 16, value: this.unit.currentMorale,
      style: { fill: this.unit.currentMorale === this.unit.baseMorale ? "black" : this.red }
    }
  }

  get weaponBreakLayout() {
    if (!this.unit.breakWeaponRoll || this.unit.noFire || this.unit.jammed) { return false }
    const x = this.x + 14
    const y = this.y + 25
    return {
      path: this.circlePath(x, y, 8),
      style: { stroke: "black", strokeWidth: 1, fill: "yellow" }, tStyle: { fill: "black" },
      x: x, y: y + 4, size: 13, value: this.unit.breakWeaponRoll,
    }
  }
  
  get sizeLayout() {
    if (!this.unit.size ) { return false }
    const stroke = this.unit.armored && !this.unit.isWreck ? "black" : this.clear
    return {
      path: this.circlePath(this.x + 66, this.y + 23, 10),
      style: { stroke: stroke, strokeWidth: 1, fill: this.clear }, tStyle: { fill: "black" },
      x: this.x + 66, y: this.y + 28, size: 16, value: this.unit.size,
    }
  }

  get leadershipLayout() {
    if (!this.unit.currentLeadership) { return false }
    return {
      path: this.hexPath(this.x + 13, this.y + 44, 10, true),
      style: { stroke: "black", strokeWidth: 1, fill: this.clear }, tStyle: { fill: "black" },
      x: this.x + 13, y: this.y + 49, size: 16, value: this.unit.currentLeadership,
    }
  }

  get handlingLayout() {
    if (!this.unit.currentGunHandling) { return false }
    const x = this.x + 13
    const y = this.y + 42
    const path = this.circlePath(x, y, 8)
    return {
      path: path, style: { stroke: "black", strokeWidth: 1, fill: this.clear }, tStyle: { fill: "black" },
      x: x, y: y+4, size: 13, value: this.unit.currentGunHandling,
    }
  }

  get breakdownLayout() {
    if (!this.unit.breakdownRoll || this.unit.immobilized || this.unit.brokenDown || this.unit.isWreck) {
      return false
    }
    const x = this.x + 14
    const y = this.y + 44
    const path = this.circlePath(x, y, 8)
    return {
      path: path, style: { stroke: "black", strokeWidth: 1, fill: "yellow" }, tStyle: { fill: "black" },
      x: x, y: y+4, size: 13, value: this.unit.breakdownRoll,
    }
  }

  get smokeLayout() {
    if (!this.unit.currentSmokeCapable) { return false }
    let x = this.x + 13
    let y = this.y + 51
    let size = 16
    if (this.unit.breakdownRoll) {
      x = this.x + 5
      y = this.y + 59
      size = 13
    }
    return { x: x, y: y, size: size, value: "S", style: { fill: "black" } }
  }

  get icon() { if (this.unit.isWreck) { return "wreck" } else { return this.unit.icon } }

  get sponsonLayout() {
    const gun = this.unit.sponson
    if (!gun || this.unit.isWreck) { return false }
    const x = this.x + 38
    const y = this.y + 53
    const path = [
      "M", x-14, y-9, "L", x+14, y-9, "L", x+14, y+3, "L", x-14, y+3, "L", x-14, y-9
    ].join(" ")
    const style = { fill: this.color }
    return { path: path, x: x, y: y, size: 9.5, style: style, value: `${gun[0]}-${gun[1]}`}
  }

  get turretArmorLayout() {
    const armor = this.unit.turretArmor
    if (!armor || this.unit.isWreck) { return false }
    const x = this.x + 65
    const y = this.y + 43
    const value = armor.map(v => v < 0 ? "X" : v).join("-")
    return { x: x, y: y, size: 9.5, value: value}
  }

  get hullArmorLayout() {
    const armor = this.unit.hullArmor
    if (!armor || this.unit.isWreck) { return false }
    const x = this.x + 65
    const y = this.y + 53
    const value = armor.map(v => v < 0 ? "X" : v).join("-")
    return { x: x, y: y, size: 9.5, value: value}
  }

  get firepowerLayout() {
    let x = this.x + 14 + (this.unit.minimumRange ? 0 : 2)
    let y = this.y + 67
    const style = { stroke: this.clear, fill: this.clear, strokeWidth: 1 }
    let value = this.unit.baseFirepower
    let color = "black"
    let path = this.squarePath(x, y)
    let size = this.sizeFor(value)
    if (this.unit.noFire || this.unit.isPinned) {
      color = this.red
      value = this.unit.currentFirepower
      size = 16
    } else {
      if (this.unit.antiTank || this.unit.fieldGun) { path = this.circlePath(x, y, 10) }
      if (this.unit.offBoard) {
        path = this.hexPath(x, y+0.5, 11, false)
        size = 12.5
      }
      if (this.unit.antiTank || this.unit.singleFire || this.unit.assault || this.unit.offBoard) {
        style.stroke = "black"
      }
      if (this.unit.singleFire && this.unit.ignoreTerrain) {
        style.stroke = "red"
        style.fill = "red"
      } else if (this.unit.singleFire) {
        style.stroke = "black"
        style.fill = "black"
      } else if (this.unit.ignoreTerrain) {
        style.stroke = "yellow"
        style.fill = "yellow"
      }
      if (this.unit.fieldGun) {
        style.stroke = "black"
        style.fill = "white"
      }
      if (this.unit.singleFire) { color = "white" }
      if (value === 0) { value = "-" }
    }
    if (size < 16) { y = y - 0.5 }
    return {
      path: path, style: style, tStyle: { fill: color }, x: x, y: y+5, size: size, value: value,
    }
  }

  get rangeLayout() {
    let x = this.x + 40
    let y = this.y + 67
    const style = { stroke: this.clear, fill: this.clear, strokeWidth: 1 }
    let value = this.unit.currentRange
    let color = "black"
    let path = this.squarePath(x, y)
    let size = this.sizeFor(value)
    if (this.unit.noFire) {
      color = this.red
      size = 16
    } else {
      if (this.unit.targetedRange) { path = this.circlePath(x, y, 10) }
      if (this.unit.targetedRange || this.unit.rapidFire) { style.stroke = "black" }
      if (this.unit.type === "sw" && this.unit.targetedRange) {
        style.stroke = "black"
        style.fill = "black"
        color = "white"
      } else if (this.unit.turreted || this.unit.rotatingMount) {
        style.stroke = "white"
        style.fill = "white"
      }
      if (this.unit.targetedRange || this.unit.rapidFire) { style.stroke = "black" }
      if (value === 0) {
        style.stroke = this.clear
        value = "-"
      }
    }
    if (size < 16) { y = y - 0.5 }
    if (this.unit.minimumRange) {
      y = this.y + 65.25
      path = [
        "M", x-8, y-4, "L", x+8, y-4, "A", 6, 6, 0, 0, 1, x+8, y+8,
        "L", x-8, y+8, "A", 6, 6, 0, 0, 1, x-8, y-4,
      ].join(" ")
      value = `${this.unit.minimumRange}-${value}`
      size = 10.5
    }
    return {
      path: path, style: style, tStyle: { fill: color }, x: x, y: y+5, size: size, value: value,
    }
  }

  get movementLayout() {
    let x = this.x + 66 - (this.unit.minimumRange ? 0 : 2)
    let y = this.y + 67
    const style = { stroke: this.clear, fill: this.clear, strokeWidth: 1 }
    let value = this.unit.currentMovement
    let color = "black"
    let path = this.circlePath(x, y, 10)
    let size = this.sizeFor(value)
    if (this.unit.isBroken || this.unit.isPinned || this.unit.tired || value < 0 ||
      this.unit.immobilized || this.unit.brokenDown || this.unit.isWreck) {
      color = this.red
    } else {
      if (this.unit.tracked || this.unit.crewed || this.unit.wheeled ) {
        style.stroke = "black"
      }
      if (this.unit.crewed) {
        style.fill = "black"
        color = "white"
      } else if (this.unit.wheeled) {
        style.fill = "white"
      }
      if (value === 0) { value = "-" }
    }
    if (size < 16) { y = y - 0.5 }
    return {
      path: path, style: style, tStyle: { fill: color }, x: x, y: y+5, size: size, value: value,
    }
  }

  get statusLayout() {
    const showAllCounters = this.map ? this.map.showAllCounters : false
    if (this.unit.isBroken || this.unit.isWreck || showAllCounters) { return false }
    const x = this.x + 40
    let y = this.y + 46
    let size = 20
    const path = this.circlePath(x, y - 6, 22)
    const style = { fill: "yellow", stroke: "black", strokeWidth: 2 }
    const fStyle = { fill: "black" }
    if (this.unit.isPinned || this.unit.immobilized || this.unit.brokenDown || this.unit.turretJammed ||
      (this.unit.jammed && this.unit.hullArmor)) {
      style.fill = this.red
      style.stroke = "white"
      fStyle.fill = "white"
    }
    let text = []
    if (this.unit.isActivated) { text.push("ACT") }
    if (this.unit.isExhausted) { text.push("EXH") }
    if (this.unit.isPinned) { text.push("PIN") }
    if (this.unit.tired) { text.push("TRD") }
    if (this.unit.immobilized) { text.push("IMM") }
    if (this.unit.brokenDown) { text.push("BDN") }
    if (this.unit.turretJammed) { text.push("TRT") }
    if (this.unit.jammed && this.unit.hullArmor) { text.push("WBK") }
    if (text.length === 0) { return false }
    if (text.length === 2) {
      size = 15
      y = y - 9
    } else if (text.length === 3) {
      size = 12
      y = y - 14.5
    } else if (text.length === 4) {
      size = 9
      y = y - 17
    } else if (text.length > 4) {
      size = 8.5
      y = y - 8
      text = [text.slice(0,2).join(" "), text.slice(2,4).join(" "), text.slice(4,6).join(" ")]
    }
    return { value: text, x: x, y: y, size: size, path: path, style: style, fStyle: fStyle }
  }
}

export { Counter }