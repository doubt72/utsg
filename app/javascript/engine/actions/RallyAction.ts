import { Coordinate, unitStatus } from "../../utilities/commonTypes";
import { coordinateToLabel } from "../../utilities/utilities";
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
    return 12 - this.moraleBase - this.leaderMod - this.terrainMod +
      (this.nextToEnemy ? 1 : 0)
  }

  get passed(): boolean {
    if (this.diceResult.result === 2) { return false }
    return this.diceResult.result >= this.rollNeeded || this.diceResult.result === 20
  }

  get stringValue(): string {
    const unit = this.game.findUnitById(this.target.id) as Unit
    const action = unit.canCarrySupport ? "rally check" : "attempt to fix weapon"
    const succeed = unit.canCarrySupport ? "rallies" : "repaired"
    const fail = unit.canCarrySupport ? "fails to rally" :
      ( this.diceResult.result <= this.breakRoll ? "is destroyed" : "remains broken" )
    const result = `${this.passed ? "passed" : (
      !unit.canCarrySupport && this.diceResult.result <= this.breakRoll ?
        "catastrophic failure" : "failed"
    ) }: ` + `${unit?.name} ${this.passed ? succeed : fail}`
    return `${action} at ${coordinateToLabel(new Coordinate(this.target.x, this.target.y))}` +
      `: needed ${this.rollNeeded}, got ${this.diceResult.result}, ${result}`
  }

  get undoPossible() {
    return false
  }

  mutateGame(): void {
    const unit = this.game.findUnitById(this.target.id) as Unit
    if (this.passed) {
      if (unit.isBroken) { unit.status = unitStatus.Normal }
      if (unit.jammed) { unit.jammed = false }
    } else if (!unit.canCarrySupport && this.diceResult.result <= this.breakRoll ) {
      unit.jammed = false
      this.game.scenario.map.eliminateCounter(
        new Coordinate(this.target.x, this.target.y), this.target.id
      )
    }
    this.game.clearGameState()
  }
}
