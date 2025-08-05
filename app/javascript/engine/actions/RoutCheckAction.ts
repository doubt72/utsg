import { Coordinate } from "../../utilities/commonTypes";
import { coordinateToLabel } from "../../utilities/utilities";
import Game from "../Game";
import { GameActionData, GameActionDiceResult, GameActionRoutData, GameActionUnit } from "../GameAction";
import Unit from "../Unit";
import BaseAction from "./BaseAction";

export default class RoutCheckAction extends BaseAction {
  target: GameActionUnit
  diceResult: GameActionDiceResult;
  routCheckMods: GameActionRoutData

  constructor(data: GameActionData, game: Game, index: number) {
    super(data, game, index)

    this.validate(data.data.target as GameActionUnit[])
    this.validate(data.data.dice_result as GameActionDiceResult[])
    this.validate(data.data.rout_check_data as GameActionRoutData)

    this.target = (data.data.target as GameActionUnit[])[0]
    this.diceResult = (data.data.dice_result as GameActionDiceResult[])[0]
    this.routCheckMods = data.data.rout_check_data as GameActionRoutData
  }

  get type(): string { return "rout_check" }

  get stringValue(): string {
    const nation = this.game.nationNameForPlayer(this.player)
    const unit = this.game.findUnitById(this.target.id) as Unit
    const loc = coordinateToLabel(new Coordinate(this.target.x, this.target.y))
    const check = 15 + this.routCheckMods.mod
    const roll = this.diceResult.result
    let rc = `${nation} ${unit.name} rout morale check at ${loc} (2d10): target ${check}, rolled ${roll}, `
    if (roll < check) {
      rc += 'failed, unit routs'
    } else {
      rc += 'passed, no effect'
    }
    return rc
  }

  get undoPossible() {
    return false
  }

  mutateGame(): void {
    this.game.routCheckNeeded.shift()
    const unit = this.game.findUnitById(this.target.id) as Unit
    const check = 15 + this.routCheckMods.mod
    const roll = this.diceResult
    if (roll.result < check) {
      this.game.routNeeded.push({ unit, loc: new Coordinate(this.target.x, this.target.y) })
    }
  }
}
