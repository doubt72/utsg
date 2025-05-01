import Game from "../Game";
import { GameMoveData } from "../GameMove";
import BaseMove from "./BaseMove";

export default class InfoMove extends BaseMove {
  message: string;

  constructor(data: GameMoveData, game: Game, index: number) {
    super(data, game, index)

    this.validate(data.data.message)

    this.message = data.data.message as string
  }

  get type(): string { return "info" }

  get stringValue(): string {
    return this.message
  }

  get undoPossible() {
    return this.game.previousMoveUndoPossible(this.index)
  }

  mutateGame(): void {
    // does nothing
  }
  
  undo(): void {
    // does nothing
    this.undone = true;
  }

  get lastUndoCascade(): boolean { return true }
}
