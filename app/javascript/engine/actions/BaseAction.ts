import { Player } from "../../utilities/commonTypes";
import { nowUTCString } from "../../utilities/utilities";
import Game from "../Game"
import { GameActionData, GameActionDetails } from "../GameAction"

export default class BaseAction {
  id?: number;
  sequence?: number;
  index: number;
  user: string;
  player: Player;
  createdAt: string;
  data: GameActionDetails;
  game: Game;

  valid: boolean;
  undone: boolean;

  constructor(data: GameActionData, game: Game, index: number) {
    this.id = data.id
    this.sequence = data.sequence
    this.index = index
    this.user = data.user
    this.player = data.player as Player
    this.createdAt = data.created_at || nowUTCString()
    this.data = data.data
    this.game = game

    this.valid = true
    this.undone = !!data.undone;
  }

  get type(): string { throw new Error("must implement type") }

  get formattedDate() {
    const date = new Date(this.createdAt)
    return `${("0" + (date.getMonth() + 1)).slice (-2)}/` +
           `${("0" + date.getDate()).slice (-2)} ` +
           `${("0" + date.getHours()).slice (-2)}:` +
           `${("0" + date.getMinutes()).slice (-2)}`
  }

  get stringValue(): string { throw new Error("needs local implementation") }

  // Override if undoable
  get undoPossible(): boolean { return false }

  mutateGame(): void { throw new Error("needs local implementation") }

  undo(): void { throw new Error("can't be undone") }

  get lastUndoCascade(): boolean { return false }

  validate(term: unknown) {
    if (term === undefined) {
      this.valid = false
      throw new Error("Bad data for action: " + JSON.stringify(this.data))
    }
  }
}
