import { Coordinate, unitType } from "../../utilities/commonTypes";
import { failRed, formatCoordinate, formatDieResult, formatNation, formatTarget, passBlue } from "../../utilities/graphics";
import { baseMorale } from "../../utilities/utilities";
import Game from "../Game";
import { GameActionData, GameActionDiceResult, GameActionUnit } from "../GameAction";
import organizeStacks from "../support/organizeStacks";
import Unit from "../Unit";
import BaseAction from "./BaseAction";

export default class RandomDropAction extends BaseAction {
  target: GameActionUnit[];
  dice: GameActionDiceResult[];

  constructor(data: GameActionData, game: Game, index: number) {
    super(data, game, index)

    this.validate(data.data.target)
    this.validate(data.data.dice_result)

    this.target = data.data.target as GameActionUnit[]
    this.dice = data.data.dice_result as GameActionDiceResult[]
  }

  get type(): string { return "random_drop" }

  get htmlValue(): string {
    const rc = `${formatNation(this.game, this.player)} airborne drop: `
    const units: string[] = []
    for (let i = 0; i < this.target.length; i++) {
      const t = this.target[i]
      const loc = new Coordinate(t.x, t.y)
      let unitRc = `${formatNation(this.game, this.player, t.name)} deployed at ${formatCoordinate(loc)}`
      if (i < this.dice.length) {
        const roll = this.dice[i].result.result
        const check = baseMorale + (t.mod ?? 0)
        unitRc += ` morale check: needs ${formatTarget(check)}, rolled ${formatDieResult(this.dice[i].result)}: `
        if (check > roll) {
          unitRc += `<span style="color: ${failRed()};">breaks</span>`
        } else if (check === roll) {
          unitRc += `<span style="color: ${failRed()};">pinned</span>`
        } else {
          unitRc += `<span style="color: ${passBlue()};">no effect</span>`
        }
      }
      units.push(unitRc)
    }
    return rc + units.join(", ")
  }

  get undoPossible() { return false }

  mutateGame(): void {
    const scenario = this.game.scenario
    const turn = this.game.turn
    for (let i = 0; i < this.target.length; i++) {
      const t = this.target[i]
      const uf = this.player === 1 ? scenario.alliedReinforcements[turn][t.id] :
        scenario.axisReinforcements[turn][t.id]
      const u = (uf.counter as Unit).clone()
      const loc = new Coordinate(t.x, t.y)
      u.id = `uf-drop-${turn}-${this.player}-${i}`
      u.playerNation = this.player === 1 ? scenario.alliedFactions[0] : scenario.axisFactions[0]
      if (u.type === unitType.Squad) { u.split() }
      if (u.canCarrySupport) {
        const roll = this.dice[i].result.result
        const check = baseMorale + (t.mod ?? 0)
        if (check > roll) {
          u.break()
          this.game.addActionAnimations([{ loc, type: "break" }])
        } else if (check === roll) {
          u.pin()
        this.game.addActionAnimations([{ loc, type: "pinned" }])
        }
      }
      this.map.addCounter(loc, u)
    }
    organizeStacks(this.map)
  }
}