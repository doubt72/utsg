import Counter from "../Counter"
import Game from "../Game"

export function initiativeCheck(game: Game): boolean {
  if (game.gameState) { return false }
  let rc = false
  for (const a of game.actions.filter(a => !a.undone)) {
    if (a.type === "initiative") { rc = false }
    if (["move", "rush", "assault_move", "fire", "intensive_fire", "rout_self", "rout_all"].includes(a.type)) {
      rc = true
    }
  }
  return rc
}

export function breakdownCheck(game: Game): boolean {
  const action = game.lastAction
  if (!action || game.gameState) { return false }
  if (action.data.origin && action.data.origin.length > 0) {
    const id = action.data.origin[0].id
    const counter = game.findCounterById(id) as Counter
    if (["move", "assault_move"].includes(action.data.action) && counter.unit.breakdownRoll) {
      return true
    }
  }
  return false
}

export function reactionFireCheck(game: Game): boolean {
  if (game.gameState) { return false }
  let rc = false
  let last = ""
  let player = game.currentPlayer
  for (const a of game.actions.filter(a => !a.undone)) {
    rc = a.type === "initiative"
    if (["move", "rush", "assault_move", "fire", "intensive_fire", "rout_self", "rout_all"].includes(a.type)) {
      last = a.type
      player = a.player
    }
  }
  return rc && ["move", "rush", "fire", "intensive_fire"].includes(last) && player === game.currentPlayer
}

export function closeCombatCheck(game: Game): boolean {
  game
  return false
}

export function rushing(game: Game): boolean {
  if (!game.gameState || !game.gameState.move ||
      game.gameState.selection.length < 1) { return false }
  const unit = game.gameState.selection[0].counter.unit
  if (unit.isActivated) { return true }
  return false
}

export function intensiveFiring(game: Game): boolean {
  if (!game.gameState || !game.gameState.fire ||
      game.gameState.selection.length < 1) { return false }
  const unit = game.gameState.selection[0].counter.unit
  if (unit.isActivated) { return true }
  return false
}
