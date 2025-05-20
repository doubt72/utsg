import {
  BorderTypeType, BuildingShapeType, BuildingStyleType, Coordinate, Direction,
  Elevation, ExtendedDirection, RoadCenterType, RoadTypeType, StreamTypeType, TerrainTypeType,
  baseTerrainType, borderType, roadType, terrainType
} from "../utilities/commonTypes"
import {
  hexLos, hexLosAlongEdgeHindrance, hexLosAlongEdgeLos, hexLosCounterLos,
  hexLosEdgeHindrance, hexLosEdgeLos, hexLosHindrance
} from "../utilities/hexLos";
import Map from "./Map"
import Terrain from "./Terrain"
import { CircleLayout, PathLayout, SVGPathArray, SVGStyle, baseHexCoords } from "../utilities/graphics";
import { coordinateToLable, normalDir } from "../utilities/utilities";
import { hexBuildingBuildingDisplay } from "../utilities/hexBuilding";

type HelpTextLayout = {
  path: string, style: SVGStyle, size: number,
  texts: { x: number, y: number, v: string }[]
}

export type HexData = {
  t?: TerrainTypeType;     // terrain
  d?: ExtendedDirection;   //   direction (if terrain is directional)
  r?: {                    // road
    d: Direction[];        //   direction/endpoints
    t?: RoadTypeType;      //   type
    c?: RoadCenterType;    //   center offset
  }
  s?: {                    // stream/river
    d: Direction[];        //   direction/endpoints
    t?: StreamTypeType;    //   type
  }
  h?: Elevation;           // elevation
  // Only need to do one side, and which side doesn't matter for most things,
  // but matters for cliffs and rendering elevation (i.e., put on higher
  // elevation edge)
  b?: BorderTypeType;      // border
  be?: Direction[];        //   border edges
  st?: {                   // building
    s?: BuildingStyleType; //   style
    sh: BuildingShapeType; //   shape
  }
  offmap?: boolean         // true if used for offmap displays
}

export default class Hex {
  map: Map;
  coord: Coordinate;
  elevation: Elevation;

  baseTerrain: TerrainTypeType;
  direction: ExtendedDirection;

  road: boolean;
  roadType?: RoadTypeType;
  roadDirections?: Direction[];
  roadCenter?: RoadCenterType;

  river: boolean;
  riverType?: StreamTypeType;
  riverDirections?: Direction[];

  border?: BorderTypeType;
  borderEdges?: Direction[];

  building: boolean;
  buildingStyle?: BuildingStyleType;
  buildingShape?: BuildingShapeType;

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
    }
    this.river = !!data.s
    if (this.river) {
      this.riverDirections = data.s?.d
      this.riverType = data.s?.t
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

  get mapColor(): string {
    return this.map.baseTerrainColor
  }

  get elevationStyles(): { [index: number]: SVGStyle } {
    return {
      "-1": { fill: "#ACA" },
      0: { fill: this.mapColor },
      1: { fill: "#DA7" },
      2: { fill: "#B85" },
      3: { fill: "#963" },
      4: { fill: "#741" },
      5: { fill: "#620" },
    }
  }

  get night() {
    return this.map.night
  }

  // lightWater = "#59C"
  darkWater = "#46A"
  iceWater = "#DDE"

  terrainStyles = (): { [index: string]: SVGStyle } => {
    return {
      j: { fill: "rgba(47,191,47,0.33)" },
      w: { fill: this.map.baseTerrain === baseTerrainType.Snow ? this.iceWater : this.darkWater },
      // TODO: special shallow beach water?
    }
  }

  patternStyles = (): { [index: string]: SVGStyle } => {
    return {
      f: { fill: "url(#forest-pattern)" },
      b: { fill: "url(#brush-pattern)" },
      j: { fill: "url(#jungle-pattern)" },
      s: { fill: "url(#sand-pattern)" },
      r: { fill: "url(#rough-pattern)" },
      m: { fill: this.map.baseTerrain === baseTerrainType.Snow ? "url(#frozen-marsh-pattern)" :
        "url(#marsh-pattern)" },
      g: { fill: "url(#grain-pattern)" },
      t: { fill: "url(#soft-pattern)" },
    }
  }

  borderStyles: { [index: string]: SVGStyle } = {
    f: { stroke: "#963", strokeWidth: 3 },
    w: { stroke: "#BBB", strokeWidth: 8, strokeLinecap: "round" },
    b: { stroke: "#070", strokeWidth: 8, strokeLinecap: "round" },
    c: { stroke: "#320", strokeWidth: 8, strokeLinecap: "round" },
  }

  borderDecorationStyles: { [index: string]: SVGStyle } = {
    f: { stroke: "#963", strokeWidth: 8, strokeDasharray: [2, 11.1] },
    w: { stroke: "#888", strokeWidth: 8, strokeDasharray: [2, 2] },
    b: { stroke: "rgba(0,0,0,0)" },
    c: { stroke: "rgba(0,0,0,0)" },
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
      const check = (this.border === borderType.Cliff &&
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

  get terrainEdges(): "all" | "none" | boolean[] {
    let all = true
    let none = true
    const edges = this.map.hexNeighbors(this.coord).map(h => {
      const check = !h || h.baseTerrain === this.baseTerrain
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
  // get hexOffsetCoords(): string {
  //   return baseHexCoords(this.map, this.xOffset, this.yOffset + yOffset)
  // }

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
  
  edgeCoords(dir: Direction): string {
    return [
      "M", this.xCorner(normalDir(dir-1)), this.yCorner(normalDir(dir-1)),
      "L", this.xCorner(dir), this.yCorner(dir),
    ].join(" ")
  }

  // "Solid" terrain (i.e., surrounded), no need for curves
  get backgroundTerrain(): boolean {
    return this.terrainEdges === "all"
  }

  get background(): SVGStyle {
    if (this.backgroundTerrain && this.terrainStyles()[this.baseTerrain]) {
      return this.terrainStyles()[this.baseTerrain]
    }
    if (this.elevationEdges === "all") {
      return this.elevationStyles[this.elevation]
    } else {
      if (this.elevation > 0) {
        return this.elevationStyles[this.elevation ? this.elevation - 1 : 0]
      } else {
        return this.elevationStyles[0]
      }
    }
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

  // Draw the orchard hex, rotated by direction
  get orchardDisplay(): CircleLayout[] | false {
    if (this.baseTerrain !== terrainType.Orchard) { return false }
    const trees = []
    for (let x = 0; x < 3; x++) {
      for (let y = 0; y < 2; y++) {
        const dir = -this.direction - 0.5
        const mag = this.radius*0.5
        const x0 = this.xOffset + (x-1) * mag * Math.sin(dir/3 * Math.PI) +
          (y-0.5) * mag * Math.sin((dir/3 + 0.5) * Math.PI)
        const y0 = this.yOffset + (x-1) * mag * Math.cos(dir/3 * Math.PI) +
          (y-0.5) * mag * Math.cos((dir/3 + 0.5) * Math.PI)
        // trees.push({ x: x0, y: y0, r: this.radius/5, style: { fill: "#4A4" } })
        trees.push({ x: x0, y: y0, r: this.radius/5, style: { fill: "#070" } })
      }
    }
    return trees
  }

  get buildingDisplay(): PathLayout | false {
    return hexBuildingBuildingDisplay(this)
  }

  get terrainCircle(): CircleLayout | false {
    if (this.terrainEdges !== "none" || this.baseTerrain === "o") { return false }
    return {
      x: this.xOffset, y: this.yOffset, r: this.narrow/2 - 5,
      style: this.terrainStyles()[this.baseTerrain] || { fill: "rgba(0,0,0,0" }
    }
  }

  // Used for "isolated" terrain hexes (e.g., summits)
  hexRoundCoordsInset(inset: number): string {
    let path = [
      "M", this.xCornerOffset(6, inset, 1, inset),
      this.yCornerOffset(6, inset, 1, inset)
    ]
    for (let i = 1; i <= 6; i++) {
      path = path.concat([
        "L", this.xCornerOffset(i as Direction, inset, -1, inset),
        this.yCornerOffset(i as Direction, inset, -1, inset)
      ])
      path = path.concat([
        "A", inset*2, inset*2, 0, 0, 1,
        this.xCornerOffset(i as Direction, inset, 1, inset),
        this.yCornerOffset(i as Direction, inset, 1, inset)
      ])
    }
    return path.join(" ")
  }

  get elevationHex(): PathLayout | false {
    if (this.elevationEdges !== "none" || this.elevation < 1) { return false }
    return {
      path: this.hexRoundCoordsInset(5), style: this.elevationStyles[this.elevation]
    }
  }

  // When generating the continuous paths, we want to be able to start anywhere
  // with a flush edge, and commonly check next/last sides, so a generic check
  // to keep things in bounds
  checkSide(hexSides: boolean[], i: number): boolean {
    return hexSides[(i+6)%6]
  }

  // Used for both terrain and elevations; terrain has a deeper inset on open
  // sides to make it easier to pick out
  generatePaths(edges: boolean[], edgeOffset: number): string {
    let path: SVGPathArray = []
    for (let j = 0; j < 6; j++) {
      if (!edges[j]) {
        continue
      }
      if (this.checkSide(edges, j-1)) {
        path = ["M", this.xCorner(normalDir(j)), this.yCorner(normalDir(j))]
      } else {
        path = [
          "M", this.xCornerOffset(normalDir(j), edgeOffset, 1),
          this.yCornerOffset(normalDir(j), edgeOffset, 1)
        ]
      }
      for (let i = j; i < j + 6; i++) {
        if (this.checkSide(edges, i)) {
          if (this.checkSide(edges, i+1)) {
            path = path.concat([
              "L", this.xCorner(normalDir(i+1)), this.yCorner(normalDir(i+1))
            ])
          } else {
            path = path.concat([
              "L", this.xCornerOffset(normalDir(i+1), edgeOffset, -1),
              this.yCornerOffset(normalDir(i+1), edgeOffset, -1)
            ])
          }
        } else {
          if (this.checkSide(edges, i-1)) {
            path = path.concat(
              [
                "A", this.radius*2, this.radius*2, 0, 0, 0,
                this.xEdge(normalDir(i+1), edgeOffset*2),
                this.yEdge(normalDir(i+1), edgeOffset*2)
              ]
            )
          } else {
            path = path.concat(
              [
                "A", this.radius - edgeOffset*4, this.radius - edgeOffset*4, 0, 0, 1,
                this.xEdge(normalDir(i+1), edgeOffset*2),
                this.yEdge(normalDir(i+1), edgeOffset*2)
              ]
            )
          }
          if (this.checkSide(edges, i+1)) {
            path = path.concat(
              [
                "A", this.radius*2, this.radius*2, 0, 0, 0,
                this.xCornerOffset(normalDir(i+1), edgeOffset, 1),
                this.yCornerOffset(normalDir(i+1), edgeOffset, 1)
              ]
            )
          } else {
            path = path.concat(
              [
                "A", this.radius - edgeOffset*4, this.radius - edgeOffset*4, 0, 0, 1,
                this.xCorner(normalDir(i+1), edgeOffset*4),
                this.yCorner(normalDir(i+1), edgeOffset*4)
              ]
            )
          }
        }
      }
      break
    }
    return path.join(" ")
  }

  get terrainContinuous(): PathLayout | false {
    const edges = this.terrainEdges
    if (edges == "none" || edges === "all") { return false }
    return {
      path: this.generatePaths(edges, 4),
      style: this.terrainStyles()[this.baseTerrain] || { fill: "rgba(0,0,0,0" }
    }
  }

  get terrainPattern(): SVGStyle | false {
    if (!this.patternStyles()[this.baseTerrain]) { return false }
    return this.patternStyles()[this.baseTerrain]
  }

  get elevationContinuous(): PathLayout | false {
    const edges = this.elevationEdges
    if (edges === "none" || edges === "all") { return false }
    return {
      path: this.generatePaths(edges, 2), style: this.elevationStyles[this.elevation || 0]
    }
  }

  path(directions?: Direction[], center?: RoadCenterType): string {
    if (!directions) { return "" }
    if (directions.length === 2) {
      const d1 = directions[0]
      const d2 = directions[1]
      const x1 = this.xEdge(d1)
      const y1 = this.yEdge(d1)
      const x2 = this.xEdge(d2)
      const y2 = this.yEdge(d2)
      let xCenter = this.xOffset
      if (center === "l") {
        xCenter -= this.narrow / 4
      } else if (center === "r") {
        xCenter += this.narrow / 4
      }
      const c1x = (xCenter + x1)/2
      const c1y = (this.yOffset + y1)/2
      const c2x = (xCenter + x2)/2
      const c2y = (this.yOffset + y2)/2
      let path = ["M", x1, y1]
      // Center can be shifted left or right, used for doing vertical roads
      if (center) {
        path = path.concat(["L", xCenter, this.yOffset])
        path = path.concat(["L", x2, y2])
      } else {
        path = path.concat(["C", `${c1x},${c1y}`, `${c2x},${c2y}`, `${x2},${y2}`])
      }
      return path.join(" ")
    } else {
      let centerOff = 0
      if (center === "l") {
        centerOff = -this.narrow / 4
      } else if (center === "r") {
        centerOff = this.narrow / 4
      }
      const x1 = this.xOffset + centerOff
      const y1 = this.yOffset
      let path: SVGPathArray = []
      for (let i = 0; i < directions.length - 1; i++) {
        const d1 = directions[i]
        const d2 = directions[i+1]
        const x2 = this.xEdge(d1)
        const y2 = this.yEdge(d1)
        const x3 = this.xEdge(d2)
        const y3 = this.yEdge(d2)
        path = path.concat([
          "M", x2, y2, "L", x1, y1, "L", x3, y3
        ])
      }
      return path.join(" ")
    }
  }

  get riverPath(): string {
    return this.path(this.riverDirections)
  }

  get riverStyle(): SVGStyle {
    let color = this.map.baseTerrain === baseTerrainType.Snow ? this.iceWater : this.darkWater
    if (this.riverType === "g") {
      color = "#070"
    }
    return {
      fill: "rgba(0,0,0,0)",
      strokeWidth: 10,
      stroke: color,
      strokeDasharray: this.riverType === "g" ? [14, 14] : undefined,
      strokeLinejoin: "round",
    }
  }

  get roadPath(): string {
    return this.path(this.roadDirections, this.roadCenter)
  }

  get roadOutlineStyle(): SVGStyle {
    const width = this.roadType === "p" ? 10 : 28
    return {
      fill: "rgba(0,0,0,0)",
      strokeWidth: (["j", "f", "b"].includes(this.baseTerrain) || this.river) ? width : 0,
      stroke: this.elevationStyles[this.elevation || 0]["fill"],
      strokeLinejoin: "round",
    }
  }

  get bridgeStyle(): SVGStyle {
    return {
      fill: "rgba(0,0,0,0)",
      strokeWidth: 28,
      stroke: this.roadType === "t" ? "#BBB" : "#975",
    }
  }

  get roadEdgeStyle(): SVGStyle {
    return {
      fill: "rgba(0,0,0,0)",
      strokeWidth: this.roadType === "p" ? 0 : 16,
      stroke: this.roadType === "t" ? "#AAA" : "#FD7",
      strokeLinejoin: "round",
    }
  }

  get roadStyle(): SVGStyle {
    return {
      fill: "rgba(0,0,0,0)",
      strokeWidth: this.roadType === "p" ? 2 : 12,
      stroke: this.roadType === "t" ? "#DDD" : "#B85",
      strokeDasharray: this.roadType === "p" ? [5, 5] : undefined,
      strokeLinejoin: "round",
    }
  }

  get edgePath(): string | false {
    if (!this.border || !this.borderEdges) { return false }
    return this.borderEdges.map(d => {
      return [
        "M", this.xCorner(normalDir(d-1)), this.yCorner(normalDir(d-1)),
        "L", this.xCorner(d), this.yCorner(d)
      ].join(" ")
    }).join(" ")
  }

  get edgeCoreStyle(): SVGStyle | false {
    if (!this.border) { return false }
    return this.borderStyles[this.border]
  }

  get edgeDecorationStyle(): SVGStyle | false {
    if (!this.border) { return false }
    return this.borderDecorationStyles[this.border]
  }

  get victoryLayout(): CircleLayout | false {
    const victory = this.map.victoryAt(this.coord)
    if (!victory) { return false }
    const x = this.xCorner(5, 20)
    const y = this.yCorner(5, 20)
    return {
      x: x, y: y, r: 12, style: {
        fill: `url(#nation-${victory}-12)`, strokeWidth: 1, stroke: "#000"
      },
    }
  }

  get helpText(): string[] {
    const text = [this.terrain.name]
    if (this.elevation > 0) {
      text.push(`elevation ${this.elevation}`)
    }
    if (this.terrain.cover !== false) {
      text.push(`cover ${this.terrain.cover}`)
    }
    if (this.terrain.hindrance) {
      text.push(`hindrance ${this.terrain.hindrance}`)
    }
    if (this.terrain.los) {
      text.push("blocks line-of-sight")
    }
    if (this.terrain.move !== false) {
      text.push(`movement cost ${this.terrain.move}`)
      if (this.river && this.road) {
        if (["m", "s"].includes(this.map.baseTerrain)) {
          text.push(`- cost +2 if not following road`)
        } else {
          text.push(`- cost +1 if not following road`)
        }
      } else if (this.road && ["m", "s"].includes(this.map.baseTerrain)) {
        text.push(`- cost +1 if not following road`)
      }
      let rise = false
      this.map.hexNeighbors(this.coord).forEach(n => {
        if (n && n.elevation < this.elevation) {
          rise = true
        }
      })
      if (rise) {
        text.push(" cost +1 if moving from lower elevation")
      }
      if (!this.terrain.gun) {
        text.push("- crewed weapons cannot enter")
      } else if (this.terrain.gun === "back") {
        text.push("- crewed weapons can only back in")
      }
      if (!this.terrain.vehicle) {
        text.push("- vehicles cannot enter")
      }
    }
    if (this.road) {
      if (this.roadType === 'p') {
        text.push("path")
        text.push("- foot movement cost 1 if moving along path")
      } else if (this.roadType === 't') {
        if (this.river) {
          text.push("bridge")
        } else {
          text.push("paved road")
        }
        text.push("- movement bonus +1 if moving along road")
        text.push("- except wheeled movement cost 1/2")
        if (!this.terrain.gun || !this.terrain.vehicle) {
          text.push("- all units can move along road")
        }
      } else {
        if (this.river) {
          text.push("wooden bridge")
        } else {
          text.push("unpaved road")
        }
        text.push("- movement bonus +1 if moving along road")
        if (!["m", "s"].includes(this.map.baseTerrain)) {
          text.push("- except wheeled movement cost 1/2")
        }
        if (!this.terrain.gun || !this.terrain.vehicle) {
          text.push("- all units can move along road")
        }
      }
    }
    if (this.river && this.terrain.move) {
      text.push("stream")
      text.push("- movement cost +1 when leaving")
      if (this.road) {
        text.push("- unless following road")
      }
    }
    const borderText: { [index: string]: string[] } = {}
    for (let i = 1; i <= 6; i++) {
      const bd = this.terrain.borderText(i as Direction)
      if (bd) {
        borderText[bd.key] = bd.text
      }
    }
    this.map.hexNeighbors(this.coord).forEach((n, i) => {
      if (n) {
        const bd = n.terrain.borderText(normalDir(i + 1))
        if (bd) {
          borderText[bd.key] = bd.text
        }
      }
    })
    Object.keys(borderText).forEach(k => borderText[k].forEach(t => text.push(t)))
    return text
  }

  helpLayout(x: number, y: number): HelpTextLayout {
    const text = this.helpText
    const size = 22
    let width = 24.4
    text.forEach(t => {
      const n = t.length * 9.6 + 16
      if (n > width) { width = n }
    })
    let x1 = x
    let x2 = x + width
    let y1 = y
    let y2 = y + text.length * size + size/2
    if (x2 > this.map.xSize) {
      const diff = - (width + 20)
      x1 += diff
      x2 += diff
    }
    if (y2 > this.map.ySize) {
      const diff = this.map.ySize - y2
      y1 += diff
      y2 += diff
    }
    const diff = size
    return {
      path: [
        "M", x1, y1, "L", x2, y1, "L", x2, y2, "L", x1, y2, "L", x1, y1,
      ].join(" "), style: { fill: "black", stroke: "white", strokeWidth: 2 },
      size: size-6, texts: text.map((t, i) => {
        return { x: x1+8, y: y1 + i*diff + size, v: t }
      })
    }
  }
}
