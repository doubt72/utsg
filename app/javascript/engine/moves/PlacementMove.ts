import { Coordinate } from "../../utilities/commonTypes";
import Game from "../Game";
import { GameMoveData } from "../GameMove";
import BaseMove from "./BaseMove";

export default class PlacementMove extends BaseMove {
  description: string = "";
  originIndex: number;
  target: Coordinate;

  constructor(data: GameMoveData) {
    super(data)

    this.validate(data.data.originIndex)
    this.validate(data.data.target)

    // Validate will already error out if data is missing, but the linter can't tell
    this.originIndex = data.data.originIndex as number
    this.target = data.data.target as Coordinate
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
