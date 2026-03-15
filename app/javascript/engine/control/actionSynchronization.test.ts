import { describe, expect, test } from "vitest"
import { createBlankGame } from "./testHelpers"
import { gamePhaseType } from "../support/gamePhase"
import GameAction, { GameActionData } from "../GameAction"

const actions = [{
    id: 1, sequence: 1, user: "doubt72", player: 1, undone: false, created_at: "2026-03-12T16:45:38Z",
    data: {
        action: "phase", old_initiative: 0,
        phase_data: { new_turn: 1, old_turn: 0, new_phase: 0, old_phase: 0, new_player: 1 },
    },
}, {
    id: 2, sequence: 2, user: "doubt72", player: 1, undone: false, created_at: "2026-03-12T16:45:38Z",
    data: { action: "info", message: "no units to deploy, skipping phase", old_initiative: 0 },
}, {
    id: 3, sequence: 3, user: "doubt72", player: 1, undone: false, created_at: "2026-03-12T16:45:38Z",
    data: {
        action: "phase", old_initiative: 0,
        phase_data: { new_turn: 1, old_turn: 1, new_phase: 0, old_phase: 0, new_player: 2 },
    },
}, {
    id: 4, sequence: 4, user: "doubt72", player: 2, undone: false, created_at: "2026-03-12T16:45:39Z",
    data: { action: "info", message: "no units to deploy, skipping phase", old_initiative: 0 },
}, {
    id: 5, sequence: 5, user: "doubt72", player: 2, undone: false, created_at: "2026-03-12T16:45:38Z",
    data: {
        action: "phase", old_initiative: 0,
        phase_data: { new_turn: 1, old_turn: 1, new_phase: 1, old_phase: 0, new_player: 1 },
    },
}, {
    id: 6, sequence: 6, user: "doubt72", player: 1, undone: false,
    created_at: "2026-03-12T16:45:38Z",
    data: {
        action: "info", message: "no rallyable broken units or jammed weapons, skipping phase", old_initiative: 0
    },
}, {
    id: 7, sequence: 7, user: "doubt72", player: 1, undone: false, created_at: "2026-03-12T16:45:38Z",
    data: {
        action: "phase", old_initiative: 0,
        phase_data: { new_turn: 1, old_turn: 1, new_phase: 1, old_phase: 1, new_player: 2 },
    },
}, {
    id: 8, sequence: 8, user: "doubt72", player: 2, undone: false, created_at: "2026-03-12T16:45:38Z",
    data: {
        action: "info", message: "no rallyable broken units or jammed weapons, skipping phase", old_initiative: 0
    },
}, {
    id: 9, sequence: 9, user: "doubt72", player: 2, undone: false, created_at: "2026-03-12T16:45:38Z",
    data: {
        action: "phase", old_initiative: 0,
        phase_data: { new_turn: 1, old_turn: 1, new_phase: 2, old_phase: 1, new_player: 1 },
    },
}, {
    id: 10, sequence: 10, user: "doubt72", player: 1, undone: false, created_at: "2026-03-12T16:45:38Z",
    data: { action: "info", message: "no precipitation in scenario, skipping check", old_initiative: 0 },
}, {
    id: 11, sequence: 11, user: "doubt72", player: 1, undone: false, created_at: "2026-03-12T16:45:38Z",
    data: {
        action: "phase", old_initiative: 0,
        phase_data: { new_turn: 1, old_turn: 1, new_phase: 3, old_phase: 2, new_player: 1 },
    },
}]

describe("action synchronization", () => {
  test("actions out of order eventually rectify", () => {
    const game = createBlankGame()
    game.phase = gamePhaseType.Deployment
    game.setTurn(0)

    game.executeAction(new GameAction(actions[0] as GameActionData, game), true)
    expect(game.fullySynced).toBe(true)
    for (let i = actions.length - 1; i > 0; i--) {
      expect(game.phase).toBe(gamePhaseType.Deployment)
      expect(game.currentPlayer).toBe(1)
      expect(game.lastActionIndex).toBe(0)
      const action = new GameAction(actions[i] as GameActionData, game)
      if (i > 1) { expect(game.canExecute(action.data.sequence as number)).toBe(false) }
      game.executeAction(action, true)
      if (i > 1) { expect(game.fullySynced).toBe(false) }
    }
    expect(game.fullySynced).toBe(true)
    expect(game.needsRectify).toBe(false)
    expect(game.phase).toBe(gamePhaseType.Main)
    expect(game.currentPlayer).toBe(1)
    expect(game.lastActionIndex).toBe(10)
    expect(game.currentSequence).toBe(11)
    for (let i = actions.length - 1; i > 0; i--) {
      const action = game.actions[i]
      expect(action.index).toBe(i)
      expect(action.sequence).toBe(i + 1)
    }
  })

  test("undos out of order eventually rectify", () => {
    const game = createBlankGame()
    game.phase = gamePhaseType.Deployment
    game.setTurn(0)

    for (let i = 0; i < actions.length; i++) {
      game.executeAction(new GameAction(actions[i] as GameActionData, game), true)
    }

    for (let i = 1; i < actions.length; i++) {
      expect(game.phase).toBe(gamePhaseType.Main)
      expect(game.currentPlayer).toBe(1)
      expect(game.lastActionIndex).toBe(10)
      const action = structuredClone(actions[i]) as GameActionData
      action.undone = true
      game.executeAction(new GameAction(action, game), true)
    }
    expect(game.phase).toBe(gamePhaseType.Deployment)
    expect(game.currentPlayer).toBe(1)
    expect(game.lastActionIndex).toBe(-1)
    expect(game.currentSequence).toBe(11)
    for (let i = actions.length - 1; i > 0; i--) {
      const action = game.actions[i]
      expect(action.index).toBe(i)
      expect(action.sequence).toBe(i + 1)
    }
  })
})
