import { Coordinate, Direction, Player, UnitStatus } from "../../utilities/commonTypes"
import Counter from "../Counter"
import { GameActionAddActionType, GameActionMoraleData, GameActionPath, GameActionRoutData } from "../GameAction"

export type ActionType = "d" | "f" | "m" | "am" | "bd" | "i" | "ip" | "mc" | "s" | "r" | "ra" | "rc"
export const actionType: { [index: string]: ActionType } = {
  Deploy: "d", Fire: "f", Move: "m", Assault: "am", Breakdown: "bd", Initiative: "i", Pass: "ip",
  MoraleCheck: "mc", Sniper: "s", Rout: "r", RoutAll: "ra", RoutCheck: "rc",
}

export type ActionSelection = {
  x: number, y: number, id: string, counter: Counter,
}

export type DeployActionState = {
  turn: number, index: number, needsDirection?: [number, number],
}

export type AddAction = {
  type: GameActionAddActionType, x: number, y: number, id?: string, parent_id?: string, cost: number,
  facing?: Direction, status?: UnitStatus, index: number
}

export type FireActionState = {
  initialSelection: ActionSelection[];
  targetSelection: ActionSelection[];
  // For turret facing/changes:
  path: GameActionPath[];
  doneSelect: boolean;
  doneRotating: boolean;
  firingSmoke: boolean;
  targetHexes: Coordinate[];
}

export type MoveActionState = {
  initialSelection: ActionSelection[];
  doneSelect: boolean;
  path: GameActionPath[],
  addActions: AddAction[],
  rotatingTurret: boolean,
  placingSmoke: boolean,
  droppingMove: boolean,
  loadingMove: boolean,
  loader?: Counter,
}

export type AssaultMoveActionState = {
  initialSelection: ActionSelection[];
  doneSelect: boolean;
  path: GameActionPath[],
  addActions: AddAction[],
}

export type RoutPathTree = {
  x: number, y: number, children: RoutPathTree[],
}

export type RoutActionState = {
  optional: boolean, routPathTree: RoutPathTree | false,
}

export type GameActionState = {
  player: Player,
  currentAction: ActionType,
  selection: ActionSelection[],
  deploy?: DeployActionState,
  fire?: FireActionState,
  moraleCheck?: GameActionMoraleData,
  routCheck?: GameActionRoutData,
  move?: MoveActionState,
  assault?: AssaultMoveActionState,
  rout?: RoutActionState,
}