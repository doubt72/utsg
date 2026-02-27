import { hexOpenType, HexOpenType } from "../../../utilities/commonTypes";
import { rolld10 } from "../../../utilities/utilities";
import Game from "../../Game";
import GameAction from "../../GameAction";
import BaseState, { stateType } from "./BaseState";

export default class SmokeCheckState extends BaseState {
  constructor(game: Game) {
    super(game, stateType.SmokeCheck, game.currentPlayer)
    game.refreshCallback(game)
  }

  openHex(x: number, y: number): HexOpenType {
    const loc = this.game.smokeCheckNeeded[0].loc
    return loc.x === x && loc.y === y ? hexOpenType.Open : hexOpenType.Closed
  }

  finish() {
    const map = this.game.scenario.map
    const feature = this.game.smokeCheckNeeded[0].feature
    const loc = this.game.smokeCheckNeeded[0].loc
    const need = map.smokeCheckTarget()
    const result = rolld10()
    const action = new GameAction({
      user: this.game.currentUser, player: this.player,
      data: {
        action: "smoke_check", target: [{ x: loc.x, y: loc.y, id: feature.id }],
        dice_result: [{
          result, type: "d10",
          description: `dissipate on ${need} or less, rolled ${result}, ${
            result > need ? "no effect" : "smoke dissipates"
          }`
        }],
        old_initiative: this.game.initiative,
      }
    }, this.game)
    this.game.smokeCheckNeeded.shift()
    this.execute(action)
  }
}
