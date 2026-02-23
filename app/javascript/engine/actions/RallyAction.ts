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
  terrainMod: number;
  nextToEnemy: boolean;

  constructor(data: GameActionData, game: Game, index: number) {
    super(data, game, index)

    this.validate(data.data.target)
    this.validate(data.data.dice_result)
    this.validate(data.data.rally_data?.freeRally)
    this.validate(data.data.rally_data?.leaderMod)
    this.validate(data.data.rally_data?.terrainMod)
    this.validate(data.data.rally_data?.nextToEnemy)
    this.target = (data.data.target as GameActionUnit[])[0]
    this.diceResult = (data.data.dice_result as GameActionDiceResult[])[0]
    this.freeRally = data.data.rally_data?.freeRally as boolean
    this.leaderMod = data.data.rally_data?.leaderMod as number
    this.terrainMod = data.data.rally_data?.terrainMod as number
    this.nextToEnemy = data.data.rally_data?.nextToEnemy as boolean
  }

  get type(): string { return "rally" }

  get rollNeeded(): number {
    return 15 - this.leaderMod - this.terrainMod + (this.nextToEnemy ? 1 : 0)
  }

  get passed(): boolean {
    if (this.diceResult.result === 2) { return false }
    return this.diceResult.result >= this.rollNeeded || this.diceResult.result === 20
  }

  get stringValue(): string {
    const unit = this.game.findUnitById(this.target.id) as Unit
    const succeed = unit.canCarrySupport ? 'rallies' : 'unbroken'
    const fail = unit.canCarrySupport ? 'fails to rally' : 'remains broken'
    const result = `${this.passed ? "passed" : "failed"}: ` +
      `${unit?.name} ${this.passed ? succeed : fail}`
    return `rally check at ${coordinateToLabel(new Coordinate(this.target.x, this.target.y))}` +
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
    }
  }
}
