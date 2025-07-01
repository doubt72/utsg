import Game from "../Game";
import { GameActionData, GameActionDiceResult, GameActionUnit } from "../GameAction";
import Unit from "../Unit";
import BaseAction from "./BaseAction";
import IllegalActionError from "./IllegalActionError";

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

  get stringValue(): string {
    const unit = this.game.findUnitById(this.origin.id) as Unit
    const roll = this.diceResult
    return `breakdown check for ${this.game.nationNameForPlayer(this.player)} ${unit.name} (${
      roll.type} roll result of ${roll.result}: ${
      roll.result > (unit.breakdownRoll ?? 0) ? "passed" : "failed" })`
  }

  get undoPossible() {
    return false
  }

  mutateGame(): void {
    const unit = this.game.findUnitById(this.origin.id) as Unit
    if (this.diceResult.result <= (unit.breakdownRoll ?? 0)) {
      unit.immobilized = true
    }
  }
  
  undo(): void {
    throw new IllegalActionError("internal error undoing breakdown")
  }
}
