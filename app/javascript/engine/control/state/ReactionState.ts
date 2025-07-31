import { togglePlayer } from "../../../utilities/utilities";
import Game from "../../Game";
import GameAction from "../../GameAction";
import BaseState, { stateType } from "./BaseState";

export function reactionFireCheck(game: Game): boolean {
  if (game.gameState) { return false }
  let rc = false
  let last = ""
  let player = game.currentPlayer
  for (const a of game.actions.filter(a => !a.undone)) {
    rc = a.type === "initiative"
    if (["move", "rush", "assault_move", "fire", "intensive_fire", "rout_self", "rout_all"].includes(a.type)) {
      last = a.type
      player = a.player
    }
  }
  return rc && ["move", "rush", "fire", "intensive_fire"].includes(last) && player === game.currentPlayer
}

export default class ReactionState extends BaseState {
  constructor(game: Game) {
    super(game, stateType.Reaction, game.currentPlayer)
  }

  finish() {
    const action = new GameAction({
      user: this.game.currentUser,
      player: togglePlayer(this.game.currentPlayer),
      data: { action: "reaction_pass", old_initiative: this.game.initiative },
    }, this.game)
    this.execute(action)
  }
}
