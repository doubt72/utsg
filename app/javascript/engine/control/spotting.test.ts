import { describe, expect, test, vi } from "vitest"
import { createBlankGame, createFireGame, testGGun, testGHMortar, testGInf, testGMortar, testGRadio, testGTank, testGTD, testITank, testRInf, testRTank } from "./testHelpers";
import Unit from "../Unit";
import { Coordinate } from "../../utilities/commonTypes";
import organizeStacks from "../support/organizeStacks";
import FireState from "./state/FireState";
import select from "./select";
import { rangeMultiplier } from "./fire";
import Game from "../Game";
import { StateSelection } from "./state/BaseState";
import Counter from "../Counter";
import MoveState from "./state/MoveState";
import AssaultState from "./state/AssaultState";
import { GameActionDiceResult } from "../GameAction";
import { deHTML } from "../../utilities/graphics";
import FireDisplaceState from "./state/FireDisplaceState";

describe("spotting", () => {
  const makeAction = (game: Game, ids: string[]): StateSelection[] => {
    return ids.map(id => {
      const counter = game.findCounterById(id) as Counter
      const hex = counter.hex as Coordinate
      return { x: hex.x, y: hex.y, id, name: counter.unit.id, counter }
    })
  }

  test("firing radio adds spotting", () => {
    const game = createFireGame()
    const map = game.scenario.map
    const firing = new Unit(testGInf)
    firing.id = "firing1"
    const floc = new Coordinate(3, 2)
    map.addCounter(floc, firing)
    const firing2 = new Unit(testGRadio)
    firing2.id = "firing2"
    map.addCounter(floc, firing2)
    map.select(firing2)

    const target = new Unit(testRInf)
    target.id = "target1"
    const tloc = new Coordinate(4, 0)
    map.addCounter(tloc, target)
    organizeStacks(map)

    game.setGameState(new FireState(game, false))

    select(map, {
      counter: map.countersAt(tloc)[0],
      target: { type: "map", xy: tloc }
    }, () => {})
    expect(target.targetSelected).toBe(true)

    const mult = rangeMultiplier(
      map, makeAction(game, ["firing2"])[0].counter, tloc, false, false, false
    )
    expect(mult.mult).toBe(5)
    expect(mult.why.length).toBe(1)
    expect(mult.why[0]).toBe("- base multiplier 5 (radio)")

    const original = Math.random
    vi.spyOn(Math, "random").mockReturnValue(0.99)
    game.gameState?.finish()
    Math.random = original

    expect(game.actions[0].stringValue).toBe(
      "German Radio 10.5cm at D3 fired at Soviet Rifle at E1; targeting roll: target 10, " +
        "rolled 100 [d10x10: 10 x 10]: hit; infantry effect roll at E1: target 7, " +
        "rolled 20 [2d10: 10 + 10]: passed (critical)"
    )

    expect(firing2.spotting).toBe("A")
    expect(game.spottingStatus).toStrictEqual([{
      ref: "A", target: tloc, level: 1, unit: firing2, sponson: false,
    }])
  })

  test("firing tank adds spotting", () => {
    const game = createFireGame()
    const map = game.scenario.map
    const firing = new Unit(testGTank)
    firing.id = "firing1"
    firing.facing = 1
    firing.turretFacing = 1
    const floc = new Coordinate(4, 2)
    map.addCounter(floc, firing)
    map.select(firing)

    const target = new Unit(testRInf)
    target.id = "target1"
    const tloc = new Coordinate(2, 2)
    map.addCounter(tloc, target)
    organizeStacks(map)

    game.setGameState(new FireState(game, false))

    select(map, {
      counter: map.countersAt(tloc)[0],
      target: { type: "map", xy: tloc }
    }, () => {})
    expect(target.targetSelected).toBe(true)

    const mult = rangeMultiplier(
      map, makeAction(game, ["firing1"])[0].counter, tloc, false, false, false
    )
    expect(mult.mult).toBe(4)
    expect(mult.why.length).toBe(1)
    expect(mult.why[0]).toBe("- base multiplier 4")

    const original = Math.random
    vi.spyOn(Math, "random").mockReturnValue(0.99)
    game.gameState?.finish()
    Math.random = original

    expect(game.actions[0].stringValue).toBe(
      "German PzKpfw 35(t) at E3 fired at Soviet Rifle at C3; targeting roll: target 12, " +
        "rolled 100 [d10x10: 10 x 10]: hit; roll for effect: target 15, " +
        "rolled 20 [2d10: 10 + 10]: passed"
    )

    expect(firing.spotting).toBe("A")
    expect(game.spottingStatus).toStrictEqual([{
      ref: "A", target: tloc, level: 1, unit: firing, sponson: false,
    }])
  })

  test("firing gun adds spotting", () => {
    const game = createFireGame()
    const map = game.scenario.map
    const firing = new Unit(testGInf)
    firing.id = "firing1"
    const floc = new Coordinate(4, 2)
    map.addCounter(floc, firing)
    const firing2 = new Unit(testGGun)
    firing2.id = "firing2"
    firing2.facing = 1
    map.addCounter(floc, firing2)
    map.select(firing2)

    const target = new Unit(testRInf)
    target.id = "target1"
    const tloc = new Coordinate(2, 2)
    map.addCounter(tloc, target)
    organizeStacks(map)

    game.setGameState(new FireState(game, false))

    select(map, {
      counter: map.countersAt(tloc)[0],
      target: { type: "map", xy: tloc }
    }, () => {})
    expect(target.targetSelected).toBe(true)

    const mult = rangeMultiplier(
      map, makeAction(game, ["firing2"])[0].counter, tloc, false, false, false
    )
    expect(mult.mult).toBe(4)
    expect(mult.why.length).toBe(1)
    expect(mult.why[0]).toBe("- base multiplier 4")

    const original = Math.random
    vi.spyOn(Math, "random").mockReturnValue(0.99)
    game.gameState?.finish()
    Math.random = original

    expect(game.actions[0].stringValue).toBe(
      "German 3.7cm Pak 36 at E3 fired at Soviet Rifle at C3; targeting roll: target 12, " +
        "rolled 100 [d10x10: 10 x 10]: hit; roll for effect: target 15, " +
        "rolled 20 [2d10: 10 + 10]: passed"
    )

    expect(firing2.spotting).toBe("A")
    expect(game.spottingStatus).toStrictEqual([{
      ref: "A", target: tloc, level: 1, unit: firing2, sponson: false,
    }])
  })

  test("firing sponson adds spotting", () => {
    const game = createFireGame()
    game.scenario.axisFactions = ["ita"]
    const map = game.scenario.map
    const firing = new Unit(testITank)
    firing.id = "firing1"
    firing.facing = 1
    const floc = new Coordinate(4, 2)
    map.addCounter(floc, firing)
    map.select(firing)

    const target = new Unit(testRInf)
    target.id = "target1"
    const tloc = new Coordinate(2, 2)
    map.addCounter(tloc, target)
    organizeStacks(map)

    game.setGameState(new FireState(game, false))

    select(map, {
      counter: map.countersAt(tloc)[0],
      target: { type: "map", xy: tloc }
    }, () => {})
    expect(target.targetSelected).toBe(true)

    const mult = rangeMultiplier(
      map, makeAction(game, ["firing1"])[0].counter, tloc, true, false, false
    )
    expect(mult.mult).toBe(4)
    expect(mult.why.length).toBe(1)
    expect(mult.why[0]).toBe("- base multiplier 4")

    const original = Math.random
    vi.spyOn(Math, "random").mockReturnValue(0.99)
    game.gameState?.finish()
    Math.random = original

    expect(game.actions[0].stringValue).toBe(
      "Italian M11/39 at E3 fired hull gun at Soviet Rifle at C3; targeting roll: target 12, " +
        "rolled 100 [d10x10: 10 x 10]: hit; roll for effect: target 12, " +
        "rolled 20 [2d10: 10 + 10]: passed (critical)"
    )

    expect(firing.sponsonSpotting).toBe("A")
    expect(game.spottingStatus).toStrictEqual([{
      ref: "A", target: tloc, level: 1, unit: firing, sponson: true,
    }])
  })

  test("firing crewed mortar adds spotting", () => {
    const game = createFireGame()
    const map = game.scenario.map
    const firing = new Unit(testGInf)
    firing.id = "firing1"
    const floc = new Coordinate(3, 2)
    map.addCounter(floc, firing)
    const firing2 = new Unit(testGHMortar)
    firing2.id = "firing2"
    map.addCounter(floc, firing2)
    map.select(firing2)

    const target = new Unit(testRInf)
    target.id = "target1"
    const tloc = new Coordinate(4, 0)
    map.addCounter(tloc, target)
    organizeStacks(map)

    game.setGameState(new FireState(game, false))

    select(map, {
      counter: map.countersAt(tloc)[0],
      target: { type: "map", xy: tloc }
    }, () => {})
    expect(target.targetSelected).toBe(true)

    const mult = rangeMultiplier(
      map, makeAction(game, ["firing2"])[0].counter, tloc, false, false, false
    )
    expect(mult.mult).toBe(3)
    expect(mult.why.length).toBe(1)
    expect(mult.why[0]).toBe("- base multiplier 3")

    const original = Math.random
    vi.spyOn(Math, "random").mockReturnValue(0.99)
    game.gameState?.finish()
    Math.random = original

    expect(game.actions[0].stringValue).toBe(
      "German 12cm GrW 42 at D3 fired at Soviet Rifle at E1; targeting roll: target 6, " +
        "rolled 100 [d10x10: 10 x 10]: hit; infantry effect roll: target 6, " +
        "rolled 20 [2d10: 10 + 10]: passed (critical)"
    )

    expect(firing2.spotting).toBe("A")
    expect(game.spottingStatus).toStrictEqual([{
      ref: "A", target: tloc, level: 1, unit: firing2, sponson: false,
    }])
  })

  test("firing non-crewed mortar doesn't add spotting", () => {
    const game = createFireGame()
    const map = game.scenario.map
    const firing = new Unit(testGInf)
    firing.id = "firing1"
    const floc = new Coordinate(3, 2)
    map.addCounter(floc, firing)
    const firing2 = new Unit(testGMortar)
    firing2.id = "firing2"
    map.addCounter(floc, firing2)
    map.select(firing2)

    const target = new Unit(testRInf)
    target.id = "target1"
    const tloc = new Coordinate(4, 0)
    map.addCounter(tloc, target)
    organizeStacks(map)

    game.setGameState(new FireState(game, false))

    select(map, {
      counter: map.countersAt(tloc)[0],
      target: { type: "map", xy: tloc }
    }, () => {})
    expect(target.targetSelected).toBe(true)

    const mult = rangeMultiplier(
      map, makeAction(game, ["firing2"])[0].counter, tloc, false, false, false
    )
    expect(mult.mult).toBe(3)
    expect(mult.why.length).toBe(1)
    expect(mult.why[0]).toBe("- base multiplier 3")

    const original = Math.random
    vi.spyOn(Math, "random").mockReturnValue(0.99)
    game.gameState?.finish()
    Math.random = original

    expect(game.actions[0].stringValue).toBe(
      "German 5cm leGrW 36 at D3 fired at Soviet Rifle at E1; targeting roll: target 6, " +
        "rolled 100 [d10x10: 10 x 10]: hit; infantry effect roll: target 12, " +
        "rolled 20 [2d10: 10 + 10]: passed (critical)"
    )

    expect(firing2.spotting).toBe(undefined)
    expect(game.spottingStatus).toStrictEqual([])
  })

  test("spotting improves targeting", () => {
    const game = createFireGame()
    const map = game.scenario.map
    const firing = new Unit(testGTank)
    firing.id = "firing1"
    firing.facing = 1
    firing.turretFacing = 1
    firing.spotting = "A"
    const floc = new Coordinate(4, 2)
    map.addCounter(floc, firing)
    map.select(firing)

    const target = new Unit(testRInf)
    target.id = "target1"
    const tloc = new Coordinate(2, 2)
    map.addCounter(tloc, target)
    organizeStacks(map)

    game.spottingStatus.push({
      ref: "A", target: tloc, level: 1, unit: firing, sponson: false,
    })

    game.setGameState(new FireState(game, false))

    select(map, {
      counter: map.countersAt(tloc)[1],
      target: { type: "map", xy: tloc }
    }, () => {})
    expect(target.targetSelected).toBe(true)

    const mult = rangeMultiplier(
      map, makeAction(game, ["firing1"])[0].counter, tloc, false, false, false
    )
    expect(mult.mult).toBe(3)
    expect(mult.why.length).toBe(2)
    expect(mult.why[0]).toBe("- base multiplier 4")
    expect(mult.why[1]).toBe("- minus 1 for spotting")

    const original = Math.random
    vi.spyOn(Math, "random").mockReturnValue(0.99)
    game.gameState?.finish()
    Math.random = original

    expect(game.actions[0].stringValue).toBe(
      "German PzKpfw 35(t) at E3 fired at Soviet Rifle at C3; targeting roll: target 9, " +
        "rolled 100 [d10x10: 10 x 10]: hit; roll for effect: target 15, " +
        "rolled 20 [2d10: 10 + 10]: passed"
    )

    expect(firing.spotting).toBe("A")
    expect(game.spottingStatus).toStrictEqual([{
      ref: "A", target: tloc, level: 2, unit: firing, sponson: false,
    }])
  })

  test("spotting improves gun targeting", () => {
    const game = createFireGame()
    const map = game.scenario.map
    const firing = new Unit(testGInf)
    firing.id = "firing1"
    const floc = new Coordinate(4, 2)
    map.addCounter(floc, firing)
    const firing2 = new Unit(testGGun)
    firing2.id = "firing2"
    firing2.facing = 1
    firing2.spotting = "A"
    map.addCounter(floc, firing2)
    map.select(firing2)

    const target = new Unit(testRInf)
    target.id = "target1"
    const tloc = new Coordinate(2, 2)
    map.addCounter(tloc, target)
    organizeStacks(map)

    game.spottingStatus.push({
      ref: "A", target: tloc, level: 1, unit: firing2, sponson: false,
    })

    game.setGameState(new FireState(game, false))

    select(map, {
      counter: map.countersAt(tloc)[1],
      target: { type: "map", xy: tloc }
    }, () => {})
    expect(target.targetSelected).toBe(true)

    const mult = rangeMultiplier(
      map, makeAction(game, ["firing2"])[0].counter, tloc, false, false, false
    )
    expect(mult.mult).toBe(3)
    expect(mult.why.length).toBe(2)
    expect(mult.why[0]).toBe("- base multiplier 4")
    expect(mult.why[1]).toBe("- minus 1 for spotting")

    const original = Math.random
    vi.spyOn(Math, "random").mockReturnValue(0.99)
    game.gameState?.finish()
    Math.random = original

    expect(game.actions[0].stringValue).toBe(
      "German 3.7cm Pak 36 at E3 fired at Soviet Rifle at C3; targeting roll: target 9, " +
        "rolled 100 [d10x10: 10 x 10]: hit; roll for effect: target 15, " +
        "rolled 20 [2d10: 10 + 10]: passed"
    )

    expect(firing2.spotting).toBe("A")
    expect(game.spottingStatus).toStrictEqual([{
      ref: "A", target: tloc, level: 2, unit: firing2, sponson: false,
    }])
  })

  test("spotting improves sponson targeting", () => {
    const game = createFireGame()
    game.scenario.axisFactions = ["ita"]
    const map = game.scenario.map
    const firing = new Unit(testITank)
    firing.id = "firing1"
    firing.facing = 1
    firing.sponsonSpotting = "A"
    const floc = new Coordinate(4, 2)
    map.addCounter(floc, firing)
    map.select(firing)

    const target = new Unit(testRInf)
    target.id = "target1"
    const tloc = new Coordinate(2, 2)
    map.addCounter(tloc, target)
    organizeStacks(map)

    game.spottingStatus.push({
      ref: "A", target: tloc, level: 2, unit: firing, sponson: true,
    })

    game.setGameState(new FireState(game, false))

    select(map, {
      counter: map.countersAt(tloc)[1],
      target: { type: "map", xy: tloc }
    }, () => {})
    expect(target.targetSelected).toBe(true)

    const mult = rangeMultiplier(
      map, makeAction(game, ["firing1"])[0].counter, tloc, true, false, false
    )
    expect(mult.mult).toBe(2)
    expect(mult.why.length).toBe(2)
    expect(mult.why[0]).toBe("- base multiplier 4")
    expect(mult.why[1]).toBe("- minus 2 for spotting")

    const original = Math.random
    vi.spyOn(Math, "random").mockReturnValue(0.99)
    game.gameState?.finish()
    Math.random = original

    expect(game.actions[0].stringValue).toBe(
      "Italian M11/39 at E3 fired hull gun at Soviet Rifle at C3; targeting roll: target 6, " +
        "rolled 100 [d10x10: 10 x 10]: hit; roll for effect: target 12, " +
        "rolled 20 [2d10: 10 + 10]: passed (critical)"
    )

    expect(firing.sponsonSpotting).toBe("A")
    expect(game.spottingStatus).toStrictEqual([{
      ref: "A", target: tloc, level: 2, unit: firing, sponson: true,
    }])
  })

  test("firing at new target doesn't improve targeting and resets spotting", () => {
    const game = createFireGame()
    const map = game.scenario.map
    const firing = new Unit(testGTank)
    firing.id = "firing1"
    firing.facing = 1
    firing.turretFacing = 1
    firing.spotting = "A"
    const floc = new Coordinate(4, 2)
    map.addCounter(floc, firing)
    map.select(firing)

    const target = new Unit(testRInf)
    target.id = "target1"
    const tloc = new Coordinate(2, 2)
    map.addCounter(tloc, target)
    organizeStacks(map)

    game.setGameState(new FireState(game, false))

    game.spottingStatus.push({
      ref: "A", target: new Coordinate(3, 2), level: 1, unit: firing, sponson: false,
    })

    select(map, {
      counter: map.countersAt(tloc)[0],
      target: { type: "map", xy: tloc }
    }, () => {})
    expect(target.targetSelected).toBe(true)

    const mult = rangeMultiplier(
      map, makeAction(game, ["firing1"])[0].counter, tloc, false, false, false
    )
    expect(mult.mult).toBe(4)
    expect(mult.why.length).toBe(1)
    expect(mult.why[0]).toBe("- base multiplier 4")

    const original = Math.random
    vi.spyOn(Math, "random").mockReturnValue(0.99)
    game.gameState?.finish()
    Math.random = original

    expect(game.actions[0].stringValue).toBe(
      "German PzKpfw 35(t) at E3 fired at Soviet Rifle at C3; targeting roll: target 12, " +
        "rolled 100 [d10x10: 10 x 10]: hit; roll for effect: target 15, " +
        "rolled 20 [2d10: 10 + 10]: passed"
    )

    expect(firing.spotting).toBe("A")
    expect(game.spottingStatus).toStrictEqual([{
      ref: "A", target: tloc, level: 1, unit: firing, sponson: false,
    }])
  })

  test("moving cancels spotting", () => {
    const game = createBlankGame()
    const map = game.scenario.map
    const firing = new Unit(testGInf)
    firing.id = "firing1"
    const floc = new Coordinate(4, 2)
    map.addCounter(floc, firing)
    const firing2 = new Unit(testGRadio)
    firing2.id = "firing2"
    firing2.spotting = "A"
    map.addCounter(floc, firing2)
    organizeStacks(map)
    map.select(firing)

    game.spottingStatus.push({
      ref: "A", target: new Coordinate(0, 2), level: 1, unit: firing2, sponson: false
    })

    game.setGameState(new MoveState(game))
    expect(firing.selected).toBe(true)
    expect(firing2.selected).toBe(true)
    game.moveState.move(3, 2)
    game.moveState.finish()

    expect(game.actions[0].type).toBe("move")

    expect(firing2.spotting).toBe(undefined)
    expect(game.spottingStatus).toStrictEqual([])

    game.executeUndo(false)

    expect(firing2.spotting).toBe("A")
    expect(game.spottingStatus).toStrictEqual([{
      ref: "A", target: new Coordinate(0, 2), level: 1, unit: firing2, sponson: false,
    }])
  })

  test("moving tank cancels spotting", () => {
    const game = createBlankGame()
    const map = game.scenario.map
    const firing = new Unit(testGTank)
    firing.id = "firing1"
    firing.facing = 1
    firing.turretFacing = 1
    firing.spotting = "A"
    const floc = new Coordinate(4, 2)
    map.addCounter(floc, firing)
    map.select(firing)
    organizeStacks(map)

    game.spottingStatus.push({
      ref: "A", target: new Coordinate(0, 2), level: 1, unit: firing, sponson: false,
    })

    game.setGameState(new MoveState(game))
    game.moveState.move(3, 2)
    game.moveState.finish()

    expect(game.actions[0].type).toBe("move")
    expect(game.actions[0].data.spotting_data).toStrictEqual([{
      x: 0, y: 2, ref: "A", id: "firing1", level: 1, sponson: false,
    }])

    expect(firing.spotting).toBe(undefined)
    expect(game.spottingStatus).toStrictEqual([])

    game.executeUndo(false)

    expect(firing.spotting).toBe("A")
    expect(game.spottingStatus).toStrictEqual([{
      ref: "A", target: new Coordinate(0, 2), level: 1, unit: firing, sponson: false,
    }])
  })

  test("moving cancels sponson spotting", () => {
    const game = createBlankGame()
    game.scenario.axisFactions = ["ita"]
    const map = game.scenario.map
    const firing = new Unit(testITank)
    firing.id = "firing1"
    firing.facing = 1
    firing.turretFacing = 1
    firing.sponsonSpotting = "A"
    const floc = new Coordinate(4, 2)
    map.addCounter(floc, firing)
    map.select(firing)
    organizeStacks(map)

    game.spottingStatus.push({
      ref: "A", target: new Coordinate(0, 2), level: 1, unit: firing, sponson: true,
    })

    game.setGameState(new MoveState(game))
    game.moveState.move(3, 2)
    game.moveState.finish()

    expect(game.actions[0].type).toBe("move")
    expect(game.actions[0].data.spotting_data).toStrictEqual([{
      x: 0, y: 2, ref: "A", id: "firing1", level: 1, sponson: true,
    }])

    expect(firing.spotting).toBe(undefined)
    expect(game.spottingStatus).toStrictEqual([])

    game.executeUndo(false)

    expect(firing.sponsonSpotting).toBe("A")
    expect(game.spottingStatus).toStrictEqual([{
      ref: "A", target: new Coordinate(0, 2), level: 1, unit: firing, sponson: true,
    }])
  })

  test("assault moving cancels spotting", () => {
    const game = createBlankGame()
    const map = game.scenario.map
    const firing = new Unit(testGInf)
    firing.id = "firing1"
    const floc = new Coordinate(4, 2)
    map.addCounter(floc, firing)
    const firing2 = new Unit(testGRadio)
    firing2.id = "firing2"
    firing2.spotting = "A"
    map.addCounter(floc, firing2)
    organizeStacks(map)
    map.select(firing)

    game.spottingStatus.push({
      ref: "A", target: new Coordinate(0, 2), level: 1, unit: firing2, sponson: false
    })

    game.setGameState(new AssaultState(game))
    expect(firing.selected).toBe(true)
    expect(firing2.selected).toBe(true)
    game.moveState.move(3, 2)
    game.moveState.finish()

    expect(game.actions[0].type).toBe("assault_move")

    expect(firing2.spotting).toBe(undefined)
    expect(game.spottingStatus).toStrictEqual([])

    game.executeUndo(false)

    expect(firing2.spotting).toBe("A")
    expect(game.spottingStatus).toStrictEqual([{
      ref: "A", target: new Coordinate(0, 2), level: 1, unit: firing2, sponson: false,
    }])
  })

  test("being displaced cancels spotting", () => {
    const game = createBlankGame()
    const map = game.scenario.map
    const firing = new Unit(testGInf)
    firing.id = "firing1"
    const floc = new Coordinate(4, 2)
    map.addCounter(floc, firing)
    const firing2 = new Unit(testGRadio)
    firing2.id = "firing2"
    firing2.spotting = "A"
    map.addCounter(floc, firing2)
    organizeStacks(map)

    game.spottingStatus.push({
      ref: "A", target: new Coordinate(4, 2), level: 1, unit: firing2, sponson: false
    })

    game.fireDisplaceNeeded.push({
      unit: firing, loc: floc,
    })

    game.setGameState(new FireDisplaceState(game))
    game.fireDisplaceState.move(3, 2)
    game.fireDisplaceState.finish()

    expect(firing2.spotting).toBe(undefined)
    expect(game.spottingStatus).toStrictEqual([])

    game.executeUndo(false)

    expect(firing2.spotting).toBe("A")
    expect(game.spottingStatus).toStrictEqual([{
      ref: "A", target: new Coordinate(4, 2), level: 1, unit: firing2, sponson: false,
    }])
  })

  test("destroying vehicle cancels spotting", () => {
    const game = createFireGame()
    const map = game.scenario.map
    const firing = new Unit(testGTank)
    firing.id = "firing1"
    firing.facing = 1
    firing.turretFacing = 1
    firing.spotting = "A"
    const floc = new Coordinate(4, 2)
    map.addCounter(floc, firing)
    map.select(firing)

    game.spottingStatus.push({
      ref: "A", target: new Coordinate(2, 2), level: 1, unit: firing, sponson: false
    })

    expect(firing.spotting).toBe("A")
    expect(game.spottingStatus).toStrictEqual([{
      ref: "A", target: new Coordinate(2, 2), level: 1, unit: firing, sponson: false
    }])

    firing.wreck(game)

    expect(firing.spotting).toBe(undefined)
    expect(game.spottingStatus).toStrictEqual([])
  })

  test("abandoning vehicle cancels spotting", () => {
    const game = createFireGame()
    const map = game.scenario.map
    const firing = new Unit(testGTank)
    firing.id = "firing1"
    firing.facing = 1
    firing.turretFacing = 1
    firing.spotting = "A"
    const floc = new Coordinate(4, 2)
    map.addCounter(floc, firing)
    map.select(firing)

    game.spottingStatus.push({
      ref: "A", target: new Coordinate(2, 2), level: 1, unit: firing, sponson: false
    })

    expect(firing.spotting).toBe("A")
    expect(game.spottingStatus).toStrictEqual([{
      ref: "A", target: new Coordinate(2, 2), level: 1, unit: firing, sponson: false
    }])

    game.setGameState(new AssaultState(game))
    game.assaultState.abandon()
    game.assaultState.finish()

    expect(firing.spotting).toBe(undefined)
    expect(game.spottingStatus).toStrictEqual([])

    game.executeUndo(false)

    expect(firing.spotting).toBe("A")
    expect(game.spottingStatus).toStrictEqual([{
      ref: "A", target: new Coordinate(2, 2), level: 1, unit: firing, sponson: false
    }])
  })

  test("turret jamming cancels spotting", () => {
    const game = createFireGame()
    const map = game.scenario.map
    const firing = new Unit(testGTank)
    firing.id = "firing1"
    firing.facing = 1
    firing.turretFacing = 1
    firing.spotting = "A"
    const floc = new Coordinate(4, 2)
    map.addCounter(floc, firing)
    map.select(firing)

    game.spottingStatus.push({
      ref: "A", target: new Coordinate(2, 2), level: 1, unit: firing, sponson: false
    })

    expect(firing.spotting).toBe("A")
    expect(game.spottingStatus).toStrictEqual([{
      ref: "A", target: new Coordinate(2, 2), level: 1, unit: firing, sponson: false
    }])

    firing.jamTurret(game)

    expect(firing.spotting).toBe(undefined)
    expect(game.spottingStatus).toStrictEqual([])
  })

  test("being immobilized cancels sponson spotting", () => {
    const game = createFireGame()
    game.scenario.axisFactions = ["ita"]
    const map = game.scenario.map
    const firing = new Unit(testITank)
    firing.id = "firing1"
    firing.facing = 1
    firing.sponsonSpotting = "A"
    const floc = new Coordinate(4, 2)
    map.addCounter(floc, firing)
    map.select(firing)

    game.spottingStatus.push({
      ref: "A", target: new Coordinate(2, 2), level: 1, unit: firing, sponson: true
    })

    expect(firing.sponsonSpotting).toBe("A")
    expect(game.spottingStatus).toStrictEqual([{
      ref: "A", target: new Coordinate(2, 2), level: 1, unit: firing, sponson: true
    }])

    firing.immobilize(map)

    expect(firing.sponsonSpotting).toBe(undefined)
    expect(game.spottingStatus).toStrictEqual([])
  })

  test("being immobilized cancels hull spotting", () => {
    const game = createFireGame()
    const map = game.scenario.map
    const firing = new Unit(testGTD)
    firing.id = "firing1"
    firing.facing = 1
    firing.spotting = "A"
    const floc = new Coordinate(4, 2)
    map.addCounter(floc, firing)
    map.select(firing)

    game.spottingStatus.push({
      ref: "A", target: new Coordinate(2, 2), level: 1, unit: firing, sponson: false
    })

    expect(firing.spotting).toBe("A")
    expect(game.spottingStatus).toStrictEqual([{
      ref: "A", target: new Coordinate(2, 2), level: 1, unit: firing, sponson: false
    }])

    firing.immobilize(map)

    expect(firing.spotting).toBe(undefined)
    expect(game.spottingStatus).toStrictEqual([])
  })

  test("turret jamming doesn't add turret spotting", () => {
    const game = createFireGame()
    const map = game.scenario.map
    const firing = new Unit(testGTank)
    firing.id = "firing1"
    firing.facing = 1
    firing.turretFacing = 1
    firing.jamTurret(game)
    const floc = new Coordinate(4, 2)
    map.addCounter(floc, firing)
    map.select(firing)

    const target = new Unit(testRInf)
    target.id = "target1"
    const tloc = new Coordinate(2, 2)
    map.addCounter(tloc, target)
    organizeStacks(map)

    game.setGameState(new FireState(game, false))

    select(map, {
      counter: map.countersAt(tloc)[0],
      target: { type: "map", xy: tloc }
    }, () => {})
    expect(target.targetSelected).toBe(true)

    const mult = rangeMultiplier(
      map, makeAction(game, ["firing1"])[0].counter, tloc, false, false, false
    )
    expect(mult.mult).toBe(5)
    expect(mult.why.length).toBe(2)
    expect(mult.why[0]).toBe("- base multiplier 4")
    expect(mult.why[1]).toBe("- plus 1 for jammed turret")

    const original = Math.random
    vi.spyOn(Math, "random").mockReturnValue(0.99)
    game.gameState?.finish()
    Math.random = original

    expect(game.actions[0].stringValue).toBe(
      "German PzKpfw 35(t) at E3 fired at Soviet Rifle at C3; targeting roll: target 15, " +
        "rolled 100 [d10x10: 10 x 10]: hit; roll for effect: target 17, " +
        "rolled 20 [2d10: 10 + 10]: passed"
    )

    expect(firing.spotting).toBe(undefined)
    expect(game.spottingStatus).toStrictEqual([])
  })

  test("being immobilized doesn't add sponson spotting", () => {
    const game = createFireGame()
    game.scenario.axisFactions = ["ita"]
    const map = game.scenario.map
    const firing = new Unit(testITank)
    firing.id = "firing1"
    firing.facing = 1
    firing.immobilize(map)
    const floc = new Coordinate(4, 2)
    map.addCounter(floc, firing)
    map.select(firing)

    const target = new Unit(testRInf)
    target.id = "target1"
    const tloc = new Coordinate(2, 2)
    map.addCounter(tloc, target)
    organizeStacks(map)

    game.setGameState(new FireState(game, false))

    select(map, {
      counter: map.countersAt(tloc)[0],
      target: { type: "map", xy: tloc }
    }, () => {})
    expect(target.targetSelected).toBe(true)

    const mult = rangeMultiplier(
      map, makeAction(game, ["firing1"])[0].counter, tloc, true, false, false
    )
    expect(mult.mult).toBe(5)
    expect(mult.why.length).toBe(2)
    expect(mult.why[0]).toBe("- base multiplier 4")
    expect(mult.why[1]).toBe("- plus 1 for immobilized")

    const original = Math.random
    vi.spyOn(Math, "random").mockReturnValue(0.99)
    game.gameState?.finish()
    Math.random = original

    expect(game.actions[0].stringValue).toBe(
      "Italian M11/39 at E3 fired hull gun at Soviet Rifle at C3; targeting roll: target 15, " +
        "rolled 100 [d10x10: 10 x 10]: hit; roll for effect: target 15, " +
        "rolled 20 [2d10: 10 + 10]: passed"
    )

    expect(firing.spotting).toBe(undefined)
    expect(game.spottingStatus).toStrictEqual([])
  })

  test("being immobilized doesn't add hull spotting", () => {
    const game = createFireGame()
    const map = game.scenario.map
    const firing = new Unit(testGTD)
    firing.id = "firing1"
    firing.facing = 1
    firing.immobilize(map)
    const floc = new Coordinate(4, 2)
    map.addCounter(floc, firing)
    map.select(firing)

    const target = new Unit(testRInf)
    target.id = "target1"
    const tloc = new Coordinate(2, 2)
    map.addCounter(tloc, target)
    organizeStacks(map)

    game.setGameState(new FireState(game, false))

    select(map, {
      counter: map.countersAt(tloc)[0],
      target: { type: "map", xy: tloc }
    }, () => {})
    expect(target.targetSelected).toBe(true)

    const mult = rangeMultiplier(
      map, makeAction(game, ["firing1"])[0].counter, tloc, false, false, false
    )
    expect(mult.mult).toBe(5)
    expect(mult.why.length).toBe(2)
    expect(mult.why[0]).toBe("- base multiplier 4")
    expect(mult.why[1]).toBe("- plus 1 for immobilized")

    const original = Math.random
    vi.spyOn(Math, "random").mockReturnValue(0.99)
    game.gameState?.finish()
    Math.random = original

    expect(game.actions[0].stringValue).toBe(
      "German SU-76 at E3 fired at Soviet Rifle at C3; targeting roll: target 15, " +
        "rolled 100 [d10x10: 10 x 10]: hit; roll for effect: target 12, " +
        "rolled 20 [2d10: 10 + 10]: passed (critical)"
    )

    expect(firing.spotting).toBe(undefined)
    expect(game.spottingStatus).toStrictEqual([])
  })

  test("jamming weapon cancels spotting", () => {
    const game = createFireGame()
    const map = game.scenario.map
    const firing = new Unit(testGTank)
    firing.id = "firing1"
    firing.spotting = "A"
    const floc = new Coordinate(3, 2)
    map.addCounter(floc, firing)
    map.select(firing)

    const target = new Unit(testRTank)
    target.id = "target1"
    const tloc = new Coordinate(4, 2)
    map.addCounter(tloc, target)
    organizeStacks(map)

    game.spottingStatus.push({
      ref: "A", target: tloc, level: 1, unit: firing, sponson: false
    })

    game.setGameState(new FireState(game, false))

    select(map, {
      counter: map.countersAt(tloc)[1],
      target: { type: "map", xy: tloc }
    }, () => {})
    expect(target.targetSelected).toBe(true)

    const original = Math.random
    vi.spyOn(Math, "random").mockReturnValue(0.01)
    game.gameState?.finish()
    Math.random = original

    expect(game.moraleChecksNeeded).toStrictEqual([])
    expect(target.isWreck).toBe(false)
    expect(deHTML((game.lastAction?.data.dice_result as GameActionDiceResult[])[0].description as string)).toBe(
      "targeting roll: target 3, rolled 1 [d10x10: 1 x 1]: miss, firing weapon broken"
    )

    expect(firing.spotting).toBe(undefined)
    expect(game.spottingStatus).toStrictEqual([])
  })

  test("destroying weapon cancels spotting", () => {
    const game = createFireGame()
    const map = game.scenario.map
    const firing = new Unit(testGInf)
    firing.id = "firing1"
    const floc = new Coordinate(3, 2)
    map.addCounter(floc, firing)
    const firing2 = new Unit(testGHMortar)
    firing2.id = "firing2"
    firing2.spotting = "A"
    map.addCounter(floc, firing2)
    map.select(firing2)

    const target = new Unit(testRInf)
    target.id = "target1"
    const tloc = new Coordinate(4, 0)
    map.addCounter(tloc, target)
    organizeStacks(map)

    game.spottingStatus.push({
      ref: "A", target: tloc, level: 1, unit: firing2, sponson: false
    })

    game.setGameState(new FireState(game, false))

    select(map, {
      counter: map.countersAt(tloc)[1],
      target: { type: "map", xy: tloc }
    }, () => {})
    expect(target.targetSelected).toBe(true)

    const original = Math.random
    vi.spyOn(Math, "random").mockReturnValue(0.01)
    game.gameState?.finish()
    Math.random = original

    expect(game.actions[0].stringValue).toBe(
      "German 12cm GrW 42 at D3 fired at Soviet Rifle at E1; targeting roll: " +
        "target 4, rolled 1 [d10x10: 1 x 1]: miss, firing weapon destroyed"
    )

    expect(firing2.spotting).toBe(undefined)
    expect(game.spottingStatus).toStrictEqual([])
  })

  test("breaking crew cancels spotting", () => {
    const game = createBlankGame()
    const map = game.scenario.map
    const firing = new Unit(testGInf)
    firing.id = "firing1"
    const floc = new Coordinate(4, 2)
    map.addCounter(floc, firing)
    const firing2 = new Unit(testGRadio)
    firing2.id = "firing2"
    firing2.spotting = "A"
    map.addCounter(floc, firing2)
    organizeStacks(map)

    game.spottingStatus.push({
      ref: "A", target: new Coordinate(0, 2), level: 1, unit: firing2, sponson: false
    })

    expect(firing2.spotting).toBe("A")
    expect(game.spottingStatus).toStrictEqual([{
      ref: "A", target: new Coordinate(0, 2), level: 1, unit: firing2, sponson: false
    }])

    firing.break(game)

    expect(firing2.spotting).toBe(undefined)
    expect(game.spottingStatus).toStrictEqual([])
  })

  test("pinning crew cancels spotting", () => {
    const game = createBlankGame()
    const map = game.scenario.map
    const firing = new Unit(testGInf)
    firing.id = "firing1"
    const floc = new Coordinate(4, 2)
    map.addCounter(floc, firing)
    const firing2 = new Unit(testGRadio)
    firing2.id = "firing2"
    firing2.spotting = "A"
    map.addCounter(floc, firing2)
    organizeStacks(map)

    game.spottingStatus.push({
      ref: "A", target: new Coordinate(0, 2), level: 1, unit: firing2, sponson: false
    })

    expect(firing2.spotting).toBe("A")
    expect(game.spottingStatus).toStrictEqual([{
      ref: "A", target: new Coordinate(0, 2), level: 1, unit: firing2, sponson: false
    }])

    firing.pin(game)

    expect(firing2.spotting).toBe(undefined)
    expect(game.spottingStatus).toStrictEqual([])
  })
})
