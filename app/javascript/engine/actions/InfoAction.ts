import Game from "../Game";
import { GameActionData } from "../GameAction";
import BaseAction from "./BaseAction";

export default class InfoAction extends BaseAction {
  message: string;

  constructor(data: GameActionData, game: Game, index: number) {
    super(data, game, index)

    this.validate(data.data.message)

    this.message = data.data.message as string
  }

  get type(): string { return "info" }

  get stringValue(): string {
    return this.message
  }

  get undoPossible() {
    return this.game.previousActionUndoPossible(this.index)
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
