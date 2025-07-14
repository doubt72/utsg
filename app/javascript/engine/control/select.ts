import { Coordinate, CounterSelectionTarget, unitType } from "../../utilities/commonTypes"
import { hexDistance, normalDir } from "../../utilities/utilities"
import Counter from "../Counter"
import Game, { gamePhaseType } from "../Game"
import { addActionType } from "../GameAction"
import Map from "../Map"
import { actionType, getLoader, needPickUpDisambiguate } from "./gameActions"
import Unit from "../Unit"
import { canBeLoaded, canLoadUnit } from "./movement"
import { areaFire, leadershipRange, rapidFire, refreshTargetSelection, unTargetSelectExceptChain } from "./fire"

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
  if (game?.gameActionState?.fire) {
    if (!game.gameActionState.fire.doneRotating) { game.gameActionState.fire.doneRotating = true }
    const selected = counter.unit.selected
    counter.unit.select()
    if (!game.gameActionState.fire.doneSelect) {
      if (selected) {
        removeActionSelection(game, x, y, counter.unit.id)
        clearUnrangedSelection(game)
      } else {
        game.gameActionState.selection?.push({
          x, y, id: counter.unit.id, counter: counter,
        })
      }
    } else {
      counter.unit.select()
      const ts = counter.unit.targetSelected
      if (ts) {
        map.clearAllTargetSelections()
      } else {
        const rapid = rapidFire(game)
        if (rapid || areaFire(game)) {
          // TODO: deal with true area fire vs infantry fire
          map.targetSelectAllAt(x, y, true, false)
          if (rapid) {
            unTargetSelectExceptChain(game, x, y)
          } else {
            map.unTargetSelectAllExcept(x, y)
          }
        } else {
          counter.unit.targetSelect()
          map.clearOtherTargetSelections(x, y, counter.unit.id)
          if (!counter.unit.isVehicle) {
            map.targetSelectAllAt(x, y, false, false)
          }
        }
      }
      refreshTargetSelection(game)
    }
  } else if (game?.gameActionState?.move) {
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
          parent_id: counter.unit.parent?.id, status: counter.unit.status,
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
          x: xx, y: yy, cost, type: addActionType.Load, id: counter.unit.id, parent_id: load?.unit.id,
          facing, status: counter.unit.status,
        })
      }
    } else {
      counter.children.forEach(c => c.unit.select())
      if (selected) {
        removeActionSelection(game, x, y, counter.unit.id)
        counter.children.forEach(c => removeActionSelection(game, x, y, c.unit.id))
      } else {
        const sel = game.gameActionState.selection
        sel.push({ x, y, id: counter.unit.id, counter: counter })
        counter.children.forEach(c => sel.push({ x, y, id: c.unit.id, counter: c }))
        game.gameActionState.selection.sort((a, b) => {
          if (a.counter.unitIndex === b.counter.unitIndex) { return 0 }
          return a.counter.unitIndex > b.counter.unitIndex ? 1 : -1
        })
      }
    }
  } else if (game?.gameActionState?.assault) {
    const selected = counter.unit.selected
    counter.unit.select()
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
  } else {
    map.clearOtherSelections(x, y, id)
    counter.unit.select()
  }
  callback()
}

function clearUnrangedSelection(game: Game) {
  if (!game?.gameActionState?.fire) { return }
  const init = game.gameActionState.fire.initialSelection[0]
  const leadership = leadershipRange(game)
  console.log(leadership)
  for (const sel of game.gameActionState.selection) {
    if (leadership === false) {
      const child = init.counter.unit.children[0]
      if (sel.id !== init.id && (!child || child.id !== sel.id)) {
        sel.counter.unit.select()
        removeActionSelection(game, sel.x, sel.y, sel.id)
      }
    } else {
      if (hexDistance(new Coordinate(init.x, init.y), new Coordinate(sel.x, sel.y)) > leadership) {
        sel.counter.unit.select()
        removeActionSelection(game, sel.x, sel.y, sel.id)
      }
    }
  }
}

function canBeFireMultiselected(map: Map, counter: Counter): boolean {
  if (!map.game?.gameActionState?.fire) { return false }
  if (counter.unit.isBroken) {
    map.game.addMessage("cannot fire a broken unit")
    return false
  }
  if (counter.unit.isExhausted) {
    map.game.addMessage("cannot fire an exhausted unit")
    return false
  }
  if (counter.unit.isActivated) {
    map.game.addMessage("cannot fire an activated unit")
    return false
  }
  if (counter.unit.targetedRange) {
    map.game.addMessage("targeted weapons cannot fire with other units")
    return false
  }
  if (counter.unit.isVehicle) {
    map.game.addMessage("vehicles cannot fire with other units")
    return false
  }
  if (counter.parent && counter.parent.unit.isVehicle) {
    map.game.addMessage("unit being transported cannot fire with other units")
    return false
  }
  const next = counter.children[0]
  if (next && next?.unit.crewed) {
    map.game.addMessage("unit manning a crewed weapon cannot fire with other units")
    return false
  }
  const init = map.game.gameActionState.fire.initialSelection[0]
  if (counter.parent && counter.parent?.unit.id === init.counter.unit.id) {
    return true
  }
  const coord = counter.hex as Coordinate
  if (counter.unit.type === unitType.Leader && coord.x === init.x && coord.y === init.y) {
    return true
  }
  const leadership = leadershipRange(map.game)
  if (leadership === false) {
    map.game.addMessage("can't combine fire of units without a leader")
    return false
  } else {
    const distance = hexDistance(new Coordinate(init.x, init.y), new Coordinate(coord.x, coord.y))
    if (distance > leadership) {
      map.game.addMessage("unit outside of leadership range")
      return false
    } else {
      return true
    }
  }
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
  if (counter.unit.isBroken) {
    map.game?.addMessage("cannot move a broken unit")
  }
  if (counter.unit.isExhausted) {
    map.game?.addMessage("cannot move an exhausted unit")
  }
  if (!map.game?.rushing && counter.unit.isActivated) {
    map.game?.addMessage("cannot move an activated unit")
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
    if (game.gameActionState?.currentAction === actionType.Initiative) { return false }
    if (target.playerNation !== game.currentPlayerNation &&
        !(game.gameActionState?.fire && game.gameActionState.fire.doneSelect)) {
      // TODO: handle gun/support weapons when picking up or for firing, etc.
      return false
    }
    if (game.gameActionState?.fire) {
      if (game.gameActionState.fire.doneSelect) {
        if (target.playerNation === game.currentPlayerNation) { return false }
        if (target.crewed || target.uncrewedSW) {
          game.addMessage("can't target weapons, only operators")
          return false
        }
        const select = game.gameActionState.selection[0]
        const sc = select.counter
        const tc = map.findCounterById(target.id) as Counter
        if (sc.unit.canCarrySupport && tc.unit.armored) {
          game.addMessage("light weapons can't damage armored units")
          return false
        }
      } else {
        if (selection.target.type !== "map") { return false }
        for (const s of game.gameActionState.fire.initialSelection) {
          if (selection.counter.target.id === s.id) { return false }
        }
        const counter = map.unitAtId(selection.target.xy, selection.counter.target.id)
        if (!canBeFireMultiselected(map, counter as Counter)) { return false }
      }
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
    } else if (game.gameActionState?.assault) {
      if (game.gameActionState.assault.doneSelect) { return false }
      if (selection.target.type !== "map") { return false }
      for (const s of game.gameActionState.assault.initialSelection) {
        if (s.x !== selection.target.xy.x || s.y !== selection.target.xy.y) {
          map.game?.addMessage("all units assaulting together must start in same hex")
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
