import { Coordinate, unitStatus } from "../../utilities/commonTypes";
import Game, { closeProgress } from "../Game";
import { GameActionData, GameActionUnit } from "../GameAction";
import Unit from "../Unit";
import BaseAction from "./BaseAction";

export default class CloseCombatReduceAction extends BaseAction {
  target: GameActionUnit

  constructor(data: GameActionData, game: Game, index: number) {
    super(data, game, index)

    this.validate(data.data.target as GameActionUnit[])

    this.target = (data.data.target as GameActionUnit[])[0]
  }

  get type(): string { return "close_combat_reduce" }

  get stringValue(): string {
    const unit = this.game.findUnitById(this.target.id) as Unit
    if (unit.isVehicle || this.target.status === unitStatus.Broken) {
      return `${this.game.nationNameForPlayer(this.player)} ${unit.name} eliminated`
    } else {
      return `${this.game.nationNameForPlayer(this.player)} ${unit.name} broken`
    }
  }

  get undoPossible() {
    return false
  }

  mutateGame(): void {
    const unit = this.game.findUnitById(this.target.id) as Unit
    if (unit.isVehicle) {
      unit.status = unitStatus.Wreck
    } else if (unit.status === unitStatus.Broken) {
      this.game.scenario.map.eliminateCounter(new Coordinate(this.target.x, this.target.y), this.target.id)
    } else {
      unit.status = unitStatus.Broken
    }
    const current = this.game.closeNeeded.filter(cn => cn.loc.x === this.target.x && cn.loc.y === this.target.y)[0]
    if (this.player === this.game.currentPlayer) {
      current.iReduce -= 1
    } else {
      current.oReduce -= 1
    }
    if (current.iReduce < 1 && current.oReduce < 1) {
      current.state = closeProgress.Done
    }
  }
}
