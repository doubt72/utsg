import { Coordinate } from "../../utilities/commonTypes";
import { failRed, formatCoordinate, formatDieResult, formatTarget, passBlue, passGreen } from "../../utilities/graphics";
import { fireStartTarget } from "../control/fire";
import Game from "../Game";
import { GameActionData, GameActionDiceResult, GameActionFireStartData, GameActionPath } from "../GameAction";
import Unit, { unitDataForTankCrew } from "../Unit";
import BaseAction from "./BaseAction";

export default class FireStartAction extends BaseAction {
  diceResult: GameActionDiceResult[];
  target: GameActionPath[];
  startData: GameActionFireStartData[];
  
  constructor(data: GameActionData, game: Game, index: number) {
    super(data, game, index)

    this.validate(data.data.dice_result)
    this.validate(data.data.path)
    this.validate(data.data.fire_start_data)
    this.target = data.data.path as GameActionPath[]
    this.diceResult = data.data.dice_result as GameActionDiceResult[]
    this.startData = data.data.fire_start_data as GameActionFireStartData[]
  }

  get type(): string { return "fire_start" }

  needed(index: number): number {
    return fireStartTarget(
      this.map, new Coordinate(this.target[index].x, this.target[index].y), this.startData[index].vehicle,
      this.startData[index].incendiary, this.startData[index].vehicle_incendiary
    )
  }

  indexValue(index: number): string {
    const need = this.needed(index)
    const dice = this.diceResult[index].result
    let result = `<span style="color: ${passBlue()};">no effect</span>`
    if (need >= dice.result) {
      result = `blaze <span style="color: ${failRed()};">starts</span>`
    } else if (dice.result <= 7 && this.startData[index].vehicle && this.startData[index].tank) {
      result += `, <span style="color: ${passGreen()};">crew escapes</span>`
    }
    const loc = formatCoordinate(new Coordinate(this.target[index].x, this.target[index].y))
    return need < 2 ? `checking to see if crew escapes in ${loc}: on 7 or less, ` +
        `rolled ${formatDieResult(dice)}` +
        `: ${ result }` :
      `checking to see if blaze starts in ${loc}: on ${formatTarget(need)} or less${
          this.startData[index].tank && need < 7 ? " (crew escapes on 7 or less)" : "" }, ` +
        `rolled ${formatDieResult(dice)}` +
        `: ${ result }`
  }

  get htmlValue(): string {
    const rc: string[] = []
    for (let i = 0; i < this.target.length; i++) {
      rc.push(this.indexValue(i))
    }
    return rc.join(", ")
  }

  get undoPossible() {
    return false
  }

  mutateGame(): void {
    for (let i = 0; i < this.target.length; i++) {
      const loc = new Coordinate(this.target[i].x, this.target[i].y)
      const dice = this.diceResult[i].result
      if (dice.result <= this.needed(i)) {
        this.map.addFire(loc)
        this.game.observeNeeded.push(loc)
      } else if (dice.result <= 7 && this.startData[i].vehicle && this.startData[i].tank) {
        const unit = new Unit(unitDataForTankCrew(`uf-${this.game.actions.length}`, this.startData[i].nation as string))
        unit.playerNation = this.startData[i].player_nation as string
        unit.exhaust()
        this.map.addCounter(loc, unit)
        this.game.moraleChecksNeeded.push({ unit, from: [loc], to: loc, incendiary: false, critical: false })
        this.game.addActionAnimations([{ loc, type: "crewescape" }])
        if (this.game.currentPlayerNation !== unit.playerNation) { this.game.togglePlayer() }
      }
    }
    this.game.fireStartCheckNeeded = []
  }
}
