import { initiativeThreshold } from "../../utilities/utilities";
import Game from "../Game";
import { GameActionData, GameActionDiceResult } from "../GameAction";
import BaseAction from "./BaseAction";

export default class InitiativeAction extends BaseAction {
  diceResult: GameActionDiceResult | undefined;

  constructor(data: GameActionData, game: Game, index: number) {
    super(data, game, index)

    if (data.data.dice_result) {
      this.diceResult = data.data.dice_result[0]
    } else {
      this.diceResult = undefined
    }
  }

  get type(): string { return "initiative" }

  get passed(): boolean {
    const roll = this.diceResult
    if (roll) {
      const threshold = initiativeThreshold(Math.abs(this.data.old_initiative))
      return roll.result >= threshold
    }
    return true
  }

  get stringValue(): string {
    const roll = this.diceResult
    let result = "(automatic pass — no change)"
    if (roll) {
      const threshold = initiativeThreshold(Math.abs(this.data.old_initiative))
      result = `(${roll.type}): target ${threshold}, rolled ${roll.result}: ${
        this.passed ? `passed, no change` : `failed, initiative flipped` }`
    }
    return `${this.game.nationNameForPlayer(this.player)} initiative check ${result}`
  }

  get undoPossible() {
    return false
  }

  mutateGame(): void {
    const roll = this.diceResult
    if (roll) {
      if (roll.result < initiativeThreshold(Math.abs(this.data.old_initiative))) {
        this.game.togglePlayer()
      }
    }
  }
}
