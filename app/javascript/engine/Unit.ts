import {
  Direction, GunHandlingRange, LeadershipRange, MoraleRange, MovementType,
  NumberBoolean, SizeRange, SponsonType, UnitStatus, UnitType, movementType, sponsonType, unitStatus,
  unitType
} from "../utilities/commonTypes";
import { unitHelpText } from "./support/help";

// id: ID
// c: nation, t: type, n: name, i: icon, y: year
// m: morale (2-6)
// s: size (1-6)
// f: firepower
// r: range
// v: movement
// o: flags:
//    l: leadership, a: assault, s: smoke, r: rapid fire, z: armored, e: area fire,
//    cw: crew skill, x: single shot, i: ignore terrain
//    j: jam number, b: break number, bd: breakdown number
//    t: targeted fire, m: minimum range, p: antitank, g: artillery, o: offboard artillery
//    u: turret, k: tracked, w: wheeled, c: crewed, y: rotating mount,
//    uu: vehicle rotating mount, bw: gun mounted backwards,
//    v: elite(1)/green(-1) crew
//    ha: hull armor
//    ta: turret armor
//        f: front, s: side, r: rear, t: top (if zero)
//    sg: sponson mounted gun
//        f: firepower, r: range, t: type=p/g/ft
//    sn: small names, bv: broken movement, f: fix number, eng: engineering,
//    tow: size truck needed for towing, tr: transport, trg: can tow, amp: amphibious
// x: count

// TODO: Maybe more types for some of these
export type UnitData = {
  id?: string;
  c: string; t: UnitType; n: string; i: string; y: number;
  m?: MoraleRange; s?: SizeRange;
  f: number; r: number; v: number;
  o: {
    l?: LeadershipRange; a?: NumberBoolean; s?: NumberBoolean; r?: NumberBoolean;
    e?: NumberBoolean;
    z?: NumberBoolean; cw?: GunHandlingRange; x?: NumberBoolean; i?: NumberBoolean;
    j?: number; b?: number; bd?: number; uu?: NumberBoolean; bw?: NumberBoolean;
    t?: NumberBoolean; m?: number; p?: NumberBoolean; g?: NumberBoolean;
    o?: NumberBoolean; u?: NumberBoolean; k?: NumberBoolean; w?: NumberBoolean;
    c?: NumberBoolean; y?: NumberBoolean; v?: number,
    ha?: { f: number; s: number; r: number; t?: -1}
    ta?: { f: number; s: number; r: number; t?: -1}
    sg?: { f: number; r: number; t?: SponsonType }
    sn?: number; bv?: number; f?: number; tow?: SizeRange; tr?: number;
    amp?: NumberBoolean; eng?: NumberBoolean; trg?: NumberBoolean;
  }
  x?: number;

  ft?: 0;
  mk?: 0;
}

export default class Unit {
  id: string;

  nation: string;
  playerNation: string;
  type: UnitType;
  name: string;
  icon: string;
  year: number;
  baseMorale: MoraleRange;
  size: SizeRange;
  towSize: SizeRange | undefined;
  canTow: boolean;
  transport: number;
  baseFirepower: number;
  baseRange: number;
  baseMovement: number;

  leadership: LeadershipRange;
  assault: boolean;
  engineer: boolean;
  smokeCapable: boolean;
  gunHandling: GunHandlingRange;
  brokenMovement: number;

  rapidFire: boolean;
  singleFire: boolean;
  ignoreTerrain: boolean;

  targetedRange: boolean;
  minimumRange?: number;
  fieldGun: boolean;
  areaFire: boolean;
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
  rotatingVehicleMount: boolean;
  backwardsMount: boolean;
  movementType: MovementType;
  amphibious: boolean;
  hullArmor?: [number, number, number];
  turretArmor?: [number, number, number];
  armored: boolean = false;
  topOpen: boolean = false;

  sponson?: { firepower: number, range: number, type: SponsonType };

  status: UnitStatus;
  tired: boolean;
  jammed: boolean;
  weaponBroken: boolean;
  turretJammed: boolean;
  immobilized: boolean;
  facing: Direction;
  turretFacing: Direction;
  selected: boolean;
  targetSelected: boolean;
  dropSelected: boolean;
  loaderSelected: boolean;
  loadedSelected: boolean;
  lastSelected: boolean;

  smallName: number;

  rawData: UnitData;
  
  ghost?: boolean;
  
  parent?: Unit;
  children: Unit[];

  constructor(data: UnitData) {
    this.nation = data.c
    this.playerNation = data.c
    this.type = data.t
    this.name = data.n
    this.smallName = data.o?.sn ?? 0
    this.icon = data.i
    this.year = data.y
    this.baseMorale = data.m ?? 0
    this.size = data.s ?? 1
    this.towSize = data.o?.tow
    this.canTow = !!data.o?.trg
    this.transport = data.o?.tr ?? 0
    this.baseFirepower = data.f
    this.baseRange = data.r
    this.baseMovement = data.v

    this.leadership = data.o?.l ?? 0
    this.assault = !!data.o?.a
    this.engineer = !!data.o?.eng
    this.smokeCapable = !!data.o?.s
    this.gunHandling = data.o?.cw ?? 0
    this.brokenMovement = data.o?.bv || 4

    this.rapidFire = !!data.o?.r
    this.singleFire = !!data.o?.x
    this.ignoreTerrain = !!data.o?.i

    this.targetedRange = !!data.o?.t
    this.minimumRange = data.o?.m
    this.fieldGun = !!data.o?.g
    this.areaFire = !!data.o?.e
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
    this.rotatingVehicleMount = !!data.o?.uu
    this.backwardsMount = !!data.o?.bw
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
    this.amphibious = !!data.o?.amp

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
      this.sponson = { firepower: data.o.sg.f, range: data.o.sg.r, type: data.o.sg.t ?? sponsonType.Gun }      
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
    this.targetSelected = false
    this.dropSelected = false
    this.loaderSelected = false
    this.loadedSelected = false
    this.lastSelected = false

    this.rawData = data

    this.children = []

    this.id = data.id ?? ""
  }

  clone(): Unit {
    return new Unit(this.rawData)
  }

  // fullIcon = false
  // isHull = false
  // sniperRoll = 0
  // hideOverlayRotation = false

  select() {
    this.selected = !this.selected
  }

  targetSelect() {
    this.targetSelected = !this.targetSelected
  }

  dropSelect() {
    this.dropSelected = !this.dropSelected
  }

  loaderSelect() {
    this.loaderSelected = !this.loaderSelected
  }

  loadedSelect() {
    this.loadedSelected = !this.loadedSelected
  }

  lastSelect() {
    this.lastSelected = !this.lastSelected
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
    return [
      unitType.SupportWeapon, unitType.Leader, unitType.Squad, unitType.Team,
    ].includes(this.type)
  }

  get canHandle(): boolean {
    return [
      unitType.Squad, unitType.Team,
    ].includes(this.type)
  }

  get canCarrySupport(): boolean {
    return [
      unitType.Leader, unitType.Squad, unitType.Team,
    ].includes(this.type)
  }

  get rotates(): boolean {
    return ![
      unitType.SupportWeapon, unitType.Leader, unitType.Squad, unitType.Team,
      unitType.Cavalry, unitType.Other,
    ].includes(this.type)
  }

  get uncrewedSW(): boolean {
    if (this.type !== "sw") { return false }
    if (this.crewed) { return false }
    return true
  }

  canTowUnit(unit: Unit): boolean {
    if (!unit.crewed) { return false }
    if (!this.canTow) { return false }
    if (this.size < (unit.towSize ?? 0)) { return false }
    for (let i = 0; i < this.children.length; i++) {
      if (this.children[i].crewed) { return false }
    }
    return true
  }

  canTransportUnit(unit: Unit): boolean {
    if (!this.transport) { return false }
    if (this.transport === 1 && unit.type !== unitType.Leader) { return false }
    if (this.transport === 2 && ![unitType.Team, unitType.Leader].includes(unit.type)) {
      return false
    }
    if (![unitType.Squad, unitType.Team, unitType.Leader].includes(unit.type)) { return false }
    if (unit.type === unitType.Leader) {
      for (let i = 0; i < this.children.length; i++) {
        if (this.children[i].type === unitType.Leader) { return false }
      }
    }
    if ([unitType.Team, unitType.Squad].includes(unit.type)) {
      for (let i = 0; i < this.children.length; i++) {
        if ([unitType.Team, unitType.Squad].includes(this.children[i].type)) { return false }
      }
    }
    return true
  }

  canCarry(unit: Unit): boolean {
    if (![unitStatus.Normal, unitStatus.Tired].includes(unit.status) && this.status) { return false }
    if (this.type === unitType.Leader && unit.uncrewedSW && unit.baseMovement < 0) { return false }
    return this.canTransportUnit(unit) || this.canTowUnit(unit) || (this.children.length < 1 &&
      ((this.canCarrySupport && unit.uncrewedSW) || (this.canHandle && unit.crewed)))
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
    // depending on carrying unit state + reaction fire, implement this later, also target
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

  get helpText(): string[] {
    return unitHelpText(this)
  }
}
