import { Coordinate, featureType, hexOpenType } from "../../utilities/commonTypes"
import Unit from "../Unit"
import { gamePhaseType } from "../Game"
import { describe, expect, test, vi } from "vitest"
import IllegalActionError from "../actions/IllegalActionError"
import { openHexRotateOpen, openHexRotatePossible } from "./openHex"
import { openHexMovement } from "./movement"
import { openHexAssaulting } from "./assault"
import { actionType, GameActionState, MoveActionState } from "./gameActions"
import Feature from "../Feature"
import { createMoveGame, testGInf, testGTank } from "./testHelpers"

describe("game action tests", () => {
  test("initiative changes", () => {
    const game = createMoveGame()
    const map = game.scenario.map
    const unit = new Unit(testGInf)
    unit.id = "test1"
    unit.baseMovement = 3
    unit.select()
    map.addCounter(new Coordinate(4, 2), unit)

    game.startMove()
    game.move(3, 2)
    game.move(2, 2)
    game.move(1, 2)
    game.finishMove()

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

    game.startMove()
    game.move(3, 2)
    game.move(2, 2)
    game.move(1, 2)
    game.finishMove()

    expect(game.breakdownCheck).toBe(false)
    expect(game.initiativeCheck).toBe(true)
    expect(game.reactionFireCheck).toBe(false)

    game.startInitiative()

    expect(game.initiativeCheck).toBe(false)
    expect(game.reactionFireCheck).toBe(false)

    const original = Math.random
    vi.spyOn(Math, "random").mockReturnValue(0.01)

    expect(game.currentPlayer).toBe(2)
    game.finishInitiative()
    expect(game.currentPlayer).toBe(1)

    Math.random = original

    expect(game.reactionFireCheck).toBe(false)

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

    game.startMove()
    game.move(3, 2)
    game.move(2, 2)
    game.move(1, 2)
    game.finishMove()

    expect(game.breakdownCheck).toBe(false)
    expect(game.initiativeCheck).toBe(true)
    expect(game.reactionFireCheck).toBe(false)

    game.startInitiative()

    expect(game.initiativeCheck).toBe(false)
    expect(game.reactionFireCheck).toBe(false)

    const original = Math.random
    vi.spyOn(Math, "random").mockReturnValue(0.99)

    expect(game.currentPlayer).toBe(2)
    game.finishInitiative()
    expect(game.currentPlayer).toBe(2)

    Math.random = original

    expect(game.reactionFireCheck).toBe(true)

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

    game.startMove()

    const state = game.gameActionState as GameActionState
    const move = state.move as MoveActionState

    game.move(3, 2)
    game.moveRotate(3, 2, 2)
    game.move(2, 1)
    move.rotatingTurret = true
    game.moveRotate(2, 1, 6)
    move.rotatingTurret = false
    game.moveRotate(2, 1, 1)
    game.move(1, 1)
    game.finishMove()

    expect(game.breakdownCheck).toBe(true)
    expect(game.reactionFireCheck).toBe(false)

    game.startBreakdown()

    expect(game.initiativeCheck).toBe(false)
    expect(game.reactionFireCheck).toBe(false)

    game.finishBreakdown()

    expect(game.breakdownCheck).toBe(false)
    expect(game.initiativeCheck).toBe(true)
    expect(game.reactionFireCheck).toBe(false)
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

    game.startMove()

    const state = game.gameActionState as GameActionState
    const move = state.move as MoveActionState

    expect(openHexRotateOpen(map)).toBe(true)
    expect(openHexRotatePossible(map)).toBe(true)
    expect(openHexMovement(map, new Coordinate(4, 2), new Coordinate(0, 0))).toBe(hexOpenType.Closed)
    expect(openHexMovement(map, new Coordinate(4, 2), new Coordinate(3, 2))).toBe(1)
    expect(openHexMovement(map, new Coordinate(4, 2), new Coordinate(4, 3))).toBe(hexOpenType.Closed)

    game.move(3, 2)
    game.moveRotate(3, 2, 2)
    game.move(2, 1)
    move.rotatingTurret = true
    game.moveRotate(2, 1, 6)
    move.rotatingTurret = false
    game.moveRotate(2, 1, 1)

    game.move(1, 1)
    expect(openHexRotateOpen(map)).toBe(true)
    expect(openHexRotatePossible(map)).toBe(false)
    expect(openHexMovement(map, new Coordinate(1, 1), new Coordinate(0, 1))).toBe(hexOpenType.Closed)
    expect(openHexMovement(map, new Coordinate(1, 1), new Coordinate(2, 1))).toBe(hexOpenType.Closed)
    expect(openHexMovement(map, new Coordinate(1, 1), new Coordinate(2, 2))).toBe(hexOpenType.Closed)

    game.finishMove()

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
    expect(game.reactionFireCheck).toBe(false)

    expect(game.breakdownCheck).toBe(true)

    const original = Math.random
    vi.spyOn(Math, "random").mockReturnValue(0.01)

    game.startBreakdown()
    expect(game.reactionFireCheck).toBe(false)
    expect(game.gameActionState?.currentAction).toBe(actionType.Breakdown)
    game.finishBreakdown()
    expect(game.reactionFireCheck).toBe(false)

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

    game.startAssault()

    expect(openHexRotateOpen(map)).toBe(false)
    expect(openHexRotatePossible(map)).toBe(false)
    expect(openHexAssaulting(map, new Coordinate(4, 2), new Coordinate(3, 2))).toBe(hexOpenType.All)
    expect(openHexAssaulting(map, new Coordinate(4, 2), new Coordinate(4, 3))).toBe(hexOpenType.All)
    expect(openHexAssaulting(map, new Coordinate(4, 2), new Coordinate(3, 3))).toBe(hexOpenType.Closed)

    game.assault(3, 2)
    expect(openHexRotateOpen(map)).toBe(true)
    expect(openHexRotatePossible(map)).toBe(true)
    expect(openHexMovement(map, new Coordinate(1, 1), new Coordinate(0, 1))).toBe(hexOpenType.Closed)
    expect(openHexMovement(map, new Coordinate(1, 1), new Coordinate(2, 1))).toBe(hexOpenType.Closed)
    expect(openHexMovement(map, new Coordinate(1, 1), new Coordinate(2, 2))).toBe(hexOpenType.Closed)

    game.finishAssault()

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

    expect(game.breakdownCheck).toBe(true)

    const original = Math.random
    vi.spyOn(Math, "random").mockReturnValue(0.01)

    game.startBreakdown()
    expect(game.gameActionState?.currentAction).toBe(actionType.Breakdown)
    game.finishBreakdown()

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

    game.startPass()
    expect(game.gameActionState?.currentAction).toBe(actionType.Pass)
    expect(game.initiative).toBe(0)
    expect(game.currentPlayer).toBe(2)
    expect(game.phase).toBe(gamePhaseType.Main)
    expect(game.reactionFireCheck).toBe(false)

    game.finishPass()
    expect(game.gameActionState).toBe(undefined)
    expect(game.initiative).toBe(1)
    expect(game.currentPlayer).toBe(1)
    expect(game.phase).toBe(gamePhaseType.Main)
    expect(game.reactionFireCheck).toBe(false)

    game.startPass()
    expect(game.gameActionState?.currentAction).toBe(actionType.Pass)
    expect(game.initiative).toBe(1)
    expect(game.currentPlayer).toBe(1)
    expect(game.phase).toBe(gamePhaseType.Main)
    expect(game.reactionFireCheck).toBe(false)

    game.finishPass()
    expect(game.gameActionState).toBe(undefined)
    expect(game.initiative).toBe(0)
    expect(game.currentPlayer).toBe(2)
    expect(game.phase).toBe(gamePhaseType.Cleanup)
    expect(game.reactionFireCheck).toBe(false)
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

    game.startSniper()

    const original = Math.random
    vi.spyOn(Math, "random").mockReturnValue(0.99)
    game.finishSniper()
    Math.random = original

    // expect(game.moraleChecksNeeded).toStrictEqual([
    //   { unit: firing, from: [floc], to: floc, incendiary: false },
    // ])
    expect(game.lastAction?.type).toBe("sniper")
    expect(game.lastAction?.stringValue).toBe("Soviet sniper check (2d10): target 1, rolled 20, no effect")
  })
});
