import { Player } from "../../utilities/commonTypes";
import { nowUTCString } from "../../utilities/utilities";
import Game from "../Game"
import { GameActionData, GameActionDetails } from "../GameAction"
import Map from "../Map";
import IllegalActionError from "./IllegalActionError";

export const significantActions = [
  "move", "rush", "assault_move", "fire", "intensive_fire", "rout_self", "rout_move",
  "reaction_fire", "reaction_intensive_fire", "pass", "rout_all",
]

export const moveActions = [ "move", "rush", "assault_move", "rout_move", "rout_self" ]

export const fireActions = [ "fire", "intensive_fire", "reaction_fire", "reaction_intensive_fire" ]

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
  executed: boolean;
  executedUndo: boolean;

  constructor(data: GameActionData, game: Game, index: number) {
    this.validate(data.data.old_initiative)

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
    this.executed = this.undone
    this.executedUndo = false
  }

  get type(): string { throw new Error("must implement type") }

  get map(): Map { return this.game.scenario.map }

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

  undo(): void { throw new IllegalActionError(`${this.type} can't be undone`) }

  get lastUndoCascade(): boolean { return false }

  validate(term: unknown) {
    if (term === undefined) {
      this.valid = false
      throw new Error("Bad data for action: " + JSON.stringify(this.data))
    }
  }
}
