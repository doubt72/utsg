import { counterRed, markerYellow } from "../utilities/graphics"
import { weatherType, windType } from "./map"

const markerType = {
  TrackedHull: 0, WheeledHull: 1,
  Tired: 2, Pinned: 3, Activated: 4, Exhausted: 5,
  Jammed: 6, TurretJammed: 7, Immobilized: 8,
  Wind: 9, Weather: 10, Initiative: 11,
}

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
    if (this.type === markerType.Weather) {
      if (this.subType === weatherType.Rain || this.subType === weatherType.Fog) {
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
    if (this.type === markerType.Weather) {
      if (this.subType === weatherType.Clear) { return "#DDF" }
      if (this.subType === weatherType.Fog) { return "#777" }
      if (this.subType === weatherType.Rain) { return "#44D" }
      if (this.subType === weatherType.Snow) { return "#DFDFDF" }
      if (this.subType === weatherType.Sand) { return "#DD8" }
      if (this.subType === weatherType.Dust) { return "#DB9" }
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
    if (this.type === markerType.Weather) {
      if (this.subType === weatherType.Clear) { return ["clear"] }
      if (this.subType === weatherType.Fog) { return ["fog"] }
      if (this.subType === weatherType.Rain) { return ["rain"] }
      if (this.subType === weatherType.Snow) { return ["snow"] }
      if (this.subType === weatherType.Sand) { return ["sand"] }
      if (this.subType === weatherType.Dust) { return ["dust"] }
    }
    return []
  }

  get subText() {
    if (this.type === markerType.Weather) {
      if (this.subType === weatherType.Clear) { return ["10% fe", "", ""] }
      if (this.subType === weatherType.Fog) { return ["30% fe", "", ""] }
      if (this.subType === weatherType.Sand) { return ["30% fe", "", ""] }
      if (this.subType === weatherType.Dust) { return ["", "+10% fs", ""] }
      const fe = this.subType === weatherType.Rain ? "60% fe" : "40% fe"
      if (!this.value) { return [fe, "", ""] }
      return [fe, `${this.value}0% chance`, ""]
    }
    if (this.type === markerType.Wind) {
      const text = []
      if (this.value) {
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

  get helpText() {
    const text = []
    if (this.type === markerType.Wind) {
      if (this.subType === windType.Calm) {
        text.push("wind: calm")
      }
      if (this.subType === windType.Breeze) {
        text.push("wind: breeze")
      }
      if (this.subType === windType.Moderate) {
        text.push("wind: moderate")
      }
      if (this.subType === windType.Strong) {
        text.push("wind: strong")
      }
      text.push(`- direction ${this.facing}`)
    } else if (this.type === markerType.Weather) {
      if (this.subType === weatherType.Clear) {
        text.push("clear")
      }
      if (this.subType === weatherType.Fog) {
        text.push("fog")
      }
      if (this.subType === weatherType.Rain) {
        text.push("rain")
      }
      if (this.subType === weatherType.Snow) {
        text.push("snow")
      }
      if (this.subType === weatherType.Sand) {
        text.push("sand")
      }
      if (this.subType === weatherType.Dust) {
        text.push("dust")
      }
    }
    const subText = this.subText
    const variable = []
    if (subText) {
      subText.forEach(t => {
        if (t === "") { return }
        if (t === "variable") {
          variable.push("weather variable")
          variable.push("- 10% chance of strength change")
          variable.push("- 20% chance of direction change")
        } else {
          const parts = t.split(" ")
          const d = {
            fs: "chance of fires spreading",
            fe: "chance of fires being extinguished",
            sd: "chance of smoke dispersing",
            chance: "chance of precipitation",
          }[parts[1]]
          text.push(["-", parts[0], d].join(" "))
        }
      })
    }
    return text.concat(variable)
  }
}

export { Marker, markerType }