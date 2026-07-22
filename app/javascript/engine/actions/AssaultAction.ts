import { Coordinate } from "../../utilities/commonTypes";
import { formatCoordinate, formatNation } from "../../utilities/graphics";
import { normalDir } from "../../utilities/utilities";
import Counter from "../Counter";
import Feature from "../Feature";
import Game from "../Game";
import { GameActionPath, GameActionUnit, GameActionAddAction, GameActionData, gameActionAddActionType, GameActionDiceResult } from "../GameAction";
import { sortStacks } from "../support/organizeStacks";
import Unit, { unitDataForTankCrew } from "../Unit";
import BaseAction from "./BaseAction";
import IllegalActionError from "./IllegalActionError";

export default class AssaultMoveAction extends BaseAction {
  origin: GameActionUnit[];
  path: GameActionPath[];
  addAction: GameActionAddAction[];

  constructor(data: GameActionData, game: Game, index: number) {
    super(data, game, index)

    this.validate(data.data.origin)
    this.validate(data.data.path)
    this.validate(data.data.add_action)

    // Validate will already error out if data is missing, but the linter can't tell
    this.origin = data.data.origin as GameActionUnit[]
    this.path = data.data.path as GameActionPath[]
    this.addAction = data.data.add_action as GameActionAddAction[]
  }

  get type(): string { return "assault_move" }

  get htmlValue(): string {
    const start = new Coordinate(this.path[0].x, this.path[0].y)
    const end = new Coordinate(this.lastPath.x, this.lastPath.y)
    const nation = formatNation(this.game, this.player)
    const units = this.origin.map(u =>
      formatNation(this.game, this.player, u.name)).join(", ")
    const actions = [this.path.length > 1 ?
      `${nation} ${units} assault moved from ${formatCoordinate(start)} to ${formatCoordinate(end)}` :
      `${nation} ${units} at ${formatCoordinate(start)}`
    ]
    this.addAction.forEach(a => {
      if (a.type === gameActionAddActionType.Clear) {
        actions.push(`cleared ${a.name}`)
      } else if (a.type === gameActionAddActionType.Entrench) {
        actions.push("dug in")
      } else if (a.type !== gameActionAddActionType.VP) {
        actions.push("unexpected action")
      }
    })
    return actions.join(" ")
  }

  get lastPath(): GameActionPath {
    const length = this.path.length
    return this.path[length - 1]
  }

  get undoPossible() {
    if (this.addAction.length > 0 && this.addAction[0].type === gameActionAddActionType.Repair) {
      return false
    }
    return true
  }

  mutateGame(): void {
    const start = new Coordinate(this.path[0].x, this.path[0].y)
    const length = this.path.length

    if (length > 1) {
      const end = new Coordinate(this.path[1].x, this.path[1].y)
      const facing = this.path[1].facing
      const turret = this.path[1].turret
      for (const u of this.origin) {
        this.map.moveUnit(start, end, u.id, facing, turret)
        const unit = this.map.unitAtId(end, u.id) as Counter
        if (facing && unit.unit.transport && unit.unit.children.length > 0 && unit.unit.children[0].crewed) {
          unit.unit.children[0].facing = normalDir(facing + 3)
        }
        unit.unit.exhaust()
      }
    } else {
      for (const u of this.origin) {
        const unit = this.map.unitAtId(start, u.id) as Counter
        unit.unit.exhaust()
      }
    }
    const anims = []

    for (const a of this.addAction) {
      const mid = new Coordinate(a.x, a.y)
      if (a.type === gameActionAddActionType.VP) {
        this.map.toggleVP(mid)
      } else if (a.type === gameActionAddActionType.Clear) {
        this.map.eliminateCounter(mid, a.id as string)
        anims.push({ loc: mid, type: "clear" })
      } else if (a.type === gameActionAddActionType.Entrench) {
        if (a.index) { this.map.eliminateCounter(mid, a.id as string) }
        const feature = new Feature({
          id: `scrap-${mid.x}-${mid.y}${a.index ? "-2" : ""}`, ft: 1,
          n: a.index ? "Foxhole" : "Shell Scrape", t: "foxhole", i: "foxhole",
          d: a.index ? 2 : 1,
        })
        this.map.addCounter(mid, feature)
        anims.push({ loc: mid, type: "entrench" })
      } else if (a.type === gameActionAddActionType.Abandon) {
        const counter = this.game.findCounterById(this.origin[0].id as string) as Counter
        counter.unit.abandon()
        const unit = new Unit(unitDataForTankCrew(a.id as string, counter.unit.nation))
        unit.playerNation = counter.unit.playerNation as string
        unit.exhaust()
        const loc = new Coordinate(a.x, a.y)
        this.map.addCounter(loc, unit)
        this.game.addActionAnimations([{ loc, type: "abandoned" }])
      } else if (a.type === gameActionAddActionType.Repair) {
        const counter = this.game.findCounterById(a.id as string) as Counter
        const dr =(this.data.dice_result as GameActionDiceResult[])[0] as GameActionDiceResult
        const loc = new Coordinate(a.x, a.y)
        if (dr.result.result <= 10 + counter.unit.size) {
          counter.unit.repair()
          this.game.addActionAnimations([{ loc, type: "repaired" }])
        } else {
          this.game.addActionAnimations([{ loc, type: "noeffect" }])
        }
      } else if (a.type === gameActionAddActionType.Crew) {
        const counter = this.game.findCounterById(a.id as string) as Counter
        counter.unit.crew()
        counter.unit.exhaust()
        const loc = new Coordinate(a.x, a.y)
        this.map.removeCounter(loc, this.origin[0].id)
      }
    }
    sortStacks(this.map)
    this.game.updateInitiative(3)
    this.game.addActionAnimations(anims)
  }

  undo(): void {
    const start = new Coordinate(this.path[0].x, this.path[0].y)
    const length = this.path.length
    const facing = this.path[0].facing
    const turret = this.path[0].turret

    for (const a of this.addAction) {
      const mid = new Coordinate(a.x, a.y)
      if (a.type === gameActionAddActionType.VP) {
        this.map.toggleVP(mid)
      } else if (a.type === gameActionAddActionType.Clear) {
        const counter = this.game.findCounterById(a.id as string) as Counter
        this.map.addCounter(mid, counter.feature)
        this.game.removeEliminatedCounter(a.id as string)
      } else if (a.type === gameActionAddActionType.Entrench) {
        this.map.removeCounter(mid, `scrap-${mid.x}-${mid.y}${a.index ? "-2" : ""}` as string)
        if (a.index) {
        const feature = new Feature({
            id: `scrap-${mid.x}-${mid.y}`, ft: 1,
            n: "Shell Scrape", t: "foxhole", i: "foxhole", d: 1,
          })
          this.map.addCounter(mid, feature)
        }
      } else if (a.type === gameActionAddActionType.Abandon) {
        const counter = this.game.findCounterById(a.id as string) as Counter
        counter.unit.crew()
        const loc = new Coordinate(a.x, a.y)
        this.map.removeCounter(loc, this.origin[0].id)
      } else if (a.type === gameActionAddActionType.Repair) {
        // Shouldn't happen
        throw new IllegalActionError("internal error undoing repair")
      } else if (a.type === gameActionAddActionType.Crew) {
        const counter = this.game.findCounterById(this.origin[0].id as string) as Counter
        counter.unit.abandon()
        const unit = new Unit(unitDataForTankCrew(a.id as string, counter.unit.nation))
        unit.playerNation = counter.unit.playerNation as string
        const loc = new Coordinate(a.x, a.y)
        this.map.addCounter(loc, unit)
      }
    }

    if (length > 1) {
      const end = new Coordinate(this.path[1].x, this.path[1].y)
      for (const u of this.origin) {
        this.map.moveUnit(end, start, u.id, facing, turret)
        const unit = this.map.unitAtId(start, u.id) as Counter
        if (u.status !== undefined) {
          unit.unit.setStatus(u.status)
        }
        if (facing && unit.unit.transport && unit.unit.children.length > 0 && unit.unit.children[0].crewed) {
          unit.unit.children[0].facing = normalDir(facing + 3)
        }
      }
    } else {
      for (const u of this.origin) {
        const unit = this.map.unitAtId(start, u.id) as Counter
        unit.unit.setStatus(u.status)
      }
    }
    sortStacks(this.map)
    this.game.initiative = this.data.old_initiative
  }
}
