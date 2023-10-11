const unitStatus = {
  Normal: 0, Pinned: 1, Broken: 2, Activated: 3, Exhausted: 4, Tired: 5, Jammed: 6,
  Immobilized: 7, TurretJammed: 8, Wreck: 9
}

const Unit = class {
  constructor(data) {
    this.nation = data.c
    this.type = data.t
    this.name = data.n
    this.icon = data.i
    this.year = data.y
    this.baseMorale = data.m
    this.size = data.s
    this.baseFirepower = data.f
    this.baseRange = data.r
    this.baseMovement = data.v

    this.leadership = data.o?.l
    this.gunHandling = data.o?.g
    this.assualt = !!data.o?.a
    this.rapidFire = !!data.o?.r
    this.smokeCapable = !!data.o?.s
    this.singleFire = !!data.o?.x
    this.ignoreTerrain = !!data.o?.i
    this.breakWeaponRoll = data.o?.b || data.o?.j
    this.breakDestroysWeapon = !!data.o?.b
    this.breakDriveRoll = data.o?.d
    this.brokenMovement = data.o?.bv || 6
    this.targetedRange = data.o?.t
    this.minimumRange = data.o?.m
    this.antiTank = !!data.o?.p
    this.crewed = !!data.o?.c
    this.rotatingMount = !!data.o?.z
    this.offBoard = !!data.o?.o
    this.turreted = !!data.o?.u
    this.tracked = !!data.o?.k
    this.wheeled = !!data.o?.w

    if (data.o?.ha !== undefined) {
      this.hullArmor = [data.o.ha.f, data.o.ha.s, data.o.ha.r]
    }
    if (data.o?.ta !== undefined) {
      this.turretArmor = [data.o.ta.f, data.o.ta.s, data.o.ta.r]
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
    if (this.isBroken || this.isWreck) {
      return { value: this.name, display: " unit-name-broken" }
    } else {
      return { value: this.name, display: "" }
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

  get displayMorale() {
    if (this.baseMorale === undefined) {
      return { value: null }
    } else if (this.isBroken || this.isPinned) {
      return { value: this.currentMorale, display: " unit-disp-red-text" }
    } else {
      return { value: this.baseMorale, display: "" }
    }
  }

  get displaySize() {
    if (this.size) {
      return { value: this.size, display: "" }
    } else {
      return { value: "-", display: "" }
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

  get displaySpecialLeft() {
    if (this.currentLeadership) {
      return { value: this.currentLeadership, display: " unit-special-left-leader unit-disp-hex"}
    } else if (this.currentGunHandling) {
      return { value: this.currentGunHandling, display: " unit-special-left-gun unit-disp-small-circle"}
    } if (this.breakWeaponRoll && !this.noFire) {
      const section = this.type === "veh" ? " unit-special-vehicle-bottom" : " unit-special-breakdown"
      return {
        value: this.breakWeaponRoll, display: `${section} unit-disp-small-circle unit-disp-red`
      }
    } else {
      return { value: null }
    }
  }

  get displaySpecialLeftVehicle() {
    if (this.breakDriveRoll && this.currentMovement > 0) {
      return {
        value: this.breakDriveRoll,
        display: " unit-special-vehicle-top unit-disp-small-circle unit-disp-red-white"
      }
    } else {
      return { value: null }
    }
  }

  get displaySpecialRight() {
    if (this.currentSmokeCapable) {
      if (this.type !== "sqd") {
        return { value: "*", display: " unit-special-right-gun"}
      } else {
        return { value: "*", display: " unit-special-right-modifier"}
      }
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
    // Don't use currentFirepower because we only display the "base" values on the counter
    let smallClass = this.baseFirepower > 9 ? " unit-disp-small" : ""
    if (this.noFire) {
      return { value: 0, display: "unit-range unit-disp unit-disp-red-text" }
    } else if (this.isPinned) {
      return { value: Math.floor(this.baseFirepower / 2), display: " unit-disp-red-text" }
    } else if (this.assualt) {
      let background = this.ignoreTerrain ? " unit-disp-white" : ""
      background = this.singleFire ? " unit-disp-black" : background
      background = this.singleFire && this.ignoreTerrain ? " unit-disp-white-black" : background
      return { value: this.baseFirepower, display: ` unit-disp-box${smallClass}${background}`}
    } else if (this.antiTank) {
      smallClass = this.baseFirepower > 9 ? " unit-disp-more-small" : ""
      const sfClass = this.singleFire ? " unit-disp-black" : ""
      return { value: this.baseFirepower, display: ` unit-disp-circle${smallClass}${sfClass}` }
    } else if (this.crewed && !this.type == "sw") {
      smallClass = this.baseFirepower > 9 ? " unit-disp-more-small" : ""
      return { value: this.baseFirepower, display: ` unit-disp-circle unit-disp-yellow${smallClass}` }
    } else if (this.offBoard) {
      smallClass = this.baseFirepower > 9 ? " unit-disp-hex-small" : ""
      return { value: this.baseFirepower, display: ` unit-disp-hex${smallClass}` }
    } else {
      return { value: this.baseFirepower, display: `${smallClass}` }
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
      return { value: this.currentRange, display: "unit-range unit-disp unit-disp-red-text" }
    } else if (this.targetedRange) {
      let background = this.type === "sw" ? " unit-disp-black" : ""
      if (this.minimumRange) {
        return {
          value: `${this.minimumRange}-${this.currentRange}`,
          display: `unit-range-dbl unit-disp-dbl unit-disp-oval${background}`
        }
      } else {
        const smallClass = this.currentRange > 9 ? " unit-disp-more-small" : ""
        background = this.turreted ? " unit-disp-white" : background
        background = this.rotatingMount ? " unit-disp-white-black" : background
        return {
          value: this.currentRange,
          display: `unit-range unit-disp unit-disp-circle${smallClass}${background}`
        }
      }
    } else if (this.currentRange === 0) {
      return { value: "-", display: `unit-range unit-disp` }
    } else {
      const background = this.turreted ? " unit-disp-white" : ""
      const rapidClass = this.rapidFire ? " unit-disp-box" : ""
      const smallClass = (this.currentRange > 9 && this.rapidFire) ? " unit-disp-more-small" : ""
      return {
        value: this.currentRange, display: `unit-range unit-disp${rapidClass}${smallClass}${background}`
      }
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
    if (this.isBroken || this.isPinned ||
        this.status === unitStatus.Tired || this.status === unitStatus.Immobilized ||
        this.isWreck) {
      return { value: this.currentMovement, display: " unit-movement unit-disp-red-text" }
    } else if (this.currentMovement < 0) {
      // TODO: remove these
      const color = this.type === "sw" ? " unit-disp-red" : " unit-disp-black"
      const circle = this.rotatingMount ? "unit-movement unit-disp-circle unit-disp-small" :
        "unit-movement-small unit-disp-small-circle unit-disp-very-small"
      return {
        value: this.currentMovement,
        display: ` ${circle}${color}`
      }
    } else if (this.crewed) {
      return { value: this.currentMovement, display: " unit-movement unit-disp-circle unit-disp-black" }
    } else if (this.tracked) {
      return { value: this.currentMovement, display: " unit-movement unit-disp-circle unit-disp-white" }
    } else if (this.wheeled) {
      const smallClass = (this.currentMovement > 9) ? " unit-disp-small" : ""
      return {
        value: this.currentMovement,
        display: ` unit-movement unit-disp-circle unit-disp-yellow${smallClass}`
      }
    } else if (this.currentMovement === 0) {
      return { value: "-", display: " unit-movement" }
    } else {
      return { value: this.currentMovement, display: " unit-movement" }
    }
  }

  get displayHullArmor() {
    if (this.hullArmor && !this.isWreck) {
      const armor = this.hullArmor
      return { value: `${armor[0]}-${armor[1]}-${armor[2]}`, display: " unit-disp-extremely-small" }
    } else {
      return { value: null }
    }
  }

  get displayTurretArmor() {
    if (this.turretArmor && !this.isWreck) {
      const armor = this.turretArmor
      return { value: `${armor[0]}-${armor[1]}-${armor[2]}`, display: " unit-disp-extremely-small" }
    } else {
      return { value: null }
    }
  }

  get displayBadge() {
    if (this.isPinned) {
      return { value: "pinned", display: " unit-status-red" }
    } else if (this.status === unitStatus.Activated) {
      return { value: "activated", display: " unit-status-yellow" }
    } else if (this.status === unitStatus.Exhausted) {
      return { value: "exhausted", display: " unit-status-yellow" }
    } else if (this.status === unitStatus.Tired) {
      return { value: "tired", display: " unit-status-yellow" }
    } else if (this.status === unitStatus.Immobilized) {
      return { value: "immobile", display: " unit-status-red" }
    } else if (this.status === unitStatus.TurretJammed) {
      return { value: "turret jam", display: " unit-status-red" }
    } else {
      return { value: "", display: " transparent"}
    }
  }
}

export { Unit, unitStatus }
