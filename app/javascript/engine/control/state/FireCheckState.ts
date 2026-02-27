import { hexOpenType, HexOpenType } from "../../../utilities/commonTypes";
import { rolld10 } from "../../../utilities/utilities";
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

  finish() {
    const map = this.game.scenario.map
    const out = this.game.fireOutCheckNeeded.length > 0
    const feature = out ? this.game.fireOutCheckNeeded[0].feature :
      this.game.fireSpreadCheckNeeded[0].feature
    const loc = out ? this.game.fireOutCheckNeeded[0].loc : this.game.fireSpreadCheckNeeded[0].loc
    const need = out ? map.fireOutTarget() : map.fireSpreadTarget()
    const result = rolld10()
    const action = new GameAction({
      user: this.game.currentUser, player: this.player,
      data: {
        action: out ? "fire_out_check" : "fire_spread_check",
        target: [{ x: loc.x, y: loc.y, id: feature.id }],
        dice_result: [{
          result, type: "d10",
          description: `fire ${out ? "goes out" : "spreads"} on ${need} or less, ` +
            `rolled ${result}, ${
            result > need ? "no effect" : (out ? "fire goes out" : "fire spreads")
          }`
        }],
        old_initiative: this.game.initiative,
      }
    }, this.game)
    out ? this.game.fireOutCheckNeeded.shift() : this.game.fireSpreadCheckNeeded.shift()
    this.execute(action)
  }
}
