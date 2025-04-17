import Game from "../Game";
import { GameMoveData } from "../GameMove";
import BaseMove from "./BaseMove";

export class NullMove extends BaseMove {
  description: string;

  constructor(data: GameMoveData, description: string) {
    super(data)
    this.description = description
  }

  get stringValue() {
    return this.description
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  mutateGame(_game: Game): void {
    // do nothing
  }
}
