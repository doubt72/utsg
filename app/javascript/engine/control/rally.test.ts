import { describe, expect, test, vi } from "vitest";
import { createBlankGame, testGInf, testGLdr, testGMG } from "./testHelpers";
import { Coordinate, unitStatus } from "../../utilities/commonTypes";
import Unit from "../Unit";
import RallyAction from "../actions/RallyAction";
import RallyState, { leaderAtHex } from "./state/RallyState";
import { gamePhaseType } from "../support/gamePhase";
import organizeStacks from "../support/organizeStacks";
import Counter from "../Counter";
import { GameActionUnit } from "../GameAction";

describe("rallying", () => {
  test("skips if no broken units", () => {
    const game = createBlankGame()
    const map = game.scenario.map

    expect(map.anyUnitsCanRally(1)).toBe(false)
  })

  test("doesn't skip if unit broken", () => {
    const game = createBlankGame()
    const map = game.scenario.map
    const unit = new Unit(testGInf)
    unit.id = "test"
    unit.break()
    map.addCounter(new Coordinate(0,0), unit)

    expect(map.anyUnitsCanRally(2)).toBe(true)
  })

  test("skips if free rally used", () => {
    const game = createBlankGame()
    const map = game.scenario.map
    const unit = new Unit(testGInf)
    unit.id = "test"
    unit.break()
    map.addCounter(new Coordinate(0,0), unit)

    const target: GameActionUnit = { x: 0, y: 0, id: "test", name: "Rifle", status: unitStatus.Broken }
    const action = new RallyAction(
      { user: "", player: 1,
        data: {
          old_initiative: 1, action: "rally", rally_data: {
            free_rally: true, infantry: {
              morale_base: 2, leader_mod: 0, terrain_mod: 0, next_to_enemy: false,
            },
          }, dice_result: [ { result: { result: 2, type: "2d10", components: [1, 1] } } ],
          target: [target]
        }
      },
      game, game.actions.length
    )
    game.actions.push(action)
    expect(map.anyUnitsCanRally(2)).toBe(false)
  })

  test("rally succeeds", () => {
    const game = createBlankGame()
    game.phase = gamePhaseType.PrepRally
    game.setCurrentPlayer(2)
    const map = game.scenario.map
    const unit = new Unit(testGInf)
    unit.id = "test"
    unit.break()
    const loc = new Coordinate(0, 0)
    map.addCounter(loc, unit)

    map.toggleVP(loc)
    expect(map.victoryAt(loc)).toBe(1)
    expect(map.anyUnitsCanRally(2)).toBe(true)

    game.setGameState(new RallyState(game))

    unit.select()

    const original = Math.random
    vi.spyOn(Math, "random").mockReturnValue(0.99)
    game.gameState?.finish()
    Math.random = original

    expect(unit.isNormal).toBe(true)
    const action = game.actions[0]
    expect(action.type).toBe("rally")
    expect(action.stringValue).toBe(
      "German rally check at A1: target 11, rolled 20 [2d10: 10 + 10], passed: Rifle rallies"
    )
    expect(map.anyUnitsCanRally(2)).toBe(false)
    expect(game.lastAction?.type).toBe("phase")
    expect(map.victoryAt(loc)).toBe(2)
  })

  test("rally fails", () => {
    const game = createBlankGame()
    game.phase = gamePhaseType.PrepRally
    game.setCurrentPlayer(2)
    const map = game.scenario.map
    const unit = new Unit(testGInf)
    unit.id = "test"
    unit.break()
    map.addCounter(new Coordinate(0,0), unit)

    expect(map.anyUnitsCanRally(2)).toBe(true)

    game.setGameState(new RallyState(game))

    unit.select()

    const original = Math.random
    vi.spyOn(Math, "random").mockReturnValue(0.01)
    game.gameState?.finish()
    Math.random = original

    expect(unit.isBroken).toBe(true)
    expect(game.actions[0].type).toBe("rally")
    expect(game.actions[0].stringValue).toBe(
      "German rally check at A1: target 11, rolled 2 [2d10: 1 + 1], failed: Rifle fails to rally"
    )
    expect(game.actions[1].stringValue).toBe(
      "German rally complete > starting Soviet rally > Soviet rally complete > starting precipitation check " +
      "> no precipitation in scenario, skipping > precipitation check complete > starting main phase"
    )
  })

  test("rally succeeds for mg", () => {
    const game = createBlankGame()
    game.phase = gamePhaseType.PrepRally
    game.setCurrentPlayer(2)
    const map = game.scenario.map
    const unit1 = new Unit(testGInf)
    unit1.id = "test1"
    map.addCounter(new Coordinate(0,0), unit1)
    const unit2 = new Unit(testGMG)
    unit2.id = "test2"
    unit2.jammed = true
    map.addCounter(new Coordinate(0,0), unit2)
    organizeStacks(map)

    expect(map.anyUnitsCanRally(2)).toBe(true)

    game.setGameState(new RallyState(game))

    unit2.select()

    const original = Math.random
    vi.spyOn(Math, "random").mockReturnValue(0.99)
    game.gameState?.finish()
    Math.random = original

    expect(unit1.isNormal).toBe(true)
    const action = game.actions[0]
    expect(action.type).toBe("rally")
    expect(action.stringValue).toBe(
      "German attempt to fix weapon at A1: target 15, rolled 20 [2d10: 10 + 10], passed: MG 08/15 is repaired"
    )
    expect(map.anyUnitsCanRally(2)).toBe(false)
  })

  test("rally fails for mg", () => {
    const game = createBlankGame()
    game.phase = gamePhaseType.PrepRally
    game.setCurrentPlayer(2)
    const map = game.scenario.map
    const unit1 = new Unit(testGInf)
    unit1.id = "test1"
    map.addCounter(new Coordinate(0,0), unit1)
    const unit2 = new Unit(testGMG)
    unit2.id = "test2"
    unit2.jammed = true
    map.addCounter(new Coordinate(0,0), unit2)
    organizeStacks(map)

    expect(map.anyUnitsCanRally(2)).toBe(true)

    game.setGameState(new RallyState(game))

    unit2.select()

    const original = Math.random
    vi.spyOn(Math, "random").mockReturnValue(0.01)
    game.gameState?.finish()
    Math.random = original

    expect(map.countersAt(new Coordinate(0,0)).length).toBe(1)
    const action = game.actions[0]
    expect(action.type).toBe("rally")
    expect(action.stringValue).toBe(
      "German attempt to fix weapon at A1: target 15, rolled 2 [2d10: 1 + 1], catastrophic failure: MG 08/15 is eliminated"
    )
    expect(map.anyUnitsCanRally(2)).toBe(false)
  })

  test("rally with leader doesn't use free rally", () => {
    const game = createBlankGame()
    game.phase = gamePhaseType.PrepRally
    game.setCurrentPlayer(2)
    const map = game.scenario.map
    const unit1 = new Unit(testGInf)
    unit1.id = "test1"
    unit1.break()
    map.addCounter(new Coordinate(0,0), unit1)
    const unit2 = new Unit(testGInf)
    unit2.id = "test2"
    unit2.break()
    map.addCounter(new Coordinate(0,0), unit2)
    const unit3 = new Unit(testGLdr)
    unit3.id = "test3"
    map.addCounter(new Coordinate(0,0), unit3)
    organizeStacks(map)

    expect(map.anyUnitsCanRally(2)).toBe(true)

    game.setGameState(new RallyState(game))
    expect(leaderAtHex(game, 0, 0, game.currentPlayer, undefined)).toBe(true)

    unit1.select()

    const original = Math.random
    vi.spyOn(Math, "random").mockReturnValue(0.99)
    game.gameState?.finish()
    Math.random = original

    expect(unit1.isNormal).toBe(true)
    const action = game.actions[game.actions.length - 1] as RallyAction
    expect(action.type).toBe("rally")
    expect(action.freeRally).toBe(true)
    expect(action.stringValue).toBe(
      "German rally check at A1: target 9, rolled 20 [2d10: 10 + 10], passed: Rifle rallies"
    )
    expect(map.anyUnitsCanRally(2)).toBe(true)
    expect(game.lastAction?.type).toBe("rally")
  })

  test("rally without leader uses free rally", () => {
    const game = createBlankGame()
    game.phase = gamePhaseType.PrepRally
    game.setCurrentPlayer(2)
    const map = game.scenario.map
    const unit1 = new Unit(testGInf)
    unit1.id = "test1"
    unit1.break()
    map.addCounter(new Coordinate(0,0), unit1)
    const unit2 = new Unit(testGInf)
    unit2.id = "test2"
    unit2.break()
    map.addCounter(new Coordinate(0,0), unit2)
    organizeStacks(map)

    expect(map.anyUnitsCanRally(2)).toBe(true)

    game.setGameState(new RallyState(game))
    expect(leaderAtHex(game, 0, 0, game.currentPlayer, undefined)).toBe(false)

    unit1.select()

    const original = Math.random
    vi.spyOn(Math, "random").mockReturnValue(0.99)
    game.gameState?.finish()
    Math.random = original

    expect(unit1.isNormal).toBe(true)
    const action = game.actions[0] as RallyAction
    expect(action.type).toBe("rally")
    expect(action.freeRally).toBe(false)
    expect(action.stringValue).toBe(
      "German rally check at A1: target 11, rolled 20 [2d10: 10 + 10], passed: Rifle rallies"
    )
    expect(game.actions[1].stringValue).toBe(
      "German rally complete > starting Soviet rally > Soviet rally complete > starting precipitation check " +
      "> no precipitation in scenario, skipping > precipitation check complete > starting main phase"
    )
  })

  test("can't rally twice", () => {
    const game = createBlankGame()
    game.phase = gamePhaseType.PrepRally
    game.setCurrentPlayer(2)
    const map = game.scenario.map
    const unit1 = new Unit(testGInf)
    unit1.id = "test1"
    unit1.break()
    map.addCounter(new Coordinate(0,0), unit1)
    const unit2 = new Unit(testGInf)
    unit2.id = "test2"
    unit2.break()
    map.addCounter(new Coordinate(0,0), unit2)
    const unit3 = new Unit(testGLdr)
    unit3.id = "test3"
    map.addCounter(new Coordinate(0,0), unit3)
    organizeStacks(map)

    expect(map.anyUnitsCanRally(2)).toBe(true)

    game.setGameState(new RallyState(game))

    unit1.select()

    const original = Math.random
    vi.spyOn(Math, "random").mockReturnValue(0.01)
    game.gameState?.finish()
    Math.random = original

    expect(unit1.isBroken).toBe(true)
    const action = game.actions[game.actions.length - 1] as RallyAction
    expect(action.type).toBe("rally")
    expect(action.freeRally).toBe(true)
    expect(action.stringValue).toBe(
      "German rally check at A1: target 9, rolled 2 [2d10: 1 + 1], failed: Rifle fails to rally"
    )
    expect(map.anyUnitsCanRally(2)).toBe(true)

    expect(unit1.selected).toBe(false)
    game.setGameState(new RallyState(game))
    game.gameState?.select({
      target: { type: "map", xy: new Coordinate(0,0) },
      counter: new Counter(new Coordinate(0,0), unit1)
    }, () => {})
    expect(unit1.selected).toBe(false)
    expect(game.messageQueue[0]).toBe("unit already attempted to rally")
  })

  test("failed 'free' rally doesn't count for rally check", () => {
    const game = createBlankGame()
    game.phase = gamePhaseType.PrepRally
    const map = game.scenario.map
    const unit1 = new Unit(testGInf)
    unit1.id = "test1"
    unit1.break()
    map.addCounter(new Coordinate(0,0), unit1)
    const unit2 = new Unit(testGLdr)
    unit2.id = "test2"
    map.addCounter(new Coordinate(0,0), unit2)
    const unit3 = new Unit(testGInf)
    unit3.id = "test3"
    unit3.break()
    map.addCounter(new Coordinate(1,0), unit3)
    const unit4 = new Unit(testGInf)
    unit4.id = "test4"
    unit4.break()
    map.addCounter(new Coordinate(2,0), unit4)
    organizeStacks(map)

    expect(map.anyUnitsCanRally(2)).toBe(true)

    game.setGameState(new RallyState(game))

    unit4.select()

    const original = Math.random
    vi.spyOn(Math, "random").mockReturnValue(0.99)
    game.gameState?.finish()
    Math.random = original

    let action = game.actions[0] as RallyAction
    expect(action.type).toBe("rally")
    expect(action.freeRally).toBe(false)
    expect(action.stringValue).toBe("German rally check at C1: target 11, rolled 20 [2d10: 10 + 10], passed: Rifle rallies")

    expect(unit4.isNormal).toBe(true)

    expect(map.anyUnitsCanRally(2)).toBe(true)
    game.setGameState(new RallyState(game))

    unit1.select()

    vi.spyOn(Math, "random").mockReturnValue(0.01)
    game.gameState?.finish()
    Math.random = original

    expect(unit1.isBroken).toBe(true)

    action = game.actions[1] as RallyAction
    expect(action.type).toBe("rally")
    expect(action.freeRally).toBe(true)
    expect(action.stringValue).toBe("German rally check at A1: target 9, rolled 2 [2d10: 1 + 1], failed: Rifle fails to rally")

    expect(game.actions[2].stringValue).toBe(
      "German rally complete > starting Soviet rally > Soviet rally complete > starting precipitation check " +
      "> no precipitation in scenario, skipping > precipitation check complete > starting main phase"
    )
  })

  test("advances on pass", () => {
    const game = createBlankGame()
    game.phase = gamePhaseType.PrepRally
    game.setCurrentPlayer(2)
    const map = game.scenario.map
    const unit = new Unit(testGInf)
    unit.id = "test"
    unit.break()
    map.addCounter(new Coordinate(0,0), unit)

    expect(map.anyUnitsCanRally(2)).toBe(true)

    game.setGameState(new RallyState(game))
    const state = game.gameState as RallyState
    state.pass()

    const action = game.actions[0]
    expect(action.type).toBe("rally_pass")
    expect(action.stringValue).toBe(
      "German passed additional rally checks"
    )
    expect(game.lastAction?.type).toBe("phase")
  })
})
