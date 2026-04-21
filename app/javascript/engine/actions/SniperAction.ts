import { Coordinate } from "../../utilities/commonTypes";
import { formatDieResult, formatNation, formatTarget } from "../../utilities/graphics";
import { otherPlayer } from "../../utilities/utilities";
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

  get htmlValue(): string {
    const nation = formatNation(this.game, otherPlayer(this.player))
    const roll = this.diceResult.result
    const check = this.player === 1 ? this.game.axisSniper?.sniperRoll ?? 0 :
      this.game.alliedSniper?.sniperRoll ?? 0
    return `${nation} sniper check: target ${formatTarget(check)}, rolled ${formatDieResult(roll)}, ${
      roll.result > check ? "no effect" : "sniper hit"
    }`
  }

  get undoPossible() {
    return false
  }

  mutateGame(): void {
    this.game.sniperNeeded = []
    const anims = []
    const roll = this.diceResult.result
    const check = this.player === 1 ? this.game.axisSniper?.sniperRoll ?? 0 :
      this.game.alliedSniper?.sniperRoll ?? 0
    if (roll.result <= check) {
      for (const t of this.target) {
        const unit = this.game.findUnitById(t.id) as Unit
        const loc = new Coordinate(t.x, t.y)
        this.game.moraleChecksNeeded.push({ unit, from: [loc], to: loc, incendiary: false, critical: false })
        let found = false
        for (const a of anims) {
          if (a.loc.x === loc.x && a.loc.y === loc.y) { found = true; break }
        }
        if (!found) { anims.push({ loc, type: "sniper" })}
      }
    }
    this.game.closeOverlay = true
    this.game.addActionAnimations(anims)
  }
}
