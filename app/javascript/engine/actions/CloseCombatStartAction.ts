import { Coordinate } from "../../utilities/commonTypes";
import Game, { closeProgress } from "../Game";
import { GameActionData } from "../GameAction";
import Unit from "../Unit";
import BaseAction from "./BaseAction";

export default class CloseCombatStartAction extends BaseAction {
  constructor(data: GameActionData, game: Game, index: number) {
    super(data, game, index)
  }

  get type(): string { return "close_combat_start" }

  get stringValue(): string {
    return "resolving close combat"
  }

  get undoPossible() {
    return false
  }

  mutateGame(): void {
    const map = this.game.scenario.map
    for (let y = 0; y < map.height; y++) {
      for (let x = 0; x < map.width; x++) {
        let one = false
        let two = false
        map.units[y][x].forEach(uf => {
          if (uf.isFeature) { return }
          const u = uf as Unit
          if (u.operated) { return }
          if (u.nation === this.game.playerOneNation) { one = true }
          if (u.nation === this.game.playerTwoNation) { two = true }
        })
        if (one && two) {
          this.game.closeNeeded.push({
            loc: new Coordinate(x, y), state: closeProgress.NeedsRoll, iReduce: 0, oReduce: 0,
          })
        }
      }
    }
  }
}
