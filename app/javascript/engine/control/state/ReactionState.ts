import { Coordinate, CounterSelectionTarget, hexOpenType } from "../../../utilities/commonTypes";
import { los } from "../../../utilities/los";
import { hexDistance, togglePlayer } from "../../../utilities/utilities";
import FireAction from "../../actions/FireAction";
import MoveAction from "../../actions/MoveAction";
import Counter from "../../Counter";
import Game from "../../Game";
import GameAction from "../../GameAction";
import { gamePhaseType } from "../../support/gamePhase";
import Unit from "../../Unit";
import BaseState, { stateType } from "./BaseState";

export function reactionFireCheck(game: Game): boolean {
  if (game.gameState) { return false }
  if (game.phase !== gamePhaseType.Main) { return false }
  if (game.lastAction?.type === "info") { return false }
  let rc = false
  let last = ""
  for (const a of game.actions.filter(a => !a.undone)) {
    rc = a.type === "initiative"
    if ([
      "move", "rush", "assault_move", "fire", "intensive_fire", "rout_self", "rout_all",
    ].includes(a.type)) {
      last = a.type
    }
  }
  return rc && ["move", "rush", "fire", "intensive_fire"].includes(last)
}

function reactionTargetCoords(game: Game): Coordinate[] {
  const rc: Coordinate[] = []
  const action = game.lastSignificantAction
  if (action) {
    if (["move", "rush", "assault_move"].includes(action.type)) {
      const move = action as MoveAction
      for (let i = 1; i < move.path.length; i++) {
        let check = false
        for (let j = 1; j < rc.length; j++) {
          if (rc[j].x === move.path[i].x && rc[j].y === move.path[i].y) { check = true; continue }
        }
        if (!check) { rc.push(new Coordinate(move.path[i].x, move.path[i].y)) }
      }
    } else if (["fire", "intensive_fire"].includes(action.type)) {
      const fire = action as FireAction
      for (let i = 1; i < fire.origin.length; i++) {
        let check = false
        for (let j = 1; j < rc.length; j++) {
          if (rc[j].x === fire.origin[i].x && rc[j].y === fire.origin[i].y) { check = true; continue }
        }
        if (!check) { rc.push(new Coordinate(fire.origin[i].x, fire.origin[i].y)) }
      }
    }
  }
  return rc
}

export function reactionAvailableCoords(game: Game): Coordinate[] {
  const rc: Coordinate[] = []
  const action = game.lastSignificantAction as MoveAction
  const otherNation = game.findUnitById(action.origin[0].id)?.playerNation
  const map = game.scenario.map
  const targets = reactionTargetCoords(game)
  for (let x = 0; x < map.width; x++) {
    for (let y = 0; y < map.height; y++) {
      const loc = new Coordinate(x, y)
      const counters = map.countersAt(loc)
      for (const c of counters) {
        if (c.hasUnit) {
          let added = false
          if (c.unit.playerNation === otherNation) { continue }
          if (c.unit.areaFire || c.unit.isBroken) { continue }
          if (c.unit.isExhausted) { continue }
          for (const t of targets) {
            if (c.unit.currentRange < hexDistance(loc, t)) { continue }
            if (los(map, loc, t)) { rc.push(loc); added = true; break }
          }
          if (added) { break }
        }
      }
    }
  }
  return rc
}

export default class ReactionState extends BaseState {
  constructor(game: Game) {
    super(game, stateType.Reaction, game.currentPlayer)
  }

  get showOverlays(): boolean {
    return false
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  openHex(x: number, y: number) {
    const available = reactionAvailableCoords(this.game)
    for (const a of available) {
      if (a.x === x && a.y === y) { return hexOpenType.Open }
    }
    return hexOpenType.Closed
  }

  select(selection: CounterSelectionTarget, callback: () => void) {
    if (selection.target.type === "reinforcement") { return }
    const x = selection.target.xy.x
    const y = selection.target.xy.y
    const id = selection.counter.target.id
    const counter = this.map.unitAtId(new Coordinate(x, y), id) as Counter
    this.map.clearOtherSelections(x, y, id)
    counter.unit.select()
    callback()
  }

  selectable(selection: CounterSelectionTarget): boolean {
    const target = selection.counter.unit as Unit
    if (this.openHex(selection.counter.x, selection.counter.y) !== hexOpenType.Open) {
      return false
    }
    const same = this.samePlayer(target)
    if (same) { return false }
    return true
  }

  finish() {
    const action = new GameAction({
      user: this.game.currentUser,
      player: togglePlayer(this.game.currentPlayer),
      data: { action: "reaction_pass", old_initiative: this.game.initiative },
    }, this.game)
    this.execute(action)
  }

  checkAvailable(): void {
    if (reactionAvailableCoords(this.game).length < 1) {
      if (this.game.lastAction?.type !== "info") {
        this.execute(new GameAction({
          player: this.game.currentPlayer, user: this.game.currentUser, data: {
            action: "info", message: "no valid units have line-of-sight, skipping reaction fire",
            old_initiative: this.game.initiative,
          }
        }, this.game))
      }
      this.game.gameState = undefined
    }
  }
}
