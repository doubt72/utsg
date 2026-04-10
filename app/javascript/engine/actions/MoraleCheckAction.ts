import { Coordinate, unitStatus } from "../../utilities/commonTypes";
import { failRed, formatCoordinate, formatDieResult, formatNation, formatTarget, passBlue } from "../../utilities/graphics";
import { baseMorale } from "../../utilities/utilities";
import { rollbackAddActions } from "../control/movement";
import Counter from "../Counter";
import Game from "../Game";
import { GameActionData, GameActionDiceResult, GameActionMoraleData, GameActionUnit } from "../GameAction";
import BaseAction from "./BaseAction";

export default class MoraleCheckAction extends BaseAction {
  diceResult: GameActionDiceResult;
  target: GameActionUnit
  moraleMods: GameActionMoraleData

  constructor(data: GameActionData, game: Game, index: number) {
    super(data, game, index)

    this.validate(data.data.target as GameActionUnit[])
    this.validate(data.data.dice_result as GameActionDiceResult[])
    this.validate(data.data.morale_data as GameActionMoraleData)
    
    this.diceResult = (data.data.dice_result as GameActionDiceResult[])[0]
    this.target = (data.data.target as GameActionUnit[])[0]
    this.moraleMods = data.data.morale_data as GameActionMoraleData
  }

  get type(): string { return "morale_check" }

  get htmlValue(): string {
    let rc = ""
    const check = baseMorale + this.moraleMods.mod
    let short = false
    const roll = this.diceResult.result.result
    rc += `${
      formatNation(this.game, this.player)
    } morale check for ${formatNation(this.game, this.player, this.target.name)} (2d10): ` +
      `target ${formatTarget(check)}, rolled ${formatDieResult(this.diceResult.result)}`
    if (roll < check) {
      if (this.target.status === unitStatus.Broken) {
        rc += `, unit <span style="color: ${failRed()};">eliminated</span>`
      } else {
        rc += `, unit <span style="color: ${failRed()};">breaks</span>`
        short = true
      }
    } else if (roll == check) {
      if (this.target.status !== unitStatus.Broken) {
        rc += `, unit is <span style="color: ${failRed()};">pinned</span>`
        short = true
      } else {
        rc += `, <span style="color: ${passBlue()};">no effect</span>`
      }
    } else {
      rc += `, <span style="color: ${passBlue()};">no effect</span>`
    }
    if (this.moraleMods.short && short) {
      rc += `, move short at ${formatCoordinate(new Coordinate(this.target.x, this.target.y))}`
    }
    return rc
  }

  get undoPossible() {
    return false
  }

  resetMove(): void {
    const counter = this.game.findCounterById(this.target.id) as Counter
    const old = new Coordinate(this.target.x, this.target.y)
    const hex = counter.hex as Coordinate
    rollbackAddActions(this.game.scenario.map, hex, old, this.target.id)
  }

  mutateGame(): void {
    this.game.moraleChecksNeeded.shift()
    const counter = this.game.findCounterById(this.target.id) as Counter
    const hex = counter.hex as Coordinate
    const check = baseMorale + this.moraleMods.mod
    const roll = this.diceResult.result.result
    if (roll < check) {
      if (counter.unit.isBroken) {
        const hex = counter.hex as Coordinate
        this.game.scenario.map.eliminateCounter(hex, this.target.id)
        this.game.addActionAnimations([{ loc: hex, type: "eliminate" }])
      } else {
        counter.unit.break()
        if (hex.x != this.target.x || hex.y !== this.target.y) {
          const old = new Coordinate(this.target.x, this.target.y)
          this.resetMove()
          this.game.addActionAnimations([{ loc: old, type: "break" }])
        } else {
          this.game.addActionAnimations([{ loc: hex, type: "break" }])
        }
      }
    } else if (roll === check && !counter.unit.isBroken) {
      counter.unit.pinned = true
      if (hex.x != this.target.x || hex.y !== this.target.y) {
        const old = new Coordinate(this.target.x, this.target.y)
        this.resetMove()
        this.game.addActionAnimations([{ loc: old, type: "pinned" }])
      } else {
        this.game.addActionAnimations([{ loc: hex, type: "pinned" }])
      }
    } else {
      if (hex.x != this.target.x || hex.y !== this.target.y) {
        const old = new Coordinate(this.target.x, this.target.y)
        this.game.addActionAnimations([{ loc: old, type: "nobreak" }])
      } else {
        this.game.addActionAnimations([{ loc: hex, type: "nobreak" }])
      }
    }
    if (this.game.moraleChecksNeeded.length < 1) {
      this.game.resetCurrentPlayer()
    }
    this.game.closeOverlay = true
  }
}
