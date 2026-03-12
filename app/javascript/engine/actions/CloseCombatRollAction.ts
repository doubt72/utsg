import { Coordinate } from "../../utilities/commonTypes";
import { otherPlayer } from "../../utilities/utilities";
import { maxCCCasualties } from "../control/closeCombat";
import Game, { closeProgress } from "../Game";
import { GameActionCCData, GameActionData, GameActionDiceResult, GameActionUnit } from "../GameAction";
import { sortStacks } from "../support/organizeStacks";
import Unit from "../Unit";
import BaseAction from "./BaseAction";

export default class CloseCombatRollAction extends BaseAction {
  diceResult: GameActionDiceResult[];
  origin: GameActionUnit[];
  target: GameActionUnit[];
  base: { o_base: number, t_base: number };

  constructor(data: GameActionData, game: Game, index: number) {
    super(data, game, index)

    this.validate(data.data.origin as GameActionUnit[])
    this.validate(data.data.target as GameActionUnit[])
    this.validate(data.data.dice_result as GameActionDiceResult[])
    this.validate(data.data.cc_data as GameActionCCData)
    
    this.diceResult = (data.data.dice_result as GameActionDiceResult[])
    this.target = (data.data.target as GameActionUnit[])
    this.origin = (data.data.origin as GameActionUnit[])
    this.base = (data.data.cc_data as { o_base: number, t_base: number })
  }

  get type(): string { return "close_combat_roll" }

  get stringValue(): string {
    const loc = new Coordinate(this.origin[0].x, this.origin[0].y)
    const ip = this.base.o_base + this.diceResult[0].result
    const op = this.base.t_base + this.diceResult[1].result
    const iName = this.game.nationNameForPlayer(this.player)
    const oName = this.game.nationNameForPlayer(otherPlayer(this.player))
    let rc = `${iName} `
    rc += this.origin.map(o => {
      const unit = this.game.findUnitById(o.id) as Unit
      return unit.name
    }).join(", ")
    rc += ` battles ${oName} `
    rc += this.target.map(t => {
      const unit = this.game.findUnitById(t.id) as Unit
      return unit.name
    }).join(", ")
    rc += ` in close combat; ${iName} player rolls ${this.diceResult[0].result} plus ${this.base.o_base} firepower; `
    rc += `${oName} player rolls ${this.diceResult[1].result} plus ${this.base.t_base} firepower; `
    if (ip === op) {
      rc += "each player reduces 1 unit"
    } else if (ip > op) {
      const max = maxCCCasualties(this.map, loc, this.game.findUnitById(this.origin[0].id)?.playerNation ?? "")
      const reduce = Math.floor((ip - op)/5) + 1
      const num = max < reduce ? max : reduce
      rc += `${oName} player reduces ${num} unit${num > 1 ? "s" : ""}`
      if (max < reduce) { rc += ` (all units)` }
    } else {
      const max = maxCCCasualties(this.map, loc, this.game.findUnitById(this.origin[0].id)?.playerNation ?? "")
      const reduce = Math.floor((op - ip)/5) + 1
      const num = max < reduce ? max : reduce
      rc += `${iName} player reduces ${num} unit${num > 1 ? "s" : ""}`
      if (max < reduce) { rc += ` (all units)` }
    }
    return rc
  }

  get undoPossible() {
    return false
  }

  mutateGame(): void {
    const loc = new Coordinate(this.origin[0].x, this.origin[0].y)
    const counters = this.map.countersAt(loc)
    counters.forEach(c => {
      if (c.unit.canCarrySupport && c.unit.parent) {
        c.unit.parent.children = c.unit.parent.children.filter(u => u.id !== c.unit.id)
        c.unit.parent = undefined
        this.map.addCounter(loc, c.unit)
      }
    })
    sortStacks(this.map)
    const op = this.base.o_base + this.diceResult[0].result
    const tp = this.base.t_base + this.diceResult[1].result
    const current = this.game.closeNeeded.filter(
      cn => cn.loc.x === this.target[0].x && cn.loc.y === this.target[0].y
    )[0]
    if (op === tp) {
      current.oReduce = 1
      current.tReduce = 1
    } else if (op > tp) {
      const max = maxCCCasualties(this.map, loc, this.game.findUnitById(this.target[0].id)?.playerNation ?? "")
      const reduce = Math.floor((op - tp)/5) + 1
      current.tReduce = max < reduce ? max : reduce
    } else {
      const max = maxCCCasualties(this.map, loc, this.game.findUnitById(this.origin[0].id)?.playerNation ?? "")
      const reduce = Math.floor((tp - op)/5) + 1
      current.oReduce = max < reduce ? max : reduce
    }
    current.state = closeProgress.NeedsCasualties
  }
}
