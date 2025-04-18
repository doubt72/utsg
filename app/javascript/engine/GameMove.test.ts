import { describe, expect, test } from "vitest";
import Game from "./Game";
import { ScenarioData } from "./Scenario";
import { MapData } from "./Map";
import { baseTerrainType, weatherType, windType } from "../utilities/commonTypes";
import { UnitData } from "./Unit";

describe("move integration test", () => {
  const mapData: MapData = {
    layout: [ 5, 5, "x" ],
    allied_edge: "l",
    axis_edge: "r",
    victory_hexes: [[0, 0, 2], [4, 4, 1]],
    allied_setup: { 0: [[0, "*"]] },
    axis_setup: { 0: [[4, "*"]] },
    base_terrain: baseTerrainType.Grass,
    night: false,
    start_weather: weatherType.Dry,
    base_weather: weatherType.Dry,
    precip: [0, weatherType.Rain],
    wind: [windType.Calm, 3, false],
    hexes: [
      [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
      [{ t: "o" }, { t: "f" }, { t: "o" }, { t: "o" }, { t: "o" }],
      [{ t: "o" }, { t: "f" }, { t: "f" }, { t: "f" }, { t: "o" }],
      [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "f" }, { t: "o" }],
      [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
    ],
  }

  const ginf: UnitData = {
    c: "ger", f: 7, i: "squad", m: 3, n: "Rifle", o: {s: 1}, r: 5, s: 6, t: "sqd", v: 4, y: 0
  }
  const rinf: UnitData = {
    c: "ussr", f: 8, i: "squad", m: 4, n: "Guards SMG", o: {a: 1}, r: 3, s: 6, t: "sqd", v: 5, y: 41
  }
  const rmg: UnitData = {
    t: "sw", i: "mg", c: "ussr", n: "DShK", y: 38, f: 14, r: 15, v: -2, o: {r: 1, j: 3}
  }
  const rldr: UnitData = {
    c: "ussr", t: "ldr", n: "Leader", i: "leader", y: 0, m: 6, s: 1, f: 1, r: 1, v: 6, o: {l: 2}
  }

  const scenarioData: ScenarioData = {
    id: "1", name: "test scenario", status: "b", allies: ["ger"], axis: ["ussr"],
    metadata: {
      author: "The Establishment",
      description: ["This is a test scenario"],
      date: [1944, 6, 5],
      location: "anywhere",
      turns: 5,
      first_setup: 1,
      first_move: 2,
      allied_units: {
        0: { list: [rinf, rmg, rldr]}
      },
      axis_units: {
        0: { list: [ginf, ginf, ginf]}
      },
      map_data: mapData,
    }
  };

  const game = new Game({
    id: 1,
    name: "test game", scenario: scenarioData,
    owner: "a", state: "0", player_one: "a", player_two: "", current_player: "",
    metadata: { turn: 0 },
    suppress_network: true
  });

  test("stub", () => {
    expect(game.name).toBe("test game");
  });
});
