import { roll2d10 } from "../../../utilities/utilities";
import Game from "../../Game";
import GameAction, { GameActionDiceResult } from "../../GameAction";
import BaseState, { stateType } from "./BaseState";

export function initiativeCheck(game: Game) {
  if (game.gameState) { return false }
  let rc = false
  for (const a of game.actions.filter(a => !a.undone)) {
    if (a.type === "initiative") { rc = false }
    if (["move", "rush", "assault_move", "fire", "intensive_fire", "rout_self", "rout_all"].includes(a.type)) {
      rc = true
    }
  }
  return rc
}

export default class InitiativeState extends BaseState {
  constructor(game: Game) {
    super(game, stateType.Initiative, game.currentPlayer)
    game.refreshCallback(game)
  }

  get actionInProgress(): boolean {
    return false
  }

  finish() {
    let result: GameActionDiceResult[] | undefined = undefined
    if ((this.game.currentPlayer === 1 && this.game.initiative > 0) ||
        (this.game.currentPlayer === 2 && this.game.initiative < 0)) {
      result = [{ result: roll2d10(), type: "2d10" }]
    }
    const action = new GameAction({
      user: this.game.currentUser,
      player: this.player,
      data: {
        action: "initiative", old_initiative: this.game.initiative,
        dice_result: result,
      },
    }, this.game)
    this.execute(action)
  }
}
