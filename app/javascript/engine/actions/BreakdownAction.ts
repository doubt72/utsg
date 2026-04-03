import { Coordinate } from "../../utilities/commonTypes";
import { formatDieResult, formatNation, formatTarget } from "../../utilities/graphics";
import Game from "../Game";
import { GameActionData, GameActionDiceResult, GameActionUnit } from "../GameAction";
import Unit from "../Unit";
import BaseAction from "./BaseAction";

export default class BreakdownAction extends BaseAction {
  origin: GameActionUnit;
  diceResult: GameActionDiceResult;

  constructor(data: GameActionData, game: Game, index: number) {
    super(data, game, index)

    this.validate(data.data.origin)
    this.validate(data.data.dice_result)

    this.origin = (data.data.origin as GameActionUnit[])[0]
    this.diceResult = (data.data.dice_result as GameActionDiceResult[])[0]
  }

  get type(): string { return "breakdown" }

  get htmlValue(): string {
    const unit = this.game.findUnitById(this.origin.id) as Unit
    const roll = this.diceResult
    return `breakdown check for ${formatNation(this.game, this.player)} ${unit.name}, ` +
      `target ${formatTarget(unit.breakdownRoll as number)}, rolled ${formatDieResult(roll.result)}: ${
      roll.result.result > (unit.breakdownRoll ?? 0) ? "passed" : "failed" })`
  }

  get undoPossible() {
    return false
  }

  mutateGame(): void {
    const unit = this.game.findUnitById(this.origin.id) as Unit
    if (this.diceResult.result.result <= (unit.breakdownRoll ?? 0)) {
      unit.immobilized = true
      this.game.addActionAnimations(
        [{ loc: new Coordinate(this.origin.x, this.origin.y), type: "immobilized" }]
      )
    }
  }
}
