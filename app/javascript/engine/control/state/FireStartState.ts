import { hexOpenType, HexOpenType } from "../../../utilities/commonTypes";
import { roll2d10 } from "../../../utilities/utilities";
import Game from "../../Game";
import GameAction from "../../GameAction";
import { observe } from "../decoy";
import BaseState, { stateType } from "./BaseState";

// Check for rain/snow before turn
export default class FireStartState extends BaseState {
  constructor(game: Game) {
    super(game, stateType.FireStart, game.currentPlayer)
    game.refreshCallback(game)
  }
  
  openHex(x: number, y: number): HexOpenType {
    const loc = this.game.fireStartCheckNeeded[0].loc
    if (loc === undefined) { return hexOpenType.Closed }
    return loc.x === x && loc.y === y ? hexOpenType.Open : hexOpenType.Closed
  }

  get actionInProgress(): boolean {
    return false
  }

  finish() {
    const path = []
    const startData = []
    const dice = []
    for (const c of this.game.fireStartCheckNeeded) {
      path.push({ x: c.loc.x, y: c.loc.y })
      if (c.tank) {
        startData.push({
          vehicle: c.vehicle as boolean, incendiary: c.incendiary as boolean,
          vehicle_incendiary: c.vehicle_incendiary as boolean,
          tank: true, nation: c.nation, player_nation: c.player_nation
        })
      } else {
        startData.push({
          vehicle: c.vehicle as boolean, incendiary: c.incendiary as boolean,
          vehicle_incendiary: c.vehicle_incendiary as boolean, tank: false,
        })
      }
      dice.push({ result: roll2d10() })
    }
    const action = new GameAction({
      user: this.game.currentUser, player: this.game.currentPlayer,
      data: {
        action: "fire_start", old_initiative: this.game.initiative,
        path, fire_start_data: startData, dice_result: dice,
      }
    }, this.game)
    this.game.clearGameState()
    this.execute(action)
    if (this.game.observeNeeded.length > 0) {
      for (const c of this.game.observeNeeded) {
        observe(this.game, c)
      }
      this.game.observeNeeded = []
    }
  }
}
