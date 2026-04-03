import { failRed, formatDieResult, formatNation, formatTarget, passBlue } from "../../utilities/graphics";
import { initiativeThreshold } from "../../utilities/utilities";
import { reactionActions } from "../control/reactionFire";
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
    if (this.diceResult) {
      const threshold = initiativeThreshold(Math.abs(this.data.old_initiative))
      return this.diceResult.result.result >= threshold
    }
    return true
  }

  get htmlValue(): string {
    let result = "(automatic pass — no change)"
    if (this.diceResult) {
      const threshold = initiativeThreshold(Math.abs(this.data.old_initiative))
      result = `target ${formatTarget(threshold)}, rolled ${formatDieResult(this.diceResult.result)}: ${
        this.passed ? `<span style="color: ${passBlue};">passed</span>, no change` :
          `<span style="color: ${failRed};">failed</span>, initiative flipped` }`
    }
    return `${formatNation(this.game, this.player)} initiative check ${result}`
  }

  get undoPossible() {
    return false
  }

  mutateGame(): void {
    const action = this.game.lastSignificantAction
    if (this.diceResult) {
      if (this.diceResult.result.result < initiativeThreshold(Math.abs(this.data.old_initiative))) {
        this.game.toggleInitiative()
      } else if (reactionActions.includes(action?.type ?? "")) {
        this.game.togglePlayer()
      }
    } else if (reactionActions.includes(action?.type ?? "")) {
      this.game.togglePlayer()
    }
  }
}
