const Terrain = class {
  constructor(data) {
    this.base = data.terrain
    this.border = data.border
    this.borderSides = data.borderSides
    this.feature = data.feature
    this.featureSides = data.featureSides
  }

  get baseAttr() {
    return {
      o: { move: 1,     hindrance: 0, cover: 0, los: true,  vehicle: true,  gun: true,   name: "open" },
      f: { move: 2,     hindrance: 0, cover: 1, los: false, vehicle: false, gun: "back", name: "forest" },
      b: { move: 2,     hindrance: 1, cover: 0, los: true,  vehicle: true,  gun: true,   name: "brush" },
      d: { move: 1,     hindrance: 1, cover: 0, los: true,  vehicle: true,  gun: true,   name: "orchard" },
      g: { move: 1,     hindrance: 1, cover: 0, los: true,  vehicle: true,  gun: true,   name: "field" },
      s: { move: 2,     hindrance: 0, cover: 0, los: true,  vehicle: true,  gun: true,   name: "sand" },
      m: { move: 3,     hindrance: 0, cover: 0, los: true,  vehicle: true,  gun: true,   name: "marsh" },
      j: { move: 3,     hindrance: 0, cover: 2, los: false, vehicle: false, gun: false,  name: "jungle" },
      r: { move: 2,     hindrance: 0, cover: 1, los: true,  vehicle: false, gun: false,  name: "rough" },
      w: { move: false, hindrance: 0, cover: 0, los: true,  vehicle: false, gun: false,  name: "water" },
    }[this.base]
  }

  get borderAttr() {
    return {
      f: { move: 1,     hindrance: 1, cover: 0, los: true,  vehicle: true,  gun: false, name: "fence" },
      w: { move: 2,     hindrance: 0, cover: 2, los: false, vehicle: false, gun: false, name: "wall" },
      b: { move: 2,     hindrance: 0, cover: 1, los: false, vehicle: false, gun: false, name: "bocage" },
      c: { move: false, hindrance: 0, cover: 0, los: true,  vehicle: false, gun: false, name: "cliff" },
    }[this.border]
  }

  get featureAttr() {
    return {
      st: { move: 1,     hindrance: 0, cover: 1, los: false, vehicle: false, gun: false, name: "building" },
      r:  { move: 0,     hindrance: 0, cover: 0, los: true,  vehicle: true,  gun: true,  name: "road" },
      p:  { move: 0,     hindrance: 0, cover: 0, los: true,  vehicle: false, gun: false, name: "path" },
      s:  { move: 1,     hindrance: 0, cover: 0, los: true,  vehicle: true,  gun: false, name: "stream" },
    }[this.border]
  }

  opposite(dir) {
    return dir > 3 ? dir - 3 : dir + 3
  }

  // moveCost(hex1, hex2, dir, type) {
  //   const opp = opposite(dir)
  //   TODO calculate movement cost
  // }
}

export { Terrain }