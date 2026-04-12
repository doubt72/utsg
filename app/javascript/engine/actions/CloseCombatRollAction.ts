import { Coordinate } from "../../utilities/commonTypes";
import { formatCoordinate, formatDieResult, formatNation, formatTarget } from "../../utilities/graphics";
import { setCCPlayer } from "../control/closeCombat";
import Game, { closeProgress } from "../Game";
import { GameActionCCData, GameActionData, GameActionDiceResult, GameActionUnit } from "../GameAction";
import { sortStacks } from "../support/organizeStacks";
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

    if (game.closeNeeded.length < 1) { game.setCloseCombatChecks() }
  }

  get type(): string { return "close_combat_roll" }

  get p1Hits(): number {
    const hit = Math.floor(this.diceResult[1].result.result / 80)
    const max = this.ccData.p1_max
    return max < hit ? max : hit
  }

  get p2Hits(): number {
    const hit = Math.floor(this.diceResult[0].result.result / 80)
    const max = this.ccData.p2_max
    return max < hit ? max : hit
  }

  get htmlValue(): string {
    const loc = new Coordinate(this.origin[0].x, this.origin[0].y)
    const nation1 = formatNation(this.game, 1)
    const nation2 = formatNation(this.game, 2)
    let rc = `${nation1} `
    rc += this.origin.map(o => {
      return formatNation(this.game, 1, o.name)
    }).join(", ")
    rc += ` battles ${nation2} `
    rc += this.target.map(t => {
      return formatNation(this.game, 2, t.name)
    }).join(", ")
    rc += ` in close combat at ${formatCoordinate(loc)}; `
    rc += `${nation1} player roll result of ${formatDieResult(this.diceResult[0].result)} ` +
      `on ${formatTarget(this.ccData.p1_fp)} firepower; `
    rc += `${nation2} player roll result of ${formatDieResult(this.diceResult[1].result)} ` +
      `on ${formatTarget(this.ccData.p2_fp)} firepower; `
    const hit1 = this.p1Hits
    rc += `${nation1} player takes ${formatTarget(hit1)} hit${hit1 !== 1 ? "s" : ""}`
    if (this.ccData.p1_max === hit1) { rc += ` (all eliminated)` }

    const hit2 = this.p2Hits
    rc += `, ${nation2} player takes ${formatTarget(hit2)} hit${hit2 !== 1 ? "s" : ""}`
    if (this.ccData.p2_max === hit2) { rc += ` (all eliminated)` }
    return rc
  }

  get undoPossible() {
    return false
  }

  mutateGame(): void {
    if (this.game.closeNeeded.length < 1) { this.game.setCloseCombatChecks() }
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

    const hit1 = this.p1Hits
    current.p1Reduce = hit1

    const hit2 = this.p2Hits
    current.p2Reduce = hit2

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
