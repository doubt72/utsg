import { describe, expect, test } from "vitest";
import Game from "./Game";
import { ScenarioData } from "./Scenario";
import { MapData } from "./Map";
import { Coordinate, baseTerrainType, weatherType, windType } from "../utilities/commonTypes";
import { UnitData } from "./Unit";
import GameMove, { GameMoveData } from "./GameMove";

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
    c: "ger", f: 7, i: "squad", m: 3, n: "Rifle", o: {s: 1}, r: 5, s: 6, t: "sqd", v: 4, y: 0, x: 3
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
        0: { list: [ginf]} // three units here
      },
      map_data: mapData,
    }
  };

  const game = new Game({
    id: 1,
    name: "test game", scenario: scenarioData,
    owner: "a", state: "0", player_one: "a", player_two: "b", current_player: "a",
    metadata: { turn: 0 },
    suppress_network: true
  });

  test("validation", () => {
    const moveData = {
      id: 1, user: 2, player: 1, created_at: "2025-04-18 01:44:19.245245",
      data: { action: "place" }

    }

    expect(() => new GameMove(moveData).moveClass).toThrowError('Bad data for move')
  })

  test("sequence", () => {
    // The first few moves don't actually mutate the game, mostly just making
    // sure nothing crashes when running through them -- when running the FE
    // sends commands to the BE for these, they move objects themselves only
    // really exist for logging/display
    let curretMoveData: GameMoveData = {
      id: 1, user: 1, player: 1, created_at: "2025-04-18 01:44:19.245245",
      data: { action: "create" }

    }
    game.executeMove(new GameMove(curretMoveData))

    curretMoveData = {
      id: 1, user: 1, player: 2, created_at: "2025-04-18 01:44:19.245245",
      data: { action: "join" }

    }
    game.executeMove(new GameMove(curretMoveData))

    curretMoveData = {
      id: 1, user: 2, player: 1, created_at: "2025-04-18 01:44:19.245245",
      data: { action: "join" }

    }
    game.executeMove(new GameMove(curretMoveData))

    curretMoveData = {
      id: 1, user: 2, player: 1, created_at: "2025-04-18 01:44:19.245245",
      data: { action: "leave" }

    }
    game.executeMove(new GameMove(curretMoveData))

    curretMoveData = {
      id: 1, user: 2, player: 1, created_at: "2025-04-18 01:44:19.245245",
      data: { action: "join" }

    }
    game.executeMove(new GameMove(curretMoveData))

    expect(game.scenario.axisReinforcements[0][0].x).toBe(3)
    expect(game.scenario.axisReinforcements[0][0].used).toBe(0)
    curretMoveData = {
      id: 1, user: 2, player: 1, created_at: "2025-04-18 01:44:19.245245",
      data: { action: "place", originIndex: 0, target: new Coordinate(4, 3), orientation: 1 }

    }
    game.executeMove(new GameMove(curretMoveData))
    expect(game.scenario.axisReinforcements[0][0].used).toBe(1)
    expect(game.scenario.map.countersAt(new Coordinate(4, 3))[0].target.name).toBe("Rifle")

    expect(game.undoPossible).toBe(true)
    game.undo()
    expect(game.scenario.axisReinforcements[0][0].used).toBe(0)
    expect(game.scenario.map.countersAt(new Coordinate(4, 3)).length).toBe(0)
  })
});
