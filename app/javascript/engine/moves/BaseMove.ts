import { Player } from "../../utilities/commonTypes";
import Game from "../Game"
import { GameMoveData } from "../GameMove"

export default class BaseMove {
  id: number;
  user: number;
  player: Player;
  createdAt: string;
  data: object;

  constructor(data: GameMoveData) {
    this.id = data.id
    this.user = data.user
    this.player = data.player as Player
    this.createdAt = data.created_at
    this.data = data.data
  }

  get formattedDate() {
    const date = new Date(this.createdAt)
    return `${("0" + (date.getMonth() + 1)).slice (-2)}/` +
           `${("0" + date.getDate()).slice (-2)} ` +
           `${("0" + date.getHours()).slice (-2)}:` +
           `${("0" + date.getMinutes()).slice (-2)}`
  }

  get stringValue(): string { throw new Error("needs local implementation") }

  get undoPossible(): boolean { return false }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  mutateGame(_game: Game): void { throw new Error("needs local implementation") }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  undo(_game: Game): void { throw new Error("needs local implementation") }

  validate(term: unknown) {
    if (term === undefined) {
      throw new Error(`Bad data for move: ${this.data}`)
    }
  }
}
