import { Direction, FeatureTypeType, NumberBoolean, featureType } from "../utilities/commonTypes";

// ft: feature
// t: type, n: name, i: icon
// f: firepower
// r: range
// v: movement
// h: hindrance
// d: cover
// o: flags:
//    p: antitank, g: artillery, los: blocks LOS
//    da: cover facing
//        f: front, s: side, r: rear
//    q: sniper
// x: count

export type FeatureData = {
  id?: string;
  t: FeatureTypeType;
  n: string;
  i: string;
  f?: number | string;
  r?: number;
  v?: number | string;
  h?: number;
  d?: number;
  o?: {
    p?: NumberBoolean; g?: NumberBoolean; q?: NumberBoolean; los?: NumberBoolean;
    da?: {
      f: number; s: number; r: number;
    }
  }

  x?: number;
  ft: 1;
  mk?: 0;
}

export default class Feature {
  type: FeatureTypeType;
  nation = "none"
  name: string;
  icon: string;
  baseFirepower?: number | string;
  currentRange: number;
  currentMovement?: number | string;
  hindrance?: number;
  cover?: number;
  sniperRoll?: number;
  fieldGun: boolean;
  antiTank: boolean;
  blocksLos: boolean;
  coverSides?: [number, number, number];
  facing: Direction = 1;

  rawData: FeatureData;

  constructor(data: FeatureData) {
    this.type = data.t
    this.name = data.n
    this.icon = data.i
    this.baseFirepower = data.f
    this.currentRange = data.r ?? 0
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

    this.rawData = data
  }

  clone(): Feature {
    return new Feature(this.rawData)
  }

  turreted = false
  isWreck = false
  isBroken = false
  isPinned = false
  isExhausted = false
  isTired = false;
  isActivated = false
  jammed = false
  turretJammed = false
  immobilized = false
  turretFacing: Direction = 1
  hullArmor = false
  turretArmor = false
  sponson = false
  size = 0
  smallName = 0
  baseMorale = 0
  currentMorale = 0
  currentFirepower = 0
  minimumRange = 0
  breakWeaponRoll = 0
  breakDestroysWeapon = false
  breakdownRoll = 0
  repairRoll = 0
  currentGunHandling = 0
  currentLeadership = 0
  currentSmokeCapable = false
  armored = false
  topOpen = false
  isTracked = false
  isWheeled = false
  crewed = false;
  offBoard = false
  singleFire = false
  assault = false
  ignoreTerrain = false
  targetedRange = false
  rapidFire = false
  noFire = false
  rotatingMount = false;
  fullIcon = false
  isHull = false
  selected = false
  hideOverlayRotation = false

  select() {
    this.selected = !this.selected
  }

  get isMarker(): boolean { return false }

  get isFeature(): boolean { return true }

  get rotates(): boolean {
    return [featureType.Bunker].includes(this.type)
  }

  get helpText(): string[] {
    const text = [this.name]
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
    if (this.sniperRoll) {
      text.push(`trigger roll ${this.sniperRoll}`)
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

