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
    return "update all unit statuses: remove all pinned, routed, tired, and activated markers; exhausted units " +
      `become tired${this.undone ? " [cancelled]" : ""}`
  }

  get undoPossible() {
    return false
  }

  undo(): void {
    // this.game.initiative = this.data.old_initiative
    // for (const t of this.targets) {
    //   const c = this.game.findCounterById(t.id) as Counter
    //   if (t.status !== undefined) {
    //     c.unit.setStatus(t.status)
    //   }
    //   if (t.unpin) { c.unit.pinned = true }
    //   if (t.unrout) { c.unit.routed = true }
    // }
  }

  mutateGame(): void {
    this.game.endTurnInitiative()
    for (const t of this.targets) {
      const c = this.game.findCounterById(t.id) as Counter
      if (t.new_status !== undefined) {
        c.unit.setStatus(t.new_status)
      }
      if (t.unpin) { c.unit.pinned = false }
      if (t.unrout) { c.unit.routed = false }
    }
  }
}
