import { Coordinate, featureType, hexOpenType } from "../../utilities/commonTypes"
import Unit from "../Unit"
import { describe, expect, test, vi } from "vitest"
import IllegalActionError from "../actions/IllegalActionError"
import Feature from "../Feature"
import { createMoveGame, testGInf, testGTank } from "./testHelpers"
import InitiativeState, { initiativeCheck } from "./state/InitiativeState"
import PassState from "./state/PassState"
import { stateType } from "./state/BaseState"
import { reactionFireCheck } from "./state/ReactionState"
import MoveState from "./state/MoveState"
import AssaultState from "./state/AssaultState"
import SniperState from "./state/SniperState"
import BreakdownState, { breakdownCheck } from "./state/BreakdownState"
import { gamePhaseType } from "../support/gamePhase"

describe("game action tests", () => {
  test("initiative changes", () => {
    const game = createMoveGame()
    const map = game.scenario.map
    const unit = new Unit(testGInf)
    unit.id = "test1"
    unit.baseMovement = 3
    unit.select()
    map.addCounter(new Coordinate(4, 2), unit)

    game.gameState = new MoveState(game)
    game.moveState.move(3, 2)
    game.moveState.move(2, 2)
    game.moveState.move(1, 2)
    game.gameState.finish()

    expect(game.initiative).toBe(-2)

    game.executeUndo()

    expect(game.initiative).toBe(0)
  })

  test("initiative changes player", () => {
    const game = createMoveGame()
    const map = game.scenario.map
    const unit = new Unit(testGInf)
    unit.id = "test1"
    unit.baseMovement = 3
    unit.select()
    map.addCounter(new Coordinate(4, 2), unit)

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
    vi.spyOn(Math, "random").mockReturnValue(0.01)

    expect(game.currentPlayer).toBe(2)
    game.gameState.finish()
    expect(game.currentPlayer).toBe(1)

    Math.random = original

    expect(reactionFireCheck(game)).toBe(false)

    try {
      game.executeUndo()
    } catch(err) {
      // Can't roll back a breakdown roll
      expect(err instanceof IllegalActionError).toBe(true)
    }
  })

  test("initiative doesn't change player", () => {
    const game = createMoveGame()
    const map = game.scenario.map
    const unit = new Unit(testGInf)
    unit.id = "test1"
    unit.baseMovement = 3
    unit.select()
    map.addCounter(new Coordinate(4, 2), unit)

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

    try {
      game.executeUndo()
    } catch(err) {
      // Can't roll back a breakdown roll
      expect(err instanceof IllegalActionError).toBe(true)
    }
  })
  
  test("after breakdown", () => {
    const game = createMoveGame()
    const map = game.scenario.map
    const unit = new Unit(testGTank)
    unit.id = "test1"
    unit.facing = 1
    unit.turretFacing = 1
    unit.breakdownRoll = 3
    unit.select()
    map.addCounter(new Coordinate(4, 2), unit)

    game.gameState = new MoveState(game)

    game.moveState.move(3, 2)
    game.moveState.rotate(2)
    game.moveState.move(2, 1)
    game.moveState.rotatingTurret = true
    game.moveState.rotate(6)
    game.moveState.rotatingTurret = false
    game.moveState.rotate(1)
    game.moveState.move(1, 1)
    game.gameState.finish()

    expect(breakdownCheck(game)).toBe(true)
    expect(reactionFireCheck(game)).toBe(false)

    game.gameState = new BreakdownState(game)

    expect(initiativeCheck(game)).toBe(false)
    expect(reactionFireCheck(game)).toBe(false)

    game.gameState.finish()

    expect(breakdownCheck(game)).toBe(false)
    expect(initiativeCheck(game)).toBe(true)
    expect(reactionFireCheck(game)).toBe(false)
  })
  
  test("breakdown movement", () => {
    const game = createMoveGame()
    const map = game.scenario.map
    const unit = new Unit(testGTank)
    unit.id = "test1"
    unit.facing = 1
    unit.turretFacing = 1
    unit.breakdownRoll = 3
    unit.select()
    map.addCounter(new Coordinate(4, 2), unit)

    game.gameState = new MoveState(game)

    expect(game.gameState.rotateOpen).toBe(true)
    expect(game.gameState.rotatePossible).toBe(true)
    expect(game.gameState.openHex(0, 0)).toBe(hexOpenType.Closed)
    expect(game.gameState.openHex(3, 2)).toBe(1)
    expect(game.gameState.openHex(4, 3)).toBe(hexOpenType.Closed)

    game.moveState.move(3, 2)
    game.moveState.rotate(2)
    game.moveState.move(2, 1)
    game.moveState.rotatingTurret = true
    game.moveState.rotate(6)
    game.moveState.rotatingTurret = false
    game.moveState.rotate(1)

    game.moveState.move(1, 1)
    expect(game.gameState.rotateOpen).toBe(true)
    expect(game.gameState.rotatePossible).toBe(false)
    expect(game.gameState.openHex(0, 1)).toBe(hexOpenType.Closed)
    expect(game.gameState.openHex(2, 1)).toBe(hexOpenType.Closed)
    expect(game.gameState.openHex(2, 2)).toBe(hexOpenType.Closed)

    game.gameState.finish()

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
    expect(reactionFireCheck(game)).toBe(false)

    expect(breakdownCheck(game)).toBe(true)

    const original = Math.random
    vi.spyOn(Math, "random").mockReturnValue(0.01)

    game.gameState = new BreakdownState(game)
    expect(reactionFireCheck(game)).toBe(false)
    expect(game.gameState.type).toBe(stateType.Breakdown)
    game.gameState.finish()
    expect(reactionFireCheck(game)).toBe(false)

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
    const game = createMoveGame()
    const map = game.scenario.map
    const unit = new Unit(testGTank)
    unit.id = "test1"
    unit.facing = 1
    unit.turretFacing = 1
    unit.breakdownRoll = 3
    unit.select()
    map.addCounter(new Coordinate(4, 2), unit)

    game.gameState = new AssaultState(game)

    expect(game.gameState.rotateOpen).toBe(false)
    expect(game.gameState.rotatePossible).toBe(false)
    expect(game.gameState.openHex(3, 2)).toBe(hexOpenType.All)
    expect(game.gameState.openHex(4, 3)).toBe(hexOpenType.All)
    expect(game.gameState.openHex(3, 3)).toBe(hexOpenType.Closed)

    game.assaultState.move(3, 2)
    expect(game.gameState.rotateOpen).toBe(true)
    expect(game.gameState.rotatePossible).toBe(true)
    expect(game.gameState.openHex(0, 1)).toBe(hexOpenType.Closed)
    expect(game.gameState.openHex(2, 1)).toBe(hexOpenType.Closed)
    expect(game.gameState.openHex(2, 2)).toBe(hexOpenType.Closed)

    game.gameState.finish()

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

    expect(breakdownCheck(game)).toBe(true)

    const original = Math.random
    vi.spyOn(Math, "random").mockReturnValue(0.01)

    game.gameState = new BreakdownState(game)
    expect(game.gameState.type).toBe(stateType.Breakdown)
    game.gameState.finish()

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
    const game = createMoveGame()
    expect(game.initiative).toBe(0)
    expect(game.currentPlayer).toBe(2)
    expect(game.phase).toBe(gamePhaseType.Main)

    game.gameState = new PassState(game)
    expect(game.gameState.type).toBe(stateType.Pass)
    expect(game.initiative).toBe(0)
    expect(game.currentPlayer).toBe(2)
    expect(game.phase).toBe(gamePhaseType.Main)
    expect(reactionFireCheck(game)).toBe(false)

    game.gameState.finish()
    expect(game.gameState).toBe(undefined)
    expect(game.initiative).toBe(1)
    expect(game.currentPlayer).toBe(1)
    expect(game.phase).toBe(gamePhaseType.Main)
    expect(reactionFireCheck(game)).toBe(false)

    game.gameState = new PassState(game)
    expect(game.gameState.type).toBe(stateType.Pass)
    expect(game.initiative).toBe(1)
    expect(game.currentPlayer).toBe(1)
    expect(game.phase).toBe(gamePhaseType.Main)
    expect(reactionFireCheck(game)).toBe(false)

    game.gameState.finish()
    expect(game.gameState).toBe(undefined)
    expect(game.initiative).toBe(0)
    expect(game.currentPlayer).toBe(2)
    expect(game.phase).toBe(gamePhaseType.CleanupCloseCombat)
    expect(reactionFireCheck(game)).toBe(false)
  })

  test("sniper", () => {
    const game = createMoveGame()
    game.alliedSniper = new Feature({
      t: featureType.Sniper, n: "Sniper", i: "sniper", f: 3, o: { q: 1 }, ft: 1
    })
    const map = game.scenario.map
    const firing = new Unit(testGInf)
    firing.id = "firing1"
    firing.select()
    const floc = new Coordinate(3, 2)
    map.addCounter(floc, firing)

    game.sniperNeeded = [{unit: firing, loc: floc }]

    game.gameState = new SniperState(game)

    const original = Math.random
    vi.spyOn(Math, "random").mockReturnValue(0.99)
    game.gameState.finish()
    Math.random = original

    expect(game.lastAction?.type).toBe("sniper")
    expect(game.lastAction?.stringValue).toBe("Soviet sniper check (2d10): target 1, rolled 20, no effect")
  })
});
