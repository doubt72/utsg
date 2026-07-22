import { baseTerrainType, Coordinate, terrainType } from "../../utilities/commonTypes";
import { failRed, formatCoordinate, formatDieResult, formatTarget, passBlue, passGreen } from "../../utilities/graphics";
import Game from "../Game";
import { GameActionData, GameActionDiceResult, GameActionFireStartData, GameActionPath } from "../GameAction";
import Hex from "../Hex";
import Unit from "../Unit";
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
    if ([baseTerrainType.Desert, baseTerrainType.Beach].includes(this.map.baseTerrain) && hex.baseTerrain === terrainType.Open) { check = 1 }
    if (hex.baseTerrain === terrainType.Sand) { check = 1 }
    if (this.startData.vehicle) { check = 4 }
    if (this.startData.incendiary) { check += 2 }
    if (this.startData.vehicle && this.startData.vehicle_incendiary) { check += 2 }
    return check
  }

  get htmlValue(): string {
    let result = `<span style="color: ${passBlue()};">no effect</span>`
    if (this.needed >= this.diceResult.result.result) {
      result = `blaze <span style="color: ${failRed()};">starts</span>`
    } else if (this.diceResult.result.result <= 7 && this.startData.vehicle) {
      result += `, <span style="color: ${passGreen()};">crew escapes</span>`
    }
    const loc = formatCoordinate(new Coordinate(this.hex.x, this.hex.y))
    return `checking to see if blaze starts in ${loc}: on ${formatTarget(this.needed)} or less, ` +
      `rolled ${formatDieResult(this.diceResult.result)}` +
      `: ${ result }`
  }

  get undoPossible() {
    return false
  }

  mutateGame(): void {
    const loc = new Coordinate(this.hex.x, this.hex.y)
    if (this.diceResult.result.result <= this.needed) {
      this.map.addFire(loc)
    } else if (this.diceResult.result.result <= 7 && this.startData.vehicle && this.startData.tank) {
      const unit = new Unit({
        id: `uf-${this.game.actions.length}`, c: this.startData.nation as string,
        t: "tm", n: "Tank Crew", i: "tcrew", y: 0, m: 2, s: 2, f: 1, r: 1, v: 4, o: { tc: 1 },
      })
      unit.playerNation = this.startData.player_nation as string
      unit.exhaust()
      this.map.addCounter(loc, unit)
      this.game.moraleChecksNeeded.push({ unit, from: [loc], to: loc, incendiary: false, critical: false })
      this.game.addActionAnimations([{ loc, type: "crewescape" }])
    }
    this.game.fireStartCheckNeeded = undefined
  }
}
