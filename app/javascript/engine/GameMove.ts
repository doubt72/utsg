import { Direction, Player } from "../utilities/commonTypes";
import Game, { GamePhase } from "./Game";
import BaseMove from "./moves/BaseMove";
import StateMove from "./moves/StateMove";
import PhaseMove from "./moves/PhaseMove";
import DeployMove from "./moves/DeployMove";
import InfoMove from "./moves/InfoMove";
import MoveMove from "./moves/MoveMove";

export type GameMoveDiceResult = {
  // TODO: flesh out as necessary
  result: number;
}

export type GameMoveActionUnit = {
  x: number, y: number, id: string,
}

export type GameMoveReinforcementUnit = {
  turn: number, index: number, id: string,
}

export type GameMoveActionPath = {
  x: number, y: number, facing?: Direction, turret?: Direction,
}

export type addActionType = "smoke" | "shortdrop" | "load"
export type GameMoveAddAction = {
  type: addActionType, x: number, y: number, id?: string, parent_id?: string,
}

export type GameMovePhaseChange = {
  old_phase: GamePhase, new_phase: GamePhase, old_turn: number, new_turn: number, new_player: Player,
}

export type GameMoveDetails = {
  action: string,
  message?: string,

  deploy?: GameMoveReinforcementUnit[],
  origin?: GameMoveActionUnit[],
  path?: GameMoveActionPath[],

  target?: GameMoveActionUnit[],
  add_action?: GameMoveAddAction[],

  dice_result?: GameMoveDiceResult[],

  phase_data?: GameMovePhaseChange,
}

export type GameMoveData = {
  id?: number,
  sequence?: number,
  user: string,
  player: number,
  created_at?: string,

  undone?: boolean,

  data: GameMoveDetails,
};

export default class GameMove {
  data: GameMoveData;
  game: Game;
  index: number;

  constructor(data: GameMoveData, game: Game, index: number) {
    this.data = data
    this.game = game
    this.index = index
  }

  get moveClass(): BaseMove {
    if (this.data.data.action === "info") {
      return new InfoMove(this.data, this.game, this.index);
    }
    if (this.data.data.action === "create") {
      return new StateMove(this.data, this.game, this.index, "game created");
    }
    if (this.data.data.action === "start") {
      return new StateMove(this.data, this.game, this.index, "game started");
    }
    if (this.data.data.action === "join") {
      return new StateMove(this.data, this.game, this.index, `joined as player ${this.data.player}`);
    }
    if (this.data.data.action === "leave") {
      return new StateMove(this.data, this.game, this.index, "left game");
    }
    if (this.data.data.action === "phase") {
      return new PhaseMove(this.data, this.game, this.index)
    }
    if (this.data.data.action === "deploy") {
      return new DeployMove(this.data, this.game, this.index);
    }
    if (this.data.data.action === "move") {
      return new MoveMove(this.data, this.game, this.index);
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

    return new StateMove(this.data, this.game, this.index, "unhandled move type");
  }
}
