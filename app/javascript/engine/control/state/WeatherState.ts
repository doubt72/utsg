import Game from "../../Game";
import BaseState, { stateType } from "./BaseState";

// Handle variable weather, wind changes, etc.
export default class WeatherState extends BaseState {
  constructor(game: Game) {
    super(game, stateType.Pass, game.currentPlayer)
    game.refreshCallback(game)
  }

  finish() {
  }
}
