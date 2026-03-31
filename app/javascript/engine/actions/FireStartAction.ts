import { baseTerrainType, Coordinate, terrainType } from "../../utilities/commonTypes";
import { coordinateToLabel } from "../../utilities/utilities";
import Game from "../Game";
import { GameActionData, GameActionDiceResult, GameActionFireStartData, GameActionPath } from "../GameAction";
import Hex from "../Hex";
import BaseAction from "./BaseAction";

export default class FireStartAction extends BaseAction {
  diceResult: GameActionDiceResult;
  hex: GameActionPath;
  startData: GameActionFireStartData;
  
  constructor(data: GameActionData, game: Game, index: number) {
    super(data, game, index)

    this.validate(data.data.dice_result)
    this.validate(data.data.path)
    this.validate(data.data.fire_start_data)
    this.hex = (data.data.path as GameActionPath[])[0]
    this.diceResult = (data.data.dice_result as GameActionDiceResult[])[0]
    this.startData = data.data.fire_start_data as GameActionFireStartData
  }

  get type(): string { return "fire_start" }

  get needed(): number {
    let check = 2
    const hex = this.map.hexAt(new Coordinate(this.hex.x, this.hex.y)) as Hex
    if ([
      terrainType.Forest,
      terrainType.Brush,
      terrainType.Grain,
      terrainType.Orchard,
      terrainType.Palm,
    ].includes(hex.baseTerrain) ) { check = 3 }
    if (this.map.baseTerrain === baseTerrainType.Sand && hex.baseTerrain === terrainType.Open) { check = 1 }
    if (hex.baseTerrain === terrainType.Sand) { check = 1 }
    if (this.startData.vehicle) { check = 4 }
    if (this.startData.incendiary) { check += 2 }
    if (this.startData.vehicle && this.startData.vehicle_incendiary) { check += 2 }
    return check
  }

  get stringValue(): string {
    const loc = coordinateToLabel(new Coordinate(this.hex.x, this.hex.y))
    return `checking to see if blaze starts in ${loc} (2d10): need ${this.needed}, got ${this.diceResult.result}` +
      `: ${ this.needed < this.diceResult.result ? "no effect" : "blaze starts" }`
  }

  get undoPossible() {
    return false
  }

  mutateGame(): void {
    const loc = new Coordinate(this.hex.x, this.hex.y)
    if (this.diceResult.result <= this.needed) {
      this.map.addFire(loc)
    }
    this.game.fireStartCheckNeeded = undefined
  }
}
