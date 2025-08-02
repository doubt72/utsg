import Game from "../../Game";
import BaseState, { stateType } from "./BaseState";

// Handle smoke dispersion
export default class SmokeCheckState extends BaseState {
  constructor(game: Game) {
    super(game, stateType.Pass, game.currentPlayer)
    game.refreshCallback(game)
  }

  finish() {
  }
}
