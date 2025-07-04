import Game from "../Game";
import { GameActionData } from "../GameAction";
import BaseAction from "./BaseAction";

export default class StateAction extends BaseAction {
  description: string;

  constructor(data: GameActionData, game: Game, index: number, description: string) {
    super(data, game, index)
    this.description = description
  }

  get type(): string { return "state" }

  get stringValue() {
    return this.description
  }

  mutateGame(): void {
    // No need for create; games are always already created, and that state
    // never changes on the frontend
    if (this.data.action === "start") {
      this.game.state = "in_progress"
    } else if (this.data.action === "join") {
      if (this.player === 1) {
        this.game.playerOneName = this.user
      } else {
        this.game.playerTwoName = this.user
      }
      if (this.game.playerOneName && this.game.playerTwoName) {
        this.game.state = "ready"
      }
    } else if (this.data.action === "leave") {
      if (this.player === 1) {
        this.game.playerOneName = ""
      } else {
        this.game.playerTwoName = ""
      }
      this.game.state = "needs_player"
    }
  }
}
