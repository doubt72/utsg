import { Coordinate, CounterSelectionTarget, HexOpenType, hexOpenType } from "../../../utilities/commonTypes";
import MoveAction from "../../actions/MoveAction";
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
    const action = this.game.lastSignificantAction as MoveAction
    if (["fire", "intensive_fire"].includes(action.type)) {
      const hexes: Coordinate[] = []
      for (const o of action.origin) {
        let found = false
        for (const h of hexes) {
          if (h.x === o.x && h.y === o.y) { found = true; break }
        }
        if (!found) { hexes.push(new Coordinate(o.x, o.y))}
      }
      for (const h of hexes) {
        counters = counters.concat(this.map.countersAt(h))
      }
    } else {
      const last = action.path[action.path.length - 1]
      counters = counters.concat(this.map.countersAt(new Coordinate(last.x, last.y)))
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
    this.map.select(counter.unit)
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
    if (target.areaFire || target.offBoard) {
      this.game.addMessage("area fire can't react")
      return false
    }
    if (target.isVehicle && !target.sponson && (target.weaponDestroyed || target.jammed)) {
      this.game.addMessage("weapon cannot fire")
      return false
    }
    if (target.isVehicle && target.sponson && (target.weaponDestroyed || target.jammed) &&
        (target.sponsonDestroyed || target.sponsonJammed)) {
      this.game.addMessage("no weapon can fire")
      return false
    }
    if (target.canCarrySupport && target.children.length == 1 && target.children[0].crewed) {
      this.game.addMessage("unit manning a crewed weapon cannot fire")
      return false
    }
    const parent = target.parent
    if ((target.operated) &&
        (target.jammed || !parent || parent.isBroken || parent.isExhausted || parent.pinned)) {
      this.game.addMessage("weapon cannot fire")
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
