import { Coordinate, unitStatus } from "../../utilities/commonTypes";
import { coordinateToLable, normalDir } from "../../utilities/utilities";
import Counter from "../Counter";
import Feature from "../Feature";
import Game from "../Game";
import { GameActionPath, GameActionUnit, AddAction, GameActionData, addActionType } from "../GameAction";
import { sortStacks } from "../support/organizeStacks";
import Unit from "../Unit";
import BaseAction from "./BaseAction";

export default class AssaultMoveAction extends BaseAction {
  origin: GameActionUnit[];
  path: GameActionPath[];
  addAction: AddAction[];

  constructor(data: GameActionData, game: Game, index: number) {
    super(data, game, index)

    this.validate(data.data.origin)
    this.validate(data.data.path)
    this.validate(data.data.add_action)

    // Validate will already error out if data is missing, but the linter can't tell
    this.origin = data.data.origin as GameActionUnit[]
    this.path = data.data.path as GameActionPath[]
    this.addAction = data.data.add_action as AddAction[]
  }

  get type(): string { return "assault_move" }

  get stringValue(): string {
    const start = new Coordinate(this.path[0].x, this.path[0].y)
    const end = new Coordinate(this.lastPath.x, this.lastPath.y)
    const nation = this.game.nationNameForPlayer(this.player)
    const units = this.origin.map(u => (this.game.findUnitById(u.id) as Unit).name).join(", ")
    const actions = [this.path.length > 1 ?
      `${nation} ${units} assault moved from ${coordinateToLable(start)} to ${coordinateToLable(end)}` :
      `${nation} ${units} at ${coordinateToLable(start)}`
    ]
    this.addAction.forEach(a => {
      const feature = this.game.findCounterById(a.id ?? "") as Counter
      if (a.type === addActionType.Clear) {
        actions.push(`cleared ${feature.feature.name}`)
      } else if (a.type === addActionType.Entrench) {
        actions.push("dug in")
      } else if (a.type !== addActionType.VP) {
        actions.push("unexpected action")
      }
    })
    return `${actions.join(" ")}${this.undone ? " [cancelled]" : ""}`;
  }

  get lastPath(): GameActionPath {
    const length = this.path.length
    return this.path[length - 1]
  }

  get undoPossible() {
    return true
  }

  mutateGame(): void {
    const map = this.game.scenario.map
    const start = new Coordinate(this.path[0].x, this.path[0].y)
    const length = this.path.length

    if (length > 1) {
      const end = new Coordinate(this.path[1].x, this.path[1].y)
      const facing = this.path[1].facing
      const turret = this.path[1].turret
      for (const u of this.origin) {
        map.moveUnit(start, end, u.id, facing, turret)
        const unit = this.game.scenario.map.unitAtId(end, u.id) as Counter
        if (facing && unit.unit.transport && unit.unit.children.length > 0 && unit.unit.children[0].crewed) {
          unit.unit.children[0].facing = normalDir(facing + 3)
        }
        unit.unit.status = unitStatus.Exhausted
      }
    }

    for (const a of this.addAction) {
      const mid = new Coordinate(a.x, a.y)
      if (a.type === addActionType.VP) {
        map.toggleVP(mid)
      } else if (a.type === addActionType.Clear) {
        map.eliminateCounter(mid, a.id as string)
      } else if (a.type === addActionType.Entrench) {
        const feature = new Feature({
          ft: 1, n: "Shell Scrape", t: "foxhole", i: "foxhole", d: 1,
        })
        feature.id = `scrap-${mid.x}-${mid.y}`
        map.addCounter(mid, feature)
      }
    }
    sortStacks(map)
    this.game.updateInitiative(3)
  }

  undo(): void {
    const map = this.game.scenario.map
    const start = new Coordinate(this.path[0].x, this.path[0].y)
    const length = this.path.length
    const facing = this.path[0].facing
    const turret = this.path[0].turret

    for (const a of this.addAction) {
      const mid = new Coordinate(a.x, a.y)
      if (a.type === addActionType.VP) {
        map.toggleVP(mid)
      } else if (a.type === addActionType.Clear) {
        const counter = this.game.findCounterById(a.id as string) as Counter
        map.addCounter(mid, counter.feature)
        this.game.removeEliminatedCounter(a.id as string)
      } else if (a.type === addActionType.Entrench) {
        map.removeCounter(mid, `scrap-${mid.x}-${mid.y}` as string)
      }
    }

    if (length > 1) {
      const end = new Coordinate(this.path[1].x, this.path[1].y)
      for (const u of this.origin) {
        map.moveUnit(end, start, u.id, facing, turret)
        const unit = map.unitAtId(start, u.id) as Counter
        if (u.status !== undefined) {
          unit.unit.status = u.status
        }
        if (facing && unit.unit.transport && unit.unit.children.length > 0 && unit.unit.children[0].crewed) {
          unit.unit.children[0].facing = normalDir(facing + 3)
        }
      }
    }
    sortStacks(map)
    this.game.initiative = this.data.old_initiative
  }
}
