import { UnitStatus } from "../../utilities/commonTypes";
import Counter from "../Counter";
import Game from "../Game";
import { GameActionData, GameActionUnit } from "../GameAction";
import BaseAction from "./BaseAction";

export default class StatusUpdateAction extends BaseAction {
  targets: GameActionUnit[]

  constructor(data: GameActionData, game: Game, index: number) {
    super(data, game, index)

    this.validate(data.data.target as GameActionUnit[])
    this.targets = (data.data.target as GameActionUnit[])
  }

  get type(): string { return "status_update" }

  get stringValue(): string {
    return "update all unit statuses, activated units lose activated status, " +
      `exhausted units become tired${this.undone ? " [cancelled]" : ""}`
  }

  get undoPossible() {
    return true
  }

  undo(): void {
    for (const t of this.targets) {
      const c = this.game.findCounterById(t.id) as Counter
      c.unit.status = t.status as UnitStatus
    }
  }

  mutateGame(): void {
    for (const t of this.targets) {
      const c = this.game.findCounterById(t.id) as Counter
      c.unit.status = t.new_status as UnitStatus
    }
  }
}
