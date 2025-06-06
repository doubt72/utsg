import { Coordinate, Direction } from "../../utilities/commonTypes";
import { coordinateToLable } from "../../utilities/utilities";
import Feature from "../Feature";
import Game from "../Game";
import { GameMoveData } from "../GameMove";
import Unit from "../Unit";
import BaseMove from "./BaseMove";

export default class DeployMove extends BaseMove {
  originIndex: number;
  target: Coordinate;
  orientation: Direction;
  turn: number;

  constructor(data: GameMoveData, game: Game, index: number) {
    super(data, game, index)

    this.validate(data.data.origin_index)
    this.validate(data.data.target)
    this.validate(data.data.orientation)
    this.validate(data.data.turn)

    // Validate will already error out if data is missing, but the linter can't tell
    this.originIndex = data.data.origin_index as number
    this.target = new Coordinate((data.data.target ?? [0])[0], (data.data.target ?? [0, 0])[1])
    this.orientation = data.data.orientation as Direction
    this.turn = data.data.turn as number
  }

  get type(): string { return "deploy" }

  get stringValue(): string {
    const name = this.player === 1 ?
      this.game.scenario.alliedReinforcements[this.turn][this.originIndex].counter.name :
      this.game.scenario.axisReinforcements[this.turn][this.originIndex].counter.name
    return `deployed unit: ${name} to ${coordinateToLable(this.target)}${this.undone ? " [cancelled]" : ""}`;
  }

  get undoPossible() { return true }

  mutateGame(): void {
    const scenario = this.game.scenario
    const map = scenario.map

    const turn = this.turn

    const uf = this.player === 1 ?
      scenario.takeAlliedReinforcement(turn, this.originIndex) :
      scenario.takeAxisReinforcement(turn, this.originIndex)
    if (!uf.isFeature) {
      (uf as Unit).playerNation = this.player === 1 ? scenario.alliedFactions[0] : scenario.axisFactions[0]
    }
    if (uf.rotates) {
      uf.facing = this.orientation
      uf.turretFacing = this.orientation
    }
    map.addUnit(this.target, uf)
  }

  undo(): void {
    const scenario = this.game.scenario
    const map = scenario.map

    const turn = this.turn

    let counter: Unit | Feature | undefined = undefined
    if (this.player === 1) {
      scenario.replaceAlliedReinforcement(turn, this.originIndex)
      counter = scenario.alliedReinforcements[turn][this.originIndex].counter
    } else {
      scenario.replaceAxisReinforcement(turn, this.originIndex)
      counter = scenario.axisReinforcements[turn][this.originIndex].counter
    }
    if (counter.isFeature) {
      map.shiftUnit(this.target)
    } else {
      map.popUnit(this.target)
    }
    this.undone = true;
  }
}
