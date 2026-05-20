import { Coordinate } from "../../utilities/commonTypes";
import { failRed, formatCoordinate, formatDieResult, formatNation, formatTarget, passBlue, passGreen } from "../../utilities/graphics";
import { baseMorale, otherPlayer, playerForNation } from "../../utilities/utilities";
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

  get htmlValue(): string {
    const nation = formatNation(this.game, otherPlayer(this.player))
    const loc = formatCoordinate(new Coordinate(this.target.x, this.target.y))
    const check = baseMorale + this.routCheckMods.mod - 2
    const roll = this.diceResult.result
    let rc = `${nation} ${formatNation(this.game, otherPlayer(this.player), this.target.name)} ` +
      `rout morale check at ${loc}: target ${formatTarget(check)}, rolled ${formatDieResult(roll)}, `
    if (roll.result < check) {
      rc += `<span style="color: ${failRed()};">failed</span>, unit routs`
    } else if (this.routCheckMods.rally_mod !== undefined && roll.result >= check + 12 - this.routCheckMods.rally_mod) {
      // TODO: see below
      rc += `<span style="color: ${passGreen()};">critical success</span>, unit rallies`
    } else {
      rc += `<span style="color: ${passBlue()};">passed</span>, no effect`
    }
    return rc
  }

  get undoPossible() {
    return false
  }

  mutateGame(): void {
    this.game.routCheckNeeded.shift()
    const unit = this.game.findUnitById(this.target.id) as Unit
    const loc = new Coordinate(this.target.x, this.target.y)
    const check = baseMorale + this.routCheckMods.mod - 2
    const roll = this.diceResult.result
    if (roll.result < check) {
      this.game.routNeeded.push({ unit, loc })
      this.game.addActionAnimations([{ loc, type: "rout" }])
    } else if (this.routCheckMods.rally_mod !== undefined && roll.result >= check + 12 - this.routCheckMods.rally_mod) {
      // TODO: check for existing data; won't break existing moves, theoretically
      // could pull this after all games before id=69 deleted, if ever
      unit.resetStatus()
      this.game.addActionAnimations([{ loc, type: "rally" }])
      const vp = this.map.victoryAt(loc)
      if (vp && vp !== playerForNation(unit, this.game) && !this.map.contactAt(loc)) {
        this.map.toggleVP(loc)
      }
    } else {
      this.game.addActionAnimations([{ loc, type: "norout" }])
    }
    if (this.game.routCheckNeeded.length < 1 && this.game.routNeeded.length < 1) {
      this.game.resetCurrentPlayer()
    }
    this.game.closeOverlay = true
  }
}
