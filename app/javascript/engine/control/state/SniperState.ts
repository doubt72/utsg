import { Coordinate } from "../../../utilities/commonTypes";
import { roll2d10 } from "../../../utilities/utilities";
import Counter from "../../Counter";
import Game from "../../Game";
import GameAction from "../../GameAction";
import BaseState, { stateType } from "./BaseState";

export default class SniperState extends BaseState {
  constructor(game: Game) {
    super(game, stateType.Sniper, game.currentPlayer)
    this.selection = game.sniperNeeded.map(s => {
      s.unit.select()
      return {
        x: s.loc.x, y: s.loc.y, id: s.unit.id,counter: game.findCounterById(s.unit.id) as Counter
      }
    })
    game.refreshCallback(game)
  }

  get activeCounters(): Counter[] {
    const map = this.game.scenario.map
    const hexes: { x: number, y: number }[] = []
    for (const s of this.selection) {
      let found = false
      for (const h of hexes) {
        if (h.x === s.x && h.y === s.y) {
          found = true
          break
        }
      }
      if (!found) { hexes.push({ x: s.x, y: s.y }) }
    }
    let rc: Counter[] = []
    for (const h of hexes) {
      rc = rc.concat(map.countersAt(new Coordinate(h.x, h.y)))
    }
    return rc
  }

  finish() {
    const action = new GameAction({
      user: this.game.currentUser,
      player: this.player,
      data: {
        action: "sniper", old_initiative: this.game.initiative,
        dice_result: [{ result: roll2d10(), type: "2d10" }],
        target: this.selection.map(s => {
          return { x: s.x, y: s.y, id: s.id, status: s.counter.unit.status }
        }),
      },
    }, this.game)
    this.execute(action)
  }
}
