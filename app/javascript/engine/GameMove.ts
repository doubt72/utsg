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

  get mappedMove(): BaseMove {
    const mapping: { [key: string]: BaseMove } = {
      create: new NullMove(this.data, "game created"),
      start: new NullMove(this.data, "game started"),
      join: new NullMove(this.data, `joined as player ${this.data.player}`),
      leave: new NullMove(this.data, "left game"),
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
    };

    return mapping[this.data.data.action] || new NullMove(this.data, "unhandled move type");
  }
}
