import { MapData } from "../Map"
import { baseTerrainType, Coordinate, weatherType, windType } from "../../utilities/commonTypes"
import { ScenarioData } from "../Scenario"
import Unit, { UnitData } from "../Unit"
import Game, { GameActionState, gamePhaseType, MoveActionState } from "../Game"
import { describe, expect, test, vi } from "vitest"
import { HexData } from "../Hex"
import IllegalActionError from "../actions/IllegalActionError"

describe("action integration test", () => {
  const defaultHexes: HexData[][] = [
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

  const mapData = (hexes: HexData[][]): MapData => {
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

  const ginf: UnitData = {
    c: "ger", f: 7, i: "squad", m: 3, n: "Rifle", o: {s: 1}, r: 5, s: 6, t: "sqd", v: 4, y: 0
  }
  const gtank: UnitData = {
    t: "tank", i: "tank", c: "ger", n: "PzKpfw 35(t)", y: 38, s: 3, f: 8, r: 12, v: 5,
    o: { t: 1, p: 1, ha: { f: 2, s: 1, r: 1, }, ta: { f: 2, s: 1, r: 2, }, j: 3, f: 18, u: 1, k: 1 },
  };

  const scenarioData = (hexes: HexData[][]): ScenarioData => {
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
          0: { list: [ginf]}
        },
        map_data: mapData(hexes),
      }
    }
  }

  const createGame = (hexes: HexData[][] = defaultHexes): Game => {
    const game = new Game({
      id: 1,
      name: "test game", scenario: scenarioData(hexes),
      owner: "one", state: "needs_player", player_one: "one", player_two: "", current_player: "",
      metadata: { turn: 0 },
      suppress_network: true
    });

    game.turn = 1
    game.phase = gamePhaseType.Main
    game.currentPlayer = 2
    return game
  }

  test("initiative changes", () => {
    const game = createGame()
    const map = game.scenario.map
    const unit = new Unit(ginf)
    unit.id = "test1"
    unit.baseMovement = 3
    unit.select()
    map.addCounter(new Coordinate(4, 2), unit)

    game.startMove()
    game.move(3, 2)
    game.move(2, 2)
    game.move(1, 2)
    game.finishMove()

    expect(game.initiative).toBe(-2)

    game.executeUndo()

    expect(game.initiative).toBe(0)
  })

  test("initiative changes", () => {
    const game = createGame()
    const map = game.scenario.map
    const unit = new Unit(ginf)
    unit.id = "test1"
    unit.baseMovement = 3
    unit.select()
    map.addCounter(new Coordinate(4, 2), unit)

    game.startMove()
    game.move(3, 2)
    game.move(2, 2)
    game.move(1, 2)
    game.finishMove()

    expect(game.breakdownCheck).toBe(false)
    expect(game.initiativeCheck).toBe(true)

    game.startInitiative()

    expect(game.initiativeCheck).toBe(false)

    const original = Math.random
    vi.spyOn(Math, "random").mockReturnValue(0.01)

    expect(game.currentPlayer).toBe(2)
    game.finishInitiative()
    expect(game.currentPlayer).toBe(1)

    Math.random = original

    try {
      game.executeUndo()
    } catch(err) {
      // Can't roll back a breakdown roll
      expect(err instanceof IllegalActionError).toBe(true)
    }
  })
  
  test("after breakdown", () => {
    const game = createGame()
    const map = game.scenario.map
    const unit = new Unit(gtank)
    unit.id = "test1"
    unit.facing = 1
    unit.turretFacing = 1
    unit.breakdownRoll = 3
    unit.select()
    map.addCounter(new Coordinate(4, 2), unit)

    game.startMove()

    const state = game.gameActionState as GameActionState
    const move = state.move as MoveActionState

    game.move(3, 2)
    game.moveRotate(3, 2, 2)
    game.move(2, 1)
    move.rotatingTurret = true
    game.moveRotate(2, 1, 6)
    move.rotatingTurret = false
    game.moveRotate(2, 1, 1)
    game.move(1, 1)
    game.finishMove()

    expect(game.breakdownCheck).toBe(true)

    game.startBreakdown()

    expect(game.initiativeCheck).toBe(false)

    game.finishBreakdown()

    expect(game.breakdownCheck).toBe(false)
    expect(game.initiativeCheck).toBe(true)
  })
});
