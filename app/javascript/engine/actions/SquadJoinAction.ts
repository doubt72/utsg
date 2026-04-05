import { Coordinate } from "../../utilities/commonTypes";
import { formatCoordinate, formatNation } from "../../utilities/graphics";
import Counter from "../Counter";
import Game from "../Game";
import { GameActionData, GameActionUnit } from "../GameAction";
import BaseAction from "./BaseAction";

export default class SquadJoinAction extends BaseAction {
  target: GameActionUnit[];

  constructor(data: GameActionData, game: Game, index: number) {
    super(data, game, index)

    this.validate(data.data.target)

    this.target = data.data.target as GameActionUnit[]
  }

  get type(): string { return "squad_join" }

  get htmlValue(): string {
      const t = this.target[0]
      const loc = new Coordinate(t.x, t.y)
      return `${formatNation(this.game, this.player)} player joined two ` +
        `${formatNation(this.game, this.player, t.name)} teams into a squad at ${formatCoordinate(loc)}`
  }

  get undoPossible() { return true }

  mutateGame(): void {
    console.log("hello")
    const one = this.map.findCounterById(this.target[0].id) as Counter
    const two = this.map.findCounterById(this.target[1].id) as Counter
    if (this.target[1].children && this.target[1].children.length > 0) {
      const loc = new Coordinate(this.target[0].x, this.target[0].y)
      this.map.dropUnit(loc, loc, this.target[1].children[0])
      this.map.loadUnit(loc, loc, this.target[1].children[0], one.unit.id)
    }
    one.unit.join(two.unit)
    this.map.removeCounter(one.hex as Coordinate, two.unit.id)
    this.game.refreshCallback(this.game)
  }

  undo(): void {
    const selection = this.map.findCounterById(this.target[0].id) as Counter
    const newUnit = selection.unit.split()
    newUnit.setStatus(this.target[1].status)
    newUnit.id = this.target[1].id
    this.map.addCounter(selection.hex as Coordinate, newUnit)
    if (this.target[1].children && this.target[1].children.length > 0) {
      const loc = new Coordinate(this.target[0].x, this.target[0].y)
      this.map.dropUnit(loc, loc, this.target[1].children[0])
      this.map.loadUnit(loc, loc, this.target[1].children[0], newUnit.id)
    }
    this.game.refreshCallback(this.game)
  }
}
