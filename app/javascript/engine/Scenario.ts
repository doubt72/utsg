import { Player } from "../utilities/commonTypes";
import { getFormattedDate } from "../utilities/utilities";
import Feature, { FeatureData } from "./Feature";
import Game from "./Game"
import Map, { MapData } from "./Map";
import Unit, { UnitData } from "./Unit";

export type ScenarioData = {
  id: string;
  name: string;
  status?: string;
  allies: string[];
  axis: string[];
  metadata: {
    author?: string;
    description?: string[];
    date?: [number, number, number];
    location?: string;
    turns: number;
    first_setup?: Player;
    first_move: Player;
    allied_units: { [index: number]: {list: (UnitData | FeatureData)[]} };
    axis_units: { [index: number]: {list: (UnitData | FeatureData)[]} };
    map_data: MapData;
  }
}

export type ReinforcementList = {x: number, used: number, id?: string, counter: Unit | Feature}[]
export type ReinforcementSchedule = { [index: number]: ReinforcementList };

export default class Scenario {
  code: string;
  name: string;
  author?: string;
  status?: string;
  alliedFactions: string[];
  axisFactions: string[];
  date?: [number, number, number];
  location?: string;
  description?: string[];
  turns: number;
  firstMove: Player;
  firstSetup?: Player;
  alliedReinforcements: ReinforcementSchedule = {};
  axisReinforcements: ReinforcementSchedule = {};
  map: Map;

  constructor(data: ScenarioData, game?: Game) {
    this.code = data.id
    this.name = data.name
    this.author = data.metadata.author
    this.status = data.status

    this.alliedFactions = data.allies
    this.axisFactions = data.axis
    this.setUnits(data, game)

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
      const turnCounters = []
      const list = data[turn].list
      for (const counterData of list) {
        const x = counterData.x || 1
        const id = counterData.id
        const counter = counterData.ft ? new Feature(counterData) : new Unit(counterData)

        turnCounters.push({x, used: 0, id, counter})
      }
      converted[turn] = turnCounters
    }
    return converted
  }

  get displayDate(): string {
    if (!this.date) { return "" }
    return getFormattedDate(new Date(this.date[0], this.date[1], this.date[2]))
  }

  get statusName(): string | undefined {
    if (!this.status) { return undefined }
    return {
      p: "PROTOTYPE",
      a: "ALPHA",
      b: "BETA",
    }[this.status]
  }

  get alliedUnitList(): ReinforcementList {
    if (!this.alliedReinforcements) { return [] }
    return Object.entries(this.alliedReinforcements).flatMap(kv => kv[1])
  }

  get axisUnitList(): ReinforcementList {
    if (!this.axisReinforcements) { return [] }
    return Object.entries(this.axisReinforcements).flatMap(kv => kv[1])
  }

  takeAxisReinforcement(turn: number, index: number): Unit | Feature {
    this.axisReinforcements[turn][index].used++

    return this.axisReinforcements[turn][index].counter.clone()
  }

  takeAlliedReinforcement(turn: number, index: number): Unit | Feature {
    this.alliedReinforcements[turn][index].used++

    return this.alliedReinforcements[turn][index].counter.clone()
  }

  replaceAxisReinforcement(turn: number, index: number): void {
    this.axisReinforcements[turn][index].used--
  }

  replaceAlliedReinforcement(turn: number, index: number): void {
    this.axisReinforcements[turn][index].used--
  }

  
}
