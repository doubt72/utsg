import { Coordinate } from "../../utilities/commonTypes";
import { formatCoordinate, formatNation } from "../../utilities/graphics";
import Game from "../Game";
import { GameActionData, GameActionUnit } from "../GameAction";
import Unit from "../Unit";
import BaseAction from "./BaseAction";

export default class ObserveAction extends BaseAction {
  targets: GameActionUnit[];

  constructor(data: GameActionData, game: Game, index: number) {
    super(data, game, index)

    this.validate(data.data.target)
    this.targets = data.data.target as GameActionUnit[]
  }

  get type(): string { return "observe" }

  get htmlValue(): string {
    const s = this.targets.length > 1 ? "s" : ""
    return `${formatNation(this.game, this.player)} unit${s} ${
        this.targets.map(t => formatNation(this.game, this.player, t.name)).join(", ")
      } observed at ${formatCoordinate(new Coordinate(this.targets[0].x, this.targets[0].y))}`
  }

  get undoPossible() {
    return false
  }

  mutateGame(): void {
    const loc = new Coordinate(this.targets[0].x, this.targets[0].y)
    for (const t of this.targets) {
      const unit = this.game.findUnitById(t.id) as Unit
      unit.observed = true
    }
    this.game.addActionAnimations([{ loc, type: "observed" }])
  }
}
