import { GameAction, unitType } from "../../utilities/commonTypes"
import Game, { actionType, gamePhaseType } from "../Game"
import Unit from "../Unit"
import { showLaySmoke, showLoadMove, showDropMove } from "./movement"

export default function actionsAvailable(game: Game, activePlayer: string): GameAction[] {
  if (game.lastAction?.id === undefined) {
    return [{ type: "sync" }]
  }
  const actions = []
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
    if (game.lastAction?.undoPossible && !game.actionInProgress) {
      actions.push({ type: "undo" })
    }
    actions.unshift({ type: "deploy" })
    return actions
  } else if (game.phase === gamePhaseType.Main) {
    const selection = currSelection(game, false)
    if (game.lastAction?.undoPossible && !game.actionInProgress && !selection) {
      actions.push({ type: "undo" })
    }
    if ((activePlayer === game.playerOneName && game.currentPlayer === 1) ||
        (activePlayer === game.playerTwoName && game.currentPlayer === 2)) {
      if (game.gameActionState?.currentAction === actionType.Move && game.gameActionState.move) {
        const actionSelect = currSelection(game, true)
        const action = game.gameActionState.move
        if (actionSelect) {
          if (action.loadingMove) {
            if (game.needPickUpDisambiguate) {
              actions.unshift({ type: "none", message: "select unit to pick up unit" })
            } else {
              actions.unshift({ type: "none", message: "select unit to be picked up" })
            }
          } else if (action.droppingMove) {
            actions.unshift({ type: "none", message: "select unit to drop off" })
          } else if (action.placingSmoke) {
            actions.unshift({ type: "none", message: "select hex to place smoke" })
          } else if (action.doneSelect) {
            actions.unshift({ type: "none", message: "select hex to move" })
          } else {
            actions.unshift({ type: "none", message: "select addtional units or select hex to move" })
          }
          if (actionSelect.turreted) {
            actions.push({ type: "move_rotate_toggle" })
          }
          if (showLaySmoke(game)) {
            actions.push({ type: "move_smoke_toggle" })
          }
          if (showDropMove(game)) {
            actions.push({ type: "move_shortdrop_toggle" })
          }
          if (showLoadMove(game)) {
            actions.push({ type: "move_load_toggle" })
          }
          if (!action.doneSelect) {
            actions.push({ type: "move_done_multiselect" })
          }
          if (action.path.length + action.addActions.length > 1) {
            actions.push({ type: "move_finish" })
          }
          actions.push({ type: "move_cancel" })
        } else {
          actions.unshift({ type: "none", message: "error: unexpected missing state" })
        }
      } else if (game.opportunityFire) {
        actions.unshift({ type: "none", message: "opportunity fire" })
        if (canFire(selection)) { actions.push({ type: "opportunity_fire" }) }
        if (canIntensiveFire(selection)) { actions.push({ type: "opportunity_intensive_fire" }) }
        actions.push({ type: "empty_pass" })
      } else if (game.reactionFire) {
        actions.unshift({ type: "none", message: "reaction fire" })
        if (canFire(selection)) { actions.push({ type: "reaction_fire" }) }
        if (canIntensiveFire(selection)) { actions.push({ type: "reaction_intensive_fire" }) }
        actions.push({ type: "empty_pass" })
      } else if (!selection) {
        actions.unshift({ type: "none", message: "select units to activate" })
        actions.push({ type: "enemy_rout" })
        actions.push({ type: "pass" })
      } else {
        if (canFire(selection)) { actions.push({ type: "fire" }) }
        if (canIntensiveFire(selection)) { actions.push({ type: "intensive_fire" }) }
        if (canMove(selection)) { actions.push({ type: "move" }) }
        if (canRush(selection)) { actions.push({ type: "rush" }) }
        if (canAssaultMove(selection)) { actions.push({ type: "assault_move" }) }
        if (canRout(selection)) { actions.push({ type: "rout" }) }
        actions.push({ type: "unselect" })
      }
    } else {
      actions.unshift({ type: "none", message: "waiting for opponent to move" })
    }
    return actions
  } else {
    actions.unshift({ type: "none", message: "not implemented yet" })
    return actions
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