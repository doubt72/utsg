import { GameAction, unitType } from "../../utilities/commonTypes"
import Game, { actionType, gamePhaseType } from "../Game"
import Unit from "../Unit"
import { showDropSmoke, showLoadMove, showShortDropMove } from "./movement"

export default function actionsAvailable(game: Game, activePlayer: string): GameAction[] {
  if (game.lastMove?.id === undefined) {
    return [{ type: "sync" }]
  }
  const moves = []
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
    // TODO: limit undo to user who do'd
    if (game.lastMove?.undoPossible && !game.moveInProgress) {
      moves.push({ type: "undo" })
    }
    moves.unshift({ type: "deploy" })
    return moves
  } else if (game.phase === gamePhaseType.Main) {
    const selection = currSelection(game, false)
    if (game.lastMove?.undoPossible && !game.moveInProgress && !selection) {
      moves.push({ type: "undo" })
    }
    if ((activePlayer === game.playerOneName && game.currentPlayer === 1) ||
        (activePlayer === game.playerTwoName && game.currentPlayer === 2)) {
      if (game.gameActionState?.currentAction === actionType.Move && game.gameActionState.move) {
        const moveSelect = currSelection(game, true)
        const action = game.gameActionState.move
        if (moveSelect) {
          if (action.loadingMove) {
            if (game.needPickUpDisambiguate) {
              moves.unshift({ type: "none", message: "select unit to pick up unit" })
            } else {
              moves.unshift({ type: "none", message: "select unit to be picked up" })
            }
          } else if (action.shortDropMove) {
            moves.unshift({ type: "none", message: "select unit to drop off" })
          } else if (action.placingSmoke) {
            moves.unshift({ type: "none", message: "select hex to place smoke" })
          } else if (action.doneSelect) {
            moves.unshift({ type: "none", message: "select hex to move" })
          } else {
            moves.unshift({ type: "none", message: "select addtional units or select hex to move" })
          }
          if (moveSelect.turreted) {
            moves.push({ type: "move_rotate_toggle" })
          }
          if (showDropSmoke(game)) {
            moves.push({ type: "move_smoke_toggle" })
          }
          if (showShortDropMove(game)) {
            moves.push({ type: "move_shortdrop_toggle" })
          }
          if (showLoadMove(game)) {
            moves.push({ type: "move_load_toggle" })
          }
          if (!action.doneSelect) {
            moves.push({ type: "move_done_multiselect" })
          }
          if (action.path.length + action.addActions.length > 1) {
            moves.push({ type: "move_finish" })
          }
          moves.push({ type: "move_cancel" })
        } else {
          moves.unshift({ type: "none", message: "error: unexpected missing state" })
        }
      } else if (game.opportunityFire) {
        moves.unshift({ type: "none", message: "opportunity fire" })
        if (canFire(selection)) { moves.push({ type: "opportunity_fire" }) }
        if (canIntensiveFire(selection)) { moves.push({ type: "opportunity_intensive_fire" }) }
        moves.push({ type: "empty_pass" })
      } else if (game.reactionFire) {
        moves.unshift({ type: "none", message: "reaction fire" })
        if (canFire(selection)) { moves.push({ type: "reaction_fire" }) }
        if (canIntensiveFire(selection)) { moves.push({ type: "reaction_intensive_fire" }) }
        moves.push({ type: "empty_pass" })
      } else if (!selection) {
        moves.unshift({ type: "none", message: "select units to activate" })
        moves.push({ type: "enemy_rout" })
        moves.push({ type: "pass" })
      } else {
        if (canFire(selection)) { moves.push({ type: "fire" }) }
        if (canIntensiveFire(selection)) { moves.push({ type: "intensive_fire" }) }
        if (canMove(selection)) { moves.push({ type: "move" }) }
        if (canRush(selection)) { moves.push({ type: "rush" }) }
        if (canAssaultMove(selection)) { moves.push({ type: "assault_move" }) }
        if (canRout(selection)) { moves.push({ type: "rout" }) }
        moves.push({ type: "unselect" })
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

export function currSelection(game: Game, move: boolean): Unit | undefined {
  if (!game) { return undefined}
  if (game.gameActionState?.selection) {
    const unit = game.gameActionState.selection[0].counter.unit
    if (move && unit.canHandle && unit.children.length > 0 && unit.children[0].crewed) {
      return unit.children[0]
    }
    return unit
  }
  const counters = game.scenario.map.currentSelection
  if (counters.length < 1) { return undefined }
  return counters[0].unit
}

function canFire(unit: Unit | undefined): boolean {
  if (unit === undefined) { return false }
  return false
}

function canIntensiveFire(unit: Unit | undefined): boolean {
  if (unit === undefined) { return false }
  return false
}

function canMove(unit: Unit | undefined): boolean {
  if (unit === undefined) { return false }
  if (unit.type === unitType.SupportWeapon || unit.type === unitType.Gun) { return false }
  if (unit.currentMovement === 0) { return false }
  return true
}

function canRush(unit: Unit | undefined): boolean {
  if (unit === undefined) { return false }
  return false
}

function canAssaultMove(unit: Unit | undefined): boolean {
  if (unit === undefined) { return false }
  return false
}

function canRout(unit: Unit | undefined): boolean {
  if (unit === undefined) { return false }
  return false
}