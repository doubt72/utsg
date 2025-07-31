import { Coordinate, featureType } from "../../utilities/commonTypes"
import Unit from "../Unit"
import { describe, expect, test, vi } from "vitest"
import organizeStacks from "../support/organizeStacks"
import select from "./select"
import { reactionFireHexes } from "./reactionFire"
import WarningActionError from "../actions/WarningActionError"
import Feature from "../Feature"
import { createFireGame, testGInf, testGMG, testGTank, testRInf, testRTank } from "./testHelpers"
import InitiativeState, { initiativeCheck } from "./state/InitiativeState"
import FireState from "./state/FireState"
import { reactionFireCheck } from "./state/ReactionState"
import MoveState from "./state/MoveState"
import { breakdownCheck } from "./state/BreakdownState"
import MoraleCheckState from "./state/MoraleCheckState"

describe("reaction fire tests", () => {
  test("reaction fire after fire", () => {
    const game = createFireGame()
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

    game.gameState = new FireState(game, false)
    select(map, {
      counter: map.countersAt(oloc)[0],
      target: { type: "map", xy: oloc }
    }, () => {})
    expect(other.targetSelected).toBe(true)

    const original = Math.random
    vi.spyOn(Math, "random").mockReturnValue(0.01)
    game.gameState.finish()
    Math.random = original

    expect(breakdownCheck(game)).toBe(false)
    expect(initiativeCheck(game)).toBe(true)
    expect(reactionFireCheck(game)).toBe(false)

    game.gameState = new InitiativeState(game)

    expect(initiativeCheck(game)).toBe(false)
    expect(reactionFireCheck(game)).toBe(false)

    vi.spyOn(Math, "random").mockReturnValue(0.99)
    expect(game.currentPlayer).toBe(2)
    game.gameState.finish()
    expect(game.currentPlayer).toBe(2)

    Math.random = original

    expect(reactionFireCheck(game)).toBe(true)

    other.select()

    game.gameState = new FireState(game, true)

    expect(reactionFireHexes(game)).toStrictEqual([
      new Coordinate(4, 2),
    ])

    select(map, {
      counter: map.countersAt(new Coordinate(4, 2))[0],
      target: { type: "map", xy: new Coordinate(4, 2) }
    }, () => {})
    expect(unit.targetSelected).toBe(true)

    vi.spyOn(Math, "random").mockReturnValue(0.01)
    game.gameState.finish()
    Math.random = original

    expect(game.lastAction?.type).toBe("reaction_fire")

    expect(initiativeCheck(game)).toBe(false)
  })

  test("reaction fire after move", () => {
    const game = createFireGame()
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

    game.gameState = new MoveState(game)
    game.moveState.move(3, 2)
    game.moveState.move(2, 2)
    game.moveState.move(1, 2)
    game.gameState.finish()

    expect(breakdownCheck(game)).toBe(false)
    expect(initiativeCheck(game)).toBe(true)
    expect(reactionFireCheck(game)).toBe(false)

    game.gameState = new InitiativeState(game)

    expect(initiativeCheck(game)).toBe(false)
    expect(reactionFireCheck(game)).toBe(false)

    const original = Math.random
    vi.spyOn(Math, "random").mockReturnValue(0.99)

    expect(game.currentPlayer).toBe(2)
    game.gameState.finish()
    expect(game.currentPlayer).toBe(2)

    Math.random = original

    expect(reactionFireCheck(game)).toBe(true)

    other.select()

    game.gameState = new FireState(game, true)
    const counters1 = map.countersAt(new Coordinate(3, 2))
    expect(counters1.length).toBe(1)
    expect(counters1[0].unit.ghost).toBe(true)
    const counters2 = map.countersAt(new Coordinate(2, 2))
    expect(counters2.length).toBe(1)
    expect(counters2[0].unit.ghost).toBe(true)

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
    game.gameState.finish()
    Math.random = original

    expect(game.lastAction?.type).toBe("reaction_fire")
    expect(game.lastAction?.stringValue).toBe(
      "Soviet T-34 M40 at A3 fired at German Rifle at B3; targeting roll (d10x10): target 3, " +
      "rolled 1: miss, firing weapon broken")
    expect(game.moraleChecksNeeded).toStrictEqual([])

    expect(initiativeCheck(game)).toBe(false)
  })

  test("reaction fire mid move", () => {
    const game = createFireGame()
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

    game.gameState = new MoveState(game)
    game.moveState.move(3, 2)
    game.moveState.move(2, 2)
    game.moveState.move(1, 2)
    game.gameState.finish()

    expect(breakdownCheck(game)).toBe(false)
    expect(initiativeCheck(game)).toBe(true)
    expect(reactionFireCheck(game)).toBe(false)

    game.gameState = new InitiativeState(game)

    expect(initiativeCheck(game)).toBe(false)
    expect(reactionFireCheck(game)).toBe(false)

    const original = Math.random
    vi.spyOn(Math, "random").mockReturnValue(0.99)

    expect(game.currentPlayer).toBe(2)
    game.gameState.finish()
    expect(game.currentPlayer).toBe(2)

    Math.random = original

    expect(reactionFireCheck(game)).toBe(true)

    other.select()

    game.gameState = new FireState(game, true)
    const counters1 = map.countersAt(new Coordinate(3, 2))
    expect(counters1.length).toBe(1)
    expect(counters1[0].unit.ghost).toBe(true)
    const counters2 = map.countersAt(new Coordinate(2, 2))
    expect(counters2.length).toBe(1)
    expect(counters2[0].unit.ghost).toBe(true)

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
    game.gameState.finish()
    Math.random = original

    expect(game.lastAction?.type).toBe("reaction_fire")
    expect(game.lastAction?.stringValue).toBe(
      "Soviet T-34 M40 at A3 fired at German Rifle at C3; targeting roll (d10x10): target 6, " +
      "rolled 100: hit; roll for effect (2d10): target 12, rolled 20: hit")
    expect(game.moraleChecksNeeded).toStrictEqual([
      { unit: unit, from: [new Coordinate(0, 2)], to: new Coordinate(2, 2), incendiary: false },
    ])

    expect(initiativeCheck(game)).toBe(false)
  })

  test("multiple units moving", () => {
    const game = createFireGame()
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

    game.gameState = new MoveState(game)

    select(map, {
      counter: map.countersAt(new Coordinate(4, 2))[1],
      target: { type: "map", xy: new Coordinate(4, 2) }
    }, () => {})
    expect(unit2.selected).toBe(true)

    game.moveState.move(3, 2)
    game.moveState.move(2, 2)
    game.moveState.move(1, 2)
    game.gameState.finish()

    expect(breakdownCheck(game)).toBe(false)
    expect(initiativeCheck(game)).toBe(true)
    expect(reactionFireCheck(game)).toBe(false)

    game.gameState = new InitiativeState(game)

    expect(initiativeCheck(game)).toBe(false)
    expect(reactionFireCheck(game)).toBe(false)

    const original = Math.random
    vi.spyOn(Math, "random").mockReturnValue(0.99)

    expect(game.currentPlayer).toBe(2)
    game.gameState.finish()
    expect(game.currentPlayer).toBe(2)

    Math.random = original

    expect(reactionFireCheck(game)).toBe(true)

    other.select()

    game.gameState = new FireState(game, true)
    const counters1 = map.countersAt(new Coordinate(3, 2))
    expect(counters1.length).toBe(2)
    expect(counters1[0].unit.ghost).toBe(true)
    const counters2 = map.countersAt(new Coordinate(2, 2))
    expect(counters2.length).toBe(2)
    expect(counters2[0].unit.ghost).toBe(true)

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
    game.gameState.finish()
    Math.random = original

    expect(game.lastAction?.type).toBe("reaction_fire")
    expect(game.lastAction?.stringValue).toBe(
      "Soviet T-34 M40 at A3 fired at German Rifle, Rifle at C3; targeting roll (d10x10): target 6, " +
      "rolled 100: hit; roll for effect (2d10): target 12, rolled 20: hit")
    expect(game.moraleChecksNeeded).toStrictEqual([
      { unit: unit, from: [new Coordinate(0, 2)], to: new Coordinate(2, 2), incendiary: false },
      { unit: unit2, from: [new Coordinate(0, 2)], to: new Coordinate(2, 2), incendiary: false },
    ])

    expect(initiativeCheck(game)).toBe(false)
  })

  test("multiple units moving, plus extra targeting", () => {
    const game = createFireGame()
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

    game.gameState = new MoveState(game)

    select(map, {
      counter: map.countersAt(new Coordinate(4, 2))[1],
      target: { type: "map", xy: new Coordinate(4, 2) }
    }, () => {})
    expect(unit2.selected).toBe(true)

    game.moveState.move(3, 2)
    game.moveState.move(2, 2)
    game.moveState.move(1, 2)
    game.gameState.finish()

    expect(breakdownCheck(game)).toBe(false)
    expect(initiativeCheck(game)).toBe(true)
    expect(reactionFireCheck(game)).toBe(false)

    game.gameState = new InitiativeState(game)

    expect(initiativeCheck(game)).toBe(false)
    expect(reactionFireCheck(game)).toBe(false)

    const original = Math.random
    vi.spyOn(Math, "random").mockReturnValue(0.99)

    expect(game.currentPlayer).toBe(2)
    game.gameState.finish()
    expect(game.currentPlayer).toBe(2)

    Math.random = original

    expect(reactionFireCheck(game)).toBe(true)

    other.select()

    game.gameState = new FireState(game, true)
    const counters1 = map.countersAt(new Coordinate(3, 2))
    expect(counters1.length).toBe(2)
    expect(counters1[0].unit.ghost).toBe(true)
    const counters2 = map.countersAt(new Coordinate(2, 2))
    expect(counters2.length).toBe(3)
    expect(counters2[0].unit.ghost).toBe(undefined)
    expect(counters2[1].unit.ghost).toBe(true)

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
    game.gameState.finish()
    Math.random = original

    expect(game.lastAction?.type).toBe("reaction_fire")
    expect(game.lastAction?.stringValue).toBe(
      "Soviet T-34 M40 at A3 fired at German Rifle, Rifle, Rifle at C3; targeting roll (d10x10): target 6, " +
      "rolled 100: hit; roll for effect (2d10): target 12, rolled 20: hit")
    expect(game.moraleChecksNeeded).toStrictEqual([
      { unit: unit3, from: [new Coordinate(0, 2)], to: new Coordinate(2, 2), incendiary: false },
      { unit: unit, from: [new Coordinate(0, 2)], to: new Coordinate(2, 2), incendiary: false },
      { unit: unit2, from: [new Coordinate(0, 2)], to: new Coordinate(2, 2), incendiary: false },
    ])

    expect(initiativeCheck(game)).toBe(false)
  })

  test("ghosts for dropping are correct", () => {
    const game = createFireGame()
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

    game.gameState = new MoveState(game)

    game.moveState.move(3, 2)
    game.moveState.dropping = true

    select(map, {
      counter: map.countersAt(new Coordinate(4, 2))[1],
      target: { type: "map", xy: new Coordinate(4, 2) }
    }, () => {})
    expect(unit2.selected).toBe(false)
    expect(unit2.dropSelected).toBe(true)

    game.moveState.dropping = false
    game.moveState.move(2, 2)
    game.moveState.move(1, 2)
    game.gameState.finish()

    expect(breakdownCheck(game)).toBe(false)
    expect(initiativeCheck(game)).toBe(true)
    expect(reactionFireCheck(game)).toBe(false)

    game.gameState = new InitiativeState(game)

    expect(initiativeCheck(game)).toBe(false)
    expect(reactionFireCheck(game)).toBe(false)

    const original = Math.random
    vi.spyOn(Math, "random").mockReturnValue(0.99)

    expect(game.currentPlayer).toBe(2)
    game.gameState.finish()
    expect(game.currentPlayer).toBe(2)

    Math.random = original

    expect(reactionFireCheck(game)).toBe(true)

    other.select()

    game.gameState = new FireState(game, true)
    const counters1 = map.countersAt(new Coordinate(3, 2))
    expect(counters1.length).toBe(2)
    expect(counters1[0].unit.ghost).toBe(undefined)
    expect(counters1[0].unit.name).toBe("MG 08/15")
    expect(counters1[1].unit.ghost).toBe(true)
    expect(counters1[1].unit.name).toBe("Rifle")
    const counters2 = map.countersAt(new Coordinate(2, 2))
    expect(counters2.length).toBe(1)
    expect(counters2[0].unit.ghost).toBe(true)

    expect(reactionFireHexes(game)).toStrictEqual([
      { x: 3, y: 2, facing: undefined, turret: undefined },
      { x: 2, y: 2, facing: undefined, turret: undefined },
      { x: 1, y: 2, facing: undefined, turret: undefined },
    ])
  })

  test("ghosts for loading are correct", () => {
    const game = createFireGame()
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

    game.gameState = new MoveState(game)

    game.moveState.move(3, 2)
    game.moveState.loadToggle()

    select(map, {
      counter: map.countersAt(new Coordinate(3, 2))[0],
      target: { type: "map", xy: new Coordinate(3, 2) }
    }, () => {})
    expect(unit2.selected).toBe(false)
    expect(unit2.loadedSelected).toBe(true)

    game.moveState.loadToggle()
    game.moveState.move(2, 2)
    game.moveState.move(1, 2)
    game.gameState.finish()

    expect(breakdownCheck(game)).toBe(false)
    expect(initiativeCheck(game)).toBe(true)
    expect(reactionFireCheck(game)).toBe(false)

    game.gameState = new InitiativeState(game)

    expect(initiativeCheck(game)).toBe(false)
    expect(reactionFireCheck(game)).toBe(false)

    const original = Math.random
    vi.spyOn(Math, "random").mockReturnValue(0.99)

    expect(game.currentPlayer).toBe(2)
    game.gameState.finish()
    expect(game.currentPlayer).toBe(2)

    Math.random = original

    expect(reactionFireCheck(game)).toBe(true)

    other.select()

    game.gameState = new FireState(game, true)
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

    expect(reactionFireHexes(game)).toStrictEqual([
      { x: 3, y: 2, facing: undefined, turret: undefined },
      { x: 2, y: 2, facing: undefined, turret: undefined },
      { x: 1, y: 2, facing: undefined, turret: undefined },
    ])
  })

  test("hit, morale check shorts move for unit", () => {
    const game = createFireGame()
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

    game.gameState = new MoveState(game)
    game.moveState.move(3, 2)
    game.moveState.move(2, 2)
    game.moveState.move(1, 2)
    game.gameState.finish()

    game.gameState = new InitiativeState(game)

    const original = Math.random
    vi.spyOn(Math, "random").mockReturnValue(0.99)
    game.gameState.finish()
    Math.random = original

    expect(reactionFireCheck(game)).toBe(true)

    other.select()
    game.gameState = new FireState(game, true)
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
    game.gameState.finish()
    Math.random = original

    expect(game.lastAction?.type).toBe("reaction_fire")
    expect(game.lastAction?.stringValue).toBe(
      "Soviet T-34 M40 at A3 fired at German Rifle at C3; targeting roll (d10x10): target 6, " +
      "rolled 100: hit; roll for effect (2d10): target 12, rolled 20: hit")
    expect(game.moraleChecksNeeded).toStrictEqual([
      { unit: unit, from: [new Coordinate(0, 2)], to: new Coordinate(2, 2), incendiary: false },
    ])

    expect(initiativeCheck(game)).toBe(false)

    game.gameState = new MoraleCheckState(game)

    vi.spyOn(Math, "random").mockReturnValue(0.01)
    game.gameState.finish()
    Math.random = original

    expect(game.lastAction?.stringValue).toBe(
      "German morale check for Rifle (2d10): target 12, rolled 2, unit breaks, move short at C3")
    expect(game.moraleChecksNeeded).toStrictEqual([])
    const counter = game.findCounterById(unit.id)
    expect(counter?.hex?.x).toBe(2)
    expect(counter?.hex?.y).toBe(2)
  })

  test("ghost directions are correct, and vehicle is removed", () => {
    const game = createFireGame()
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

    game.gameState = new MoveState(game)
    expect(game.moveState.path.length).toBe(1)
    expect(game.moveState.path[0]).toStrictEqual({ x: 4, y: 2, facing: 1, turret: 2 })
    game.moveState.move(3, 2)
    expect(game.moveState.path.length).toBe(2)
    expect(game.moveState.path[1]).toStrictEqual({ x: 3, y: 2, facing: 1, turret: 2 })
    game.moveState.move(2, 2)
    expect(game.moveState.path.length).toBe(3)
    expect(game.moveState.path[2]).toStrictEqual({ x: 2, y: 2, facing: 1, turret: 2 })
    game.moveState.rotate(2)
    expect(game.moveState.path.length).toBe(4)
    expect(game.moveState.path[3]).toStrictEqual({ x: 2, y: 2, facing: 2, turret: 3 })
    game.moveState.move(1, 1)
    expect(game.moveState.path.length).toBe(5)
    expect(game.moveState.path[4]).toStrictEqual({ x: 1, y: 1, facing: 2, turret: 3 })
    game.gameState.finish()
    expect(unit.facing).toBe(2)
    expect(unit.turretFacing).toBe(3)

    game.gameState = new InitiativeState(game)

    const original = Math.random
    vi.spyOn(Math, "random").mockReturnValue(0.99)
    game.gameState.finish()
    Math.random = original

    expect(reactionFireCheck(game)).toBe(true)

    other.select()
    game.gameState = new FireState(game, true)
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
    game.gameState.finish()
    Math.random = original

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

  test("reaction fire triggers correct sniper", () => {
    const game = createFireGame()
    game.axisSniper = new Feature({
      t: featureType.Sniper, n: "Sniper", i: "sniper", f: 3, o: { q: 1 }, ft: 1
    })
    const map = game.scenario.map
    const unit = new Unit(testGInf)
    unit.id = "test1"
    unit.select()
    const uloc = new Coordinate(4, 2)
    map.addCounter(uloc, unit)

    const other = new Unit(testRInf)
    other.id = "target1"
    const oloc = new Coordinate(0, 2)
    map.addCounter(oloc, other)
    organizeStacks(map)

    game.gameState = new FireState(game, false)
    select(map, {
      counter: map.countersAt(oloc)[0],
      target: { type: "map", xy: oloc }
    }, () => {})
    expect(other.targetSelected).toBe(true)

    const original = Math.random
    vi.spyOn(Math, "random").mockReturnValue(0.01)
    game.gameState.finish()
    Math.random = original

    expect(game.sniperNeeded).toStrictEqual([])

    game.gameState = new InitiativeState(game)

    vi.spyOn(Math, "random").mockReturnValue(0.99)
    expect(game.currentPlayer).toBe(2)
    game.gameState.finish()
    expect(game.currentPlayer).toBe(2)

    Math.random = original

    other.select()

    game.gameState = new FireState(game, true)

    select(map, {
      counter: map.countersAt(uloc)[0],
      target: { type: "map", xy: uloc }
    }, () => {})
    expect(unit.targetSelected).toBe(true)

    vi.spyOn(Math, "random").mockReturnValue(0.01)
    game.gameState.finish()
    Math.random = original

    expect(game.sniperNeeded).toStrictEqual([
      { unit: other, loc: oloc },
    ])
  })

  test("reaction fire doesn't trigger other sniper", () => {
    const game = createFireGame()
    game.alliedSniper = new Feature({
      t: featureType.Sniper, n: "Sniper", i: "sniper", f: 3, o: { q: 1 }, ft: 1
    })
    const map = game.scenario.map
    const unit = new Unit(testGInf)
    unit.id = "test1"
    unit.select()
    const uloc = new Coordinate(4, 2)
    map.addCounter(uloc, unit)

    const other = new Unit(testRInf)
    other.id = "target1"
    const oloc = new Coordinate(0, 2)
    map.addCounter(oloc, other)
    organizeStacks(map)

    game.gameState = new FireState(game, false)
    select(map, {
      counter: map.countersAt(oloc)[0],
      target: { type: "map", xy: oloc }
    }, () => {})
    expect(other.targetSelected).toBe(true)

    const original = Math.random
    vi.spyOn(Math, "random").mockReturnValue(0.01)
    game.gameState.finish()
    Math.random = original

    game.sniperNeeded = []

    game.gameState = new InitiativeState(game)

    vi.spyOn(Math, "random").mockReturnValue(0.99)
    expect(game.currentPlayer).toBe(2)
    game.gameState.finish()
    expect(game.currentPlayer).toBe(2)

    Math.random = original

    other.select()

    game.gameState = new FireState(game, true)

    select(map, {
      counter: map.countersAt(uloc)[0],
      target: { type: "map", xy: uloc }
    }, () => {})
    expect(unit.targetSelected).toBe(true)

    vi.spyOn(Math, "random").mockReturnValue(0.01)
    game.gameState.finish()
    Math.random = original

    expect(game.sniperNeeded).toStrictEqual([])
  })

  test("defer smoke", () => {
    // Maybe?
  })
});
