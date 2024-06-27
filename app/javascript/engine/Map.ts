import Game from "./Game";
import { BaseTerrainTypeType, Coordinate, Direction, MapEdgeType, MarkerTypeType, VictoryHexType, WeatherTypeType, WindTypeType, baseTerrainType, markerType, weatherType, windType } from "../utilities/commonTypes";
import Hex, { HexData } from "./Hex";
import Unit from "./Unit";
import Counter from "./Counter";
import { los } from "../utilities/los";
import { BadgeLayout, HelpButtonLayout, OverlayLayout, TextLayout, counterRed, roundedRectangle } from "../utilities/graphics";
import Marker from "./Marker";
import Feature from "./Feature";

type MapLayout = [ number, number, "x" | "y" ];
type SetupHexesType = { [index: string]: [number, string][] }

export type MapData = {
  layout: MapLayout;
  allied_edge?: MapEdgeType;
  axis_edge?: MapEdgeType;
  victory_hexes?: [ number, number, 1 | 2 ][];
  allied_setup?: SetupHexesType;
  axis_setup?: SetupHexesType;
  hexes: HexData[][];
  base_terrain: BaseTerrainTypeType;
  night?: boolean;
  start_weather: WeatherTypeType;
  base_weather: WeatherTypeType;
  precip: [number, WeatherTypeType];
  wind: [WindTypeType, Direction, boolean];
}

// Defined here to avoid circular imports
export type MapCounterData = {
  loc: Coordinate, u: Marker | Unit | Feature, s: number, ti?: number
}

export default class Map {
  game?: Game;

  height: number = 0;
  width: number = 0;
  horizontal: boolean = true;
  alliedEdge?: MapEdgeType;
  axisEdge?: MapEdgeType;
  victoryHexes: VictoryHexType[];
  alliedSetupHexes?: SetupHexesType;
  axisSetupHexes?: SetupHexesType;
  mapHexes: Hex[][] = [];

  units: (Unit | Feature)[][][];

  baseTerrain: BaseTerrainTypeType;
  night?: boolean;
  currentWeather: WeatherTypeType;
  baseWeather: WeatherTypeType;
  precip: WeatherTypeType;
  precipChance: number;
  windSpeed: WindTypeType;
  windDirection: Direction;
  windVariable: boolean;
  showCoords: boolean = true;
  showAllCounters: boolean = false;
  hideCounters: boolean = false;

  preview: boolean = false;
  debug: boolean = false;

  constructor (data: MapData, game?: Game) {
    this.loadConfig(data.layout)

    this.game = game

    this.alliedEdge = data.allied_edge
    this.axisEdge = data.axis_edge
    this.victoryHexes = data.victory_hexes?.map(v => {
      return { x: v[0], y: v[1], player: v[2] }
    }) || []
    this.alliedSetupHexes = data.allied_setup
    this.axisSetupHexes = data.axis_setup

    this.loadMap(data.hexes)

    this.units = []
    for (let i = 0; i < this.height; i++) {
      const array: Unit[][] = []
      for (let j = 0; j < this.width; j++) {
          array.push([])
      }
      this.units.push(array)
    }

    this.baseTerrain = data.base_terrain || baseTerrainType.Grass
    this.night = data.night

    this.currentWeather = data.start_weather || 0
    this.baseWeather = data.base_weather || 0
    const precip = data.precip
    this.precip = precip ? precip[1] : 2
    this.precipChance = precip ? precip[0] : 0

    const wind = data.wind
    this.windSpeed = wind ? wind[0] : 0
    this.windDirection = wind ? wind[1] : 1
    this.windVariable = wind ? wind[2] : false
  }

  loadConfig(data: MapLayout) {
    // Other values of width/height will work, but in only really matters for
    // display, and technically we're designing for horizontal 1" (flat-width) hexes.

    // hexes = x: sheets * 8 - 1, y: sheets * 12 - 1 (packed slightly more)
    // 2x1 sheet = 16x10.5" = 15x11 hexes
    // 3x1 sheet = 24x10.5" = 23x11 hexes
    // 2x2 sheet = 16x21" = 15x21 hexes
    // 3x2 sheet = 24x21" = 23x21 hexes
    // 4x2 sheet = 32x21" = 31x21 hexes

    this.height = data[1]
    this.width = data[0]
    // Using anything besides x will either do nothing or possibly break things (eventually)
    this.horizontal = data[2] === "x"
  }

  loadMap(data: HexData[][]) {
    this.mapHexes = data.map((row: HexData[], y: number) => {
      return row.map((hex: HexData, x: number) => new Hex(new Coordinate(x, y), hex, this))
    })
  }

  get yStatusSize(): number {
    return this.preview ? 0 : 110
  }

  get xStatusSize(): number {
    return this.preview ? 0 : 200
  }

  get narrow(): number { return 115 }
  get radius(): number { return this.narrow / 2 / Math.sin(1/3 * Math.PI) }
  xOffset(x: number, y: number): number { return this.narrow * (x + y%2/2 + 0.5) + 1 }
  yOffset(y: number): number { return this.radius * (y*1.5 + 1) + 1 + this.yStatusSize }
  get xSize(): number { return this.narrow * (this.width + 0.5) + 2 + this.xStatusSize }
  get ySize(): number {
    return 1.5 * this.radius * (this.height + 0.3333) + 2 + this.yStatusSize
  }

  victoryAt(loc: Coordinate): string | false {
    if (!this.game) { return false }
    for (let i = 0; i < this.victoryHexes.length; i++) {
      const v = this.victoryHexes[i]
      if (v.x === loc.x && v.y === loc.y) {
        if (v.player === 1) {
          return this.game.playerOneNation
        } else {
          return this.game.playerTwoNation
        }
      }
    }
    return false
  }

  hexAt(loc: Coordinate): Hex | undefined {
    if (loc.x < 0 || loc.y < 0 || loc.x >= this.width || loc.y >= this.height) {
      return undefined
    }
    return this.mapHexes[loc.y][loc.x]
  }

  weatherName(w: number): string | undefined {
    for (const index in weatherType) {
      if (weatherType[index] === w) {
        return index.toLowerCase()
      }
    }
  }

  get windName(): string | undefined {
    for (const index in windType) {
      if (windType[index] === this.windSpeed) {
        return index.toLowerCase()
      }
    }
  }

  get baseTerrainName(): string | undefined {
    for (const index in baseTerrainType) {
      if (baseTerrainType[index] === this.baseTerrain) {
        return index.toLowerCase()
      }
    }
  }

  get baseTerrainColor(): string {
    return {
      g: "#D0EED0",
      d: "#EEB",
      s: "#EEE",
      m: "#F7C797",
      u: "#D7E0D0",
    }[this.baseTerrain]
  }

  hexNeighbors(loc: Coordinate): (Hex | undefined)[] {
    const offset = loc.y%2
    return [
      this.hexAt(new Coordinate(loc.x - 1, loc.y)),
      this.hexAt(new Coordinate(loc.x - 1 + offset, loc.y - 1)),
      this.hexAt(new Coordinate(loc.x + offset, loc.y - 1)),
      this.hexAt(new Coordinate(loc.x + 1, loc.y)),
      this.hexAt(new Coordinate(loc.x + offset, loc.y + 1)),
      this.hexAt(new Coordinate(loc.x - 1 + offset, loc.y + 1)),
    ]
  }

  neighborAt(loc: Coordinate, dir: Direction): Hex | undefined {
    return this.hexNeighbors(loc)[dir - 1]
  }

  addUnit(loc: Coordinate, unit: Unit | Feature) {
    const list = this.units[loc.y][loc.x]
    list.push(unit)
  }

  counterDataAt(loc: Coordinate): MapCounterData[] {
    const c: MapCounterData[] = []
    const list = this.units[loc.y][loc.x]
    let index = 0
    let trueIndex = 0
    list.forEach(u => {
      const r = u.rotates ? 1 : 0
      const f = u.turreted && !u.isWreck ? u.turretFacing : u.facing
      if (u.turreted && !u.isWreck) {
        const type = u.isWheeled ? markerType.WheeledHull : markerType.TrackedHull
        c.push({ loc: loc, u: new Marker(
          { type: type, nation: u.nation, rotates: 1, facing: u.facing, mk: 1 }
        ), s: index++ })
      }
      c.push({ loc: loc, u: u, s: index++, ti: trueIndex++ })
      if (this.showAllCounters) {
        const markerTypes: MarkerTypeType[] = []
        if (u.immobilized) { markerTypes.push(markerType.Immobilized) }
        if (u.turretJammed) { markerTypes.push(markerType.TurretJammed) }
        if (u.jammed && u.turreted) { markerTypes.push(markerType.Jammed) }
        if (u.isTired) { markerTypes.push(markerType.Tired) }
        if (u.isPinned) { markerTypes.push(markerType.Pinned) }
        if (u.isExhausted) { markerTypes.push(markerType.Exhausted) }
        if (u.isActivated) { markerTypes.push(markerType.Activated) }
        markerTypes.forEach(t => {
          c.push({
            loc: loc, u: new Marker({
              type: t, rotates: r, facing: f, mk: 1
            }), s: index++
          })
        })
      }
    })
    return c
  }

  countersAt(loc: Coordinate): Counter[] {
    const c: Counter[] = []
    this.counterDataAt(loc).forEach(data => {
      const counter = new Counter(data.loc, data.u, this)
      counter.stackingIndex = data.s
      if (data.ti) {
        counter.trueIndex = data.ti
      }
      c.push(counter)
    })
    return c
  }

  get counters(): Counter[] {
    let c: Counter[] = []
    if (this.hideCounters) { return c }
    for (let y = 0; y < this.height; y++) {
      for (let x = this.width - 1; x >= 0; x--) {
        c = c.concat(this.countersAt(new Coordinate(x, y)))
      }
    }
    return c
  }

  hexLos(start: Coordinate, end: Coordinate): TextLayout | boolean {
    return los(this, start, end)
  }

  overlayLayout(loc: Coordinate, size: number, absolute = false): OverlayLayout {
    let x1 = this.xOffset(loc.x, loc.y) - 90
    let y1 = this.yOffset(loc.y) - 90
    if (absolute) {
      x1 = loc.x - 50
      y1 = loc.y - 50
    }
    let x2 = x1 + size*170 + 10
    let y2 = y1 + 170 + 10
    if (x2 > this.xSize) {
      const diff = this.xSize - x2
      x1 += diff
      x2 += diff
    }
    if (x1 < 0) {
      const diff = -x1
      x1 += diff
      x2 += diff
    }
    if (y2 > this.ySize) {
      const diff = this.ySize - y2
      y1 += diff
      y2 += diff
    }
    if (y1 < 0) {
      const diff = -y1
      y1 += diff
      y2 += diff
    }
    return {
      path: roundedRectangle(x1, y1, x2 - x1, y2 - y1), x: x1 + 5, y: y1 + 7.5, y2: y2,
      style: { fill: "rgba(0,0,0,0.4" },
    }
  }

  counterInfoBadges(x: number, y: number, counter: Counter): BadgeLayout[] {
    const badges: { text: string, color: string, tColor: string, arrow?: Direction}[] = []
    if (counter.target.rotates && !counter.target.isWreck &&
        !counter.target.hideOverlayRotation) {
      const turret = counter.target.turreted && !counter.target.isWreck
      const dir = turret ? counter.target.turretFacing : counter.target.facing
      badges.push({ text: `direction: ${dir}`, arrow: dir, color: "white", tColor: "black" })
    }
    if (!counter.target.isMarker || !counter.target.isWreck) {
      const u = counter.target
      const s = !this.showAllCounters
      if (u.isBroken) {
        badges.push({ text: "broken", color: counterRed, tColor: "white" })
      }
      if (u.isWreck) {
        badges.push({ text: "destroyed", color: counterRed, tColor: "white" })
      }
      if (u.immobilized && s) {
        badges.push({ text: "immobilized", color: counterRed, tColor: "white" })
      }
      if (u.turretJammed && s) {
        badges.push({ text: "turret jammed", color: counterRed, tColor: "white" })
      }
      if (u.jammed && u.turreted && s) {
        badges.push({ text: "weapon broken", color: counterRed, tColor: "white" })
      } else if (u.jammed && !u.turreted) {
        badges.push({ text: "broken", color: counterRed, tColor: "white" })
      }
      if (u.isTired && s) {
        badges.push({ text: "tired", color: "yellow", tColor: "black" })
      }
      if (u.isPinned && s) {
        badges.push({ text: "pinned", color: counterRed, tColor: "white" })
      }
      if (u.isExhausted && s) {
        badges.push({ text: "exhausted", color: "yellow", tColor: "black" })
      }
      if (u.isActivated && s) {
        badges.push({ text: "activated", color: "yellow", tColor: "black" })
      }
    }
    const size = 24
    let diff = size+4
    let start = y
    if (y + diff * badges.length > this.ySize) {
      diff = -diff
      start = y - 196
    }
    return badges.map((raw, i): BadgeLayout => {
      const b: BadgeLayout = raw
      b.x = x+5
      b.y = start + diff*i
      b.size = size-8
      b.path = [
        "M", x, b.y-size/2, "L", x+137.5, b.y-size/2, "L", x+137.5, b.y+size/2 ,
        "L", x, b.y+size/2, "L", x, b.y-size/2
      ].join(" ")
      if (b.arrow) {
        const c = x-size*0.6
        b.dirpath = [
          "M", c-size/2, b.y, "A", size/2, size/2, 0, 0, 1, c+size/2, b.y,
          "A", size/2, size/2, 0, 0, 1, c-size/2, b.y
        ].join(" ")
        b.dx = c
        b.dy = b.y
      }
      b.y = b.y + 5
      return b
    })
  }

  counterHelpButtonLayout(loc: Coordinate, counter: Counter): HelpButtonLayout | boolean {
    if (counter.target.isWreck) { return false }
    if (counter.target.isMarker) {
      if (counter.target.type !== markerType.Wind &&
          counter.target.type !== markerType.Weather) {
        return false
      }
    }
    const size = 24
    return { path: [
      "M", loc.x-size/2, loc.y, "A", size/2, size/2, 0, 0, 1, loc.x+size/2, loc.y,
      "A", size/2, size/2, 0, 0, 1, loc.x-size/2, loc.y
    ].join(" "), x: loc.x, y: loc.y+5, size: size-8 }
  }
}
