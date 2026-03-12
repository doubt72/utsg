import { describe, expect, test, vi } from "vitest";
import { createBlankGame, testGGun, testGInf, testGTank, testGTruck, testJapSNLF, testRInf, testRMG, testUSLdr, testUSMarine, testUSMarineTeam, testUSMG } from "./testHelpers";
import Unit from "../Unit";
import { Coordinate, unitStatus } from "../../utilities/commonTypes";
import { closeProgress } from "../Game";
import GameAction from "../GameAction";
import select from "./select";
import organizeStacks from "../support/organizeStacks";
import { gamePhaseType } from "../support/gamePhase";
import { closeCombatCasualtyNeeded, closeCombatDone } from "./closeCombat";
import CloseCombatState from "./state/CloseCombatState";

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

    game.setGameState(new CloseCombatState(game))
    expect(game.closeNeeded.length).toBe(1)
    expect(game.closeNeeded[0]).toStrictEqual({
      loc, state: closeProgress.NeedsRoll, oReduce: 0, tReduce: 0, oPlayer: 1, tPlayer: 2,
    })
    expect(game.lastAction?.type).toBe("close_combat_start")
    expect(closeCombatDone(game)).toBe(false)

    select(map, {
      counter: map.countersAt(loc)[0],
      target: { type: "map", xy: loc}
    }, () => {})
    expect(one.selected).toBe(true)
    expect(two.selected).toBe(true)
    expect(closeCombatCasualtyNeeded(game)).toBe(false)

    const original = Math.random
    vi.spyOn(Math, "random").mockReturnValue(0.01)
    game.closeCombatState.rollForCombat()
    Math.random = original

    expect(game.closeNeeded.length).toBe(1)
    expect(game.closeNeeded[0]).toStrictEqual({
      loc, state: closeProgress.NeedsCasualties, oReduce: 1, tReduce: 1, oPlayer: 2, tPlayer: 1,
    })
    expect(game.lastAction?.type).toBe("close_combat_roll")
    expect(game.lastAction?.stringValue).toBe(
      "German Rifle battles Soviet Rifle in close combat; German player rolls 1 plus 7 firepower; " +
      "Soviet player rolls 1 plus 7 firepower; each player reduces 1 unit"
    )
    expect(closeCombatDone(game)).toBe(false)
    expect(closeCombatCasualtyNeeded(game)).toStrictEqual(loc)

    expect(game.currentPlayer).toBe(1)
    select(map, {
      counter: map.countersAt(loc)[0],
      target: { type: "map", xy: loc}
    }, () => {})
    expect(two.selected).toBe(true)
    game.closeCombatState.reduceUnit()

    expect(game.closeNeeded.length).toBe(1)
    expect(game.closeNeeded[0]).toStrictEqual({
      loc, state: closeProgress.NeedsCasualties, oReduce: 1, tReduce: 0, oPlayer: 2, tPlayer: 1,
    })
    expect(game.lastAction?.type).toBe("close_combat_reduce")
    expect(game.lastAction?.stringValue).toBe("Soviet Rifle broken")
    expect(two.isBroken).toBe(true)
    expect(closeCombatDone(game)).toBe(false)

    expect(game.currentPlayer).toBe(2)
    select(map, {
      counter: map.countersAt(loc)[1],
      target: { type: "map", xy: loc}
    }, () => {})
    expect(one.selected).toBe(true)
    game.closeCombatState.reduceUnit()

    expect(game.closeNeeded.length).toBe(1)
    expect(game.closeNeeded[0]).toStrictEqual({
      loc, state: closeProgress.Done, oReduce: 0, tReduce: 0, oPlayer: 2, tPlayer: 1,
    })
    expect(game.lastAction?.type).toBe("close_combat_reduce")
    expect(game.lastAction?.stringValue).toBe("German Rifle broken")
    expect(one.isBroken).toBe(true)
    expect(closeCombatDone(game)).toBe(true)

    game.gameState?.finish()
    expect(map.currentSelection.length).toBe(0)
    expect(game.closeNeeded.length).toBe(0)
    expect(game.actions[5].stringValue).toBe("close combat complete")

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

    game.setGameState(new CloseCombatState(game))
    expect(game.closeNeeded.length).toBe(1)
    expect(game.closeNeeded[0]).toStrictEqual({
      loc, state: closeProgress.NeedsRoll, oReduce: 0, tReduce: 0, oPlayer: 1, tPlayer: 2,
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
      loc, state: closeProgress.NeedsCasualties, oReduce: 1, tReduce: 1, oPlayer: 2, tPlayer: 1,
    })
    expect(game.lastAction?.type).toBe("close_combat_roll")
    expect(game.lastAction?.stringValue).toBe(
      "German Rifle, PzKpfw 35(t) battles Soviet Rifle, DP-27 in close combat; " +
      "German player rolls 1 plus 11 firepower; " +
      "Soviet player rolls 1 plus 11 firepower; each player reduces 1 unit"
    )
    expect(closeCombatDone(game)).toBe(false)
    expect(closeCombatCasualtyNeeded(game)).toStrictEqual(loc)

    expect(game.currentPlayer).toBe(1)
    select(map, {
      counter: map.countersAt(loc)[2],
      target: { type: "map", xy: loc}
    }, () => {})
    expect(two2.selected).toBe(false)
    select(map, {
      counter: map.countersAt(loc)[0],
      target: { type: "map", xy: loc}
    }, () => {})
    expect(two.selected).toBe(true)
    game.closeCombatState.reduceUnit()

    expect(game.closeNeeded.length).toBe(1)
    expect(game.closeNeeded[0]).toStrictEqual({
      loc, state: closeProgress.NeedsCasualties, oReduce: 1, tReduce: 0, oPlayer: 2, tPlayer: 1,
    })
    expect(game.lastAction?.type).toBe("close_combat_reduce")
    expect(game.lastAction?.stringValue).toBe("Soviet Rifle broken")
    expect(two.isBroken).toBe(true)
    expect(closeCombatDone(game)).toBe(false)

    expect(game.currentPlayer).toBe(2)
    select(map, {
      counter: map.countersAt(loc)[4],
      target: { type: "map", xy: loc}
    }, () => {})
    expect(one2.selected).toBe(true)
    game.closeCombatState.reduceUnit()

    expect(game.closeNeeded.length).toBe(1)
    expect(game.closeNeeded[0]).toStrictEqual({
      loc, state: closeProgress.Done, oReduce: 0, tReduce: 0, oPlayer: 2, tPlayer: 1,
    })
    expect(game.lastAction?.type).toBe("close_combat_reduce")
    expect(game.lastAction?.stringValue).toBe("German PzKpfw 35(t) eliminated")
    expect(one2.isWreck).toBe(true)
    expect(closeCombatDone(game)).toBe(true)

    game.gameState?.finish()
    expect(map.currentSelection.length).toBe(0)
    expect(game.closeNeeded.length).toBe(0)

    const all = map.allCounters
    expect(all.length).toBe(4) // four units (no hull for wreck)
    expect(all[0].unit.playerNation).toBe("ussr")
    expect(all[0].unit.status).toBe(unitStatus.Broken)
    expect(all[2].unit.playerNation).toBe("ger")
    expect(all[2].unit.status).toBe(unitStatus.Normal)
    expect(all[3].unit.playerNation).toBe("ger")
    expect(all[3].unit.status).toBe(unitStatus.Wreck)
    expect(game.eliminatedUnits.length).toBe(0)
  })

  test("close combat power and overkill", () => {
    const game = createBlankGame()
    game.scenario.alliedFactions = ["usa"]
    game.scenario.axisFactions = ["jap"]
    const map = game.scenario.map
    const us1 = new Unit(testUSMarine)
    us1.id = "us1"
    us1.assault = true
    const loc = new Coordinate(2, 2)
    map.addCounter(loc, us1)
    const us2 = new Unit(testUSMarineTeam)
    us2.id = "us2"
    map.addCounter(loc, us2)
    const us3 = new Unit(testUSMG)
    us3.id = "us3"
    map.addCounter(loc, us3)
    const us4 = new Unit(testUSLdr)
    us4.id = "us4"
    map.addCounter(loc, us4)

    const jap = new Unit(testJapSNLF)
    jap.id = "jap"
    map.addCounter(loc, jap)
    organizeStacks(map)

    game.executeAction(new GameAction({
      user: game.currentUser, player: 1, data: {
        action: "phase", old_initiative: 0, phase_data: {
          old_phase: gamePhaseType.Main, new_phase: gamePhaseType.CleanupCloseCombat,
          old_turn: 1, new_turn: 1, new_player: 2,
        },
      },
    }, game), false)

    game.setGameState(new CloseCombatState(game))
    expect(game.closeNeeded.length).toBe(1)
    expect(game.closeNeeded[0]).toStrictEqual({
      loc, state: closeProgress.NeedsRoll, oReduce: 0, tReduce: 0, oPlayer: 1, tPlayer: 2,
    })
    expect(game.lastAction?.type).toBe("close_combat_start")
    expect(closeCombatDone(game)).toBe(false)

    select(map, {
      counter: map.countersAt(loc)[0],
      target: { type: "map", xy: loc}
    }, () => {})
    expect(us1.selected).toBe(true)
    expect(us2.selected).toBe(true)
    expect(us3.selected).toBe(true)
    expect(us4.selected).toBe(true)
    expect(jap.selected).toBe(true)

    const original = Math.random
    vi.spyOn(Math, "random").mockReturnValue(0.01)
    game.closeCombatState.rollForCombat()
    Math.random = original

    expect(game.closeNeeded.length).toBe(1)
    expect(game.closeNeeded[0]).toStrictEqual({
      loc, state: closeProgress.NeedsCasualties, oReduce: 2, tReduce: 0, oPlayer: 2, tPlayer: 1,
    })
    expect(game.lastAction?.type).toBe("close_combat_roll")
    expect(game.lastAction?.stringValue).toBe(
      "Japanese SNLF battles American Marine Rifle, Marine Rifle, M1918 BAR, Leader in close combat; " +
        "Japanese player rolls 1 plus 8 firepower; American player rolls 1 plus 19 firepower; " +
        "Japanese player reduces 2 units (all units)"
    )
    expect(closeCombatDone(game)).toBe(false)
    expect(closeCombatCasualtyNeeded(game)).toStrictEqual(loc)

    select(map, {
      counter: map.countersAt(loc)[4],
      target: { type: "map", xy: loc}
    }, () => {})
    expect(jap.selected).toBe(true)
    game.closeCombatState.reduceUnit()

    expect(game.closeNeeded.length).toBe(1)
    expect(game.closeNeeded[0]).toStrictEqual({
      loc, state: closeProgress.NeedsCasualties, oReduce: 1, tReduce: 0, oPlayer: 2, tPlayer: 1,
    })
    expect(game.lastAction?.type).toBe("close_combat_reduce")
    expect(game.lastAction?.stringValue).toBe("Japanese SNLF broken")
    expect(closeCombatDone(game)).toBe(false)

    select(map, {
      counter: map.countersAt(loc)[4],
      target: { type: "map", xy: loc}
    }, () => {})
    expect(jap.selected).toBe(true)

    const index = game.actions.length
    game.closeCombatState.reduceUnit()

    expect(game.closeNeeded.length).toBe(1)
    expect(game.closeNeeded[0]).toStrictEqual({
      loc, state: closeProgress.Done, oReduce: 0, tReduce: 0, oPlayer: 2, tPlayer: 1,
    })
    expect(game.actions[index].type).toBe("close_combat_reduce")
    expect(game.actions[index].stringValue).toBe("Japanese SNLF eliminated")
    expect(closeCombatDone(game)).toBe(true)

    let all = map.allCounters
    expect(all.length).toBe(4)
    expect(all[0].unit.name).toBe("Marine Rifle")
    expect(all[0].unit.status).toBe(unitStatus.Exhausted)
    expect(game.eliminatedUnits.length).toBe(1)
    expect((game.eliminatedUnits[0] as Unit).status).toBe(unitStatus.Normal)

    game.closeCombatState.finish()
    all = map.allCounters
    expect(all.length).toBe(4)
    expect(all[0].unit.name).toBe("Marine Rifle")
    expect(all[0].unit.status).toBe(unitStatus.Tired)
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

    game.setGameState(new CloseCombatState(game))
    expect(game.closeNeeded.length).toBe(1)
    expect(game.closeNeeded[0]).toStrictEqual({
      loc, state: closeProgress.NeedsRoll, oReduce: 0, tReduce: 0, oPlayer: 1, tPlayer: 2,
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
      loc, state: closeProgress.NeedsCasualties, oReduce: 0, tReduce: 2, oPlayer: 2, tPlayer: 1,
    })
    expect(game.lastAction?.type).toBe("close_combat_roll")
    expect(game.lastAction?.stringValue).toBe(
      "German Rifle, Rifle battles Soviet Rifle in close combat; " +
      "German player rolls 1 plus 14 firepower; " +
      "Soviet player rolls 1 plus 7 firepower; Soviet player reduces 2 units"
    )
    expect(closeCombatDone(game)).toBe(false)
    expect(closeCombatCasualtyNeeded(game)).toStrictEqual(loc)

    expect(game.currentPlayer).toBe(1)
    select(map, {
      counter: map.countersAt(loc)[0],
      target: { type: "map", xy: loc}
    }, () => {})
    expect(two.selected).toBe(true)
    game.closeCombatState.reduceUnit()

    expect(game.closeNeeded.length).toBe(1)
    expect(game.closeNeeded[0]).toStrictEqual({
      loc, state: closeProgress.NeedsCasualties, oReduce: 0, tReduce: 1, oPlayer: 2, tPlayer: 1,
    })
    expect(game.lastAction?.type).toBe("close_combat_reduce")
    expect(game.lastAction?.stringValue).toBe("Soviet Rifle broken")
    expect(closeCombatDone(game)).toBe(false)
    expect(closeCombatCasualtyNeeded(game)).toStrictEqual(loc)

    expect(game.currentPlayer).toBe(1)
    select(map, {
      counter: map.countersAt(loc)[0],
      target: { type: "map", xy: loc}
    }, () => {})
    expect(two.selected).toBe(true)
    game.closeCombatState.reduceUnit()

    expect(game.closeNeeded.length).toBe(1)
    expect(game.closeNeeded[0]).toStrictEqual({
      loc, state: closeProgress.Done, oReduce: 0, tReduce: 0, oPlayer: 2, tPlayer: 1,
    })
    const action = game.actions[4]
    expect(action.type).toBe("close_combat_reduce")
    expect(action.stringValue).toBe("Soviet Rifle eliminated")
    expect(closeCombatCasualtyNeeded(game)).toBe(false)
    expect(closeCombatDone(game)).toBe(true)

    game.gameState?.finish()
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

    game.setGameState(new CloseCombatState(game))
    expect(game.closeNeeded.length).toBe(2)
    expect(game.closeNeeded[0]).toStrictEqual({
      loc, state: closeProgress.NeedsRoll, oReduce: 0, tReduce: 0, oPlayer: 1, tPlayer: 2,
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
      loc, state: closeProgress.NeedsCasualties, oReduce: 0, tReduce: 1, oPlayer: 2, tPlayer: 1,
    })
    expect(game.lastAction?.type).toBe("close_combat_roll")
    expect(game.lastAction?.stringValue).toBe(
      "German Rifle battles Soviet Rifle in close combat; " +
      "German player rolls 1 plus 9 firepower; " +
      "Soviet player rolls 1 plus 7 firepower; Soviet player reduces 1 unit"
    )
    expect(closeCombatDone(game)).toBe(false)
    expect(closeCombatCasualtyNeeded(game)).toStrictEqual(loc)
    select(map, {
      counter: map.countersAt(loc)[0],
      target: { type: "map", xy: loc}
    }, () => {})
    expect(two.selected).toBe(true)
    game.closeCombatState.reduceUnit()

    expect(game.closeNeeded.length).toBe(2)
    expect(game.closeNeeded[0]).toStrictEqual({
      loc, state: closeProgress.Done, oReduce: 0, tReduce: 0, oPlayer: 2, tPlayer: 1,
    })
    expect(game.closeNeeded[1]).toStrictEqual({
      loc: loc2, state: closeProgress.NeedsRoll, oReduce: 0, tReduce: 0, oPlayer: 1, tPlayer: 2,
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
      loc: loc2, state: closeProgress.NeedsCasualties, oReduce: 1, tReduce: 0, oPlayer: 2, tPlayer: 1,
    })
    expect(game.lastAction?.type).toBe("close_combat_roll")
    expect(game.lastAction?.stringValue).toBe(
      "German Rifle battles Soviet Rifle in close combat; " +
      "German player rolls 10 plus 7 firepower; " +
      "Soviet player rolls 10 plus 9 firepower; German player reduces 1 unit"
    )
    expect(closeCombatDone(game)).toBe(false)
    expect(closeCombatCasualtyNeeded(game)).toStrictEqual(loc2)
    select(map, {
      counter: map.countersAt(loc2)[1],
      target: { type: "map", xy: loc2}
    }, () => {})
    expect(one2.selected).toBe(true)
    game.closeCombatState.reduceUnit()

    expect(game.closeNeeded.length).toBe(2)
    expect(game.closeNeeded[1]).toStrictEqual({
      loc: loc2, state: closeProgress.Done, oReduce: 0, tReduce: 0, oPlayer: 2, tPlayer: 1,
    })
    expect(game.lastAction?.type).toBe("close_combat_reduce")
    expect(game.lastAction?.stringValue).toBe("German Rifle broken")
    expect(one2.isBroken).toBe(true)
    expect(closeCombatDone(game)).toBe(true)
    expect(closeCombatCasualtyNeeded(game)).toBe(false)

    game.gameState?.finish()
    expect(map.currentSelection.length).toBe(0)
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

    game.setGameState(new CloseCombatState(game))
    expect(game.closeNeeded.length).toBe(1)
    expect(game.closeNeeded[0]).toStrictEqual({
      loc, state: closeProgress.NeedsRoll, oReduce: 0, tReduce: 0, oPlayer: 1, tPlayer: 2,
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
      loc, state: closeProgress.NeedsCasualties, oReduce: 1, tReduce: 0, oPlayer: 2, tPlayer: 1,
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
      loc, state: closeProgress.Done, oReduce: 0, tReduce: 0, oPlayer: 2, tPlayer: 1,
    })
    expect(game.lastAction?.type).toBe("close_combat_reduce")
    expect(game.lastAction?.stringValue).toBe("German Rifle broken")
    expect(one3.isBroken).toBe(true)
    expect(closeCombatDone(game)).toBe(true)

    game.gameState?.finish()
    expect(map.currentSelection.length).toBe(0)
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

    game.setGameState(new CloseCombatState(game))

    expect(closeCombatCasualtyNeeded(game)).toBe(false)
    expect(closeCombatDone(game)).toBe(true)
    const index = game.actions.length
    game.gameState?.finish()
    expect(game.actions[index].stringValue).toBe("skipping: no combat to resolve")
  })
})
