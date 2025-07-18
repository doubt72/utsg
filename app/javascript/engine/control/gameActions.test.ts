import { MapData } from "../Map"
import { baseTerrainType, Coordinate, hexOpenType, weatherType, windType } from "../../utilities/commonTypes"
import { ScenarioData } from "../Scenario"
import Unit from "../Unit"
import Game, { gamePhaseType } from "../Game"
import { describe, expect, test, vi } from "vitest"
import { HexData } from "../Hex"
import IllegalActionError from "../actions/IllegalActionError"
import { openHexRotateOpen, openHexRotatePossible } from "./openHex"
import { openHexMovement } from "./movement"
import { openHexAssaulting } from "./assault"
import { actionType, GameActionState, MoveActionState } from "./gameActions"
import { testGInf, testGTank } from "./movement.test"
import organizeStacks from "../support/organizeStacks"
import { testRTank } from "./fire.test"
import select from "./select"

// TODO: add passing tests 

describe("game action tests", () => {
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
          0: { list: [testGInf]}
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

    game.setTurn(1)
    game.phase = gamePhaseType.Main
    game.setCurrentPlayer(2)
    return game
  }

  test("initiative changes", () => {
    const game = createGame()
    const map = game.scenario.map
    const unit = new Unit(testGInf)
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

  test("initiative changes player", () => {
    const game = createGame()
    const map = game.scenario.map
    const unit = new Unit(testGInf)
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
    expect(game.reactionFireCheck).toBe(false)

    game.startInitiative()

    expect(game.initiativeCheck).toBe(false)
    expect(game.reactionFireCheck).toBe(false)

    const original = Math.random
    vi.spyOn(Math, "random").mockReturnValue(0.01)

    expect(game.currentPlayer).toBe(2)
    game.finishInitiative()
    expect(game.currentPlayer).toBe(1)

    Math.random = original

    expect(game.reactionFireCheck).toBe(false)

    try {
      game.executeUndo()
    } catch(err) {
      // Can't roll back a breakdown roll
      expect(err instanceof IllegalActionError).toBe(true)
    }
  })

  test("initiative doesn't change player", () => {
    const game = createGame()
    const map = game.scenario.map
    const unit = new Unit(testGInf)
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
    expect(game.reactionFireCheck).toBe(false)

    game.startInitiative()

    expect(game.initiativeCheck).toBe(false)
    expect(game.reactionFireCheck).toBe(false)

    const original = Math.random
    vi.spyOn(Math, "random").mockReturnValue(0.99)

    expect(game.currentPlayer).toBe(2)
    game.finishInitiative()
    expect(game.currentPlayer).toBe(2)

    Math.random = original

    expect(game.reactionFireCheck).toBe(true)

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
    const unit = new Unit(testGTank)
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
    expect(game.reactionFireCheck).toBe(false)

    game.startBreakdown()

    expect(game.initiativeCheck).toBe(false)
    expect(game.reactionFireCheck).toBe(false)

    game.finishBreakdown()

    expect(game.breakdownCheck).toBe(false)
    expect(game.initiativeCheck).toBe(true)
    expect(game.reactionFireCheck).toBe(false)
  })
  
  test("breakdown movement", () => {
    const game = createGame()
    const map = game.scenario.map
    const unit = new Unit(testGTank)
    unit.id = "test1"
    unit.facing = 1
    unit.turretFacing = 1
    unit.breakdownRoll = 3
    unit.select()
    map.addCounter(new Coordinate(4, 2), unit)

    game.startMove()

    const state = game.gameActionState as GameActionState
    const move = state.move as MoveActionState

    expect(openHexRotateOpen(map)).toBe(true)
    expect(openHexRotatePossible(map)).toBe(true)
    expect(openHexMovement(map, new Coordinate(4, 2), new Coordinate(0, 0))).toBe(hexOpenType.Closed)
    expect(openHexMovement(map, new Coordinate(4, 2), new Coordinate(3, 2))).toBe(1)
    expect(openHexMovement(map, new Coordinate(4, 2), new Coordinate(4, 3))).toBe(hexOpenType.Closed)

    game.move(3, 2)
    game.moveRotate(3, 2, 2)
    game.move(2, 1)
    move.rotatingTurret = true
    game.moveRotate(2, 1, 6)
    move.rotatingTurret = false
    game.moveRotate(2, 1, 1)

    game.move(1, 1)
    expect(openHexRotateOpen(map)).toBe(true)
    expect(openHexRotatePossible(map)).toBe(false)
    expect(openHexMovement(map, new Coordinate(1, 1), new Coordinate(0, 1))).toBe(hexOpenType.Closed)
    expect(openHexMovement(map, new Coordinate(1, 1), new Coordinate(2, 1))).toBe(hexOpenType.Closed)
    expect(openHexMovement(map, new Coordinate(1, 1), new Coordinate(2, 2))).toBe(hexOpenType.Closed)

    game.finishMove()

    const all = map.allCounters
    expect(all.length).toBe(2)
    expect(all[0].hex?.x).toBe(1)
    expect(all[0].hex?.y).toBe(1)
    expect(all[0].marker.facing).toBe(1)
    expect(all[1].hex?.x).toBe(1)
    expect(all[1].hex?.y).toBe(1)
    expect(all[1].unit.facing).toBe(1)
    expect(all[1].unit.turretFacing).toBe(5)
    expect(all[1].unit.immobilized).toBe(false)
    expect(game.reactionFireCheck).toBe(false)

    expect(game.breakdownCheck).toBe(true)

    const original = Math.random
    vi.spyOn(Math, "random").mockReturnValue(0.01)

    game.startBreakdown()
    expect(game.reactionFireCheck).toBe(false)
    expect(game.gameActionState?.currentAction).toBe(actionType.Breakdown)
    game.finishBreakdown()
    expect(game.reactionFireCheck).toBe(false)

    Math.random = original

    expect(all[1].unit.immobilized).toBe(true)

    try {
      game.executeUndo()
    } catch(err) {
      // Can't roll back a breakdown roll
      expect(err instanceof IllegalActionError).toBe(true)
    }
  })

  test("breakdown assault movement", () => {
    const game = createGame()
    const map = game.scenario.map
    const unit = new Unit(testGTank)
    unit.id = "test1"
    unit.facing = 1
    unit.turretFacing = 1
    unit.breakdownRoll = 3
    unit.select()
    map.addCounter(new Coordinate(4, 2), unit)

    game.startAssault()

    expect(openHexRotateOpen(map)).toBe(false)
    expect(openHexRotatePossible(map)).toBe(false)
    expect(openHexAssaulting(map, new Coordinate(4, 2), new Coordinate(3, 2))).toBe(hexOpenType.All)
    expect(openHexAssaulting(map, new Coordinate(4, 2), new Coordinate(4, 3))).toBe(hexOpenType.All)
    expect(openHexAssaulting(map, new Coordinate(4, 2), new Coordinate(3, 3))).toBe(hexOpenType.Closed)

    game.assault(3, 2)
    expect(openHexRotateOpen(map)).toBe(true)
    expect(openHexRotatePossible(map)).toBe(true)
    expect(openHexMovement(map, new Coordinate(1, 1), new Coordinate(0, 1))).toBe(hexOpenType.Closed)
    expect(openHexMovement(map, new Coordinate(1, 1), new Coordinate(2, 1))).toBe(hexOpenType.Closed)
    expect(openHexMovement(map, new Coordinate(1, 1), new Coordinate(2, 2))).toBe(hexOpenType.Closed)

    game.finishAssault()

    const all = map.allCounters
    expect(all.length).toBe(2)
    expect(all[0].hex?.x).toBe(3)
    expect(all[0].hex?.y).toBe(2)
    expect(all[0].marker.facing).toBe(1)
    expect(all[1].hex?.x).toBe(3)
    expect(all[1].hex?.y).toBe(2)
    expect(all[1].unit.facing).toBe(1)
    expect(all[1].unit.turretFacing).toBe(1)
    expect(all[1].unit.immobilized).toBe(false)

    expect(game.breakdownCheck).toBe(true)

    const original = Math.random
    vi.spyOn(Math, "random").mockReturnValue(0.01)

    game.startBreakdown()
    expect(game.gameActionState?.currentAction).toBe(actionType.Breakdown)
    game.finishBreakdown()

    Math.random = original

    expect(all[1].unit.immobilized).toBe(true)

    try {
      game.executeUndo()
    } catch(err) {
      // Can't roll back a breakdown roll
      expect(err instanceof IllegalActionError).toBe(true)
    }
  })

  test("passing", () => {
    const game = createGame()
    expect(game.initiative).toBe(0)
    expect(game.currentPlayer).toBe(2)
    expect(game.phase).toBe(gamePhaseType.Main)

    game.startPass()
    expect(game.gameActionState?.currentAction).toBe(actionType.Pass)
    expect(game.initiative).toBe(0)
    expect(game.currentPlayer).toBe(2)
    expect(game.phase).toBe(gamePhaseType.Main)
    expect(game.reactionFireCheck).toBe(false)

    game.finishPass()
    expect(game.gameActionState).toBe(undefined)
    expect(game.initiative).toBe(1)
    expect(game.currentPlayer).toBe(1)
    expect(game.phase).toBe(gamePhaseType.Main)
    expect(game.reactionFireCheck).toBe(false)

    game.startPass()
    expect(game.gameActionState?.currentAction).toBe(actionType.Pass)
    expect(game.initiative).toBe(1)
    expect(game.currentPlayer).toBe(1)
    expect(game.phase).toBe(gamePhaseType.Main)
    expect(game.reactionFireCheck).toBe(false)

    game.finishPass()
    expect(game.gameActionState).toBe(undefined)
    expect(game.initiative).toBe(0)
    expect(game.currentPlayer).toBe(2)
    expect(game.phase).toBe(gamePhaseType.Cleanup)
    expect(game.reactionFireCheck).toBe(false)
  })

  test("reaction fire after move", () => {
    const game = createGame()
    const map = game.scenario.map
    const unit = new Unit(testGInf)
    unit.id = "test1"
    unit.select()
    map.addCounter(new Coordinate(4, 2), unit)

    const other = new Unit(testRTank)
    other.id = "target1"
    other.facing = 4
    other.turretFacing = 4
    const oloc = new Coordinate(0, 2)
    map.addCounter(oloc, other)
    organizeStacks(map)

    game.startMove()
    game.move(3, 2)
    game.move(2, 2)
    game.move(1, 2)
    game.finishMove()

    expect(game.breakdownCheck).toBe(false)
    expect(game.initiativeCheck).toBe(true)
    expect(game.reactionFireCheck).toBe(false)

    game.startInitiative()

    expect(game.initiativeCheck).toBe(false)
    expect(game.reactionFireCheck).toBe(false)

    const original = Math.random
    vi.spyOn(Math, "random").mockReturnValue(0.99)

    expect(game.currentPlayer).toBe(2)
    game.finishInitiative()
    expect(game.currentPlayer).toBe(2)

    Math.random = original

    expect(game.reactionFireCheck).toBe(true)

    game.startReaction()

    expect(game.reactionFire).toBe(true)
    other.select()

    game.startFire()

    expect(game.reactionFire).toBe(true)
    expect(game.reactionFireHexes).toStrictEqual([
      new Coordinate(3, 2), new Coordinate(2, 2), new Coordinate(1, 2),
    ])

    select(map, {
      counter: map.countersAt(new Coordinate(1, 2))[0],
      target: { type: "map", xy: new Coordinate(1, 2) }
    }, () => {})
    expect(unit.targetSelected).toBe(true)

    vi.spyOn(Math, "random").mockReturnValue(0.01)
    game.finishFire()
    Math.random = original

    expect(game.reactionFire).toBe(false)
    expect(game.lastAction?.type).toBe("reaction_fire")

    expect(game.initiativeCheck).toBe(false)
  })

  test("reaction fire after move", () => {
    const game = createGame()
    const map = game.scenario.map
    const unit = new Unit(testGTank)
    unit.id = "test1"
    unit.turretFacing = 1
    unit.facing = 1
    unit.select()
    map.addCounter(new Coordinate(4, 2), unit)

    const other = new Unit(testRTank)
    other.id = "target1"
    other.facing = 4
    other.turretFacing = 4
    const oloc = new Coordinate(0, 2)
    map.addCounter(oloc, other)
    organizeStacks(map)

    game.startFire()
    select(map, {
      counter: map.countersAt(oloc)[0],
      target: { type: "map", xy: oloc }
    }, () => {})
    expect(other.targetSelected).toBe(true)

    const original = Math.random
    vi.spyOn(Math, "random").mockReturnValue(0.01)
    game.finishFire()
    Math.random = original

    expect(game.breakdownCheck).toBe(false)
    expect(game.initiativeCheck).toBe(true)
    expect(game.reactionFireCheck).toBe(false)

    game.startInitiative()

    expect(game.initiativeCheck).toBe(false)
    expect(game.reactionFireCheck).toBe(false)

    vi.spyOn(Math, "random").mockReturnValue(0.99)
    expect(game.currentPlayer).toBe(2)
    game.finishInitiative()
    expect(game.currentPlayer).toBe(2)

    Math.random = original

    expect(game.reactionFireCheck).toBe(true)

    game.startReaction()

    expect(game.reactionFire).toBe(true)
    other.select()

    game.startFire()

    expect(game.reactionFire).toBe(true)
    expect(game.reactionFireHexes).toStrictEqual([
      new Coordinate(4, 2),
    ])

    select(map, {
      counter: map.countersAt(new Coordinate(4, 2))[0],
      target: { type: "map", xy: new Coordinate(4, 2) }
    }, () => {})
    expect(unit.targetSelected).toBe(true)

    vi.spyOn(Math, "random").mockReturnValue(0.01)
    game.finishFire()
    Math.random = original

    expect(game.reactionFire).toBe(false)
    expect(game.lastAction?.type).toBe("reaction_fire")

    expect(game.initiativeCheck).toBe(false)
  })
});
