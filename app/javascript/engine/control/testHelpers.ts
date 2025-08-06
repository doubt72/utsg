import { baseTerrainType, weatherType, windType } from "../../utilities/commonTypes"
import { FeatureData } from "../Feature"
import Game, { gamePhaseType } from "../Game"
import { HexData } from "../Hex"
import { MapData } from "../Map"
import { ScenarioData } from "../Scenario"
import { UnitData } from "../Unit"

export const testGInf: UnitData = {
  c: "ger", f: 7, i: "squad", m: 3, n: "Rifle", o: {s: 1}, r: 5, s: 6, t: "sqd", v: 4, y: 0
}

export const testRInf: UnitData = {
  c: "ussr", f: 7, i: "squad", m: 3, n: "Rifle", r: 3, s: 6, t: "sqd", v: 4, y: 0, o: {}
}

export const testGLdr: UnitData = {
  c: "ger", t: "ldr", n: "Leader", i: "leader", y: 0, m: 6, s: 1, f: 1, r: 1, v: 6, o: {l: 2}
}

export const testGMG: UnitData = {
  c: "ger", t: "sw", i: "mg", n: "MG 08/15", y: 23, f: 10, r: 12, v: -1, o: {r: 1, j: 3}
}

export const testRMG: UnitData = {
  c: "ussr", t: "sw", i: "mg", n: "DP-27", y: 28, f: 4, r: 6, v: 0, o: {r: 1, j: 3, a: 1}
}

export const testGCrew: UnitData = {
  c: "ger", t: "tm", n: "Crew", i: "crew", y: 0, m: 4, s: 3, f: 1, r: 1, v: 5, o: {cw: 2}
}

export const testGGun: UnitData = {
  c: "ger", f: 8, i: "gun", n: "3.7cm Pak 36", o: {t: 1, j: 3, p: 1, c: 1, f: 18, tow: 2}, r: 16,
  t: "gun", v: 2, y: 36
}

export const testGTank: UnitData = {
  t: "tank", i: "tank", c: "ger", n: "PzKpfw 35(t)", y: 38, s: 3, f: 8, r: 12, v: 5,
  o: { t: 1, p: 1, ha: { f: 2, s: 1, r: 1, }, ta: { f: 2, s: 1, r: 2, }, j: 3, f: 18, u: 1, k: 1 },
};

export const testGTruck: UnitData = {
  t: "truck", c: "ger", n: "Opel Blitz", i: "truck", y: 30, s: 3, f: 0, r: 0, v: 5,
  o: { tr: 3, trg: 1, w: 1 },
};

export const testGFT: UnitData = {
  c: "ger", t: "sw", n: "Flamethrower", y: 15, i: "flamethrower", f: 24, r: 1, v: 0,
  o: { a: 1, i: 1, b: 4, e: 1 },
}

export const testGSC: UnitData = {
  c: "ger", t: "sw", n: "Satchel Charge", y: 36, i: "explosive", f: 24, r: 1, v: 0,
  o: { x: 1, t: 1, e: 1 },
}

export const testGMC: UnitData = {
  c: "ger", t: "sw", n: "Molotov Cocktail", y: 39, i: "explosive", f: 4, r: 1, v: 0,
  o: { i: 1, x: 1, t: 1, sn: 1, e: 1 },
};

export const testGMortar: UnitData = {
  t: "sw", i: "mortar", c: "ger", n: "5cm leGrW 36", y: 36, f: 8, r: 11, v: 0,
  o: { m: 2, t: 1, b: 3, e: 1 },
}

export const testGRadio: UnitData = {
  t: "sw", i: "radio", c: "ger", n: "Radio 10.5cm", y: 35, f: 24, r: 99, v: 0,
  o: { s: 1, o: 1, j: 3, f: 18, e: 1 },
}

export const testGAC: UnitData = {
  t: "ac", i: "ac", c: "ger", n: "SdKfz 221", y: 35, s: 3, f: 8, r: 8, v: 5,
  o: { r: 1, ha: { f: 1, s: 0, r: 0 }, ta: { f: 1, s: 1, r: 1 }, tr: 1, j: 3, f: 18, u: 1, w: 1 },
}

export const testRTank: UnitData = {
  t: "tank", i: "tank", c: "ussr", n: "T-34 M40", y: 40, s: 5, f: 24, r: 22, v: 6,
  o: { t: 1, p: 1, ha: { f: 3, s: 3, r: 3 }, ta: { f: 3, s: 3, r: 3 }, j: 3, f: 18, u: 1, k: 1 },
}

export const testRTruck: UnitData = {
  t: "truck", c: "ussr", n: "Studebaker US6", i: "truck", y: 41, s: 4, f: 0, r: 0, v: 5,
  o: { sn: 1, tr: 3, trg: 1, w: 1 },
}

export const testITank: UnitData = {
  t: "tank", i: "tank", c: "ita", n: "M11/39", y: 39, s: 3, f: 5, r: 7, v: 4,
  o: {
    r: 1, ha: { f: 3, s: 1, r: 0 }, ta: { f: 3, s: 3, r: 3 }, sg: { f: 8, r: 12, t: "p" },
    j: 3, f: 18, u: 1, k: 1
  },
}

export const testWire: FeatureData = { ft: 1, n: "Wire", t: "wire", i: "wire", f: "½", r: 0, v: "A" }

export const testMine: FeatureData = {
  ft: 1, n: "Minefield", t: "mines", i: "mines", f: 8, r: 0, v: "A", o: { g: 1 }
}

export const testMineAP: FeatureData = {
  ft: 1, n: "AP Minefield", t: "mines", i: "mines", f: 8, r: 0, v: "A"
}

export const testMineAT: FeatureData = {
  ft: 1, n: "AT Minefield", t: "mines", i: "mines", f: 8, r: 0, v: "A", o: { p: 1 }
}

export const testPill: FeatureData = {
  ft: 1, n: "Bunker", t: "bunker", i: "bunker",
  o: { da: { f: 4, s: 4, r: 1 } },
};

export const createMoveGame = (hexes: HexData[][] = movementTestHexes): Game => {
  return createTestGame(hexes)
}

export const createFireGame = (hexes: HexData[][] = fireTestHexes): Game => {
  return createTestGame(hexes)
}

export const createBlankGame = (hexes: HexData[][] = plainTestHexes): Game => {
  return createTestGame(hexes)
}

const createTestGame = (hexes: HexData[][]): Game => {
  const game = new Game({
    id: 1,
    name: "test game", scenario: scenarioTestData(hexes),
    owner: "one", state: "needs_player", player_one: "one", player_two: "", current_player: "",
    metadata: { turn: 0 },
    suppress_network: true
  });

  game.setTurn(1)
  game.phase = gamePhaseType.Main
  game.setCurrentPlayer(2)
  return game
}

const mapTestData = (hexes: HexData[][]): MapData => {
  return {
    layout: [ 5, 5, "x" ],
    allied_dir: 4, axis_dir: 1,
    victory_hexes: [[0, 0, 2], [4, 4, 1]],
    allied_setup: { 0: [[0, "*"]] },
    axis_setup: { 0: [[4, "*"]] },
    base_terrain: baseTerrainType.Grass,
    night: false,
    start_weather: weatherType.Dry,
    base_weather: weatherType.Dry,
    precip: [0, weatherType.Rain],
    wind: [windType.Calm, 3, false],
    hexes: hexes,
  }
}

const scenarioTestData = (hexes: HexData[][]): ScenarioData => {
  return {
    id: "1", name: "test scenario", status: "b", allies: ["ussr"], axis: ["ger"],
    metadata: {
      author: "The Establishment",
      description: ["This is a test scenario"],
      date: [1944, 6, 5],
      location: "anywhere",
      turns: 5,
      first_deploy: 2,
      first_action: 1,
      allied_units: {
        0: { list: []}
      },
      axis_units: {
        0: { list: [testGInf]}
      },
      map_data: mapTestData(hexes),
    }
  }
}

const movementTestHexes: HexData[][] = [
  [{ t: "o" }, { t: "o" }, { t: "o", b: "f", be: [4] }, { t: "o" }, { t: "o" }],
  [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
  [
    { t: "o", r: { d: [1, 4]} },
    { t: "o", r: { d: [1, 4]} },
    { t: "o", r: { d: [1, 4]} },
    { t: "o", r: { d: [1, 4]} },
    { t: "o", r: { d: [1, 4]} },
  ],
  [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "f" }, { t: "o" }],
  [
    { t: "o" },
    { t: "o", s: { d: [4, 6], t: "t" } },
    { t: "o", s: { d: [1, 5], t: "t" } },
    { t: "o" }, { t: "o" }
  ],
]

const fireTestHexes: HexData[][] = [
  [{ t: "o" }, { t: "o" }, { t: "o", b: "w", be: [5] }, { t: "o" }, { t: "o" }],
  [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
  [{ t: "f" }, { t: "o" }, { t: "o" }, { t: "b" }, { t: "o" }],
  [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "b" }, { t: "o" }],
  [
    { t: "o" },
    { t: "o", s: { d: [4, 6], t: "t" } },
    { t: "o", s: { d: [1, 5], t: "t" } },
    { t: "o" }, { t: "b" }
  ],
]

const plainTestHexes: HexData[][] = [
  [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
  [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
  [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
  [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
  [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
]