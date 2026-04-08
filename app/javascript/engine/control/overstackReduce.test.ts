import { describe, expect, test } from "vitest";
import { createBlankGame, testGInf, testGMG, testGTruck, testRInf, testRMG, testRTank } from "./testHelpers";
import Unit from "../Unit";
import { Coordinate } from "../../utilities/commonTypes";
import OverstackState from "./state/OverstackState";
import { gamePhaseType } from "../support/gamePhase";
import organizeStacks from "../support/organizeStacks";
import OverstackReduceAction from "../actions/OverstackReduceAction";
import StackingActionError from "../actions/StackingActionError";

describe("overstack reduction", () => {
  test("skips if nothing overstacked", () => {
    const game = createBlankGame()
    game.phase = gamePhaseType.CleanupOverstack
    game.setGameState(new OverstackState(game))
    const map = game.scenario.map

    expect(map.anyOverstackedUnits(1)).toBe(false)
  })

  test("doesn't skip if units overstacked", () => {
    const game = createBlankGame()
    game.phase = gamePhaseType.CleanupOverstack
    game.setGameState(new OverstackState(game))
    const map = game.scenario.map
    const unit1 = new Unit(testGInf)
    unit1.id = "test1"
    map.addCounter(new Coordinate(0,0), unit1)
    const unit2 = new Unit(testGInf)
    unit2.id = "test2"
    map.addCounter(new Coordinate(0,0), unit2)
    const unit3 = new Unit(testGInf)
    unit3.id = "test3"
    map.addCounter(new Coordinate(0,0), unit3)

    expect(map.anyOverstackedUnits(1)).toBe(false)
    expect(map.anyOverstackedUnits(2)).toBe(true)
  })

  test("wrecks and operated units count as overstacked", () => {
    const game = createBlankGame()
    game.phase = gamePhaseType.CleanupOverstack
    game.setGameState(new OverstackState(game))
    const map = game.scenario.map
    const unit1 = new Unit(testRMG)
    unit1.id = "test1"
    const loc = new Coordinate(0,0)
    try {
      map.addCounter(loc, unit1)
    } catch(err) {
      // Warning expected for placing a unit by itself
      expect(err instanceof StackingActionError).toBe(true)
    }
    const unit2 = new Unit(testGInf)
    unit2.id = "test2"
    map.addCounter(loc, unit2)
    const unit3 = new Unit(testRTank)
    unit3.id = "test3"
    unit3.wreck()
    unit3.size = 6
    map.addCounter(loc, unit3)
    expect(map.anyOverstackedUnits(2)).toBe(true)
  })

  test("wreck counts towards stacking", () => {
    const game = createBlankGame()
    game.phase = gamePhaseType.CleanupOverstack
    game.setGameState(new OverstackState(game))
    const map = game.scenario.map
    const unit1 = new Unit(testGInf)
    unit1.id = "test1"
    map.addCounter(new Coordinate(0,0), unit1)
    const unit2 = new Unit(testGInf)
    unit2.id = "test2"
    map.addCounter(new Coordinate(0,0), unit2)
    const unit3 = new Unit(testRTank)
    unit3.id = "test3"
    unit3.wreck()
    map.addCounter(new Coordinate(0,0), unit3)

    expect(map.anyOverstackedUnits(1)).toBe(false)
    expect(map.anyOverstackedUnits(2)).toBe(true)
  })

  test("close combat stacks not overstacked", () => {
    const game = createBlankGame()
    game.phase = gamePhaseType.CleanupOverstack
    game.setGameState(new OverstackState(game))
    const map = game.scenario.map
    const unit1 = new Unit(testGInf)
    unit1.id = "test1"
    map.addCounter(new Coordinate(0,0), unit1)
    const unit2 = new Unit(testGInf)
    unit2.id = "test2"
    map.addCounter(new Coordinate(0,0), unit2)
    const unit3 = new Unit(testRInf)
    unit3.id = "test3"
    map.addCounter(new Coordinate(0,0), unit3)

    expect(map.anyOverstackedUnits(1)).toBe(false)
    expect(map.anyOverstackedUnits(2)).toBe(false)
  })

  test("reduction removes unit", () => {
    const game = createBlankGame()
    game.phase = gamePhaseType.CleanupOverstack
    game.setGameState(new OverstackState(game))
    game.internalCurrentPlayer = 2
    const map = game.scenario.map
    const unit1 = new Unit(testGInf)
    unit1.id = "test1"
    const loc = new Coordinate(0,0)
    map.addCounter(loc, unit1)
    const unit2 = new Unit(testGInf)
    unit2.id = "test2"
    map.addCounter(loc, unit2)
    const unit3 = new Unit(testGInf)
    unit3.id = "test3"
    map.addCounter(loc, unit3)
    organizeStacks(map)

    unit2.select()
    expect(unit2.selected).toBe(true)
    game.gameState?.finish()
    expect(map.anyOverstackedUnits(2)).toBe(false)
    expect(game.eliminatedUnits[0].id).toBe("test2")

    let units = map.countersAt(loc)
    expect(units.length).toBe(2)
    expect(units[0].unit.id).toBe("test1")
    expect(units[1].unit.id).toBe("test3")

    const action = game.actions[0]
    expect(action.type).toBe("overstack_reduce")

    // Ignoring the fact that we can't get to this action to undo anymore
    action.undo()
    expect(game.eliminatedUnits.length).toBe(0)
    units = map.countersAt(loc)
    expect(units.length).toBe(3)
    expect(units[0].unit.id).toBe("test1")
    expect(units[1].unit.id).toBe("test3")
    expect(units[2].unit.id).toBe("test2")
  })

  test("undo replaces unit with parents/children correctly", () => {
    const game = createBlankGame()
    game.phase = gamePhaseType.CleanupOverstack
    game.setGameState(new OverstackState(game))
    game.internalCurrentPlayer = 2
    const map = game.scenario.map
    const unit1 = new Unit(testGTruck)
    unit1.id = "truck"
    const loc = new Coordinate(0,0)
    map.addCounter(loc, unit1)
    const unit2 = new Unit(testGInf)
    unit2.id = "inf"
    map.addCounter(loc, unit2)
    const unit3 = new Unit(testGMG)
    unit3.id = "mg"
    map.addCounter(loc, unit3)
    organizeStacks(map)

    unit2.select()
    expect(unit2.selected).toBe(true)
    game.gameState?.finish()
    expect(map.anyOverstackedUnits(2)).toBe(false)
    const unit = game.eliminatedUnits[0] as Unit
    expect(unit.id).toBe("inf")
    expect(unit.parent).toBe(undefined)

    let units = map.countersAt(loc)
    expect(units.length).toBe(2)
    expect(units[0].unit.id).toBe("mg")
    expect(units[0].unit.parent).toBe(undefined)
    expect(units[1].unit.id).toBe("truck")
    expect(units[1].unit.children).toStrictEqual([])

    const action = game.actions[0] as OverstackReduceAction
    expect(action.target.parent).toBe("truck")
    expect(action.target.children).toStrictEqual(["mg"])
    expect(action.type).toBe("overstack_reduce")

    // Ignoring the fact that we can't get to this action to undo anymore
    action.undo()
    expect(game.eliminatedUnits.length).toBe(0)
    units = map.countersAt(loc)
    expect(units.length).toBe(3)
    expect(units[0].unit.id).toBe("truck")
    expect(units[0].unit.children[0].id).toBe("inf")
    expect(units[1].unit.id).toBe("inf")
    expect(units[1].unit.parent?.id).toBe("truck")
    expect(units[1].unit.children[0].id).toBe("mg")
    expect(units[2].unit.id).toBe("mg")
    expect(units[2].unit.parent?.id).toBe("inf")
  })
})