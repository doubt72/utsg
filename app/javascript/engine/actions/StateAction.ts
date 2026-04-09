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

  get htmlValue() {
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
    } else if (this.data.action === "kick") {
      if (this.player === 1) {
        this.game.playerOneName = ""
      } else {
        this.game.playerTwoName = ""
      }
      this.game.state = "needs_player"
    } else if (this.data.action === "resign") {
      this.game.winner = this.player === 1 ? this.game.playerTwoName : this.game.playerOneName
      this.game.state = "complete"
      const title = "Game over"
      const message = `${this.game.winner} has resigned.`
      this.game.playerOneNotification = [title, message]
      if (this.game.playerOneName !== this.game.playerTwoName) {
        this.game.playerTwoNotification = [title, message]
      }
    } else if (this.data.action === "finish") {
      this.game.winner = this.player === 1 ? this.game.playerTwoName : this.game.playerOneName
      this.game.state = "complete"
      const title = "Game over"
      const message = `${this.game.winner} has won the game.`
      this.game.playerOneNotification = [title, message]
      if (this.game.playerOneName !== this.game.playerTwoName) {
        this.game.playerTwoNotification = [title, message]
      }
    }
  }
}
