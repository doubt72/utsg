import { hexOpenType, HexOpenType } from "../../../utilities/commonTypes";
import { formatDieResult } from "../../../utilities/graphics";
import { rolld10 } from "../../../utilities/utilities";
import Counter from "../../Counter";
import Game from "../../Game";
import GameAction from "../../GameAction";
import BaseState, { stateType } from "./BaseState";

// Handle fire spreading/extinguish
export default class FireCheckState extends BaseState {
  constructor(game: Game) {
    super(game, stateType.FireCheck, game.currentPlayer)
    game.refreshCallback(game)
  }

  openHex(x: number, y: number): HexOpenType {
    const loc = this.game.fireOutCheckNeeded.length > 0 ?
      this.game.fireOutCheckNeeded[0].loc :
      this.game.fireSpreadCheckNeeded[0].loc
    return loc.x === x && loc.y === y ? hexOpenType.Open : hexOpenType.Closed
  }

  get activeCounters(): Counter[] {
    const loc = this.game.fireOutCheckNeeded.length > 0 ?
      this.game.fireOutCheckNeeded[0].loc :
      this.game.fireSpreadCheckNeeded[0].loc
    return this.map.countersAt(loc)
  }

  get actionInProgress(): boolean {
    return false
  }

  finish() {
    const out = this.game.fireOutCheckNeeded.length > 0
    const feature = out ? this.game.fireOutCheckNeeded[0].feature :
      this.game.fireSpreadCheckNeeded[0].feature
    const loc = out ? this.game.fireOutCheckNeeded[0].loc : this.game.fireSpreadCheckNeeded[0].loc
    const need = out ? this.map.fireOutTarget() : this.map.fireSpreadTarget()
    const result = rolld10()
    const action = new GameAction({
      user: this.game.currentUser, player: this.player,
      data: {
        action: out ? "fire_out_check" : "fire_spread_check",
        target: [{ x: loc.x, y: loc.y, id: feature.id, name: feature.name }],
        dice_result: [{
          result,
          description: `fire ${out ? "goes out" : "spreads"} on ${need} or less, ` +
            `rolled ${formatDieResult(result)}, ${
            result.result > need ? "no effect" : (out ? "fire goes out" : "fire spreads")
          }`
        }],
        old_initiative: this.game.initiative,
      }
    }, this.game)
    out ? this.game.fireOutCheckNeeded.shift() : this.game.fireSpreadCheckNeeded.shift()
    this.execute(action)
  }
}
