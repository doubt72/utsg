import { Coordinate, Player } from "../utilities/commonTypes";
import Marker from "./Marker";
import Unit from "./Unit";
import Feature from "./Feature";
import Map from "./Map";

export default class Counter {
  onMap: boolean;
  absolute: boolean = true;
  hex?: Coordinate;
  base?: Coordinate;
  target: Unit | Marker | Feature;
  map?: Map;
  stackingIndex: number;
  unitIndex: number;

  reinforcement?: { player: Player, turn: number, index: number }
  
  parent?: Counter;
  children: Counter[];
  hideShadow: boolean = false;

  constructor(
    coord: Coordinate | undefined, target: Unit | Marker | Feature,
    map?: Map, absolute: boolean = false
  ) {
    this.onMap = !!map && !!coord
    if (absolute) {
      this.absolute = absolute
      this.hex = new Coordinate(0, 0)
      this.base = coord
    } else {
      this.hex = coord
      // Conditions are redundant, but type checker gets confused otherwise
      if (this.onMap && !!map && !!coord) {
        this.base = new Coordinate(
          map.xOffset(coord.x, coord.y) - 40, map.yOffset(coord.y) - 40
        )
      } else {
        this.base = new Coordinate(3, 1)
      }
    }
    this.target = target
    this.map = map
    this.stackingIndex = 0
    this.unitIndex = 0

    this.children = []
  }

  showAllCounters = false;
  showDisabled = false;

  get isUnit(): boolean {
    return !this.target.isFeature && !this.target.isMarker
  }

  get stackOffset(): number { return this.onMap ? 5 : 3 }
  get x(): number { return (this.base?.x ?? 0) + this.stackingIndex * this.stackOffset }
  get y(): number { return (this.base?.y ?? 0) - this.stackingIndex * this.stackOffset }
  
  get rotation(): { a: number, x: number, y: number} | false {
    if (!this.onMap || !this.target.rotates) {
      return false
    }
    let facing = this.target.facing
    if (this.target.turreted && !this.target.isWreck) { facing = this.target.turretFacing }
    return { a: facing*60 - 150, x: this.x + 40, y: this.y + 40 }
  }
}
