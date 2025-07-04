import { Coordinate, featureType, unitStatus } from "../../utilities/commonTypes";
import { coordinateToLable, normalDir, smokeRoll } from "../../utilities/utilities";
import Counter from "../Counter";
import Feature from "../Feature";
import Game from "../Game";
import { GameActionPath, GameActionUnit, AddAction, GameActionData, GameActionDiceResult, addActionType } from "../GameAction";
import { sortStacks } from "../support/organizeStacks";
import Unit from "../Unit";
import BaseAction from "./BaseAction";
import IllegalActionError from "./IllegalActionError";

export default class MoveAction extends BaseAction {
  origin: GameActionUnit[];
  path: GameActionPath[];
  addAction: AddAction[];
  diceResults: GameActionDiceResult[];

  constructor(data: GameActionData, game: Game, index: number) {
    super(data, game, index)

    this.validate(data.data.origin)
    this.validate(data.data.path)
    this.validate(data.data.add_action)
    this.validate(data.data.dice_result)

    // Validate will already error out if data is missing, but the linter can't tell
    this.origin = data.data.origin as GameActionUnit[]
    this.path = data.data.path as GameActionPath[]
    this.addAction = data.data.add_action as AddAction[]
    this.diceResults = data.data.dice_result as GameActionDiceResult[]
  }

  get type(): string { return "move" }

  get stringValue(): string {
    // const map = this.game.scenario.map
    // name(s) moved to (coord), dropping off X, picking up X, smoking X
    const start = new Coordinate(this.path[0].x, this.path[0].y)
    const end = new Coordinate(this.lastPath.x, this.lastPath.y)
    const nation = this.game.nationNameForPlayer(this.player)
    const units = this.origin.map(u => (this.game.findUnitById(u.id) as Unit).name).join(", ")
    const actions = [this.path.length > 1 ?
      `${nation} ${units} moves from ${coordinateToLable(start)} to ${coordinateToLable(end)}` :
      `${nation} ${units} moves at ${coordinateToLable(start)}`
    ]
    let diceIndex = 0
    this.addAction.forEach(a => {
      const mid = new Coordinate(a.x, a.y)
      const label = coordinateToLable(mid)
      if (a.type === addActionType.Drop) {
        const parent = this.game.findUnitById(a.parent_id ?? "")
        const child = this.game.findUnitById(a.id ?? "") as Unit
        if (parent) {
          actions.push(`${child.name} dropped at ${label}`)
        } else {
          actions.push(`${child.name} stopped at ${label}`)
        }
      } else if (a.type === addActionType.Load) {
        const unit = this.game.findUnitById(a.id ?? "") as Unit
        actions.push(`${unit.name} picked up at ${label}`)
      } else if (a.type === addActionType.Smoke) {
        const roll = this.diceResults[diceIndex++]
        actions.push(`smoke level ${smokeRoll(roll.result)} placed at ${label} (from ${
          roll.type} roll result of ${roll.result})`)
      } else if (a.type !== addActionType.VP) {
        actions.push("unexpected action")
      }
    })
    return `${actions.join(", ")}${this.undone ? " [cancelled]" : ""}`;
  }

  get lastPath(): GameActionPath {
    const length = this.path.length
    return this.path[length - 1]
  }

  get undoPossible() {
    return this.diceResults.length < 1
  }

  mutateGame(): void {
    const map = this.game.scenario.map
    const start = new Coordinate(this.path[0].x, this.path[0].y)
    const length = this.path.length
    const end = new Coordinate(this.path[length - 1].x, this.path[length - 1].y)
    const facing = this.path[length - 1].facing
    const turret = this.path[length - 1].turret

    for (const u of this.origin) {
      map.moveUnit(start, end, u.id, facing, turret)
      const unit = this.game.scenario.map.unitAtId(end, u.id) as Counter
      if (facing && unit.unit.transport && unit.unit.children.length > 0 && unit.unit.children[0].crewed) {
        unit.unit.children[0].facing = normalDir(facing + 3)
      }
      unit.unit.status = unitStatus.Activated
    }

    let diceIndex = 0
    for (const a of this.addAction) {
      const mid = new Coordinate(a.x, a.y)
      if (a.type === addActionType.VP) {
        map.toggleVP(mid)
      } else if (a.type === addActionType.Drop) {
        if (a.parent_id) {
          map.dropUnit(end, mid, a.id as string, a.facing)
        } else {
          map.moveUnit(end, mid, a.id as string)
        }
      } else if (a.type === addActionType.Load) {
        map.loadUnit(mid, end, a.id as string, a.parent_id as string)
        const parent = map.unitAtId(end, a.parent_id ?? "") as Counter
        const child = map.unitAtId(end, a.id ?? "") as Counter
        if (child.unit.rotates && parent.unit.rotates) { child.unit.facing = normalDir(parent.unit.facing + 3) }
      } else if (a.type === addActionType.Smoke) {
        const hindrance = smokeRoll(this.diceResults[diceIndex++].result)
        map.addCounter(mid, new Feature(
          { ft: 1, t: featureType.Smoke, n: "Smoke", i: "smoke", h: hindrance, id: a.id }
        ))
      }
    }
    sortStacks(map)
    this.game.updateInitiative(2)
  }

  undo(): void {
    const map = this.game.scenario.map
    const start = new Coordinate(this.path[0].x, this.path[0].y)
    const length = this.path.length
    const end = new Coordinate(this.path[length - 1].x, this.path[length - 1].y)
    const facing = this.path[0].facing
    const turret = this.path[0].turret

    for (const a of this.addAction) {
      const mid = new Coordinate(a.x, a.y)
      if (a.type === addActionType.VP) {
        map.toggleVP(mid)
      } else if (a.type === addActionType.Drop) {
        const parent = map.unitAtId(end, a.parent_id ?? "") as Counter
        const child = map.unitAtId(mid, a.id ?? "") as Counter
        if (a.parent_id) {
          map.loadUnit(mid, end, a.id as string, a.parent_id as string,
            facing && parent.unit.rotates && child.unit.crewed ? normalDir(facing + 3) : undefined
          )
        } else {
          map.moveUnit(mid, end, a.id as string)
        }
      } else if (a.type === addActionType.Load) {
        map.dropUnit(end, mid, a.id as string, a.facing)
      } else if (a.type === addActionType.Smoke) {
        // Shouldn't happen
        throw new IllegalActionError("internal error undoing smoke")
      }
    }

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
    sortStacks(map)
    this.game.initiative = this.data.old_initiative
  }
}