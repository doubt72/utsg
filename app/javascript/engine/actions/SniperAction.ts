import { Coordinate } from "../../utilities/commonTypes";
import { togglePlayer } from "../../utilities/utilities";
import Game from "../Game";
import { GameActionData, GameActionDiceResult, GameActionUnit } from "../GameAction";
import Unit from "../Unit";
import BaseAction from "./BaseAction";

export default class SniperAction extends BaseAction {
  diceResult: GameActionDiceResult;
  target: GameActionUnit[]

  constructor(data: GameActionData, game: Game, index: number) {
    super(data, game, index)

    this.validate(data.data.target as GameActionUnit[])
    this.validate(data.data.dice_result as GameActionDiceResult[])
    
    this.diceResult = (data.data.dice_result as GameActionDiceResult[])[0]
    this.target = (data.data.target as GameActionUnit[])
  }

  get type(): string { return "sniper" }

  get stringValue(): string {
    const nation = this.game.nationNameForPlayer(togglePlayer(this.player))
    const roll = this.diceResult.result
    const check = this.player === 1 ? this.game.axisSniper?.sniperRoll ?? 0 :
      this.game.alliedSniper?.sniperRoll ?? 0
    return `${nation} sniper check (2d10): target ${check}, rolled ${roll}, ${
      roll > check ? "no effect" : "sniper hit"
    }`
  }

  get undoPossible() {
    return false
  }

  mutateGame(): void {
    this.game.sniperNeeded = []
    const roll = this.diceResult.result
    const check = this.player === 1 ? this.game.axisSniper?.sniperRoll ?? 0 :
      this.game.alliedSniper?.sniperRoll ?? 0
    if (roll <= check) {
      for (const t of this.target) {
        const unit = this.game.findUnitById(t.id) as Unit
        const loc = new Coordinate(t.x, t.y)
        this.game.moraleChecksNeeded.push({ unit, from: [loc], to: loc, incendiary: false })
      }
    }
  }
}
