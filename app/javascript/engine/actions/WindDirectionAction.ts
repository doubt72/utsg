import { formatDieResult } from "../../utilities/graphics";
import { normalDir } from "../../utilities/utilities";
import Game from "../Game";
import { GameActionData, GameActionDiceResult } from "../GameAction";
import BaseAction from "./BaseAction";

export default class WindDirectionAction extends BaseAction {
  diceResult: GameActionDiceResult;
  
  constructor(data: GameActionData, game: Game, index: number) {
    super(data, game, index)

    this.validate(data.data.dice_result)
    this.diceResult = (data.data.dice_result as GameActionDiceResult[])[0]
  }

  get type(): string { return "wind_direction" }

  get htmlValue(): string {
    let dir = "no change"
    const result = this.diceResult.result
    if (result.result < 3) { dir = "shifts counter-clockwise" }
    if (result.result > 8) { dir = "shifts clockwise" }
    return `variable wind direction check: rolled ${formatDieResult(result)}, ${dir}`
  }

  get undoPossible() {
    return false
  }

  mutateGame(): void {
    const result = this.diceResult.result
    if (result.result < 3) {
      this.map.windDirection = normalDir(this.map.windDirection - 1)
    } else if (result.result > 7) {
      this.map.windDirection = normalDir(this.map.windDirection - 1)
    }
  }
}
