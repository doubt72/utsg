import Game from "../../Game";
import BaseState, { stateType } from "./BaseState";

// Update Unit Status
export default class StatusUpdateState extends BaseState {
  constructor(game: Game) {
    super(game, stateType.Pass, game.currentPlayer)
    game.refreshCallback(game)
  }

  finish() {
  }
}
