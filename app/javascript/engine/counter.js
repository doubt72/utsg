import { baseCounterPath, clearColor, counterRed, markerYellow, nationalColors } from "../utilities/graphics"
import { markerType } from "./marker"

const Counter = class {
  constructor(x, y, target, map, absolute = false) {
    this.onMap = map && x > -1
    if (absolute) {
      this.absolute = absolute
      this.xHex = 0
      this.yHex = 0
      this.xBase = x
      this.yBase = y
    } else {
      this.xHex = x
      this.yHex = y
      this.xBase = this.onMap ? map.xOffset(x, y) - 40 : 3
      this.yBase = this.onMap ? map.yOffset(y) - 40 : 1
    }
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

  clear = clearColor
  red = counterRed
  yellow = markerYellow

  get color() { return nationalColors[this.target.nation] }

  get counterStyle() {
    if (this.target.selected) {
      return { fill: this.color, stroke: this.red, strokeWidth: 4 }
    } else {
      return { fill: this.color, stroke: "black", strokeWidth: 1 }
    }
  }

  counterPath(xOffset = 0, yOffset = 0) {
    return baseCounterPath(this.x + xOffset, this.y + yOffset)
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
    let size = this.target.isFeature ? 11 : 9
    if (this.target.smallName > 0) { size = 8.25 }
    if (this.target.smallName > 1) { size = 7.825 }
    if (this.target.smallName > 2) { size = 7.5 }
    const y = this.target.isFeature ? this.y + 12 : this.y + 10
    return {
      x: this.x + 5, y: y, size: size, name: this.target.name,
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
      return circle ? 12.5 : 15
    } else {
      return 18
    }
  }

  get moraleLayout() {
    if (!this.target.baseMorale) { return false }
    return {
      x: this.x + 13, y: this.y + 28, size: 18, value: this.target.currentMorale,
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
      x: x, y: y + 4.25, size: 15, value: this.target.breakWeaponRoll,
    }
  }
  
  get sizeLayout() {
    if (!this.target.size ) { return false }
    const stroke = this.target.armored && !this.target.isWreck ? "black" : this.clear
    return {
      path: this.circlePath(this.x + 66, this.y + 23, 10),
      style: { stroke: stroke, strokeWidth: 1, fill: this.clear }, tStyle: { fill: "black" },
      x: this.x + 66, y: this.y + 28, size: 18, value: this.target.size,
    }
  }

  get leadershipLayout() {
    if (!this.target.currentLeadership) { return false }
    return {
      path: this.hexPath(this.x + 13, this.y + 44, 10, true),
      style: { stroke: "black", strokeWidth: 1, fill: this.clear }, tStyle: { fill: "black" },
      x: this.x + 13, y: this.y + 49, size: 18, value: this.target.currentLeadership,
    }
  }

  get handlingLayout() {
    if (!this.target.currentGunHandling) { return false }
    const x = this.x + 13
    const y = this.y + 42
    const path = this.circlePath(x, y, 8)
    return {
      path: path, style: { stroke: "black", strokeWidth: 1, fill: this.clear }, tStyle: { fill: "black" },
      x: x, y: y+4.25, size: 15, value: this.target.currentGunHandling,
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
      x: x, y: y+4.25, size: 15, value: this.target.breakdownRoll,
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
    let x = this.x + (this.target.fullIcon ? 0 : 20)
    let y = this.y + (this.target.fullIcon ? 0 : 13)
    if (this.target.isFeature) {
      y = this.y + 15
    }
    const size = this.target.fullIcon ? 80 : 40
    return {
      x: x, y: y, size: size, icon: this.target.isWreck ? "wreck" : this.target.icon
    }
  }

  get centerLabelLayout() {
    if (!this.target.sniperRoll) { return false }
    let x = this.x + 40
    let y = this.y + 48
    return {
      x: x, y: y, size: 40, value: this.target.sniperRoll, style: { fill: this.red }
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
      size = 18
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
    if (this.target.isFeature) {
      if (!this.target.fieldGun) {
        color = "white"
      }
      if (this.target.antiTank) {
        style.stroke = "white"
      }
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
      size = 18
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
    if (this.target.isFeature) {
      color = "white"
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
      if (this.target.isTracked || this.target.crewed || this.target.isWheeled ) {
        style.stroke = "black"
      }
      if (this.target.crewed) {
        style.fill = "black"
        color = "white"
      } else if (this.target.isWheeled) {
        style.fill = "white"
      }
      if (value === 0) { value = "-" }
    }
    if (this.target.isFeature) {
      color = "white"
    }
    if (size < 16) { y = y - 0.5 }
    return {
      path: path, style: style, tStyle: { fill: color }, x: x, y: y+5, size: size, value: value,
    }
  }

  get markerLayout() {
    if (!this.target.isMarker || this.target.type === markerType.TrackedHull ||
        this.target.type === markerType.WheeledHull || this.target.type === markerType.Initiative) {
      return false
    }
    const x = this.x + 40
    const y = this.y + 40
    let size = this.target.displayText[0] === "immobilized" ? 11 : 12
    let ty = y + 9 - 6 * this.target.displayText.length
    if (this.target.type === markerType.Wind || this.target.type === markerType.Weather) {
      size = 15
      ty += 1
    }
    const text = this.target.displayText.map((t, i) => {
      return { x: x, y: ty + size*i, value: t }
    })
    return {
      path: [
        "M", x-39.5, y-14, "L", x+39.5, y-14, "L", x+39.5, y+14, "L", x-39.5, y+14, "L", x-39.5, y-14
      ].join(" "),
      style: { fill: this.target.color }, size: size, tStyle: { fill: this.target.textColor }, text: text
    }
  }

  get windArrowLayout() {
    if (!this.target.isMarker) { return false }
    if (this.target.type !== markerType.Wind) { return false }

    const x = this.x + 40
    const y = this.y + 5
    return {
      path: [
        "M", x - 6, y + 6, "L", x, y, "L", x + 6, y + 6
      ].join(" "),
      style: { fill: "rgba(0,0,0,0", stroke: "black", strokeWidth: 1.5 },
    }
  }

  get markerSubLayout() {
    if (!this.target.isMarker) { return false }
    if (!this.target.subText) { return false }

    const x = this.x + 40
    const y = [this.y + 22, this.y + 64, this.y + 75]
    return { style: { fill: "#222" }, value: this.target.subText, x: x, y: y, size: 11.5 }
  }

  get featureLayout() {
    if (!this.target.isFeature) { return false }
    const x = this.x + 0.5
    const y = this.y + 0.5
    const corner = 3.5
    const path = [
      "M", x, y+54.5, "L", x+79, y+54.5, "L", x+79, y+79-corner,
      "A", corner, corner, 0, 0, 1, x+79-corner, y+79,
      "L", x+corner, y+79, "A", corner, corner, 0, 0, 1, x, y+79-corner, "L", x, y+54.5
    ].join(" ")
    let value = ""
    let size = 11
    if (this.target.blocksLos) {
      value = "blocks LOS"
    } else if (this.target.hindrance) {
      value = `hindrance ${this.target.hindrance}`
      size = 10.5
    } else if (this.target.cover) {
      size = 14
      value = `cover ${this.target.cover}`
    } else if (this.target.coverSides) {
      const cs = this.target.coverSides
      value = `cover ${cs[0]}-${cs[1]}-${cs[2]}`
      size = 10.5
    }
    const style = { fill: this.red }
    const tStyle = { fill: "white" }
    if (["foxhole", "smoke", "bunker"].includes(this.target.type)) {
      style.fill = "#BBB"
      tStyle.fill = "black"
    }

    return { path: path, style: style, value: value, tStyle: tStyle, x: x+40, y: y+70, size: size }
  }

  get statusLayout() {
    if (this.target.isMarker) { return false }
    const showAllCounters = this.onMap ? this.map.showAllCounters : this.showAllCounters
    if (this.target.isBroken || this.target.isWreck || showAllCounters) { return false }
    const x = this.x + 40
    let y = this.y + 46
    let size = 20
    const path = this.circlePath(x, y - 6, 22)
    const style = { fill: this.yellow, stroke: "black", strokeWidth: 2 }
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

  helpLayout(x, y) {
    const text = this.target.helpText
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

  facingLine(dir) {
    const hex = this.map.hexAt(this.xHex, this.yHex)
    const x = hex.xCorner(dir)
    const y = hex.yCorner(dir)
    const len = this.map.radius * (this.map.height + this.map.width)
    return [
      "M", x, y, "L", x - len * Math.cos((dir-0.5)/3 * Math.PI),
      y - len * Math.sin((dir-0.5)/3 * Math.PI)
    ]
  }

  get facingLayout() {
    if ((!this.target.turreted && !this.target.rotates) || this.target.isWreck) { return false }
    const dir = this.target.turreted ? this.target.turretFacing : this.target.facing
    const path = this.facingLine(dir).concat(this.facingLine(dir === 1 ? 6 : dir - 1)).join(" ")
    return {
      path: path, style: { fill: "rgba(0,0,0,0)", strokeWidth: 4, stroke: "rgba(255,255,255,1)" },
      dash: "4 4", style2: { fill: "rgba(0,0,0,0)", strokeWidth: 4, stroke: "rgba(0,0,0,1)" }
    }
  }
}

export { Counter }