import { Direction, FeatureType, NumberBoolean, featureType } from "../utilities/commonTypes";
import { featureHelpText } from "./support/help";

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
//    q: sniper, ai: impassible, vi: impassible to vehicles
// x: count

export type FeatureData = {
  id?: string;
  t: FeatureType;
  n: string;
  i: string;
  f?: number | string;
  r?: number;
  v?: number | string;
  h?: number;
  d?: number;
  o?: {
    p?: NumberBoolean; g?: NumberBoolean; q?: NumberBoolean; los?: NumberBoolean;
    vi?: NumberBoolean; ai?: NumberBoolean;
    da?: {
      f: number; s: number; r: number;
    }
  }

  x?: number;
  ft: 1;
  mk?: 0;
}

export default class Feature {
  id: string;

  type: FeatureType;
  nation = "none"
  playerNation = "none"
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
  impassable: boolean;
  impassableToVehicles: boolean;
  coverSides?: [number, number, number];
  facing: Direction = 1;

  rawData: FeatureData;
  
  ghost?: boolean;

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
    this.impassable = !!data.o?.ai
    this.impassableToVehicles = !!data.o?.vi

    if (data.o?.da !== undefined) {
      this.coverSides = [data.o.da.f, data.o.da.s, data.o.da.r]
    }

    this.facing = 1

    this.rawData = data

    this.id = ""
  }

  clone(): Feature {
    return new Feature(this.rawData)
  }

  selected = false

  select() {
    this.selected = !this.selected
  }

  get isMarker(): boolean { return false }

  get isFeature(): boolean { return true }

  get rotates(): boolean {
    return [featureType.Bunker].includes(this.type)
  }

  get helpText(): string[] {
    return featureHelpText(this)
  }
}

