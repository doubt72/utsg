import { Coordinate } from "../../utilities/commonTypes";
import { coordinateToLabel, smokeReduceRoll } from "../../utilities/utilities";
import Counter from "../Counter";
import Game from "../Game";
import { GameActionData, GameActionDiceResult, GameActionUnit } from "../GameAction";
import BaseAction from "./BaseAction";

export default class SmokeCheckAction extends BaseAction {
  diceResult: GameActionDiceResult;
  target: GameActionUnit;
  
  constructor(data: GameActionData, game: Game, index: number) {
    super(data, game, index)

    this.validate(data.data.dice_result)
    this.validate(data.data.target)
    this.target = (data.data.target as GameActionUnit[])[0]
    this.diceResult = (data.data.dice_result as GameActionDiceResult[])[0]
  }

  get type(): string { return "smoke_check" }

  get stringValue(): string {
    const loc = coordinateToLabel(new Coordinate(this.target.x, this.target.y))
    return `smoke dispersion check for ${loc}: ${this.diceResult.description}`
  }

  get undoPossible() {
    return false
  }

  mutateGame(): void {
    const loc = new Coordinate(this.target.x, this.target.y)
    const reduce = this.map.smokeCheckBase() + smokeReduceRoll(this.diceResult.result)
    const feature = this.map.findCounterById(this.target.id) as Counter
    if (reduce >= (feature.feature.hindrance ?? 99)) {
      this.map.eliminateCounter(loc, this.target.id)
    } else {
      (feature.feature.hindrance as number) -= reduce
    }
    this.game.addActionAnimations([{ loc, type: "disperse" }])
  }
}
