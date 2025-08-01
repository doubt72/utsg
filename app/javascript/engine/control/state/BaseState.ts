import { CounterSelectionTarget, Direction, hexOpenType, Player, UnitStatus } from "../../../utilities/commonTypes";
import Counter from "../../Counter";
import Game from "../../Game";
import GameAction, { GameActionAddActionType } from "../../GameAction";
import Unit from "../../Unit";

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

    this.type = type
    this.player = player
    this.selection = []
  }

  get showOverlays(): boolean {
    return true
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
  select(selection: CounterSelectionTarget, callback: () => void) { }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  selectable(selection: CounterSelectionTarget): boolean {
    return false
  }

  get activeCounters(): Counter[] {
    return []
  }

  finish() { throw new Error("needs local implementation") }

  samePlayer(target: Unit) {
    return target.playerNation === this.game.currentPlayerNation
  }

  execute(action: GameAction) {
    this.game.gameState = undefined
    this.game.scenario.map.clearGhosts()
    this.game.scenario.map.clearAllSelections()
    this.game.executeAction(action, false)
  }
}
