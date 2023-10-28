const unitStatus = {
  Normal: 0, Tired: 1, Pinned: 2, Broken: 3, Activated: 4, Exhausted: 5, Wreck: 6
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
    this.tired = false
    this.jammed = false
    this.turretJammed = false
    this.immobilized = false
    this.brokenDown = false

    this.facing = 1
    this.turretFacing = 1
  }

  get isMarker() {
    return false
  }

  get rotates() {
    return ["sw", "ldr", "sqd", "tm"].includes(this.type)
  }

  get isActivated() {
    return this.status === unitStatus.Activated
  }

  get isExhausted() {
    return this.status === unitStatus.Exhausted
  }

  get isTired() {
    return this.status === unitStatus.Tired
  }

  get isPinned() {
    return this.status === unitStatus.Pinned
  }

  get isBroken() {
    return this.status === unitStatus.Broken
  }

  get isWreck() {
    return this.status === unitStatus.Wreck
  }

  get noFire() {
    // Turret Jams and Immobile assault guns can fire at penalties in facing dir
    if (this.isBroken || this.isWreck || this.jammed) {
      return true
    }
    return false
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
    return this.smokeCapable && !this.isBroken && !this.jammed
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

  get currentRange() {
    if (this.noFire) {
      return 0
    } else {
      return this.baseRange
    }
  }

  get currentMovement() {
    if (this.isBroken) {
      return this.brokenMovement
    } else if (this.isPinned || this.immobilized || this.brokenDown || this.isWreck) {
      return 0
    } else if (this.isTired) {
      return this.baseMovement - 2
    } else {
      return this.baseMovement
    }
  }
}

export { Unit, unitStatus }
