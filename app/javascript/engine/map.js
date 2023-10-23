import { Hex } from "./hex"

const Map = class {
  constructor (data) {
    this.loadConfig(data.layout)

    this.alliedEdge = data.allied_edge
    this.axisEdge = data.axis_edge
    this.victoryHexes = data.victory_hexes
    this.alliedSetupHexes = data.allied_setup
    this.axisSetupHexes = data.axis_setup

    this.loadMap(data.hexes, this)
  }

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
}

export { Map }
