import { initiativeThreshold, togglePlayer } from "../../utilities/utilities";
import Game from "../Game";
import { GameActionData, GameActionDiceResult } from "../GameAction";
import BaseAction from "./BaseAction";
import IllegalActionError from "./IllegalActionError";

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

  get stringValue(): string {
    const roll = this.diceResult
    let result = "(automatic pass — no change)"
    if (roll) {
      const threshold = initiativeThreshold(Math.abs(this.data.old_initiative))
      result = `(${roll.type} roll result of ${roll.result}: ${
        roll.result < threshold ? `failed, needed ${threshold}, initiative flipped` :
        `passed, needed ${threshold}, no change` })`
    }
    return `${this.game.nationNameForPlayer(this.player)} initiative check, ${result}`
  }

  get undoPossible() {
    return false
  }

  mutateGame(): void {
    const roll = this.diceResult
    if (roll) {
      if (roll.result < initiativeThreshold(Math.abs(this.data.old_initiative))) {
        this.game.currentPlayer = togglePlayer(this.game.currentPlayer)
      }
    }
  }
  
  undo(): void {
    throw new IllegalActionError("internal error undoing breakdown")
  }
}
