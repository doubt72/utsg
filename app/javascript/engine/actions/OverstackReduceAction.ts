import { Coordinate } from "../../utilities/commonTypes";
import { coordinateToLabel } from "../../utilities/utilities";
import Game from "../Game";
import { GameActionData, GameActionUnit } from "../GameAction";
import organizeStacks from "../support/organizeStacks";
import Unit from "../Unit";
import BaseAction from "./BaseAction";

export default class OverstackReduceAction extends BaseAction {
  target: GameActionUnit;
  
  constructor(data: GameActionData, game: Game, index: number) {
    super(data, game, index)

    this.validate(data.data.target)
    this.target = (data.data.target as GameActionUnit[])[0]
  }

  get type(): string { return "overstack_reduce" }

  get stringValue(): string {
    const name = this.player === 1 ? this.game.playerOneName : this.game.playerTwoName
    const unit = this.game.findUnitById(this.target.id)
    return `${name} removed ${unit?.name} from ${
      coordinateToLabel(new Coordinate(this.target.x, this.target.y))
    }${this.undone ? " [cancelled]" : ""}`
  }

  get undoPossible() {
    return true
  }

  undo(): void {
    const map = this.game.scenario.map
    const loc = new Coordinate(this.target.x, this.target.y)
    const unit = this.game.findUnitById(this.target.id) as Unit
    this.game.removeEliminatedCounter(this.target.id)
    map.addCounter(loc, unit)
    if (this.target.parent) {
      map.loadUnit(loc, loc, unit.id, this.target.parent)
    }
    if (this.target.children) {
      for (const id of this.target.children) {
        map.loadUnit(loc, loc, id, unit.id)
      }
    }
    organizeStacks(map)
  }

  mutateGame(): void {
    const map = this.game.scenario.map
    const loc = new Coordinate(this.target.x, this.target.y)
    const unit = map.unitAtId(loc, this.target.id)?.unit as Unit
    if (unit.parent) {
      map.dropUnit(loc, loc, unit.id)
    }
    if (this.target.children) {
      for (const id of this.target.children) {
        map.dropUnit(loc, loc, id)
      }
    }
    map.eliminateCounter(loc, this.target.id)
    this.game.addEliminatedCounter(unit)
    organizeStacks(map)
  }
}
