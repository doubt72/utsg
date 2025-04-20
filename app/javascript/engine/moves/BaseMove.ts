import { Player } from "../../utilities/commonTypes";
import { nowUTCString } from "../../utilities/utilities";
import Game from "../Game"
import { GameMoveData } from "../GameMove"

export default class BaseMove {
  id: number;
  index: number;
  user: number;
  player: Player;
  createdAt: string;
  data: object;
  game: Game;

  valid: boolean;
  undone: boolean;

  constructor(data: GameMoveData, game: Game, index: number) {
    this.id = data.id ?? 0
    this.index = index
    this.user = data.user
    this.player = data.player as Player
    this.createdAt = data.created_at || nowUTCString()
    this.data = data.data
    this.game = game

    this.valid = true
    this.undone = !!data.data.undone;
  }

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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  mutateGame(): void { throw new Error("needs local implementation") }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  undo(): void { throw new Error("can't be undone") }

  validate(term: unknown) {
    if (term === undefined) {
      this.valid = false
      throw new Error("Bad data for move: " + JSON.stringify(this.data))
    }
  }
}
