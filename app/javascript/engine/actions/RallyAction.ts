import { Coordinate } from "../../utilities/commonTypes";
import { failRed, formatCoordinate, formatDieResult, formatNation, passGreen } from "../../utilities/graphics";
import { baseRally } from "../../utilities/utilities";
import Game from "../Game";
import { GameActionData, GameActionDiceResult, GameActionUnit } from "../GameAction";
import Unit from "../Unit";
import BaseAction from "./BaseAction";

export default class RallyAction extends BaseAction {
  target: GameActionUnit;
  diceResult: GameActionDiceResult;
  freeRally: boolean;

  leaderMod: number;
  moraleBase: number;
  terrainMod: number;
  nextToEnemy: boolean;

  fixRoll: number;
  breakRoll: number;

  constructor(data: GameActionData, game: Game, index: number) {
    super(data, game, index)

    this.validate(data.data.target)
    this.validate(data.data.dice_result)
    this.validate(data.data.rally_data?.free_rally)
    this.target = (data.data.target as GameActionUnit[])[0]
    this.diceResult = (data.data.dice_result as GameActionDiceResult[])[0]
    this.freeRally = data.data.rally_data?.free_rally as boolean
    this.leaderMod = data.data.rally_data?.infantry?.leader_mod ?? 0
    this.moraleBase = data.data.rally_data?.infantry?.morale_base ?? 0
    this.terrainMod = data.data.rally_data?.infantry?.terrain_mod ?? 0
    this.nextToEnemy = data.data.rally_data?.infantry?.next_to_enemy ?? false
    this.fixRoll = data.data.rally_data?.weapon?.fix_roll ?? 0
    this.breakRoll = data.data.rally_data?.weapon?.break_roll ?? 0
  }

  get type(): string { return "rally" }

  get rollNeeded(): number {
    const unit = this.game.findUnitById(this.target.id) as Unit
    if (!unit.canCarrySupport) { return this.fixRoll }
    return baseRally - this.moraleBase - this.leaderMod - this.terrainMod +
      (this.nextToEnemy ? 1 : 0)
  }

  get passed(): boolean {
    const roll = this.diceResult.result.result
    if (roll === 2) { return false }
    return roll > this.rollNeeded || roll === 20
  }

  get htmlValue(): string {
    const roll = this.diceResult.result.result
    const nation = formatNation(this.game, this.player)
    const unit = this.game.findUnitById(this.target.id) as Unit
    const action = unit.canCarrySupport ? "rally check" : "attempt to fix weapon"
    const succeed = unit.canCarrySupport ? "rallies" : "is repaired"
    const fail = unit.canCarrySupport ? `fails to rally` :
      ( roll <= this.breakRoll ? `is <span style="color: ${failRed};">eliminated</span>` : "remains broken" )
    const result = `${this.passed ? `<span style="color: ${passGreen};">passed</span>` : (
      !unit.canCarrySupport && roll <= this.breakRoll ? `catastrophic <span style="color: ${failRed};">failure</span>` : `<span style="color: ${failRed};">failed</span>`
    ) }: ` + `${formatNation(this.game, this.player, unit.name)} ${this.passed ? succeed : fail}`
    return `${nation} ${action} at ${formatCoordinate(new Coordinate(this.target.x, this.target.y))}` +
      `: needed ${this.rollNeeded}, rolled ${formatDieResult(this.diceResult.result)}, ${result}`
  }

  get undoPossible() {
    return false
  }

  mutateGame(): void {
    const unit = this.game.findUnitById(this.target.id) as Unit
    const loc = new Coordinate(this.target.x, this.target.y)
    if (this.passed) {
      if (unit.isBroken) {
        unit.resetStatus()
        this.game.addActionAnimations([{ loc, type: "rally" }])
      }
      if (unit.jammed) {
        unit.jammed = false
        this.game.addActionAnimations([{ loc, type: "fix" }])
      }
    } else if (!unit.canCarrySupport && this.diceResult.result.result <= this.breakRoll ) {
      unit.jammed = false
      this.game.scenario.map.eliminateCounter(loc, this.target.id)
      this.game.addActionAnimations([{ loc, type: "destroyed" }])
    } else {
      this.game.addActionAnimations([{ loc, type: "norally" }])
    }
    this.game.clearGameState()
  }
}
