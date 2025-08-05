import { togglePlayer } from "../../utilities/utilities";
import Game, { closeProgress } from "../Game";
import { GameActionCCData, GameActionData, GameActionDiceResult, GameActionUnit } from "../GameAction";
import Unit from "../Unit";
import BaseAction from "./BaseAction";

export default class CloseCombatRollAction extends BaseAction {
  diceResult: GameActionDiceResult[];
  origin: GameActionUnit[];
  target: GameActionUnit[];
  base: GameActionCCData;

  constructor(data: GameActionData, game: Game, index: number) {
    super(data, game, index)

    this.validate(data.data.origin as GameActionUnit[])
    this.validate(data.data.target as GameActionUnit[])
    this.validate(data.data.dice_result as GameActionDiceResult[])
    this.validate(data.data.cc_data as GameActionCCData)
    
    this.diceResult = (data.data.dice_result as GameActionDiceResult[])
    this.target = (data.data.target as GameActionUnit[])
    this.origin = (data.data.origin as GameActionUnit[])
    this.base = (data.data.cc_data as GameActionCCData)
  }

  get type(): string { return "close_combat_roll" }

  get stringValue(): string {
    const ip = this.base.o_base += this.diceResult[0].result
    const op = this.base.t_base += this.diceResult[1].result
    const iName = this.game.nationNameForPlayer(this.player)
    const oName = this.game.nationNameForPlayer(togglePlayer(this.player))
    let rc = `${iName} `
    rc += this.origin.map(o => {
      const unit = this.game.findUnitById(o.id) as Unit
      return unit.name
    }).join(", ")
    rc = ` battles ${oName} `
    rc += this.target.map(t => {
      const unit = this.game.findUnitById(t.id) as Unit
      return unit.name
    }).join(", ")
    rc += ` in close combat; ${iName} player rolls ${this.diceResult[0]} plus ${this.base.o_base} firepower; `
    rc += `${oName} player rolls ${this.diceResult[1]} plus ${this.base.t_base} firepower; `
    if (ip === op) {
      rc += "each player reduces 1 unit"
    } else if (ip > op) {
      const num = Math.floor((ip - op)/5) + 1
      rc += `${oName} player reduces ${num} unit${num > 1 ? "s" : ""}`
    } else {
      const num = Math.floor((op - ip)/5) + 1
      rc += `${iName} player reduces ${num} unit${num > 1 ? "s" : ""}`
    }
    return rc
  }

  get undoPossible() {
    return false
  }

  mutateGame(): void {
    const ip = this.base.o_base += this.diceResult[0].result
    const op = this.base.t_base += this.diceResult[1].result
    const current = this.game.closeNeeded.filter(
      cn => cn.loc.x === this.target[0].x && cn.loc.y === this.target[0].y
    )[0]
    if (ip === op) {
      current.iReduce = 1
      current.oReduce = 1
    } else if (ip > op) {
      current.oReduce = Math.floor((ip - op)/5) + 1
    } else {
      current.iReduce = Math.floor((op - ip)/5) + 1
    }
    current.state = closeProgress.NeedsCasualties
  }
}
