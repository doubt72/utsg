import { Coordinate } from "../../utilities/commonTypes";
import { failRed, formatCoordinate, formatNation } from "../../utilities/graphics";
import Game from "../Game";
import { GameActionAddAction, gameActionAddActionType, GameActionData, GameActionPath, GameActionUnit } from "../GameAction";
import { sortStacks } from "../support/organizeStacks";
import Unit from "../Unit";
import BaseAction from "./BaseAction";
import IllegalActionError from "./IllegalActionError";

export default class RouteMoveAction extends BaseAction {
  target: GameActionUnit
  addActions: GameActionAddAction[]
  path: GameActionPath[]
  optional: boolean

  constructor(data: GameActionData, game: Game, index: number, optional: boolean) {
    super(data, game, index)

    this.validate(data.data.target as GameActionUnit[])
    this.validate(data.data.add_action as GameActionAddAction[])
    this.validate(data.data.path as GameActionPath[])

    this.target = (data.data.target as GameActionUnit[])[0]
    this.addActions = (data.data.add_action as GameActionAddAction[])
    this.path = data.data.path as GameActionPath[]
    this.optional = optional
  }

  get type(): string { return this.optional ? "rout_self" : "rout_move" }

  get htmlValue(): string {
    const unit = this.game.findUnitById(this.target.id) as Unit
    const start = formatCoordinate(new Coordinate(this.target.x, this.target.y))
    const nation = formatNation(this.game, this.player)
    let rc = `${nation} ${formatNation(this.game, this.player, unit.name)} at ${start} routs `
    if (this.path.length > 0) {
      const last = this.path.length - 1
      const end = formatCoordinate(new Coordinate(this.path[last].x, this.path[last].y))
      rc += ` to ${end}`
    } else {
      rc += ` and is <span style="color: ${failRed};">eliminated</span>`
    }
    for (const a of this.addActions) {
      if (a.type === gameActionAddActionType.Drop) {
        const child = this.game.findUnitById(a.id as string) as Unit
        rc += `, ${formatNation(this.game, this.player, child.name)} dropped`
      }
    }
    return rc
  }

  get undoPossible() {
    return this.optional
  }

  mutateGame(): void {
    const start = new Coordinate(this.target.x, this.target.y)
    for (const a of this.addActions) {
      if (a.type === gameActionAddActionType.Drop) {
        this.map.dropUnit(start, start, a.id as string, a.facing)
      } else if (a.type === gameActionAddActionType.VP) {
        this.map.toggleVP(new Coordinate(a.x, a.y))
      }
    }
    const unit = this.game.findUnitById(this.target.id) as Unit
    if (this.path.length > 0) {
      const last = this.path.length - 1
      const end = new Coordinate(this.path[last].x, this.path[last].y)
      this.map.moveUnit(start, end, this.target.id)
      unit.routed = true
    } else {
      unit.resetStatus()
      this.map.eliminateCounter(start, this.target.id)
    }
    sortStacks(this.map)
    if (this.optional) {
      this.game.updateInitiative(1)
    } else {
      this.game.routNeeded.shift()
      if (this.game.routNeeded.length < 1 && this.game.routCheckNeeded.length < 1) { this.game.togglePlayer() }
    }
  }
  
  undo(): void {
    if (!this.optional) { throw new IllegalActionError("internal error undoing rout") }
    const start = new Coordinate(this.target.x, this.target.y)
    const unit = this.game.findUnitById(this.target.id) as Unit
    if (this.path.length > 0) {
      const last = this.path.length - 1
      const end = new Coordinate(this.path[last].x, this.path[last].y)
      this.map.moveUnit(end, start, this.target.id)
      unit.routed = false
    } else {
      throw new IllegalActionError("rout elimination undo should happen")
    }
    for (const a of this.addActions) {
      if (a.type === gameActionAddActionType.Drop) {
        this.map.loadUnit(start, start, a.id as string, unit.id, a.facing)
      } else if (a.type === gameActionAddActionType.VP) {
        this.map.toggleVP(new Coordinate(a.x, a.y))
      }
    }
    sortStacks(this.map)
    this.game.initiative = this.data.old_initiative
  }
}
