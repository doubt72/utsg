import { Coordinate, CounterSelectionTarget, hexOpenType, HexOpenType } from "../../../utilities/commonTypes";
import { stackLimit } from "../../../utilities/utilities";
import Counter from "../../Counter";
import Game from "../../Game";
import GameAction from "../../GameAction";
import BaseState, { stateType } from "./BaseState";

export default class OverstackState extends BaseState {
  constructor(game: Game) {
    super(game, stateType.Pass, game.currentPlayer)
    game.refreshCallback(game)
  }

  openHex(x: number, y: number): HexOpenType {
    return this.overstackAt(x, y) ? hexOpenType.Open : hexOpenType.Closed
  }

  select(selection: CounterSelectionTarget, callback: () => void): void {
    if (selection.target.type === "reinforcement") { return }
    const map = this.game.scenario.map
    const x = selection.target.xy.x
    const y = selection.target.xy.y
    const id = selection.counter.target.id
    const counter = map.unitAtId(new Coordinate(x, y), id) as Counter
    if (!counter.unit.isFeature && this.samePlayer(counter.unit)) {
      if (this.overstackAt(x, y)) {
        counter.unit.select()
        map.clearOtherTargetSelections(x, y, counter.unit.id)
      }
    }
    callback()
  }

  overstackAt(x: number, y: number): boolean {
    let total = 0
    const counters = this.game.scenario.map.countersAt(new Coordinate(x, y))
    for (const c of counters) {
      if (c.unit.isFeature) { continue }
      if (!this.samePlayer(c.unit) && !c.unit.isWreck) {
        return false
      } else {
        total += c.unit.size
      }
    }
    return total > stackLimit
  }

  finish() {
    const map = this.game.scenario.map
    const counter = map.currentSelection[0]
    const hex = counter.hex as Coordinate
    const action = new GameAction({
      user: this.game.currentUser, player: this.player,
      data: {
        action: "overstack_reduce", target: [{
          x: hex.x, y: hex.y, id: counter.unit.id, status: counter.unit.status,
          parent: counter.unit.parent?.id, children: counter.children.map(c => {
            return c.unit.id
          })
        }],
        old_initiative: this.game.initiative,
      }
    }, this.game)
    this.execute(action)
  }
}
