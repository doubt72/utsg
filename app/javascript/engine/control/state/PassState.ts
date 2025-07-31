import Game from "../../Game";
import GameAction from "../../GameAction";
import BaseState, { stateType } from "./BaseState";

export default class PassState extends BaseState {
  constructor(game: Game) {
    super(game, stateType.Pass, game.currentPlayer)
    game.refreshCallback(game)
  }

  finish() {
  const action = new GameAction({
    user: this.game.currentUser,
    player: this.player,
    data: { action: "pass", old_initiative: this.game.initiative },
  }, this.game)
    this.execute(action)
  }
}
