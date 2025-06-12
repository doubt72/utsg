import { Coordinate, CounterSelectionTarget } from "../../utilities/commonTypes"
import Counter from "../Counter"
import Game, { gamePhaseType } from "../Game"
import Map from "../Map"
import Unit from "../Unit"

export default function select(
  map: Map, selection: CounterSelectionTarget, callback: (error?: string) => void
) {
  const game = map.game
  if (selection.target.type === "reinforcement") { return } // shouldn't happen
  if (!selectable(map, selection, callback)) { return }
  const x = selection.target.xy.x
  const y = selection.target.xy.y
  const index = selection.counter.unitIndex
  const counter = map.counterAtIndex(new Coordinate(x, y), index) as Counter
  if (game?.gameActionState?.move) {
    const selected = counter.target.selected
    counter.target.select()
    if (game.gameActionState.move.shortingMove) {
      counter.target.altSelect()
      const xx = game.lastPath?.x ?? 0 // But should always exist, type notwithstanding
      const yy = game.lastPath?.y ?? 0
      const cost = counter.parent ? 1 : 0
      game.gameActionState.move.addActions.push(
        { x: xx, y: yy, cost, type: "shortmove", meta: { fromIndex: index } }
      )
      map.addGhost(new Coordinate(xx, yy), counter.target.clone() as Unit)
      if (counter.children.length === 1) {
        const child = counter.children[0]
        child.target.select()
        child.target.altSelect()
        map.addGhost(new Coordinate(xx, yy), child.target.clone() as Unit)
      }
    } else {
      counter.children.forEach(c => c.target.select())
      if (selected) {
        removeActionSelection(game, x, y, index)
      } else {
        game.gameActionState.selection?.push({
          x, y, i: index, counter: counter,
        })
      }
    }
  } else {
    map.clearOtherSelections(x, y, index)
    counter.target.select()
  }
  callback()
}

function canBeMoveMultiselected(map: Map, counter: Counter, callback: (error?: string) => void): boolean {
  if (!counter.target.canCarrySupport) {
    callback("only infantry units and leaders can move together")
    return false
  }
  const next = counter.children[0]
  if (next && next?.target.crewed) {
    callback("unit manning a crewed weapon cannot move with other infantry")
    return false
  }
  if (counter.parent) {
    callback("unit being transported cannot move with other infantry")
    return false
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
      if (game.gameActionState.move.shortingMove) {
        if (selection.counter.target.selected) {
          return true
        } else {
          callback("must select unit that started move")
          return false
        }
      }
      if (game.gameActionState.move.doneSelect) { return false }
      if (selection.target.type !== "map") { return false }
      for (const s of game.gameActionState.move.initialSelection) {
        if (s.x !== selection.target.xy.x || s.y !== selection.target.xy.y) {
          callback("all units moving together must start in same hex")
          return false
        }
        if (selection.counter.unitIndex === s.i) { return false }
      }
      const counter = map.counterAtIndex(selection.target.xy, selection.counter.unitIndex)
      if (!canBeMoveMultiselected(map, counter as Counter, callback)) { return false }
    }
  }
  if (game.phase === gamePhaseType.Cleanup) { return false } // Not supported yet
  return true
}

function removeActionSelection(game: Game, x: number, y: number, index: number) {
  if (!game?.gameActionState?.selection) { return }
  const selection = game.gameActionState.selection.filter(s =>
    s.x !== x || s.y !== y || s.i !== index
  )
  game.gameActionState.selection = selection
}
