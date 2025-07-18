import { Coordinate, featureType, unitStatus } from "../../utilities/commonTypes";
import { baseToHit, coordinateToLabel, normalDir, smokeRoll } from "../../utilities/utilities";
import Counter from "../Counter";
import Feature from "../Feature";
import Game from "../Game";
import {
  GameActionPath, GameActionUnit, AddAction, GameActionData, GameActionDiceResult, addActionType,
  GameActionMoveData
} from "../GameAction";
import { sortStacks } from "../support/organizeStacks";
import Unit from "../Unit";
import BaseAction from "./BaseAction";
import IllegalActionError from "./IllegalActionError";

export default class MoveAction extends BaseAction {
  origin: GameActionUnit[];
  path: GameActionPath[];
  addAction: AddAction[];
  moveData?: GameActionMoveData
  diceResults: GameActionDiceResult[];

  rush: boolean;

  constructor(data: GameActionData, game: Game, index: number, rush: boolean) {
    super(data, game, index)

    this.validate(data.data.origin)
    this.validate(data.data.path)
    this.validate(data.data.add_action)
    this.validate(data.data.dice_result)
    this.rush = rush

    // Validate will already error out if data is missing, but the linter can't tell
    this.origin = data.data.origin as GameActionUnit[]
    this.path = data.data.path as GameActionPath[]
    this.addAction = data.data.add_action as AddAction[]
    this.moveData = data.data.move_data
    this.diceResults = data.data.dice_result as GameActionDiceResult[]
  }

  get type(): string { return this.rush ? "rush" : "move" }

  get moveString(): string { return this.rush ? "rushes" : "moves" }

  get stringValue(): string {
    const start = new Coordinate(this.path[0].x, this.path[0].y)
    const end = new Coordinate(this.lastPath.x, this.lastPath.y)
    const nation = this.game.nationNameForPlayer(this.player)
    const units = this.origin.map(u => (this.game.findUnitById(u.id) as Unit).name).join(", ")
    const actions = [this.path.length > 1 ?
      `${nation} ${units} ${this.moveString} from ${coordinateToLabel(start)} to ${coordinateToLabel(end)}` :
      `${nation} ${units} ${this.moveString} at ${coordinateToLabel(start)}`
    ]
    let diceIndex = 0
    let mineAction = undefined
    if (this.moveData?.mines) {
      const mines = this.moveData.mines
      const hitCheck = baseToHit(mines.firepower)
      const unit = this.game.findUnitById(this.origin[0].id) as Unit
      let hitRoll = 0
      if ((unit.armored && mines.antitank) || (!unit.armored && mines.infantry)) {
        hitRoll = this.diceResults[diceIndex++].result
      }
      if (unit.isVehicle && !unit.armored) {
        mineAction = ", vehicle destroyed by mines"
      } else if (unit.isVehicle) {
        if (mines.antitank) {
        const armor = unit.lowestArmor < 0 ? 0 : unit.lowestArmor
          mineAction = `, mine roll (2d10): target ${hitCheck + armor}, rolled ${hitRoll}, `
          if (hitRoll > hitCheck + armor) {
            mineAction += "vehicle destroyed"
          } else {
            mineAction += "no effect"
          }
        } else {
          mineAction = ", AP mines have no effect"
        }
      } else {
        if (mines.infantry) {
          mineAction = `, mine roll (2d10): target ${hitCheck}, rolled ${hitRoll}, `
          if (hitRoll > hitCheck) {
            mineAction += "hit"
          } else {
            mineAction += "missed"
          }
        } else {
          mineAction = ", AT mines have no effect"
        }
      }
    }
    this.addAction.forEach(a => {
      const mid = new Coordinate(a.x, a.y)
      const label = coordinateToLabel(mid)
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
    return `${actions.join(", ")}${ mineAction ? mineAction : "" }${this.undone ? " [cancelled]" : ""}`;
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

    let diceIndex = 0
    let hitCheck = 0
    let hitRoll = 0
    if (this.moveData?.mines) {
      const mines = this.moveData.mines
      hitCheck = baseToHit(mines.firepower)
      const unit = this.game.findUnitById(this.origin[0].id) as Unit
      if ((unit.armored && mines.antitank) || (!unit.armored && mines.infantry)) {
        hitRoll = this.diceResults[diceIndex++].result
      }
    }
    for (const u of this.origin) {
      map.moveUnit(start, end, u.id, facing, turret)
      const unit = this.game.scenario.map.unitAtId(end, u.id) as Counter
      if (facing && unit.unit.transport && unit.unit.children.length > 0 && unit.unit.children[0].crewed) {
        unit.unit.children[0].facing = normalDir(facing + 3)
      }
      unit.unit.status = this.rush ? unitStatus.Exhausted : unitStatus.Activated
      if (this.moveData?.mines) {
        if (unit.unit.isVehicle && !unit.unit.armored) {
          unit.unit.status = unitStatus.Wreck
        } else if (unit.unit.isVehicle) {
          const armor = unit.unit.lowestArmor < 0 ? 0 : unit.unit.lowestArmor
          if (hitRoll > hitCheck + armor) {
            unit.unit.status = unitStatus.Wreck
          }
        } else {
          if (hitRoll > hitCheck) {
            this.game.moraleChecksNeeded.push({ unit: unit.unit, from: [end], to: end, incendiary: true })
          }
        }
      }
    }

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
        const unit = this.game.findUnitById(a.id as string) as Unit
        unit.status = this.rush ? unitStatus.Exhausted : unitStatus.Activated
      } else if (a.type === addActionType.Load) {
        map.loadUnit(mid, end, a.id as string, a.parent_id as string)
        const parent = map.unitAtId(end, a.parent_id ?? "") as Counter
        const child = map.unitAtId(end, a.id ?? "") as Counter
        if (child.unit.rotates && parent.unit.rotates) { child.unit.facing = normalDir(parent.unit.facing + 3) }
        const unit = this.game.findUnitById(a.id as string) as Unit
        unit.status = this.rush ? unitStatus.Exhausted : unitStatus.Activated
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

    if (this.diceResults.length > 0) { throw new IllegalActionError("internal error undoing move dice") }

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
        const unit = this.game.findUnitById(a.id as string) as Unit
        if (a.status !== undefined) { unit.status = a.status }
      } else if (a.type === addActionType.Load) {
        map.dropUnit(end, mid, a.id as string, a.facing)
        const unit = this.game.findUnitById(a.id as string) as Unit
        if (a.status !== undefined) { unit.status = a.status }
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
