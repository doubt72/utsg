import { Map } from "./map"
import { getFormattedDate } from "./utilities"

const Scenario = class {
  constructor(data, game) {
    this.code = data.id
    this.name = data.name
    this.author = data.metadata.author
    this.status = data.status

    this.alliedFactions = data.allies
    this.axisFactions = data.axis
    this.setUnits(data.metadata, game)

    this.date = data.metadata.date
    this.location = data.metadata.location
    this.description = data.metadata.description

    this.turns = data.metadata.turns
    this.firstMove = data.metadata.first_move
    if (game) {
      game.initiativePlayer = this.firstMove
      game.initiative = 0
    }
    this.firstSetup = data.metadata.first_setup

    this.map = new Map(data.metadata.map_data, game)
  }

  setUnits(data, game) {
    if (game && data.allied_units && data.axis_units) {
      data.allied_units[0].list = data.allied_units[0].list.filter(u => {
        if (u.n === "Sniper") { game.allied_sniper = u }
        return u.n !== "Sniper"
      })
      data.axis_units[0].list = data.axis_units[0].list.filter(u => {
        if (u.n === "Sniper") { game.axis_sniper = u }
        return u.n !== "Sniper"
      })
      this.alliedReinforcements = data.allied_units
      this.axisReinforcements = data.axis_units
    } else {
      this.alliedReinforcements = data.allied_units
      this.axisReinforcements = data.axis_units
    }
  }

  get displayDate() {
    return getFormattedDate(new Date(this.date[0], this.date[1], this.date[2]))
  }

  get statusName() {
    return {
      p: "PROTOTYPE",
      a: "ALPHA",
      b: "BETA",
    }[this.status]
  }

  get alliedUnitList() {
    return Object.entries(this.alliedReinforcements).flatMap(kv => kv[1].list)
  }

  get axisUnitList() {
    return Object.entries(this.axisReinforcements).flatMap(kv => kv[1].list)
  }
}

export { Scenario }