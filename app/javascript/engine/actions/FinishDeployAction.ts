import { formatNation } from "../../utilities/graphics";
import Game from "../Game";
import { GameActionData } from "../GameAction";
import BaseAction from "./BaseAction";

export default class FinishDeployAction extends BaseAction {
  constructor(data: GameActionData, game: Game, index: number) {
    super(data, game, index)
  }

  get type(): string { return "finish_deploy" }

  get htmlValue(): string {
    return `${formatNation(this.game, this.player)} player finished deployment`
  }

  get undoPossible() { return true }

  mutateGame(): void {
    // Does nothing
  }

  undo(): void {
    // Does nothing
  }
}
