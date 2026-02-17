import { rolld10 } from "../../../utilities/utilities";
import Game from "../../Game";
import GameAction from "../../GameAction";
import BaseState, { stateType } from "./BaseState";

// Check for rain/snow before turn
export default class PrecipCheckState extends BaseState {
  constructor(game: Game) {
    super(game, stateType.Pass, game.currentPlayer)
    game.refreshCallback(game)
  }

  finish() {
    const dice = [{ result: rolld10(), type: "d10" }]
    const action = new GameAction({
      user: this.game.currentUser, player: this.game.currentPlayer,
      data: {
        action: "precipitation_check", old_initiative: this.game.initiative,
        dice_result: dice
      }
    }, this.game)
    this.execute(action)
  }
}
