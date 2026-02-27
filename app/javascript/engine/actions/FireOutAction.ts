import { Coordinate } from "../../utilities/commonTypes";
import { coordinateToLabel } from "../../utilities/utilities";
import Game from "../Game";
import { GameActionData, GameActionDiceResult, GameActionUnit } from "../GameAction";
import BaseAction from "./BaseAction";

export default class FireOutAction extends BaseAction {
  diceResult: GameActionDiceResult;
  target: GameActionUnit;
  
  constructor(data: GameActionData, game: Game, index: number) {
    super(data, game, index)

    this.validate(data.data.dice_result)
    this.validate(data.data.target)
    this.target = (data.data.target as GameActionUnit[])[0]
    this.diceResult = (data.data.dice_result as GameActionDiceResult[])[0]
  }

  get type(): string { return "fire_out_check" }

  get stringValue(): string {
    const loc = coordinateToLabel(new Coordinate(this.target.x, this.target.y))
    return `fire extinguish check for ${loc}: ${this.diceResult.description}`
  }

  get undoPossible() {
    return false
  }

  mutateGame(): void {
    const map = this.game.scenario.map
    const loc = new Coordinate(this.target.x, this.target.y)
    if (this.diceResult.result <= map.fireOutTarget()) {
      map.eliminateCounter(loc, this.target.id)
    }
  }
}
