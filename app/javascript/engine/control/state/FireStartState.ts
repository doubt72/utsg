import { Coordinate, hexOpenType, HexOpenType } from "../../../utilities/commonTypes";
import { roll2d10 } from "../../../utilities/utilities";
import Game from "../../Game";
import GameAction from "../../GameAction";
import BaseState, { stateType } from "./BaseState";

// Check for rain/snow before turn
export default class FireStartState extends BaseState {
  constructor(game: Game) {
    super(game, stateType.FireStart, game.currentPlayer)
    game.refreshCallback(game)
  }
  
  openHex(x: number, y: number): HexOpenType {
    const loc = this.game.fireStartCheckNeeded?.loc as Coordinate
    return loc.x === x && loc.y === y ? hexOpenType.Open : hexOpenType.Closed
  }

  finish() {
    const loc = this.game.fireStartCheckNeeded?.loc as Coordinate
    const dice = [{ result: roll2d10(), type: "2d10" }]
    const action = new GameAction({
      user: this.game.currentUser, player: this.game.currentPlayer,
      data: {
        action: "fire_start", old_initiative: this.game.initiative,
        path: [{ x: loc.x, y: loc.y }],
        fire_start_data: {
          vehicle: this.game.fireStartCheckNeeded?.vehicle as boolean,
          incendiary: this.game.fireStartCheckNeeded?.incendiary as boolean,
          vehicle_incendiary: this.game.fireStartCheckNeeded?.vehicle_incendiary as boolean,
        },
        dice_result: dice
      }
    }, this.game)
    this.game.fireStartCheckNeeded = undefined
    this.game.state = undefined
    this.execute(action)
  }
}
