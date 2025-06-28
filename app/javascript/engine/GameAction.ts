import { Direction, Player, UnitStatus } from "../utilities/commonTypes";
import Game, { GamePhase } from "./Game";
import BaseAction from "./actions/BaseAction";
import StateAction from "./actions/StateAction";
import PhaseAction from "./actions/PhaseAction";
import DeployAction from "./actions/DeployAction";
import InfoAction from "./actions/InfoAction";
import MoveAction from "./actions/MoveAction";

export type GameActionDiceResult = {
  // TODO: flesh out as necessary
  result: number;
}

export type GameActionUnit = {
  x: number, y: number, id: string, status: UnitStatus,
}

export type GameActionReinforcementUnit = {
  turn: number, index: number, id: string,
}

export type GameActionPath = {
  x: number, y: number, facing?: Direction, turret?: Direction,
}

export type AddActionType = "smoke" | "drop" | "load" | "vp"
export const addActionType: { [index: string]: AddActionType } = {
  Smoke: "smoke", Drop: "drop", Load: "load", VP: "vp",
}
export type AddAction = {
  type: AddActionType, x: number, y: number, id?: string, parent_id?: string,
}

export type GameActionPhaseChange = {
  old_phase: GamePhase, new_phase: GamePhase, old_turn: number, new_turn: number, new_player: Player,
}

export type GameActionDetails = {
  action: string,
  message?: string,

  deploy?: GameActionReinforcementUnit[],
  origin?: GameActionUnit[],
  path?: GameActionPath[],

  target?: GameActionUnit[],
  add_action?: AddAction[],

  dice_result?: GameActionDiceResult[],

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

  constructor(data: GameActionData, game: Game, index: number) {
    this.data = data
    this.game = game
    this.index = index
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
    if (this.data.data.action === "phase") {
      return new PhaseAction(this.data, this.game, this.index)
    }
    if (this.data.data.action === "deploy") {
      return new DeployAction(this.data, this.game, this.index);
    }
    if (this.data.data.action === "move") {
      return new MoveAction(this.data, this.game, this.index);
    }

    // check initiative
    // rally check
    // pass rally phase
    // fire
    // intensive fire
    // opportunity fire
    // intense opportunity fire
    // rush
    // assault move
    // rout
    // reaction fire
    // pass main phase
    // cleanup unit
    // close combat

    return new StateAction(this.data, this.game, this.index, "unhandled action type");
  }
}
