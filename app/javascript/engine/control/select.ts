import { Coordinate, CounterSelectionTarget } from "../../utilities/commonTypes"
import { normalDir } from "../../utilities/utilities"
import Counter from "../Counter"
import Game, { actionType, gamePhaseType } from "../Game"
import { addActionType } from "../GameAction"
import Map from "../Map"
import { getLoader, needPickUpDisambiguate } from "../support/gameActions"
import Unit from "../Unit"
import { canBeLoaded, canLoadUnit } from "./movement"

export default function select(
  map: Map, selection: CounterSelectionTarget, callback: () => void
) {
  const game = map.game
  if (selection.target.type === "reinforcement") { return } // shouldn't happen
  if (!selectable(map, selection)) { return }
  const x = selection.target.xy.x
  const y = selection.target.xy.y
  const id = selection.counter.target.id
  const counter = map.unitAtId(new Coordinate(x, y), id) as Counter
  if (game?.gameActionState?.move) {
    const selected = counter.unit.selected
    const move = game.gameActionState.move
    counter.unit.select()
    const xx = game.lastPath?.x ?? 0 // But should always exist, type notwithstanding
    const yy = game.lastPath?.y ?? 0
    if (move.droppingMove) {
      counter.unit.dropSelect()
      const cost = counter.parent ? 1 : 0
      const facing = counter.unit.crewed ? game.lastPath?.facing : undefined
      move.addActions.push(
        {
          x: xx, y: yy, cost, type: addActionType.Drop, id: counter.unit.id,
          parent_id: counter.unit.parent?.id,
          facing: facing && counter.unit.parent?.rotates && counter.unit.crewed ? normalDir(facing + 3) : facing
        }
      )
      if (xx !== x || yy !== y) {
        map.addGhost(new Coordinate(xx, yy), counter.unit.clone() as Unit)
      }
      if (counter.children.length === 1) {
        const child = counter.children[0]
        child.unit.select()
        child.unit.dropSelect()
        map.addGhost(new Coordinate(xx, yy), child.unit.clone() as Unit)
      }
      move.doneSelect = true
      game.closeOverlay = true
    } else if (move.loadingMove) {
      if (needPickUpDisambiguate(game)) {
        counter.unit.loaderSelect()
        move.loader = counter
      } else {
        counter.unit.select()
        counter.unit.loadedSelect()
        let load = move.loader
        if (!load) { load = getLoader(game)[0] }
        load.unit.select()
        load.unit.loaderSelect()
        move.loader = undefined
        move.loadingMove = false
        move.doneSelect = true
        game.closeOverlay = true
        let cost = 1
        if (load?.unit.canCarrySupport) {
          if (counter.unit.crewed) {
            cost = load.unit.baseMovement + 1
          } else {
            cost = 1 - counter.unit.baseMovement
          }
        }
        const facing = counter.unit.rotates ? counter.unit.facing : undefined
        move.addActions.push({
          x: xx, y: yy, cost, type: addActionType.Load, id: counter.unit.id, parent_id: load?.unit.id, facing
        })
      }
    } else {
      counter.children.forEach(c => c.unit.select())
      if (selected) {
        removeActionSelection(game, x, y, counter.unit.id)
      } else {
        game.gameActionState.selection?.push({
          x, y, id: counter.unit.id, counter: counter,
        })
        game.gameActionState.selection.sort((a, b) => {
          if (a.counter.unitIndex === b.counter.unitIndex) { return 0 }
          return a.counter.unitIndex > b.counter.unitIndex ? 1 : -1
        })
      }
    }
  } else {
    map.clearOtherSelections(x, y, id)
    counter.unit.select()
  }
  callback()
}

function canBeMoveMultiselected(map: Map, counter: Counter): boolean {
  if (!counter.unit.canCarrySupport) {
    map.game?.addMessage("only infantry units and leaders can move together")
    return false
  }
  const next = counter.children[0]
  if (next && next?.unit.crewed) {
    map.game?.addMessage("unit manning a crewed weapon cannot move with other infantry")
    return false
  }
  if (counter.parent) {
    map.game?.addMessage("unit being transported cannot move with other infantry")
    return false
  }
  return true
}

function selectable(map: Map, selection: CounterSelectionTarget): boolean {
  const game = map.game
  if (!game) { return false }
  const target = selection.counter.unit as Unit
  if (target.isFeature) { return false }
  if (map.debug) { return true }
  if (game.phase === gamePhaseType.Deployment) { return false }
  if (game.phase === gamePhaseType.Prep) { return false } // Not supported yet
  if (game.phase === gamePhaseType.Main) {
    if (game.gameActionState?.currentAction === actionType.Breakdown) { return false }
    if (target.playerNation !== game.currentPlayerNation) {
      // TODO: or gun/support weapon
      return false
    }
    if (game.gameActionState?.move) {
      if (game.gameActionState.move.droppingMove) {
        const child = target.children[0]
        if (target.selected) {
          if (child && game.gameActionState.selection.length === 2) {
            map.game?.addMessage("must select unit being carried")
            return false
          } else {
            return true
          }
        } else {
          map.game?.addMessage("must select unit that started move")
          return false
        }
      }
      if (game.gameActionState.move.loadingMove) {
        if (needPickUpDisambiguate(game)) {
          if (!target.selected) {
            map.game?.addMessage("must select unit that started move or hasn't already been dropped")
            return false
          }
          if (canLoadUnit(game, target)) {
            return true
          } else {
            map.game?.addMessage("can't carry/load any available units")
            return false
          }
        } else {
          if (target.selected || target.loaderSelected) {
            map.game?.addMessage("unit is already selected")
            return false
          }
          if (canBeLoaded(game, target)) {
            return true
          } else {
            map.game?.addMessage("can't be carried/loaded onto selected unit")
            return false
          }
        }
      }
      if (game.gameActionState.move.doneSelect) { return false }
      if (selection.target.type !== "map") { return false }
      for (const s of game.gameActionState.move.initialSelection) {
        if (s.x !== selection.target.xy.x || s.y !== selection.target.xy.y) {
          map.game?.addMessage("all units moving together must start in same hex")
          return false
        }
        if (selection.counter.target.id === s.id) { return false }
      }
      const counter = map.unitAtId(selection.target.xy, selection.counter.target.id)
      if (!canBeMoveMultiselected(map, counter as Counter)) { return false }
    }
  }
  if (game.phase === gamePhaseType.Cleanup) { return false } // Not supported yet
  return true
}

function removeActionSelection(game: Game, x: number, y: number, id: string) {
  if (!game?.gameActionState?.selection) { return }
  const selection = game.gameActionState.selection.filter(s =>
    s.x !== x || s.y !== y || s.id !== id
  )
  game.gameActionState.selection = selection
}
