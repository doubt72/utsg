import { BorderType, Direction, StreamAttributes, TerrainAttributes } from "../utilities/commonTypes";
import { normalDir } from "../utilities/utilities";
import Hex from "./Hex"

export default class Terrain {
  hex: Hex;

  constructor(hex: Hex) {
    this.hex = hex
  }

  // los = BLOCKS los
  get baseAttr(): TerrainAttributes {
    return {
      o: { move: 1, hindrance: 0, cover: 0, los: false, vehicle: true,  gun: true,   name: "open" },
      f: { move: 2, hindrance: 0, cover: 1, los: true,  vehicle: false, gun: "back", name: "forest" },
      b: { move: 2, hindrance: 1, cover: 0, los: false, vehicle: true,  gun: true,   name: "brush" },
      d: { move: 1, hindrance: 1, cover: 0, los: false, vehicle: true,  gun: true,   name: "orchard" },
      g: { move: 1, hindrance: 1, cover: 0, los: false, vehicle: true,  gun: true,   name: "field" },
      s: { move: 2, hindrance: 0, cover: 0, los: false, vehicle: true,  gun: true,   name: "sand" },
      m: { move: 3, hindrance: 0, cover: 0, los: false, vehicle: false, gun: false,  name: "marsh" },
      j: { move: 3, hindrance: 0, cover: 2, los: true,  vehicle: false, gun: false,  name: "jungle" },
      p: { move: 1, hindrance: 1, cover: 0, los: false, vehicle: true,  gun: true,   name: "palm trees" },
      r: { move: 2, hindrance: 0, cover: 0, los: false, vehicle: false, gun: false,  name: "rough" },
      t: { move: 2, hindrance: 0, cover: 0, los: false, vehicle: false, gun: false,  name: "soft ground" },
      x: { move: 1, hindrance: 1, cover: 1, los: false, vehicle: false, gun: false,  name: "debris" },
      w: { move: 0, hindrance: 0, cover: 0, los: false, vehicle: false, gun: false,  name: "water" },
      y: { move: 3, hindrance: 0, cover: 0, los: false, vehicle: "amph", gun: false,  name: "shallow water" },
    }[this.hex.baseTerrain]
  }

  get borderAttr(): TerrainAttributes {
    return {
      f: { move: 1, hindrance: 1, cover: 0, los: false, vehicle: true,  gun: false, name: "fence" },
      w: { move: 2, hindrance: 0, cover: 1, los: true,  vehicle: false, gun: false, name: "wall" },
      b: { move: 2, hindrance: 0, cover: 1, los: true,  vehicle: false, gun: false, name: "bocage" },
      c: { move: 0, hindrance: 0, cover: 0, los: false, vehicle: false, gun: false, name: "cliff" },
    }[this.hex.border as BorderType]
  }

  get roadAttr(): { name: string} | undefined {
    return {
      t: { name: "tarmac" },
      d: { name: "dirt" },
      p: { name: "path" },
      a: { name: "runway" },
    }[this.hex.roadType ?? "d"]
  }

  get streamAttr(): StreamAttributes {
    return {
      s: { inMove: 1, outMove: 1, alongMove: 1, cover: 0, name: "stream" },
      g: { inMove: 1, outMove: 1, alongMove: 1, cover: 1, name: "gully" },
      t: { inMove: 1, outMove: 1, alongMove: 0, cover: 3, name: "trench" },
    }[this.hex.riverType ?? "s"]
  }

  opposite(dir: Direction): Direction {
    return normalDir(dir + 3)
  }

  get name(): string {
    if (this.hex.building) { return "building" }
    if (this.baseAttr.name === "open" && !["u", "g"].includes(this.hex.map.baseTerrain)) {
      return `open (${this.hex.map.baseTerrainName})`
    }
    return this.baseAttr.name
  }

  get cover(): number | false {
    if (!this.baseAttr.move) { return false }
    if (this.hex.building) { return 2 }
    return this.baseAttr.cover
  }

  get hindrance(): number | false {
    if (this.hex.los) { return false }
    return this.baseAttr.hindrance
  }

  get los(): boolean {
    if (this.hex.building) { return true }
    return this.baseAttr.los
  }

  get move(): number | false {
    if (this.baseAttr.move === 0) { return false }
    let move = 0
    move = this.baseAttr.move
    if (this.hex.building) { move = 2 }
    if (["s", "m"].includes(this.hex.map.baseTerrain) && !this.hex.road) {
      move += 1
    }
    return move
  }

  get borderMove(): number | false {
    if (this.borderAttr.move === 0) { return false }
    return this.borderAttr.move
  }

  get moveText(): string | false {
    if (this.baseAttr.move === 0) { return false }
    if (this.hex.river && !this.hex.road) {
      return `${this.move} (stream)`
    } else {
      return String(this.move)
    }
  }

  get gun(): boolean | string {
    if (this.hex.building) { return false }
    return this.baseAttr.gun
  }

  get vehicle(): boolean | string {
    if (this.hex.building) { return false }
    return this.baseAttr.vehicle
  }

  get borderGun(): boolean | string {
    if (this.hex.building) { return false }
    return this.borderAttr.gun
  }

  get borderVehicle(): boolean | string {
    if (this.hex.building) { return false }
    return this.borderAttr.vehicle
  }

  borderText(dir: Direction): { key: string, text: string[] } | false {
    if (!this.hex.border) { return false }
    if (dir && !this.hex.borderEdges?.includes(normalDir(dir + 3))) { return false }
    const text = []
    text.push(this.borderAttr.name)
    if (this.borderAttr.cover) {
      text.push(`- adds ${this.borderAttr.cover} cover`)
    }
    if (this.borderAttr.hindrance) {
      text.push(`- adds ${this.borderAttr.hindrance} hindrance`)
    }
    if (this.borderAttr.los) {
      text.push("- blocks line-of-sight")
    }
    if (this.borderAttr.move) {
      text.push(`- costs +${this.borderAttr.move} movement`)
      if (!this.borderAttr.gun) {
        text.push("- crewed weapon cannot cross")
      }
      if (!this.borderAttr.vehicle) {
        text.push("- vehicle cannot cross")
      }
    } else {
      text.push("- cannot be crossed")
    }
    return { key: this.hex.border, text: text }
  }
}
