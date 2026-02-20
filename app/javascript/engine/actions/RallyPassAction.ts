import Game from "../Game";
import { GameActionData } from "../GameAction";
import BaseAction from "./BaseAction";

export default class RallyPassAction extends BaseAction {

  constructor(data: GameActionData, game: Game, index: number) {
    super(data, game, index)
  }

  get type(): string { return "rally_pass" }

  get stringValue(): string {
    return `${this.game.nationNameForPlayer(this.player)} passed additional rally checks`
  }

  mutateGame(): void {
    ;
  }
}
