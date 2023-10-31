import { markerType } from "./marker"

const Counter = class {
  constructor(x, y, target, map) {
    this.xHex = x
    this.yHex = y
    this.onMap = map && x > -1
    this.xBase = this.onMap ? map.xOffset(x, y) - 40 : 3
    this.yBase = this.onMap ? map.yOffset(y) - 40 : 1
    this.target = target
    this.map = map
    this.stackingIndex = 0
    this.trueIndex = undefined
  }

  get stackOffset() { return this.onMap ? 5 : 3 }
  get x() { return this.xBase + this.stackingIndex * this.stackOffset }
  get y() { return this.yBase - this.stackingIndex * this.stackOffset }

  get rotation() {
    if (!this.onMap || !this.target.rotates) {
      return false
    }
    let facing = this.target.facing
    if (this.target.turreted && !this.target.isWreck) { facing = this.target.turretFacing }
    return { a: facing*60 - 150, x: this.x + 40, y: this.y + 40 }
  }

  // TODO: extract this into utilities?
  // TODO: need to keep in sync with CSS
  nationalColors = {
    ussr: "#DA7", usa: "#BC7", uk: "#DC9", fra: "#AAF", chi: "#CCF", alm: "#EA9",
    ger: "#BBB", ita: "#9DC", jap: "#ED4", fin: "#CCC", axm: "#7CB", none: "white",
  }
  clear = "rgba(0,0,0,0)"
  red = "#E00"

  get color() { return this.nationalColors[this.target.nation] }

  get counterStyle() {
    if (this.target.selected) {
      return { fill: this.color, stroke: this.red, strokeWidth: 4 }
    } else {
      return { fill: this.color, stroke: "black", strokeWidth: 1 }
    }
  }

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
    return this.target.isBroken || this.target.isWreck || (this.target.jammed && !this.target.hullArmor)
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
    if (this.target.smallName > 0) { size = 8.25 }
    if (this.target.smallName > 1) { size = 7.825 }
    if (this.target.smallName > 2) { size = 7.5 }
    return {
      x: this.x + 3, y: this.y+10, size: size, name: this.target.name,
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
    if (!this.target.baseMorale) { return false }
    return {
      x: this.x + 13, y: this.y + 28, size: 16, value: this.target.currentMorale,
      style: { fill: this.target.currentMorale === this.target.baseMorale ? "black" : this.red }
    }
  }

  get weaponBreakLayout() {
    if (!this.target.breakWeaponRoll || this.target.noFire || this.target.jammed) { return false }
    const x = this.x + 14
    const y = this.y + 25
    return {
      path: this.circlePath(x, y, 8),
      style: { stroke: "black", strokeWidth: 1, fill: "yellow" }, tStyle: { fill: "black" },
      x: x, y: y + 4, size: 13, value: this.target.breakWeaponRoll,
    }
  }
  
  get sizeLayout() {
    if (!this.target.size ) { return false }
    const stroke = this.target.armored && !this.target.isWreck ? "black" : this.clear
    return {
      path: this.circlePath(this.x + 66, this.y + 23, 10),
      style: { stroke: stroke, strokeWidth: 1, fill: this.clear }, tStyle: { fill: "black" },
      x: this.x + 66, y: this.y + 28, size: 16, value: this.target.size,
    }
  }

  get leadershipLayout() {
    if (!this.target.currentLeadership) { return false }
    return {
      path: this.hexPath(this.x + 13, this.y + 44, 10, true),
      style: { stroke: "black", strokeWidth: 1, fill: this.clear }, tStyle: { fill: "black" },
      x: this.x + 13, y: this.y + 49, size: 16, value: this.target.currentLeadership,
    }
  }

  get handlingLayout() {
    if (!this.target.currentGunHandling) { return false }
    const x = this.x + 13
    const y = this.y + 42
    const path = this.circlePath(x, y, 8)
    return {
      path: path, style: { stroke: "black", strokeWidth: 1, fill: this.clear }, tStyle: { fill: "black" },
      x: x, y: y+4, size: 13, value: this.target.currentGunHandling,
    }
  }

  get breakdownLayout() {
    if (!this.target.breakdownRoll || this.target.immobilized || this.target.isWreck) {
      return false
    }
    const x = this.x + 14
    const y = this.y + 44
    const path = this.circlePath(x, y, 8)
    return {
      path: path, style: { stroke: "black", strokeWidth: 1, fill: "yellow" }, tStyle: { fill: "black" },
      x: x, y: y+4, size: 13, value: this.target.breakdownRoll,
    }
  }

  get smokeLayout() {
    if (!this.target.currentSmokeCapable) { return false }
    let x = this.x + 13
    let y = this.y + 51
    let size = 16
    if (this.target.breakdownRoll) {
      x = this.x + 5
      y = this.y + 59
      size = 13
    }
    return { x: x, y: y, size: size, value: "S", style: { fill: "black" } }
  }

  get iconLayout() {
    if (!this.target.icon) { return false }
    const x = this.x + (this.target.fullIcon ? 0 : 20)
    const y = this.y + (this.target.fullIcon ? 0 : 13)
    const size = this.target.fullIcon ? 80 : 40
    return {
      x: x, y: y, size: size, icon: this.target.isWreck ? "wreck" : this.target.icon
    }
  }

  get sponsonLayout() {
    const gun = this.target.sponson
    if (!gun || this.target.isWreck) { return false }
    const x = this.x + 38
    const y = this.y + 53
    const path = [
      "M", x-14, y-9, "L", x+14, y-9, "L", x+14, y+3, "L", x-14, y+3, "L", x-14, y-9
    ].join(" ")
    const style = { fill: this.color }
    return { path: path, x: x, y: y, size: 9.5, style: style, value: `${gun[0]}-${gun[1]}`}
  }

  get turretArmorLayout() {
    const armor = this.target.turretArmor
    if (!armor || this.target.isWreck) { return false }
    const x = this.x + 65
    const y = this.y + 43
    const value = armor.map(v => v < 0 ? "X" : v).join("-")
    return { x: x, y: y, size: 9.5, value: value}
  }

  get hullArmorLayout() {
    const armor = this.target.hullArmor
    if (!armor || this.target.isWreck) { return false }
    const x = this.x + 65
    const y = this.y + 53
    const value = armor.map(v => v < 0 ? "X" : v).join("-")
    return { x: x, y: y, size: 9.5, value: value}
  }

  get firepowerLayout() {
    if (this.target.isMarker) { return false }
    let x = this.x + 14 + (this.target.minimumRange ? 0 : 2)
    let y = this.y + 67
    const style = { stroke: this.clear, fill: this.clear, strokeWidth: 1 }
    let value = this.target.baseFirepower
    let color = "black"
    let path = this.squarePath(x, y)
    let size = this.sizeFor(value)
    if (this.target.noFire || this.target.isPinned) {
      color = this.red
      value = this.target.currentFirepower
      size = 16
    } else {
      if (this.target.antiTank || this.target.fieldGun) { path = this.circlePath(x, y, 10) }
      if (this.target.offBoard) {
        path = this.hexPath(x, y+0.5, 11, false)
        size = 12.5
      }
      if (this.target.antiTank || this.target.singleFire || this.target.assault || this.target.offBoard) {
        style.stroke = "black"
      }
      if (this.target.singleFire && this.target.ignoreTerrain) {
        style.stroke = "red"
        style.fill = "red"
      } else if (this.target.singleFire) {
        style.stroke = "black"
        style.fill = "black"
      } else if (this.target.ignoreTerrain) {
        style.stroke = "yellow"
        style.fill = "yellow"
      }
      if (this.target.fieldGun) {
        style.stroke = "black"
        style.fill = "white"
      }
      if (this.target.singleFire) { color = "white" }
      if (value === 0) { value = "-" }
    }
    if (size < 16) { y = y - 0.5 }
    return {
      path: path, style: style, tStyle: { fill: color }, x: x, y: y+5, size: size, value: value,
    }
  }

  get rangeLayout() {
    if (this.target.isMarker) { return false }
    let x = this.x + 40
    let y = this.y + 67
    const style = { stroke: this.clear, fill: this.clear, strokeWidth: 1 }
    let value = this.target.currentRange
    let color = "black"
    let path = this.squarePath(x, y)
    let size = this.sizeFor(value)
    if (this.target.noFire) {
      color = this.red
      size = 16
    } else {
      if (this.target.targetedRange) { path = this.circlePath(x, y, 10) }
      if (this.target.targetedRange || this.target.rapidFire) { style.stroke = "black" }
      if (this.target.type === "sw" && this.target.targetedRange) {
        style.stroke = "black"
        style.fill = "black"
        color = "white"
      } else if (this.target.turreted || this.target.rotatingMount) {
        style.stroke = "white"
        style.fill = "white"
      }
      if (this.target.targetedRange || this.target.rapidFire) { style.stroke = "black" }
      if (value === 0) {
        style.stroke = this.clear
        value = "-"
      }
    }
    if (size < 16) { y = y - 0.5 }
    if (this.target.minimumRange) {
      y = this.y + 65.25
      path = [
        "M", x-8, y-4, "L", x+8, y-4, "A", 6, 6, 0, 0, 1, x+8, y+8,
        "L", x-8, y+8, "A", 6, 6, 0, 0, 1, x-8, y-4,
      ].join(" ")
      value = `${this.target.minimumRange}-${value}`
      size = 10.5
    }
    return {
      path: path, style: style, tStyle: { fill: color }, x: x, y: y+5, size: size, value: value,
    }
  }

  get movementLayout() {
    if (this.target.isMarker) { return false }
    let x = this.x + 66 - (this.target.minimumRange ? 0 : 2)
    let y = this.y + 67
    const style = { stroke: this.clear, fill: this.clear, strokeWidth: 1 }
    let value = this.target.currentMovement
    let color = "black"
    let path = this.circlePath(x, y, 10)
    let size = this.sizeFor(value)
    if (this.target.isBroken || this.target.isPinned || this.target.isTired || value < 0 ||
      this.target.immobilized || this.target.isWreck) {
      color = this.red
    } else {
      if (this.target.tracked || this.target.crewed || this.target.wheeled ) {
        style.stroke = "black"
      }
      if (this.target.crewed) {
        style.fill = "black"
        color = "white"
      } else if (this.target.wheeled) {
        style.fill = "white"
      }
      if (value === 0) { value = "-" }
    }
    if (size < 16) { y = y - 0.5 }
    return {
      path: path, style: style, tStyle: { fill: color }, x: x, y: y+5, size: size, value: value,
    }
  }

  get markerLayout() {
    if (!this.target.isMarker || this.target.type === markerType.TrackedHull ||
      this.target.type === markerType.WheeledHull) { return false }
    const x = this.x + 40
    const y = this.y + 40
    const size = this.target.displayText[0] === "immobilized" ? 10 : 12
    const ty = y + 8 - size/2 * this.target.displayText.length
    const color = this.target.isMinor ? "yellow" : this.red
    const textColor = this.target.isMinor ? "black" : "white"
    const text = this.target.displayText.map((t, i) => {
      return { x: x, y: ty + size*i, value: t }
    })
    return {
      path: [
        "M", x-39.5, y-14, "L", x+39.5, y-14, "L", x+39.5, y+14, "L", x-39.5, y+14, "L", x-39.5, y-14
      ].join(" "),
      style: { fill: color }, size: size, tStyle: { fill: textColor }, text: text
    }
  }

  get statusLayout() {
    if (this.target.isMarker) { return false }
    const showAllCounters = this.onMap ? this.map.showAllCounters : this.showAllCounters
    if (this.target.isBroken || this.target.isWreck || showAllCounters) { return false }
    const x = this.x + 40
    let y = this.y + 46
    let size = 20
    const path = this.circlePath(x, y - 6, 22)
    const style = { fill: "yellow", stroke: "black", strokeWidth: 2 }
    const fStyle = { fill: "black" }
    if (this.target.isPinned || this.target.immobilized || this.target.turretJammed ||
      (this.target.jammed && this.target.hullArmor)) {
      style.fill = this.red
      style.stroke = "white"
      fStyle.fill = "white"
    }
    let text = []
    if (this.target.isActivated) { text.push("ACT") }
    if (this.target.isExhausted) { text.push("EXH") }
    if (this.target.isPinned) { text.push("PIN") }
    if (this.target.isTired) { text.push("TRD") }
    if (this.target.immobilized) { text.push("IMM") }
    if (this.target.turretJammed) { text.push("TRT") }
    if (this.target.jammed && this.target.hullArmor) { text.push("WPN") }
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

  helpLayout(x, y, document) {
    const text = this.target.helpText
    const size = 20
    let width = 100
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')
    context.font = getComputedStyle(document.body).font
    text.forEach(t => {
      const n = context.measureText(t).width * 0.975
      console.log(n)
      if (n > width) { width = n }
    })
    let x1 = x
    let x2 = x + width
    let y1 = y
    let y2 = y + text.length * size + size/2
    if (x2 > this.map.xSize) {
      const diff = - (width + 182.5)
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

export { Counter }