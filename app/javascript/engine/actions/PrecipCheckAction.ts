import { weatherDescription } from "../../utilities/utilities";
import Game from "../Game";
import { GameActionData, GameActionDiceResult } from "../GameAction";
import BaseAction from "./BaseAction";

export default class PrecipCheckAction extends BaseAction {
  diceResult: GameActionDiceResult;

  constructor(data: GameActionData, game: Game, index: number) {
    super(data, game, index)

    this.diceResult = (data.data.dice_result as GameActionDiceResult[])[0]
  }

  get type(): string { return "precipitation_check" }

  get passed(): boolean {
    return this.diceResult.result <= this.game.scenario.map.precipChance
  }

  get stringValue(): string {
    const map = this.game.scenario.map
    const result = this.passed ? map.precip : map.baseWeather
    return `checking for precipitation, rolled (d10), precipitation on ${map.precipChance} or less, ` +
      `got ${this.diceResult.result}: this turn it will be ${weatherDescription(result)}`
  }

  get undoPossible() {
    return false
  }

  mutateGame(): void {
    const map = this.game.scenario.map
    if (this.passed) {
      map.currentWeather = map.precip
    } else {
      map.currentWeather = map.baseWeather
    }
  }
}
