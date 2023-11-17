import { counterRed, markerYellow } from "../utilities/graphics"

const markerType = {
  TrackedHull: 0, WheeledHull: 1,
  Tired: 2, Pinned: 3, Activated: 4, Exhausted: 5,
  Jammed: 6, TurretJammed: 7, Immobilized: 8,
  Wind: 9, Precipitation: 10, Initiative: 11,
}
const windType = { Calm: 0, Breeze: 1, Moderate: 2, Strong: 3 }
const precipitationType = { Clear: 0, Fog: 1, Rain: 2, Snow: 3, Sand: 4, Dust: 5 }

const Marker = class {
  constructor(data) {
    this.type = data.type
    this.nationalIcon = data.i
    this.subType = data.subtype
    this.value = data.v
    this.nation = data.nation || "none"
    this.facing = data.facing || 1
    this.rotates = data.rotates || false
  }

  get isMarker() {
    return true
  }

  get isFeature() {
    return false
  }

  get isHull() {
    return [markerType.TrackedHull, markerType.WheeledHull].includes(this.type)
  }

  get isMinor() {
    return [markerType.Activated, markerType.Exhausted, markerType.Tired].includes(this.type)
  }

  get hideOverlayRotation() {
    return !this.isHull
  }

  red = counterRed
  yellow = markerYellow

  get textColor() {
    if (this.type === markerType.Tired || this.type === markerType.Activated ||
        this.type === markerType.Exhausted) { return "black" }
    if (this.type === markerType.Wind) {
      if (this.subType === windType.Calm) { return "#black" }
      return "white"
    }
    if (this.type === markerType.Precipitation) {
      if (this.subType === precipitationType.Rain || this.subType === precipitationType.Fog) {
        return "white"
      }
      return "black"
    }
    return "white"
  }

  get color() {
    if (this.type === markerType.Tired || this.type === markerType.Activated ||
        this.type === markerType.Exhausted) { return this.yellow }
    if (this.type === markerType.Wind) {
      if (this.subType === windType.Calm) { return "#DDF" }
      if (this.subType === windType.Breeze) { return "#AAE" }
      if (this.subType === windType.Moderate) { return "#77B" }
      if (this.subType === windType.Strong) { return "#448" }
    }
    if (this.type === markerType.Precipitation) {
      if (this.subType === precipitationType.Clear) { return "#DDF" }
      if (this.subType === precipitationType.Fog) { return "#777" }
      if (this.subType === precipitationType.Rain) { return "#44D" }
      if (this.subType === precipitationType.Snow) { return "#EEE" }
      if (this.subType === precipitationType.Sand) { return "#DD8" }
      if (this.subType === precipitationType.Dust) { return "#DB9" }
    }
    return this.red
  }

  get displayText() {
    if (this.type === markerType.Tired) { return ["tired"] }
    if (this.type === markerType.Pinned) { return ["pinned"] }
    if (this.type === markerType.Activated) { return ["activated"] }
    if (this.type === markerType.Exhausted) { return ["exhausted"] }
    if (this.type === markerType.Jammed) { return ["weapon", "broken"] }
    if (this.type === markerType.TurretJammed) { return ["turret", "jammed"] }
    if (this.type === markerType.Immobilized) { return ["immobilized"] }
    if (this.type === markerType.Wind) {
      if (this.subType === windType.Calm) { return ["calm"] }
      if (this.subType === windType.Breeze) { return ["breeze"] }
      if (this.subType === windType.Moderate) { return ["moderate"] }
      if (this.subType === windType.Strong) { return ["strong"] }
    }
    if (this.type === markerType.Precipitation) {
      if (this.subType === precipitationType.Clear) { return ["clear"] }
      if (this.subType === precipitationType.Fog) { return ["fog"] }
      if (this.subType === precipitationType.Rain) { return ["rain"] }
      if (this.subType === precipitationType.Snow) { return ["snow"] }
      if (this.subType === precipitationType.Sand) { return ["sand"] }
      if (this.subType === precipitationType.Dust) { return ["dust"] }
    }
    return []
  }

  get subText() {
    if (this.type === markerType.Precipitation) {
      if (this.subType === precipitationType.Clear) { return ["10% fe", "", ""] }
      if (this.subType === precipitationType.Fog) { return ["30% fe", "", ""] }
      if (this.subType === precipitationType.Sand) { return ["30% fe", "", ""] }
      if (this.subType === precipitationType.Dust) { return ["", "+10% fs", ""] }
      const fe = this.subType === precipitationType.Rain ? "60% fe" : "40% fe"
      if (!this.value) { return [fe, "", ""] }
      return [fe, `${this.value}% chance`, ""]
    }
    if (this.type === markerType.Wind) {
      const text = []
      if (this.value === 1) {
        text.push("variable")
      } else {
        text.push("")
      }
      if (this.subType === windType.Calm) {
        text.push("")
        text.push("20% sd")
      } else if (this.subType === windType.Breeze) {
        text.push("10% fs")
        text.push("40% sd")
      } else if (this.subType === windType.Moderate) {
        text.push("20% fs")
        text.push("60% sd")
      } else if (this.subType === windType.Strong) {
        text.push("40% fs")
        text.push("90% sd")
      }
      return text
    }
    return false
  }

  get icon() {
    if (this.type === markerType.WheeledHull) { return "wheeled-hull" }
    if (this.type === markerType.TrackedHull) { return "tracked-hull" }
    if (this.type === markerType.Initiative) { return this.nationalIcon || this.nation }
    return false
  }

  get fullIcon() {
    return true
  }
}

export { Marker, markerType, windType, precipitationType }