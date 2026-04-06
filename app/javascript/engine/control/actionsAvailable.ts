import { Coordinate, GameAction, unitType } from "../../utilities/commonTypes"
import { coordinateToLabel } from "../../utilities/utilities"
import Game from "../Game"
import Map from "../Map"
import { gamePhaseType } from "../support/gamePhase"
import Unit from "../Unit"
import { showClearObstacles, showEntrench } from "./assault"
import { closeCombatCasualtyNeeded } from "./closeCombat"
import { showLaySmoke, showLoadMove, showDropMove } from "./movement"
import { reactionFireCheck } from "./reactionFire"
import BaseState, { stateType } from "./state/BaseState"
import BreakdownState, { breakdownCheck } from "./state/BreakdownState"
import CloseCombatState from "./state/CloseCombatState"
import FireDisplaceState from "./state/FireDisplaceState"
import FireStartState from "./state/FireStartState"
import InitiativeState, { initiativeCheck } from "./state/InitiativeState"
import MoraleCheckState from "./state/MoraleCheckState"
import OverstackState from "./state/OverstackState"
import PrecipCheckState from "./state/PrecipCheckState"
import RallyState from "./state/RallyState"
import ReactionState from "./state/ReactionState"
import RoutCheckState from "./state/RoutCheckState"
import RoutState from "./state/RoutState"
import SniperState from "./state/SniperState"

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

function setState(game: Game): void {
  const state = game.gameState?.type
  if (breakdownCheck(game)) {
    game.setGameState(new BreakdownState(game))
  } else if (game.moraleChecksNeeded.length > 0) {
    if (state !== stateType.MoraleCheck) {
      game.setGameState(new MoraleCheckState(game))
    }
  } else if (game.sniperNeeded.length > 0) {
    if (state !== stateType.Sniper) {
      game.setGameState(new SniperState(game))
    }
  } else if (game.fireStartCheckNeeded !== undefined) {
    if (state !== stateType.FireStart) {
      game.setGameState(new FireStartState(game))
    }
  } else if (game.routNeeded.length > 0) {
    if (state !== stateType.Rout) {
      game.setGameState(new RoutState(game, false))
    }
    game.routNeeded[0].unit.select()
  } else if (game.routCheckNeeded.length > 0) {
    if (state !== stateType.RoutCheck) {
      game.setGameState(new RoutCheckState(game))
    }
  } else if (game.fireDisplaceNeeded.length > 0) {
    if (state !== stateType.FireDisplace) {
      game.setGameState(new FireDisplaceState(game))
    }
  } else if (initiativeCheck(game)) {
    if (state !== stateType.Initiative) {
      game.setGameState(new InitiativeState(game))
    }
  } else if (reactionFireCheck(game)) {
    if (state !== stateType.Reaction) {
      game.setGameState(new ReactionState(game))
    }
  } else if (game.phase === gamePhaseType.PrepRally) {
    if (state !== stateType.Rally) {
      game.setGameState(new RallyState(game))
    }
  } else if (game.phase === gamePhaseType.PrepPrecip) {
    if (state !== stateType.PrecipCheck) {
      game.setGameState(new PrecipCheckState(game))
    }
  } else if (game.phase === gamePhaseType.CleanupCloseCombat) {
    if (state !== stateType.CloseCombat) {
      game.setGameState(new CloseCombatState(game))
    }
  } else if (game.phase === gamePhaseType.CleanupSmoke) {
    if (state !== stateType.SmokeCheck) {
      game.addSmokeCheckState()
    }
  } else if (game.phase === gamePhaseType.CleanupOverstack) {
    if (state !== stateType.Overstack) {
      game.setGameState(new OverstackState(game))
    }
  } else if (game.phase === gamePhaseType.CleanupFire) {
    if (state !== stateType.FireCheck) {
      game.addFireCheckState()
    }
  } else if (game.phase === gamePhaseType.CleanupWeather) {
    if (state !== stateType.VariableWeather) {
      game.addVariableWindState()
    }
  }
}

export default function actionsAvailable(game: Game, activePlayer: string, active: boolean = true): GameAction[] {
  if (!game.fullySynced || game.needsRectify) { return [{ type: "sync" }] }
  if (game.state === "needs_player") {
    if (game.ownerName === activePlayer || !activePlayer) {
      return [{ type: "none", message: "waiting for player to join" }]
    } else {
      return [{ type: "join" }]
    }
  } else if (game.state === "ready") {
    if (game.ownerName === activePlayer) {
      if (game.playerOneName !== game.playerTwoName) {
        return [{ type: "start" }, { type: "kick" }]
      }
      return [{ type: "start" }]
    } else if (activePlayer &&
      (game.playerOneName === activePlayer || game.playerTwoName === activePlayer)) {
      return [{ type: "leave" }]
    } else {
      return [{ type: "none", message: "waiting for game to start" }]
    }
  }
  if (activePlayer !== game.playerOneName && activePlayer !== game.playerTwoName) {
    if (game.state === "in_progress") {
      return [{ type: "none", message: "game currently in progress" }]
    } if (game.state === "complete") {
      return [{ type: "none", message: "game over" }]
    }
    return []
  }
  if (activePlayer !== game.currentUser) {
    if (game.state === "complete") {
      return [{ type: "none", message: "game over" }]
    }
    return [{ type: "wait", message: currentEnemyAction(game) }] }
  if (game.lastAction?.id === undefined) { return [{ type: "sync" }] }
  const actions: GameAction[] = []
  addUndo(game, activePlayer, actions)
  if (game.state === "complete") {
    return [{ type: "none", message: "game over" }]
  }
  if (active) { setState(game) }

  if (game.phase === gamePhaseType.Deploy) {
    actions.unshift({ type: "deploy" })
    const select = currSelection(game, false)
    if (select !== undefined) {
      actions.push({ type: "undeploy" })
    }
    if (game.gameState?.type === stateType.Deploy) {
      if (game.deployState.canSplit) {
        actions.push({ type: "split_squad" })
      } else if (game.deployState.canJoin) {
        actions.push({ type: "join_squad" })
      }
    }
  } else if (game.phase === gamePhaseType.PrepRally) {
    addRallyActions(game, actions)
  } else if (game.gameState?.type === stateType.PrecipCheck) {
    actions.push({ type: "precip_check" })
  } else if (game.gameState?.type === stateType.FireDisplace) {
    addFireDisplaceActions(game, actions)
  } else if (game.gameState?.type === stateType.FireStart) {
    actions.unshift({ type: "none", message: "check to see if attack starts fire" })
    actions.push({ type: "fire_start_check" })
  } else if (game.phase === gamePhaseType.Main) {
    addMainPhaseActions(game, actions)
  } else if (game.phase === gamePhaseType.CleanupCloseCombat) {
    addCloseCombatActions(game, actions)
  } else if (game.gameState?.type === stateType.Overstack) {
    actions.unshift({ type: "none", message: "overstacked units; select unit to remove" })
    const select = currSelection(game, false)
    if (select) {
      actions.push({ type: "overstack_reduce" })
    }
  } else if (game.gameState?.type === stateType.SmokeCheck) {
    actions.unshift({ type: "none", message: "checking smoke dispersion" })
    actions.push({ type: "smoke_check" })
  } else if (game.gameState?.type === stateType.FireCheck) {
    addFireCheckActions(game, actions)
  } else if (game.gameState?.type === stateType.VariableWeather) {
    actions.unshift({ type: "none", message: "variable weather" })
    actions.push({ type: "weather_check" })
  } else {
    actions.unshift({ type: "none", message: "not implemented yet" })
  }
  return actions
}

function addRallyActions(game: Game, actions: GameAction[]): void {
  actions.unshift({ type: "none", message: "select unit to rally/repair" })
  const select = currSelection(game, false)
  if (select !== undefined) {
    actions.push({ type: "rally" })
  } else {
    actions.push({ type: "rally_pass" })
  }
}

function addMainPhaseActions(game: Game, actions: GameAction[]): void {
  const selection = currSelection(game, false)
  const map = game.scenario.map
  if (game.gameState?.type === stateType.Fire) {
    addFireActions(game, actions, selection)
  } else if (game.gameState?.type === stateType.Move) {
    addMoveActions(game, actions)
  } else if (game.gameState?.type === stateType.Assault) {
    addAssaultActions(game, actions)
  } else if (game.gameState?.type === stateType.Breakdown) {
    actions.push({ type: "breakdown" })
  } else if (game.gameState?.type === stateType.RoutAll) {
      actions.unshift({ type: "none", message: "enemy rout" })
      actions.push({ type: "enemy_rout" })
      actions.push({ type: "cancel_action" })
  } else if (game.gameState?.type === stateType.RoutCheck) {
      actions.push({ type: "rout_check" })
  } else if (game.gameState?.type === stateType.Rout) {
    addRoutActions(game, actions)
  } else if (game.gameState?.type === stateType.MoraleCheck) {
    addMoraleActions(game, actions)
  } else if (game.gameState?.type === stateType.Initiative) {
    actions.unshift({ type: "none", message: "check for" })
    actions.push({ type: "initiative" })
  } else if (game.gameState?.type === stateType.Sniper) {
  actions.unshift({ type: "none", message: "check for" })
    actions.push({ type: "sniper" })
  } else if (game.gameState?.type === stateType.Pass) {
    actions.unshift({ type: "none", message: "are you sure?" })
    actions.push({ type: "pass" })
    actions.push({ type: "pass_cancel" })
  } else if (game.gameState?.type === stateType.Reaction) {
    actions.unshift({ type: "none", message: "reaction fire" })
    if (canReactionFire(selection, map)) { actions.push({ type: "reaction_fire" }) }
    if (canReactionIntensiveFire(selection, map)) { actions.push({ type: "reaction_intensive_fire" }) }
    actions.push({ type: "reaction_pass" })
  } else if (game.gameState?.type === stateType.SquadJoin) {
    actions.unshift({ type: "none", message: "select team to join" })
    if (map.currentSelection.length > 0) {
      actions.push({ type: "join_squad" })
    }
    actions.push({ type: "cancel_action" })
  } else if (!selection) {
    actions.unshift({ type: "none", message: "select units to combine" })
    if (canEnemyRout(map)) { actions.push({ type: "enemy_rout" }) }
    actions.push({ type: "pass" })
  } else {
    if (canFire(selection, map)) { actions.push({ type: "fire" }) }
    if (canIntensiveFire(selection, map)) { actions.push({ type: "intensive_fire" }) }
    if (canMove(selection, map)) { actions.push({ type: "move" }) }
    if (canRush(selection, map)) { actions.push({ type: "rush" }) }
    if (canAssaultMove(selection)) { actions.push({ type: "assault_move" }) }
    if (canRout(selection)) { actions.push({ type: "rout" }) }
    if (canSplit(selection)) { actions.push({ type: "split_squad" }) }
    if (canJoin(selection)) { actions.push({ type: "join_squad" }) }
    actions.push({ type: "unselect" })
  }
}

function addFireDisplaceActions(game: Game, actions: GameAction[]): void {
  actions.unshift({ type: "none", message: "fire displaces unit" })
  if (game.fireDisplaceState.remove || game.fireDisplaceState.path.length > 1) {
    actions.push({ type: "fire_displace_confirm" })
    actions.push({ type: "fire_displace_cancel" })
  } else if (game.fireDisplaceState.availableHexes.length < 1) {
    actions.push({ type: "fire_displace_eliminate" })
  }
}

function addMoraleActions(game: Game, actions: GameAction[]): void {
  const state = game.gameState as BaseState
  const counter = state.selection[0].counter
  const hex = counter.hex as Coordinate
  actions.unshift({
    type: "none",
    message: `${game.nationNameForPlayer(state.player)} ${counter.unit.name} ` +
      `at ${coordinateToLabel(hex)}:`
  })
  actions.push({ type: "morale_check" })
}

function addFireActions(game: Game, actions: GameAction[], selection?: Unit): void {
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
    if (selection?.smokeCapable && (selection.targetedRange || selection.offBoard) &&
        !action.reaction) {
      actions.push({ type: "fire_smoke" })
    }
    if (action.targetHexes.length > 0) {
      actions.push({ type: "fire_finish" })
    }
    actions.push({ type: "cancel_action" })
  } else {
    actions.unshift({ type: "none", message: "error: unexpected missing state" })
  }
}

function addMoveActions(game: Game, actions: GameAction[]): void {
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
      actions.push({ type: "move_undo" })
    }
    actions.push({ type: "cancel_action" })
  } else {
    actions.unshift({ type: "none", message: "error: unexpected missing state" })
  }
}

function addAssaultActions(game: Game, actions: GameAction[]): void {
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
}

function addRoutActions(game: Game, actions: GameAction[]): void {
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
}

function addCloseCombatActions(game: Game, actions: GameAction[]): void {
  const selection = currSelection(game, false)
  if (game.gameState?.type === stateType.CloseCombat) {
    if (selection) {
      if (closeCombatCasualtyNeeded(game)) {
        actions.push({ type: "close_combat_reduce" })
      } else {
        actions.push({ type: "close_combat_select" })
      }
    } else {
      const loc = closeCombatCasualtyNeeded(game)
      if (loc) {
        actions.unshift({ type: "none", message: "select unit to reduce" })
      } else {
        actions.unshift({ type: "none", message: "select close combat to resolve" })
      }
    }
  } else {
    actions.unshift({ type: "none", message: "error: unexpected missing state" })
  }
}

function addFireCheckActions(game: Game, actions: GameAction[]): void {
  if (game.fireOutCheckNeeded.length > 0) {
    actions.unshift({ type: "none", message: "checking if fires extinguish" })
    actions.push({ type: "fire_out_check" })
  } else if (game.fireSpreadCheckNeeded.length > 0) {
    actions.unshift({ type: "none", message: "checking if fires spread" })
    actions.push({ type: "fire_spread_check" })
  }
}

function currentEnemyAction(game: Game): string {
  if (breakdownCheck(game)) {
    return "waiting for opponent breakdown check"
  } else if (game.fireStartCheckNeeded !== undefined) {
    return "waiting for opponent fire check"
  } else if (game.moraleChecksNeeded.length > 0) {
    return "waiting for opponent morale check"
  } else if (game.sniperNeeded.length > 0) {
    return "waiting for opponent sniper check"
  } else if (game.routNeeded.length > 0) {
    return "waiting for opponent to rout unit"
  } else if (game.routCheckNeeded.length > 0) {
    return "waiting for opponent rout check"
  } else if (game.fireDisplaceNeeded.length > 0) {
    return "waiting for opponent move displaced unit"
  } else if (initiativeCheck(game)) {
    return "waiting for opponent initiative check"
  } else if (reactionFireCheck(game, false)) {
    return "waiting for opponent reaction fire"
  } else if (game.phase === gamePhaseType.Deploy) {
    return "waiting for opponent to deploy units"
  } else if (game.phase === gamePhaseType.PrepRally) {
    return "waiting for opponent to attempt to rally units"
  } else if (game.phase === gamePhaseType.PrepPrecip) {
    return "waiting for opponent to check for precipitation"
  } else if (game.gameState?.type === stateType.FireDisplace) {
    return "waiting for opponent to move displaced unit"
  } else if (game.gameState?.type === stateType.FireStart) {
    return "waiting for opponent to move displaced unit"
  } else if (game.phase === gamePhaseType.Main) {
    return "waiting for opponent to take an action"
  } else if (game.phase === gamePhaseType.CleanupCloseCombat) {
    if (closeCombatCasualtyNeeded(game)) {
      return "waiting for opponent to choose unit to reduce"
    }
    return "waiting for opponent to choose close combat to resolve"
  } else if (game.phase === gamePhaseType.CleanupOverstack) {
    return "waiting for opponent to choose overstacked unit to reduce"
  } else if (game.phase === gamePhaseType.CleanupSmoke) {
    return "waiting for opponent to check smoke"
  } else if (game.phase === gamePhaseType.CleanupFire) {
    return "waiting for opponent to check fire"
  } else if (game.phase === gamePhaseType.CleanupWeather) {
    return "waiting for opponent to check weather"
  }
  return "unknown enemy action"
}

function addUndo(game: Game, activePlayer: string, actions: GameAction[]) {
  if (!game.lastAction?.undoPossible) { return }
  if (!game.gameState?.actionInProgress) {
    actions.push({ type: "undo" })
  }
}

function canSplit(unit: Unit): boolean {
  if (unit.pinned || unit.isBroken) { return false }
  if (unit.type !== unitType.Squad) { return false }
  return true
}

function canJoin(unit: Unit): boolean {
  if (unit.pinned || unit.isBroken) { return false }
  if (!unit.isSplit) { return false }
  return true
}

function checkFire(unit: Unit, map: Map): boolean {
  if (unit.isExhausted || unit.isBroken) { return false }
  if (unit.currentFirepower <= 0) { return false }
  if (unit.jammed && !unit.sponson) { return false }
  if (unit.sponson && unit.jammed && unit.sponsonJammed) { return false }
  if (unit.children.length > 0 && unit.children[0].crewed) { return false }
  if (unit.parent && (unit.parent.pinned || unit.parent.isBroken)) { return false }
  if (unit.parent && unit.parent.isVehicle) { return false }
  if (!unit.parent && (unit.operated)) { return false }
  if (contact(unit, map)) { return false }
  return true
}

function canFire(unit: Unit | undefined, map: Map): boolean {
  if (unit === undefined) { return false }
  if (unit.isActivated) { return false }
  return checkFire(unit, map)
}

function canIntensiveFire(unit: Unit | undefined, map: Map): boolean {
  if (unit === undefined) { return false }
  if (!unit.isActivated) { return false }
  if (unit.offBoard || unit.crewed || unit.areaFire) { return false }
  return checkFire(unit, map)
}

function canReactionFire(unit: Unit | undefined, map: Map): boolean {
  if (unit === undefined) { return false }
  if (unit.areaFire) { return false }
  return canFire(unit, map)
}

function canReactionIntensiveFire(unit: Unit | undefined, map: Map): boolean {
  if (unit === undefined) { return false }
  return canIntensiveFire(unit, map)
}

function canMoveAny(unit: Unit): boolean {
  if (unit.type === unitType.SupportWeapon || unit.type === unitType.Gun) { return false }
  if (unit.currentMovement === 0) { return false }
  if (unit.parent) { return false }
  return true
}

function contact(unit: Unit, map: Map): boolean {
  const loc = map.locForId(unit.id)
  if (loc === undefined) { return false }
  return map.contactAt(loc)
}

function canMove(unit: Unit | undefined, map: Map): boolean {
  if (unit === undefined) { return false }
  if (!canMoveAny(unit)) { return false }
  if (contact(unit, map)) { return false }
  if (unit.isActivated || unit.isExhausted || unit.isBroken) { return false }
  return true
}

function canRush(unit: Unit | undefined, map: Map): boolean {
  if (unit === undefined) { return false }
  if (!canMoveAny(unit)) { return false }
  if (contact(unit, map)) { return false }
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
  if (map.game.checkLastSAIsRout(map.game.currentPlayer)) { return false }
  const units = map.allUnits
  for (const u of units) {
    if (u.unit.playerNation !== map.game?.currentPlayerNation && u.unit.isBroken && !u.unit.routed) { return true }
  }
  return false
}