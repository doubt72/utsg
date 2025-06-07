import Game, { actionType, gamePhaseType } from "./Game";
import {
  BaseTerrainType,
  Coordinate,
  CounterSelectionTarget,
  Direction,
  ExtendedDirection,
  HexOpenType,
  MarkerType,
  Player,
  VictoryHex,
  WeatherType,
  WindType,
  baseTerrainType,
  hexOpenType,
  markerType,
  roadType,
  terrainType,
  unitType,
  weatherType,
  windType,
} from "../utilities/commonTypes";
import Hex, { HexData } from "./Hex";
import Unit from "./Unit";
import Counter from "./Counter";
import { los } from "../utilities/los";
import {
  BadgeLayout,
  HelpButtonLayout,
  OverlayLayout,
  TextLayout,
  counterElite,
  counterGreen,
  counterRed,
  markerYellow,
  roundedRectangle,
  yMapOffset,
} from "../utilities/graphics";
import Marker from "./Marker";
import Feature from "./Feature";
import WarningMoveError from "./moves/WarningMoveError";

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
export type MapCounterData = {
  loc: Coordinate, u: Marker | Unit | Feature, s: number, ti?: number
}

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

  addUnit(loc: Coordinate, unit: Unit | Feature) {
    const list = this.units[loc.y][loc.x]
    if (unit.isFeature) {
      list.unshift(unit)
    } else {
      const last = list[list.length-1]
      list.push(unit)
      if (unit.uncrewedSW) {
        if (!last || !last.canCarrySupport) {
          throw new WarningMoveError(
            `${unit.name} is not assigned to an operator; it ` +
            "must be placed on a squad, team, or leader to be assigned."
          )
        }
      }
      if (unit.crewed) {
        if (!last ||
          (!last.canHandle && !(last.canTow && last.size >= (unit.towSize ?? 0)))) {
          throw new WarningMoveError(
            `${unit.name} is not assigned to an operator or vehicle; it ` +
            "must be placed on a squad or team to be assigned, or on a vehicle large enough to tow it."
          )
        }
      }
    }
  }

  popUnit(loc: Coordinate): Unit | Feature | undefined {
    const list = this.units[loc.y][loc.x]
    return list.pop()
  }

  shiftUnit(loc: Coordinate): Unit | Feature | undefined {
    const list = this.units[loc.y][loc.x]
    return list.shift()
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
          { type: type, nation: u.nation, rotates: 1, facing: u.facing, mk: 1, player_nation: u.playerNation }
        ), s: index++ })
      }
      c.push({ loc: loc, u: u, s: index++, ti: trueIndex++ })
      if (this.showAllCounters) {
        const markerTypes: MarkerType[] = []
        if (!u.isFeature && (u as Unit).eliteCrew > 0) { markerTypes.push(markerType.EliteCrew) }
        if (!u.isFeature && (u as Unit).eliteCrew < 0) { markerTypes.push(markerType.GreenCrew) }
        if (u.immobilized) { markerTypes.push(markerType.Immobilized) }
        if (u.turretJammed) { markerTypes.push(markerType.TurretJammed) }
        if (u.jammed && u.turreted) { markerTypes.push(markerType.Jammed) }
        if (u.weaponBroken) { markerTypes.push(markerType.WeaponBroken) }
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
      if (data.ti !== undefined) {
        counter.trueIndex = data.ti
      }
      c.push(counter)
    })
    return c
  }

  counterAtIndex(loc: Coordinate, ti: number): Counter | undefined {
    const counters = this.countersAt(loc)
    for (const c of counters) {
      if (!c.target.isMarker && !c.target.isFeature && c.trueIndex === ti) { return c }
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

  get allUnits(): Counter[] {
    let c: Counter[] = []
    for (let y = 0; y < this.height; y++) {
      for (let x = this.width - 1; x >= 0; x--) {
        c = c.concat(this.countersAt(new Coordinate(x, y)).filter(c => c.isUnit))
      }
    }
    return c
  }

  get counters(): Counter[] {
    if (this.hideCounters) { return [] }
    return this.allCounters
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
    let x2 = x1 + size*170 + 10
    let y2 = y1 + 170 + 10
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
    if (y1 < 50) {
      const diff = 50 - y1
      y1 += diff
      y2 += diff
    }
    return {
      path: roundedRectangle(x1, y1, x2 - x1, y2 - y1), x: x1 + 5, y: y1 + 7.5, y2: y2,
      style: { fill: "rgba(0,0,0,0.4" },
    }
  }

  counterInfoBadges(x: number, y: number, maxY: number, counter: Counter): BadgeLayout[] {
    const badges: { text: string, color: string, tColor: string, arrow?: Direction}[] = []
    if (counter.target.rotates && !counter.target.isWreck &&
        !counter.target.hideOverlayRotation && !counter.reinforcement) {
      const turret = counter.target.turreted && !counter.target.isWreck
      const dir = turret ? counter.target.turretFacing : counter.target.facing
      badges.push({ text: `direction: ${dir}`, arrow: dir, color: "white", tColor: "black" })
    }
    if (!counter.target.isMarker || !counter.target.isWreck) {
      const u = counter.target
      const s = !this.showAllCounters
      if (!u.isFeature && (u as Unit).eliteCrew > 0 && s) {
        badges.push({ text: "elite crew +1", color: counterElite, tColor: "white" })
      }
      if (!u.isFeature && (u as Unit).eliteCrew < 0 && s) {
        badges.push({ text: "green crew -1", color: counterGreen, tColor: "black" })
      }
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
        badges.push({ text: "weapon jammed", color: counterRed, tColor: "white" })
      } else if (u.jammed && !u.turreted) {
        badges.push({ text: "broken", color: counterRed, tColor: "white" })
      } else if (u.weaponBroken && s) {
        badges.push({ text: "weapon broken", color: counterRed, tColor: "white" })
      }
      if (u.isTired && s) {
        badges.push({ text: "tired", color: markerYellow, tColor: "black" })
      }
      if (u.isPinned && s) {
        badges.push({ text: "pinned", color: counterRed, tColor: "white" })
      }
      if (u.isExhausted && s) {
        badges.push({ text: "exhausted", color: markerYellow, tColor: "black" })
      }
      if (u.isActivated && s) {
        badges.push({ text: "activated", color: markerYellow, tColor: "black" })
      }
    }
    const size = 24
    let diff = size+4
    let start = y
    if (y + diff * badges.length > maxY) {
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

  reinforcementOpenHex(x: number, y: number): HexOpenType {
    if (!this.game?.gameActionState?.deploy) { return hexOpenType.Open }
    if (this.game.gameActionState.currentAction === actionType.Deploy &&
        this.game.gameActionState.deploy.needsDirection
    ) {
      return hexOpenType.Closed
    }
    const player = this.game.gameActionState.player
    const turn = this.game.gameActionState.deploy.turn
    const index = this.game.gameActionState.deploy.index
    const hex = this.hexAt(new Coordinate(x, y))
    const uf = player === 1 ?
      this.game.scenario.alliedReinforcements[turn][index].counter :
      this.game.scenario.axisReinforcements[turn][index].counter
    if (!hex) { return false }
    if (!hex.terrain.move && !hex.road && !hex.railroad) { return false }
    if (!hex.terrain.vehicle && !(hex.road && hex.roadType !== roadType.Path) && !uf.isFeature &&
        (uf.isTracked || uf.isWheeled)) {
      if (hex.baseTerrain !== terrainType.Shallow || uf.isFeature || !uf.amphibious) {
        return hexOpenType.Closed
      }
    }
    if (hex.terrain.gun === false && !uf.isFeature && (uf.type === unitType.Gun)) { return false }
    if (uf.isFeature) {
      if (!hex.terrain.vehicle) { return hexOpenType.Closed }
      for (const f of this.countersAt(hex.coord)) {
        if (f.target.isFeature) { return hexOpenType.Closed }
      }
      if ((uf.type === "mines" || uf.type === "wire") && this.victoryAt(hex.coord)) {
        return hexOpenType.Closed
      }
    } else {
      const size = this.countersAt(hex.coord).reduce((sum, c) => {
        return c.target.isFeature ? sum : sum + c.target.size
      }, 0)
      if (uf.size + size > 15) {
        return hexOpenType.Closed
      }
    }
    const ts = `${turn}`
    if (!this.alliedSetupHexes || !this.axisSetupHexes) { return hexOpenType.Closed }
    const hexes = player === 1 ? this.alliedSetupHexes[ts] : this.axisSetupHexes[ts]
    for (const h of hexes) {
      let xMatch = false
      let yMatch = false
      if (typeof h[0] === "string" && h[0].includes("-")) {
        const [lo, hi] = h[0].split("-")
        if (x >= Number(lo) && x <= Number(hi)) { xMatch = true }
      } else if (h[0] === "*") {
        xMatch = true
      } else if (x === h[0]) { xMatch = true }

      if (typeof h[1] === "string" && h[1].includes("-")) {
        const [lo, hi] = h[1].split("-")
        if (y >= Number(lo) && y <= Number(hi)) { yMatch = true }
      } else if (h[1] === "*") {
        yMatch = true
      } else if (y === h[1]) { yMatch = true }

      if (xMatch && yMatch) {
        let rc = hexOpenType.Open
        const list = this.units[hex.coord.y][hex.coord.x]
        const last = list[list.length - 1]
        if (uf.crewed) {
          if (last && (last.canTow && last.size >= (uf.towSize ?? 0) ||
              last.canHandle)) {
            rc = hexOpenType.Green
          } else {
            rc = hexOpenType.Red
          }
        } else if (uf.uncrewedSW) {
          if (last && last.canCarrySupport) {
            rc = hexOpenType.Green
          } else {
            rc = hexOpenType.Red
          }
        }
        return rc
      }
    }
    return hexOpenType.Closed
  }

  openHex(x: number, y: number): HexOpenType {
    if (this.game?.gameActionState?.currentAction === actionType.Deploy) {
      return this.reinforcementOpenHex(x, y)
    }
    if (this.game?.gameActionState?.currentAction === actionType.Move) {
      return hexOpenType.Open
    }
    return hexOpenType.Open
  }

  anyBrokenUnits(player: Player): boolean {
    for (const listX of this.units) {
      for (const listY of listX) {
        for (const unit of listY) {
          if (!unit.isFeature) {
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
      if (u.target.selected) { u.target.select() }
    }
  }

  clearOtherSelections(x: number, y: number, trueIndex: number) {
    const units = this.allUnits
    for (const u of units) {
      if (!u.hex || (u.hex.x === x && u.hex.y === y && u.trueIndex === trueIndex)) {
        continue
      }
      if (u.target.selected) { u.target.select() }
    }
  }

  nextUnit(selection: Counter): Counter | undefined {
    const hex = selection.hex as Coordinate
    return this.counterAtIndex(
      new Coordinate(hex.x, hex.y), (selection.trueIndex ?? 0) + 1
    )
  }

  carriedUnits(selection: Counter): Counter[] {
    const next = this.nextUnit(selection)
    if (!next) { return [] }
    const rc = [next]
    if (selection.target.canCarrySupport && next.target.uncrewedSW) { return rc }
    if (selection.target.canHandle && next.target.crewed) { return rc }
    if (selection.target.canTowUnit(next)) {
      const next2 = this.nextUnit(next)
      if (next2 && selection.target.canTransportUnit(next2)) {
        rc.push(next2)
        const next3 = this.nextUnit(next2)
        const next4 = next3 ? this.nextUnit(next3) : undefined
        const next5 = next4 ? this.nextUnit(next4) : undefined
        if (next2.target.type !== "ldr" && next3?.target.uncrewedSW &&
            next4?.target.type === "ldr" && next5?.target.uncrewedSW) {
          rc.push(next3)
          rc.push(next4)
          rc.push(next5)
        } else if ((next2.target.type !== "ldr" && next3?.target.uncrewedSW &&
                    next4?.target.type === "ldr") || (next2.target.type !== "ldr" &&
                    next3?.target.type === "ldr" && next4?.target.uncrewedSW)) {
          rc.push(next3)
          rc.push(next4)
        } else if ((next2.target.type !== "ldr" && next3?.target.type === "ldr") ||
                    next3?.target.uncrewedSW) {
          rc.push(next3)
        }
      }
      return rc
    }
    if (selection.target.canTransportUnit(next)) {
      const next2 = this.nextUnit(next)
      const next3 = next2 ? this.nextUnit(next2) : undefined
      const next4 = next3 ? this.nextUnit(next3) : undefined
      if (next.target.type !== "ldr" && next2?.target.uncrewedSW &&
          next3?.target.type === "ldr" && next4?.target.uncrewedSW) {
        rc.push(next2)
        rc.push(next2)
        rc.push(next4)
      } else if ((next.target.type !== "ldr" && next2?.target.uncrewedSW &&
                  next3?.target.type === "ldr") || (next.target.type !== "ldr" &&
                  next2?.target.type === "ldr" && next3?.target.uncrewedSW)) {
        rc.push(next2)
        rc.push(next3)
      } else if ((next.target.type !== "ldr" && next2?.target.type === "ldr") ||
                  next2?.target.uncrewedSW) {
        rc.push(next2)
      }
      return rc
    }
    return []
  }

  canBeMoveMultiselected(counter: Counter, callback: (error?: string) => void): boolean {
    if (!counter.target.canCarrySupport) {
      callback("only infantry units and leaders can move together")
      return false
    }
    const next = this.nextUnit(counter)
    if (next && next?.target.crewed) {
      callback("unit manning a crewed weapon cannot move with other infantry")
      return false
    }
    const counters = this.countersAt(counter.hex as Coordinate)
    for (const c of counters) {
      if (c.target.canTransportUnit(counter)) {
        const carried = this.carriedUnits(c)
        for (const check of carried) {
          if (check.trueIndex === counter.trueIndex) {
            callback("unit being transported cannot move with other infantry")
            return false
          }
        }
      }
    }
    return true
  }

  selectable(selection: CounterSelectionTarget, callback: (error?: string) => void): boolean {
    if (!this.game) { return false }
    if (selection.counter.target.isFeature) { return false }
    if (this.debug) { return true }
    if (this.game.phase === gamePhaseType.Deployment) { return false }
    if (this.game.phase === gamePhaseType.Prep) { return false } // Not supported yet
    if (this.game.phase === gamePhaseType.Main) {
      if (selection.counter.target.playerNation !== this.game.currentPlayerNation) {
        return false
      }
      if (this.game.gameActionState?.move) {
        if (this.game.gameActionState.move.doneSelect) { return false }
        if (selection.target.type !== "map") { return false }
        for (const s of this.game.gameActionState.move.initialSelection) {
          if (s.x !== selection.target.xy.x || s.y !== selection.target.xy.y) {
            callback("all units moving together must start in same hex")
            return false
          }
          if (selection.counter.trueIndex === s.ti) { return false }
        }
        const counter = this.counterAtIndex(selection.target.xy, selection.counter.trueIndex as number)
        if (!this.canBeMoveMultiselected(counter as Counter, callback)) { return false }
      }
    }
    if (this.game.phase === gamePhaseType.Cleanup) { return false } // Not supported yet
    return true
  }

  removeActionSelection(x: number, y: number, ti: number) {
    if (!this.game?.gameActionState?.selection) { return }
    const selection = this.game.gameActionState.selection.filter(s =>
      s.x !== x && s.y !== y && s.ti !== ti
    )
    this.game.gameActionState.selection = selection
  }

  selectUnit(selection: CounterSelectionTarget, callback: (error?: string) => void) {
    if (selection.target.type === "reinforcement") { return } // shouldn't happen
    if (selection.counter.trueIndex === undefined) { return }
    if (!this.selectable(selection, callback)) { return }
    const x = selection.target.xy.x
    const y = selection.target.xy.y
    if (this.game?.gameActionState?.move) {
      const selected = selection.counter.target.selected
      selection.counter.target.select()
      if (selected) {
        this.removeActionSelection(x, y, selection.counter.trueIndex)
      } else {
        this.game.gameActionState.selection?.push({
          x, y, ti: selection.counter.trueIndex, counter: selection.counter,
        })
      }
      const next = this.nextUnit(this.counterAtIndex(selection.target.xy, selection.counter.trueIndex) as Counter)
      if (next && next.target.uncrewedSW) {
        next.target.select()
        if (selected) {
          this.removeActionSelection(x, y, selection.counter.trueIndex + 1)
        } else {
          this.game.gameActionState.selection?.push({
            x, y, ti: selection.counter.trueIndex + 1, counter: next,
          })
        }
      }
    } else {
      this.clearOtherSelections(x, y, selection.counter.trueIndex)
      selection.counter.target.select()
    }
    callback()
  }

  get noSelection(): boolean {
    const units = this.allUnits
    for (const c of units) {
      if (c.target.selected) { return false }
    }
    return true
  }

  get currentSelection(): Counter[] {
    if (!this.game) { return [] }
    const rc: Counter[] = []
    const units = this.allUnits
    for (const u of units) {
      if (u.target.selected) { rc.push(u) }
    }
    return rc
  }

  // TODO: repurpose/modify this later for fire selection
  // inRangeOfSelectedLeader(unit: Counter): boolean {
  //   if (unit.hex === undefined) { return false }
  //   if (!(unit.target as Unit).canGroupFire) { return false }
  //   const units = this.allUnits
  //   for (const u of units) {
  //     if (u.hex === undefined) { continue }
  //     if (u !== unit && u.target.type === unitType.Leader && u.target.selected) {
  //       if (hexDistance(u.hex, unit.hex) <= u.target.currentLeadership) {
  //         return true
  //       }
  //     }
  //   }
  //   return false
  // }

  // TODO: repurpose this for something maybe
  // get multiSelection(): boolean {
  //   const units = this.allUnits
  //   let foundX: number | undefined = undefined
  //   let foundY: number | undefined = undefined
  //   for (const c of units) {
  //     if (c.target.selected) {
  //       if (foundX !== undefined && foundY !== undefined) {
  //         if (foundX !== c.hex?.x || foundY !== c.hex?.y ) { return true }
  //       }
  //       foundX = c.hex?.x
  //       foundY = c.hex?.y
  //     }
  //   }
  //   return false
  // }
}
