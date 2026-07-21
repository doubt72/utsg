import { Coordinate } from "../../utilities/commonTypes";
import { formatCoordinate, formatNation } from "../../utilities/graphics";
import Game from "../Game";
import { GameActionData, GameActionPath, GameActionUnit } from "../GameAction";
import BaseAction from "./BaseAction";

export default class ShortMoveAction extends BaseAction {
  target: GameActionUnit[];
  path: GameActionPath[];
  skip: boolean;

  constructor(data: GameActionData, game: Game, index: number) {
    super(data, game, index)

    this.validate(data.data.target)
    this.validate(data.data.path)
    this.validate(data.data.short_move_data?.skip)

    this.target = data.data.target as GameActionUnit[]
    this.path = data.data.path as GameActionPath[]
    this.skip = data.data.short_move_data?.skip as boolean
  }

  get type(): string { return "short_move" }

  get htmlValue(): string {
    let rc = ""
    rc += `${formatNation(this.game, this.player)} ${this.skip ? "chose" : "chose not"} to stop `
    rc += this.target.map(t => {
      return (formatNation(this.game, this.player, t.name))
    }).join(", ")
    rc += ` short at ${formatCoordinate(new Coordinate(this.path[0].x, this.path[0].y))}`
    return rc
  }

  get undoPossible() {
    return true
  }

  mutateGame(): void {
    if (!this.skip) {
      for (let i = 0; i < this.target.length; i++) {
        const t = this.target[i]
        this.map.moveUnit(
          new Coordinate(this.path[i+1].x, this.path[i+1].y),
          new Coordinate(this.path[0].x, this.path[0].y), t.id
        )
      }
    }
    this.game.shortCheckNeeded.hit = false
    if (this.game.sniperNeeded.length > 0) {
      this.game.setCurrentPlayer(
        this.game.playerOneNation === this.game.sniperNeeded[0].unit.playerNation ? 1 : 2
      )
    } else {
      this.game.resetCurrentPlayer()
    }
  }

  undo(): void {
    if (!this.skip) {
      for (let i = 0; i < this.target.length; i++) {
        const t = this.target[i]
        this.map.moveUnit(
          new Coordinate(this.path[0].x, this.path[0].y),
          new Coordinate(this.path[i+1].x, this.path[i+1].y), t.id
        )
      }
    }
    this.game.shortCheckNeeded = {
      hit: true, short: true, ids: this.target.map(t => t.id),
      coords: [...this.path]
    }
  }
}