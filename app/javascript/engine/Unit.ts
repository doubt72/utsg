import {
  Direction, GunHandlingRange, LeadershipRange, MoraleRange, MovementTypeType,
  NumberBoolean,
  SizeRange, UnitStatusType, UnitTypeType, movementType, unitStatus
} from "../utilities/commonTypes";

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
//    v: elite(1)/green(-1) crew
//    ha: hull armor
//    ta: turret armor
//        f: front, s: side, r: rear, t: top (if zero)
//    sg: sponson mounted gun
//        f: firepower, r: range, t: type=g/ft
//    sn: small names, bv: broken movement, f: fix number,
//    tow: size truck needed for towing,
// x: count

// TODO: Maybe more types for some of these
export type UnitData = {
  id?: string;
  c: string; t: UnitTypeType; n: string; i: string; y: number;
  m?: MoraleRange; s?: SizeRange;
  f: number; r: number; v: number;
  o: {
    l?: LeadershipRange; a?: NumberBoolean; s?: NumberBoolean; r?: NumberBoolean;
    z?: NumberBoolean; cw?: GunHandlingRange; x?: NumberBoolean; i?: NumberBoolean;
    j?: number; b?: number; bd?: number;
    t?: NumberBoolean; m?: number; p?: NumberBoolean; g?: NumberBoolean;
    o?: NumberBoolean; u?: NumberBoolean; k?: NumberBoolean; w?: NumberBoolean;
    c?: NumberBoolean; y?: NumberBoolean; v?: number,
    ha?: { f: number; s: number; r: number; t?: -1}
    ta?: { f: number; s: number; r: number; t?: -1}
    sg?: { f: number; r: number; t?: string }
    sn?: number; bv?: number; f?: number; tow?: SizeRange; ifv?: NumberBoolean;
  }
  x?: number;

  ft?: 0;
  mk?: 0;
}

export default class Unit {
  nation: string;
  type: UnitTypeType;
  name: string;
  icon: string;
  year: number;
  baseMorale: MoraleRange;
  size: SizeRange;
  tow: SizeRange | undefined;
  protectSquad: boolean;
  baseFirepower: number;
  baseRange: number;
  baseMovement: number;

  leadership: LeadershipRange;
  assault: boolean;
  smokeCapable: boolean;
  gunHandling: GunHandlingRange;
  brokenMovement: number;

  rapidFire: boolean;
  singleFire: boolean;
  ignoreTerrain: boolean;

  targetedRange: boolean;
  minimumRange?: number;
  fieldGun: boolean;
  antiTank: boolean;
  rotatingMount: boolean;
  crewed: boolean;
  offBoard: boolean;

  rawBreakWeaponRoll?: number;
  breakDestroysWeapon: boolean;
  breakdownRoll?: number;
  repairRoll?: number;

  eliteCrew: number;
  turreted: boolean;
  movementType: MovementTypeType;
  hullArmor?: [number, number, number];
  turretArmor?: [number, number, number];
  armored: boolean = false;
  topOpen: boolean = false;

  sponson?: [number, number] | [number, number, string];

  status: UnitStatusType;
  tired: boolean;
  jammed: boolean;
  weaponBroken: boolean;
  turretJammed: boolean;
  immobilized: boolean;
  facing: Direction;
  turretFacing: Direction;
  selected: boolean;

  smallName: number;

  rawData: UnitData;

  constructor(data: UnitData) {
    this.nation = data.c
    this.type = data.t
    this.name = data.n
    this.smallName = data.o?.sn ?? 0
    this.icon = data.i
    this.year = data.y
    this.baseMorale = data.m ?? 0
    this.size = data.s ?? 1
    this.tow = data.o?.tow
    this.protectSquad = !!data.o?.ifv
    this.baseFirepower = data.f
    this.baseRange = data.r
    this.baseMovement = data.v

    this.leadership = data.o?.l ?? 0
    this.assault = !!data.o?.a
    this.smokeCapable = !!data.o?.s
    this.gunHandling = data.o?.cw ?? 0
    this.brokenMovement = data.o?.bv || 6

    this.rapidFire = !!data.o?.r
    this.singleFire = !!data.o?.x
    this.ignoreTerrain = !!data.o?.i

    this.targetedRange = !!data.o?.t
    this.minimumRange = data.o?.m
    this.fieldGun = !!data.o?.g
    this.antiTank = !!data.o?.p
    this.rotatingMount = !!data.o?.y
    this.crewed = !!data.o?.c
    this.offBoard = !!data.o?.o

    this.rawBreakWeaponRoll = data.o?.b ?? data.o?.j
    this.breakDestroysWeapon = !!data.o?.b
    this.breakdownRoll = data.o?.bd
    this.repairRoll = data.o?.f

    this.eliteCrew = data.o?.v ?? 0
    this.turreted = !!data.o?.u
    this.movementType = movementType.Foot
    if (data.o?.k) {
      this.movementType = movementType.Tracked
    }
    if (data.o?.w) {
      this.movementType = movementType.Wheeled
    }
    if (this.crewed) {
      this.movementType = movementType.Gun
    }

    if (data.o?.ha !== undefined) {
      this.hullArmor = [data.o.ha.f, data.o.ha.s, data.o.ha.r]
      this.armored = true
      this.topOpen = (data.o.ha.t !== undefined || data.o.ha.r < 0)
    }
    if (data.o?.ta !== undefined) {
      this.turretArmor = [data.o.ta.f, data.o.ta.s, data.o.ta.r]
      this.topOpen = this.topOpen || (data.o.ta.t !== undefined || data.o.ta.r < 0)
    }
    if (data.o?.sg !== undefined) {
      this.sponson = data.o.sg.t ? [data.o.sg.f, data.o.sg.r, data.o.sg.t] :
        [data.o.sg.f, data.o.sg.r]      
    }

    this.status = unitStatus.Normal
    this.tired = false
    this.jammed = false
    this.weaponBroken = false
    this.turretJammed = false
    this.immobilized = false

    this.facing = 1
    this.turretFacing = 1
    this.selected = false

    this.rawData = data
  }

  clone(): Unit {
    return new Unit(this.rawData)
  }

  fullIcon = false
  isHull = false
  sniperRoll = 0
  hideOverlayRotation = false

  select() {
    this.selected = !this.selected
  }

  get hindrance(): number { return 0 }

  get blocksLos(): boolean { return false }

  get isMarker(): boolean {
    return false
  }

  get isFeature(): boolean {
    return false
  }

  get canGroupFire(): boolean {
    return ["sw", "ldr", "sqd", "tm"].includes(this.type)
  }

  get rotates(): boolean {
    return !["sw", "ldr", "sqd", "tm"].includes(this.type)
  }

  get isActivated(): boolean {
    return this.status === unitStatus.Activated
  }

  get isExhausted(): boolean {
    return this.status === unitStatus.Exhausted
  }

  get isTired(): boolean {
    return this.status === unitStatus.Tired
  }

  get isPinned(): boolean {
    return this.status === unitStatus.Pinned
  }

  get isBroken(): boolean {
    return this.status === unitStatus.Broken
  }

  get isWreck(): boolean {
    return this.status === unitStatus.Wreck
  }

  get isTracked(): boolean {
    return this.movementType === movementType.Tracked
  }

  get isWheeled(): boolean {
    return this.movementType === movementType.Wheeled
  }

  get noFire(): boolean {
    // Turret Jams and Immobile assault guns can fire at penalties in facing dir
    if (this.isBroken || this.isWreck || this.jammed || this.weaponBroken) {
      return true
    }
    return false
  }

  get breakWeaponRoll(): number | undefined {
    if (!this.rawBreakWeaponRoll) { return undefined }
    if (this.jammed) {
      return this.rawBreakWeaponRoll > 4 ? this.rawBreakWeaponRoll : 4
    } else {
      return this.rawBreakWeaponRoll
    }
  }

  get currentMorale(): MoraleRange {
    if (this.isBroken) {
      return this.baseMorale - 2 as MoraleRange
    } else if (this.isPinned) {
      return this.baseMorale - 1 as MoraleRange
    } else {
      return this.baseMorale
    }
  }

  get currentLeadership(): LeadershipRange {
    if (this.isBroken) {
      return 0
    } else {
      return this.leadership
    }
  }

  get currentGunHandling(): GunHandlingRange {
    if (this.isBroken || this.isPinned) {
      return 0
    } else {
      return this.gunHandling
    }
  }

  get currentSmokeCapable(): boolean {
    return this.smokeCapable && !this.isBroken && !this.jammed
  }

  get currentFirepower(): number {
    // TODO: there's some nuance here depending on type and state; SW have different rules
    // depending on carrying unit state + opportunity fire, implement this later, also target
    if (this.noFire) {
      return 0
    } else if (this.isPinned) {
      return Math.floor(this.baseFirepower / 2)
    } else {
      return this.baseFirepower
    }
  }

  get currentRange(): number {
    if (this.noFire) {
      return 0
    } else {
      return this.baseRange
    }
  }

  get currentMovement(): number {
    if (this.isBroken) {
      return this.brokenMovement
    } else if (this.isPinned || this.immobilized || this.isWreck) {
      return 0
    } else if (this.isTired) {
      return this.baseMovement - 2
    } else {
      return this.baseMovement
    }
  }

  get typeName(): string[] {
    const names: { [index: string]: string[] } = {
      ac: ["armored car"], antittank: ["anti-tank rifle"], atgun: ["anit-tank gun"],
      crew: ["trained gun crew"], explosive: ["explosive"], flamethrower: ["flame thrower"],
      gun: ["field gun"], ht: ["armored infantry vehicle"],
      htat: ["armored infantry vehicle", "w/anti-tank gun"],
      htft: ["armored infantry vehicle", "w/flame thrower"],
      htgun: ["armored infantry vehicle", "w/mounted field gun"],
      htmtr: ["armored infantry vehicle", "w/mounted mortar"],
      leader: ["leader"], mg: ["machine gun"], mortar: ["mortar"], radio: ["radio"],
      rocket: ["anti-tank rocket"], spat: ["tank destroyer"], spft: ["flame-thrower tank"],
      spg: ["self-propelled gun"], spgmg: ["armored vehicle"], squad: ["infantry squad"],
      "tank-amp": ["amphibious tank"], tank: ["tank"], team: ["infantry team"],
    }
    if (this.icon === "mortar" && this.baseMovement > 0) { return ["crewed mortar"] }
    return names[this.icon]
  }

  get helpText(): string[] {
    let text = [this.name]
    text = text.concat(this.typeName)
    text.push("")
    text.push("[from name, clockwise]")
    if (this.size > 0) {
      text.push(`stacking/size ${this.size} (${this.armored ? "armored" : "soft"})`)
    }
    if (this.turretArmor) {
      text.push("turret armor:")
      text.push(`- front ${this.turretArmor[0]} / side ${this.turretArmor[1]} / rear ${this.turretArmor[2]}`)
    }
    if (this.hullArmor) {
      text.push("hull armor:")
      text.push(`- front ${this.hullArmor[0]} / side ${this.hullArmor[1]} / rear ${this.hullArmor[2]}`)
    }
    if (this.baseMovement > 0) {
      text.push(`movement ${this.currentMovement}`)
      if (this.isTracked) {
        text.push("- tracked movement")
      } else if (this.isWheeled) {
        text.push("- wheeled movement")
      } else if (this.crewed) {
        text.push("- man handled")
      } else if (this.isBroken) {
        text.push("- routing only")
      }
    } else {
      text.push(`movement modifier ${this.baseMovement}`)
    }
    text.push(`range ${this.currentRange}`)
    if (this.minimumRange) {
      text.push(`minimum range ${this.minimumRange}`)
    }
    if (this.targetedRange && !this.jammed) {
      text.push("- target roll required")
    }
    if (this.turreted && !this.jammed) {
      text.push("- turret mounted")
    }
    if (this.rotatingMount) {
      text.push("- rotating mount")
    }
    if (this.rapidFire && !this.jammed) {
      text.push("- rapid fire")
    }
    if ((this.minimumRange || this.type === "sw") && this.targetedRange) {
      text.push("- no crew targeting bonus")
    }
    text.push(`firepower ${this.currentFirepower}`)
    if (this.assault && !this.isBroken && !this.jammed) {
      text.push("- assault bonus")
    }
    if (this.offBoard && !this.jammed) {
      text.push("- offboard artillery")
    }
    if (this.antiTank && !this.jammed) {
      text.push("- anti-armor capable")
      text.push("- half firepower vs. soft targets")
    }
    if (this.fieldGun && !this.jammed) {
      text.push("- anti-armor capable")
      text.push("- half firepower vs. armor")
    }
    if (this.singleFire) {
      text.push("- firing expends weapon")
    }
    if (this.ignoreTerrain) {
      text.push("- ignores terrain")
    }
    if (this.currentSmokeCapable) {
      if (this.targetedRange) {
        text.push("- can fire smoke rounds")
      } else {
        text.push("can lay smoke")
      }
    }
    if (this.breakdownRoll && !this.immobilized) {
      text.push(`breakdown roll ${this.breakdownRoll}`)
    }
    if (this.gunHandling && !this.isBroken) {
      text.push(`gun operation bonus ${this.gunHandling}`)
    }
    if (this.currentLeadership) {
      text.push(`leadership ${this.currentLeadership}`)
    }
    if (this.breakWeaponRoll && !this.jammed) {
      text.push(`weapon breaks on ${this.breakWeaponRoll}`)
    }
    if (this.baseMorale) {
      text.push(`unit morale ${this.currentMorale}`)
    }
    if (this.sponson) {
      text.push("center / symbol bottom:")
      if (String(this.sponson[0]).slice(0, 1) === "F") {
        text.push("flamethrower mounted")
        text.push("- forward arc only")
        text.push(`- firepower ${this.sponson[0]}`)
        text.push(`- range ${this.sponson[1]}`)
        text.push("- ignores terrain")
      } else {
        text.push("sponson gun - forward arc only")
        text.push(`- firepower ${this.sponson[0]}`)
        text.push(`- range ${this.sponson[1]}`)
        text.push("- target roll required")
        text.push("- anti-armor capable")
        text.push("- half firepower vs. soft targets")
      }
    }
    return text
  }
}
