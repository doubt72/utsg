import { rolld10 } from "../../../utilities/utilities";
import Game from "../../Game";
import GameAction from "../../GameAction";
import BaseState, { stateType } from "./BaseState";

// Handle variable weather, wind changes, etc.
export default class WeatherState extends BaseState {
  constructor(game: Game) {
    super(game, stateType.VariableWeather, game.currentPlayer)
    game.refreshCallback(game)
  }

  get actionInProgress(): boolean {
    return false
  }

  finish() {
    if (this.game.checkWindDirection) {
      const action = new GameAction({
        user: this.game.currentUser, player: this.player,
        data: {
          action: "wind_direction",
          wind_data: { speed: this.game.scenario.map.windSpeed },
          dice_result: [{ result: rolld10() }],
          old_initiative: this.game.initiative,
        },
      }, this.game)
      this.game.checkWindDirection = false
      this.execute(action)
    } else {
      const action = new GameAction({
        user: this.game.currentUser, player: this.player,
        data: {
          action: "wind_speed",
          wind_data: { speed: this.game.scenario.map.windSpeed },
          dice_result: [{ result: rolld10() }],
          old_initiative: this.game.initiative,
        },
      }, this.game)
      this.game.checkWindSpeed = false
      this.execute(action)
    }
  }
}
