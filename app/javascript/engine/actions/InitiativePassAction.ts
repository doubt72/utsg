import Game from "../Game";
import { GameActionData } from "../GameAction";
import BaseAction from "./BaseAction";
import IllegalActionError from "./IllegalActionError";

export default class InitiativePassAction extends BaseAction {
  constructor(data: GameActionData, game: Game, index: number) {
    super(data, game, index)
  }

  get type(): string { return "pass" }

  get stringValue(): string {
    return `${this.game.nationNameForPlayer(this.player)} passes initiative`
  }

  get undoPossible() {
    return false
  }

  mutateGame(): void {
    this.game.togglePlayer()
    this.game.updateInitiative(1)
  }
  
  undo(): void {
    throw new IllegalActionError("internal error undoing initiative pass")
  }
}
