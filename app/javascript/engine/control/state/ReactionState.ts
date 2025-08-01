import { Coordinate, CounterSelectionTarget, hexOpenType } from "../../../utilities/commonTypes";
import { togglePlayer } from "../../../utilities/utilities";
import Counter from "../../Counter";
import Game from "../../Game";
import GameAction from "../../GameAction";
import Unit from "../../Unit";
import BaseState, { stateType } from "./BaseState";

export function reactionFireCheck(game: Game): boolean {
  if (game.gameState) { return false }
  let rc = false
  let last = ""
  let player = game.currentPlayer
  for (const a of game.actions.filter(a => !a.undone)) {
    rc = a.type === "initiative"
    if (["move", "rush", "assault_move", "fire", "intensive_fire", "rout_self", "rout_all"].includes(a.type)) {
      last = a.type
      player = a.player
    }
  }
  return rc && ["move", "rush", "fire", "intensive_fire"].includes(last) && player === game.currentPlayer
}

export default class ReactionState extends BaseState {
  constructor(game: Game) {
    super(game, stateType.Reaction, game.currentPlayer)
  }

  get showOverlays(): boolean {
    return false
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  openHex(x: number, y: number) {
    return hexOpenType.Open
  }

  select(selection: CounterSelectionTarget, callback: () => void) {
    if (selection.target.type === "reinforcement") { return }
    const map = this.game.scenario.map
    const x = selection.target.xy.x
    const y = selection.target.xy.y
    const id = selection.counter.target.id
    const counter = map.unitAtId(new Coordinate(x, y), id) as Counter
    map.clearOtherSelections(x, y, id)
    counter.unit.select()
    callback()
  }

  selectable(selection: CounterSelectionTarget): boolean {
    const target = selection.counter.unit as Unit
    const same = this.samePlayer(target)
    if (same) { return false }
    return true
  }

  finish() {
    const action = new GameAction({
      user: this.game.currentUser,
      player: togglePlayer(this.game.currentPlayer),
      data: { action: "reaction_pass", old_initiative: this.game.initiative },
    }, this.game)
    this.execute(action)
  }
}
