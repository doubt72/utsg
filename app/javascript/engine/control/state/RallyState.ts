import Game from "../../Game";
import BaseState, { stateType } from "./BaseState";

// Rally/fix weapons
export default class RallyState extends BaseState {
  constructor(game: Game) {
    super(game, stateType.Pass, game.currentPlayer)
    game.refreshCallback(game)
  }

  finish() {
  }
}
