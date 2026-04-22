import select from "../../engine/control/select";
import AssaultState from "../../engine/control/state/AssaultState";
import { stateType } from "../../engine/control/state/BaseState";
import FireState from "../../engine/control/state/FireState";
import MoveState from "../../engine/control/state/MoveState";
import RoutState from "../../engine/control/state/RoutState";
import Game from "../../engine/Game";
import { CounterSelectionTarget } from "../../utilities/commonTypes";

export function executeContextAction(
  game: Game, target: CounterSelectionTarget | undefined, type: string, callback: () => void
) {
  if (type === "select" && target) {
    select(game.scenario.map, target, callback)
  } else if ([
    "rally", "repair", "fire_finish", "move_finish", "assault_move_finish", "morale_check",
    "rout_check", "rout_eliminate", "breakdown", "overstack_reduce", "enemy_rout",
    "smoke_check", "fire_out_check", "fire_spread_check", "fire_displace_confirm"
  ].includes(type)) {
    game.gameState?.finish()
    game.closeOverlay = true
  } else if (type === "reaction_fire" || type === "reaction_intensive_fire") {
    game.setGameState(new FireState(game, true))
  } else if (type === "fire" || type === "intensive_fire") {
    game.setGameState(new FireState(game, false))
  } else if (type === "fire_toggle_sponson") {
    game.fireState.sponsonToggle()
  } else if (type === "fire_smoke") {
    game.fireState.smokeToggle()
  } else if (type === "move" || type === "rush") {
    game.setGameState(new MoveState(game))
  } else if (type === "join_squad") {
    game.join()
  } else if (type === "split_squad") {
    game.split()
  } else if (type === "move_undo") {
    game.moveState.unmove()
  } else if (type === "move_rotate_toggle") {
    game.moveState.rotateToggle()
  } else if (type === "move_shortdrop_toggle") {
    game.moveState.dropToggle()
  } else if (type === "move_load_toggle") {
    game.moveState.loadToggle()
  } else if (type === "move_smoke_toggle") {
    game.moveState.smokeToggle()
    game.closeOverlay = true
  } else if (type === "assault_move") {
    game.setGameState(new AssaultState(game))
  } else if (type === "assault_move_clear") {
    game.assaultState.clear()
  } else if (type === "assault_move_entrench") {
    game.assaultState.entrench()
  } else if (type === "finish_multiselect") {
    if (game.gameState?.type === stateType.Fire) { game.fireState.doneSelect = true }
    if (game.gameState?.type === stateType.Move) { game.moveState.doneSelect = true }
    if (game.gameState?.type === stateType.Assault) { game.assaultState.doneSelect = true }
    game.closeOverlay = true
  } else if (type === "finish_rotation") {
    game.fireState.doneRotating = true
  } else if (type === "cancel_action") {
    game.cancelAction()
  } else if (type === "rout") {
    game.setGameState(new RoutState(game, true))
  } else if (type === "close_combat_select") {
    game.closeCombatState.rollForCombat()
  } else if (type === "close_combat_reduce") {
    game.closeCombatState.reduceUnit()
  } else if (type === "fire_displace_eliminate") {
    if (game.fireDisplaceState.availableHexes.length > 0) {
      game.fireDisplaceState.remove = true
    } else {
      game.gameState?.finish()
    }
  } else if (type === "fire_displace_cancel") {
    game.fireDisplaceState.cancel()
  } else if (type === "undeploy") {
    game.undeploy()
  }
}

export function translateAction(game: Game, target: CounterSelectionTarget | undefined, action: string): string {
  let rc = {
    select: "select",
    join_squad: "join teams",
    split_squad: "split squad",
    rally: "rally",
    reaction_fire: "reaction fire",
    reaction_intensive_fire: "int react fire",
    fire: "fire",
    fire_finish: "done fire",
    fire_toggle_sponson: "toggle sponson",
    fire_smoke: "smoke", // or cancel smoke
    intensive_fire: "intensive fire",
    morale_check: "check morale",
    move: "move",
    move_undo: "undo move",
    move_finish: "done move",
    move_rotate_toggle: "toggle rotate",
    move_shortdrop_toggle: "drop unit", // or cancel drop
    move_load_toggle: "load unit", // or cancel load
    move_smoke_toggle: "smoke", // or cancel smoke
    breakdown: "check breakdown",
    rush: "rush",
    assault_move: "assault move",
    assault_move_finish: "done move",
    assault_move_clear: "clear",
    assault_move_entrench: "entrench",
    finish_multiselect: "done select",
    finish_rotation: "done rotate",
    cancel_action: "cancel",
    rout: "rout",
    enemy_rout: "confirm",
    rout_eliminate: "eliminate",
    rout_check: "check rout",
    close_combat_select: "start combat",
    close_combat_reduce: "take hit",
    overstack_reduce: "eliminate",
    smoke_check: "check",
    fire_out_check: "check",
    fire_spread_check: "check",
    fire_displace_eliminate: "eliminate",
    fire_displace_confirm: "displace",
    fire_displace_cancel: "cancel",
    undeploy: "undeploy",
  }[action] ?? "unknown"
  if (action === "select" && target &&
      (target.counter.unit.selected || target.counter.unit.targetSelected)) { rc = "unselect" }
  if ((action === "fire_smoke" && game.fireState.smoke) ||
      (action === "move_smoke_toggle" && game.moveState.smoke)) {
    rc = "cancel smoke"
  }
  if (action === "drop unit" && game.moveState.dropping) { rc = "cancel drop" }
  if (action === "load unit" && game.moveState.loading) { rc = "cancel load" }
  return rc
}