import { GameAction } from "../../utilities/commonTypes"
import Game, { actionType, gamePhaseType } from "../Game"

export default function actionsAvailable(game: Game, activePlayer: string): GameAction[] {
  if (game.lastMove?.id === undefined) {
    return [{ type: "sync" }]
  }
  const moves = []
  if (game.lastMove?.undoPossible && !game.moveInProgress) {
    moves.push({ type: "undo" })
  }
  if (game.state === "needs_player") {
    if (game.ownerName === activePlayer || !activePlayer) {
      return [{ type: "none", message: "waiting for player to join" }]
    } else {
      return [{ type: "join" }]
    }
  } else if (game.state === "ready") {
    if (game.ownerName === activePlayer) {
      return [{ type: "start" }]
    } else if (activePlayer &&
      (game.playerOneName === activePlayer || game.playerTwoName === activePlayer)) {
      return [{ type: "leave" }]
    } else {
      return [{ type: "none", message: "waiting for game to start" }]
    }
  } else if (game.phase === gamePhaseType.Deployment) {
    moves.unshift({ type: "deploy" })
    return moves
  } else if (game.phase === gamePhaseType.Main) {
    if ((activePlayer === game.playerOneName && game.currentPlayer === 1) ||
        (activePlayer === game.playerTwoName && game.currentPlayer === 2)) {
      if (game.gameActionState?.currentAction === actionType.Move) {
        if (game.gameActionState.move && game.gameActionState.selection) {
          // TODO REFACTOR
          if (game.gameActionState.move.doneSelect) {
            moves.unshift({ type: "none", message: "select hex to move" })
          } else {
            moves.unshift({ type: "none", message: "select addtional units or select hex to move" })
          }
          if (game.gameActionState.selection[0].counter.target.turreted) {
            moves.push({ type: "move_rotate_toggle" })
          }
          if (game.gameActionState.move.path.length > 1) {
            moves.push({ type: "move_finish" })
          }
          moves.push({ type: "move_cancel" })
        } else {
          moves.unshift({ type: "none", message: "error: unexpected missing state" })
        }
      } else if (game.opportunityFire) {
        moves.unshift({ type: "none", message: "opportunity fire" })
        moves.push({ type: "opportunity_fire" })
        moves.push({ type: "opportunity_intensive_fire" })
        moves.push({ type: "empty_pass" })
      } else if (game.reactionFire) {
        moves.unshift({ type: "none", message: "reaction fire" })
        moves.push({ type: "reaction_fire" })
        moves.push({ type: "reaction_intensive_fire" })
        moves.push({ type: "empty_pass" })
      } else if (game.scenario.map.noSelection) {
        moves.unshift({ type: "none", message: "select units to activate" })
        moves.push({ type: "enemy_rout" })
        moves.push({ type: "pass" })
      } else {
        moves.push({ type: "fire" })
        moves.push({ type: "intensive_fire" })
        if (!["sw", "gun", "other"].includes(game.scenario.map.currentSelection[0].target.type as string)) {
          moves.push({ type: "move" })
          moves.push({ type: "rush" })
          moves.push({ type: "assault_move" })
          moves.push({ type: "rout" })
        }
        moves.push({ type: "pass" })
      }
    } else {
      moves.unshift({ type: "none", message: "waiting for opponent to move" })
    }
    return moves
  } else {
    moves.unshift({ type: "none", message: "not implemented yet" })
    return moves
  }
}

// TODO: add current selection
// TODO: acd possible actions for current selection

// function currSelection(game: Game): Unit | undefined {
//   if (!game) { return undefined}
//   if (game.gameActionState?.selection) {
//     const counters = game.gameActionState.selection[0].counter
//   }
//   const counters = game.scenario.map.currentSelection
//   if (counters.length < 1) { return undefined }
//   return counters[0].target as Unit
// }