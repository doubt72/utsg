import Game from "../../Game";
import BaseState, { stateType } from "./BaseState";

// Check for rain/snow before turn
export default class PrecipCheckState extends BaseState {
  constructor(game: Game) {
    super(game, stateType.Pass, game.currentPlayer)
    game.refreshCallback(game)
  }

  finish() {
  }
}
