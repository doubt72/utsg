import { Coordinate } from "../utilities/commonTypes";
import BaseMove from "./moves/BaseMove";
import NullMove from "./moves/NullMove";
import PlacementMove from "./moves/PlacementMove";

export type DiceResult = {
  rawResult: number;
  adjustment: number;
}

export type GameMoveData = {
  id: number; // TODO: not sure this is a number?
  user: number;
  player: number;
  created_at: string;
  data: {
    action: string;
    origin?: Coordinate;
    originIndex?: number;
    target?: Coordinate;
    targetIndex?: number;
    path?: Coordinate[];
    diceResult?: DiceResult;
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
    if (this.data.data.action === "placement") {
      return new PlacementMove(this.data);
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
