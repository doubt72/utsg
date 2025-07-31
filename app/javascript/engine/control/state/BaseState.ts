import { CounterSelectionTarget, Direction, hexOpenType, Player, UnitStatus } from "../../../utilities/commonTypes";
import Counter from "../../Counter";
import Game from "../../Game";
import GameAction, { GameActionAddActionType } from "../../GameAction";
import Map from "../../Map";

export type StateType = "d" | "f" | "m" | "am" | "bd" | "i" | "ip" | "mc" | "s" | "r" |
  "ra" | "rc" | "rf"
export const stateType: { [index: string]: StateType } = {
  Deploy: "d", Fire: "f", Move: "m", Assault: "am", Breakdown: "bd", Initiative: "i",
  Pass: "ip", MoraleCheck: "mc", Sniper: "s", Rout: "r", RoutAll: "ra", RoutCheck: "rc",
  Reaction: "rf",
}

export type StateSelection = {
  x: number, y: number, id: string, counter: Counter,
}

export type StateAddAction = {
  type: GameActionAddActionType, x: number, y: number, id?: string, parent_id?: string,
  cost: number, facing?: Direction, status?: UnitStatus, index: number
}

export default class BaseState {
  game: Game;
  type: StateType;
  player: Player;
  selection: StateSelection[];
  
  constructor (game: Game, type: StateType, player: Player) {
    this.game = game

    if (this.game.gameState) {
      throw Error("attempt to initiate state when state already in progress")
    }

    this.type = type
    this.player = player
    this.selection = []
  }

  get actionInProgress(): boolean {
    return true
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  openHex(x: number, y: number) {
    return hexOpenType.Closed
  }

  get rotateOpen(): boolean {
    return false
  }

  get rotatePossible(): boolean {
    return false
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  select( map: Map, selection: CounterSelectionTarget, callback: () => void) { }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  selectable(selection: CounterSelectionTarget): boolean {
    return false
  }

  get activeCounters(): Counter[] {
    return []
  }

  finish() { throw new Error("needs local implementation") }

  execute(action: GameAction) {
    this.game.gameState = undefined
    this.game.scenario.map.clearGhosts()
    this.game.scenario.map.clearAllSelections()
    this.game.executeAction(action, false)
  }
}
