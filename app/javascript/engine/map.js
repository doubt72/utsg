import { Los } from "../utilities/los"
import { Counter } from "./counter"
import { Hex } from "./hex"
import { Marker, markerType } from "./marker"

const windType = { Calm: 0, Breeze: 1, Moderate: 2, Strong: 3 }
const weatherType = { Clear: 0, Fog: 1, Rain: 2, Snow: 3, Sand: 4, Dust: 5 }

const Map = class {
  constructor (data, game) {
    this.loadConfig(data.layout)

    this.game = game

    this.alliedEdge = data.allied_edge
    this.axisEdge = data.axis_edge
    this.victoryHexes = data.victory_hexes
    this.alliedSetupHexes = data.allied_setup
    this.axisSetupHexes = data.axis_setup

    this.loadMap(data.hexes, this)

    this.units = []
    for (let i = 0; i < this.height; i++) {
      const array = []
      for (let j = 0; j < this.width; j++) {
          array.push([])
      }
      this.units.push(array)
    }

    this.baseTerrain = data.base_terrain || "g"
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

    this.showCoords = true
    this.showAllCounters = false
    this.hideCounters = false
  }

  loadConfig(data) {
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

  loadMap(data, map) {
    this.mapHexes = data.map((row, y) => {
      return row.map((hex, x) => new Hex(x, y, hex, map))
    })
  }

  get statusSize() {
    return this.preview ? 0 : 200
  }

  get narrow() { return 115 }
  get radius() { return this.narrow / 2 / Math.sin(1/3 * Math.PI) }
  xOffset(x, y) { return this.narrow * (x + y%2/2 + 0.5) + 1 }
  yOffset(y) { return this.radius * (y*1.5 + 1) + 1 }
  get xSize() { return this.narrow * (this.width + 0.5) + 2 + this.statusSize }
  get ySize() { return 1.5 * this.radius * (this.height + 0.3333) + 2 }

  hexAt(x, y) {
    if (x < 0 || y < 0 || x >= this.width || y >= this.height) {
      return null
    }
    return this.mapHexes[y][x]
  }

  weatherName(w) {
    return {
      0: "clear",
      1: "fog",
      2: "rain",
      3: "snow",
      4: "sand",
      5: "dust",
    }[w]
  }

  get windName() {
    return {
      0: "calm",
      1: "breeze",
      2: "moderate",
      3: "strong",
    }[this.windSpeed]
  }

  get baseTerrainName() {
    return {
      g: "grass",
      d: "desert",
      s: "snow",
      m: "mud",
      u: "urban",
    }[this.baseTerrain]
  }

  get baseTerrainColor() {
    return {
      g: "#D0EED0",
      d: "#EEB",
      s: "#EEE",
      m: "#F7C797",
      u: "#D7E0D0",
    }[this.baseTerrain]
  }

  hexNeighbors(x, y) {
    const offset = y%2
    return [
      this.hexAt(x - 1, y),
      this.hexAt(x - 1 + offset, y - 1),
      this.hexAt(x + offset, y - 1),
      this.hexAt(x + 1, y),
      this.hexAt(x + offset, y + 1),
      this.hexAt(x - 1 + offset, y + 1),
    ]
  }

  neighborAt(x, y, dir) {
    return this.hexNeighbors(x, y)[dir - 1]
  }

  addUnit(x, y, unit) {
    const list = this.units[y][x]
    list.push(unit)
  }

  counterDataAt(x, y) {
    const c = []
    const list = this.units[y][x]
    let index = 0
    let trueIndex = 0
    list.forEach(u => {
      const r = u.rotates
      const f = u.turreted && !u.isWreck ? u.turretFacing : u.facing
      if (u.turreted && !u.isWreck) {
        const type = u.isWheeled ? markerType.WheeledHull : markerType.TrackedHull
        c.push({ x: x, y: y, u: new Marker(
          { type: type, nation: u.nation, rotates: true, facing: u.facing, x: x, y: y }
        ), s: index++ })
      }
      c.push({ x: x, y: y, u: u, s: index++, ti: trueIndex++ })
      if (this.showAllCounters) {
        const markerTypes = []
        if (u.immobilized) { markerTypes.push(markerType.Immobilized) }
        if (u.turretJammed) { markerTypes.push(markerType.TurretJammed) }
        if (u.jammed && u.turreted) { markerTypes.push(markerType.Jammed) }
        if (u.isTired) { markerTypes.push(markerType.Tired) }
        if (u.isPinned) { markerTypes.push(markerType.Pinned) }
        if (u.isExhausted) { markerTypes.push(markerType.Exhausted) }
        if (u.isActivated) { markerTypes.push(markerType.Activated) }
        markerTypes.forEach(t => {
          c.push({
            x: x, y: y, u: new Marker({ type: t, rotates: r, facing: f }), s: index++
          })
        })
      }
    })
    return c
  }

  countersAt(x, y) {
    const c = []
    this.counterDataAt(x, y).forEach(data => {
      const counter = new Counter(data.x, data.y, data.u, this)
      counter.stackingIndex = data.s
      if (data.ti) {
        counter.trueIndex = data.ti
      }
      c.push(counter)
    })
    return c
  }

  get counters() {
    let c = []
    if (this.hideCounters) { return c }
    for (let y = 0; y < this.height; y++) {
      for (let x = this.width - 1; x >= 0; x--) {
        c = c.concat(this.countersAt(x, y))
      }
    }
    return c
  }

  hexLos(x0, y0, x1, y1) {
    const los = new Los(this)
    return los.hexLos(x0, y0, x1, y1)
  }

  overlayLayout(x, y, size, absolute = false) {
    let x1 = this.xOffset(x, y) - 80
    let y1 = this.yOffset(y) - 80
    if (absolute) {
      x1 = x - 40
      y1 = y - 40
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
    const corner = 10
    const path = [
      "M", x1, y2-corner, "L", x1, y1+corner,
      "A", corner, corner, 0, 0, 1, x1+corner, y1, "L", x2-corner, y1,
      "A", corner, corner, 0, 0, 1, x2, y1+corner, "L", x2, y2-corner,
      "A", corner, corner, 0, 0, 1, x2-corner, y2, "L", x1+corner, y2,
      "A", corner, corner, 0, 0, 1, x1, y2-corner, "L", x1, y1+corner,
    ].join(" ")
    return {
      path: path, style: { fill: "rgba(0,0,0,0.4" }, x: x1 + 5, y: y1 + 7.5, y2: y2
    }
  }

  counterInfoBadges(x, y, counter) {
    const badges = []
    if (counter.target.rotates && !counter.target.isWreck && !counter.target.hideOverlayRotation) {
      const turret = counter.target.turreted && !counter.target.isWreck
      const dir = turret ? counter.target.turretFacing : counter.target.facing
      badges.push({ text: `direction: ${dir}`, arrow: dir, color: "white", tColor: "black" })
    }
    if (!counter.target.isMarker || !counter.target.isWreck) {
      const u = counter.target
      const s = !this.showAllCounters
      if (u.isBroken) {
        badges.push({ text: "broken", color: counter.red, tColor: "white" })
      }
      if (u.isWreck) {
        badges.push({ text: "destroyed", color: counter.red, tColor: "white" })
      }
      if (u.immobilized && s) {
        badges.push({ text: "immobilized", color: counter.red, tColor: "white" })
      }
      if (u.turretJammed && s) {
        badges.push({ text: "turret jammed", color: counter.red, tColor: "white" })
      }
      if (u.jammed && u.turreted && s) {
        badges.push({ text: "weapon broken", color: counter.red, tColor: "white" })
      } else if (u.jammed && !u.turreted) {
        badges.push({ text: "broken", color: counter.red, tColor: "white" })
      }
      if (u.isTired && s) {
        badges.push({ text: "tired", color: "yellow", tColor: "black" })
      }
      if (u.isPinned && s) {
        badges.push({ text: "pinned", color: counter.red, tColor: "white" })
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
    return badges.map((b, i) => {
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

  counterHelpButtonLayout(x, y, counter) {
    if (counter.target.isWreck) { return false }
    if (counter.target.isMarker) {
      if (counter.target.type !== markerType.Wind && counter.target.type !== markerType.Weather) {
        return false
      }
    }
    const size = 24
    return { path: [
      "M", x-size/2, y, "A", size/2, size/2, 0, 0, 1, x+size/2, y,
      "A", size/2, size/2, 0, 0, 1, x-size/2, y
    ].join(" "), x: x, y: y+5, size: size-8 }
  }
}

export { Map, windType, weatherType }
