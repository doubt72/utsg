import { Coordinate, Direction, movementType } from "../../utilities/commonTypes";
import Feature from "../Feature";
import Game from "../Game";
import { GameMoveData } from "../GameMove";
import Unit from "../Unit";
import BaseMove from "./BaseMove";

export default class PlacementMove extends BaseMove {
  description: string = "";
  originIndex: number;
  target: Coordinate;
  orientation: Direction;

  constructor(data: GameMoveData) {
    super(data)

    this.validate(data.data.originIndex)
    this.validate(data.data.target)
    this.validate(data.data.orientation)

    // Validate will already error out if data is missing, but the linter can't tell
    this.originIndex = data.data.originIndex as number
    this.target = data.data.target as Coordinate
    this.orientation = data.data.orientation as Direction
  }

  get stringValue() {
    return this.description;
  }

  get undoPossible() { return true }

  mutateGame(game: Game): void {
    const scenario = game.scenario
    const map = scenario.map

    const turn = game.turn

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
  }

  undo(game: Game): void {
    const scenario = game.scenario
    const map = scenario.map

    const turn = game.turn

    map.popUnit(this.target) // throw away result, don't need it

    if (this.player === 1) {
      scenario.replaceAxisReinforcement(turn, this.originIndex)
    } else {
      scenario.replaceAlliedReinforcement(turn, this.originIndex)
    }
  }
}
