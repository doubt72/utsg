import { formatNation } from "../../utilities/graphics";
import Game from "../Game";
import { GameActionData } from "../GameAction";
import BaseAction from "./BaseAction";

export default class RallyPassAction extends BaseAction {

  constructor(data: GameActionData, game: Game, index: number) {
    super(data, game, index)
  }

  get type(): string { return "rally_pass" }

  get htmlValue(): string {
    return `${formatNation(this.game, this.player)} passed additional rally checks`
  }

  mutateGame(): void {
    ;
  }
}
