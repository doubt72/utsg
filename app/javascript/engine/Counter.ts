import { Coordinate, Direction, FeatureTypeType, featureType, markerType } from "../utilities/commonTypes";
import Marker from "./Marker";
import Unit from "./Unit";
import Feature from "./Feature";
import Map from "./Map";
import {
  CircleLayout,
  CounterLayout, HelpLayout, MarkerLayout, PathLayout, SVGPathArray, SVGStyle, StatusLayout, TextArrayLayout, baseCounterPath, clearColor, counterRed,
  facingLayout,
  markerYellow, nationalColors
} from "../utilities/graphics";
import { normalDir } from "../utilities/utilities";

export default class Counter {
  onMap: boolean;
  absolute: boolean = true;
  hex?: Coordinate;
  base?: Coordinate;
  target: Unit | Marker | Feature;
  map?: Map;
  stackingIndex: number;
  trueIndex?: number;

  constructor(
    coord: Coordinate | undefined, target: Unit | Marker | Feature,
    map?: Map, absolute: boolean = false
  ) {
    this.onMap = !!map && !!coord
    if (absolute) {
      this.absolute = absolute
      this.hex = new Coordinate(0, 0)
      this.base = coord
    } else {
      this.hex = coord
      // Conditions are redundant, but type checker gets confused otherwise
      if (this.onMap && !!map && !!coord) {
        this.base = new Coordinate(
          map.xOffset(coord.x, coord.y) - 40, map.yOffset(coord.y) - 40
        )
      } else {
        this.base = new Coordinate(3, 1)
      }
    }
    this.target = target
    this.map = map
    this.stackingIndex = 0
    this.trueIndex = undefined
  }

  showAllCounters = false;

  get stackOffset(): number { return this.onMap ? 5 : 3 }
  get x(): number { return (this.base?.x ?? 0) + this.stackingIndex * this.stackOffset }
  get y(): number { return (this.base?.y ?? 0) - this.stackingIndex * this.stackOffset }

  get rotation(): { a: number, x: number, y: number} | false {
    if (!this.onMap || !this.target.rotates) {
      return false
    }
    let facing = this.target.facing
    if (this.target.turreted && !this.target.isWreck) { facing = this.target.turretFacing }
    return { a: facing*60 - 150, x: this.x + 40, y: this.y + 40 }
  }

  get color(): string { return nationalColors[this.target.nation] }

  get counterStyle(): SVGStyle {
    if (this.target.isMarker && this.target.type === markerType.Turn) {
      return { fill: "#DFDFDF", stroke: "black", strokeWidth: 1 }
    }
    if (this.target.selected) {
      return { fill: this.color, stroke: counterRed, strokeWidth: 4 }
    } else {
      return { fill: this.color, stroke: "black", strokeWidth: 1 }
    }
  }

  counterPath(xOffset: number = 0, yOffset: number = 0): string {
    return baseCounterPath(this.x + xOffset, this.y + yOffset)
  }

  get shadowPath(): string {
    const angle = this.rotation ? this.rotation.a : 0
    return this.counterPath(
      -this.stackOffset * Math.sqrt(2) * Math.cos((angle + 45)/ 180 * Math.PI),
      this.stackOffset * Math.sqrt(2) * Math.sin((angle + 45) / 180 * Math.PI)
    )
  }

  get reverseName(): boolean {
    return this.target.isBroken || this.target.isWreck || (this.target.jammed && !this.target.hullArmor)
  }

  get nameBackgroundStyle(): SVGStyle {
    return { fill: this.reverseName ? "red" : clearColor }
  }

  get nameBackgroundPath(): string {
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

  get nameLayout(): CounterLayout {
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

  circlePath(loc: Coordinate, r: number): string {
    return [
      "M", loc.x, loc.y-r, "A", r, r, 0, 0, 1, loc.x, loc.y+r,
      "A", r, r, 0, 0, 1, loc.x, loc.y-r].join(" ")
  }

  squarePath(loc: Coordinate): string {
    return [
      "M", loc.x-10, loc.y-10, "L", loc.x+10, loc.y-10, "L", loc.x+10, loc.y+10,
      "L", loc.x-10, loc.y+10, "L", loc.x-10, loc.y-10].join(" ")
  }

  hexPath(loc: Coordinate, r: number, rotated: boolean): string {
    let a = (rotated ? -0.5 : -1)/3 * Math.PI
    let path = ["M", loc.x + r * Math.cos(a), loc.y + r * Math.sin(a)]
    for (let i = 0; i < 6; i++) {
      a = (i + (rotated ? 0.5 : 0))/3 * Math.PI
      path = path.concat(["L", loc.x + r * Math.cos(a), loc.y + r * Math.sin(a)])
    }
    return path.join(" ")
  }

  sizeFor(n: number, circle: boolean = false): number {
    if (n > 9 || n < 0) {
      return circle ? 12.5 : 15
    } else {
      return 18
    }
  }

  get moraleLayout(): CounterLayout | false {
    if (!this.target.baseMorale) { return false }
    return {
      x: this.x + 13, y: this.y + 28, size: 18, value: this.target.currentMorale,
      style: { fill: this.target.currentMorale === this.target.baseMorale ? "black" : counterRed }
    }
  }

  get weaponBreakLayout(): CounterLayout | false {
    if (!this.target.breakWeaponRoll || this.target.noFire || this.target.jammed) {
      return false
    }
    const loc = new Coordinate(this.x + 14, this.y + 25)
    return {
      path: this.circlePath(loc, 8),
      style: { stroke: "black", strokeWidth: 1, fill: "yellow" }, tStyle: { fill: "black" },
      x: loc.x, y: loc.y + 4.25, size: 15, value: this.target.breakWeaponRoll,
    }
  }
  
  get sizeLayout(): CounterLayout | false {
    if (!this.target.size ) { return false }
    const stroke = this.target.armored && !this.target.isWreck ? "black" : clearColor
    return {
      path: this.circlePath(new Coordinate(this.x + 66, this.y + 23), 10),
      style: { stroke: stroke, strokeWidth: 1, fill: clearColor }, tStyle: { fill: "black" },
      x: this.x + 66, y: this.y + 28, size: 18, value: this.target.size,
    }
  }

  get leadershipLayout(): CounterLayout | false {
    if (!this.target.currentLeadership) { return false }
    return {
      path: this.hexPath(new Coordinate(this.x + 13, this.y + 44), 10, true),
      style: { stroke: "black", strokeWidth: 1, fill: clearColor }, tStyle: { fill: "black" },
      x: this.x + 13, y: this.y + 49, size: 18, value: this.target.currentLeadership,
    }
  }

  get handlingLayout(): CounterLayout | false {
    if (!this.target.currentGunHandling) { return false }
    const loc = new Coordinate(this.x + 13, this.y + 42)
    const path = this.circlePath(loc, 8)
    return {
      path: path, style: { stroke: "black", strokeWidth: 1, fill: clearColor },
      tStyle: { fill: "black" },
      x: loc.x, y: loc.y+4.25, size: 15, value: this.target.currentGunHandling,
    }
  }

  get breakdownLayout(): CounterLayout | false {
    if (!this.target.breakdownRoll || this.target.immobilized || this.target.isWreck) {
      return false
    }
    const loc = new Coordinate(this.x + 14, this.y + 44)
    const path = this.circlePath(loc, 8)
    return {
      path: path, style: { stroke: "black", strokeWidth: 1, fill: "yellow" },
      tStyle: { fill: "black" },
      x: loc.x, y: loc.y+4.25, size: 15, value: this.target.breakdownRoll,
    }
  }

  get smokeLayout(): CounterLayout | false {
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

  get iconLayout(): CounterLayout | false {
    if (!this.target.icon) { return false }
    const x = this.x + (this.target.fullIcon ? 0 : 20)
    let y = this.y + (this.target.fullIcon ? 0 : 13)
    if (this.target.isFeature) {
      y = this.y + 15
    }
    const size = this.target.fullIcon ? 80 : 40
    return {
      x: x, y: y, size: size, icon: this.target.isWreck ? "wreck" : this.target.icon
    }
  }

  get centerLabelLayout(): CounterLayout | false {
    if (!this.target.sniperRoll) { return false }
    const x = this.x + 40
    const y = this.y + 48
    return {
      x: x, y: y, size: 40, value: this.target.sniperRoll, style: { fill: counterRed }
    }
  }

  get sponsonLayout(): CounterLayout | false {
    const gun = this.target.sponson as [number, number]
    if (!gun || this.target.isWreck) { return false }
    const x = this.x + 38
    const y = this.y + 53
    const path = [
      "M", x-14, y-9, "L", x+14, y-9, "L", x+14, y+3, "L", x-14, y+3, "L", x-14, y-9
    ].join(" ")
    const style = { fill: this.color }
    return {
      path: path, x: x, y: y, size: 9.5, style: style, value: `${gun[0]}-${gun[1]}`
    }
  }

  get turretArmorLayout(): CounterLayout | false {
    const armor = this.target.turretArmor as [number, number, number]
    if (!armor || this.target.isWreck) { return false }
    const x = this.x + 65
    const y = this.y + 43
    const value = armor.map((v: number) => v < 0 ? "X" : v).join("-")
    return { x: x, y: y, size: 9.5, value: value}
  }

  get hullArmorLayout(): CounterLayout | false {
    const armor = this.target.hullArmor as [number, number, number]
    if (!armor || this.target.isWreck) { return false }
    const x = this.x + 65
    const y = this.y + 53
    const value = armor.map(v => v < 0 ? "X" : v).join("-")
    return { x: x, y: y, size: 9.5, value: value}
  }

  get firepowerLayout(): CounterLayout | false {
    if (this.target.isMarker) { return false }
    const loc = new Coordinate(this.x + 14 + (this.target.minimumRange ? 0 : 2), this.y + 67)
    const style = { stroke: clearColor, fill: clearColor, strokeWidth: 1 }
    let value = this.target.baseFirepower
    let color = "black"
    let path = this.squarePath(loc)
    let size = value === "½" ? 18 : this.sizeFor(value as number)
    if (this.target.noFire || this.target.isPinned) {
      color = counterRed
      value = this.target.currentFirepower
      size = 18
    } else {
      if (this.target.antiTank || this.target.fieldGun) {
        path = this.circlePath(loc, 10)
      }
      if (this.target.offBoard) {
        path = this.hexPath(loc.yDelta(+0.5), 11, false)
        size = 12.5
      }
      if (this.target.antiTank || this.target.singleFire ||
          this.target.assault || this.target.offBoard) {
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
    if (size < 16) { loc.yShift(-0.5) }
    return {
      path: path, style: style, tStyle: { fill: color },
      x: loc.x, y: loc.y+5, size: size, value: value,
    }
  }

  get rangeLayout(): CounterLayout | false {
    if (this.target.isMarker) { return false }
    if (this.target.isFeature &&
      [
        featureType.Smoke, featureType.Fire, featureType.Bunker, featureType.Foxhole
      ].includes(this.target.type as FeatureTypeType)) {
    return false
  }
    let loc = new Coordinate(this.x + 40, this.y + 67)
    const style = { stroke: clearColor, fill: clearColor, strokeWidth: 1 }
    let value: number | string = this.target.currentRange
    let color = "black"
    let path = this.squarePath(loc)
    let size = this.sizeFor(value)
    if (this.target.noFire) {
      color = counterRed
      size = 18
    } else {
      if (this.target.targetedRange) { path = this.circlePath(loc, 10) }
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
        style.stroke = clearColor
        value = "-"
      }
    }
    if (this.target.isFeature) {
      color = "white"
    }
    if (size < 16) { loc.yShift(-0.5) }
    if (this.target.minimumRange) {
      loc = new Coordinate(loc.x, this.y + 65.25)
      path = [
        "M", loc.x-8, loc.y-4, "L", loc.x+8, loc.y-4,
        "A", 6, 6, 0, 0, 1, loc.x+8, loc.y+8,
        "L", loc.x-8, loc.y+8, "A", 6, 6, 0, 0, 1, loc.x-8, loc.y-4,
      ].join(" ")
      value = `${this.target.minimumRange}-${value}`
      size = 10.5
    }
    return {
      path: path, style: style, tStyle: { fill: color }, x: loc.x, y: loc.y+5,
      size: size, value: value,
    }
  }

  get movementLayout(): CounterLayout | false {
    if (this.target.isMarker) { return false }
    const loc = new Coordinate(this.x + 66 - (this.target.minimumRange ? 0 : 2), this.y + 67)
    const style = { stroke: clearColor, fill: clearColor, strokeWidth: 1 }
    let value = this.target.currentMovement
    let color = "black"
    const path = this.circlePath(loc, 10)
    const size = this.sizeFor(value as number)
    if (this.target.isBroken || this.target.isPinned || this.target.isTired ||
        value as number < 0 || this.target.immobilized || this.target.isWreck) {
      color = counterRed
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
    if (size < 16) { loc.xShift(0.5) }
    return {
      path: path, style: style, tStyle: { fill: color }, x: loc.x, y: loc.y+5,
      size: size, value: value,
    }
  }

  get markerLayout(): MarkerLayout | false {
    if (!this.target.isMarker || this.target.type === markerType.TrackedHull ||
        this.target.type === markerType.WheeledHull ||
        this.target.type === markerType.Initiative) {
      return false
    }
    const loc = new Coordinate(this.x + 40, this.y + 40)
    const target = this.target as Marker
    let size = target.displayText[0] === "immobilized" ? 11 : 12
    let ty = loc.y + 9 - 6 * target.displayText.length
    if (this.target.type === markerType.Wind || this.target.type === markerType.Weather) {
      size = 15
      ty += 1
    } else if (this.target.type === markerType.Turn) {
      size = 22
      ty -= 15
    }
    const text = target.displayText.map((t, i) => {
      return { x: loc.x, y: ty + size*i, value: t }
    })
    if (this.target.type === markerType.Turn) {
      return { size: size, tStyle: { fill: this.target.textColor }, text: text }
    } else {
      return {
        path: [
          "M", loc.x-39.5, loc.y-14, "L", loc.x+39.5, loc.y-14, "L", loc.x+39.5, loc.y+14,
          "L", loc.x-39.5, loc.y+14, "L", loc.x-39.5, loc.y-14
        ].join(" "),
        style: { fill: target.color }, size: size,
        tStyle: { fill: target.textColor }, text: text
      }
    }
  }

  get turnLayout(): CircleLayout[] | false {
    if (!this.target.isMarker || this.target.type !== markerType.Turn ) { return false }
    return [
      {
        x: this.x + 22, y: this.y + 50, r: 16,
        style: {
          fill: `url(#nation-${this.target.value}-16)`, strokeWidth: 1, stroke: "#000"
        }
      },
      {
        x: this.x + 58, y: this.y + 50, r: 16,
        style: {
          fill: `url(#nation-${this.target.value2}-16)`, strokeWidth: 1, stroke: "#000"
        }
      }
    ]
  }

  get windArrowLayout(): PathLayout | false {
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

  get markerSubLayout(): TextArrayLayout | false {
    if (!this.target.isMarker) { return false }
    const target = this.target as Marker
    if (!target.subText) { return false }

    const x = this.x + 40
    const y = [this.y + 22, this.y + 64, this.y + 75]
    return { style: { fill: "#222" }, value: target.subText, x: x, y: y, size: 11.5 }
  }

  get featureLayout(): CounterLayout | boolean {
    if (!this.target.isFeature) { return false }
    const target = this.target as Feature
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
    } else if (target.cover) {
      size = 14
      value = `cover ${target.cover}`
    } else if (target.coverSides) {
      const cs = target.coverSides
      value = `cover ${cs[0]}-${cs[1]}-${cs[2]}`
      size = 10.5
    }
    const style = { fill: counterRed }
    const tStyle = { fill: "white" }
    if (["foxhole", "smoke", "bunker"].includes(target.type)) {
      style.fill = "#BBB"
      tStyle.fill = "black"
    }

    return {
      path: path, style: style, value: value, tStyle: tStyle, x: x+40, y: y+70, size: size
    }
  }

  get statusLayout(): StatusLayout | boolean {
    if (this.target.isMarker) { return false }
    const showAllCounters = this.onMap ? this.map?.showAllCounters : this.showAllCounters
    if (this.target.isBroken || this.target.isWreck || showAllCounters) { return false }
    const loc = new Coordinate(this.x + 40, this.y + 46)
    let size = 20
    const path = this.circlePath(loc.yDelta(-6), 22)
    const style = { fill: markerYellow, stroke: "black", strokeWidth: 2 }
    const fStyle = { fill: "black" }
    if (this.target.isPinned || this.target.immobilized || this.target.turretJammed ||
       (this.target.jammed && this.target.hullArmor)) {
      style.fill = counterRed
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
      loc.yShift(-9)
    } else if (text.length === 3) {
      size = 12
      loc.yShift(-14.5)
    } else if (text.length === 4) {
      size = 9
      loc.yShift(-17)
    } else if (text.length > 4) {
      size = 8.5
      loc.yShift(-8)
      text = [text.slice(0,2).join(" "), text.slice(2,4).join(" "), text.slice(4,6).join(" ")]
    }
    return {
      value: text, x: loc.x, y: loc.y, size: size, path: path,
      style: style, fStyle: fStyle
    }
  }

  helpLayout(loc: Coordinate): HelpLayout {
    if (!this.map) { return { path: "", size: 0, style: {} } }
    const text = this.target.helpText
    const size = 22
    let width = 24.4
    text.forEach(t => {
      const n = t.length * 9.6 + 16
      if (n > width) { width = n }
    })
    const loc2 = loc.delta(width, text.length * size + size/2)
    if (loc2.x > this.map.xSize) {
      const diff = - (width + 182.5)
      loc.xShift(diff)
      loc2.xShift(diff)
    }
    if (loc2.y > this.map.ySize) {
      const diff = this.map.ySize - loc2.y
      loc.yShift(diff)
      loc2.yShift(diff)
    }
    const layout: HelpLayout = {
      path: [
        "M", loc.x, loc.y, "L", loc2.x, loc.y, "L", loc2.x, loc2.y,
        "L", loc.x, loc2.y, "L", loc.x, loc.y,
      ].join(" "), style: { fill: "black", stroke: "white", strokeWidth: 2 },
      size: size-6
    }
    const diff = size
    layout.texts = text.map((t, i) => {
      return { x: loc.x+8, y: loc.y + i*diff + size, value: t }
    })
    return layout
  }

  facingLine(dir: Direction): SVGPathArray {
    if (!this.map || !this.hex) { return [] }
    const hex = this.map.hexAt(this.hex)
    if (!hex) { return [] }
    const x = hex.xCorner(dir)
    const y = hex.yCorner(dir)
    const len = this.map.radius * (this.map.height + this.map.width)
    return [
      "M", x, y, "L", x - len * Math.cos((dir-0.5)/3 * Math.PI),
      y - len * Math.sin((dir-0.5)/3 * Math.PI)
    ]
  }

  get facingLayout(): facingLayout | false {
    if ((!this.target.turreted && !this.target.rotates) || this.target.isWreck) {
      return false
    }
    const dir = this.target.turreted ? this.target.turretFacing : this.target.facing
    const path = this.facingLine(dir).concat(this.facingLine(normalDir(dir - 1))).join(" ")
    return {
      path: path, dash: "4 4", style: {
        fill: "rgba(0,0,0,0)", strokeWidth: 4, stroke: "rgba(255,255,255,1)"
      },
      style2: {
        fill: "rgba(0,0,0,0)", strokeWidth: 4, stroke: "rgba(0,0,0,1)"
      }
    }
  }
}
