import { describe, expect, test, vi } from "vitest";
import { createBlankGame, testGGun, testGInf, testGTank, testGTruck, testRInf, testRMG } from "./testHelpers";
import Unit from "../Unit";
import { Coordinate } from "../../utilities/commonTypes";
import { closeProgress } from "../Game";
import CloseCombatState, { closeCombatCasualyNeeded, closeCombatCheck, closeCombatDone } from "./state/CloseCombatState";
import GameAction from "../GameAction";
import select from "./select";
import organizeStacks from "../support/organizeStacks";
import { gamePhaseType } from "../support/gamePhase";

// TODO: fix tests when things implemented
describe("close combat tests", () => {
  test("basic close combat", () => {
    const game = createBlankGame()
    const map = game.scenario.map
    const one = new Unit(testGInf)
    one.id = "one1"
    const loc = new Coordinate(2, 2)
    map.addCounter(loc, one)

    const two = new Unit(testRInf)
    two.id = "two1"
    map.addCounter(loc, two)
    organizeStacks(map)

    game.executeAction(new GameAction({
      user: game.currentUser, player: 1, data: {
        action: "phase", old_initiative: 0, phase_data: {
          old_phase: gamePhaseType.Main, new_phase: gamePhaseType.CleanupCloseCombat,
          old_turn: 1, new_turn: 1, new_player: 2,
        },
      },
    }, game), false)

    expect(closeCombatCheck(game)).toBe(true)
    game.gameState = new CloseCombatState(game)
    expect(game.closeNeeded.length).toBe(1)
    expect(game.closeNeeded[0]).toStrictEqual({
      loc, state: closeProgress.NeedsRoll, iReduce: 0, oReduce: 0,
    })
    expect(game.lastAction?.type).toBe("close_combat_start")
    expect(closeCombatDone(game)).toBe(false)

    select(map, {
      counter: map.countersAt(loc)[0],
      target: { type: "map", xy: loc}
    }, () => {})
    expect(one.selected).toBe(true)
    expect(two.selected).toBe(true)
    expect(closeCombatCasualyNeeded(game)).toBe(false)

    const original = Math.random
    vi.spyOn(Math, "random").mockReturnValue(0.01)
    game.closeCombatState.rollForCombat()
    Math.random = original

    expect(game.closeNeeded.length).toBe(1)
    expect(game.closeNeeded[0]).toStrictEqual({
      loc, state: closeProgress.NeedsCasualties, iReduce: 1, oReduce: 1,
    })
    expect(game.lastAction?.type).toBe("close_combat_roll")
    expect(game.lastAction?.stringValue).toBe(
      "German Rifle battles Soviet Rifle in close combat; German player rolls 1 plus 7 firepower; " +
      "Soviet player rolls 1 plus 7 firepower; each player reduces 1 unit"
    )
    expect(closeCombatDone(game)).toBe(false)
    expect(closeCombatCasualyNeeded(game)).toStrictEqual(loc)

    select(map, {
      counter: map.countersAt(loc)[0],
      target: { type: "map", xy: loc}
    }, () => {})
    expect(one.selected).toBe(true)
    game.closeCombatState.reduceUnit()

    expect(game.closeNeeded.length).toBe(1)
    expect(game.closeNeeded[0]).toStrictEqual({
      loc, state: closeProgress.NeedsCasualties, iReduce: 0, oReduce: 1,
    })
    expect(game.lastAction?.type).toBe("close_combat_reduce")
    expect(game.lastAction?.stringValue).toBe("German Rifle broken")
    expect(one.isBroken).toBe(true)
    expect(closeCombatDone(game)).toBe(false)

    select(map, {
      counter: map.countersAt(loc)[1],
      target: { type: "map", xy: loc}
    }, () => {})
    expect(two.selected).toBe(true)
    game.closeCombatState.reduceUnit()

    expect(game.closeNeeded.length).toBe(1)
    expect(game.closeNeeded[0]).toStrictEqual({
      loc, state: closeProgress.Done, iReduce: 0, oReduce: 0,
    })
    expect(game.lastAction?.type).toBe("close_combat_reduce")
    expect(game.lastAction?.stringValue).toBe("Soviet Rifle broken")
    expect(two.isBroken).toBe(true)
    expect(closeCombatDone(game)).toBe(true)

    game.gameState.finish()
    expect(map.currentSelection.length).toBe(0)
    expect(game.gameState).toBe(undefined)
    expect(game.closeNeeded.length).toBe(0)
    expect(game.lastAction?.stringValue).toBe("close combat complete")

    const all = map.allCounters
    expect(all.length).toBe(2)
    expect(game.eliminatedUnits.length).toBe(0)
  })

  test("various unit types", () => {
    const game = createBlankGame()
    const map = game.scenario.map
    const one = new Unit(testGInf)
    one.id = "one1"
    one.assault = true
    const loc = new Coordinate(2, 2)
    map.addCounter(loc, one)
    const one2 = new Unit(testGTank)
    one2.id = "one2"
    map.addCounter(loc, one2)

    const two = new Unit(testRInf)
    two.id = "two1"
    two.assault = true
    map.addCounter(loc, two)
    const two2 = new Unit(testRMG)
    two2.id = "two2"
    map.addCounter(loc, two2)
    organizeStacks(map)

    game.executeAction(new GameAction({
      user: game.currentUser, player: 1, data: {
        action: "phase", old_initiative: 0, phase_data: {
          old_phase: gamePhaseType.Main, new_phase: gamePhaseType.CleanupCloseCombat, old_turn: 1, new_turn: 1, new_player: 2,
        },
      },
    }, game), false)

    expect(closeCombatCheck(game)).toBe(true)
    game.gameState = new CloseCombatState(game)
    expect(game.closeNeeded.length).toBe(1)
    expect(game.closeNeeded[0]).toStrictEqual({
      loc, state: closeProgress.NeedsRoll, iReduce: 0, oReduce: 0,
    })
    expect(game.lastAction?.type).toBe("close_combat_start")
    expect(closeCombatDone(game)).toBe(false)

    select(map, {
      counter: map.countersAt(loc)[0],
      target: { type: "map", xy: loc}
    }, () => {})
    expect(one.selected).toBe(true)
    expect(two.selected).toBe(true)
    expect(one2.selected).toBe(true)
    expect(two2.selected).toBe(true)

    const original = Math.random
    vi.spyOn(Math, "random").mockReturnValue(0.01)
    game.closeCombatState.rollForCombat()
    Math.random = original

    expect(game.closeNeeded.length).toBe(1)
    expect(game.closeNeeded[0]).toStrictEqual({
      loc, state: closeProgress.NeedsCasualties, iReduce: 1, oReduce: 1,
    })
    expect(game.lastAction?.type).toBe("close_combat_roll")
    expect(game.lastAction?.stringValue).toBe(
      "German Rifle, PzKpfw 35(t) battles Soviet Rifle, DP-27 in close combat; " +
      "German player rolls 1 plus 11 firepower; " +
      "Soviet player rolls 1 plus 11 firepower; each player reduces 1 unit"
    )
    expect(closeCombatDone(game)).toBe(false)
    expect(closeCombatCasualyNeeded(game)).toStrictEqual(loc)

    select(map, {
      counter: map.countersAt(loc)[4],
      target: { type: "map", xy: loc}
    }, () => {})
    expect(one2.selected).toBe(true)
    game.closeCombatState.reduceUnit()

    expect(game.closeNeeded.length).toBe(1)
    expect(game.closeNeeded[0]).toStrictEqual({
      loc, state: closeProgress.NeedsCasualties, iReduce: 0, oReduce: 1,
    })
    expect(game.lastAction?.type).toBe("close_combat_reduce")
    expect(game.lastAction?.stringValue).toBe("German PzKpfw 35(t) eliminated")
    expect(one2.isWreck).toBe(true)
    expect(closeCombatDone(game)).toBe(false)

    select(map, {
      counter: map.countersAt(loc)[2],
      target: { type: "map", xy: loc}
    }, () => {})
    expect(two2.selected).toBe(false)
    select(map, {
      counter: map.countersAt(loc)[1],
      target: { type: "map", xy: loc}
    }, () => {})
    expect(two.selected).toBe(true)
    game.closeCombatState.reduceUnit()

    expect(game.closeNeeded.length).toBe(1)
    expect(game.closeNeeded[0]).toStrictEqual({
      loc, state: closeProgress.Done, iReduce: 0, oReduce: 0,
    })
    expect(game.lastAction?.type).toBe("close_combat_reduce")
    expect(game.lastAction?.stringValue).toBe("Soviet Rifle broken")
    expect(two.isBroken).toBe(true)
    expect(closeCombatDone(game)).toBe(true)

    game.gameState.finish()
    expect(map.currentSelection.length).toBe(0)
    expect(game.gameState).toBe(undefined)
    expect(game.closeNeeded.length).toBe(0)

    const all = map.allCounters
    expect(all.length).toBe(4) // four units (no hull for wreck)
    expect(game.eliminatedUnits.length).toBe(0)
  })

  test("handles multiple losses", () => {
    const game = createBlankGame()
    const map = game.scenario.map
    const one = new Unit(testGInf)
    one.id = "one1"
    const loc = new Coordinate(2, 2)
    map.addCounter(loc, one)
    const one2 = new Unit(testGInf)
    one2.id = "one2"
    map.addCounter(loc, one2)

    const two = new Unit(testRInf)
    two.id = "two1"
    map.addCounter(loc, two)
    organizeStacks(map)

    game.executeAction(new GameAction({
      user: game.currentUser, player: 1, data: {
        action: "phase", old_initiative: 0, phase_data: {
          old_phase: gamePhaseType.Main, new_phase: gamePhaseType.CleanupCloseCombat, old_turn: 1, new_turn: 1, new_player: 2,
        },
      },
    }, game), false)

    expect(closeCombatCheck(game)).toBe(true)
    game.gameState = new CloseCombatState(game)
    expect(game.closeNeeded.length).toBe(1)
    expect(game.closeNeeded[0]).toStrictEqual({
      loc, state: closeProgress.NeedsRoll, iReduce: 0, oReduce: 0,
    })
    expect(game.lastAction?.type).toBe("close_combat_start")
    expect(closeCombatDone(game)).toBe(false)

    select(map, {
      counter: map.countersAt(loc)[0],
      target: { type: "map", xy: loc}
    }, () => {})
    expect(one.selected).toBe(true)
    expect(one2.selected).toBe(true)
    expect(two.selected).toBe(true)

    const original = Math.random
    vi.spyOn(Math, "random").mockReturnValue(0.01)
    game.closeCombatState.rollForCombat()
    Math.random = original

    expect(game.closeNeeded.length).toBe(1)
    expect(game.closeNeeded[0]).toStrictEqual({
      loc, state: closeProgress.NeedsCasualties, iReduce: 0, oReduce: 2,
    })
    expect(game.lastAction?.type).toBe("close_combat_roll")
    expect(game.lastAction?.stringValue).toBe(
      "German Rifle, Rifle battles Soviet Rifle in close combat; " +
      "German player rolls 1 plus 14 firepower; " +
      "Soviet player rolls 1 plus 7 firepower; Soviet player reduces 2 units"
    )
    expect(closeCombatDone(game)).toBe(false)
    expect(closeCombatCasualyNeeded(game)).toStrictEqual(loc)

    select(map, {
      counter: map.countersAt(loc)[2],
      target: { type: "map", xy: loc}
    }, () => {})
    expect(two.selected).toBe(true)
    game.closeCombatState.reduceUnit()

    expect(game.closeNeeded.length).toBe(1)
    expect(game.closeNeeded[0]).toStrictEqual({
      loc, state: closeProgress.NeedsCasualties, iReduce: 0, oReduce: 1,
    })
    expect(game.lastAction?.type).toBe("close_combat_reduce")
    expect(game.lastAction?.stringValue).toBe("Soviet Rifle broken")
    expect(closeCombatDone(game)).toBe(false)
    expect(closeCombatCasualyNeeded(game)).toStrictEqual(loc)

    select(map, {
      counter: map.countersAt(loc)[2],
      target: { type: "map", xy: loc}
    }, () => {})
    expect(two.selected).toBe(true)
    game.closeCombatState.reduceUnit()

    expect(game.closeNeeded.length).toBe(1)
    expect(game.closeNeeded[0]).toStrictEqual({
      loc, state: closeProgress.Done, iReduce: 0, oReduce: 0,
    })
    const action = game.actions[4]
    expect(action.type).toBe("close_combat_reduce")
    expect(action.stringValue).toBe("Soviet Rifle eliminated")
    expect(two.isBroken).toBe(true)
    expect(closeCombatCasualyNeeded(game)).toBe(false)
    expect(closeCombatDone(game)).toBe(true)

    game.gameState.finish()
    expect(map.currentSelection.length).toBe(0)
    expect(game.gameState).toBe(undefined)
    expect(game.closeNeeded.length).toBe(0)

    const all = map.allCounters
    expect(all.length).toBe(2)
    expect(game.eliminatedUnits.length).toBe(1)
  })

  test("handles multiple combats", () => {
    const game = createBlankGame()
    const map = game.scenario.map
    const one = new Unit(testGInf)
    one.id = "one1"
    one.assault = true
    const loc = new Coordinate(2, 2)
    map.addCounter(loc, one)
    const one2 = new Unit(testGInf)
    one2.id = "one2"
    const loc2 = new Coordinate(3, 3)
    map.addCounter(loc2, one2)

    const two = new Unit(testRInf)
    two.id = "two1"
    map.addCounter(loc, two)
    const two2 = new Unit(testRInf)
    two2.id = "two2"
    two2.assault = true
    map.addCounter(loc2, two2)
    organizeStacks(map)

    game.executeAction(new GameAction({
      user: game.currentUser, player: 1, data: {
        action: "phase", old_initiative: 0, phase_data: {
          old_phase: gamePhaseType.Main, new_phase: gamePhaseType.CleanupCloseCombat, old_turn: 1, new_turn: 1, new_player: 2,
        },
      },
    }, game), false)

    expect(closeCombatCheck(game)).toBe(true)
    game.gameState = new CloseCombatState(game)
    expect(game.closeNeeded.length).toBe(2)
    expect(game.closeNeeded[0]).toStrictEqual({
      loc, state: closeProgress.NeedsRoll, iReduce: 0, oReduce: 0,
    })
    expect(game.lastAction?.type).toBe("close_combat_start")
    expect(closeCombatDone(game)).toBe(false)

    select(map, {
      counter: map.countersAt(loc)[0],
      target: { type: "map", xy: loc}
    }, () => {})
    expect(one.selected).toBe(true)
    expect(two.selected).toBe(true)
    expect(one2.selected).toBe(false)
    expect(two2.selected).toBe(false)

    const original = Math.random
    vi.spyOn(Math, "random").mockReturnValue(0.01)
    game.closeCombatState.rollForCombat()
    Math.random = original

    expect(game.closeNeeded.length).toBe(2)
    expect(game.closeNeeded[0]).toStrictEqual({
      loc, state: closeProgress.NeedsCasualties, iReduce: 0, oReduce: 1,
    })
    expect(game.lastAction?.type).toBe("close_combat_roll")
    expect(game.lastAction?.stringValue).toBe(
      "German Rifle battles Soviet Rifle in close combat; " +
      "German player rolls 1 plus 9 firepower; " +
      "Soviet player rolls 1 plus 7 firepower; Soviet player reduces 1 unit"
    )
    expect(closeCombatDone(game)).toBe(false)
    expect(closeCombatCasualyNeeded(game)).toStrictEqual(loc)
    select(map, {
      counter: map.countersAt(loc)[1],
      target: { type: "map", xy: loc}
    }, () => {})
    expect(two.selected).toBe(true)
    game.closeCombatState.reduceUnit()

    expect(game.closeNeeded.length).toBe(2)
    expect(game.closeNeeded[0]).toStrictEqual({
      loc, state: closeProgress.Done, iReduce: 0, oReduce: 0,
    })
    expect(game.closeNeeded[1]).toStrictEqual({
      loc: loc2, state: closeProgress.NeedsRoll, iReduce: 0, oReduce: 0,
    })
    expect(game.lastAction?.type).toBe("close_combat_reduce")
    expect(game.lastAction?.stringValue).toBe("Soviet Rifle broken")
    expect(two.isBroken).toBe(true)
    expect(closeCombatDone(game)).toBe(false)

    select(map, {
      counter: map.countersAt(loc2)[0],
      target: { type: "map", xy: loc2}
    }, () => {})
    expect(one.selected).toBe(false)
    expect(two.selected).toBe(false)
    expect(one2.selected).toBe(true)
    expect(two2.selected).toBe(true)

    vi.spyOn(Math, "random").mockReturnValue(0.99)
    game.closeCombatState.rollForCombat()
    Math.random = original

    expect(game.closeNeeded.length).toBe(2)
    expect(game.closeNeeded[1]).toStrictEqual({
      loc: loc2, state: closeProgress.NeedsCasualties, iReduce: 1, oReduce: 0,
    })
    expect(game.lastAction?.type).toBe("close_combat_roll")
    expect(game.lastAction?.stringValue).toBe(
      "German Rifle battles Soviet Rifle in close combat; " +
      "German player rolls 10 plus 7 firepower; " +
      "Soviet player rolls 10 plus 9 firepower; German player reduces 1 unit"
    )
    expect(closeCombatDone(game)).toBe(false)
    expect(closeCombatCasualyNeeded(game)).toStrictEqual(loc2)
    select(map, {
      counter: map.countersAt(loc2)[0],
      target: { type: "map", xy: loc2}
    }, () => {})
    expect(one2.selected).toBe(true)
    game.closeCombatState.reduceUnit()

    expect(game.closeNeeded.length).toBe(2)
    expect(game.closeNeeded[1]).toStrictEqual({
      loc: loc2, state: closeProgress.Done, iReduce: 0, oReduce: 0,
    })
    expect(game.lastAction?.type).toBe("close_combat_reduce")
    expect(game.lastAction?.stringValue).toBe("German Rifle broken")
    expect(one2.isBroken).toBe(true)
    expect(closeCombatDone(game)).toBe(true)
    expect(closeCombatCasualyNeeded(game)).toBe(false)

    game.gameState.finish()
    expect(map.currentSelection.length).toBe(0)
    expect(game.gameState).toBe(undefined)
    expect(game.closeNeeded.length).toBe(0)

    const all = map.allCounters
    expect(all.length).toBe(4)
    expect(game.eliminatedUnits.length).toBe(0)
  })

  test("vehicles automatically unload", () => {
    const game = createBlankGame()
    const map = game.scenario.map
    const one = new Unit(testGTruck)
    one.id = "one1"
    const loc = new Coordinate(2, 2)
    map.addCounter(loc, one)
    const one2 = new Unit(testGGun)
    one2.id = "one2"
    map.addCounter(loc, one2)
    const one3 = new Unit(testGInf)
    one3.id = "one3"
    map.addCounter(loc, one3)

    const two = new Unit(testRInf)
    two.id = "two1"
    map.addCounter(loc, two)
    const two2 = new Unit(testRMG)
    two2.id = "two2"
    map.addCounter(loc, two2)
    organizeStacks(map)

    game.executeAction(new GameAction({
      user: game.currentUser, player: 1, data: {
        action: "phase", old_initiative: 0, phase_data: {
          old_phase: gamePhaseType.Main, new_phase: gamePhaseType.CleanupCloseCombat, old_turn: 1, new_turn: 1, new_player: 2,
        },
      },
    }, game), false)

    expect(one.children.length).toBe(2)
    expect(one2.parent?.name).toBe("Opel Blitz")
    expect(one3.parent?.name).toBe("Opel Blitz")

    expect(closeCombatCheck(game)).toBe(true)
    game.gameState = new CloseCombatState(game)
    expect(game.closeNeeded.length).toBe(1)
    expect(game.closeNeeded[0]).toStrictEqual({
      loc, state: closeProgress.NeedsRoll, iReduce: 0, oReduce: 0,
    })
    expect(game.lastAction?.type).toBe("close_combat_start")
    expect(closeCombatDone(game)).toBe(false)

    select(map, {
      counter: map.countersAt(loc)[0],
      target: { type: "map", xy: loc}
    }, () => {})
    expect(one.selected).toBe(true)
    expect(one2.selected).toBe(false)
    expect(one3.selected).toBe(true)
    expect(two.selected).toBe(true)
    expect(two2.selected).toBe(true)

    const original = Math.random
    vi.spyOn(Math, "random").mockReturnValue(0.01)
    game.closeCombatState.rollForCombat()
    Math.random = original

    expect(game.closeNeeded.length).toBe(1)
    expect(game.closeNeeded[0]).toStrictEqual({
      loc, state: closeProgress.NeedsCasualties, iReduce: 1, oReduce: 0,
    })
    expect(game.lastAction?.type).toBe("close_combat_roll")
    expect(game.lastAction?.stringValue).toBe(
      "German Opel Blitz, Rifle battles Soviet Rifle, DP-27 in close combat; " +
      "German player rolls 1 plus 8 firepower; " +
      "Soviet player rolls 1 plus 9 firepower; German player reduces 1 unit"
    )
    expect(closeCombatDone(game)).toBe(false)

    expect(one.children.length).toBe(1)
    expect(one2.parent?.name).toBe("Opel Blitz")
    expect(one3.parent).toBe(undefined)

    select(map, {
      counter: map.countersAt(loc)[2],
      target: { type: "map", xy: loc}
    }, () => {})
    expect(one3.selected).toBe(true)
    game.closeCombatState.reduceUnit()

    expect(game.closeNeeded.length).toBe(1)
    expect(game.closeNeeded[0]).toStrictEqual({
      loc, state: closeProgress.Done, iReduce: 0, oReduce: 0,
    })
    expect(game.lastAction?.type).toBe("close_combat_reduce")
    expect(game.lastAction?.stringValue).toBe("German Rifle broken")
    expect(one3.isBroken).toBe(true)
    expect(closeCombatDone(game)).toBe(true)

    game.gameState.finish()
    expect(map.currentSelection.length).toBe(0)
    expect(game.gameState).toBe(undefined)
    expect(game.closeNeeded.length).toBe(0)

    const all = map.allCounters
    expect(all.length).toBe(5)
    expect(game.eliminatedUnits.length).toBe(0)
  })

  test("no combat", () => {
    const game = createBlankGame()
    const map = game.scenario.map
    const one = new Unit(testGInf)
    one.id = "one1"
    map.addCounter(new Coordinate(2, 2), one)

    const two = new Unit(testRInf)
    two.id = "two1"
    map.addCounter(new Coordinate(3, 3), two)
    organizeStacks(map)

    game.executeAction(new GameAction({
      user: game.currentUser, player: 1, data: {
        action: "phase", old_initiative: 0, phase_data: {
          old_phase: gamePhaseType.Main, new_phase: gamePhaseType.CleanupCloseCombat, old_turn: 1, new_turn: 1, new_player: 2,
        },
      },
    }, game), false)

    expect(closeCombatCheck(game)).toBe(false)
    game.gameState = new CloseCombatState(game)

    expect(closeCombatCheck(game)).toBe(false)
    expect(closeCombatCasualyNeeded(game)).toBe(false)
    expect(closeCombatDone(game)).toBe(true)
    const index = game.actions.length
    game.gameState.finish()
    expect(game.actions[index].stringValue).toBe("skipping: no combat to resolve")
  })
})
