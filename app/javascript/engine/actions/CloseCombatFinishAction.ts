import Game from "../Game";
import { GameActionData } from "../GameAction";
import BaseAction from "./BaseAction";

export default class CloseCombatFinishAction extends BaseAction {
  constructor(data: GameActionData, game: Game, index: number) {
    super(data, game, index)
  }

  get type(): string { return "close_combat_finish" }

  get stringValue(): string {
    return this.data.count ? "close combat complete" : "skipping: no combat to resolve"
  }

  get undoPossible() {
    return false
  }

  mutateGame(): void {
    this.game.closeNeeded = []
  }
}
