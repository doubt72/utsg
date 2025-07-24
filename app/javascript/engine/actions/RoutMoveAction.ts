import { Coordinate, unitStatus } from "../../utilities/commonTypes";
import { coordinateToLabel } from "../../utilities/utilities";
import Game from "../Game";
import { GameActionAddAction, GameActionData, GameActionPath, GameActionUnit } from "../GameAction";
import { sortStacks } from "../support/organizeStacks";
import Unit from "../Unit";
import BaseAction from "./BaseAction";
import IllegalActionError from "./IllegalActionError";

export default class RouteMoveAction extends BaseAction {
  target: GameActionUnit
  addAction: GameActionAddAction | undefined
  path: GameActionPath[]
  optional: boolean

  constructor(data: GameActionData, game: Game, index: number, optional: boolean) {
    super(data, game, index)

    this.validate(data.data.target as GameActionUnit[])
    this.validate(data.data.add_action as GameActionAddAction[])
    this.validate(data.data.path as GameActionPath[])

    this.target = (data.data.target as GameActionUnit[])[0]
    this.addAction = (data.data.add_action as GameActionAddAction[])[0]
    this.path = data.data.path as GameActionPath[]
    this.optional = optional
  }

  get type(): string { return this.optional ? "rout_self" : "rout_move" }

  get stringValue(): string {
    const unit = this.game.findUnitById(this.target.id) as Unit
    const start = coordinateToLabel(new Coordinate(this.target.x, this.target.y))
    const nation = this.game.nationNameForPlayer(this.player)
    let rc = `${nation} ${unit.name} at ${start} routs `
    if (this.path.length > 0) {
      const last = this.path.length - 1
      const end = coordinateToLabel(new Coordinate(this.path[last].x, this.path[last].y))
      rc += ` to ${end}`
    } else {
      rc += " and is eliminated"
    }
    if (this.addAction) {
      const child = this.game.findUnitById(this.addAction.id as string) as Unit
      rc += `, ${child.name} dropped`
    }
    if (this.undone) { rc += " [cancelled]"}
    return rc
  }

  get undoPossible() {
    return this.optional
  }

  mutateGame(): void {
    const map = this.game.scenario.map
    const start = new Coordinate(this.target.x, this.target.y)
    if (this.addAction) {
      map.dropUnit(start, start, this.addAction.id as string, this.addAction.facing)
    }
    const unit = this.game.findUnitById(this.target.id) as Unit
    if (this.path.length > 0) {
      const last = this.path.length - 1
      const end = new Coordinate(this.path[last].x, this.path[last].y)
      map.moveUnit(start, end, this.target.id)
      unit.routed = true
    } else {
      unit.status = unitStatus.Normal
      this.game.scenario.map.eliminateCounter(start, this.target.id)
    }
    sortStacks(map)
    if (this.optional) {
      this.game.updateInitiative(1)
    } else {
      this.game.routNeeded.shift()
    }
  }
  
  undo(): void {
    if (!this.optional) { throw new IllegalActionError("internal error undoing rout") }
    const map = this.game.scenario.map
    const start = new Coordinate(this.target.x, this.target.y)
    const unit = this.game.findUnitById(this.target.id) as Unit
    if (this.path.length > 0) {
      const last = this.path.length - 1
      const end = new Coordinate(this.path[last].x, this.path[last].y)
      map.moveUnit(end, start, this.target.id)
      unit.routed = false
    } else {
      throw new IllegalActionError("rout elimination undo should happen")
    }
    if (this.addAction) {
      map.loadUnit(start, start, this.addAction.id as string, unit.id, this.addAction.facing)
    }
    sortStacks(map)
    this.game.initiative = this.data.old_initiative
  }
}
