import { WindType, windType } from "../../utilities/commonTypes";
import Game from "../Game";
import { GameActionData, GameActionDiceResult, GameActionWindData } from "../GameAction";
import BaseAction from "./BaseAction";

export default class WindSpeedAction extends BaseAction {
  diceResult: GameActionDiceResult;
  windSpeed: WindType;
  
  constructor(data: GameActionData, game: Game, index: number) {
    super(data, game, index)

    this.validate(data.data.dice_result)
    this.validate(data.data.wind_data?.speed)
    this.diceResult = (data.data.dice_result as GameActionDiceResult[])[0]
    this.windSpeed = (data.data.wind_data as GameActionWindData).speed
  }

  get type(): string { return "wind_speed" }
  
    get stringValue(): string {
      let strength = "no change"
      const result = this.diceResult.result
      if (result === 10 && this.windSpeed !== windType.Strong) { strength = "strenghtens" }
      if (result === 1 && this.windSpeed !== windType.Calm) { strength = "weakens" }
      return `variable wind speed check: rolled ${result} (d10), ${strength}`
    }
  
    get undoPossible() {
      return false
    }
  
    mutateGame(): void {
      const map = this.game.scenario.map
      const result = this.diceResult.result
      if (result === 10 && this.windSpeed !== windType.Strong) {
        map.windSpeed += 1
      } else if (result === 1 && this.windSpeed !== windType.Calm) {
        map.windSpeed -= 1
      }
    }
}
