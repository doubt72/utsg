import { Coordinate } from "../../utilities/commonTypes";
import { coordinateToLabel } from "../../utilities/utilities";
import Game from "../Game";
import { GameActionData, GameActionUnit } from "../GameAction";
import Unit from "../Unit";
import BaseAction from "./BaseAction";

export default class RoutAllAction extends BaseAction {
  target: GameActionUnit[]

  constructor(data: GameActionData, game: Game, index: number) {
    super(data, game, index)

    this.validate(data.data.target as GameActionUnit[])

    this.target = data.data.target as GameActionUnit[]
  }

  get type(): string { return "rout_all" }

  get stringValue(): string {
    const nation = this.game.nationNameForPlayer(this.player)
    let rc = `${nation} player attempting to rout all broken enemies: `
    const names: string[] = []
    for (const t of this.target) {
      const unit = this.game.findUnitById(t.id) as Unit
      const loc = coordinateToLabel(new Coordinate(t.x, t.y))
      names.push(`${unit.name} at ${loc}`)
    }
    rc += names.join(", ")
    return rc
  }

  get undoPossible() {
    return false
  }

  mutateGame(): void {
    for (const t of this.target) {
      const unit = this.game.findUnitById(t.id) as Unit
      const loc = new Coordinate(t.x, t.y)
      this.game.routCheckNeeded.push({ unit, loc })
    }
    this.game.updateInitiative(3)
  }
}
