import { formatDieResult, weatherDescription } from "../../utilities/graphics";
import Game from "../Game";
import { GameActionData, GameActionDiceResult } from "../GameAction";
import BaseAction from "./BaseAction";

export default class PrecipCheckAction extends BaseAction {
  diceResult: GameActionDiceResult;

  constructor(data: GameActionData, game: Game, index: number) {
    super(data, game, index)

    this.validate(data.data.dice_result)
    this.diceResult = (data.data.dice_result as GameActionDiceResult[])[0]
  }

  get type(): string { return "precipitation_check" }

  get passed(): boolean {
    return this.diceResult.result.result <= this.map.precipChance
  }

  get htmlValue(): string {
    const result = this.passed ? this.map.precip : this.map.baseWeather
    return `checking for precipitation, precipitation on ${this.map.precipChance} or less, ` +
      `rolled ${formatDieResult(this.diceResult.result)}: this turn it will be ${weatherDescription(result)}`
  }

  get undoPossible() {
    return false
  }

  mutateGame(): void {
    if (this.passed) {
      this.map.currentWeather = this.map.precip
    } else {
      this.map.currentWeather = this.map.baseWeather
    }
  }
}
