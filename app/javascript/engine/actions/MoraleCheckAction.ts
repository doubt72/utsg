import { Coordinate, unitStatus } from "../../utilities/commonTypes";
import Game from "../Game";
import { GameActionData, GameActionDiceResult, GameActionUnit } from "../GameAction";
import Unit from "../Unit";
import BaseAction from "./BaseAction";
import IllegalActionError from "./IllegalActionError";

export default class MoraleCheckAction extends BaseAction {
  diceResult: GameActionDiceResult;
  target: GameActionUnit
  moraleMods: { mod: number, why: string[] }

  constructor(data: GameActionData, game: Game, index: number) {
    super(data, game, index)

    this.validate(data.data.target as GameActionUnit[])
    this.validate(data.data.dice_result as GameActionDiceResult[])
    this.validate(data.data.morale_data as { mod: number, why: string[] })
    
    this.diceResult = (data.data.dice_result as GameActionDiceResult[])[0]
    this.target = (data.data.target as GameActionUnit[])[0]
    this.moraleMods = data.data.morale_data as { mod: number, why: string[] }
  }

  get type(): string { return "morale_check" }

  get stringValue(): string {
    let rc = ""
    const unit = this.game.findUnitById(this.target.id) as Unit
    const check = 15 + this.moraleMods.mod
    const roll = this.diceResult
    rc += `${
      this.game.nationNameForPlayer(this.player)
    } morale check for ${unit.name} (2d10): target ${check}, rolled ${roll.result}`
    if (roll.result < check) {
      if (this.target.status === unitStatus.Broken) {
        rc += ", unit eliminated"
      } else {
        rc += ", unit breaks"
      }
    } else if (roll.result == check) {
      if (this.target.status !== unitStatus.Broken) {  rc += ", unit is pinned" }
    }
    return rc
  }

  get undoPossible() {
    return false
  }

  mutateGame(): void {
    this.game.moraleChecksNeeded.pop()
    const unit = this.game.findUnitById(this.target.id) as Unit
    const check = 15 + this.moraleMods.mod
    const roll = this.diceResult
    if (roll.result < check) {
      if (unit.isBroken) {
        this.game.scenario.map.eliminateCounter(new Coordinate(this.target.x, this.target.y), this.target.id)
      } else {
        unit.status = unitStatus.Broken
      }
    } else if (roll.result == check) {
      if (!unit.isBroken) { unit.status = unitStatus.Pinned }
    }
  }
  
  undo(): void {
    throw new IllegalActionError("internal error undoing breakdown")
  }
}
