import {
  BorderType, BuildingShape, BuildingStyle, Coordinate, Direction, Elevation, ExtendedDirection,
  RoadCenterType, RoadType, StreamType, TerrainType, roadType, terrainType
} from "../utilities/commonTypes"
import {
  hexLos, hexLosAlongEdgeHindrance, hexLosAlongEdgeLos, hexLosCounterLos,
  hexLosEdgeHindrance, hexLosEdgeLos, hexLosHindrance
} from "../utilities/hexLos";
import Map from "./Map"
import Terrain from "./Terrain"
import { baseHexCoords } from "../utilities/graphics";
import { coordinateToLable, normalDir } from "../utilities/utilities";

export type HexData = {
  t?: TerrainType;         // terrain
  d?: ExtendedDirection;   //   direction (if terrain is directional)
  r?: {                    // road
    d: Direction[];        //   direction/endpoints
    t?: RoadType;          //   type
    c?: RoadCenterType;    //   center offset
    r?: Direction;         //   rotate (*60)
  };
  rr?: {                   // railroad
    d: Direction[][];      //   directions/endpoints
  };
  s?: {                    // stream/river
    d: Direction[];        //   direction/endpoints
    t?: StreamType;        //   type
  };
  h?: Elevation;           // elevation
  // Only need to do one side, and which side doesn't matter for most things,
  // but matters for cliffs and rendering elevation (i.e., put on higher
  // elevation edge)
  b?: BorderType;          // border
  be?: Direction[];        //   border edges
  st?: {                   // building
    s?: BuildingStyle;     //   style
    sh: BuildingShape;     //   shape
  };
  offmap?: boolean         // true if used for offmap displays
}

export default class Hex {
  map: Map;
  coord: Coordinate;
  elevation: Elevation;

  baseTerrain: TerrainType;
  direction: ExtendedDirection;

  road: boolean;
  roadType?: RoadType;
  roadDirections?: Direction[];
  roadCenter?: RoadCenterType;
  roadRotation?: Direction;

  railroad: boolean;
  railroadDirections?: Direction[][];

  river: boolean;
  riverType?: StreamType;
  riverDirections?: Direction[];

  border?: BorderType;
  borderEdges?: Direction[];

  building: boolean;
  buildingStyle?: BuildingStyle;
  buildingShape?: BuildingShape;

  offmap: boolean;

  constructor(coord: Coordinate, data: HexData, map: Map) {
    this.map = map
    this.coord = coord
    this.baseTerrain = data.t ?? 'o'
    this.direction = data.d ?? 1
    this.road = !!data.r
    if (this.road) {
      this.roadType = data.r?.t ?? roadType.Dirt
      this.roadDirections = data.r?.d
      this.roadCenter = data.r?.c
      this.roadRotation = data.r?.r
    }
    this.railroad = !!data.rr
    if (this.railroad) {
      this.railroadDirections = data.rr?.d
    }
    this.river = !!data.s
    if (this.river) {
      this.riverDirections = data.s?.d
      this.riverType = data.s?.t ?? "s"
    }
    this.elevation = data.h ?? 0
    this.border = data.b
    this.borderEdges = data.be
    this.building = !!data.st
    if (this.building) {
      this.buildingStyle = data.st?.s
      this.buildingShape = data.st?.sh
    }

    this.offmap = data.offmap ?? false
  }

  get terrain(): Terrain {
    return new Terrain(this)
  }

  get los(): boolean { return hexLos(this) }
  edgeLos(dir: Direction): boolean { return hexLosEdgeLos(this, dir) }
  alongEdgeLos(dir: Direction, initial: boolean = false, final: boolean = false): boolean {
    return hexLosAlongEdgeLos(this, dir, initial, final)
  }
  get counterLos(): { los: boolean, hindrance: number } { return hexLosCounterLos(this) }

  get hindrance(): number { return hexLosHindrance(this) }
  edgeHindrance(dir: Direction): number { return hexLosEdgeHindrance(this, dir) }
  alongEdgeHindrance(dir: Direction, initial: boolean = false): number {
    return hexLosAlongEdgeHindrance(this, dir, initial)
  }

  get night() {
    return this.map.night
  }

  // Base hex side, measuring flat side, and other common measurements
  get narrow(): number { return this.map.narrow }
  get radius(): number { return this.map.radius }
  get xOffset(): number { return this.map.xOffset(this.coord.x, this.coord.y) }
  get yOffset(): number { return this.map.yOffset(this.coord.y) }

  // Corners and edges on demand (with offsets) for doing continous curves
  xCorner(i: ExtendedDirection, inset: number = 0): number {
    return this.xOffset - (this.radius - inset) * Math.cos((i-0.5)/3 * Math.PI)
  }
  yCorner(i: ExtendedDirection, inset: number = 0): number {
    return this.yOffset - (this.radius - inset) * Math.sin((i-0.5)/3 * Math.PI)
  }
  xEdge(i: Direction, inset: number = 0): number {
    return this.xOffset - (this.narrow/2 - inset) * Math.cos((i-1)/3 * Math.PI)
  }
  yEdge(i: Direction, inset: number = 0): number {
    return this.yOffset - (this.narrow/2 - inset) * Math.sin((i-1)/3 * Math.PI)
  }

  // When matching up hexes with continuous edges, use this to calculate how
  // far the open terrain crosses from the corner of the hex
  xCornerOffset(i: ExtendedDirection, offset: number, dir: -1 | 1, inset: number = 0): number {
    const x = this.xCorner(i, inset)
    return x - offset * Math.cos((i - 0.5 + 2*dir)/3 * Math.PI)
  }
  yCornerOffset(i: ExtendedDirection, offset: number, dir: -1 | 1, inset: number = 0): number {
    const y = this.yCorner(i, inset)
    return y - offset * Math.sin((i - 0.5 + 2*dir)/3 * Math.PI)
  }

  // When calculating connected vs. open hexes, offboard counts as any elevation or terrain
  get elevationEdges(): "all" | "none" | boolean[] {
    let all = true
    let none = true
    const edges = this.map.hexNeighbors(this.coord).map((h, i) => {
      if (!h) { return true } // doesn't affect all or none -- but include edges if partial
      const check = (this.border !== undefined &&
                     this.borderEdges?.includes(i+1 as Direction)) ||
                    (h.elevation >= this.elevation && h.elevation > 0) ||
                    (h.elevation <= this.elevation && h.elevation < 0)
      if (check) { none = false } else { all = false }
      return check
    })
    if (all) { return "all" }
    if (none) { return "none" }
    return edges
  }

  get hexCoords(): string {
    return baseHexCoords(this.map, this.xOffset, this.yOffset)
  }

  directionSelectionCoords(vertex: Direction): [string, [number, number]] {
    const x1 = (this.xCorner(vertex) + this.xCorner(normalDir(vertex - 1)))/2
    const y1 = (this.yCorner(vertex) + this.yCorner(normalDir(vertex - 1)))/2
    const x2 = (this.xCorner(vertex) + this.xOffset)/2
    const y2 = (this.yCorner(vertex) + this.yOffset)/2
    const x3 = (this.xCorner(normalDir(vertex - 1)) + this.xOffset)/2
    const y3 = (this.yCorner(normalDir(vertex - 1)) + this.yOffset)/2
    const xC = (x1 + x2 + x3)/3
    const yC = (y1 + y2 + y3)/3
    return [`M ${x1} ${y1} L ${x2} ${y2} L ${x3}, ${y3} Z`, [xC, yC]]
  }

  get terrainEdges(): "all" | "none" | boolean[] {
    let all = true
    let none = true
    const edges = this.map.hexNeighbors(this.coord).map(h => {
      let check = !h || h.baseTerrain === this.baseTerrain
      if ((this.baseTerrain === terrainType.Water || this.baseTerrain === terrainType.Shallow) &&
          (h?.baseTerrain === terrainType.Water || h?.baseTerrain === terrainType.Shallow)) {
        check = true
      }
      if (check) { none = false } else { all = false }
      return check
    })
    if (all) { return "all" }
    if (none) { return "none" }
    return edges
  }

  // "Solid" terrain (i.e., surrounded), no need for curves
  get backgroundTerrain(): boolean {
    return this.terrainEdges === "all"
  }

  get labelX(): number {
    return this.xOffset
  }

  get labelY(): number {
    return this.yOffset - this.radius + 21
  }

  get label(): string {
    if (!this.map.showCoords) { return "" }
    return coordinateToLable(this.coord)
  }

  // When generating the continuous paths, we want to be able to start anywhere
  // with a flush edge, and commonly check next/last sides, so a generic check
  // to keep things in bounds
  checkSide(hexSides: boolean[], i: number): boolean {
    return hexSides[(i+6)%6]
  }
}
