import { Coordinate, CounterSelectionTarget } from "../../utilities/commonTypes"
import Counter from "../Counter"
import Game, { gamePhaseType } from "../Game"
import Map from "../Map"

export default function mapSelect(
  map: Map, selection: CounterSelectionTarget, callback: (error?: string) => void
) {
  const game = map.game
  if (selection.target.type === "reinforcement") { return } // shouldn't happen
  if (selection.counter.trueIndex === undefined) { return }
  if (!selectable(map, selection, callback)) { return }
  const x = selection.target.xy.x
  const y = selection.target.xy.y
  const ti = selection.counter.trueIndex
  const counter = map.counterAtIndex(new Coordinate(x, y), ti) as Counter
  if (game?.gameActionState?.move) {
    const selected = counter.target.selected
    counter.target.select()
    if (selected) {
      removeActionSelection(game, x, y, ti)
    } else {
      game.gameActionState.selection?.push({
        x, y, ti, counter: counter,
      })
    }
    const next = map.nextUnit(map.counterAtIndex(selection.target.xy, ti) as Counter)
    if (next && next.target.uncrewedSW) {
      next.target.select()
      if (selected) {
        removeActionSelection(game, x, y, ti + 1)
      } else {
        game.gameActionState.selection?.push({
          x, y, ti: ti + 1, counter: next,
        })
      }
    }
  } else {
    map.clearOtherSelections(x, y, ti)
    counter.target.select()
  }
  callback()
}

export function carriedUnits(map: Map, selection: Counter): Counter[] {
  const next = map.nextUnit(selection)
  if (!next) { return [] }
  const rc = [next]
  if (selection.target.canCarrySupport && next.target.uncrewedSW) { return rc }
  if (selection.target.canHandle && next.target.crewed) { return rc }
  if (selection.target.canTowUnit(next)) {
    const next2 = map.nextUnit(next)
    if (next2 && selection.target.canTransportUnit(next2)) {
      rc.push(next2)
      const next3 = map.nextUnit(next2)
      const next4 = next3 ? map.nextUnit(next3) : undefined
      const next5 = next4 ? map.nextUnit(next4) : undefined
      if (next2.target.type !== "ldr" && next3?.target.uncrewedSW &&
          next4?.target.type === "ldr" && next5?.target.uncrewedSW) {
        rc.push(next3)
        rc.push(next4)
        rc.push(next5)
      } else if ((next2.target.type !== "ldr" && next3?.target.uncrewedSW &&
                  next4?.target.type === "ldr") || (next2.target.type !== "ldr" &&
                  next3?.target.type === "ldr" && next4?.target.uncrewedSW)) {
        rc.push(next3)
        rc.push(next4)
      } else if ((next2.target.type !== "ldr" && next3?.target.type === "ldr") ||
                  next3?.target.uncrewedSW) {
        rc.push(next3)
      }
    }
    return rc
  }
  if (selection.target.canTransportUnit(next)) {
    const next2 = map.nextUnit(next)
    const next3 = next2 ? map.nextUnit(next2) : undefined
    const next4 = next3 ? map.nextUnit(next3) : undefined
    if (next.target.type !== "ldr" && next2?.target.uncrewedSW &&
        next3?.target.type === "ldr" && next4?.target.uncrewedSW) {
      rc.push(next2)
      rc.push(next2)
      rc.push(next4)
    } else if ((next.target.type !== "ldr" && next2?.target.uncrewedSW &&
                next3?.target.type === "ldr") || (next.target.type !== "ldr" &&
                next2?.target.type === "ldr" && next3?.target.uncrewedSW)) {
      rc.push(next2)
      rc.push(next3)
    } else if ((next.target.type !== "ldr" && next2?.target.type === "ldr") ||
                next2?.target.uncrewedSW) {
      rc.push(next2)
    }
    return rc
  }
  return []
}

function canBeMoveMultiselected(map: Map, counter: Counter, callback: (error?: string) => void): boolean {
  if (!counter.target.canCarrySupport) {
    callback("only infantry units and leaders can move together")
    return false
  }
  const next = map.nextUnit(counter)
  if (next && next?.target.crewed) {
    callback("unit manning a crewed weapon cannot move with other infantry")
    return false
  }
  const counters = map.countersAt(counter.hex as Coordinate)
  for (const c of counters) {
    if (c.target.canTransportUnit(counter)) {
      const carried = carriedUnits(map, c)
      for (const check of carried) {
        if (check.trueIndex === counter.trueIndex) {
          callback("unit being transported cannot move with other infantry")
          return false
        }
      }
    }
  }
  return true
}

function selectable(
  map: Map, selection: CounterSelectionTarget, callback: (error?: string) => void
): boolean {
  const game = map.game
  if (!game) { return false }
  if (selection.counter.target.isFeature) { return false }
  if (map.debug) { return true }
  if (game.phase === gamePhaseType.Deployment) { return false }
  if (game.phase === gamePhaseType.Prep) { return false } // Not supported yet
  if (game.phase === gamePhaseType.Main) {
    if (selection.counter.target.playerNation !== game.currentPlayerNation) {
      return false
    }
    if (game.gameActionState?.move) {
      if (game.gameActionState.move.doneSelect) { return false }
      if (selection.target.type !== "map") { return false }
      for (const s of game.gameActionState.move.initialSelection) {
        if (s.x !== selection.target.xy.x || s.y !== selection.target.xy.y) {
          callback("all units moving together must start in same hex")
          return false
        }
        if (selection.counter.trueIndex === s.ti) { return false }
      }
      const counter = map.counterAtIndex(selection.target.xy, selection.counter.trueIndex as number)
      if (!canBeMoveMultiselected(map, counter as Counter, callback)) { return false }
    }
  }
  if (game.phase === gamePhaseType.Cleanup) { return false } // Not supported yet
  return true
}

function removeActionSelection(game: Game, x: number, y: number, ti: number) {
  if (!game?.gameActionState?.selection) { return }
  const selection = game.gameActionState.selection.filter(s =>
    s.x !== x || s.y !== y || s.ti !== ti
  )
  game.gameActionState.selection = selection
}
