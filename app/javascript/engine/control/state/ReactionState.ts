import { Coordinate, CounterSelectionTarget, HexOpenType, hexOpenType } from "../../../utilities/commonTypes";
import Counter from "../../Counter";
import Game from "../../Game";
import GameAction from "../../GameAction";
import Unit from "../../Unit";
import { reactionAvailableCoords, reactionFireInRange } from "../reactionFire";
import BaseState, { stateType } from "./BaseState";

export default class ReactionState extends BaseState {
  constructor(game: Game) {
    super(game, stateType.Reaction, game.currentPlayer)
  }

  openHex(x: number, y: number): HexOpenType {
    const available = reactionAvailableCoords(this.game)
    for (const a of available) {
      if (a.x === x && a.y === y) { return hexOpenType.Open }
    }
    return hexOpenType.Closed
  }

  get activeCounters(): Counter[] {
    const available = reactionAvailableCoords(this.game)
    let counters: Counter[] = []
    for (const a of available) {
      counters = counters.concat(this.map.countersAt(a))
    }
    return counters
  }

  select(selection: CounterSelectionTarget, callback: () => void) {
    if (selection.target.type === "reinforcement") { return }
    const x = selection.target.xy.x
    const y = selection.target.xy.y
    const id = selection.counter.target.id
    const counter = this.map.unitAtId(new Coordinate(x, y), id) as Counter
    this.map.clearOtherSelections(x, y, id)
    counter.unit.select()
    callback()
  }

  selectable(selection: CounterSelectionTarget): boolean {
    if (selection.target.type === "reinforcement") { return false }
    const target = selection.counter.unit as Unit
    const loc = selection.target.xy
    if (this.openHex(loc.x, loc.y) !== hexOpenType.Open) { return false }
    if (!reactionFireInRange(this.game, target, loc)) {
      this.game.addMessage("unit out of range")
      return false
    }
    return true
  }

  finish() {
    const action = new GameAction({
      user: this.game.currentUser, player: this.game.currentPlayer,
      data: { action: "reaction_pass", old_initiative: this.game.initiative },
    }, this.game)
    this.execute(action)
  }
}
