import { Coordinate, CounterSelectionTarget, HexOpenType, hexOpenType } from "../../../utilities/commonTypes";
import { los } from "../../../utilities/los";
import { hexDistance } from "../../../utilities/utilities";
import { significantActions } from "../../actions/BaseAction";
import MoveAction from "../../actions/MoveAction";
import Counter from "../../Counter";
import Game from "../../Game";
import GameAction from "../../GameAction";
import { gamePhaseType } from "../../support/gamePhase";
import Unit from "../../Unit";
import { reactionFireHexes, reactionFireInRange } from "../reactionFire";
import BaseState, { stateType } from "./BaseState";

const reactionActions = ["move", "rush", "fire", "intensive_fire"]

export function reactionFireCheck(game: Game, action: boolean = true): boolean {
  if (game.gameState !== undefined) { return false }
  if (game.phase !== gamePhaseType.Main) { return false }
  if (game.lastAction?.type === "reaction_pass") { return false }
  let rc = false
  let last = ""
  for (let i = game.actions.length - 1; i >= 0; i--) {
    const a = game.actions[i]
    if (a.undone) { continue }
    if (a.type === "initiative") { rc = true }
    if (significantActions.includes(a.type)) { last = a.type; break }
  }
  if (rc && reactionActions.includes(last)) {
    if (reactionAvailableCoords(game).length < 1) {
      if (action && game.lastAction?.type !== "info") {
        const base = new BaseState(game, "reaction", 1)
        base.execute(new GameAction({
          user: game.currentUser, player: game.currentPlayer, data: {
            action: "reaction_pass", old_initiative: game.initiative,
            message: "no valid units have line-of-sight, skipping reaction fire",
          },
        }, game))
      }
    } else { return true }
  }
  return false
}

export function reactionAvailableCoords(game: Game): Coordinate[] {
  const rc: Coordinate[] = []
  const action = game.lastSignificantAction as MoveAction
  const otherNation = game.findUnitById(action.origin[0].id)?.playerNation
  const map = game.scenario.map
  const targets = reactionFireHexes(game)
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
            const toc = new Coordinate(t.x, t.y)
            if (c.unit.currentRange < hexDistance(loc, toc)) { continue }
            if (los(map, loc, toc)) { rc.push(loc); added = true; break }
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

  openHex(x: number, y: number): HexOpenType {
    const available = reactionAvailableCoords(this.game)
    for (const a of available) {
      if (a.x === x && a.y === y) { return hexOpenType.Open }
    }
    return hexOpenType.Closed
  }

  get activeCounters(): Counter[] {
    const available = reactionAvailableCoords(this.game)
    let counters: Counter[] = []
    for (const a of available) {
      counters = counters.concat(this.map.countersAt(a))
    }
    return counters
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
    if (selection.target.type === "reinforcement") { return false }
    const target = selection.counter.unit as Unit
    const loc = new Coordinate(selection.target.xy.x, selection.target.xy.y)
    if (this.openHex(loc.x, loc.y) !== hexOpenType.Open) { return false }
    if (!reactionFireInRange(this.game, target, loc)) {
      this.game.addMessage("unit out of range")
      return false
    }
    return true
  }

  finish() {
    const action = new GameAction({
      user: this.game.currentUser, player: this.game.currentPlayer,
      data: { action: "reaction_pass", old_initiative: this.game.initiative },
    }, this.game)
    this.execute(action)
  }
}
