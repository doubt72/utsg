import { MapData } from "../Map"
import { baseTerrainType, Coordinate, weatherType, windType } from "../../utilities/commonTypes"
import { ScenarioData } from "../Scenario"
import Unit from "../Unit"
import Game, { gamePhaseType } from "../Game"
import { describe, expect, test, vi } from "vitest"
import { HexData } from "../Hex"
import { testGInf, testGMG, testGTank } from "./movement.test"
import organizeStacks from "../support/organizeStacks"
import { testRTank } from "./fire.test"
import select from "./select"
import { reactionFireHexes } from "./reactionFire"
import { GameActionState, MoveActionState } from "./gameActions"
import WarningActionError from "../actions/WarningActionError"

describe("reaction fire tests", () => {
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

  test("reaction fire after fire", () => {
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
    expect(reactionFireHexes(game)).toStrictEqual([
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

  test("reaction fire after move", () => {
    const game = createGame()
    const map = game.scenario.map
    const unit = new Unit(testGInf)
    unit.id = "test1"
    unit.select()
    map.addCounter(new Coordinate(4, 2), unit)

    const other = new Unit(testRTank)
    other.id = "other1"
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
    const counters1 = map.countersAt(new Coordinate(3, 2))
    expect(counters1.length).toBe(1)
    expect(counters1[0].unit.ghost).toBe(true)
    const counters2 = map.countersAt(new Coordinate(2, 2))
    expect(counters2.length).toBe(1)
    expect(counters2[0].unit.ghost).toBe(true)

    expect(game.reactionFire).toBe(true)
    expect(reactionFireHexes(game)).toStrictEqual([
      { x: 3, y: 2, facing: undefined, turret: undefined },
      { x: 2, y: 2, facing: undefined, turret: undefined },
      { x: 1, y: 2, facing: undefined, turret: undefined },
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
    expect(game.lastAction?.stringValue).toBe(
      "Soviet T-34 M40 at A3 fired at German Rifle at B3; targeting roll (d10x10): target 3, " +
      "rolled 1: miss, firing weapon broken")
    expect(game.moraleChecksNeeded).toStrictEqual([])

    expect(game.initiativeCheck).toBe(false)
  })

  test("reaction fire mid move", () => {
    const game = createGame()
    const map = game.scenario.map
    const unit = new Unit(testGInf)
    unit.id = "test1"
    unit.select()
    map.addCounter(new Coordinate(4, 2), unit)

    const other = new Unit(testRTank)
    other.id = "other1"
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
    const counters1 = map.countersAt(new Coordinate(3, 2))
    expect(counters1.length).toBe(1)
    expect(counters1[0].unit.ghost).toBe(true)
    const counters2 = map.countersAt(new Coordinate(2, 2))
    expect(counters2.length).toBe(1)
    expect(counters2[0].unit.ghost).toBe(true)

    expect(game.reactionFire).toBe(true)
    expect(reactionFireHexes(game)).toStrictEqual([
      { x: 3, y: 2, facing: undefined, turret: undefined },
      { x: 2, y: 2, facing: undefined, turret: undefined },
      { x: 1, y: 2, facing: undefined, turret: undefined },
    ])

    select(map, {
      counter: map.countersAt(new Coordinate(2, 2))[0],
      target: { type: "map", xy: new Coordinate(2, 2) }
    }, () => {})
    const ghost = counters2[0].unit
    expect(ghost.targetSelected).toBe(true)

    vi.spyOn(Math, "random").mockReturnValue(0.99)
    game.finishFire()
    Math.random = original

    expect(game.reactionFire).toBe(false)
    expect(game.lastAction?.type).toBe("reaction_fire")
    expect(game.lastAction?.stringValue).toBe(
      "Soviet T-34 M40 at A3 fired at German Rifle at C3; targeting roll (d10x10): target 6, " +
      "rolled 100: hit; roll for effect (2d10): target 12, rolled 20: hit")
    expect(game.moraleChecksNeeded).toStrictEqual([
      { unit: unit, from: [new Coordinate(0, 2)], to: new Coordinate(2, 2), incendiary: false },
    ])

    expect(game.initiativeCheck).toBe(false)
  })

  test("multiple units moving", () => {
    const game = createGame()
    const map = game.scenario.map
    const unit = new Unit(testGInf)
    unit.id = "test1"
    unit.select()
    map.addCounter(new Coordinate(4, 2), unit)
    const unit2 = new Unit(testGInf)
    unit2.id = "test2"
    map.addCounter(new Coordinate(4, 2), unit2)

    const other = new Unit(testRTank)
    other.id = "other1"
    other.facing = 4
    other.turretFacing = 4
    const oloc = new Coordinate(0, 2)
    map.addCounter(oloc, other)
    organizeStacks(map)

    game.startMove()

    select(map, {
      counter: map.countersAt(new Coordinate(4, 2))[1],
      target: { type: "map", xy: new Coordinate(4, 2) }
    }, () => {})
    expect(unit2.selected).toBe(true)

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
    const counters1 = map.countersAt(new Coordinate(3, 2))
    expect(counters1.length).toBe(2)
    expect(counters1[0].unit.ghost).toBe(true)
    const counters2 = map.countersAt(new Coordinate(2, 2))
    expect(counters2.length).toBe(2)
    expect(counters2[0].unit.ghost).toBe(true)

    expect(game.reactionFire).toBe(true)
    expect(reactionFireHexes(game)).toStrictEqual([
      { x: 3, y: 2, facing: undefined, turret: undefined },
      { x: 2, y: 2, facing: undefined, turret: undefined },
      { x: 1, y: 2, facing: undefined, turret: undefined },
    ])

    select(map, {
      counter: map.countersAt(new Coordinate(2, 2))[0],
      target: { type: "map", xy: new Coordinate(2, 2) }
    }, () => {})
    const ghost = counters2[0].unit
    expect(ghost.targetSelected).toBe(true)

    vi.spyOn(Math, "random").mockReturnValue(0.99)
    game.finishFire()
    Math.random = original

    expect(game.reactionFire).toBe(false)
    expect(game.lastAction?.type).toBe("reaction_fire")
    expect(game.lastAction?.stringValue).toBe(
      "Soviet T-34 M40 at A3 fired at German Rifle, Rifle at C3; targeting roll (d10x10): target 6, " +
      "rolled 100: hit; roll for effect (2d10): target 12, rolled 20: hit")
    expect(game.moraleChecksNeeded).toStrictEqual([
      { unit: unit, from: [new Coordinate(0, 2)], to: new Coordinate(2, 2), incendiary: false },
      { unit: unit2, from: [new Coordinate(0, 2)], to: new Coordinate(2, 2), incendiary: false },
    ])

    expect(game.initiativeCheck).toBe(false)
  })

  test("multiple units moving, plus extra targeting", () => {
    const game = createGame()
    const map = game.scenario.map
    const unit = new Unit(testGInf)
    unit.id = "test1"
    unit.select()
    map.addCounter(new Coordinate(4, 2), unit)
    const unit2 = new Unit(testGInf)
    unit2.id = "test2"
    map.addCounter(new Coordinate(4, 2), unit2)
    const unit3 = new Unit(testGInf)
    unit3.id = "test3"
    map.addCounter(new Coordinate(2, 2), unit3)

    const other = new Unit(testRTank)
    other.id = "other1"
    other.facing = 4
    other.turretFacing = 4
    const oloc = new Coordinate(0, 2)
    map.addCounter(oloc, other)
    organizeStacks(map)

    game.startMove()

    select(map, {
      counter: map.countersAt(new Coordinate(4, 2))[1],
      target: { type: "map", xy: new Coordinate(4, 2) }
    }, () => {})
    expect(unit2.selected).toBe(true)

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
    const counters1 = map.countersAt(new Coordinate(3, 2))
    expect(counters1.length).toBe(2)
    expect(counters1[0].unit.ghost).toBe(true)
    const counters2 = map.countersAt(new Coordinate(2, 2))
    expect(counters2.length).toBe(3)
    expect(counters2[0].unit.ghost).toBe(undefined)
    expect(counters2[1].unit.ghost).toBe(true)

    expect(game.reactionFire).toBe(true)
    expect(reactionFireHexes(game)).toStrictEqual([
      { x: 3, y: 2, facing: undefined, turret: undefined },
      { x: 2, y: 2, facing: undefined, turret: undefined },
      { x: 1, y: 2, facing: undefined, turret: undefined },
    ])

    select(map, {
      counter: map.countersAt(new Coordinate(2, 2))[1],
      target: { type: "map", xy: new Coordinate(2, 2) }
    }, () => {})
    const ghost = counters2[1].unit
    expect(ghost.targetSelected).toBe(true)
    expect(unit3.targetSelected).toBe(true)

    vi.spyOn(Math, "random").mockReturnValue(0.99)
    game.finishFire()
    Math.random = original

    expect(game.reactionFire).toBe(false)
    expect(game.lastAction?.type).toBe("reaction_fire")
    expect(game.lastAction?.stringValue).toBe(
      "Soviet T-34 M40 at A3 fired at German Rifle, Rifle, Rifle at C3; targeting roll (d10x10): target 6, " +
      "rolled 100: hit; roll for effect (2d10): target 12, rolled 20: hit")
    expect(game.moraleChecksNeeded).toStrictEqual([
      { unit: unit3, from: [new Coordinate(0, 2)], to: new Coordinate(2, 2), incendiary: false },
      { unit: unit, from: [new Coordinate(0, 2)], to: new Coordinate(2, 2), incendiary: false },
      { unit: unit2, from: [new Coordinate(0, 2)], to: new Coordinate(2, 2), incendiary: false },
    ])

    expect(game.initiativeCheck).toBe(false)
  })

  test("ghosts for dropping are correct", () => {
    const game = createGame()
    const map = game.scenario.map
    const unit = new Unit(testGInf)
    unit.id = "test1"
    unit.select()
    map.addCounter(new Coordinate(4, 2), unit)
    const unit2 = new Unit(testGMG)
    unit2.id = "test2"
    map.addCounter(new Coordinate(4, 2), unit2)

    const other = new Unit(testRTank)
    other.id = "other1"
    other.facing = 4
    other.turretFacing = 4
    const oloc = new Coordinate(0, 2)
    map.addCounter(oloc, other)
    organizeStacks(map)

    game.startMove()

    const state = game.gameActionState as GameActionState
    const move = state.move as MoveActionState

    game.move(3, 2)
    move.droppingMove = true

    select(map, {
      counter: map.countersAt(new Coordinate(4, 2))[1],
      target: { type: "map", xy: new Coordinate(4, 2) }
    }, () => {})
    expect(unit2.selected).toBe(false)
    expect(unit2.dropSelected).toBe(true)

    move.droppingMove = false
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
    const counters1 = map.countersAt(new Coordinate(3, 2))
    expect(counters1.length).toBe(2)
    expect(counters1[0].unit.ghost).toBe(undefined)
    expect(counters1[0].unit.name).toBe("MG 08/15")
    expect(counters1[1].unit.ghost).toBe(true)
    expect(counters1[1].unit.name).toBe("Rifle")
    const counters2 = map.countersAt(new Coordinate(2, 2))
    expect(counters2.length).toBe(1)
    expect(counters2[0].unit.ghost).toBe(true)

    expect(game.reactionFire).toBe(true)
    expect(reactionFireHexes(game)).toStrictEqual([
      { x: 3, y: 2, facing: undefined, turret: undefined },
      { x: 2, y: 2, facing: undefined, turret: undefined },
      { x: 1, y: 2, facing: undefined, turret: undefined },
    ])
  })

  test("ghosts for loading are correct", () => {
    const game = createGame()
    const map = game.scenario.map
    const unit = new Unit(testGInf)
    unit.id = "test1"
    unit.select()
    map.addCounter(new Coordinate(4, 2), unit)
    const unit2 = new Unit(testGMG)
    unit2.id = "test2"
    try {
      map.addCounter(new Coordinate(3, 2), unit2)
    } catch(err) {
      // Warning expected for placing a unit by itself
      expect(err instanceof WarningActionError).toBe(true)
    }

    const other = new Unit(testRTank)
    other.id = "other1"
    other.facing = 4
    other.turretFacing = 4
    const oloc = new Coordinate(0, 2)
    map.addCounter(oloc, other)
    organizeStacks(map)

    game.startMove()

    const state = game.gameActionState as GameActionState
    const move = state.move as MoveActionState

    game.move(3, 2)
    move.loadingMove = true

    select(map, {
      counter: map.countersAt(new Coordinate(3, 2))[0],
      target: { type: "map", xy: new Coordinate(3, 2) }
    }, () => {})
    expect(unit2.selected).toBe(false)
    expect(unit2.loadedSelected).toBe(true)

    move.loadingMove = false
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
    const counters1 = map.countersAt(new Coordinate(3, 2))
    expect(counters1.length).toBe(1)
    expect(counters1[0].unit.ghost).toBe(true)
    expect(counters1[0].unit.name).toBe("Rifle")
    const counters2 = map.countersAt(new Coordinate(2, 2))
    expect(counters2.length).toBe(2)
    expect(counters2[0].unit.ghost).toBe(true)
    expect(counters2[0].unit.name).toBe("Rifle")
    expect(counters2[1].unit.ghost).toBe(true)
    expect(counters2[1].unit.name).toBe("MG 08/15")
    const counters3 = map.countersAt(new Coordinate(1, 2))
    expect(counters3.length).toBe(2)
    expect(counters3[0].unit.ghost).toBe(undefined)
    expect(counters3[0].unit.name).toBe("Rifle")
    expect(counters3[1].unit.ghost).toBe(undefined)
    expect(counters3[1].unit.name).toBe("MG 08/15")

    expect(game.reactionFire).toBe(true)
    expect(reactionFireHexes(game)).toStrictEqual([
      { x: 3, y: 2, facing: undefined, turret: undefined },
      { x: 2, y: 2, facing: undefined, turret: undefined },
      { x: 1, y: 2, facing: undefined, turret: undefined },
    ])
  })

  test("hit, morale check shorts move for unit", () => {
    const game = createGame()
    const map = game.scenario.map
    const unit = new Unit(testGInf)
    unit.id = "test1"
    unit.select()
    map.addCounter(new Coordinate(4, 2), unit)

    const other = new Unit(testRTank)
    other.id = "other1"
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

    game.startInitiative()

    const original = Math.random
    vi.spyOn(Math, "random").mockReturnValue(0.99)
    game.finishInitiative()
    Math.random = original

    expect(game.reactionFireCheck).toBe(true)

    game.startReaction()
    other.select()
    game.startFire()
    const counters2 = map.countersAt(new Coordinate(2, 2))
    expect(counters2.length).toBe(1)
    expect(counters2[0].unit.ghost).toBe(true)

    select(map, {
      counter: map.countersAt(new Coordinate(2, 2))[0],
      target: { type: "map", xy: new Coordinate(2, 2) }
    }, () => {})
    const ghost = counters2[0].unit
    expect(ghost.targetSelected).toBe(true)

    vi.spyOn(Math, "random").mockReturnValue(0.99)
    game.finishFire()
    Math.random = original

    expect(game.reactionFire).toBe(false)
    expect(game.lastAction?.type).toBe("reaction_fire")
    expect(game.lastAction?.stringValue).toBe(
      "Soviet T-34 M40 at A3 fired at German Rifle at C3; targeting roll (d10x10): target 6, " +
      "rolled 100: hit; roll for effect (2d10): target 12, rolled 20: hit")
    expect(game.moraleChecksNeeded).toStrictEqual([
      { unit: unit, from: [new Coordinate(0, 2)], to: new Coordinate(2, 2), incendiary: false },
    ])

    expect(game.initiativeCheck).toBe(false)

    game.startMoraleCheck()

    vi.spyOn(Math, "random").mockReturnValue(0.01)
    game.finishMoraleCheck()
    Math.random = original

    expect(game.lastAction?.stringValue).toBe(
      "German morale check for Rifle (2d10): target 12, rolled 2, unit breaks, move short at C3")
    expect(game.moraleChecksNeeded).toStrictEqual([])
    const counter = game.findCounterById(unit.id)
    expect(counter?.hex?.x).toBe(2)
    expect(counter?.hex?.y).toBe(2)
  })

  test("ghost directions are correct, and vehicle is removed", () => {
    const game = createGame()
    const map = game.scenario.map
    const unit = new Unit(testGTank)
    unit.id = "test1"
    unit.facing = 1
    unit.turretFacing = 2
    unit.select()
    map.addCounter(new Coordinate(4, 2), unit)

    const other = new Unit(testRTank)
    other.id = "other1"
    const oloc = new Coordinate(0, 2)
    map.addCounter(oloc, other)
    organizeStacks(map)

    expect(unit.facing).toBe(1)
    expect(unit.turretFacing).toBe(2)

    game.startMove()
    const state = game.gameActionState as GameActionState
    const move = state.move as MoveActionState
    expect(move.path.length).toBe(1)
    expect(move.path[0]).toStrictEqual({ x: 4, y: 2, facing: 1, turret: 2 })
    game.move(3, 2)
    expect(move.path.length).toBe(2)
    expect(move.path[1]).toStrictEqual({ x: 3, y: 2, facing: 1, turret: 2 })
    game.move(2, 2)
    expect(move.path.length).toBe(3)
    expect(move.path[2]).toStrictEqual({ x: 2, y: 2, facing: 1, turret: 2 })
    game.moveRotate(2, 2, 2)
    expect(move.path.length).toBe(4)
    expect(move.path[3]).toStrictEqual({ x: 2, y: 2, facing: 2, turret: 3 })
    game.move(1, 1)
    expect(move.path.length).toBe(5)
    expect(move.path[4]).toStrictEqual({ x: 1, y: 1, facing: 2, turret: 3 })
    game.finishMove()
    expect(unit.facing).toBe(2)
    expect(unit.turretFacing).toBe(3)

    game.startInitiative()

    const original = Math.random
    vi.spyOn(Math, "random").mockReturnValue(0.99)
    game.finishInitiative()
    Math.random = original

    expect(game.reactionFireCheck).toBe(true)

    game.startReaction()
    other.select()
    game.startFire()
    const counters1 = map.countersAt(new Coordinate(3, 2))
    expect(counters1.length).toBe(2)
    expect(counters1[0].unit.ghost).toBe(true)
    expect(counters1[0].hasMarker).toBe(true)
    expect(counters1[1].unit.ghost).toBe(true)
    expect(counters1[1].unit.name).toBe("PzKpfw 35(t)")
    expect(counters1[1].unit.facing).toBe(1)
    expect(counters1[1].unit.turretFacing).toBe(2)
    const counters2 = map.countersAt(new Coordinate(2, 2))
    expect(counters2.length).toBe(2)
    expect(counters2[0].unit.ghost).toBe(true)
    expect(counters2[0].hasMarker).toBe(true)
    expect(counters2[1].unit.ghost).toBe(true)
    expect(counters2[1].unit.name).toBe("PzKpfw 35(t)")
    expect(counters2[1].unit.facing).toBe(2)
    expect(counters2[1].unit.turretFacing).toBe(3)
    const counters3 = map.countersAt(new Coordinate(1, 1))
    expect(counters3.length).toBe(2)
    expect(counters3[0].unit.ghost).toBe(undefined)
    expect(counters3[0].hasMarker).toBe(true)
    expect(counters3[1].unit.ghost).toBe(undefined)
    expect(counters3[1].unit.name).toBe("PzKpfw 35(t)")
    expect(counters3[1].unit.facing).toBe(2)
    expect(counters3[1].unit.turretFacing).toBe(3)

    select(map, {
      counter: map.countersAt(new Coordinate(2, 2))[0],
      target: { type: "map", xy: new Coordinate(2, 2) }
    }, () => {})
    const ghost = counters2[1].unit
    expect(ghost.targetSelected).toBe(true)

    vi.spyOn(Math, "random").mockReturnValue(0.99)
    game.finishFire()
    Math.random = original

    expect(game.reactionFire).toBe(false)
    expect(game.lastAction?.type).toBe("reaction_fire")
    expect(game.lastAction?.stringValue).toBe(
      "Soviet T-34 M40 at A3 fired at German PzKpfw 35(t) at C3; targeting roll (d10x10): target 6, " +
      "rolled 100: hit; hit location roll (d10): 10 (hull); penetration roll (2d10): target 9, " +
      "rolled 20: succeeded, vehicle destroyed")
    expect(game.moraleChecksNeeded).toStrictEqual([])
    expect(unit.isWreck).toBe(true)

    const counter = game.findCounterById(unit.id)
    expect(counter?.hex?.x).toBe(2)
    expect(counter?.hex?.y).toBe(2)
  })

  test("defer smoke", () => {
    // Maybe?
  })
});
