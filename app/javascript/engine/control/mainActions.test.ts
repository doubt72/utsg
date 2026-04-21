import { Coordinate, featureType, hexOpenType } from "../../utilities/commonTypes"
import Unit from "../Unit"
import { describe, expect, test, vi } from "vitest"
import IllegalActionError from "../actions/IllegalActionError"
import Feature from "../Feature"
import { createBlankGame, createMoveGame, testGInf, testGTank, testRInf } from "./testHelpers"
import InitiativeState, { initiativeCheck } from "./state/InitiativeState"
import PassState from "./state/PassState"
import { stateType } from "./state/BaseState"
import MoveState from "./state/MoveState"
import AssaultState from "./state/AssaultState"
import SniperState from "./state/SniperState"
import BreakdownState, { breakdownCheck } from "./state/BreakdownState"
import { gamePhaseType } from "../support/gamePhase"
import { reactionFireCheck } from "./reactionFire"

describe("game actions", () => {
  test("initiative changes", () => {
    const game = createMoveGame()
    const map = game.scenario.map
    const unit = new Unit(testGInf)
    unit.id = "test1"
    unit.baseMovement = 3
    map.addCounter(new Coordinate(4, 2), unit)
    map.select(unit)

    game.setGameState(new MoveState(game))
    game.moveState.move(3, 2)
    game.moveState.move(2, 2)
    game.moveState.move(1, 2)
    game.gameState?.finish()

    expect(game.initiative).toBe(-2)

    game.executeUndo(false)

    expect(game.initiative).toBe(0)
  })

  test("initiative changes player", () => {
    const game = createMoveGame()
    const map = game.scenario.map
    const unit = new Unit(testGInf)
    unit.id = "test1"
    unit.baseMovement = 3
    map.addCounter(new Coordinate(4, 2), unit)
    map.select(unit)

    const enemy = new Unit(testRInf)
    enemy.id = "test2"
    map.addCounter(new Coordinate(3, 1), enemy)

    game.setGameState(new MoveState(game))
    game.moveState.move(3, 2)
    game.moveState.move(2, 2)
    game.moveState.move(1, 2)
    game.gameState?.finish()

    expect(breakdownCheck(game)).toBe(false)
    expect(initiativeCheck(game)).toBe(true)
    expect(reactionFireCheck(game)).toBe(false)

    game.setGameState(new InitiativeState(game))

    expect(initiativeCheck(game)).toBe(false)
    expect(reactionFireCheck(game)).toBe(false)

    const original = Math.random
    vi.spyOn(Math, "random").mockReturnValue(0.01)

    expect(game.currentInitiativePlayer).toBe(2)
    expect(game.currentPlayer).toBe(2)
    game.gameState?.finish()
    expect(game.currentInitiativePlayer).toBe(1)
    expect(game.currentPlayer).toBe(1)

    Math.random = original

    expect(reactionFireCheck(game)).toBe(true)

    try {
      game.executeUndo(false)
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
    map.addCounter(new Coordinate(4, 2), unit)
    map.select(unit)

    const enemy = new Unit(testRInf)
    enemy.id = "test2"
    map.addCounter(new Coordinate(3, 1), enemy)

    game.setGameState(new MoveState(game))
    game.moveState.move(3, 2)
    game.moveState.move(2, 2)
    game.moveState.move(1, 2)
    game.gameState?.finish()

    expect(breakdownCheck(game)).toBe(false)
    expect(initiativeCheck(game)).toBe(true)
    expect(reactionFireCheck(game)).toBe(false)

    game.setGameState(new InitiativeState(game))

    expect(initiativeCheck(game)).toBe(false)
    expect(reactionFireCheck(game)).toBe(false)

    const original = Math.random
    vi.spyOn(Math, "random").mockReturnValue(0.99)

    expect(game.currentPlayer).toBe(2)
    expect(game.currentInitiativePlayer).toBe(2)
    game.gameState?.finish()
    expect(game.currentPlayer).toBe(1)
    expect(game.currentInitiativePlayer).toBe(2)

    Math.random = original

    expect(reactionFireCheck(game)).toBe(true)
    expect(game.currentPlayer).toBe(1)
    expect(game.currentInitiativePlayer).toBe(2)

    try {
      game.executeUndo(false)
    } catch(err) {
      // Can't roll back a breakdown roll
      expect(err instanceof IllegalActionError).toBe(true)
    }
  })

  test("no reaction unless los", () => {
    const game = createMoveGame()
    const map = game.scenario.map
    const unit = new Unit(testGInf)
    unit.id = "test1"
    unit.baseMovement = 3
    map.addCounter(new Coordinate(0, 3), unit)
    map.select(unit)

    const unit2 = new Unit(testRInf)
    unit2.id = "test2"
    map.addCounter(new Coordinate(4, 3), unit2)

    game.setGameState(new MoveState(game))
    game.moveState.move(1, 3)
    game.moveState.move(2, 3)
    game.gameState?.finish()

    expect(breakdownCheck(game)).toBe(false)
    expect(initiativeCheck(game)).toBe(true)
    expect(reactionFireCheck(game)).toBe(false)

    game.setGameState(new InitiativeState(game))

    expect(initiativeCheck(game)).toBe(false)
    expect(reactionFireCheck(game)).toBe(false)

    const original = Math.random
    vi.spyOn(Math, "random").mockReturnValue(0.01)

    expect(game.currentPlayer).toBe(2)
    expect(game.currentInitiativePlayer).toBe(2)
    game.gameState?.finish()
    expect(reactionFireCheck(game)).toBe(false)
    expect(game.currentPlayer).toBe(1)
    expect(game.currentInitiativePlayer).toBe(1)

    Math.random = original


    const action = game.lastAction
    expect(action?.type).toBe("reaction_pass")
    expect(action?.stringValue).toBe("no valid units have range and line-of-sight, skipping reaction fire")
    expect(game.currentPlayer).toBe(1)

    try {
      game.executeUndo(false)
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
    map.addCounter(new Coordinate(4, 2), unit)
    map.select(unit)

    game.setGameState(new MoveState(game))

    game.moveState.move(3, 2)
    game.moveState.rotate(2)
    game.moveState.move(2, 1)
    game.moveState.rotatingTurret = true
    game.moveState.rotate(6)
    game.moveState.rotatingTurret = false
    game.moveState.rotate(1)
    game.moveState.move(1, 1)
    game.gameState?.finish()

    expect(breakdownCheck(game)).toBe(true)
    expect(reactionFireCheck(game)).toBe(false)

    game.setGameState(new BreakdownState(game))

    expect(initiativeCheck(game)).toBe(false)
    expect(reactionFireCheck(game)).toBe(false)

    game.gameState?.finish()

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
    map.addCounter(new Coordinate(4, 2), unit)
    map.select(unit)

    game.setGameState(new MoveState(game))

    expect(game.gameState?.rotateOpen).toBe(true)
    expect(game.gameState?.rotatePossible).toBe(true)
    expect(game.gameState?.openHex(0, 0)).toBe(hexOpenType.Closed)
    expect(game.gameState?.openHex(3, 2)).toBe(1)
    expect(game.gameState?.openHex(4, 3)).toBe(hexOpenType.Closed)

    game.moveState.move(3, 2)
    game.moveState.rotate(2)
    game.moveState.move(2, 1)
    game.moveState.rotatingTurret = true
    game.moveState.rotate(6)
    game.moveState.rotatingTurret = false
    game.moveState.rotate(1)

    game.moveState.move(1, 1)
    expect(game.gameState?.rotateOpen).toBe(true)
    expect(game.gameState?.rotatePossible).toBe(false)
    expect(game.gameState?.openHex(0, 1)).toBe(hexOpenType.Closed)
    expect(game.gameState?.openHex(2, 1)).toBe(hexOpenType.Closed)
    expect(game.gameState?.openHex(2, 2)).toBe(hexOpenType.Closed)

    game.gameState?.finish()

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

    game.setGameState(new BreakdownState(game))
    expect(reactionFireCheck(game)).toBe(false)
    expect(game.gameState?.type).toBe(stateType.Breakdown)
    game.gameState?.finish()
    expect(reactionFireCheck(game)).toBe(false)

    Math.random = original

    expect(all[1].unit.immobilized).toBe(true)

    try {
      game.executeUndo(false)
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
    map.addCounter(new Coordinate(4, 2), unit)
    map.select(unit)

    game.setGameState(new AssaultState(game))

    expect(game.gameState?.rotateOpen).toBe(false)
    expect(game.gameState?.rotatePossible).toBe(false)
    expect(game.gameState?.openHex(3, 2)).toBe(hexOpenType.All)
    expect(game.gameState?.openHex(4, 3)).toBe(hexOpenType.All)
    expect(game.gameState?.openHex(3, 3)).toBe(hexOpenType.Closed)

    game.assaultState.move(3, 2)
    expect(game.gameState?.rotateOpen).toBe(true)
    expect(game.gameState?.rotatePossible).toBe(true)
    expect(game.gameState?.openHex(0, 1)).toBe(hexOpenType.Closed)
    expect(game.gameState?.openHex(2, 1)).toBe(hexOpenType.Closed)
    expect(game.gameState?.openHex(2, 2)).toBe(hexOpenType.Closed)

    game.gameState?.finish()

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

    game.setGameState(new BreakdownState(game))
    expect(game.gameState?.type).toBe(stateType.Breakdown)
    game.gameState?.finish()

    Math.random = original

    expect(all[1].unit.immobilized).toBe(true)

    try {
      game.executeUndo(false)
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

    game.setGameState(new PassState(game))
    expect(game.gameState?.type).toBe(stateType.Pass)
    expect(game.initiative).toBe(0)
    expect(game.currentPlayer).toBe(2)
    expect(game.phase).toBe(gamePhaseType.Main)
    expect(reactionFireCheck(game)).toBe(false)

    game.gameState?.finish()
    expect(game.gameState).toBe(undefined)
    expect(game.initiative).toBe(1)
    expect(game.currentPlayer).toBe(1)
    expect(game.phase).toBe(gamePhaseType.Main)
    expect(reactionFireCheck(game)).toBe(false)

    game.setGameState(new PassState(game))
    expect(game.gameState?.type).toBe(stateType.Pass)
    expect(game.initiative).toBe(1)
    expect(game.currentPlayer).toBe(1)
    expect(game.phase).toBe(gamePhaseType.Main)
    expect(reactionFireCheck(game)).toBe(false)

    game.gameState?.finish()
    expect(game.gameState).toBe(undefined)
    expect(game.initiative).toBe(0)
  })

  test("sniper", () => {
    const game = createMoveGame()
    game.alliedSniper = new Feature({
      id: "sniper-1", t: featureType.Sniper, n: "Sniper", i: "sniper", f: 3, o: { q: 1 }, ft: 1
    })
    const map = game.scenario.map
    const firing = new Unit(testGInf)
    firing.id = "firing1"
    map.select(firing)
    const floc = new Coordinate(3, 2)
    map.addCounter(floc, firing)

    game.sniperNeeded = [{unit: firing, loc: floc }]

    game.setGameState(new SniperState(game))

    const original = Math.random
    vi.spyOn(Math, "random").mockReturnValue(0.99)
    game.gameState?.finish()
    Math.random = original

    expect(game.lastAction?.type).toBe("sniper")
    expect(game.lastAction?.stringValue).toBe("Soviet sniper check: target 1, rolled 20 [2d10: 10 + 10], no effect")
  })

  test("game end", () => {
    const game = createBlankGame()
    game.scenario.map.windVariable = true
    game.setTurn(5)
    expect(game.phase).toBe(gamePhaseType.Main)

    game.setGameState(new PassState(game))
    game.gameState?.finish()
    expect(game.phase).toBe(gamePhaseType.Main)

    game.setGameState(new PassState(game))
    game.gameState?.finish()

    expect(game.actions[0]?.type).toBe("pass")
    expect(game.actions[1]?.type).toBe("pass")
    expect(game.actions[2]?.type).toBe("phase")
    expect(game.actions[2]?.stringValue).toBe(
      "both players have passed, main phase complete > starting close combat > no units in contact, skipping > " +
      "close combat complete > starting overstack check for German > no overstacked units, skipping > " +
      "overstack check complete for German > starting overstack check for Soviet > " +
      "no overstacked units, skipping > overstack check complete for Soviet > game complete"
    )

    expect(game.actions.length).toBe(4)

    expect(game.lastAction?.type).toBe("state")
    expect(game.lastAction?.stringValue).toBe("last turn complete, game over")

    expect(game.state).toBe("complete")
    expect(game.winner).toBe("two")
  })
});
