import Game from "../../Game";
import BaseState, { stateType } from "./BaseState";

// Handle Close Combat
export default class CloseCombatState extends BaseState {
  constructor(game: Game) {
    super(game, stateType.Pass, game.currentPlayer)
    game.refreshCallback(game)
  }

  finish() {
  }
}
