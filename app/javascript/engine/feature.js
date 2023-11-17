// ft: feature

// t: type, n: name, i: icon
// f: firepower
// r: range
// v: movement
// h: hindrance
// d: cover
// o: flags:
//    z: armored, p: antitank, g: artillery, los: blocks LOS
//    ca: cover facing
//        f: front, s: side, r: rear
//    q: sniper
// x: count

const Feature = class {
  constructor(data) {
    this.nation = "none"
    this.type = data.t
    this.name = data.n
    this.icon = data.i
    this.baseFirepower = data.f
    this.currentRange = data.r
    this.currentMovement = data.v
    this.hindrance = data.h
    this.cover = data.d
    this.sniperRoll = data.o?.q

    this.fieldGun = !!data.o?.g
    this.antiTank = !!data.o?.p
    this.blocksLos = !!data.o?.los

    if (data.o?.da !== undefined) {
      this.coverSides = [data.o.da.f, data.o.da.s, data.o.da.r]
    }

    this.facing = 1
  }

  get isMarker() {
    return false
  }

  get isFeature() {
    return true
  }

  get rotates() {
    return ["bunker"].includes(this.type)
  }

  get noFire() {
    // Turret Jams and Immobile assault guns can fire at penalties in facing dir
    if (this.isBroken || this.isWreck || this.jammed) {
      return true
    }
    return false
  }

  get helpText() {
    let text = [this.name]
    if (this.hindrance) {
      text.push(`hindrance ${this.hindrance}`)
    }
    if (this.blocksLos) {
      text.push(`blocks LOS`)
    }
    if (this.cover) {
      text.push(`cover ${this.cover}`)
    }
    if (this.coverSides) {
      text.push("cover:")
      text.push(`- front ${this.coverSides[0]} / side ${this.coverSides[1]} / rear ${this.coverSides[2]}`)
    }
    if (this.baseFirepower === "½") {
      text.push("halves firepower")
    } else if (this.baseFirepower) {
      text.push(`firepower ${this.baseFirepower}`)
    }
    if (this.antiTank) {
      text.push("- anti-armor capable")
      text.push("- half firepower vs. soft targets")
    }
    if (this.fieldGun) {
      text.push("- anti-armor capable")
      text.push("- half firepower vs. armor")
    }
    if (this.currentMovement === "A") {
      text.push("uses all movement")
    }
    return text
  }
}

export { Feature }
