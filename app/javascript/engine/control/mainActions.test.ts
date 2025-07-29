import { Coordinate, featureType, hexOpenType } from "../../utilities/commonTypes"
import Unit from "../Unit"
import { gamePhaseType } from "../Game"
import { describe, expect, test, vi } from "vitest"
import IllegalActionError from "../actions/IllegalActionError"
import { openHexRotateOpen, openHexRotatePossible } from "./openHex"
import { openHexMovement } from "./movement"
import { openHexAssaulting } from "./assault"
import Feature from "../Feature"
import { createMoveGame, testGInf, testGTank } from "./testHelpers"
import { doAssault, doMove, finishAssault, finishBreakdown, finishInitiative, finishMove, finishPass, finishSniper, moveRotate, startAssault, startBreakdown, startInitiative, startMove, startPass, startSniper } from "./mainActions"
import { breakdownCheck, initiativeCheck, reactionFireCheck } from "./checks"
import { actionType, GameActionState, MoveActionState } from "./actionState"

describe("game action tests", () => {
  test("initiative changes", () => {
    const game = createMoveGame()
    const map = game.scenario.map
    const unit = new Unit(testGInf)
    unit.id = "test1"
    unit.baseMovement = 3
    unit.select()
    map.addCounter(new Coordinate(4, 2), unit)

    startMove(game)
    doMove(game, 3, 2)
    doMove(game, 2, 2)
    doMove(game, 1, 2)
    finishMove(game)

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

    startMove(game)
    doMove(game, 3, 2)
    doMove(game, 2, 2)
    doMove(game, 1, 2)
    finishMove(game)

    expect(breakdownCheck(game)).toBe(false)
    expect(initiativeCheck(game)).toBe(true)
    expect(reactionFireCheck(game)).toBe(false)

    startInitiative(game)

    expect(initiativeCheck(game)).toBe(false)
    expect(reactionFireCheck(game)).toBe(false)

    const original = Math.random
    vi.spyOn(Math, "random").mockReturnValue(0.01)

    expect(game.currentPlayer).toBe(2)
    finishInitiative(game)
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

    startMove(game)
    doMove(game, 3, 2)
    doMove(game, 2, 2)
    doMove(game, 1, 2)
    finishMove(game)

    expect(breakdownCheck(game)).toBe(false)
    expect(initiativeCheck(game)).toBe(true)
    expect(reactionFireCheck(game)).toBe(false)

    startInitiative(game)

    expect(initiativeCheck(game)).toBe(false)
    expect(reactionFireCheck(game)).toBe(false)

    const original = Math.random
    vi.spyOn(Math, "random").mockReturnValue(0.99)

    expect(game.currentPlayer).toBe(2)
    finishInitiative(game)
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

    startMove(game)

    const state = game.gameState as GameActionState
    const move = state.move as MoveActionState

    doMove(game, 3, 2)
    moveRotate(game, 3, 2, 2)
    doMove(game, 2, 1)
    move.rotatingTurret = true
    moveRotate(game, 2, 1, 6)
    move.rotatingTurret = false
    moveRotate(game, 2, 1, 1)
    doMove(game, 1, 1)
    finishMove(game)

    expect(breakdownCheck(game)).toBe(true)
    expect(reactionFireCheck(game)).toBe(false)

    startBreakdown(game)

    expect(initiativeCheck(game)).toBe(false)
    expect(reactionFireCheck(game)).toBe(false)

    finishBreakdown(game)

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

    startMove(game)

    const state = game.gameState as GameActionState
    const move = state.move as MoveActionState

    expect(openHexRotateOpen(map)).toBe(true)
    expect(openHexRotatePossible(map)).toBe(true)
    expect(openHexMovement(map, new Coordinate(4, 2), new Coordinate(0, 0))).toBe(hexOpenType.Closed)
    expect(openHexMovement(map, new Coordinate(4, 2), new Coordinate(3, 2))).toBe(1)
    expect(openHexMovement(map, new Coordinate(4, 2), new Coordinate(4, 3))).toBe(hexOpenType.Closed)

    doMove(game, 3, 2)
    moveRotate(game, 3, 2, 2)
    doMove(game, 2, 1)
    move.rotatingTurret = true
    moveRotate(game, 2, 1, 6)
    move.rotatingTurret = false
    moveRotate(game, 2, 1, 1)

    doMove(game, 1, 1)
    expect(openHexRotateOpen(map)).toBe(true)
    expect(openHexRotatePossible(map)).toBe(false)
    expect(openHexMovement(map, new Coordinate(1, 1), new Coordinate(0, 1))).toBe(hexOpenType.Closed)
    expect(openHexMovement(map, new Coordinate(1, 1), new Coordinate(2, 1))).toBe(hexOpenType.Closed)
    expect(openHexMovement(map, new Coordinate(1, 1), new Coordinate(2, 2))).toBe(hexOpenType.Closed)

    finishMove(game)

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

    startBreakdown(game)
    expect(reactionFireCheck(game)).toBe(false)
    expect(game.gameState?.currentAction).toBe(actionType.Breakdown)
    finishBreakdown(game)
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

    startAssault(game)

    expect(openHexRotateOpen(map)).toBe(false)
    expect(openHexRotatePossible(map)).toBe(false)
    expect(openHexAssaulting(map, new Coordinate(4, 2), new Coordinate(3, 2))).toBe(hexOpenType.All)
    expect(openHexAssaulting(map, new Coordinate(4, 2), new Coordinate(4, 3))).toBe(hexOpenType.All)
    expect(openHexAssaulting(map, new Coordinate(4, 2), new Coordinate(3, 3))).toBe(hexOpenType.Closed)

    doAssault(game, 3, 2)
    expect(openHexRotateOpen(map)).toBe(true)
    expect(openHexRotatePossible(map)).toBe(true)
    expect(openHexMovement(map, new Coordinate(1, 1), new Coordinate(0, 1))).toBe(hexOpenType.Closed)
    expect(openHexMovement(map, new Coordinate(1, 1), new Coordinate(2, 1))).toBe(hexOpenType.Closed)
    expect(openHexMovement(map, new Coordinate(1, 1), new Coordinate(2, 2))).toBe(hexOpenType.Closed)

    finishAssault(game)

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

    startBreakdown(game)
    expect(game.gameState?.currentAction).toBe(actionType.Breakdown)
    finishBreakdown(game)

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

    startPass(game)
    expect(game.gameState?.currentAction).toBe(actionType.Pass)
    expect(game.initiative).toBe(0)
    expect(game.currentPlayer).toBe(2)
    expect(game.phase).toBe(gamePhaseType.Main)
    expect(reactionFireCheck(game)).toBe(false)

    finishPass(game)
    expect(game.gameState).toBe(undefined)
    expect(game.initiative).toBe(1)
    expect(game.currentPlayer).toBe(1)
    expect(game.phase).toBe(gamePhaseType.Main)
    expect(reactionFireCheck(game)).toBe(false)

    startPass(game)
    expect(game.gameState?.currentAction).toBe(actionType.Pass)
    expect(game.initiative).toBe(1)
    expect(game.currentPlayer).toBe(1)
    expect(game.phase).toBe(gamePhaseType.Main)
    expect(reactionFireCheck(game)).toBe(false)

    finishPass(game)
    expect(game.gameState).toBe(undefined)
    expect(game.initiative).toBe(0)
    expect(game.currentPlayer).toBe(2)
    expect(game.phase).toBe(gamePhaseType.Cleanup)
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

    startSniper(game)

    const original = Math.random
    vi.spyOn(Math, "random").mockReturnValue(0.99)
    finishSniper(game)
    Math.random = original

    expect(game.lastAction?.type).toBe("sniper")
    expect(game.lastAction?.stringValue).toBe("Soviet sniper check (2d10): target 1, rolled 20, no effect")
  })
});
