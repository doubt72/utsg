import Counter from "../engine/Counter";

// TODO: maybe do more sophisticated range types at some point?
export type Direction = 1 | 2 | 3 | 4 | 5 | 6
export type ExtendedDirection = Direction | 1.5 | 2.5 | 3.5 | 4.5 | 5.5 | 6.5
export type Player = 1 | 2;
export type NumberBoolean = 0 | 1;

export class Coordinate {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x
    this.y = y
  }

  onSegment(p: Coordinate, q: Coordinate): boolean
  { 
    const delta = 0.0000001 // deal with floating point precision issues
    if (this.x <= Math.max(p.x, q.x) + delta && this.x >= Math.min(p.x, q.x) - delta &&
        this.y <= Math.max(p.y, q.y) + delta && this.y >= Math.min(p.y, q.y) - delta) {
      return true
    }
    return false 
  }

  get tuple(): [number, number] {
    return [this.x, this.y]
  }

  xDelta(xv: number): Coordinate {
    return new Coordinate(this.x + xv, this.y)
  }

  yDelta(yv: number): Coordinate {
    return new Coordinate(this.x, this.y + yv)
  }

  delta(xv: number, yv: number): Coordinate {
    return new Coordinate(this.x + xv, this.y + yv)
  }

  xShift(xv: number) {
    this.x = this.x + xv
  }

  yShift(yv: number) {
    this.y = this.y + yv
  }
}

export type CounterSelectionTarget = {
  target:
    { type: "map", xy: Coordinate } |
    { type: "reinforcement", player: Player, turn: number, index: number };
  counter: Counter;
}

export type WindTypeType = 0 | 1 | 2 | 3
export const windType: { [index: string]: WindTypeType } = {
  Calm: 0, Breeze: 1, Moderate: 2, Strong: 3
}

export type WeatherTypeType = 0 | 1 | 2 | 3 | 4 | 5
export const weatherType: { [index: string]: WeatherTypeType } = {
  Dry: 0, Fog: 1, Rain: 2, Snow: 3, Sand: 4, Dust: 5
}

export type BaseTerrainTypeType = "d" | "m" | "g" | "u" | "s";
export const baseTerrainType: { [index: string]: BaseTerrainTypeType } = {
  Grass: "g", Urban: "u", Sand: "d", Mud: "m", Snow: "s"
}

export type TerrainTypeType = "o" | "f" | "b" | "j" | "p" | "s" | "m" | "w" | "g" | "r" | "d" | "t" | "x" | "y"
export const terrainType: { [index: string]: TerrainTypeType } = {
  Open: "o", Forest: "f", Brush: "b", Jungle: "j", Sand: "s", Marsh: "m", Water: "w",
  Grain: "g", Rough: "r", Orchard: "d", Soft: "t", Debris: "x", Shallow: "y", Palm: "p"
}

export type RoadTypeType = "t" | "d" | "p" | "a"
export const roadType: { [index: string]: RoadTypeType } = {
  Tarmac: "t", Dirt: "d", Path: "p", Airfield: "a"
}

export type RoadCenterType = "l" | "r"
export const roadCenter: { [index: string]: RoadCenterType } = {
  Left: "l", Right: "r"
}

export type StreamTypeType = "s" | "g" | "t"
export const streamType: { [index: string]: StreamTypeType } = {
  Stream: "s", Gully: "g", Trench: "t"
}

export type BorderTypeType = "w" | "f" | "c" | "b"
export const borderType: { [index: string]: BorderTypeType } = {
  Wall: "w", Fence: "f", Cliff: "c", Bocage: "b"
}

export type BuildingStyleType = "f" | "u"
export const buildingStyle: { [index: string]: BuildingStyleType } = {
  Farm: "f", Urban: "u"
}

export type BuildingShapeType = "c" | "t" | "h" | "x" | "l" | "s" | "m" | "l2" | "s2" | "m2" |
  "bs1" | "bs2" | "bs3" | "bs4" | "bm" | "bc1" | "bc2" | "bc3" | "bc4"
export const buildingShape: { [index: string]: BuildingShapeType } = {
  Silo: "c", Tank: "t", Hut: "h", Cross: "x", Lone: "l", Side: "s", Middle: "m",
  Lone2: "l2", Side2: "s2", Middle2: "m2", BigSide1: "bs1", BigSide2: "bs2", BigSide3: "bs3",
  BigSide4: "bs4", BigMiddle: "bm", BigCorner1: "bc1", BigCorner2: "bc2", BigCorner3: "bc3",
  BigCorner4: "bc4"
}

export type Elevation = -1 | 0 | 1 | 2 | 3 | 4 | 5

export type VictoryHexType = {
  x: number, y: number, player: 1 | 2
}

export type TerrainAttributesType = {
  move: number;
  hindrance: number;
  cover: number;
  los: boolean;
  vehicle: boolean;
  gun: boolean | string;
  name: string;
}

export type UnitStatusType = 0 | 1 | 2 | 3 | 4 | 5 | 6
export const unitStatus: { [index: string]: UnitStatusType } = {
  Normal: 0, Tired: 1, Pinned: 2, Broken: 3, Activated: 4, Exhausted: 5, Wreck: 6
}

export type MovementTypeType = 0 | 1 | 2 | 3
export const movementType: { [index: string]: MovementTypeType } = {
  Foot: 0, Tracked: 1, Wheeled: 2, Gun: 3
}

export type UnitTypeType = "ldr" | "sqd" | "tm" | "sw" | "gun" |
  "tank" | "spg" | "ht" | "ac" | "truck" | "cav"
export const unitType: { [index: string]: UnitTypeType} = {
  Leader: "ldr", Squad: "sqd", Team: "tm", SupportWeapon: "sw", Gun: "gun", Tank: "tank",
  SelfPropelledGun: "spg", HalfTrack: "ht", ArmoredCar: "ac", Truck: "truck", Cavalry: "cav"
}

export type MarkerTypeType = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15
export const markerType: { [index: string]: MarkerTypeType } = {
  TrackedHull: 0, WheeledHull: 1, Tired: 2, Pinned: 3, Activated: 4, Exhausted: 5,
  Jammed: 6, TurretJammed: 7, Immobilized: 8, Wind: 9, Weather: 10, Initiative: 11,
  Turn: 12, EliteCrew: 13, GreenCrew: 14, WeaponBroken: 15
}

export type FeatureTypeType = "bunker" | "pillbox" | "foxhole" |
  "smoke" | "fire" | "wire" | "mines" | "rubble" | "roadblock"
export const featureType: { [index: string]: FeatureTypeType } = {
  Bunker: "bunker", Smoke: "smoke", Fire: "fire", Wire: "wire", Mines: "mines",
  Foxhole: "foxhole", Rubble: "rubble", Roadblock: "roadblock",
}

// TODO: Might need to increase the range for modified values?
export type MoraleRange = 0 | 1 | 2 | 3 | 4 | 5 | 6
export type SizeRange = 1 | 2 | 3 | 4 | 5 | 6
export type LeadershipRange = 0 | 1 | 2
export type GunHandlingRange = 0 | 1 | 2

export type GameAction = {
  type: string, message?: string
}
