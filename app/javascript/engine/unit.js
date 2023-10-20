const unitStatus = {
  Normal: 0, Pinned: 1, Broken: 2, Activated: 3, Exhausted: 4, Tired: 5, Jammed: 6,
  Immobilized: 7, TurretJammed: 8, Wreck: 9
}

  // c: nation, t: type, n: name, i: icon, y: year
  // m: morale (2-6)
  // s: size (1-6)
  // f: firepower
  // r: range
  // v: movement
  // o: flags:
  //    l: leadership, a: assault, s: smoke, r: rapid fire, z: armored
  //    cw: crew skill, x: single shot, i: ignore terrain
  //    j: jam number, b: break number, bd: breakdown number
  //    t: targeted fire, m: minimum range, p: antitank, g: artillery, o: offboard artillery
  //    u: turret, k: tracked, w: wheeled, c: crewed, y: rotating mount
  //    ha: hull armor
  //    ta: turret armor
  //        f: front, s: side, r: rear
  //    sp: sponson mounted gun
  //        f: firepower, r: range
  // x: count

const Unit = class {
  constructor(data) {
    this.nation = data.c
    this.type = data.t
    this.name = data.n
    this.smallName = data.o?.sn
    this.icon = data.i
    this.year = data.y
    this.baseMorale = data.m
    this.size = data.s
    this.baseFirepower = data.f
    this.baseRange = data.r
    this.baseMovement = data.v

    this.leadership = data.o?.l
    this.assault = !!data.o?.a
    this.smokeCapable = !!data.o?.s
    this.gunHandling = data.o?.cw
    this.brokenMovement = data.o?.bv || 6

    this.rapidFire = !!data.o?.r
    this.singleFire = !!data.o?.x
    this.ignoreTerrain = !!data.o?.i

    this.targetedRange = data.o?.t
    this.minimumRange = data.o?.m
    this.fieldGun = !!data.o?.g
    this.antiTank = !!data.o?.p
    this.rotatingMount = !!data.o?.y
    this.crewed = !!data.o?.c
    this.offBoard = !!data.o?.o

    this.breakWeaponRoll = data.o?.b || data.o?.j
    this.breakDestroysWeapon = !!data.o?.b
    this.breakdownRoll = data.o?.bd

    this.turreted = !!data.o?.u
    this.tracked = !!data.o?.k
    this.wheeled = !!data.o?.w

    if (data.o?.ha !== undefined) {
      this.hullArmor = [data.o.ha.f, data.o.ha.s, data.o.ha.r]
      this.armored = true
    }
    if (data.o?.ta !== undefined) {
      this.turretArmor = [data.o.ta.f, data.o.ta.s, data.o.ta.r]
    }
    if (data.o?.sg !== undefined) {
      this.sponson = [data.o.sg.f, data.o.sg.r]
    }

    this.status = unitStatus.Normal
  }

  get isBroken() {
    return this.status === unitStatus.Broken
  }

  get isPinned() {
    return this.status === unitStatus.Pinned
  }

  get isWreck() {
    return this.status === unitStatus.Wreck
  }

  get noFire() {
    // Turret Jams and Immobile assault guns can fire at penalties in facing dir
    if (this.isBroken || this.isWreck) {
      return true
    }
    return false
  }

  get displayName() {
    let longName = this.smallName ? "-small" : ""
    longName = this.smallName && this.smallName > 1 ? "-smaller" : longName
    longName = this.smallName && this.smallName > 2 ? "-smallest" : longName
    if (this.isBroken || this.isWreck) {
      return { value: this.name, display: `${longName} unit-counter-name-broken` }
    } else {
      return { value: this.name, display: longName }
    }
  }

  get displayIcon() {
    if (this.isWreck) {
      return { value: "wreck", display: "" }
    } else {
      return { value: this.icon, display: "" }
    }
  }

  get currentMorale() {
    if (this.isBroken) {
      return this.baseMorale - 2
    } else if (this.isPinned) {
      return this.baseMorale - 1
    } else {
      return this.baseMorale
    }
  }

  get displayTopLeft() {
    if (this.baseMorale === undefined) {
      return { value: null }
    } else if (this.isBroken || this.isPinned) {
      return { value: this.currentMorale, display: " unit-counter-red-text" }
    } else {
      return { value: this.baseMorale, display: "" }
    }
  }

  get displayTopLeftSmall() {
    if (this.breakWeaponRoll && !this.noFire) {
      return { value: this.breakWeaponRoll, display: "" }
    } else {
      return { value: null }
    }
  }

  get displaySize() {
    if (this.size) {
      const shape = this.armored && !this.isWreck ? " unit-counter-circle unit-counter-outline"
                                                  : " unit-counter-box"
      return { value: this.size, display: shape }
    } else {
      return { value: null }
    }
  }

  get currentLeadership() {
    if (this.isBroken) {
      return 0
    } else {
      return this.leadership
    }
  }

  get currentGunHandling() {
    if (this.isBroken || this.isPinned) {
      return 0
    } else {
      return this.gunHandling
    }
  }

  get currentSmokeCapable() {
    return this.smokeCapable && !this.isBroken
  }

  get displayLeft() {
    if (this.currentLeadership) {
      return { value: this.currentLeadership, display: " unit-counter-hex"}
    } else {
      return { value: null }
    }
  }

  get displayLeftSmall() {
    if (this.breakdownRoll && !this.isWreck) {
      return { value: this.breakdownRoll, display: " unit-counter-yellow" }
    } else if (this.currentGunHandling) {
      return { value: this.currentGunHandling, display: " unit-counter-outline"}
    } else {
      return { value: null }
    }
  }

  get displaySponson() {
    if (this.sponson && !this.isWreck) {
      const gun = this.sponson
      return { value: `${gun[0]}-${gun[1]}`, display: ` nation-${this.nation}` }
    } else {
      return { value: null }
    }
  }

  get displaySmoke() {
    if (this.currentSmokeCapable && !this.hullArmor) {
      return { value: "S", display: " unit-counter-box-small"}
    } else {
      return { value: null }
    }
  }

  get displayVehicleSmoke() {
    if (this.hullArmor && this.currentSmokeCapable) {
      return { value: "S", display: "" }
    } else {
      return { value: null }
    }
  }

  get displayTurretArmor() {
    if (this.turretArmor && !this.isWreck) {
      const armor = this.turretArmor
      return { value: `${armor[0]}-${armor[1]}-${armor[2]}`, display: "" }
    } else {
      return { value: null }
    }
  }

  get displayHullArmor() {
    if (this.hullArmor && !this.isWreck) {
      const armor = this.hullArmor
      const value = `${armor[0]}-${armor[1]}-${armor[2] > -1 ? armor[2] : "X"}`
      return { value: value, display: "" }
    } else {
      return { value: null }
    }
  }

  get currentFirepower() {
    // TODO: there's some nuance here depending on type and state; SW have different rules
    // depending on carrying unit state + opportunity fire, implement this later, also target
    if (this.noFire) {
      return 0
    } else if (this.isPinned) {
      return Math.floor(this.baseFirepower / 2)
    } else
      return { value: this.baseFirepower
    }
  }

  get displayFirepower() {
    const location = this.minimumRange ? " unit-counter-firepower-w-range" : " unit-counter-firepower"
    if (this.noFire || this.isPinned) {
      return {
        value: this.currentFirepower, display: `${location} unit-counter-box unit-counter-red-text`
      }
    } else {
      // Don't use currentFirepower because we only display the "base" values on
      // the counter except above
      const firepower = this.baseFirepower == 0 ? "-" : this.baseFirepower

      let shape = this.antiTank || this.fieldGun ? " unit-counter-circle" : " unit-counter-box"
      shape = this.offBoard ? " unit-counter-hex" : shape
      if (firepower > 9) {
        shape = `${shape}-small`
      }

      let color = this.assault || this.antiTank ? " unit-counter-outline" : ""
      color = this.fieldGun ? " unit-counter-white" : color
      color = this.ignoreTerrain ? " unit-counter-yellow" : color
      color = this.singleFire ? " unit-counter-black" : color
      color = this.singleFire && this.ignoreTerrain ? " unit-counter-red" : color

      return { value: firepower, display: `${location}${shape}${color}`}
    }
  }

  get currentRange() {
    if (this.noFire) {
      return 0
    } else {
      return this.baseRange
    }
  }

  get displayRange() {
    if (this.noFire) {
      return {
        value: this.currentRange,
        display: "unit-counter-range unit-counter-sec unit-counter-box unit-counter-red-text"
      }
    } else if (this.currentRange === 0) {
      return { value: "-", display: `unit-counter-range unit-counter-sec unit-counter-box` }
    } else {
      let location = "unit-counter-range unit-counter-sec "
      let shape = this.targetedRange ? " unit-counter-circle" : " unit-counter-box"
      if (this.currentRange > 9) {
        shape = `${shape}-small`
      }
      let range = this.currentRange
      if (this.minimumRange) {
        location = "unit-counter-range-range unit-counter-sec-range"
        shape = " unit-counter-range-circle"
        range = `${this.minimumRange}-${range}`
      }

      let color = this.targetedRange || this.rapidFire ? " unit-counter-outline" : ""
      color = this.type === "sw" && this.targetedRange ? " unit-counter-black" : color
      color = this.turreted || this.rotatingMount ? " unit-counter-white" : color

      return { value: range, display: `${location}${shape}${color}`}
    }
  }

  get currentMovement() {
    if (this.isBroken) {
      return this.brokenMovement
    } else if (this.isPinned || this.status === unitStatus.Immobilized ||
               this.isWreck) {
      return 0
    } else if (this.status === unitStatus.Tired) {
      return this.baseMovement - 2
    } else {
      return this.baseMovement
    }
  }

  get displayMovement() {
    const location = this.minimumRange ? " unit-counter-movement-w-range" : " unit-counter-movement"
    if (this.isBroken || this.isPinned ||
        this.status === unitStatus.Tired || this.status === unitStatus.Immobilized ||
        this.isWreck) {
      return {
        value: this.currentMovement, display: `${location} unit-counter-box unit-counter-red-text`
      }
    } else if (this.currentMovement === 0) {
      return { value: "-", display: `${location} unit-counter-box` }
    } else {
      let shape = this.wheeled || this.tracked || this.crewed ? " unit-counter-circle" : " unit-counter-box"
      shape = this.currentMovement < 0 ? " unit-counter-circle" : shape
      if (this.currentMovement > 9 || this.currentMovement < 0) {
        shape = `${shape}-small`
      }

      let color = this.crewed ? " unit-counter-black" : ""
      color = this.tracked ? " unit-counter-outline" : color
      color = this.wheeled ? " unit-counter-white" : color
      color = this.currentMovement < 0 ? " unit-counter-red-text" : color
      return { value: this.currentMovement, display: `${location}${shape}${color}`}
    }
  }

  get displayBadge() {
    if (this.isPinned) {
      return { value: "PIN", display: " unit-counter-status-red" }
    } else if (this.status === unitStatus.Activated) {
      return { value: "ACT", display: " unit-counter-status-yellow" }
    } else if (this.status === unitStatus.Exhausted) {
      return { value: "EXH", display: " unit-counter-status-yellow" }
    } else if (this.status === unitStatus.Tired) {
      return { value: "TRD", display: " unit-counter-status-yellow" }
    } else if (this.status === unitStatus.Immobilized) {
      return { value: "IMM", display: " unit-counter-status-red" }
    } else if (this.status === unitStatus.TurretJammed) {
      return { value: "TRT", display: " unit-counter-status-red" }
    } else {
      return { value: "", display: " transparent"}
    }
  }
}

export { Unit, unitStatus }
