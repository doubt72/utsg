import { Coordinate, Direction, Player } from "../utilities/commonTypes";
import { addSpecialArmorRules, alliedCodeToName, axisCodeToName, getFormattedDate, sortReinforcementList } from "../utilities/utilities";
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

type InitUnits = {
  data: UnitData | FeatureData, x: number, y: number, facing?: Direction,
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
    init_allied_units?: InitUnits[],
    init_axis_units?: InitUnits[],
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
  rawData: ScenarioData;

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

  constructor(data: ScenarioData, game?: Game, init: boolean = true) {
    this.rawData = data

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

    if (init) {
      let count = 0
      for (const uf of data.metadata.init_allied_units ?? []) {
        const counter = uf.data.ft ? new Feature(uf.data) : new Unit(uf.data)
        if (uf.facing && counter.rotates) { counter.facing = uf.facing }
        counter.id = `ia-${count++}`
        this.map.addCounter(new Coordinate(uf.x, uf.y), counter)
      }
      for (const uf of data.metadata.init_axis_units ?? []) {
        const counter = uf.data.ft ? new Feature(uf.data) : new Unit(uf.data)
        if (uf.facing && counter.rotates) { counter.facing = uf.facing }
        counter.id = `ia-${count++}`
        this.map.addCounter(new Coordinate(uf.x, uf.y), counter)
      }
    }
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
        const counter = counterData.ft ? new Feature(counterData) : new Unit(counterData)
        if (!counter.isFeature) { addSpecialArmorRules(counter as Unit, this) }
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
    if (!this.alliedReinforcements &&
      (this.rawData.metadata.init_allied_units?.length ?? 0) < 1) { return [] }
    const counts: ReinforcementList = {}
    for (const iu of this.rawData.metadata.init_allied_units ?? []) {
      if (counts[iu.data.id]) {
        counts[iu.data.id].x += 1
      } else {
        counts[iu.data.id] = {
          x: 1, used: 0, id: iu.data.id,
          counter: iu.data.ft ? new Feature(iu.data) : new Unit(iu.data)
        }
      }
    }
    for (const turn of Object.values(this.alliedReinforcements)) {
      for (const key of Object.keys(turn)) {
        counts[key] ? counts[key].x += turn[key].x : counts[key] = { ...turn[key]}
      }
    }
    return sortReinforcementList(Object.entries(counts).flatMap(kv => kv[1]))
  }

  get axisUnitList(): ReinforcementItem[] {
    if (!this.axisReinforcements &&
      (this.rawData.metadata.init_axis_units?.length ?? 0) < 1) { return [] }
    const counts: ReinforcementList = {}
    for (const iu of this.rawData.metadata.init_axis_units ?? []) {
      if (counts[iu.data.id]) {
        counts[iu.data.id].x += 1
      } else {
        counts[iu.data.id] = {
          x: 1, used: 0, id: iu.data.id,
          counter: iu.data.ft ? new Feature(iu.data) : new Unit(iu.data)
        }
      }
    }
    for (const turn of Object.values(this.axisReinforcements)) {
      for (const key of Object.keys(turn)) {
        counts[key] ? counts[key].x += turn[key].x : counts[key] = { ...turn[key]}
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
      } else if (r === "retreat_301") {
        return `Allied units rout up below row 5, down otherwise; Axis rout in opposite direction`
      }
      return "unknown rule"
    })
  }
}
