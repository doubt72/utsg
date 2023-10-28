const markerType = {
  TrackedHull: 0, WheeledHull: 1,
  Tired: 2, Pinned: 3, Activated: 4, Exhausted: 5,
  BrokenDown: 6, Jammed: 7, TurretJammed: 8, Immobilized: 9
}

const Marker = class {
  constructor(data) {
    this.type = data.type
    this.nation = data.nation || "none"
    this.facing = data.facing || 1
    this.rotates = data.rotates || false
  }

  get isMarker() {
    return true
  }

  get isMinor() {
    return [markerType.Activated, markerType.Exhausted, markerType.Tired].includes(this.type)
  }

  get hideOverlayRotation() {
    return ![markerType.TrackedHull, markerType.WheeledHull].includes(this.type)
  }

  get displayText() {
    if (this.type === markerType.Tired) { return ["tired"]}
    if (this.type === markerType.Pinned) { return ["pinned"]}
    if (this.type === markerType.Activated) { return ["activated"]}
    if (this.type === markerType.Exhausted) { return ["exhausted"]}
    if (this.type === markerType.BrokenDown) { return ["broken", "down"]}
    if (this.type === markerType.Jammed) { return ["weapon", "broken"]}
    if (this.type === markerType.TurretJammed) { return ["turret", "jammed"]}
    if (this.type === markerType.Immobilized) { return ["immobilized"]}
    return []
  }

  get icon() {
    if (this.type === markerType.WheeledHull) { return "wheeled-hull" }
    if (this.type === markerType.TrackedHull) { return "tracked-hull" }
    return false
  }

  get fullIcon() {
    return true
  }
}

export { Marker, markerType }