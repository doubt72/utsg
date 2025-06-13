import { Coordinate, CounterSelectionTarget } from "../../utilities/commonTypes"
import Counter from "../Counter"
import Game, { gamePhaseType } from "../Game"
import Map from "../Map"
import Unit from "../Unit"
import { canBeLoaded, canLoadUnit } from "./movement"

export default function select(
  map: Map, selection: CounterSelectionTarget, callback: (error?: string) => void
) {
  const game = map.game
  if (selection.target.type === "reinforcement") { return } // shouldn't happen
  if (!selectable(map, selection, callback)) { return }
  const x = selection.target.xy.x
  const y = selection.target.xy.y
  const index = selection.counter.unitIndex
  const counter = map.unitAtIndex(new Coordinate(x, y), index) as Counter
  if (game?.gameActionState?.move) {
    const selected = counter.unit.selected
    const move = game.gameActionState.move
    counter.unit.select()
    const xx = game.lastPath?.x ?? 0 // But should always exist, type notwithstanding
    const yy = game.lastPath?.y ?? 0
    if (move.shortDropMove) {
      counter.unit.dropSelect()
      const cost = counter.parent ? 1 : 0
      move.addActions.push(
        { x: xx, y: yy, cost, type: "shortdrop", meta: { fromIndex: index } }
      )
      map.addGhost(new Coordinate(xx, yy), counter.unit.clone() as Unit)
      if (counter.children.length === 1) {
        const child = counter.children[0]
        child.unit.select()
        child.unit.dropSelect()
        map.addGhost(new Coordinate(xx, yy), child.unit.clone() as Unit)
      }
      move.doneSelect = true
    } else if (move.loadingMove) {
      if (game.needPickUpDisambiguate) {
        counter.unit.loaderSelect()
        move.loader = counter
      } else {
        counter.unit.select()
        counter.unit.loadedSelect()
        const load = move.loader
        let toIndex = 0
        if (game.gameActionState.selection) {
          toIndex = game.gameActionState.selection[0].counter.unitIndex
        }
        if (load) {
          load.unit.select()
          load.unit.loaderSelect()
          toIndex = load.unitIndex
          move.loader = undefined
        }
        move.loadingMove = false
        move.doneSelect = true
        move.addActions.push(
          { x: xx, y: yy, cost: 1, type: "load", meta: { fromIndex: index, toIndex }}
        )
      }
    } else {
      counter.children.forEach(c => c.unit.select())
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
    counter.unit.select()
  }
  callback()
}

function canBeMoveMultiselected(map: Map, counter: Counter, callback: (error?: string) => void): boolean {
  if (!counter.unit.canCarrySupport) {
    callback("only infantry units and leaders can move together")
    return false
  }
  const next = counter.children[0]
  if (next && next?.unit.crewed) {
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
  const target = selection.counter.unit as Unit
  if (target.isFeature) { return false }
  if (map.debug) { return true }
  if (game.phase === gamePhaseType.Deployment) { return false }
  if (game.phase === gamePhaseType.Prep) { return false } // Not supported yet
  if (game.phase === gamePhaseType.Main) {
    if (target.playerNation !== game.currentPlayerNation) {
      return false
    }
    if (game.gameActionState?.move) {
      if (game.gameActionState.move.shortDropMove) {
        if (target.selected) {
          return true
        } else {
          callback("must select unit that started move")
          return false
        }
      }
      if (game.gameActionState.move.loadingMove) {
        if (game.needPickUpDisambiguate) {
          if (!target.selected) {
            callback("must select unit that started move")
            return false
          }
          if (canLoadUnit(game, target)) {
            return true
          } else {
            callback("can't carry/load any available units")
            return false
          }
        } else {
          if (target.selected || target.loaderSelected) {
            callback("unit is already selected")
            return false
          }
          if (canBeLoaded(game, target)) {
            return true
          } else {
            callback("can't be carried/loaded onto selected unit")
            return false
          }
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
      const counter = map.unitAtIndex(selection.target.xy, selection.counter.unitIndex)
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
