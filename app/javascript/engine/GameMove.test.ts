import { describe, expect, test } from "vitest";
import Game, { gamePhaseType } from "./Game";
import { ScenarioData } from "./Scenario";
import { MapData } from "./Map";
import { Coordinate, baseTerrainType, weatherType, windType } from "../utilities/commonTypes";
import { UnitData } from "./Unit";
import GameMove, { GameMoveData } from "./GameMove";
import { FeatureData } from "./Feature";

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
  const rcrew: UnitData = {
    c: "ussr", t: "tm", n: "Crew", i: "crew", y: 0, m: 4, s: 3, f: 1, r: 1, v: 5, o: {cw: 2}
  }
  const rmg: UnitData = {
    c: "ussr", t: "sw", i: "mg", n: "DShK", y: 38, f: 14, r: 15, v: -2, o: {r: 1, j: 3}
  }
  const rgun: UnitData = {
    c: "ussr", f: 16, i: "gun", n: "76mm M1927", o: {t: 1, j: 3, g: 1, s: 1, c: 1}, r: 16,
    t: "gun", v: 1, y: 28
  }
  const rldr: UnitData = {
    c: "ussr", t: "ldr", n: "Leader", i: "leader", y: 0, m: 6, s: 1, f: 1, r: 1, v: 6, o: {l: 2}
  }
  const wire: FeatureData = { ft: 1, n: "Wire", t: "wire", i: "wire", f: "½", r: 0, v: "A" }

  const scenarioData: ScenarioData = {
    id: "1", name: "test scenario", status: "b", allies: ["ger"], axis: ["ussr"],
    metadata: {
      author: "The Establishment",
      description: ["This is a test scenario"],
      date: [1944, 6, 5],
      location: "anywhere",
      turns: 5,
      first_setup: 2,
      first_move: 1,
      allied_units: {
        0: { list: [rinf, rcrew, rmg, rldr, rgun]}
      },
      axis_units: {
        0: { list: [ginf, wire]} // three units here
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
    const moveData = { user: 2, player: 1, data: { action: "deploy" } }

    expect(() => new GameMove(moveData, game, 0).moveClass).toThrowError('Bad data for move')
  })

  test("sequence", () => {
    // The first few moves don't actually mutate the game, mostly just making
    // sure nothing crashes when running through them -- when running the FE
    // sends commands to the BE for these, they move objects themselves only
    // really exist for logging/display
    let index = 0
    let curretMoveData: GameMoveData = { user: 1, player: 1, data: { action: "create" } }
    game.executeMove(new GameMove(curretMoveData, game, index++))

    curretMoveData = { user: 3, player: 2, data: { action: "join" } }
    game.executeMove(new GameMove(curretMoveData, game, index++))

    curretMoveData = { user: 4, player: 1, data: { action: "join" } }
    game.executeMove(new GameMove(curretMoveData, game, index++))

    curretMoveData = { user: 4, player: 1, data: { action: "leave" } }
    game.executeMove(new GameMove(curretMoveData, game, index++))

    curretMoveData = { user: 4, player: 1, data: { action: "join" } }
    game.executeMove(new GameMove(curretMoveData, game, index++))

    curretMoveData = {
      user: 4, player: 2,
      data: {
        action: "phase", turn: [0, 0], phase: [gamePhaseType.Deployment, gamePhaseType.Deployment], player: 2
      }
    }
    game.executeMove(new GameMove(curretMoveData, game, index++))
    expect(game.lastMove?.stringValue).toBe("game started, begin Axis deployment")
    expect(game.lastMove?.undoPossible).toBe(false)

    expect(game.scenario.axisReinforcements[0][0].x).toBe(3)
    expect(game.scenario.axisReinforcements[0][0].used).toBe(0)
    curretMoveData = {
      user: 4, player: 2, data: { action: "deploy", originIndex: 0, target: [4, 3], orientation: 1, turn: 0 }
    }
    game.executeMove(new GameMove(curretMoveData, game, index++))
    expect(game.scenario.axisReinforcements[0][0].used).toBe(1)
    expect(game.scenario.map.countersAt(new Coordinate(4, 3))[0].target.name).toBe("Rifle")
    expect(game.moves[6].stringValue).toBe("deployed Rifle at E4")

    expect(game.undoPossible).toBe(true)
    expect(game.moves.length).toBe(index)
    expect(game.lastMoveIndex).toBe(index - 1)
    game.undo()
    expect(game.scenario.axisReinforcements[0][0].used).toBe(0)
    expect(game.scenario.map.countersAt(new Coordinate(4, 3)).length).toBe(0)
    // Undone moves are just marked as undone
    expect(game.moves.length).toBe(index)
    // Otherwise moves are treated sort of as a stack, with lastMoveIndex as the
    // "execution" pointer
    expect(game.lastMoveIndex).toBe(index - 2)
    expect(game.moves[6].stringValue).toBe("deployed Rifle at E4 [cancelled]")

    // Loading an undone move doesn't execute or increment last move
    curretMoveData = {
      undone: true, user: 4, player: 2, data: { action: "deploy", originIndex: 0, target: [4, 3],
      orientation: 1, turn: 0 }
    }
    game.executeMove(new GameMove(curretMoveData, game, index++))
    expect(game.scenario.axisReinforcements[0][0].used).toBe(0)
    expect(game.scenario.map.countersAt(new Coordinate(4, 3)).length).toBe(0)
    expect(game.moves.length).toBe(index)
    expect(game.lastMoveIndex).toBe(index - 3)

    curretMoveData = {
      user: 4, player: 2, data: { action: "deploy", originIndex: 0, target: [4, 4], orientation: 1, turn: 0 }
    }
    game.executeMove(new GameMove(curretMoveData, game, index++))
    expect(game.scenario.axisReinforcements[0][0].used).toBe(1)
    expect(game.scenario.map.countersAt(new Coordinate(4, 4))[0].target.name).toBe("Rifle")

    // Same unit, same spot
    game.executeMove(new GameMove(curretMoveData, game, index++))
    expect(game.scenario.axisReinforcements[0][0].used).toBe(2)
    expect(game.scenario.map.countersAt(new Coordinate(4, 4)).length).toBe(2)
    expect(game.scenario.map.countersAt(new Coordinate(4, 4))[0].target.name).toBe("Rifle")
    expect(game.scenario.map.countersAt(new Coordinate(4, 4))[1].target.name).toBe("Rifle")

    curretMoveData = {
      user: 4, player: 2, data: { action: "deploy", originIndex: 0, target: [4, 3], orientation: 1, turn: 0 }
    }
    game.executeMove(new GameMove(curretMoveData, game, index++))
    expect(game.scenario.axisReinforcements[0][0].used).toBe(3)
    expect(game.scenario.map.countersAt(new Coordinate(4, 3))[0].target.name).toBe("Rifle")

    // Should trigger phase end
    expect(game.moves.length).toBe(index)
    expect(game.lastMoveIndex).toBe(index - 1)
    curretMoveData = {
      user: 4, player: 2, data: { action: "deploy", originIndex: 1, target: [4, 1], orientation: 1, turn: 0 }
    }
    game.executeMove(new GameMove(curretMoveData, game, index++))
    expect(game.scenario.axisReinforcements[0][1].used).toBe(1)
    expect(game.scenario.map.countersAt(new Coordinate(4, 3))[0].target.name).toBe("Rifle")

    expect(game.lastMove?.stringValue).toBe("Axis deployment done, begin Allied deployment")

    index++
    expect(game.moves.length).toBe(index)
    expect(game.lastMoveIndex).toBe(index - 1)

    expect(game.currentPlayer).toBe(1)
  })
});
