import { roll2d10 } from "../../../utilities/utilities";
import BaseAction from "../../actions/BaseAction";
import Counter from "../../Counter";
import Game from "../../Game";
import GameAction, { GameActionUnit } from "../../GameAction";
import BaseState, { stateType } from "./BaseState";

export function breakdownCheck(game: Game): boolean {
  const action = game.lastAction
  if (!action || game.gameState) { return false }
  if (action.data.origin && action.data.origin.length > 0) {
    const id = action.data.origin[0].id
    const counter = game.findCounterById(id) as Counter
    if (["move", "assault_move"].includes(action.data.action) && counter.unit.breakdownRoll) {
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
      x: counter.hex?.x ?? 0, y: counter.hex?.y ?? 0, id: counter.unit.id, counter,
    }],
    counter.unit.select()
    game.refreshCallback(game)
  }

  finish() {
    const action = new GameAction({
      user: this.game.currentUser,
      player: this.player,
      data: {
        action: "breakdown", old_initiative: this.game.initiative,
        origin: this.selection.map(s => {
          return { x: s.x, y: s.y, id: s.counter.unit.id, status: s.counter.unit.status }
        }),
        dice_result: [{ result: roll2d10(), type: "2d10" }],
      },
    }, this.game)
    this.execute(action)
  }
}
