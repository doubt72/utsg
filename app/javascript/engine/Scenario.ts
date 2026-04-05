import { Player } from "../utilities/commonTypes";
import { alliedCodeToName, axisCodeToName, getFormattedDate, sortReinforcementList } from "../utilities/utilities";
import Feature, { FeatureData } from "./Feature";
import Game from "./Game"
import Map, { MapData } from "./Map";
import Unit, { UnitData } from "./Unit";

type ScenarioBaseData = {
  id: string;
  name: string;
  status: string;
  version: string;
  allies: string[];
  axis: string[];
}

export type ScenarioData = ScenarioBaseData & {
  metadata: {
    author: string;
    description: string[];
    date: [number, number, number];
    location: string;
    turns: number;
    first_deploy: Player;
    first_action: Player;
    allied_units: { [index: number]: {list: (UnitData | FeatureData)[]} };
    axis_units: { [index: number]: {list: (UnitData | FeatureData)[]} };
    special_rules?: string[],
    map_data: MapData;
  }
}

export type ScenarioListData = ScenarioBaseData & {
  wins: { one: number, two: number }
  rating: { average: number, count: number }
}

export type ReinforcementItem = {x: number, used: number, id: string, counter: Unit | Feature}
export type ReinforcementList = { [index: string]: ReinforcementItem }
export type ReinforcementSchedule = { [index: number]: ReinforcementList };

export default class Scenario {
  code: string;
  name: string;
  author: string;
  status: string;
  version: string;
  alliedFactions: string[];
  axisFactions: string[];
  date: [number, number, number];
  location: string;
  description: string[];
  turns: number;
  firstAction: Player;
  firstDeploy: Player;
  alliedReinforcements: ReinforcementSchedule = {};
  axisReinforcements: ReinforcementSchedule = {};
  map: Map;
  specialRules: string[]

  constructor(data: ScenarioData, game?: Game) {
    this.code = data.id
    this.name = data.name
    this.author = data.metadata.author
    this.status = data.status ?? "p"
    this.version = data.version

    this.alliedFactions = data.allies
    this.axisFactions = data.axis
    this.specialRules = data.metadata.special_rules ? data.metadata.special_rules : []
    this.setUnits(data, game)

    this.date = data.metadata.date
    this.location = data.metadata.location
    this.description = data.metadata.description

    this.turns = data.metadata.turns
    this.firstAction = data.metadata.first_action
    if (game) {
      game.initiative = 0
    }
    this.firstDeploy = data.metadata.first_deploy

    this.map = new Map(data.metadata.map_data, game)
  }

  setUnits({ metadata }: ScenarioData, game?: Game) {
    if (game && metadata.allied_units && metadata.axis_units) {
      metadata.allied_units[0].list = metadata.allied_units[0].list.filter(u => {
        if (u.n === "Sniper") { game.alliedSniper = new Feature(u as FeatureData) }
        return u.n !== "Sniper"
      })
      metadata.axis_units[0].list = metadata.axis_units[0].list.filter(u => {
        if (u.n === "Sniper") { game.axisSniper = new Feature(u as FeatureData) }
        return u.n !== "Sniper"
      })
    }
    this.alliedReinforcements = this.convertUnitData(metadata.allied_units)
    this.axisReinforcements = this.convertUnitData(metadata.axis_units)
  }

  convertUnitData(data: { [index: number]: {list: (UnitData | FeatureData)[]} }): ReinforcementSchedule {
    const converted: ReinforcementSchedule = {}
    for (const turn in data) {
      const turnCounters: ReinforcementList = {}
      const list = data[turn].list
      for (const counterData of list) {
        const x = counterData.x || 1
        const id = counterData.id
        if (!counterData.ft && this.axisFactions.includes(counterData.c)) {
          if (this.specialRules.includes("axis_green_armor")) {
            if (["tank", "spg", "ht", "ac"].includes(counterData.t)) { counterData.o.v = -1 }
          }
          if (this.specialRules.includes("axis_fragile_vehicles")) {
            if (["tank", "spg", "ht", "ac"].includes(counterData.t)) {
              counterData.o.bd = counterData.o.bd ? counterData.o.bd + 1 : 3
            }
          }
        }
        const counter = counterData.ft ? new Feature(counterData) : new Unit(counterData)
        turnCounters[id] = {x, used: 0, id, counter}
      }
      converted[turn] = turnCounters
    }
    return converted
  }

  get displayDate(): string {
    if (!this.date) { return "" }
    return getFormattedDate(this.date)
  }

  get statusName(): string | undefined {
    if (!this.status) { return undefined }
    return {
      p: "PROTOTYPE",
      a: "ALPHA",
      b: "BETA",
    }[this.status]
  }

  get alliedUnitList(): ReinforcementItem[] {
    if (!this.alliedReinforcements) { return [] }
    const counts: ReinforcementList = {}
    for (const turn of Object.values(this.alliedReinforcements)) {
      for (const key of Object.keys(turn)) {
        counts[key] ? counts[key].x += turn[key].x : counts[key] = structuredClone(turn[key])
      }
    }
    return sortReinforcementList(Object.entries(counts).flatMap(kv => kv[1]))
  }

  get axisUnitList(): ReinforcementItem[] {
    if (!this.axisReinforcements) { return [] }
    const counts: ReinforcementList = {}
    for (const turn of Object.values(this.axisReinforcements)) {
      for (const key of Object.keys(turn)) {
        counts[key] ? counts[key].x += turn[key].x : counts[key] = structuredClone(turn[key])
      }
    }
    return sortReinforcementList(Object.entries(counts).flatMap(kv => kv[1]))
  }

  takeAlliedReinforcement(turn: number, key: string): Unit | Feature {
    const entry = this.alliedReinforcements[turn][key]
    if (entry.used >= entry.x) {
      throw new Error('Error deploying too many of reinforcement type')
    }
    entry.used++
    const unit = entry.counter.clone()
    if (!entry.counter.isFeature && (entry.counter as Unit).isSplit) {
      (unit as Unit).split()
    }
    return unit
  }

  takeAxisReinforcement(turn: number, key: string): Unit | Feature {
    const entry = this.axisReinforcements[turn][key]
    if (entry.used >= entry.x) {
      throw new Error('Error deploying too many of reinforcement type')
    }
    entry.used++
    const unit = entry.counter.clone()
    if (!entry.counter.isFeature && (entry.counter as Unit).isSplit) {
      (unit as Unit).split()
    }
    return unit
  }

  replaceAlliedReinforcement(turn: number, key: string): void {
    this.alliedReinforcements[turn][key].used--
  }

  replaceAxisReinforcement(turn: number, key: string): void {
    this.axisReinforcements[turn][key].used--
  }

  get specialRulesList(): string[] {
    const allied = alliedCodeToName(this.alliedFactions[0])
    const axis = axisCodeToName(this.axisFactions[0])
    return this.specialRules.map(r => {
      if (r === "axis_green_armor") {
        return `${axis} vehicle crews are green (get a penalty on targeting rolls)`
      } else if (r === "axis_elite_armor") {
        return `${axis} vehicle crews are elite (get a bonus to targeting rolls)`
      } else if (r === "axis_fragile_vehicles") {
        return `${axis} vehicles are more likely to break down`
      } else if (r === "allied_green_armor") {
        return `${allied} vehicle crews are green (get a penalty on targeting rolls)`
      } else if (r === "allied_elite_armor") {
        return `${allied} vehicle crews are elite (get a bonus to targeting rolls)`
      } else if (r === "allied_fragile_vehicles") {
        return `${allied} vehicles are more likely to break down`
      } else if (r === "allied_ignore_snow") {
        return `${allied} units ignore penalties for moving through snow`
      } else if (r === "axis_ignore_snow") {
        return `${axis} units ignore penalties for moving through snow`
      } else if (r === "winter") {
        return `Winter: no digging in, treat water/river hexes as open for infantry`
      } else if (r === "infantry_wire_clearing") {
        return `Infantry units have the ability to clear wire`
      } else if (r === "armored_wire_clearing") {
        return `Armored units have the ability to clear wire`
      } else if (r === "engineer_mine_clearing") {
        return `Engineers have the ability to clear minefields`
      }
      return "unknown rule"
    })
  }
}
