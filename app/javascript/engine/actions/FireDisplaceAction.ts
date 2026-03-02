import { Coordinate, unitStatus } from "../../utilities/commonTypes";
import { coordinateToLabel } from "../../utilities/utilities";
import Game from "../Game";
import { GameActionAddAction, GameActionData, GameActionPath, GameActionUnit } from "../GameAction";
import { sortStacks } from "../support/organizeStacks";
import Unit from "../Unit";
import BaseAction from "./BaseAction";

export default class FireDisplaceAction extends BaseAction {
  target: GameActionUnit
  path: GameActionPath[]
  addAction: GameActionAddAction | undefined

  constructor(data: GameActionData, game: Game, index: number) {
    super(data, game, index)

    this.validate(data.data.target as GameActionUnit[])
    this.validate(data.data.path as GameActionPath[])
    this.validate(data.data.add_action as GameActionAddAction[])

    this.target = (data.data.target as GameActionUnit[])[0]
    this.path = data.data.path as GameActionPath[]
    this.addAction = (data.data.add_action as GameActionAddAction[])[0]
  }

  get type(): string { return "fire_displace" }

  get stringValue(): string {
    const unit = this.game.findUnitById(this.target.id) as Unit
    const start = coordinateToLabel(new Coordinate(this.target.x, this.target.y))
    const nation = this.game.nationNameForPlayer(this.player)
    let rc = `${nation} ${unit.name} at ${start} is displaced by fire `
    if (this.path.length > 1) {
      const end = coordinateToLabel(new Coordinate(this.path[1].x, this.path[1].y))
      rc += `to ${end}`
    } else {
      rc += "and is eliminated"
    }
    if (this.addAction) {
      const child = this.game.findUnitById(this.addAction.id as string) as Unit
      rc += `, ${child.name} dropped`
    }
    if (this.undone) { rc += " [cancelled]"}
    return rc
  }

  get undoPossible() {
    return true
  }

  mutateGame(): void {
    const start = new Coordinate(this.target.x, this.target.y)
    if (this.addAction) {
      this.map.dropUnit(start, start, this.addAction.id as string, this.addAction.facing)
    }
    const unit = this.game.findUnitById(this.target.id) as Unit
    if (this.path.length > 1) {
      const end = new Coordinate(this.path[1].x, this.path[1].y)
      this.map.moveUnit(start, end, this.target.id)
    } else {
      unit.status = unitStatus.Normal
      this.map.eliminateCounter(start, this.target.id)
    }
    sortStacks(this.map)
  }
  
  undo(): void {
    const start = new Coordinate(this.path[0].x, this.path[0].y)
    const unit = this.game.findUnitById(this.target.id) as Unit
    if (this.path.length > 1) {
      const end = new Coordinate(this.path[1].x, this.path[1].y)
      this.map.moveUnit(end, start, this.target.id)
      unit.routed = false
    } else {
      unit.status = this.target.status
      this.map.addCounter(
        new Coordinate(this.path[0].x, this.path[0].y), this.game.findUnitById(this.target.id) as Unit
      )
      this.game.removeEliminatedCounter(this.target.id)
    }
    if (this.addAction) {
      this.map.loadUnit(start, start, this.addAction.id as string, unit.id, this.addAction.facing)
    }
    sortStacks(this.map)
    this.game.initiative = this.data.old_initiative
  }
}
