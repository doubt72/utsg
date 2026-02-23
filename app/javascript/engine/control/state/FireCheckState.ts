import Game from "../../Game";
import BaseState, { stateType } from "./BaseState";

// Handle fire spreading/extinguish
export default class FireCheckState extends BaseState {
  constructor(game: Game) {
    super(game, stateType.FireCheck, game.currentPlayer)
    game.refreshCallback(game)
  }

  finish() {
  }
}
