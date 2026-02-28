import { Coordinate, GameAction, unitType } from "../../utilities/commonTypes"
import { coordinateToLabel } from "../../utilities/utilities"
import Game from "../Game"
import Map from "../Map"
import { gamePhaseType } from "../support/gamePhase"
import Unit from "../Unit"
import { showClearObstacles, showEntrench } from "./assault"
import { showLaySmoke, showLoadMove, showDropMove } from "./movement"
import { stateType } from "./state/BaseState"
import BreakdownState, { breakdownCheck } from "./state/BreakdownState"
import CloseCombatState, { closeCombatCasualyNeeded, closeCombatCheck, closeCombatDone } from "./state/CloseCombatState"
import InitiativeState, { initiativeCheck } from "./state/InitiativeState"
import MoraleCheckState from "./state/MoraleCheckState"
import ReactionState, { reactionFireCheck } from "./state/ReactionState"
import RoutCheckState from "./state/RoutCheckState"
import RoutState from "./state/RoutState"
import SniperState from "./state/SniperState"

export default function actionsAvailable(game: Game, activePlayer: string): GameAction[] {
  if (breakdownCheck(game)) {
    game.gameState = new BreakdownState(game)
  } else if (game.sniperNeeded.length > 0) {
    game.gameState = new SniperState(game)
  } else if (game.moraleChecksNeeded.length > 0) {
    game.gameState = new MoraleCheckState(game)
  } else if (game.routNeeded.length > 0) {
    game.routNeeded[0].unit.select()
    game.gameState = new RoutState(game, false)
  } else if (game.routCheckNeeded.length > 0) {
    game.gameState = new RoutCheckState(game)
  } else if (initiativeCheck(game)) {
    game.gameState = new InitiativeState(game)
  } else if (reactionFireCheck(game)) {
    game.gameState = new ReactionState(game)
  } else if (closeCombatCheck(game)) {
    game.gameState = new CloseCombatState(game)
  }
  if (closeCombatDone(game)) {
    game.gameState?.finish()
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
    if (!game.gameState?.actionInProgress) {
      addUndo(game, activePlayer, actions)
    }
    actions.unshift({ type: "deploy" })
  } else if (game.phase === gamePhaseType.PrepRally) {
    actions.unshift({ type: "none", message: "select unit to rally" })
    const select = currSelection(game, false)
    if (select) {
      actions.push({ type: "rally" })
    }
    actions.push({ type: "rally_pass" })
  } else if (game.phase === gamePhaseType.PrepPrecip) {
    actions.push({ type: "precip_check" })
  } else if (game.phase === gamePhaseType.Main) {
    const selection = currSelection(game, false)
    if (!game.gameState?.actionInProgress) {
      addUndo(game, activePlayer, actions)
    }
    if (game.gameState?.type === stateType.Fire) {
      const action = game.fireState
      if (action) {
        if (!action.doneSelect) {
          actions.unshift({ type: "none", message: "select fire group" })
          actions.push({ type: "finish_multiselect" })
        } else {
          actions.unshift({ type: "none", message: "select target" })
        }
        const sponson = !!action.selection[0].counter.unit.sponson
        if (sponson && !(selection?.sponsonJammed || selection?.sponsonDestroyed ||
                         selection?.jammed || selection?.weaponDestroyed)) {
          actions.push({ type: "fire_toggle_sponson" })
        }
        if (!action.doneRotating && !action.sponson) {
          actions.push({ type: "finish_rotation" })
        }
        if (selection?.smokeCapable && (selection.targetedRange || selection.offBoard)) {
          actions.push({ type: "fire_smoke" })
        }
        if (action.targetHexes.length > 0) {
          actions.push({ type: "fire_finish" })
        }
        actions.push({ type: "cancel_action" })
      } else {
        actions.unshift({ type: "none", message: "error: unexpected missing state" })
      }
    } else if (game.gameState?.type === stateType.Move) {
      const actionSelect = currSelection(game, true)
      const action = game.moveState
      if (actionSelect && action) {
        if (action.loading) {
          if (action.needPickUpDisambiguate) {
            actions.unshift({ type: "none", message: "select unit to pick up unit" })
          } else {
            actions.unshift({ type: "none", message: "select unit to be picked up" })
          }
        } else if (action.dropping) {
          actions.unshift({ type: "none", message: "select unit to drop off" })
        } else if (action.smoke) {
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
    } else if (game.gameState?.type === stateType.Assault) {
      const action = game.assaultState
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
    } else if (game.gameState?.type === stateType.Breakdown) {
      actions.push({ type: "breakdown" })
    } else if (game.gameState?.type === stateType.RoutAll) {
        actions.unshift({ type: "none", message: "enemy rout" })
        actions.push({ type: "enemy_rout" })
        actions.push({ type: "cancel_action" })
    } else if (game.gameState?.type === stateType.RoutCheck) {
        actions.push({ type: "rout_check" })
    } else if (game.gameState?.type === stateType.Rout) {
      if (game.routState.optional && !game.routState.routPathTree) {
        actions.unshift({ type: "none", message: "can't rout unit without eliminating it" })
      } else if (!game.routState.routPathTree) {
        actions.unshift({ type: "none", message: "unit has no legal move" })
        actions.push({ type: "rout_eliminate" })
      } else {
        actions.unshift({ type: "none", message: "select location to rout to" })
      }
      if (game.routState.optional) {
        actions.push({ type: "cancel_action" })
      }
    } else if (game.gameState?.type === stateType.MoraleCheck) {
      const counter = game.gameState.selection[0].counter
      const hex = counter.hex as Coordinate
      actions.unshift({
        type: "none",
        message: `${game.nationNameForPlayer(game.gameState.player)} ${counter.unit.name} ` +
          `at ${coordinateToLabel(hex)}:`
      })
      actions.push({ type: "morale_check" })
    } else if (game.gameState?.type === stateType.Initiative) {
      actions.push({ type: "initiative" })
    } else if (game.gameState?.type === stateType.Sniper) {
      actions.push({ type: "sniper" })
    } else if (game.gameState?.type === stateType.Pass) {
      actions.unshift({ type: "none", message: "are you sure?" })
      actions.push({ type: "pass" })
      actions.push({ type: "pass_cancel" })
    } else if (game.gameState?.type === stateType.Reaction) {
      actions.unshift({ type: "none", message: "reaction fire" })
      if (canReactionFire(selection)) { actions.push({ type: "reaction_fire" }) }
      if (canReactionIntensiveFire(selection)) { actions.push({ type: "reaction_intensive_fire" }) }
      actions.push({ type: "reaction_pass" })
    } else if (!selection) {
      actions.unshift({ type: "none", message: "select units to activate" })
      if (canEnemyRout(game.scenario.map)) { actions.push({ type: "enemy_rout" }) }
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
  } else if (game.phase === gamePhaseType.CleanupCloseCombat) {
    const selection = currSelection(game, false)
    if (game.gameState?.type === stateType.CloseCombat) {
      if (selection) {
        if (closeCombatCasualyNeeded(game)) {
          actions.push({ type: "close_combat_reduce" })
        } else {
          actions.push({ type: "close_combat_select" })
        }
      } else {
        if (closeCombatCasualyNeeded(game)) {
          actions.unshift({ type: "none", message: "select unit to reduce" })
        } else {
          actions.unshift({ type: "none", message: "select close combat to resolve" })
        }
      }
    } else {
      actions.unshift({ type: "none", message: "error: unexpected missing state" })
    }
  } else if (game.gameState?.type === stateType.Overstack) {
    actions.unshift({ type: "none", message: "overstacked units; select unit to remove" })
    const select = currSelection(game, false)
    if (select) {
      actions.push({ type: "overstack_reduce" })
    }
  } else if (game.smokeCheckNeeded.length > 0) {
    actions.unshift({ type: "none", message: "checking smoke dispersion" })
    actions.unshift({ type: "smoke_check" })
  } else if (game.fireOutCheckNeeded.length > 0) {
    actions.unshift({ type: "none", message: "checking if fires extinguish" })
    actions.unshift({ type: "fire_out_check" })
  } else if (game.fireSpreadCheckNeeded.length > 0) {
    actions.unshift({ type: "none", message: "checking if fires spread" })
    actions.unshift({ type: "fire_spread_check" })
  } else if (game.checkWindDirection || game.checkWindSpeed) {
    actions.unshift({ type: "none", message: "variable weather" })
    actions.unshift({ type: "weather_check" })
  } else {
    actions.unshift({ type: "none", message: "not implemented yet" })
  }
  return actions
}

export function currSelection(game: Game, move: boolean): Unit | undefined {
  if (!game) { return undefined}
  if (game.gameState && game.gameState.selection.length > 0) {
    const unit = game.gameState.selection[0].counter.unit
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
  if (unit.parent && (unit.parent.pinned || unit.parent.isBroken)) { return false }
  if (unit.parent && unit.parent.isVehicle) { return false }
  if (!unit.parent && (unit.operated)) { return false }
  return true
}

function canFire(unit?: Unit): boolean {
  if (unit === undefined) { return false }
  if (unit.isActivated) { return false }
  return checkFire(unit)
}

function canIntensiveFire(unit?: Unit): boolean {
  if (unit === undefined) { return false }
  if (!unit.isActivated) { return false }
  if (unit.offBoard || unit.crewed || unit.areaFire) { return false }
  return checkFire(unit)
}

function canReactionFire(unit?: Unit): boolean {
  if (unit === undefined) { return false }
  if (unit.areaFire) { return false }
  return canFire(unit)
}

function canReactionIntensiveFire(unit?: Unit): boolean {
  if (unit === undefined) { return false }
  return canIntensiveFire(unit)
}

function canMoveAny(unit: Unit): boolean {
  if (unit.type === unitType.SupportWeapon || unit.type === unitType.Gun) { return false }
  if (unit.currentMovement === 0) { return false }
  if (unit.parent) { return false }
  return true
}

function canMove(unit?: Unit): boolean {
  if (unit === undefined) { return false }
  if (!canMoveAny(unit)) { return false }
  if (unit.isActivated || unit.isExhausted || unit.isBroken) { return false }
  return true
}

function canRush(unit?: Unit): boolean {
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

function canAssaultMove(unit?: Unit): boolean {
  if (unit === undefined) { return false }
  if (!canMoveAny(unit)) { return false }
  if (unit.isActivated || unit.isExhausted || unit.isBroken) { return false }
  if (unit.children.length > 0 && unit.children[0].crewed) { return false }
  if (unit.canCarrySupport && unit.children.length > 0 &&
      unit.children[0].baseMovement + unit.currentMovement <= 0) { return false }
  return true
}

function canRout(unit?: Unit): boolean {
  if (unit === undefined) { return false }
  if (!unit.isBroken || unit.routed) { return false }
  return true
}

function canEnemyRout(map?: Map): boolean {
  if (!map || !map.game) { return false }
  if (map.game.checkLastSAIsRush(map.game.currentPlayer)) { return false }
  const units = map.allUnits
  for (const u of units) {
    if (u.unit.nation !== map.game?.currentPlayerNation && u.unit.isBroken && !u.unit.routed) { return true }
  }
  return false
}