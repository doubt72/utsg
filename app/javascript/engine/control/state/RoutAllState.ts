import { Coordinate } from "../../../utilities/commonTypes";
import Counter from "../../Counter";
import Game from "../../Game";
import GameAction from "../../GameAction";
import BaseState, { stateType } from "./BaseState";

export default class RoutAllState extends BaseState {
  constructor(game: Game) {
    super(game, stateType.RoutAll, game.currentPlayer)
    const counters: Counter[] = []
    game.scenario.map.allUnits.forEach(c => {
      if (c.unit.isBroken && !c.unit.routed && c.unit.playerNation !== game.currentPlayerNation) {
        counters.push(c)
      }
    })
    this.selection = counters.map(c => {
      const hex = c.hex as Coordinate
      c.unit.select()
      return { x: hex.x, y: hex.y, id: c.unit.id, counter: c }
    })
    game.refreshCallback(game)
  }

  get activeCounters(): Counter[] {
    let rc: Counter[] = []
    for (const s of this.selection) {
      const counters = this.game.scenario.map.countersAt(new Coordinate(s.x, s.y))
      for (const c of counters) {
        if (c.unit.isBroken && c.unit.playerNation !== this.game.currentPlayerNation) {
          rc = rc.concat(counters)
          break
        }
      }
    }
    return rc
  }

  finish() {
    const action = new GameAction({
      user: this.game.currentUser,
      player: this.player,
      data: {
        action: "rout_all", old_initiative: this.game.initiative,
        target: this.selection.map(s => {
          return { x: s.x, y: s.y, id: s.counter.unit.id, status: s.counter.unit.status }
        }),
      },
    }, this.game)
    this.execute(action)
  }
}
