import Game from "../Game";
import { GameMoveData } from "../GameMove";
import BaseMove from "./BaseMove";

export default class NullMove extends BaseMove {
  description: string;

  constructor(data: GameMoveData, game: Game, index: number, description: string) {
    super(data, game, index)
    this.description = description
  }

  get stringValue() {
    return this.description
  }

  mutateGame(): void {
    // do nothing
  }
}
