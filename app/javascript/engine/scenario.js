import { Map } from "./map"
import { getFormattedDate } from "./utilities"

const Scenario = class {
  constructor(data) {
    this.code = data.id
    this.name = data.name
    this.author = data.metadata.author

    this.alliedFactions = data.allies
    this.axisFactions = data.axis
    this.alliedReinforcements = data.metadata.allied_units
    this.axisReinforcements = data.metadata.axis_units

    this.date = data.metadata.date
    this.location = data.metadata.location
    this.description = data.metadata.description

    this.turns = data.metadata.turns
    this.firstMove = data.metadata.first_move
    this.firstSetup = data.metadata.first_setup

    this.map = new Map(data.metadata.map_data)
  }

  get displayDate() {
    return getFormattedDate(new Date(this.date[0], this.date[1], this.date[2]))
  }

  get alliedUnitList() {
    return Object.entries(this.alliedReinforcements).flatMap(kv => kv[1].list)
  }

  get axisUnitList() {
    return Object.entries(this.axisReinforcements).flatMap(kv => kv[1].list)
  }
}

export { Scenario }