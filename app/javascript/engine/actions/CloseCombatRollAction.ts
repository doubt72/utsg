import { Coordinate } from "../../utilities/commonTypes";
import { coordinateToLabel } from "../../utilities/utilities";
import { setCCPlayer } from "../control/closeCombat";
import Game, { closeProgress } from "../Game";
import { GameActionCCData, GameActionData, GameActionDiceResult, GameActionUnit } from "../GameAction";
import { sortStacks } from "../support/organizeStacks";
import Unit from "../Unit";
import BaseAction from "./BaseAction";

export default class CloseCombatRollAction extends BaseAction {
  diceResult: GameActionDiceResult[];
  origin: GameActionUnit[];
  target: GameActionUnit[];
  ccData: { p1_fp: number, p2_fp: number, p1_max: number, p2_max: number };

  constructor(data: GameActionData, game: Game, index: number) {
    super(data, game, index)

    this.validate(data.data.origin as GameActionUnit[])
    this.validate(data.data.target as GameActionUnit[])
    this.validate(data.data.dice_result as GameActionDiceResult[])
    this.validate(data.data.cc_data as GameActionCCData)
    
    this.diceResult = (data.data.dice_result as GameActionDiceResult[])
    this.target = (data.data.target as GameActionUnit[])
    this.origin = (data.data.origin as GameActionUnit[])
    this.ccData = (data.data.cc_data as { p1_fp: number, p2_fp: number, p1_max: number, p2_max: number })
  }

  get type(): string { return "close_combat_roll" }

  get stringValue(): string {
    const loc = new Coordinate(this.origin[0].x, this.origin[0].y)
    const nation1 = this.game.nationNameForPlayer(1)
    const nation2 = this.game.nationNameForPlayer(2)
    let rc = `${nation1} `
    rc += this.origin.map(o => {
      const unit = this.game.findUnitById(o.id) as Unit
      return unit.name
    }).join(", ")
    rc += ` battles ${nation2} `
    rc += this.target.map(t => {
      const unit = this.game.findUnitById(t.id) as Unit
      return unit.name
    }).join(", ")
    rc += ` in close combat at ${coordinateToLabel(loc)}; `
    rc += `${nation1} player roll result of ${this.diceResult[0].result} on ${this.ccData.p1_fp} firepower; `
    rc += `${nation2} player roll result of ${this.diceResult[1].result} on ${this.ccData.p2_fp} firepower; `

    const hit1 = Math.floor(this.diceResult[1].result / 80)
    const max1 = this.ccData.p1_max
    const num1 = max1 < hit1 ? max1 : hit1
    rc += `${nation1} player takes ${num1} hit${num1 !== 1 ? "s" : ""}`
    if (max1 <= hit1) { rc += ` (all eliminated)` }

    const hit2 = Math.floor(this.diceResult[0].result / 80)
    const max2 = this.ccData.p2_max
    const num2 = max2 < hit2 ? max2 : hit2
    rc += `, ${nation2} player takes ${num2} hit${num2 !== 1 ? "s" : ""}`
    if (max2 < hit2) { rc += ` (all eliminated)` }
    return rc
  }

  get undoPossible() {
    return false
  }

  mutateGame(): void {
    if (this.game.closeNeeded.length < 1) { this.game.addCloseCombatChecks() }
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
    const current = this.game.closeNeeded.filter(
      cn => cn.loc.x === this.target[0].x && cn.loc.y === this.target[0].y
    )[0]

    const hit1 = Math.floor(this.diceResult[1].result / 80)
    const max1 = this.ccData.p1_max
    current.p1Reduce = max1 < hit1 ? max1 : hit1

    const hit2 = Math.floor(this.diceResult[0].result / 80)
    const max2 = this.ccData.p2_max
    current.p2Reduce = max2 < hit2 ? max2 : hit2

    if (hit1 > 0 || hit2 > 0) {
      current.state = closeProgress.NeedsCasualties
    } else {
      current.state = closeProgress.Done
    }
    setCCPlayer(this.game, current)
    if (!this.game.testGame && localStorage.getItem("username") === this.game.currentUser &&
        (current.p1Reduce > 0 || current.p2Reduce > 0)) {
      this.game.openOverlay = this.game.scenario.map.hexAt(loc)
    }
    this.game.addActionAnimations([{ loc, type: "combat" }])
  }
}
