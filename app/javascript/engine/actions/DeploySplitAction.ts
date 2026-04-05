import { formatNation } from "../../utilities/graphics";
import Game from "../Game";
import { GameActionData, GameActionReinforcementUnit } from "../GameAction";
import Unit from "../Unit";
import BaseAction from "./BaseAction";

export default class DeploySplitAction extends BaseAction {
  turn: number;
  sKey: string;

  constructor(data: GameActionData, game: Game, index: number) {
    super(data, game, index)

    this.validate(data.data.deploy)
    const deploy = data.data.deploy as GameActionReinforcementUnit[]
    this.validate(deploy[0])

    this.sKey = deploy[0].key
    this.turn = deploy[0].turn
  }

  get type(): string { return "deploy_split" }

  get htmlValue(): string {
    const name = this.player === 1 ?
      this.game.scenario.alliedReinforcements[this.turn][this.sKey].counter.name :
      this.game.scenario.axisReinforcements[this.turn][this.sKey].counter.name
    return `${formatNation(this.game, this.player)} player split ` +
      `${formatNation(this.game, this.player,name)} squad into two teams`
  }

  get undoPossible() { return true }

  mutateGame(): void {
    const tKey = `${this.sKey.substring(0, this.sKey.length - 1)}t`
    const reinf = this.player === 1 ?
      this.game.scenario.alliedReinforcements :
      this.game.scenario.axisReinforcements
    reinf[this.turn][this.sKey].x -= 1
    if (reinf[this.turn][tKey] !== undefined) {
      reinf[this.turn][tKey].x += 2
    } else {
      const unit = reinf[this.turn][this.sKey].counter as Unit
      reinf[this.turn][tKey] = { x: 2, used: 0, counter: unit.clone().split(), id: tKey }
    }
  }

  undo(): void {
    const tKey = `${this.sKey.substring(0, this.sKey.length - 1)}t`
    const reinf = this.player === 1 ?
      this.game.scenario.alliedReinforcements :
      this.game.scenario.axisReinforcements
    reinf[this.turn][this.sKey].x += 1
    if (reinf[this.turn][tKey].x > 2) {
      reinf[this.turn][tKey].x -= 2
    } else {
      delete reinf[this.turn][tKey]
    }
    this.game.clearGameState()
  }
}
