import { Coordinate, featureType } from "../../utilities/commonTypes";
import { smokeRoll } from "../../utilities/utilities";
import Feature from "../Feature";
import Game from "../Game";
import { GameActionPath, GameActionUnit, AddAction, GameActionData, GameActionDiceResult, addActionType } from "../GameAction";
import { sortStacks } from "../support/organizeStacks";
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
    return `somebody moved${this.undone ? " [cancelled]" : ""}`;
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
    }

    let diceIndex = 0
    for (const a of this.addAction) {
      const mid = new Coordinate(a.x, a.y)
      if (a.type === addActionType.VP) {
        map.toggleVP(mid)
      } else if (a.type === addActionType.Drop) {
        if (a.parent_id) {
          map.dropUnit(end, mid, a.id as string)
        } else {
          map.moveUnit(end, mid, a.id as string)
        }
      } else if (a.type === addActionType.Load) {
        map.loadUnit(mid, end, a.id as string, a.parent_id as string)
      } else if (a.type === addActionType.Smoke) {
        const hindrance = smokeRoll(this.diceResults[diceIndex++].result)
        map.addCounter(mid, new Feature(
          { ft: 1, t: featureType.Smoke, n: "Smoke", i: "smoke", h: hindrance, id: a.id }
        ))
      }
    }
    sortStacks(map)
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
        if (a.parent_id) {
          map.loadUnit(mid, end, a.id as string, a.parent_id as string)
        } else {
          map.moveUnit(mid, end, a.id as string)
        }
      } else if (a.type === addActionType.Load) {
        map.dropUnit(end, mid, a.id as string)
      } else if (a.type === addActionType.Smoke) {
        // Shouldn't happen
        throw new IllegalActionError("internal error undoing smoke")
      }
    }

    for (const u of this.origin) {
      map.moveUnit(end, start, u.id, facing, turret)
    }
    this.undone = true;
    sortStacks(map)
  }
}