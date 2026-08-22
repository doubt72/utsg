import { Coordinate } from "../../utilities/commonTypes";
import { failRed, formatCoordinate, formatDieResult, formatTarget, passBlue, passGreen } from "../../utilities/graphics";
import { fireStartTarget } from "../control/fire";
import Game from "../Game";
import { GameActionData, GameActionDiceResult, GameActionFireStartData, GameActionPath } from "../GameAction";
import Unit, { unitDataForTankCrew } from "../Unit";
import BaseAction from "./BaseAction";

export default class FireStartAction extends BaseAction {
  diceResult: GameActionDiceResult;
  hex: GameActionPath;
  startData: GameActionFireStartData;
  
  constructor(data: GameActionData, game: Game, index: number) {
    super(data, game, index)

    this.validate(data.data.dice_result)
    this.validate(data.data.path)
    this.validate(data.data.fire_start_data)
    this.hex = (data.data.path as GameActionPath[])[0]
    this.diceResult = (data.data.dice_result as GameActionDiceResult[])[0]
    this.startData = data.data.fire_start_data as GameActionFireStartData
  }

  get type(): string { return "fire_start" }

  get needed(): number {
    return fireStartTarget(
      this.map, new Coordinate(this.hex.x, this.hex.y), this.startData.vehicle,
      this.startData.incendiary, this.startData.vehicle_incendiary
    )
  }

  get htmlValue(): string {
    let result = `<span style="color: ${passBlue()};">no effect</span>`
    if (this.needed >= this.diceResult.result.result) {
      result = `blaze <span style="color: ${failRed()};">starts</span>`
    } else if (this.diceResult.result.result <= 7 && this.startData.vehicle && this.startData.tank) {
      result += `, <span style="color: ${passGreen()};">crew escapes</span>`
    }
    const loc = formatCoordinate(new Coordinate(this.hex.x, this.hex.y))
    return this.needed < 2 ? `checking to see if crew escapes in ${loc}: on 7 or less, ` +
        `rolled ${formatDieResult(this.diceResult.result)}` +
        `: ${ result }` :
      `checking to see if blaze starts in ${loc}: on ${formatTarget(this.needed)} or less${
          this.startData.tank && this.needed < 7 ? " (crew escapes on 7 or less)" : "" }, ` +
        `rolled ${formatDieResult(this.diceResult.result)}` +
        `: ${ result }`
  }

  get undoPossible() {
    return false
  }

  mutateGame(): void {
    const loc = new Coordinate(this.hex.x, this.hex.y)
    if (this.diceResult.result.result <= this.needed) {
      this.map.addFire(loc)
    } else if (this.diceResult.result.result <= 7 && this.startData.vehicle && this.startData.tank) {
      const unit = new Unit(unitDataForTankCrew(`uf-${this.game.actions.length}`, this.startData.nation as string))
      unit.playerNation = this.startData.player_nation as string
      unit.exhaust()
      this.map.addCounter(loc, unit)
      this.game.moraleChecksNeeded.push({ unit, from: [loc], to: loc, incendiary: false, critical: false })
      this.game.addActionAnimations([{ loc, type: "crewescape" }])
      if (this.game.currentPlayerNation !== unit.playerNation) { this.game.togglePlayer() }
    }
    this.game.fireStartCheckNeeded = undefined
  }
}
