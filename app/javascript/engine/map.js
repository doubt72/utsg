import { Hex } from "./hex"
import { Marker, markerType } from "./marker"

const Map = class {
  constructor (data) {
    this.loadConfig(data.layout)

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

    this.showCoords = true
    this.showAllCounters = true
  }

  loadConfig(data) {
    // Other values of width/height will work, but in only really matters for
    // display, and technically we're designing for horizontal 1" (flat-width) hexes.

    // hexes = x: sheets * 8 - 1, y: sheets * 12 - 1
    // 2x1 sheet = 16x10.5" = 15x11 hexes
    // 4x2 sheet = 32x21" = 31x23 hexes

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

  get narrow() { return 115 }
  get radius() { return this.narrow / 2 / Math.sin(1/3 * Math.PI) }
  xOffset(x, y) { return this.narrow * (x + y%2/2 + 0.5) + 1 }
  yOffset(y) { return this.radius * (y*1.5 + 1) + 1 }

  hexAt(x, y) {
    if (x < 0 || y < 0 || x >= this.width || y >= this.height) {
      return null
    }
    return this.mapHexes[y][x]
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

  addUnit(x, y, unit) {
    const list = this.units[y][x]
    list.push(unit)
  }

  get counters() {
    const c = []
    for (let y = 0; y < this.width; y++) {
      for (let x = this.height - 1; x >= 0; x--) {
        const list = this.units[y][x]
        let index = 0
        list.forEach(u => {
          const r = u.rotates
          const f = u.turreted && !u.isWreck ? u.turretFacing : u.facing
          if (u.turreted && !u.isWreck) {
            const type = u.wheeled ? markerType.WheeledHull : markerType.TrackedHull
            c.push({ x: x, y: y, u: new Marker(
              { type: type, nation: u.nation, facing: u.facing }
            ), s: index++ })
          }
          c.push({ x: x, y: y, u: u, s: index++ })
          if (this.showAllCounters) {
            if (u.immobilized) {
              c.push({ x: x, y: y, u: new Marker({
                type: markerType.Immobilized, rotates: r, facing: f }), s: index++ })
            }
            if (u.brokenDown) {
              c.push({ x: x, y: y, u: new Marker({
                type: markerType.BrokenDown, rotates: r, facing: f }), s: index++ })
            }
            if (u.turretJammed) {
              c.push({ x: x, y: y, u: new Marker({
                type: markerType.TurretJammed, rotates: r, facing: f }), s: index++ })
            }
            if (u.jammed) {
              c.push({ x: x, y: y, u: new Marker({
                type: markerType.Jammed, rotates: r, facing: f }), s: index++ })
            }
            if (u.isTired) {
              c.push({ x: x, y: y, u: new Marker({
                type: markerType.Tired, rotates: r, facing: f }), s: index++ })
            }
            if (u.isPinned) {
              c.push({ x: x, y: y, u: new Marker({
                type: markerType.Pinned, rotates: r, facing: f }), s: index++ })
            }
            if (u.isExhausted) {
              c.push({ x: x, y: y, u: new Marker({
                type: markerType.Exhausted, rotates: r, facing: f }), s: index++ })
            }
            if (u.isActivated) {
              c.push({ x: x, y: y, u: new Marker({
                type: markerType.Activated, rotates: r, facing: f }), s: index++ })
            }
          }
        })
      }
    }
    return c
  }
}

export { Map }
