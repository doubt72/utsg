import { Coordinate, hexOpenType, HexOpenType } from "../../../utilities/commonTypes";
import { roll2d10 } from "../../../utilities/utilities";
import Game, { SimpleHexCheck } from "../../Game";
import GameAction from "../../GameAction";
import BaseState, { stateType } from "./BaseState";

// Check for rain/snow before turn
export default class FireStartState extends BaseState {
  constructor(game: Game) {
    super(game, stateType.FireStart, game.currentPlayer)
    game.refreshCallback(game)
  }
  
  openHex(x: number, y: number): HexOpenType {
    const loc = this.game.fireStartCheckNeeded?.loc
    if (loc === undefined) { return hexOpenType.Closed }
    return loc.x === x && loc.y === y ? hexOpenType.Open : hexOpenType.Closed
  }

  get actionInProgress(): boolean {
    return false
  }

  finish() {
    const check = this.game.fireStartCheckNeeded as SimpleHexCheck
    const loc = check.loc as Coordinate
    const action = new GameAction({
      user: this.game.currentUser, player: this.game.currentPlayer,
      data: {
        action: "fire_start", old_initiative: this.game.initiative,
        path: [{ x: loc.x, y: loc.y }],
        fire_start_data: check.tank ? {
          vehicle: check.vehicle as boolean, incendiary: check.incendiary as boolean,
          vehicle_incendiary: check.vehicle_incendiary as boolean,
          tank: true, nation: check.nation, player_nation: check.player_nation
        } : {
          vehicle: check.vehicle as boolean, incendiary: check.incendiary as boolean,
          vehicle_incendiary: check.vehicle_incendiary as boolean, tank: false,
        },
        dice_result: [{ result: roll2d10() }]
      }
    }, this.game)
    this.game.clearGameState()
    this.execute(action)
  }
}
