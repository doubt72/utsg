import Game from "./Game";
import {
  BaseTerrainType, Coordinate, Direction, ExtendedDirection, Player, VictoryHex,
  WeatherType, WindType, baseTerrainType, markerType, weatherType, windType,
} from "../utilities/commonTypes";
import Hex, { HexData } from "./Hex";
import Unit from "./Unit";
import Counter from "./Counter";
import { los } from "../utilities/los";
import {
  HelpButtonLayout, OverlayLayout, TextLayout, roundedRectangle, yMapOffset,
} from "../utilities/graphics";
import Feature from "./Feature";
import WarningActionError from "./actions/WarningActionError";
import { countersFromUnits, MapCounterData } from "./support/organizeStacks";
import { GameActionPath } from "./GameAction";
import { togglePlayer } from "../utilities/utilities";
import BaseAction from "./actions/BaseAction";

type MapLayout = [ number, number, "x" | "y" ];
type SetupHexesType = { [index: string]: ["*" | number, "*" | number][] }

export type MapData = {
  layout: MapLayout;
  allied_dir: ExtendedDirection;
  axis_dir: ExtendedDirection;
  victory_hexes?: [ number, number, 1 | 2 ][];
  allied_setup?: SetupHexesType;
  axis_setup?: SetupHexesType;
  hexes: HexData[][];
  base_terrain: BaseTerrainType;
  night?: boolean;
  start_weather: WeatherType;
  base_weather: WeatherType;
  precip: [number, WeatherType];
  wind: [WindType, Direction, boolean];
}

// Defined here to avoid circular imports
export default class Map {
  game?: Game;

  height: number = 0;
  width: number = 0;
  horizontal: boolean = true;
  alliedDir: ExtendedDirection;
  axisDir: ExtendedDirection;
  victoryHexes: VictoryHex[];
  alliedSetupHexes?: SetupHexesType;
  axisSetupHexes?: SetupHexesType;
  mapHexes: Hex[][] = [];

  units: (Unit | Feature)[][][];
  ghosts: (Unit | Feature)[][][];

  baseTerrain: BaseTerrainType;
  night?: boolean;
  currentWeather: WeatherType;
  baseWeather: WeatherType;
  precip: WeatherType;
  precipChance: number;
  windSpeed: WindType;
  windDirection: Direction;
  windVariable: boolean;
  showCoords: boolean = true;
  showAllCounters: boolean = false;
  hideCounters: boolean = false;

  preview: boolean = false;
  debug: boolean = false;
  debugLos: boolean = false;

  constructor (data: MapData, game?: Game) {
    this.loadConfig(data.layout)

    this.game = game

    this.alliedDir = data.allied_dir
    this.axisDir = data.axis_dir
    this.victoryHexes = data.victory_hexes?.map(v => {
      return { x: v[0], y: v[1], player: v[2] }
    }) || []
    this.alliedSetupHexes = data.allied_setup
    this.axisSetupHexes = data.axis_setup

    this.loadMap(data.hexes)

    this.units = []
    this.ghosts = []
    for (let i = 0; i < this.height; i++) {
      const array: Unit[][] = []
      const array2: Unit[][] = []
      for (let j = 0; j < this.width; j++) {
        array.push([])
        array2.push([])
      }
      this.units.push(array)
      this.ghosts.push(array2)
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
    // 2x1 sheet = 17x11" = 15x11 hexes
    // 2x2 sheet = 17x22" = 15x23 hexes
    // 2x3 sheet = 17x33" = 15x36 hexes
    // 3x1 sheet = 25.5x11" = 23x11 hexes
    // 3x2 sheet = 25.5x22" = 23x23 hexes
    // 3x3 sheet = 25.5x33" = 23x36 hexes
    // 4x2 sheet = 34x22" = 32x23 hexes
    // 4x3 sheet = 34x33" = 32x36 hexes

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
    return this.preview ? 0 : yMapOffset
  }

  get xStatusSize(): number {
    return this.preview ? 0 : 200
  }

  get narrow(): number { return 115 }
  get radius(): number { return this.narrow / 2 / Math.sin(1/3 * Math.PI) }
  xOffset(x: number, y: number): number { return this.narrow * (x + y%2/2 + 0.5) + 1 }
  yOffset(y: number): number { return this.radius * (y*1.5 + 1) + 1 }
  get xSize(): number { return this.narrow * (this.width + 0.5) + 2 + this.xStatusSize }
  get previewXSize(): number { return this.narrow * (this.width + 0.5) + 2 }
  get ySize(): number {
    return 1.5 * this.radius * (this.height + 0.3333) + 2
  }

  victoryNationAt(loc: Coordinate): string | false {
    if (!this.game) { return false }
    const player = this.victoryAt(loc)
    if (player === false) { return false }
    if (player === 1) {
      return this.game.playerOneNation
    } else {
      return this.game.playerTwoNation
    }
  }

  victoryAt(loc: Coordinate): Player | false {
    for (const v of this.victoryHexes) {
      if (v.x === loc.x && v.y === loc.y) {
        return v.player
      }
    }
    return false
  }

  toggleVP(loc: Coordinate) {
    for (const v of this.victoryHexes) {
      if (v.x === loc.x && v.y === loc.y) {
        v.player = togglePlayer(v.player)
      }
    }
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
      m: "#DFD7C7",
      u: "#D7DFD0",
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

  relativeDirection(from: Coordinate, to: Coordinate): Direction | undefined {
    const offset = from.y%2
    if (from.x - 1 === to.x && from.y === to.y) { return 1 }
    if (from.x - 1 + offset === to.x && from.y - 1 === to.y) { return 2 }
    if (from.x + offset === to.x && from.y - 1 === to.y) { return 3 }
    if (from.x + 1 === to.x && from.y === to.y) { return 4 }
    if (from.x + offset === to.x && from.y + 1 === to.y) { return 5 }
    if (from.x - 1 + offset === to.x && from.y + 1 === to.y) { return 6 }
    return undefined
  }

  addGhost(loc: Coordinate, unit: Unit | Feature) {
    const list = this.ghosts[loc.y][loc.x]
    const ghost = true
    unit.ghost = ghost
    list.push(unit)
  }

  clearGhosts() {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        this.ghosts[y][x] = []
      }
    }
  }

  addCounter(loc: Coordinate, counter: Unit | Feature) {
    const list = this.units[loc.y][loc.x]
    if (counter.isFeature) {
      list.unshift(counter)
    } else {
      const unit = counter as Unit
      const last = list[list.length-1] as Unit
      list.push(counter)
      if (unit.uncrewedSW) {
        if (!last || !last.canCarrySupport) {
          throw new WarningActionError(
            `${counter.name} is not assigned to an operator; it ` +
            "must be placed on a squad, team, or leader to be assigned."
          )
        }
      }
      if (unit.crewed) {
        if (!last ||
          (!last.canHandle && !(last.canTow && last.size >= (unit.towSize ?? 0)))) {
          throw new WarningActionError(
            `${counter.name} is not assigned to an operator or vehicle; it ` +
            "must be placed on a squad or team to be assigned, or on a vehicle large enough to tow it."
          )
        }
      }
    }
  }

  removeUnitFromList(list: (Unit | Feature)[], id: string): (Unit | Feature)[] {
    let index = undefined
    for (let i = 0; i < list.length; i++) {
      const unit = list[i] as Unit
      if (!unit.isFeature && unit.children.length > 0) {
        unit.children = this.removeUnitFromList(unit.children, id) as Unit[]
      }
      if (list[i].id === id) { index = i}
    }
    if (index !== undefined) {
      const unit = list[index] as Unit
      list.splice(index, 1)
      if (!unit.isFeature && unit.children.length > 0) {
        return list.concat(unit.children)
      }
    }
    return list
  }

  removeUnit(loc: Coordinate, id: string) {
    const newList = this.removeUnitFromList(this.units[loc.y][loc.x], id)
    this.units[loc.y][loc.x] = newList
  }

  // Moves unit and children from -> to
  moveUnit(from: Coordinate, to: Coordinate, id: string, facing?: Direction, turret?: Direction) {
    const list = this.units[from.y][from.x]
    let unit: Unit | undefined = undefined
    for (const u of list) {
      if (u.id === id) { unit = u as Unit }
    }
    if (!unit) { return }
    this.units[from.y][from.x] = this.units[from.y][from.x].filter(u => u.id !== id)
    if (facing) { unit.facing = facing }
    if (turret) { unit.turretFacing = turret }
    this.units[to.y][to.x].unshift(unit)
  }

  dropUnit(from: Coordinate, to: Coordinate, id: string, facing?: Direction, turret?: Direction) {
    const list = this.units[from.y][from.x]
    let unit: Unit | undefined = undefined
    for (const uf of list) {
      if (uf.isFeature) { continue }
      const u = uf as Unit
      for (const c of u.children) {
        if (c.id === id) { unit = c }
      }
    }
    const parent = unit?.parent
    if (!unit || !parent) { return }
    if (facing) { unit.facing = facing }
    if (turret) { unit.turretFacing = turret }
    parent.children = parent.children.filter(u => u.id !== id)
    unit.parent = undefined
    this.units[to.y][to.x].unshift(unit)
  }

  loadUnit(from: Coordinate, to: Coordinate, id: string, insertId: string, facing?: Direction) {
    const list = this.countersAt(from)
    let counter: Counter | undefined = undefined
    let insert: Counter | undefined = undefined
    for (const c of list) {
      if (c.unit.id === id) { counter = c }
    }
    const list2 = this.countersAt(to)
    for (const c of list2) {
      if (insertId !== undefined && c.unit.id === insertId) { insert = c }
    }
    if (!counter || !insert) { return }
    if (facing) { counter.unit.facing = facing }
    this.units[from.y][from.x] = this.units[from.y][from.x].filter(u => u.id !== id)
    insert.unit.children.push(counter.unit)
    counter.unit.parent = insert.unit
  }

  counterDataAt(loc: Coordinate): MapCounterData[] {
    const list = this.units[loc.y][loc.x]
    return countersFromUnits(loc, list, this.showAllCounters)
  }

  countersAt(loc: Coordinate): Counter[] {
    const rc: Counter[] = []
    let index = 0
    const lu: { [index: number]: Counter } = {}
    const data = this.counterDataAt(loc)
    for (let i = 0; i < data.length; i++) {
      const counter = new Counter(data[i].loc, data[i].u, this)
      counter.stackingIndex = i
      const unitIndex = data[i].i
      if (unitIndex !== undefined) {
        if (counter.hasUnit) {
          lu[unitIndex] = counter
        }
        counter.unitIndex = unitIndex
        index = unitIndex
      }
      const parent = data[i].pi
      if (parent !== undefined) {
        lu[parent].children.push(counter)
        counter.parent = lu[parent]
      }
      rc.push(counter)
    }
    const ghosts = this.ghosts[loc.y][loc.x]
    for (let i = 0; i < ghosts.length; i++) {
      const counter = new Counter(loc, ghosts[i], this)
      counter.stackingIndex = data.length + i
      counter.unitIndex = index++
      rc.push(counter)
    }
    return rc
  }

  unitAtId(loc: Coordinate, id: string): Counter | undefined {
    const counters = this.countersAt(loc)
    for (const c of counters) {
      if (c.hasUnit && c.unit.id === id) { return c }
    }
    return
  }

  findUnitById(id: string): Unit | undefined {
    const counters = this.allCounters
    for (const c of counters) {
      if (c.hasUnit && c.unit.id === id) { return c.unit }
    }
    return
  }

  get allCounters(): Counter[] {
    let c: Counter[] = []
    for (let y = 0; y < this.height; y++) {
      for (let x = this.width - 1; x >= 0; x--) {
        c = c.concat(this.countersAt(new Coordinate(x, y)))
      }
    }
    return c
  }

  // Counters only contain units, no features
  get allUnits(): Counter[] {
    let c: Counter[] = []
    for (let y = 0; y < this.height; y++) {
      for (let x = this.width - 1; x >= 0; x--) {
        c = c.concat(this.countersAt(new Coordinate(x, y)).filter(c => c.hasUnit))
      }
    }
    return c
  }

  get counters(): Counter[] {
    if (this.hideCounters) { return [] }
    return this.allCounters
  }

  get actionCounters(): Counter[] {
    const move = this.game?.gameActionState?.move
    if (!move) { return [] }
    if (!move.doneSelect || move.droppingMove || (move.loadingMove && this.game?.needPickUpDisambiguate)) {
      const first = move.path[0]
      return this.countersAt(new Coordinate(first.x, first.y))
    }
    if (move.loadingMove && !this.game?.needPickUpDisambiguate) {
      const last = this.game?.lastPath as GameActionPath
      return this.countersAt(new Coordinate(last.x, last.y))
    }
    return []
  }

  hexLos(start: Coordinate, end: Coordinate): TextLayout | boolean {
    // TODO: Consider decoupling "layout" from value here
    return los(this, start, end)
  }

  overlayLayout(
    loc: Coordinate, size: number, max: Coordinate, shift: Coordinate, mapScale: number, absolute = false
  ): OverlayLayout {
    let x1 = (this.xOffset(loc.x, loc.y) - shift.x) * mapScale - 90
    let y1 = (this.yOffset(loc.y) - shift.y) * mapScale - 90 + yMapOffset
    if (absolute) {
      x1 = loc.x - 50
      y1 = loc.y - 50
    }
    let x2 = x1 + size*176 + 16
    let y2 = y1 + 192
    if (x2 > max.x) {
      const diff = max.x - x2
      x1 += diff
      x2 += diff
    }
    if (x1 < 0) {
      const diff = -x1
      x1 += diff
      x2 += diff
    }
    if (y2 > max.y) {
      const diff = max.y - y2
      y1 += diff
      y2 += diff
    }
    const top = 44 - shift.y
    if (y1 < top) {
      const diff = top - y1
      y1 += diff
      y2 += diff
    }
    return {
      path: roundedRectangle(x1, y1, x2 - x1, y2 - y1), x: x1 + 5, y: y1 + 7.5, y2: y2,
      style: { fill: "rgba(0,0,0,0.4" },
    }
  }

  counterHelpButtonLayout(loc: Coordinate, counter: Counter): HelpButtonLayout | boolean {
    if (counter.hasUnit && counter.unit.isWreck) { return false }
    if (counter.hasMarker) {
      if (counter.marker.type !== markerType.Wind &&
          counter.marker.type !== markerType.Weather) {
        return false
      }
    }
    const size = 24
    return { path: [
      "M", loc.x-size/2, loc.y, "A", size/2, size/2, 0, 0, 1, loc.x+size/2, loc.y,
      "A", size/2, size/2, 0, 0, 1, loc.x-size/2, loc.y
    ].join(" "), x: loc.x, y: loc.y+5, size: size-8 }
  }

  anyBrokenUnits(player: Player): boolean {
    for (const listX of this.units) {
      for (const listY of listX) {
        for (const u of listY) {
          if (!u.isFeature) {
            const unit = u as Unit
            const unitPlayer = unit.nation === this.game?.playerOneNation ? 1 : 2
            if (player === unitPlayer && (unit.isBroken || unit.jammed)) {
              return true
            }
          }
        }
      }
    }
    return false
  }

  clearAllSelections() {
    const units = this.allUnits
    for (const u of units) {
      if (u.unit.selected) { u.unit.select() }
      if (u.unit.dropSelected) { u.unit.dropSelect() }
      if (u.unit.loaderSelected) { u.unit.loaderSelect() }
      if (u.unit.loadedSelected) { u.unit.loadedSelect() }
    }
  }

  clearOtherSelections(x: number, y: number, id: string) {
    const units = this.allUnits
    for (const u of units) {
      if (!u.hex || (u.hex.x === x && u.hex.y === y && u.unit.id === id)) {
        continue
      }
      if (u.unit.selected) { u.unit.select() }
    }
  }

  get currentSelection(): Counter[] {
    if (!this.game) { return [] }
    const rc: Counter[] = []
    const units = this.allUnits
    for (const u of units) {
      if (u.unit.selected) { rc.push(u) }
    }
    return rc
  }

  setLastSelection(move?: BaseAction) {
    const units = this.allCounters
    const ids: string[] = []
    if (move) {
      move.data.origin?.forEach(o =>ids.push(o.id))
      move.data.add_action?.forEach(o => { if (o.id) { ids.push(o.id) } })
    }
    for (const u of units) {
      if (u.hasMarker) { continue }
      if (move) {
        if (ids.includes(u.targetUF.id)) {
          if (!u.targetUF.lastSelected) { u.targetUF.lastSelect() }
        } else {
          if (u.targetUF.lastSelected) { u.targetUF.lastSelect() }
        }
      } else {
        if (u.targetUF.lastSelected) { u.targetUF.lastSelect() }
      }
    }
  }
}
