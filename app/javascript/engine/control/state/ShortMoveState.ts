import { hexOpenType, HexOpenType } from "../../../utilities/commonTypes";
import Counter from "../../Counter";
import Game from "../../Game";
import GameAction from "../../GameAction";
import BaseState, { StateSelection, stateType } from "./BaseState";

export default class ShortMoveState extends BaseState {
  selection: StateSelection[];

  constructor(game: Game) {
    super(game, stateType.ShortMove, game.currentPlayer)

    this.selection = []
    for (const id of game.shortCheckNeeded.ids) {
      const counter = this.map.findCounterById(id) as Counter
      this.selection.push({
        x: counter.hex?.x as number, y: counter.hex?.y as number, id: id, name: counter.unit.name, counter,
      })
      this.map.select(counter.unit)
      if (counter.unit.children.length > 0) {
        this.map.select(counter.unit.children[0])
      }
    }
  }

  openHex(x: number, y: number): HexOpenType {
    for (const s of this.selection) {
      if (x === s.x && y === s.y) { return hexOpenType.Open }
    }
    return hexOpenType.Closed
  }

  get activeCounters(): Counter[] {
    const rc: Counter[] = []
    for (const c of this.selection) {
      rc.push(c.counter)
      if (c.counter.children.length > 0) {
        rc.push(c.counter.children[0])
      }
    }
    return rc
  }

  commit(skip: boolean): void {
    const action = new GameAction({
      user: this.game.currentUser, player: this.player,
      data: {
        action: "short_move", old_initiative: this.game.initiative,
        path: [...this.game.shortCheckNeeded.coords],
        target: this.selection.map(s => {
          return {
            x: s.x, y: s.y, id: s.counter.unit.id, name: s.counter.unit.name,
            status: s.counter.unit.status,
          }
        }),
        short_move_data: { skip },
      }
    }, this.game)
    this.execute(action)
  }

  skip(): void {
    this.commit(true)
  }

  finish(): void {
    this.commit(false)
  }
}