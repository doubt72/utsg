import { describe, expect, test, vi } from "vitest";
import { createBlankGame, testGInf, testGLdr, testGMG } from "./testHelpers";
import { Coordinate, unitStatus } from "../../utilities/commonTypes";
import Unit from "../Unit";
import RallyAction from "../actions/RallyAction";
import RallyState from "./state/RallyState";
import { gamePhaseType } from "../support/gamePhase";
import organizeStacks from "../support/organizeStacks";
import Counter from "../Counter";

describe("rally test", () => {
  test("skips if no broken units", () => {
    const game = createBlankGame()
    const map = game.scenario.map

    expect(map.anyBrokenUnits(1)).toBe(false)
  })

  test("doesn't skip if unit broken", () => {
    const game = createBlankGame()
    const map = game.scenario.map
    const unit = new Unit(testGInf)
    unit.id = "test"
    unit.status = unitStatus.Broken
    map.addCounter(new Coordinate(0,0), unit)

    expect(map.anyBrokenUnits(2)).toBe(true)
  })

  test("skips if free rally used", () => {
    const game = createBlankGame()
    const map = game.scenario.map
    const unit = new Unit(testGInf)
    unit.id = "test"
    unit.status = unitStatus.Broken
    map.addCounter(new Coordinate(0,0), unit)

    const action = new RallyAction(
      { user: "", player: 1,
        data: {
          old_initiative: 1, action: "rally", rally_data: {
            freeRally: true, leaderMod: 0, terrainMod: 0, nextToEnemy: false,
          }, dice_result: [ { result: 0, type: "2d10" } ],
          target: [ { x: 0, y: 0, id: "test", status: unitStatus.Broken } ]
        }
      },
      game, game.actions.length
    )
    game.actions.push(action)
    expect(map.anyBrokenUnits(2)).toBe(false)
  })

  test("rally succeeds", () => {
    const game = createBlankGame()
    game.phase = gamePhaseType.PrepRally
    game.setCurrentPlayer(2)
    const map = game.scenario.map
    const unit = new Unit(testGInf)
    unit.id = "test"
    unit.status = unitStatus.Broken
    map.addCounter(new Coordinate(0,0), unit)

    expect(map.anyBrokenUnits(2)).toBe(true)

    game.gameState = new RallyState(game)

    unit.select()

    const original = Math.random
    vi.spyOn(Math, "random").mockReturnValue(0.99)
    game.gameState.finish()
    Math.random = original

    expect(unit.status).toBe(unitStatus.Normal)
    const index = game.actions.length - 7
    expect(game.actions[index].type).toBe("rally")
    expect(game.actions[index].stringValue).toBe(
      "rally check at A1: needed 15, got 20, passed: Rifle rallies"
    )
    expect(map.anyBrokenUnits(2)).toBe(false)
    expect(game.lastAction?.type).toBe("phase")
  })

  test("rally fails", () => {
    const game = createBlankGame()
    game.phase = gamePhaseType.PrepRally
    game.setCurrentPlayer(2)
    const map = game.scenario.map
    const unit = new Unit(testGInf)
    unit.id = "test"
    unit.status = unitStatus.Broken
    map.addCounter(new Coordinate(0,0), unit)

    expect(map.anyBrokenUnits(2)).toBe(true)

    game.gameState = new RallyState(game)

    unit.select()

    const original = Math.random
    vi.spyOn(Math, "random").mockReturnValue(0.01)
    game.gameState.finish()
    Math.random = original

    expect(unit.status).toBe(unitStatus.Broken)
    const index = game.actions.length - 1
    expect(game.actions[index].type).toBe("rally")
    expect(game.actions[index].stringValue).toBe(
      "rally check at A1: needed 15, got 2, failed: Rifle fails to rally"
    )
    expect(map.anyBrokenUnits(2)).toBe(true)
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

    expect(map.anyBrokenUnits(2)).toBe(true)

    game.gameState = new RallyState(game)

    unit2.select()

    const original = Math.random
    vi.spyOn(Math, "random").mockReturnValue(0.99)
    game.gameState.finish()
    Math.random = original

    expect(unit1.status).toBe(unitStatus.Normal)
    const index = game.actions.length - 7
    expect(game.actions[index].type).toBe("rally")
    expect(game.actions[index].stringValue).toBe(
      "rally check at A1: needed 15, got 20, passed: MG 08/15 unbroken"
    )
    expect(map.anyBrokenUnits(2)).toBe(false)
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

    expect(map.anyBrokenUnits(2)).toBe(true)

    game.gameState = new RallyState(game)

    unit2.select()

    const original = Math.random
    vi.spyOn(Math, "random").mockReturnValue(0.01)
    game.gameState.finish()
    Math.random = original

    expect(unit1.status).toBe(unitStatus.Normal)
    const index = game.actions.length - 1
    expect(game.actions[index].type).toBe("rally")
    expect(game.actions[index].stringValue).toBe(
      "rally check at A1: needed 15, got 2, failed: MG 08/15 remains broken"
    )
    expect(map.anyBrokenUnits(2)).toBe(true)
  })

  test("rally with leader doesn't use free rally", () => {
    const game = createBlankGame()
    game.phase = gamePhaseType.PrepRally
    game.setCurrentPlayer(2)
    const map = game.scenario.map
    const unit1 = new Unit(testGInf)
    unit1.id = "test1"
    unit1.status = unitStatus.Broken
    map.addCounter(new Coordinate(0,0), unit1)
    const unit2 = new Unit(testGInf)
    unit2.id = "test2"
    unit2.status = unitStatus.Broken
    map.addCounter(new Coordinate(0,0), unit2)
    const unit3 = new Unit(testGLdr)
    unit3.id = "test3"
    map.addCounter(new Coordinate(0,0), unit3)
    organizeStacks(map)

    expect(map.anyBrokenUnits(2)).toBe(true)

    game.gameState = new RallyState(game)

    unit1.select()

    const original = Math.random
    vi.spyOn(Math, "random").mockReturnValue(0.99)
    game.gameState.finish()
    Math.random = original

    expect(unit1.status).toBe(unitStatus.Normal)
    const action = game.actions[game.actions.length - 1] as RallyAction
    expect(action.type).toBe("rally")
    expect(action.freeRally).toBe(true)
    expect(action.stringValue).toBe(
      "rally check at A1: needed 13, got 20, passed: Rifle rallies"
    )
    expect(map.anyBrokenUnits(2)).toBe(true)
    expect(game.lastAction?.type).toBe("rally")
  })

  test("can't rally twice", () => {
    const game = createBlankGame()
    game.phase = gamePhaseType.PrepRally
    game.setCurrentPlayer(2)
    const map = game.scenario.map
    const unit1 = new Unit(testGInf)
    unit1.id = "test1"
    unit1.status = unitStatus.Broken
    map.addCounter(new Coordinate(0,0), unit1)
    const unit2 = new Unit(testGInf)
    unit2.id = "test2"
    unit2.status = unitStatus.Broken
    map.addCounter(new Coordinate(0,0), unit2)
    const unit3 = new Unit(testGLdr)
    unit3.id = "test3"
    map.addCounter(new Coordinate(0,0), unit3)
    organizeStacks(map)

    expect(map.anyBrokenUnits(2)).toBe(true)

    game.gameState = new RallyState(game)

    unit1.select()

    const original = Math.random
    vi.spyOn(Math, "random").mockReturnValue(0.01)
    game.gameState.finish()
    Math.random = original

    expect(unit1.status).toBe(unitStatus.Broken)
    const action = game.actions[game.actions.length - 1] as RallyAction
    expect(action.type).toBe("rally")
    expect(action.freeRally).toBe(true)
    expect(action.stringValue).toBe(
      "rally check at A1: needed 13, got 2, failed: Rifle fails to rally"
    )
    expect(map.anyBrokenUnits(2)).toBe(true)

    expect(unit1.selected).toBe(false)
    game.gameState = new RallyState(game)
    game.gameState.select({
      target: { type: "map", xy: new Coordinate(0,0) },
      counter: new Counter(new Coordinate(0,0), unit1)
    }, () => {})
    expect(unit1.selected).toBe(false)
    expect(game.messageQueue[0]).toBe("unit already attempted to rally")
  })

  test("advances on pass", () => {
    const game = createBlankGame()
    game.phase = gamePhaseType.PrepRally
    game.setCurrentPlayer(2)
    const map = game.scenario.map
    const unit = new Unit(testGInf)
    unit.id = "test"
    unit.status = unitStatus.Broken
    map.addCounter(new Coordinate(0,0), unit)

    expect(map.anyBrokenUnits(2)).toBe(true)

    game.gameState = new RallyState(game)
    const state = game.gameState as RallyState
    state.pass()

    const index = game.actions.length - 7
    expect(game.actions[index].type).toBe("rally_pass")
    expect(game.actions[index].stringValue).toBe(
      "German passed additional rally checks"
    )
    expect(game.lastAction?.type).toBe("phase")
  })
})
