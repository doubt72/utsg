import Game from "../../Game";
import BaseState, { stateType } from "./BaseState";

// Reduction to stack limit
export default class OverstackState extends BaseState {
  constructor(game: Game) {
    super(game, stateType.Pass, game.currentPlayer)
    game.refreshCallback(game)
  }

  finish() {
  }
}
