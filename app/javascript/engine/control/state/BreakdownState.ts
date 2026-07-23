import { Coordinate, HexOpenType, hexOpenType } from "../../../utilities/commonTypes";
import { roll2d10 } from "../../../utilities/utilities";
import BaseAction from "../../actions/BaseAction";
import Counter from "../../Counter";
import Game from "../../Game";
import GameAction, { gameActionAddActionType, GameActionUnit } from "../../GameAction";
import BaseState, { stateType } from "./BaseState";

export function breakdownCheck(game: Game): boolean {
  const action = game.lastAction
  if (!action || game.gameState) { return false }
  if (action.data.origin && action.data.origin.length > 0) {
    const id = action.data.origin[0].id
    const counter = game.findCounterById(id) as Counter
    if (!counter || !counter.unit.breakdownRoll) { return false }
    if ("move" == action.data.action) { return true }
    if ("assault_move" === action.data.action) {
      if (action.data.add_action && action.data.add_action.length > 0 &&
          action.data.add_action[0].type == gameActionAddActionType.Abandon) {
        return false
      }
      return true
    }
  }
  return false
}

export default class BreakdownState extends BaseState {
  constructor(game: Game) {
    super(game, stateType.Breakdown, game.currentPlayer)
    const action = game.lastAction as BaseAction
    const origin = action.data.origin as GameActionUnit[]
    const id = origin[0].id
    const counter = game.findCounterById(id) as Counter
    this.selection = [{
      x: counter.hex?.x ?? 0, y: counter.hex?.y ?? 0, id: counter.unit.id, name: counter.unit.name, counter,
    }],
    this.map.select(counter.unit)
    game.refreshCallback(game)
  }

  openHex(x: number, y: number): HexOpenType {
    return this.selection[0].x === x && this.selection[0].y === y ? hexOpenType.Open : hexOpenType.Closed
  }

  get actionInProgress(): boolean {
    return false
  }

  get activeCounters(): Counter[] {
    return this.game.scenario.map.countersAt(new Coordinate(this.selection[0].x, this.selection[0].y))
  }

  finish() {
    const selection = this.selection[0]
    const action = new GameAction({
      user: this.game.currentUser,
      player: this.player,
      data: {
        action: "breakdown", old_initiative: this.game.initiative,
        origin: [{
            x: selection.x, y: selection.y, id: selection.counter.unit.id,
            name: selection.counter.unit.name, status: selection.counter.unit.status
        }],
        breakdown_data: { breakdown_roll: selection.counter.unit.breakdownRoll as number },
        dice_result: [{ result: roll2d10() }],
      },
    }, this.game)
    this.execute(action)
  }
}
