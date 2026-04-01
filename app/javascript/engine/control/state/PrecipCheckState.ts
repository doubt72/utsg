import { rolld10 } from "../../../utilities/utilities";
import Game from "../../Game";
import GameAction from "../../GameAction";
import BaseState, { stateType } from "./BaseState";

// Check for rain/snow before turn
export default class PrecipCheckState extends BaseState {
  constructor(game: Game) {
    super(game, stateType.PrecipCheck, game.currentPlayer)
    game.refreshCallback(game)
  }

  get showOverlays(): boolean {
    return false
  }

  get actionInProgress(): boolean {
    return false
  }

  finish() {
    const action = new GameAction({
      user: this.game.currentUser, player: this.game.currentPlayer,
      data: {
        action: "precipitation_check", old_initiative: this.game.initiative,
        dice_result: [{ result: rolld10() }]
      }
    }, this.game)
    this.execute(action)
  }
}
