import { CounterSelectionTarget, hexOpenType } from "../../../utilities/commonTypes";
import Counter from "../../Counter";
import Game from "../../Game";

export default class BaseState {
  game: Game;

  constructor (game: Game) {
    this.game = game
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  openHex(x: number, y: number) {
    return hexOpenType.Open
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  selectable(selection: CounterSelectionTarget): boolean {
    return false
  }

  activeCounters(): Counter[] {
    return []
  }

  finish() { throw new Error("needs local implementation") }
}