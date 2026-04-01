import { describe, expect, test } from "vitest"
import { createBlankGame } from "./testHelpers"
import { gamePhaseType } from "../support/gamePhase"
import GameAction, { GameActionData } from "../GameAction"

const actions = [{
    id: 1, sequence: 1, user: "doubt72", player: 2, undone: false, created_at: "2026-03-12T16:45:38Z",
    data: {"action": "phase", "phase_data": {"messages": ["overstack check complete for Soviet", "starting status update"], "new_turn": 4, "old_turn": 4, "new_phase": 6, "old_phase": 5, "new_player": 2}, "old_initiative": 3},
}, {
    id: 2, sequence: 2, user: "doubt72", player: 1, undone: false, created_at: "2026-03-12T16:45:38Z",
    data: {"action": "status_update", "target": [], "old_initiative": 3}
}, {
    id: 3, sequence: 3, user: "doubt72", player: 1, undone: false, created_at: "2026-03-12T16:45:38Z",
    data: {"action": "phase", "phase_data": {"messages": ["status update complete", "starting smoke dispersion check", "no smoke counters, skipping", "smoke dispersion check complete", "starting blaze check", "no blazes on map, skipping", "blaze check complete", "starting variable wind check"], "new_turn": 4, "old_turn": 4, "new_phase": 9, "old_phase": 6, "new_player": 2}, "old_initiative": 3}
}]

describe("action synchronization", () => {
  test("actions out of order eventually rectify", () => {
    const game = createBlankGame()
    game.phase = gamePhaseType.CleanupOverstack
    game.setTurn(0)

    game.executeAction(new GameAction(actions[0] as GameActionData, game), true)
    expect(game.fullySynced).toBe(true)
    for (let i = actions.length - 1; i > 0; i--) {
      expect(game.phase).toBe(gamePhaseType.CleanupStatus)
      expect(game.currentPlayer).toBe(2)
      expect(game.lastActionIndex).toBe(0)
      const action = new GameAction(actions[i] as GameActionData, game)
      if (i > 1) { expect(game.canExecute(action.data.sequence as number)).toBe(false) }
      game.executeAction(action, true)
      if (i > 1) { expect(game.fullySynced).toBe(false) }
    }
    expect(game.fullySynced).toBe(true)
    expect(game.needsRectify).toBe(false)
    expect(game.phase).toBe(gamePhaseType.CleanupWeather)
    expect(game.currentPlayer).toBe(2)
    expect(game.lastActionIndex).toBe(2)
    expect(game.currentSequence).toBe(3)
    for (let i = actions.length - 1; i > 0; i--) {
      const action = game.actions[i]
      expect(action.index).toBe(i)
      expect(action.sequence).toBe(i + 1)
    }
  })

  test("undos out of order eventually rectify", () => {
    const game = createBlankGame()
    game.phase = gamePhaseType.CleanupOverstack
    game.setTurn(0)

    for (let i = 0; i < actions.length; i++) {
      game.executeAction(new GameAction(actions[i] as GameActionData, game), true)
    }

    for (let i = 1; i < actions.length; i++) {
      expect(game.phase).toBe(gamePhaseType.CleanupWeather)
      expect(game.currentPlayer).toBe(2)
      expect(game.lastActionIndex).toBe(2)
      const action = structuredClone(actions[i]) as GameActionData
      action.undone = true
      game.executeAction(new GameAction(action, game), true)
    }
    expect(game.phase).toBe(gamePhaseType.CleanupStatus)
    expect(game.currentPlayer).toBe(1)
    expect(game.lastActionIndex).toBe(0)
    expect(game.currentSequence).toBe(3)
    for (let i = actions.length - 1; i > 0; i--) {
      const action = game.actions[i]
      expect(action.index).toBe(i)
      expect(action.sequence).toBe(i + 1)
    }
  })
})
