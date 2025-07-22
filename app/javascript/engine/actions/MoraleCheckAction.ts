import { Coordinate, unitStatus } from "../../utilities/commonTypes";
import { coordinateToLabel } from "../../utilities/utilities";
import Counter from "../Counter";
import Game from "../Game";
import { GameActionData, GameActionDiceResult, GameActionMoraleData, GameActionUnit } from "../GameAction";
import Unit from "../Unit";
import BaseAction from "./BaseAction";
import IllegalActionError from "./IllegalActionError";

export default class MoraleCheckAction extends BaseAction {
  diceResult: GameActionDiceResult;
  target: GameActionUnit
  moraleMods: GameActionMoraleData

  constructor(data: GameActionData, game: Game, index: number) {
    super(data, game, index)

    this.validate(data.data.target as GameActionUnit[])
    this.validate(data.data.dice_result as GameActionDiceResult[])
    this.validate(data.data.morale_data as { mod: number, why: string[] })
    
    this.diceResult = (data.data.dice_result as GameActionDiceResult[])[0]
    this.target = (data.data.target as GameActionUnit[])[0]
    this.moraleMods = data.data.morale_data as GameActionMoraleData
  }

  get type(): string { return "morale_check" }

  get stringValue(): string {
    let rc = ""
    const unit = this.game.findUnitById(this.target.id) as Unit
    const check = 15 + this.moraleMods.mod
    let short = false
    const roll = this.diceResult
    rc += `${
      this.game.nationNameForPlayer(this.player)
    } morale check for ${unit.name} (2d10): target ${check}, rolled ${roll.result}`
    if (roll.result < check) {
      if (this.target.status === unitStatus.Broken) {
        rc += ", unit eliminated"
      } else {
        rc += ", unit breaks"
        short = true
      }
    } else if (roll.result == check) {
      if (this.target.status !== unitStatus.Broken) {
        rc += ", unit is pinned"
        short = true
      }
    }
    if (this.moraleMods.short && short) {
      rc += `, move short at ${coordinateToLabel(new Coordinate(this.target.x, this.target.y))}`
    }
    return rc
  }

  get undoPossible() {
    return false
  }

  mutateGame(): void {
    this.game.moraleChecksNeeded.shift()
    const counter = this.game.findCounterById(this.target.id) as Counter
    const check = 15 + this.moraleMods.mod
    const roll = this.diceResult
    if (roll.result < check) {
      if (counter.unit.isBroken) {
        this.game.scenario.map.eliminateCounter(counter.hex as Coordinate, this.target.id)
      } else {
        counter.unit.status = unitStatus.Broken
        const hex = counter.hex as Coordinate
        if (hex.x != this.target.x || hex.y !== this.target.y) {
          this.game.scenario.map.moveUnit(
            hex, new Coordinate(this.target.x, this.target.y), this.target.id
          )
        }
      }
    } else if (roll.result == check) {
      if (!counter.unit.isBroken) { counter.unit.status = unitStatus.Pinned }
        const hex = counter.hex as Coordinate
        if (hex.x != this.target.x || hex.y !== this.target.y) {
          this.game.scenario.map.moveUnit(
            hex, new Coordinate(this.target.x, this.target.y), this.target.id
          )
        }
    }
  }
  
  undo(): void {
    throw new IllegalActionError("internal error undoing morale check")
  }
}
