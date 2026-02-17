import { Direction, Player, UnitStatus } from "../utilities/commonTypes";
import Game from "./Game";
import BaseAction from "./actions/BaseAction";
import StateAction from "./actions/StateAction";
import PhaseAction from "./actions/PhaseAction";
import DeployAction from "./actions/DeployAction";
import InfoAction from "./actions/InfoAction";
import MoveAction from "./actions/MoveAction";
import BreakdownAction from "./actions/BreakdownAction";
import InitiativeAction from "./actions/InitiativeAction";
import InitiativePassAction from "./actions/InitiativePassAction";
import AssaultMoveAction from "./actions/AssaultAction";
import FireAction from "./actions/FireAction";
import MoraleCheckAction from "./actions/MoraleCheckAction";
import ReactionPassAction from "./actions/PassReactionAction";
import SniperAction from "./actions/SniperAction";
import RouteMoveAction from "./actions/RoutMoveAction";
import RoutCheckAction from "./actions/RoutCheckAction";
import RoutAllAction from "./actions/RoutAllAction";
import CloseCombatStartAction from "./actions/CloseCombatStartAction";
import CloseCombatRollAction from "./actions/CloseCombatRollAction";
import CloseCombatReduceAction from "./actions/CloseCombatReduceAction";
import CloseCombatFinishAction from "./actions/CloseCombatFinishAction";
import PrecipCheckAction from "./actions/PrecipCheckAction";
import { GamePhase } from "./support/gamePhase";

export type GameActionDiceResult = {
  result: number, type: string, description?: string
}

export type GameActionUnit = {
  x: number, y: number, id: string, status: UnitStatus, sponson?: boolean, wire?: boolean
}

export type GameActionReinforcementUnit = {
  turn: number, index: number, id: string,
}

export type GameActionPath = {
  x: number, y: number, facing?: Direction, turret?: Direction,
}

export type GameActionFireData = {
  start: { x: number, y: number, smoke: boolean }[],
  final: { x: number, y: number, smoke: boolean }[],
}

export type GameActionMoveData = {
  mines?: { firepower: number, infantry: boolean, antitank: boolean },
}

export type GameActionMoraleData = {
  mod: number, why: string[], short: boolean,
}

export type GameActionRoutData = {
  mod: number, why: string[],
}

export type GameActionCCData = {
  o_base?: number, t_base?: number, count?: number
}

export type GameActionAddActionType = "smoke" | "drop" | "load" | "vp" | "clear" | "entrench"
export const gameActionAddActionType: { [index: string]: GameActionAddActionType } = {
  Smoke: "smoke", Drop: "drop", Load: "load", VP: "vp", Clear: "clear", Entrench: "entrench",
}
export type GameActionAddAction = {
  type: GameActionAddActionType, x: number, y: number, id?: string, parent_id?: string, facing?: Direction,
  status?: UnitStatus, index: number
}

export type GameActionPhaseChange = {
  old_phase: GamePhase, new_phase: GamePhase, old_turn: number, new_turn: number, new_player: Player,
}

export type GameActionDetails = {
  action: string,
  old_initiative: number;
  message?: string,

  origin?: GameActionUnit[],
  deploy?: GameActionReinforcementUnit[],
  path?: GameActionPath[],
  add_action?: GameActionAddAction[],
  target?: GameActionUnit[],

  dice_result?: GameActionDiceResult[],

  fire_data?: GameActionFireData,
  move_data?: GameActionMoveData,
  morale_data?: GameActionMoraleData,
  rout_check_data?: GameActionRoutData,
  cc_data?: GameActionCCData,
  phase_data?: GameActionPhaseChange,
}

export type GameActionData = {
  id?: number,
  sequence?: number,
  user: string,
  player: number,
  created_at?: string,

  undone?: boolean,

  data: GameActionDetails,
};

export default class GameAction {
  data: GameActionData;
  game: Game;
  index: number;

  constructor(data: GameActionData, game: Game, index?: number) {
    this.data = data
    this.game = game
    this.index = index ? index : this.game.actions.length
  }

  get actionClass(): BaseAction {
    if (this.data.data.action === "info") {
      return new InfoAction(this.data, this.game, this.index);
    }
    if (this.data.data.action === "create") {
      return new StateAction(this.data, this.game, this.index, "game created");
    }
    if (this.data.data.action === "start") {
      return new StateAction(this.data, this.game, this.index, "game started");
    }
    if (this.data.data.action === "join") {
      return new StateAction(this.data, this.game, this.index, `joined as player ${this.data.player}`);
    }
    if (this.data.data.action === "leave") {
      return new StateAction(this.data, this.game, this.index, "left game");
    }
    if (this.data.data.action === "resign") {
      return new StateAction(this.data, this.game, this.index, "resigned game");
    }
    if (this.data.data.action === "phase") {
      return new PhaseAction(this.data, this.game, this.index)
    }
    if (this.data.data.action === "deploy") {
      return new DeployAction(this.data, this.game, this.index);
    }
    if (this.data.data.action === "precipitation_check") {
      return new PrecipCheckAction(this.data, this.game, this.index);
    }
    if (this.data.data.action === "initiative") {
      return new InitiativeAction(this.data, this.game, this.index);
    }
    if (this.data.data.action === "pass") {
      return new InitiativePassAction(this.data, this.game, this.index);
    }
    if (this.data.data.action === "fire") {
      return new FireAction(this.data, this.game, this.index, false, false);
    }
    if (this.data.data.action === "intensive_fire") {
      return new FireAction(this.data, this.game, this.index, true, false);
    }
    if (this.data.data.action === "reaction_fire") {
      return new FireAction(this.data, this.game, this.index, false, true);
    }
    if (this.data.data.action === "reaction_intensive_fire") {
      return new FireAction(this.data, this.game, this.index, true, true);
    }
    if (this.data.data.action === "reaction_pass") {
      return new ReactionPassAction(this.data, this.game, this.index);
    }
    if (this.data.data.action === "morale_check") {
      return new MoraleCheckAction(this.data, this.game, this.index);
    }
    if (this.data.data.action === "sniper") {
      return new SniperAction(this.data, this.game, this.index);
    }
    if (this.data.data.action === "move") {
      return new MoveAction(this.data, this.game, this.index, false);
    }
    if (this.data.data.action === "rush") {
      return new MoveAction(this.data, this.game, this.index, true);
    }
    if (this.data.data.action === "assault_move") {
      return new AssaultMoveAction(this.data, this.game, this.index);
    }
    if (this.data.data.action === "rout_all") {
      return new RoutAllAction(this.data, this.game, this.index);
    }
    if (this.data.data.action === "rout_check") {
      return new RoutCheckAction(this.data, this.game, this.index);
    }
    if (this.data.data.action === "rout_move") {
      return new RouteMoveAction(this.data, this.game, this.index, false);
    }
    if (this.data.data.action === "rout_self") {
      return new RouteMoveAction(this.data, this.game, this.index, true);
    }
    if (this.data.data.action === "breakdown") {
      return new BreakdownAction(this.data, this.game, this.index);
    }
    if (this.data.data.action === "close_combat_start") {
      return new CloseCombatStartAction(this.data, this.game, this.index);
    }
    if (this.data.data.action === "close_combat_roll") {
      return new CloseCombatRollAction(this.data, this.game, this.index);
    }
    if (this.data.data.action === "close_combat_reduce") {
      return new CloseCombatReduceAction(this.data, this.game, this.index);
    }
    if (this.data.data.action === "close_combat_finish") {
      return new CloseCombatFinishAction(this.data, this.game, this.index);
    }

    // rally check
    // pass rally phase
    // cleanup unit

    return new StateAction(this.data, this.game, this.index, "unhandled action type");
  }
}
