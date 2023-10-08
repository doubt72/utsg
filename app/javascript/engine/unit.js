const unitStatus = {
  Normal: 0, Pinned: 1, Broken: 2, Activated: 3, Exhausted: 4
}

const Unit = class {
  constructor(data) {
    this.nation = data.c
    this.type = data.t
    this.name = data.n
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
    this.brokenMovement = data.o?.bv || 6
    this.targetedRange = data.o?.t
    this.minimumRange = data.o?.m
    this.antiTank = data.o?.p

    this.status = unitStatus.Normal
  }

  get displayName() {
    if (this.status === unitStatus.Broken) {
      return { value: this.name, display: " unit-name-broken" }
    } else {
      return { value: this.name, display: "" }
    }
  }

  get currentMorale() {
    if (this.status === unitStatus.Broken) {
      return this.baseMorale - 2
    } else if (this.status === unitStatus.Pinned) {
      return this.baseMorale - 1
    } else {
      return this.baseMorale
    }
  }

  get displayMorale() {
    if (this.baseMorale === undefined) {
      return { value: null }
    } else if (this.status === unitStatus.Broken || this.status === unitStatus.Pinned) {
      return { value: this.currentMorale, display: " unit-disp-circle unit-disp-red" }
    } else {
      return { value: this.baseMorale, display: "" }
    }
  }

  get displaySize() {
    console.log(`${this.type} : ${this.size}`)
    if (this.size) {
      return { value: this.size, display: "" }
    } else {
      return { value: "-", display: "" }
    }
  }

  get currentLeadership() {
    if (this.status === unitStatus.Broken) {
      return 0
    } else {
      return this.leadership
    }
  }

  get currentGunHandling() {
    if (this.status === unitStatus.Broken || this.status === unitStatus.Pinned) {
      return 0
    } else {
      return this.gunHandling
    }
  }

  get currentSmokeCapable() {
    return this.smokeCapable && this.status !== unitStatus.Broken
  }

  get displaySpecialLeft() {
    if (this.currentLeadership) {
      return { value: this.currentLeadership, display: " unit-special-leadership unit-disp-circle"}
    } else if (this.currentGunHandling) {
      return { value: this.currentGunHandling, display: " unit-special-left-modifier unit-disp-small-circle unit-disp-black"}
    } if (this.breakWeaponRoll) {
      return { value: this.breakWeaponRoll, display: " unit-special-breakdown unit-disp-small-circle unit-disp-red"}
    } else {
      return { value: null }
    }
  }

  get displaySpecialRight() {
    if (this.smokeCapable) {
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
    if (this.status == unitStatus.Broken) {
      return 0
    } else if (this.status == unitStatus.Pinned) {
      return Math.floor(this.baseFirepower / 2)
    } else
      return { value: this.baseFirepower
    }
  }

  get displayFirepower() {
    // Don't use currentFirepower because we only display the "base" values on the counter
    let smallClass = this.baseFirepower > 9 ? " unit-disp-small" : ""
    if (this.status == unitStatus.Broken) {
      return { value: 0, display: "unit-range unit-disp unit-disp-circle unit-disp-red" }
    } else if (this.status == unitStatus.Pinned) {
      return { value: Math.floor(this.baseFirepower / 2), display: " unit-disp-circle unit-disp-red" }
    } else if (this.assualt) {
      const itClass = this.ignoreTerrain ? " unit-disp-white" : ""
      const sfClass = this.singleFire ? " unit-disp-black" : ""
      return { value: this.baseFirepower, display: ` unit-disp-box${smallClass}${itClass}${sfClass}`}
    } else if (this.antiTank) {
      smallClass = this.baseFirepower > 9 ? " unit-disp-more-small" : ""
      const sfClass = this.singleFire ? " unit-disp-black" : ""
      return { value: this.baseFirepower, display: ` unit-disp-circle${smallClass}${sfClass}` }
    } else {
      return { value: this.baseFirepower, display: `${smallClass}` }
    }
  }

  get currentRange() {
    if (this.status === unitStatus.Broken) {
      return 0
    } else {
      return this.baseRange
    }
  }

  get displayRange() {
    if (this.status === unitStatus.Broken) {
      return { value: this.currentRange, display: "unit-range unit-disp unit-disp-circle unit-disp-red" }
    } else if (this.targetedRange) {
      if (this.minimumRange) {
        return {
          value: `${this.minimumRange}-${this.currentRange}`,
          display: "unit-range-dbl unit-disp-dbl unit-disp-oval"
        }
      } else {
        const smallClass = this.currentRange > 9 ? " unit-disp-more-small" : ""
        return {
          value: this.currentRange,
          display: `unit-range unit-disp unit-disp-circle${smallClass}`
        }
      }
    } else {
      const rapidClass = this.rapidFire ? " unit-disp-box" : ""
      const smallClass = (this.currentRange > 9 && this.rapidFire) ? " unit-disp-small" : ""
      return { value: this.currentRange, display: `unit-range unit-disp${rapidClass}${smallClass}` }
    }
  }

  get currentMovement() {
    if (this.status === unitStatus.Broken) {
      return this.brokenMovement
    } else if (this.status === unitStatus.Pinned) {
      return 0
    } else if (this.status === unitStatus.Tired) {
      return this.baseMovement - 2
    } else {
      return this.baseMovement
    }
  }

  get displayMovement() {
    if (this.status === unitStatus.Broken || this.status === unitStatus.Pinned ||
        this.status === unitStatus.Tired) {
      return { value: this.currentMovement, display: " unit-movement unit-disp-circle unit-disp-red" }
    } else if (this.currentMovement < 0) {
      return {
        value: this.currentMovement,
        display: " unit-movement-small unit-disp-small-circle unit-disp-red unit-disp-very-small"
      }
    } else if (this.currentMovement === 0) {
      return { value: "-", display: " unit-movement" }
    } else {
      return { value: this.currentMovement, display: " unit-movement" }
    }
  }

  get displayBadge() {
    if (this.status === unitStatus.Pinned) {
      return { value: "pinned", display: " unit-status-red" }
    } else if (this.status === unitStatus.Activated) {
      return { value: "activated", display: " unit-status-yellow" }
    } else if (this.status === unitStatus.Exhausted) {
      return { value: "exhausted", display: " unit-status-yellow" }
    } else if (this.status === unitStatus.Tired) {
      return { value: "tired", display: " unit-status-yellow" }
    } else {
      return { value: "", display: " transparent"}
    }
  }
}

export { Unit, unitStatus }
