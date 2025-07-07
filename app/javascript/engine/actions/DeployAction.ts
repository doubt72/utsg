import { Coordinate, Direction } from "../../utilities/commonTypes";
import { coordinateToLable } from "../../utilities/utilities";
import Game from "../Game";
import { GameActionPath, GameActionData, GameActionReinforcementUnit } from "../GameAction";
import Unit from "../Unit";
import BaseAction from "./BaseAction";

export default class DeployAction extends BaseAction {
  target: Coordinate;
  orientation: Direction;
  rTurn: number;
  rIndex: number;
  rId: string;

  constructor(data: GameActionData, game: Game, index: number) {
    super(data, game, index)

    this.validate(data.data.deploy)
    // Validate will already error out if data is missing, but the linter can't tell
    const deploy = data.data.deploy as GameActionReinforcementUnit[]
    this.validate(deploy[0])
    this.validate(data.data.path)
    const path = data.data.path as GameActionPath[]
    this.validate(path[0])

    this.target = new Coordinate(path[0].x, path[0].y)
    this.orientation = path[0].facing ?? 1
    this.rIndex = deploy[0].index
    this.rTurn = deploy[0].turn
    this.rId = deploy[0].id
  }

  get type(): string { return "deploy" }

  get stringValue(): string {
    const name = this.player === 1 ?
      this.game.scenario.alliedReinforcements[this.rTurn][this.rIndex].counter.name :
      this.game.scenario.axisReinforcements[this.rTurn][this.rIndex].counter.name
    return `deployed ${this.game.nationNameForPlayer(this.player)} unit: ${name} to ${
      coordinateToLable(this.target)}${this.undone ? " [cancelled]" : ""}`
  }

  get undoPossible() { return true }

  mutateGame(): void {
    const scenario = this.game.scenario
    const map = scenario.map

    const turn = this.rTurn

    const uf = this.player === 1 ?
      scenario.takeAlliedReinforcement(turn, this.rIndex) :
      scenario.takeAxisReinforcement(turn, this.rIndex)
    if (!uf.isFeature) {
      (uf as Unit).playerNation = this.player === 1 ? scenario.alliedFactions[0] : scenario.axisFactions[0]
    }
    if (uf.rotates) {
      uf.facing = this.orientation
      if (!uf.isFeature) {
        const unit = uf as Unit
        unit.turretFacing = this.orientation
      }
    }
    uf.id = this.rId
    map.addCounter(this.target, uf)
  }

  undo(): void {
    const scenario = this.game.scenario
    const map = scenario.map

    if (this.player === 1) {
      scenario.replaceAlliedReinforcement(this.rTurn, this.rIndex)
    } else {
      scenario.replaceAxisReinforcement(this.rTurn, this.rIndex)
    }
    map.removeCounter(this.target, this.rId)
  }
}
