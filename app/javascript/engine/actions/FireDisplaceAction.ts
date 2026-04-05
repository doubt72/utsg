import { Coordinate } from "../../utilities/commonTypes";
import { formatCoordinate, formatNation } from "../../utilities/graphics";
import Game from "../Game";
import { GameActionAddAction, gameActionAddActionType, GameActionData, GameActionPath, GameActionUnit } from "../GameAction";
import { sortStacks } from "../support/organizeStacks";
import Unit from "../Unit";
import BaseAction from "./BaseAction";

export default class FireDisplaceAction extends BaseAction {
  target: GameActionUnit
  path: GameActionPath[]
  addActions: GameActionAddAction[]

  constructor(data: GameActionData, game: Game, index: number) {
    super(data, game, index)

    this.validate(data.data.target as GameActionUnit[])
    this.validate(data.data.path as GameActionPath[])
    this.validate(data.data.add_action as GameActionAddAction[])

    this.target = (data.data.target as GameActionUnit[])[0]
    this.path = data.data.path as GameActionPath[]
    this.addActions = (data.data.add_action as GameActionAddAction[])
  }

  get type(): string { return "fire_displace" }

  get htmlValue(): string {
    const start = formatCoordinate(new Coordinate(this.target.x, this.target.y))
    const nation = formatNation(this.game, this.player)
    let rc = `${nation} ${formatNation(this.game, this.player, this.target.name)} ` +
      `at ${start} is displaced by fire `
    if (this.path.length > 1) {
      const end = formatCoordinate(new Coordinate(this.path[1].x, this.path[1].y))
      rc += `to ${end}`
    } else {
      rc += "and is eliminated"
    }
    for (const a of this.addActions) {
      if (a.type === gameActionAddActionType.Drop) {
        rc += `, ${a.name} dropped`
      }
    }
    return rc
  }

  get undoPossible() {
    return true
  }

  mutateGame(): void {
    const start = new Coordinate(this.target.x, this.target.y)
    for (const a of this.addActions) {
      if (a.type === gameActionAddActionType.VP) {
        this.map.toggleVP(new Coordinate(a.x, a.y))
      } else {
        this.map.dropUnit(start, start, a.id as string, a.facing)
      }
    }
    const unit = this.game.findUnitById(this.target.id) as Unit
    if (this.path.length > 1) {
      const end = new Coordinate(this.path[1].x, this.path[1].y)
      this.map.moveUnit(start, end, this.target.id)
    } else {
      unit.resetStatus()
      this.map.eliminateCounter(start, this.target.id)
    }
    this.game.fireDisplaceNeeded.shift()
    this.game.closeOverlay = true
    if (this.game.fireDisplaceNeeded.length < 1) {
      for (let i = this.game.actions.length - 1; i >= 0; i--) {
        const action = this.game.actions[i]
        if (action.type === "fire_start") {
          this.game.setCurrentPlayer(action.player)
          break
        }
      }
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
      unit.setStatus(this.target.status)
      this.map.addCounter(
        new Coordinate(this.path[0].x, this.path[0].y), this.game.findUnitById(this.target.id) as Unit
      )
      this.game.removeEliminatedCounter(this.target.id)
    }
    for (const a of this.addActions) {
      if (a.type === gameActionAddActionType.VP) {
        this.map.toggleVP(new Coordinate(a.x, a.y))
      } else {
        this.map.loadUnit(start, start, a.id as string, unit.id, a.facing)
      }
    }
    this.game.fireDisplaceNeeded.unshift({ loc: start, unit })
    sortStacks(this.map)
    this.game.initiative = this.data.old_initiative
  }
}
