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
      const parent = map.unitAtId(loc, this.target.parent)?.unit as Unit
      unit.parent = parent
      parent.children.push(unit)
    }
    if (this.target.children) {
      for (const id of this.target.children) {
        const child = map.unitAtId(loc, id)?.unit as Unit
        unit.children.push(child)
        child.parent = unit
      }
    }
    organizeStacks(map)
  }

  mutateGame(): void {
    const map = this.game.scenario.map
    const loc = new Coordinate(this.target.x, this.target.y)
    const unit = map.unitAtId(loc, this.target.id)?.unit as Unit
    map.eliminateCounter(loc, this.target.id)
    this.game.addEliminatedCounter(unit)
    organizeStacks(map)
  }
}
