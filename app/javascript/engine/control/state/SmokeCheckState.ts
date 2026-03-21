import { hexOpenType, HexOpenType } from "../../../utilities/commonTypes";
import { rolld10, smokeReduceRoll } from "../../../utilities/utilities";
import Counter from "../../Counter";
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

  get activeCounters(): Counter[] {
    const loc = this.game.smokeCheckNeeded[0].loc
    return this.map.countersAt(loc)
  }

  get actionInProgress(): boolean {
    return false
  }

  finish() {
    const feature = this.game.smokeCheckNeeded[0].feature
    const loc = this.game.smokeCheckNeeded[0].loc
    const result = rolld10()
    const reduce = this.map.smokeCheckBase() + smokeReduceRoll(result)
    const action = new GameAction({
      user: this.game.currentUser, player: this.player,
      data: {
        action: "smoke_check", target: [{ x: loc.x, y: loc.y, id: feature.id }],
        dice_result: [{
          result, type: "d10",
          description: `rolled ${result}, reduces smoke by ${reduce}${
            reduce >= (feature.hindrance ?? 99) ? ", smoke eliminated" : ""
          }`
        }],
        old_initiative: this.game.initiative,
      }
    }, this.game)
    this.game.smokeCheckNeeded.shift()
    this.execute(action)
  }
}
