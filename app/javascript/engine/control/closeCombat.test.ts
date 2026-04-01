import { describe, expect, test, vi } from "vitest";
import { createBlankGame, testGGun, testGInf, testGLdr, testGTank, testGTruck, testJapSNLF, testRInf, testRMG, testRTruck, testUSLdr, testUSMarine, testUSMarineTeam, testUSMG } from "./testHelpers";
import Unit from "../Unit";
import { Coordinate } from "../../utilities/commonTypes";
import { closeProgress } from "../Game";
import GameAction from "../GameAction";
import select from "./select";
import organizeStacks from "../support/organizeStacks";
import { gamePhaseType } from "../support/gamePhase";
import { closeCombatCasualtyNeeded, closeCombatFirepower } from "./closeCombat";
import CloseCombatState from "./state/CloseCombatState";
import { chanceCC } from "../../utilities/utilities";

describe("close combat", () => {
  test("odds display", () => {
    expect(chanceCC(1, "Axis", 5)).toStrictEqual([
      [87, "Axis player takes no hits"],
      [13, "Axis player takes 1 hit"],
    ])

    expect(chanceCC(3, "Axis", 5)).toStrictEqual([
      [67, "Axis player takes no hits"],
      [32, "Axis player takes 1 hit"],
      [1, "Axis player takes 2 hits"],
    ])

    expect(chanceCC(20, "Axis", 5)).toStrictEqual([
      [20, "Axis player takes 1 hit"],
      [18, "Axis player takes 3 hits"],
      [18, "Axis player takes 4 hits"],
      [17, "Axis player takes 2 hits"],
      [17, "Axis player takes 5 hits (all)"],
      [10, "Axis player takes no hits"],
    ])
  })

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
          old_turn: 1, new_turn: 1, new_player: 2, messages: [],
        },
      },
    }, game), false)

    game.addCloseCombatChecks()
    game.setGameState(new CloseCombatState(game))
    expect(game.closeNeeded.length).toBe(1)
    expect(game.closeNeeded[0]).toStrictEqual({
      loc, state: closeProgress.NeedsRoll, p1Reduce: 0, p2Reduce: 0,
    })
    expect(game.anyCloseCombatLeft).toBe(true)

    select(map, {
      counter: map.countersAt(loc)[0],
      target: { type: "map", xy: loc}
    }, () => {})
    expect(one.selected).toBe(true)
    expect(two.selected).toBe(true)
    expect(closeCombatCasualtyNeeded(game)).toBe(false)

    const original = Math.random
    vi.spyOn(Math, "random").mockReturnValue(0.5)
    game.closeCombatState.rollForCombat()
    Math.random = original

    expect(game.closeNeeded.length).toBe(1)
    expect(game.closeNeeded[0]).toStrictEqual({
      loc, state: closeProgress.NeedsCasualties, p1Reduce: 1, p2Reduce: 1,
    })
    expect(game.lastAction?.type).toBe("close_combat_roll")
    expect(game.lastAction?.stringValue).toBe(
      "Soviet Rifle battles German Rifle in close combat at C3; " +
        "Soviet player roll result of 120 on 7 firepower; " +
        "German player roll result of 120 on 7 firepower; " +
        "Soviet player takes 1 hit, German player takes 1 hit"
    )
    expect(game.anyCloseCombatLeft).toBe(true)
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
      loc, state: closeProgress.NeedsCasualties, p1Reduce: 0, p2Reduce: 1,
    })
    expect(game.lastAction?.type).toBe("close_combat_reduce")
    expect(game.lastAction?.stringValue).toBe("Soviet Rifle at C3 broken")
    expect(two.isBroken).toBe(true)
    expect(game.anyCloseCombatLeft).toBe(true)

    expect(game.currentPlayer).toBe(2)
    select(map, {
      counter: map.countersAt(loc)[1],
      target: { type: "map", xy: loc}
    }, () => {})
    expect(one.selected).toBe(true)
    game.closeCombatState.reduceUnit()

    expect(game.closeNeeded.length).toBe(1)
    expect(game.closeNeeded[0]).toStrictEqual({
      loc, state: closeProgress.Done, p1Reduce: 0, p2Reduce: 0,
    })
    expect(game.lastAction?.type).toBe("close_combat_reduce")
    expect(game.lastAction?.stringValue).toBe("German Rifle at C3 broken")
    expect(one.isBroken).toBe(true)
    expect(game.anyCloseCombatLeft).toBe(false)

    expect(map.currentSelection.length).toBe(0)

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
          old_phase: gamePhaseType.Main, new_phase: gamePhaseType.CleanupCloseCombat,
          old_turn: 1, new_turn: 1, new_player: 2, messages: [],
        },
      },
    }, game), false)

    game.addCloseCombatChecks()
    game.setGameState(new CloseCombatState(game))
    expect(game.closeNeeded.length).toBe(1)
    expect(game.closeNeeded[0]).toStrictEqual({
      loc, state: closeProgress.NeedsRoll, p1Reduce: 0, p2Reduce: 0,
    })
    expect(game.anyCloseCombatLeft).toBe(true)

    select(map, {
      counter: map.countersAt(loc)[0],
      target: { type: "map", xy: loc}
    }, () => {})
    expect(one.selected).toBe(true)
    expect(two.selected).toBe(true)
    expect(one2.selected).toBe(true)
    expect(two2.selected).toBe(true)

    const original = Math.random
    vi.spyOn(Math, "random").mockReturnValue(0.3)
    game.closeCombatState.rollForCombat()
    Math.random = original

    expect(game.closeNeeded.length).toBe(1)
    // expect(game.closeNeeded[0]).toStrictEqual({
    //   loc, state: closeProgress.NeedsCasualties, p1Reduce: 1, p2Reduce: 1,
    // })
    expect(game.lastAction?.type).toBe("close_combat_roll")
    expect(game.lastAction?.stringValue).toBe(
      "Soviet Rifle, PzKpfw 35(t) battles German Rifle, DP-27 in close combat at C3; " +
        "Soviet player roll result of 104 on 11 firepower; " +
        "German player roll result of 104 on 11 firepower; " +
        "Soviet player takes 1 hit, German player takes 1 hit"
    )
    expect(game.anyCloseCombatLeft).toBe(true)
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
      loc, state: closeProgress.NeedsCasualties, p1Reduce: 0, p2Reduce: 1,
    })
    expect(game.lastAction?.type).toBe("close_combat_reduce")
    expect(game.lastAction?.stringValue).toBe("Soviet Rifle at C3 broken")
    expect(two.isBroken).toBe(true)
    expect(game.anyCloseCombatLeft).toBe(true)

    expect(game.currentPlayer).toBe(2)
    select(map, {
      counter: map.countersAt(loc)[4],
      target: { type: "map", xy: loc}
    }, () => {})
    expect(one2.selected).toBe(true)
    game.closeCombatState.reduceUnit()

    expect(game.closeNeeded.length).toBe(1)
    expect(game.closeNeeded[0]).toStrictEqual({
      loc, state: closeProgress.Done, p1Reduce: 0, p2Reduce: 0,
    })
    expect(game.lastAction?.type).toBe("close_combat_reduce")
    expect(game.lastAction?.stringValue).toBe("German PzKpfw 35(t) at C3 eliminated")
    expect(one2.isWreck).toBe(true)
    expect(game.anyCloseCombatLeft).toBe(false)

    expect(map.currentSelection.length).toBe(0)

    const all = map.allCounters
    expect(all.length).toBe(4) // four units (no hull counter for wreck)
    expect(all[0].unit.playerNation).toBe("ussr")
    expect(all[0].unit.isBroken).toBe(true)
    expect(all[2].unit.playerNation).toBe("ger")
    expect(all[2].unit.isNormal).toBe(true)
    expect(all[3].unit.playerNation).toBe("ger")
    expect(all[3].unit.isWreck).toBe(true)
    expect(game.eliminatedUnits.length).toBe(1)
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
          old_turn: 1, new_turn: 1, new_player: 2, messages: [],
        },
      },
    }, game), false)

    game.addCloseCombatChecks()
    game.setGameState(new CloseCombatState(game))
    expect(game.closeNeeded.length).toBe(1)
    expect(game.closeNeeded[0]).toStrictEqual({
      loc, state: closeProgress.NeedsRoll, p1Reduce: 0, p2Reduce: 0,
    })
    expect(game.anyCloseCombatLeft).toBe(true)

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
    vi.spyOn(Math, "random").mockReturnValue(0.5)
    game.closeCombatState.rollForCombat()
    Math.random = original

    expect(game.closeNeeded.length).toBe(1)
    expect(game.closeNeeded[0]).toStrictEqual({
      loc, state: closeProgress.NeedsCasualties, p1Reduce: 1, p2Reduce: 2,
    })
    expect(game.lastAction?.type).toBe("close_combat_roll")
    expect(game.lastAction?.stringValue).toBe(
      "American SNLF battles Japanese Marine Rifle, Marine Rifle, M1918 BAR, Leader in close combat at C3; " +
        "American player roll result of 264 on 19 firepower; " +
        "Japanese player roll result of 132 on 8 firepower; " +
        "American player takes 1 hit, Japanese player takes 2 hits (all eliminated)"
    )
    expect(game.anyCloseCombatLeft).toBe(true)
    expect(closeCombatCasualtyNeeded(game)).toStrictEqual(loc)

    select(map, {
      counter: map.countersAt(loc)[0],
      target: { type: "map", xy: loc}
    }, () => {})
    expect(us1.selected).toBe(true)
    game.closeCombatState.reduceUnit()

    expect(game.closeNeeded.length).toBe(1)
    expect(game.closeNeeded[0]).toStrictEqual({
      loc, state: closeProgress.NeedsCasualties, p1Reduce: 0, p2Reduce: 2,
    })
    expect(game.lastAction?.type).toBe("close_combat_reduce")
    expect(game.lastAction?.stringValue).toBe("American Marine Rifle at C3 broken")
    expect(game.anyCloseCombatLeft).toBe(true)

    select(map, {
      counter: map.countersAt(loc)[4],
      target: { type: "map", xy: loc}
    }, () => {})
    expect(jap.selected).toBe(true)
    game.closeCombatState.reduceUnit()

    expect(game.closeNeeded.length).toBe(1)
    expect(game.closeNeeded[0]).toStrictEqual({
      loc, state: closeProgress.NeedsCasualties, p1Reduce: 0, p2Reduce: 1,
    })
    expect(game.lastAction?.type).toBe("close_combat_reduce")
    expect(game.lastAction?.stringValue).toBe("Japanese SNLF at C3 broken")
    expect(game.anyCloseCombatLeft).toBe(true)

    select(map, {
      counter: map.countersAt(loc)[4],
      target: { type: "map", xy: loc}
    }, () => {})
    expect(jap.selected).toBe(true)

    const index = game.actions.length
    game.closeCombatState.reduceUnit()

    expect(game.closeNeeded.length).toBe(1)
    expect(game.closeNeeded[0]).toStrictEqual({
      loc, state: closeProgress.Done, p1Reduce: 0, p2Reduce: 0,
    })
    expect(game.actions[index].type).toBe("close_combat_reduce")
    expect(game.actions[index].stringValue).toBe("Japanese SNLF at C3 eliminated")
    expect(game.anyCloseCombatLeft).toBe(false)

    let all = map.allCounters
    expect(all.length).toBe(4)
    expect(all[0].unit.name).toBe("Marine Rifle")
    expect(all[0].unit.isBroken).toBe(true)
    expect(all[1].unit.name).toBe("Marine Rifle")
    expect(all[1].unit.isExhausted).toBe(true)
    expect(game.eliminatedUnits.length).toBe(1)
    expect((game.eliminatedUnits[0] as Unit).isNormal).toBe(true)

    all = map.allCounters
    expect(all.length).toBe(4)
    expect(all[1].unit.name).toBe("Marine Rifle")
    expect(all[1].unit.isExhausted).toBe(true)
  })

  test("broken units still have combat power", () => {
    const game = createBlankGame()
    game.scenario.alliedFactions = ["usa"]
    game.scenario.axisFactions = ["jap"]
    const map = game.scenario.map
    const us1 = new Unit(testUSMarine)
    us1.id = "us1"
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

    expect(closeCombatFirepower(game, loc, 1)).toBe(19)
    expect(us4.closeCombatFirepower).toBe(1)
    us4.break()
    expect(us4.closeCombatFirepower).toBe(0)
    expect(closeCombatFirepower(game, loc, 1)).toBe(14)
    expect(us1.closeCombatFirepower).toBe(9)
    us1.break()
    expect(us1.closeCombatFirepower).toBe(3)
    expect(closeCombatFirepower(game, loc, 1)).toBe(8)
    expect(us2.closeCombatFirepower).toBe(3)
    expect(us3.closeCombatFirepower).toBe(2)
    us2.break()
    expect(us2.closeCombatFirepower).toBe(1)
    expect(us3.closeCombatFirepower).toBe(0)
    expect(closeCombatFirepower(game, loc, 1)).toBe(4)
    us2.resetStatus()
    us3.jammed = true
    expect(us2.closeCombatFirepower).toBe(3)
    expect(us3.closeCombatFirepower).toBe(0)
    expect(closeCombatFirepower(game, loc, 1)).toBe(6)
  })

  test("wrecks", () => {
    const game = createBlankGame()
    const map = game.scenario.map
    const loc = new Coordinate(2, 2)
    const one = new Unit(testGTank)
    one.id = "one"
    map.addCounter(loc, one)
    const one2 = new Unit(testGLdr)
    one2.id = "one2"
    map.addCounter(loc, one2)

    const two = new Unit(testRTruck)
    two.id = "two1"
    two.assault = true
    map.addCounter(loc, two)
    organizeStacks(map)

    expect(closeCombatFirepower(game, loc, 1)).toBe(1)
    expect(two.closeCombatFirepower).toBe(1)
    two.wreck()
    expect(two.closeCombatFirepower).toBe(0)
    expect(closeCombatFirepower(game, loc, 1)).toBe(0)

    expect(closeCombatFirepower(game, loc, 2)).toBe(3)
    expect(one.closeCombatFirepower).toBe(2)
    one.wreck()
    expect(one.closeCombatFirepower).toBe(0)
    expect(closeCombatFirepower(game, loc, 2)).toBe(1)
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
          old_phase: gamePhaseType.Main, new_phase: gamePhaseType.CleanupCloseCombat,
          old_turn: 1, new_turn: 1, new_player: 2, messages: [],
        },
      },
    }, game), false)

    game.addCloseCombatChecks()
    game.setGameState(new CloseCombatState(game))
    expect(game.closeNeeded.length).toBe(1)
    expect(game.closeNeeded[0]).toStrictEqual({
      loc, state: closeProgress.NeedsRoll, p1Reduce: 0, p2Reduce: 0,
    })
    expect(game.anyCloseCombatLeft).toBe(true)

    select(map, {
      counter: map.countersAt(loc)[0],
      target: { type: "map", xy: loc}
    }, () => {})
    expect(one.selected).toBe(true)
    expect(one2.selected).toBe(true)
    expect(two.selected).toBe(true)

    const original = Math.random
    vi.spyOn(Math, "random").mockReturnValue(0.5)
    game.closeCombatState.rollForCombat()
    Math.random = original

    expect(game.closeNeeded.length).toBe(1)
    expect(game.closeNeeded[0]).toStrictEqual({
      loc, state: closeProgress.NeedsCasualties, p1Reduce: 2, p2Reduce: 1,
    })
    expect(game.lastAction?.type).toBe("close_combat_roll")
    expect(game.lastAction?.stringValue).toBe(
      "Soviet Rifle, Rifle battles German Rifle in close combat at C3; " +
        "Soviet player roll result of 120 on 7 firepower; " +
        "German player roll result of 204 on 14 firepower; " +
        "Soviet player takes 2 hits (all eliminated), German player takes 1 hit"
    )
    expect(game.anyCloseCombatLeft).toBe(true)
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
      loc, state: closeProgress.NeedsCasualties, p1Reduce: 1, p2Reduce: 1,
    })
    expect(game.lastAction?.type).toBe("close_combat_reduce")
    expect(game.lastAction?.stringValue).toBe("Soviet Rifle at C3 broken")
    expect(game.anyCloseCombatLeft).toBe(true)
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
      loc, state: closeProgress.NeedsCasualties, p1Reduce: 0, p2Reduce: 1,
    })
    expect(game.lastAction?.type).toBe("close_combat_reduce")
    expect(game.lastAction?.stringValue).toBe("Soviet Rifle at C3 eliminated")
    expect(game.anyCloseCombatLeft).toBe(true)
    expect(closeCombatCasualtyNeeded(game)).toStrictEqual(loc)

    expect(game.currentPlayer).toBe(2)
    select(map, {
      counter: map.countersAt(loc)[0],
      target: { type: "map", xy: loc}
    }, () => {})
    expect(one.selected).toBe(true)
    game.closeCombatState.reduceUnit()

    expect(game.closeNeeded.length).toBe(1)
    expect(game.closeNeeded[0]).toStrictEqual({
      loc, state: closeProgress.Done, p1Reduce: 0, p2Reduce: 0,
    })
    const action = game.actions[7]
    expect(action.type).toBe("close_combat_reduce")
    expect(action.stringValue).toBe("German Rifle at C3 broken")
    expect(closeCombatCasualtyNeeded(game)).toBe(false)
    expect(game.anyCloseCombatLeft).toBe(false)

    expect(map.currentSelection.length).toBe(0)

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
          old_phase: gamePhaseType.Main, new_phase: gamePhaseType.CleanupCloseCombat,
          old_turn: 1, new_turn: 1, new_player: 2, messages: [],
        },
      },
    }, game), false)

    game.addCloseCombatChecks()
    game.setGameState(new CloseCombatState(game))
    expect(game.closeNeeded.length).toBe(2)
    expect(game.closeNeeded[0]).toStrictEqual({
      loc, state: closeProgress.NeedsRoll, p1Reduce: 0, p2Reduce: 0,
    })
    expect(game.anyCloseCombatLeft).toBe(true)

    select(map, {
      counter: map.countersAt(loc)[0],
      target: { type: "map", xy: loc}
    }, () => {})
    expect(one.selected).toBe(true)
    expect(two.selected).toBe(true)
    expect(one2.selected).toBe(false)
    expect(two2.selected).toBe(false)

    const original = Math.random
    vi.spyOn(Math, "random").mockReturnValue(0.3)
    game.closeCombatState.rollForCombat()
    Math.random = original

    expect(game.closeNeeded.length).toBe(2)
    expect(game.closeNeeded[0]).toStrictEqual({
      loc, state: closeProgress.NeedsCasualties, p1Reduce: 1, p2Reduce: 0,
    })
    expect(game.lastAction?.type).toBe("close_combat_roll")
    expect(game.lastAction?.stringValue).toBe(
      "Soviet Rifle battles German Rifle in close combat at C3; " +
        "Soviet player roll result of 72 on 7 firepower; " +
        "German player roll result of 88 on 9 firepower; " +
        "Soviet player takes 1 hit, German player takes 0 hits"
    )
    expect(game.anyCloseCombatLeft).toBe(true)
    expect(closeCombatCasualtyNeeded(game)).toStrictEqual(loc)
    select(map, {
      counter: map.countersAt(loc)[0],
      target: { type: "map", xy: loc}
    }, () => {})
    expect(two.selected).toBe(true)
    game.closeCombatState.reduceUnit()

    expect(game.closeNeeded.length).toBe(2)
    expect(game.closeNeeded[0]).toStrictEqual({
      loc, state: closeProgress.Done, p1Reduce: 0, p2Reduce: 0,
    })
    expect(game.closeNeeded[1]).toStrictEqual({
      loc: loc2, state: closeProgress.NeedsRoll, p1Reduce: 0, p2Reduce: 0,
    })
    expect(game.lastAction?.type).toBe("close_combat_reduce")
    expect(game.lastAction?.stringValue).toBe("Soviet Rifle at C3 broken")
    expect(two.isBroken).toBe(true)
    expect(game.anyCloseCombatLeft).toBe(true)

    select(map, {
      counter: map.countersAt(loc2)[0],
      target: { type: "map", xy: loc2}
    }, () => {})
    expect(one.selected).toBe(false)
    expect(two.selected).toBe(false)
    expect(one2.selected).toBe(true)
    expect(two2.selected).toBe(true)

    vi.spyOn(Math, "random").mockReturnValue(0.3)
    game.closeCombatState.rollForCombat()
    Math.random = original

    expect(game.closeNeeded.length).toBe(2)
    expect(game.closeNeeded[1]).toStrictEqual({
      loc: loc2, state: closeProgress.NeedsCasualties, p1Reduce: 0, p2Reduce: 1,
    })
    expect(game.lastAction?.type).toBe("close_combat_roll")
    expect(game.lastAction?.stringValue).toBe(
      "Soviet Rifle battles German Rifle in close combat at D4; " +
        "Soviet player roll result of 88 on 9 firepower; " +
        "German player roll result of 72 on 7 firepower; " +
        "Soviet player takes 0 hits, German player takes 1 hit"
    )
    expect(game.anyCloseCombatLeft).toBe(true)
    expect(closeCombatCasualtyNeeded(game)).toStrictEqual(loc2)
    select(map, {
      counter: map.countersAt(loc2)[1],
      target: { type: "map", xy: loc2}
    }, () => {})
    expect(one2.selected).toBe(true)
    game.closeCombatState.reduceUnit()

    expect(game.closeNeeded.length).toBe(2)
    expect(game.closeNeeded[1]).toStrictEqual({
      loc: loc2, state: closeProgress.Done, p1Reduce: 0, p2Reduce: 0,
    })
    expect(game.lastAction?.type).toBe("close_combat_reduce")
    expect(game.lastAction?.stringValue).toBe("German Rifle at D4 broken")
    expect(one2.isBroken).toBe(true)
    expect(game.anyCloseCombatLeft).toBe(false)
    expect(closeCombatCasualtyNeeded(game)).toBe(false)

    expect(map.currentSelection.length).toBe(0)

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
          old_phase: gamePhaseType.Main, new_phase: gamePhaseType.CleanupCloseCombat,
          old_turn: 1, new_turn: 1, new_player: 2, messages: [],
        },
      },
    }, game), false)

    expect(one.children.length).toBe(2)
    expect(one2.parent?.name).toBe("Opel Blitz")
    expect(one3.parent?.name).toBe("Opel Blitz")

    game.addCloseCombatChecks()
    game.setGameState(new CloseCombatState(game))
    expect(game.closeNeeded.length).toBe(1)
    expect(game.closeNeeded[0]).toStrictEqual({
      loc, state: closeProgress.NeedsRoll, p1Reduce: 0, p2Reduce: 0,
    })
    expect(game.anyCloseCombatLeft).toBe(true)

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
    vi.spyOn(Math, "random").mockReturnValue(0.3)
    game.closeCombatState.rollForCombat()
    Math.random = original

    expect(game.closeNeeded.length).toBe(1)
    expect(game.closeNeeded[0]).toStrictEqual({
      loc, state: closeProgress.NeedsCasualties, p1Reduce: 1, p2Reduce: 1,
    })
    expect(game.lastAction?.type).toBe("close_combat_roll")
    expect(game.lastAction?.stringValue).toBe(
      "Soviet Opel Blitz, Rifle battles German Rifle, DP-27 in close combat at C3; " +
        "Soviet player roll result of 88 on 9 firepower; " +
        "German player roll result of 80 on 8 firepower; " +
        "Soviet player takes 1 hit, German player takes 1 hit"
    )
    expect(game.anyCloseCombatLeft).toBe(true)

    expect(one.children.length).toBe(1)
    expect(one2.parent?.name).toBe("Opel Blitz")
    expect(one3.parent).toBe(undefined)

    select(map, {
      counter: map.countersAt(loc)[0],
      target: { type: "map", xy: loc}
    }, () => {})
    expect(two.selected).toBe(true)
    game.closeCombatState.reduceUnit()

    expect(game.closeNeeded.length).toBe(1)
    expect(game.closeNeeded[0]).toStrictEqual({
      loc, state: closeProgress.NeedsCasualties, p1Reduce: 0, p2Reduce: 1,
    })
    expect(game.lastAction?.type).toBe("close_combat_reduce")
    expect(game.lastAction?.stringValue).toBe("Soviet Rifle at C3 broken")
    expect(two.isBroken).toBe(true)

    select(map, {
      counter: map.countersAt(loc)[2],
      target: { type: "map", xy: loc}
    }, () => {})
    expect(one3.selected).toBe(true)
    game.closeCombatState.reduceUnit()

    expect(game.closeNeeded.length).toBe(1)
    expect(game.closeNeeded[0]).toStrictEqual({
      loc, state: closeProgress.Done, p1Reduce: 0, p2Reduce: 0,
    })
    expect(game.lastAction?.type).toBe("close_combat_reduce")
    expect(game.lastAction?.stringValue).toBe("German Rifle at C3 broken")
    expect(one3.isBroken).toBe(true)
    expect(game.anyCloseCombatLeft).toBe(false)

    expect(map.currentSelection.length).toBe(0)

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
          old_phase: gamePhaseType.Main, new_phase: gamePhaseType.CleanupCloseCombat,
          old_turn: 1, new_turn: 1, new_player: 2, messages: [],
        },
      },
    }, game), false)

    game.addCloseCombatChecks()
    game.setGameState(new CloseCombatState(game))

    expect(closeCombatCasualtyNeeded(game)).toBe(false)
    expect(game.anyCloseCombatLeft).toBe(false)
  })

  test("winning combat captures VP", () => {
    const game = createBlankGame()
    const map = game.scenario.map

    const one1 = new Unit(testGInf)
    one1.id = "one1"
    const loc = new Coordinate(4, 4)
    map.addCounter(loc, one1)
    const one2 = new Unit(testGInf)
    one2.id = "one2"
    map.addCounter(loc, one2)
    const two = new Unit(testRInf)
    two.id = "two1"
    map.addCounter(loc, two)
    organizeStacks(map)

    expect(game.scenario.map.victoryAt(loc)).toBe(1)

    game.executeAction(new GameAction({
      user: game.currentUser, player: 1, data: {
        action: "phase", old_initiative: 0, phase_data: {
          old_phase: gamePhaseType.Main, new_phase: gamePhaseType.CleanupCloseCombat,
          old_turn: 1, new_turn: 1, new_player: 2, messages: [],
        },
      },
    }, game), false)

    game.addCloseCombatChecks()
    game.setGameState(new CloseCombatState(game))

    select(map, {
      counter: map.countersAt(loc)[0],
      target: { type: "map", xy: loc}
    }, () => {})

    const original = Math.random
    vi.spyOn(Math, "random").mockReturnValue(0.5)
    game.closeCombatState.rollForCombat()
    Math.random = original

    expect(game.closeNeeded[0]).toStrictEqual({
      loc, state: closeProgress.NeedsCasualties, p1Reduce: 2, p2Reduce: 1,
    })
    expect(game.lastAction?.stringValue).toBe(
      "Soviet Rifle, Rifle battles German Rifle in close combat at E5; " +
        "Soviet player roll result of 120 on 7 firepower; " +
        "German player roll result of 204 on 14 firepower; " +
        "Soviet player takes 2 hits (all eliminated), German player takes 1 hit"
    )

    select(map, {
      counter: map.countersAt(loc)[0],
      target: { type: "map", xy: loc}
    }, () => {})
    expect(two.selected).toBe(true)
    game.closeCombatState.reduceUnit()

    expect(game.closeNeeded[0]).toStrictEqual({
      loc, state: closeProgress.NeedsCasualties, p1Reduce: 1, p2Reduce: 1,
    })
    expect(game.lastAction?.stringValue).toBe("Soviet Rifle at E5 broken")
    expect(two.isBroken).toBe(true)

    select(map, {
      counter: map.countersAt(loc)[0],
      target: { type: "map", xy: loc}
    }, () => {})
    expect(two.selected).toBe(true)
    game.closeCombatState.reduceUnit()

    expect(game.closeNeeded[0]).toStrictEqual({
      loc, state: closeProgress.NeedsCasualties, p1Reduce: 0, p2Reduce: 1,
    })
    expect(game.lastAction?.stringValue).toBe("Soviet Rifle at E5 eliminated")

    select(map, {
      counter: map.countersAt(loc)[0],
      target: { type: "map", xy: loc}
    }, () => {})
    expect(one1.selected).toBe(true)
    game.closeCombatState.reduceUnit()

    expect(game.closeNeeded[0]).toStrictEqual({
      loc, state: closeProgress.Done, p1Reduce: 0, p2Reduce: 0,
    })
    expect(game.lastAction?.stringValue).toBe("German Rifle at E5 broken")
    expect(game.anyCloseCombatLeft).toBe(false)

    const all = map.allCounters
    expect(all.length).toBe(2)
    expect(game.eliminatedUnits.length).toBe(1)

    expect(game.scenario.map.victoryAt(loc)).toBe(2)
  })
})
