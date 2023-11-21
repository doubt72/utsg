const HexLos = class {
  constructor(hex) {
    this.hex = hex
  }

  get counterLos() {
    if (this.hex.offmap) { return { hindrance: 0, los: true } }
    let hindrance = 0
    let los = false
    const counters = this.hex.map.counterDataAt(this.hex.x, this.hex.y)
    counters.forEach(c => {
      if (c.u.hindrance) { hindrance += c.u.hindrance }
      if (c.u.blocksLos) { los = true }
    })
    return { hindrance: hindrance, los: los}
  }

  terrainBorderEdge(dir) {
    const neighbor = this.hex.map.neighborAt(this.hex.x, this.hex.y, dir)
    const same = this.hex.borderEdges?.includes(dir)
    const opp = neighbor?.borderEdges?.includes(dir > 3 ? dir - 3 : dir + 3)
    if (same && opp) {
      console.log(`edge along ${this.hex.x},${this.hex.y}-${dir} has misconfiged border on both sides`)
    }
    if (same) { return this.hex.terrain.borderAttr }
    // Border might be on opposite hex, we only configure one
    if (opp) { return neighbor.terrain.borderAttr }
    // If neither, no effect on hindrance or LOS
    return { hindrance: 0, los: false }
  }

  get hindrance() {
    return this.hex.terrain.baseAttr.hindrance + this.hex.counterLos.hindrance
  }

  edgeHindrance(dir) {
    return this.terrainBorderEdge(dir).hindrance
  }

  terrainCornerBorders(dir, sign) {
    let newDir = dir + sign
    if (newDir > 6) { newDir -= 6 }
    if (newDir < 1) { newDir += 6 }
    const newHex = this.hex.map.neighborAt(this.hex.x, this.hex.y, newDir)
    let secondDir = newDir + 4 * sign
    if (secondDir > 6) { secondDir -= 6 }
    if (secondDir < 1) { secondDir += 6 }
    return {
      a: this.terrainBorderEdge(newDir),
      b: newHex?.hexLos?.terrainBorderEdge(secondDir) || {}
    }
  }

  alongEdgeHindrance(dir, initialEdge) {
    const neighbor = this.hex.map.neighborAt(this.hex.x, this.hex.y, dir)
    let rc = this.terrainBorderEdge(dir).hindrance
    // If terrain crosses the edge, it may hinder (terrain considered to run off edge)
    if (this.hex.baseTerrain === (neighbor?.baseTerrain || this.hex.baseTerrain)) {
      rc += this.hex.terrain.baseAttr.hindrance
    }
    // If counters on both sides, apply effects
    if (!this.hex.counterLos.los && !neighbor?.counterLOS?.los) {
      rc += Math.min(this.hex.counterLos.hindrance, neighbor?.counterLos?.hindrance || 0)
    } else if (this.hex.counterLos.los) {
      rc += this.hex.counterLos.hindrance
    } else {
      rc += neighbor?.counterLos?.hindrance || 0
    }
    // Hinder if there are fences (or more) on both sides of the starting or ending edge
    // Leading corner -- ignore if initialEdge
    if (!initialEdge) {
      const e1 = this.terrainCornerBorders(dir, -1)
      if (e1.a.hindrance && e1.b.hindrance) {
        rc += Math.min(e1.a.hindrance, e1.b.hindrance)
      } else if (e1.a.hindrance && e1.b.los) {
        rc += e1.a.hindrance
      } else if (e1.b.hindrance && e1.a.los) {
        rc += e1.b.hindrance
      }
    }
    // Trailing corner
    const e2 = this.terrainCornerBorders(dir, 1)
    if (e2.a.hindrance && e2.b.hindrance) {
      rc += Math.min(e2.a.hindrance, e2.b.hindrance)
    } else if (e2.a.hindrance && e2.b.los) {
      rc += e2.a.hindrance
    } else if (e2.b.hindrance && e2.a.los) {
      rc += e2.b.hindrance
    }
    return rc
  }

  // LOS = true means LOS is BLOCKED
  get los() {
    if (this.hex.building) { return true }
    return this.hex.terrain.baseAttr.los
  }

  edgeLos(dir) {
    return this.terrainBorderEdge(dir).los
  }

  alongEdgeLos(dir, initialEdge, finalEdge) {
    const neighbor = this.hex.map.neighborAt(this.hex.x, this.hex.y, dir)
    if (this.terrainBorderEdge(dir).los) { return true }
    // If terrain crosses the edge, it may block (terrain considered to run off edge)
    if (this.hex.baseTerrain === (neighbor?.baseTerrain || this.hex.baseTerrain)) {
      if (this.hex.terrain.baseAttr.los) { return true }
    }
    if (this.hex.counterLos.los && neighbor?.counterLos?.los) { return true }
    // Block if there is terrain on both sides of the starting or ending edge
    // Leading corner -- ignore if initialEdge
    const e1 = this.terrainCornerBorders(dir, -1)
    if (e1.a.los && e1.b.los && !initialEdge) { return true }
    // Trailing corner -- ignore if finalEdge
    const e2 = this.terrainCornerBorders(dir, 1)
    if (e2.a.los && e2.b.los && !finalEdge) { return true }
    // Buildings block if they cross edge
    const opp = dir > 3 ? dir - 3 : dir + 3
    if (this.hex.building && this.hex.hexBuilding.buildingLosEdges.includes(dir)) { return true }
    if (neighbor?.building && neighbor.hexBuilding.buildingLosEdges.includes(opp)) { return true }
    return false
  }
}

export { HexLos }