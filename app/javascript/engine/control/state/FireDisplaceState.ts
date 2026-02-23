import Game from "../../Game";
import BaseState, { stateType } from "./BaseState";

// When units are displaced and need to choose a new spot
export default class FireDisplaceState extends BaseState {
  constructor(game: Game) {
    super(game, stateType.FireDisplace, game.currentPlayer)
    game.refreshCallback(game)
  }

  finish() {
  }
}
