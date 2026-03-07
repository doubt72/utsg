import Game from "../Game";
import { GameActionData } from "../GameAction";
import BaseAction from "./BaseAction";

export default class ReactionPassAction extends BaseAction {
  constructor(data: GameActionData, game: Game, index: number) {
    super(data, game, index)
  }

  get type(): string { return "reaction_pass" }

  get stringValue(): string {
    return `${this.game.nationNameForPlayer(this.player)} reaction fire skipped by player`
  }

  get undoPossible() {
    return false
  }

  mutateGame(): void {
    this.game.clearGameState()
  }
}
