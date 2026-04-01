import { Coordinate } from "../../utilities/commonTypes";
import { formatCoordinate } from "../../utilities/graphics";
import Game from "../Game";
import { GameActionData, GameActionDiceResult, GameActionUnit } from "../GameAction";
import BaseAction from "./BaseAction";

export default class FireSpreadAction extends BaseAction {
  diceResult: GameActionDiceResult;
  target: GameActionUnit;
  
  constructor(data: GameActionData, game: Game, index: number) {
    super(data, game, index)

    this.validate(data.data.dice_result)
    this.validate(data.data.target)
    this.target = (data.data.target as GameActionUnit[])[0]
    this.diceResult = (data.data.dice_result as GameActionDiceResult[])[0]
  }

  get type(): string { return "fire_spread_check" }

  get htmlValue(): string {
    const loc = formatCoordinate(new Coordinate(this.target.x, this.target.y))
    return `fire spread check for ${loc}: ${this.diceResult.description}`
  }

  get undoPossible() {
    return false
  }

  mutateGame(): void {
    const loc = new Coordinate(this.target.x, this.target.y)
    if (this.diceResult.result.result <= this.map.fireSpreadTarget()) {
      this.map.spreadFire(loc)
    }
  }
}
