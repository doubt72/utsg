import { counterRed, markerYellowText } from "../../utilities/graphics";
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

  get htmlValue(): string {
    const red = counterRed
    const yellow = markerYellowText
    return `update all unit statuses: remove all <span style="color: ${red};">pinned</span>, ` +
      `<span style="color: ${red};">routed</span>, <span style="color: ${yellow};">tired</span>, ` +
      `and <span style="color: ${yellow};">activated</span> markers; ` +
      `<span style="color: ${yellow};">exhausted</span> units become ` +
      `<span style="color: ${yellow};">tired</span>`
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
