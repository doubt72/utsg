import { Direction, Player, UnitStatus, WindType } from "../utilities/commonTypes";
import Game from "./Game";
import BaseAction from "./actions/BaseAction";
import StateAction from "./actions/StateAction";
import PhaseAction from "./actions/PhaseAction";
import DeployAction from "./actions/DeployAction";
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
import CloseCombatRollAction from "./actions/CloseCombatRollAction";
import CloseCombatReduceAction from "./actions/CloseCombatReduceAction";
import PrecipCheckAction from "./actions/PrecipCheckAction";
import { GamePhase } from "./support/gamePhase";
import RallyAction from "./actions/RallyAction";
import RallyPassAction from "./actions/RallyPassAction";
import OverstackReduceAction from "./actions/OverstackReduceAction";
import SmokeCheckAction from "./actions/SmokeCheckAction";
import FireOutAction from "./actions/FireOutAction";
import FireSpreadAction from "./actions/FireSpreadAction";
import StatusUpdateAction from "./actions/StatusUpdateAction";
import WindDirectionAction from "./actions/WindDirectionAction";
import WindSpeedAction from "./actions/WindSpeedAction";
import FireDisplaceAction from "./actions/FireDisplaceAction";
import FireStartAction from "./actions/FireStartAction";
import { DiceResult } from "../utilities/utilities";
import { formatNation } from "../utilities/graphics";
import UndeployAction from "./actions/UndeployAction";
import DeploySplitAction from "./actions/DeploySplitAction";
import DeployJoinAction from "./actions/DeployJoinAction";
import SquadJoinAction from "./actions/SquadJoinAction";
import SquadSplitAction from "./actions/SquadSplitAction";

export type GameActionDiceResult = {
  result: DiceResult, description?: string
}

export type GameActionUnit = {
  x: number, y: number, id: string, name: string, status: UnitStatus, new_status?: UnitStatus,
  sponson?: boolean, wire?: boolean, parent?: string, children?: string[], unpin?: boolean, unrout?: boolean,
  vehicle?: boolean,
}

export type GameActionFeature = {
  x: number, y: number, id: string, name: string
}

export type GameActionReinforcementUnit = {
  turn: number, key: string, id: string, name: string,
}

export type GameActionPath = {
  x: number, y: number, facing?: Direction, turret?: Direction,
}

export type GameActionRallyData = {
  infantry?: {
    morale_base: number,
    leader_mod: number,
    terrain_mod: number,
    next_to_enemy: boolean,
  },
  weapon?: {
    break_roll: number,
    fix_roll: number,
  },
  free_rally: boolean,
}

export type GameActionFireData = {
  start: { x: number, y: number, smoke: boolean }[],
  final: { x: number, y: number, smoke: boolean }[],
  moveSeq?: number,
  drift?: boolean,
}

export type GameActionFireStartData = {
  vehicle: boolean, incendiary: boolean, vehicle_incendiary: boolean,
}

export type GameActionMoveData = {
  mines?: {
    firepower: number, infantry: boolean, antitank: boolean, is_vehicle: boolean, is_armored: boolean,
    lowest_armor: number,
  },
}

export type GameActionMoraleData = {
  mod: number, why: string[], short: boolean,
}

export type GameActionRoutData = {
  mod: number, why: string[],
}

export type GameActionCCData = {
  p1_fp?: number, p2_fp?: number, count?: number, p1_max?: number, p2_max?: number,
}

export type GameActionAddActionType = "smoke" | "drop" | "load" | "vp" | "clear" | "entrench"
export const gameActionAddActionType: { [index: string]: GameActionAddActionType } = {
  Smoke: "smoke", Drop: "drop", Load: "load", VP: "vp", Clear: "clear", Entrench: "entrench",
}
export type GameActionAddAction = {
  type: GameActionAddActionType, x: number, y: number, id?: string, name?: string,
  parent_id?: string, parent_name?: string, facing?: Direction, status?: UnitStatus, index: number,
}

export type GameActionPhaseChange = {
  old_phase: GamePhase, new_phase: GamePhase, old_turn: number, new_turn: number,
  new_player: Player, messages: string[],
}

export type GameActionWindData = {
  speed: WindType,
}

export type GameActionBreakdowndData = {
  breakdown_roll: number,
}

export type GameActionDetails = {
  action: string,
  old_initiative: number;
  message?: string,

  origin?: GameActionUnit[],
  deploy?: GameActionReinforcementUnit[],
  path?: GameActionPath[],
  add_action?: GameActionAddAction[],
  target?: GameActionUnit[] | GameActionFeature[],

  dice_result?: GameActionDiceResult[],

  rally_data?: GameActionRallyData,
  fire_data?: GameActionFireData,
  fire_start_data?: GameActionFireStartData,
  move_data?: GameActionMoveData,
  breakdown_data?: GameActionBreakdowndData,
  morale_data?: GameActionMoraleData,
  rout_check_data?: GameActionRoutData,
  cc_data?: GameActionCCData,
  phase_data?: GameActionPhaseChange,
  wind_data?: GameActionWindData,
}

export type GameActionData = {
  id?: number,
  sequence?: number,
  user: string,
  player: Player,
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
    if (this.data.data.action === "create") {
      return new StateAction(this.data, this.game, this.index, "game created");
    } else if (this.data.data.action === "start") {
      return new StateAction(this.data, this.game, this.index, "game started");
    } else if (this.data.data.action === "join") {
      return new StateAction(
        this.data, this.game, this.index, `joined as ${formatNation(this.game, this.data.player)} player`
      );
    } else if (this.data.data.action === "leave") {
      return new StateAction(this.data, this.game, this.index, "left game");
    } else if (this.data.data.action === "kick") {
      return new StateAction(this.data, this.game, this.index, "kicked player out of game");
    } else if (this.data.data.action === "resign") {
      return new StateAction(this.data, this.game, this.index, "resigned game");
    } else if (this.data.data.action === "finish") {
      return new StateAction(this.data, this.game, this.index, "last turn complete, game over");
    } else if (this.data.data.action === "phase") {
      return new PhaseAction(this.data, this.game, this.index)
    } else if (this.data.data.action === "deploy") {
      return new DeployAction(this.data, this.game, this.index);
    } else if (this.data.data.action === "undeploy") {
      return new UndeployAction(this.data, this.game, this.index);
    } else if (this.data.data.action === "deploy_split_squad") {
      return new DeploySplitAction(this.data, this.game, this.index);
    } else if (this.data.data.action === "deploy_join_squad") {
      return new DeployJoinAction(this.data, this.game, this.index);
    } else if (this.data.data.action === "squad_split") {
      return new SquadSplitAction(this.data, this.game, this.index);
    } else if (this.data.data.action === "squad_join") {
      return new SquadJoinAction(this.data, this.game, this.index);
    } else if (this.data.data.action === "rally") {
      return new RallyAction(this.data, this.game, this.index);
    } else if (this.data.data.action === "rally_pass") {
      return new RallyPassAction(this.data, this.game, this.index);
    } else if (this.data.data.action === "precipitation_check") {
      return new PrecipCheckAction(this.data, this.game, this.index);
    } else if (this.data.data.action === "initiative") {
      return new InitiativeAction(this.data, this.game, this.index);
    } else if (this.data.data.action === "pass") {
      return new InitiativePassAction(this.data, this.game, this.index);
    } else if (this.data.data.action === "fire") {
      return new FireAction(this.data, this.game, this.index, false, false);
    } else if (this.data.data.action === "intensive_fire") {
      return new FireAction(this.data, this.game, this.index, true, false);
    } else if (this.data.data.action === "reaction_fire") {
      return new FireAction(this.data, this.game, this.index, false, true);
    } else if (this.data.data.action === "reaction_intensive_fire") {
      return new FireAction(this.data, this.game, this.index, true, true);
    } else if (this.data.data.action === "fire_start") {
      return new FireStartAction(this.data, this.game, this.index);
    } else if (this.data.data.action === "reaction_pass") {
      return new ReactionPassAction(this.data, this.game, this.index);
    } else if (this.data.data.action === "morale_check") {
      return new MoraleCheckAction(this.data, this.game, this.index);
    } else if (this.data.data.action === "sniper") {
      return new SniperAction(this.data, this.game, this.index);
    } else if (this.data.data.action === "move") {
      return new MoveAction(this.data, this.game, this.index, false);
    } else if (this.data.data.action === "rush") {
      return new MoveAction(this.data, this.game, this.index, true);
    } else if (this.data.data.action === "assault_move") {
      return new AssaultMoveAction(this.data, this.game, this.index);
    } else if (this.data.data.action === "rout_all") {
      return new RoutAllAction(this.data, this.game, this.index);
    } else if (this.data.data.action === "rout_check") {
      return new RoutCheckAction(this.data, this.game, this.index);
    } else if (this.data.data.action === "rout_move") {
      return new RouteMoveAction(this.data, this.game, this.index, false);
    } else if (this.data.data.action === "rout_self") {
      return new RouteMoveAction(this.data, this.game, this.index, true);
    } else if (this.data.data.action === "breakdown") {
      return new BreakdownAction(this.data, this.game, this.index);
    } else if (this.data.data.action === "close_combat_roll") {
      return new CloseCombatRollAction(this.data, this.game, this.index);
    } else if (this.data.data.action === "close_combat_reduce") {
      return new CloseCombatReduceAction(this.data, this.game, this.index);
    } else if (this.data.data.action === "overstack_reduce") {
      return new OverstackReduceAction(this.data, this.game, this.index);
    } else if (this.data.data.action === "status_update") {
      return new StatusUpdateAction(this.data, this.game, this.index);
    } else if (this.data.data.action === "smoke_check") {
      return new SmokeCheckAction(this.data, this.game, this.index);
    } else if (this.data.data.action === "fire_out_check") {
      return new FireOutAction(this.data, this.game, this.index);
    } else if (this.data.data.action === "fire_spread_check") {
      return new FireSpreadAction(this.data, this.game, this.index);
    } else if (this.data.data.action === "wind_direction") {
      return new WindDirectionAction(this.data, this.game, this.index);
    } else if (this.data.data.action === "wind_speed") {
      return new WindSpeedAction(this.data, this.game, this.index);
    } else if (this.data.data.action === "fire_displace") {
      return new FireDisplaceAction(this.data, this.game, this.index);
    } else {
      return new StateAction(this.data, this.game, this.index, "unhandled action type");
    }
  }
}
