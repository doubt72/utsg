import { roll2d10 } from "../../../utilities/utilities";
import Counter from "../../Counter";
import Game from "../../Game";
import GameAction from "../../GameAction";
import BaseState, { stateType } from "./BaseState";

export default class SniperState extends BaseState {
  constructor(game: Game) {
    super(game, stateType.Sniper, game.currentPlayer)
    this.selection = game.sniperNeeded.map(s => {
      s.unit.select()
      return {
        x: s.loc.x, y: s.loc.y, id: s.unit.id,counter: game.findCounterById(s.unit.id) as Counter
      }
    })
    game.refreshCallback(game)
  }

  finish() {
    const action = new GameAction({
      user: this.game.currentUser,
      player: this.player,
      data: {
        action: "sniper", old_initiative: this.game.initiative,
        dice_result: [{ result: roll2d10(), type: "2d10" }],
        target: this.selection.map(s => {
          return { x: s.x, y: s.y, id: s.id, status: s.counter.unit.status }
        }),
      },
    }, this.game)
    this.execute(action)
  }
}
