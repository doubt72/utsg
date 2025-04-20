import { Coordinate, Direction, movementType } from "../../utilities/commonTypes";
import { coordinateToLable } from "../../utilities/utilities";
import Feature from "../Feature";
import Game from "../Game";
import { GameMoveData } from "../GameMove";
import Unit from "../Unit";
import BaseMove from "./BaseMove";

export default class PlacementMove extends BaseMove {
  originIndex: number;
  target: Coordinate;
  orientation: Direction;
  turn: number;

  constructor(data: GameMoveData, game: Game, index: number) {
    super(data, game, index)

    this.validate(data.data.originIndex)
    this.validate(data.data.target)
    this.validate(data.data.orientation)
    this.validate(data.data.turn)

    // Validate will already error out if data is missing, but the linter can't tell
    this.originIndex = data.data.originIndex as number
    this.target = new Coordinate((data.data.target ?? [0])[0], (data.data.target ?? [0, 0])[1])
    this.orientation = data.data.orientation as Direction
    this.turn = data.data.turn as number
  }

  get stringValue(): string {
    const name = this.player === 1 ?
      this.game.scenario.axisReinforcements[this.game.turn][this.originIndex].counter.name :
      this.game.scenario.alliedReinforcements[this.game.turn][this.originIndex].counter.name
    return `placed ${name} at ${coordinateToLable(this.target)}${this.undone ? " [cancelled]" : ""}`;
  }

  get undoPossible() { return true }

  mutateGame(): void {
    const scenario = this.game.scenario
    const map = scenario.map

    const turn = this.game.turn

    const uf = this.player === 1 ?
      scenario.takeAxisReinforcement(turn, this.originIndex) :
      scenario.takeAlliedReinforcement(turn, this.originIndex)

    if (
      (uf.isFeature && (uf as Feature).coverSides) ||
      (!uf.isFeature && (uf as Unit).movementType !== movementType.Foot)
    ) {
      uf.facing = this.orientation;
    }
    map.addUnit(this.target, uf)
    this.game.checkPhase()
  }

  undo(): void {
    const scenario = this.game.scenario
    const map = scenario.map

    const turn = this.game.turn

    map.popUnit(this.target) // throw away result, don't need it

    if (this.player === 1) {
      scenario.replaceAxisReinforcement(turn, this.originIndex)
    } else {
      scenario.replaceAlliedReinforcement(turn, this.originIndex)
    }
    this.undone = true;
  }
}
