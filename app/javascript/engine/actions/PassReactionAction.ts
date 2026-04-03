import { formatNation } from "../../utilities/graphics";
import Game from "../Game";
import { GameActionData } from "../GameAction";
import BaseAction from "./BaseAction";

export default class ReactionPassAction extends BaseAction {
  constructor(data: GameActionData, game: Game, index: number) {
    super(data, game, index)
  }

  get type(): string { return "reaction_pass" }

  get htmlValue(): string {
    if (this.data.message) { return this.data.message }
    return `${formatNation(this.game, this.player)} reaction fire skipped by player`
  }

  get undoPossible() {
    return true
  }

  mutateGame(): void {
    this.game.resetCurrentPlayer()
    this.game.clearGameState()
  }

  undo(): void {
    this.game.setCurrentPlayer(this.player)
    this.game.clearGameState()
  }
}
