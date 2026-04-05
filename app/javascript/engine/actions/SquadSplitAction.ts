import { Coordinate } from "../../utilities/commonTypes";
import { formatCoordinate, formatNation } from "../../utilities/graphics";
import Counter from "../Counter";
import Game from "../Game";
import { GameActionData, GameActionUnit } from "../GameAction";
import BaseAction from "./BaseAction";

export default class SquadSplitAction extends BaseAction {
  target: GameActionUnit[];

  constructor(data: GameActionData, game: Game, index: number) {
      super(data, game, index)
  
      this.validate(data.data.target)
  
      this.target = data.data.target as GameActionUnit[]
  }

  get type(): string { return "squad_split" }

  get htmlValue(): string {
    const t = this.target[0]
    const loc = new Coordinate(t.x, t.y)
    return `${formatNation(this.game, this.player)} player split ` +
      `${formatNation(this.game, this.player, t.name)} squad into two teams at ${formatCoordinate(loc)}`
  }

  get undoPossible() { return true }

  mutateGame(): void {
    const selection = this.map.findCounterById(this.target[0].id) as Counter
    const newUnit = selection.unit.split()
    newUnit.id = this.target[1].id
    this.map.addCounter(selection.hex as Coordinate, newUnit)
    this.game.refreshCallback(this.game)
  }

  undo(): void {
    const one = this.map.findCounterById(this.target[0].id) as Counter
    const two = this.map.findCounterById(this.target[1].id) as Counter
    one.unit.join(two.unit)
    this.map.removeCounter(one.hex as Coordinate, two.unit.id)
    this.game.refreshCallback(this.game)
  }
}
