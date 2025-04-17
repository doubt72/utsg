import BaseMove from "./moves/BaseMove";
import { NullMove } from "./moves/NullMove";

export type GameMoveData = {
  id: number; // TODO: not sure this is a number?
  user: number;
  player: number;
  created_at: string;
  data: {
    action: string;
  };
};

export default class GameMove {
  data: GameMoveData;

  constructor(data: GameMoveData) {
    this.data = data;
  }

  get moveClass(): BaseMove {
    if (this.data.data.action === "create") {
      return new NullMove(this.data, "game created");
    }
    if (this.data.data.action === "start") {
      return new NullMove(this.data, "game started");
    }
    if (this.data.data.action === "join") {
      return new NullMove(this.data, `joined as player ${this.data.player}`);
    }
    if (this.data.data.action === "leave") {
      return new NullMove(this.data, "left game");
    }

    // place marker
    // check initiative
    // rally check
    // pass rally phase
    // fire
    // intensive fire
    // opportunity fire
    // intense opportunity fire
    // move
    // rush
    // assault move
    // rout
    // reaction fire
    // pass main phase
    // cleanup unit
    // close combat

    return new NullMove(this.data, "unhandled move type");
  }
}
