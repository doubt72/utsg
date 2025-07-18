import { Coordinate, GameAction, unitType } from "../../utilities/commonTypes"
import { coordinateToLabel } from "../../utilities/utilities"
import Game, { gamePhaseType } from "../Game"
import Unit from "../Unit"
import { showClearObstacles, showEntrench } from "./assault"
import { actionType, needPickUpDisambiguate } from "./gameActions"
import { showLaySmoke, showLoadMove, showDropMove } from "./movement"

export default function actionsAvailable(game: Game, activePlayer: string): GameAction[] {
  if (game.breakdownCheck) {
    game.startBreakdown()
  } else if (game.moraleChecksNeeded.length > 0) {
    game.startMoraleCheck()
  } else if (game.initiativeCheck) {
    game.startInitiative()
  } else if (game.reactionFireCheck) {
    game.startReaction()
  }
  if (game.lastAction?.id === undefined) {
    return [{ type: "sync" }]
  }
  const actions: GameAction[] = []
  if (game.state === "complete") {
      return [{ type: "none", message: "game over" }]
  } else if (game.state === "needs_player") {
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
  } else if (checkPlayer(game, activePlayer, actions)) {
    return actions
  } else if (game.phase === gamePhaseType.Deployment) {
    if (!game.actionInProgress) {
      addUndo(game, activePlayer, actions)
    }
    actions.unshift({ type: "deploy" })
    return actions
  } else if (game.phase === gamePhaseType.Main) {
    const selection = currSelection(game, false)
    if (!game.actionInProgress && (!selection || game.gameActionState?.currentAction === actionType.Breakdown)) {
      addUndo(game, activePlayer, actions)
    }
    if (game.gameActionState?.currentAction === actionType.Fire && game.gameActionState.fire) {
      const action = game.gameActionState.fire
      if (action) {
        if (!action.doneSelect) {
          actions.unshift({ type: "none", message: "select fire group" })
          actions.push({ type: "finish_multiselect" })
        } else {
          actions.unshift({ type: "none", message: "select target" })
        }
        const sponson = !!game.gameActionState.selection[0].counter.unit.sponson
        if (sponson && !(selection?.sponsonJammed || selection?.sponsonDestroyed ||
                         selection?.jammed || selection?.weaponDestroyed)) {
          actions.push({ type: "fire_toggle_sponson" })
        }
        if (!action.doneRotating && !game.sponsonFire) {
          actions.push({ type: "finish_rotation" })
        }
        if (selection?.smokeCapable && (selection.targetedRange || selection.offBoard)) {
          actions.push({ type: "fire_smoke" })
        }
        console.log(action.targetHexes.length)
        if (action.targetHexes.length > 0) {
          actions.push({ type: "fire_finish" })
        }
        actions.push({ type: "cancel_action" })
      } else {
        actions.unshift({ type: "none", message: "error: unexpected missing state" })
      }
    } else if (game.gameActionState?.currentAction === actionType.Move && game.gameActionState.move) {
      const actionSelect = currSelection(game, true)
      const action = game.gameActionState.move
      if (actionSelect && action) {
        if (action.loadingMove) {
          if (needPickUpDisambiguate(game)) {
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
        if (actionSelect.turreted && !actionSelect.turretJammed) {
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
          actions.push({ type: "finish_multiselect" })
        }
        if (action.path.length + action.addActions.length > 1) {
          actions.push({ type: "move_finish" })
        }
        actions.push({ type: "cancel_action" })
      } else {
        actions.unshift({ type: "none", message: "error: unexpected missing state" })
      }
    } else if (game.gameActionState?.currentAction === actionType.Assault) {
      const action = game.gameActionState.assault
      if (action) {
        if (showClearObstacles(game)) {
          actions.push({ type: "assault_move_clear" })
        }
        if (showEntrench(game)) {
          actions.push({ type: "assault_move_entrench" })
        }
        if (action.path.length + action.addActions.length > 1) {
          actions.push({ type: "assault_move_finish" })
        }
        if (!action.doneSelect) {
          actions.push({ type: "finish_multiselect" })
        }
        actions.push({ type: "cancel_action" })
      } else {
        actions.unshift({ type: "none", message: "error: unexpected missing state" })
      }
    } else if (game.gameActionState?.currentAction === actionType.Breakdown) {
      actions.push({ type: "breakdown" })
    } else if (game.gameActionState?.currentAction === actionType.MoraleCheck) {
      const select = game.gameActionState
      const counter = game.gameActionState.selection[0].counter
      const hex = counter.hex as Coordinate
      actions.unshift({
        type: "none",
        message: `${game.nationNameForPlayer(select.player)} ${counter.unit.name} at ${coordinateToLabel(hex)}:`
      })
      actions.push({ type: "morale_check" })
    } else if (game.gameActionState?.currentAction === actionType.Initiative) {
      actions.push({ type: "initiative" })
    } else if (game.gameActionState?.currentAction === actionType.Pass) {
      actions.unshift({ type: "none", message: "are you sure?" })
      actions.push({ type: "pass" })
      actions.push({ type: "pass_cancel" })
    } else if (game.reactionFire) {
      actions.unshift({ type: "none", message: "reaction fire" })
      if (canFire(selection)) { actions.push({ type: "reaction_fire" }) }
      if (canIntensiveFire(selection)) { actions.push({ type: "reaction_intensive_fire" }) }
      actions.push({ type: "reaction_pass" })
    } else if (!selection) {
      actions.unshift({ type: "none", message: "select units to activate" })
      if (canEnemyRout()) { actions.push({ type: "enemy_rout" }) }
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
    return actions
  } else {
    actions.unshift({ type: "none", message: "not implemented yet" })
    return actions
  }
}

export function currSelection(game: Game, move: boolean): Unit | undefined {
  if (!game) { return undefined}
  if (game.gameActionState?.selection && game.gameActionState.selection.length > 0) {
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

function checkPlayer(game: Game, activePlayer: string, actions: GameAction[]): boolean {
  if ((activePlayer === game.playerOneName && game.lastAction?.player === 1) ||
      (activePlayer === game.playerTwoName && game.lastAction?.player === 2)) {
    return false
  } else if (activePlayer !== game.playerOneName && activePlayer !== game.playerTwoName) {
    actions.unshift({ type: "none", message: "waiting for player to move" })
    return true
  }
  actions.unshift({ type: "none", message: "waiting for opponent to move" })
  return true
}

function addUndo(game: Game, activePlayer: string, actions: GameAction[]) {
  if (!game.lastAction?.undoPossible) { return }
  if ((activePlayer === game.playerOneName && game.lastAction.player === 1) ||
      (activePlayer === game.playerTwoName && game.lastAction.player === 2)) {
    actions.push({ type: "undo" })
  }
}

function checkFire(unit: Unit): boolean {
  if (unit.isExhausted || unit.isBroken) { return false }
  if (unit.currentFirepower <= 0) { return false }
  if (unit.jammed && !unit.sponson) { return false }
  if (unit.sponson && unit.jammed && unit.sponsonJammed) { return false }
  if (unit.children.length > 0 && unit.children[0].crewed) { return false }
  if (unit.parent && (unit.parent.isPinned || unit.parent.isBroken)) { return false }
  if (unit.parent && unit.parent.isVehicle) { return false }
  if (!unit.parent && (unit.operated)) { return false }
  return true
}

function canFire(unit: Unit | undefined): boolean {
  if (unit === undefined) { return false }
  if (unit.isActivated) { return false }
  return checkFire(unit)
}

function canIntensiveFire(unit: Unit | undefined): boolean {
  if (unit === undefined) { return false }
  if (!unit.isActivated) { return false }
  if (unit.offBoard || unit.crewed) { return false }
  return checkFire(unit)
}

function canMoveAny(unit: Unit): boolean {
  if (unit.type === unitType.SupportWeapon || unit.type === unitType.Gun) { return false }
  if (unit.currentMovement === 0) { return false }
  if (unit.parent) { return false }
  return true
}

function canMove(unit: Unit | undefined): boolean {
  if (unit === undefined) { return false }
  if (!canMoveAny(unit)) { return false }
  if (unit.isActivated || unit.isExhausted || unit.isBroken) { return false }
  return true
}

function canRush(unit: Unit | undefined): boolean {
  if (unit === undefined) { return false }
  if (!canMoveAny(unit)) { return false }
  if (!unit.isActivated) { return false }
  if (!unit.canCarrySupport) { return false }
  if (unit.children.length > 0 && unit.children[0].crewed) { return false }
  if (unit.children.length > 0 && unit.children[0].baseMovement + Math.floor(unit.currentMovement/2) <= 0) {
    return false
  }
  return true
}

function canAssaultMove(unit: Unit | undefined): boolean {
  if (unit === undefined) { return false }
  if (!canMoveAny(unit)) { return false }
  if (unit.isActivated || unit.isExhausted || unit.isBroken) { return false }
  if (unit.children.length > 0 && unit.children[0].crewed) { return false }
  if (unit.canCarrySupport && unit.children.length > 0 &&
      unit.children[0].baseMovement + unit.currentMovement <= 0) { return false }
  return true
}

function canRout(unit: Unit | undefined): boolean {
  if (unit === undefined) { return false }
  return false
}

function canEnemyRout(): boolean {
  return false
}