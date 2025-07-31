import { Coordinate, Direction } from "../../utilities/commonTypes"
import BaseAction from "../actions/BaseAction"
import Game from "../Game"
import { gameActionAddActionType, GameActionPath } from "../GameAction"
import Unit from "../Unit"

export function reactionFireHexes(game: Game): GameActionPath[] {
  const action = reactionFireAction(game)
  const rc: GameActionPath[] = []
  if (["move", "rush"].includes(action.type)) {
    if (action.data.path) {
      for (let i = action.data.path.length - 1; i > 0; i--) {
        const s = action.data.path[i]
        let check = false
        for (const c of rc) {
          if (c.x === s.x && c.y === s.y) { check = true }
        }
        if (!check) { rc.push(s) }
      }
    }
    rc.reverse()
  } else if (["fire", "intensive_fire"].includes(action.type)) {
    action.data.origin?.forEach(s => {
      let check = false
      for (const c of rc) {
        if (c.x === s.x && c.y === s.y) { check = true }
      }
      if (!check) { rc.push(new Coordinate(s.x, s.y)) }
    })
  }
  return rc
}

export function placeReactionFireGhosts(game: Game) {
  const action = reactionFireAction(game)
  if (!["move", "rush"].includes(action.type)) { return }
  const path = reactionFireHexes(game)
  if (action.data.origin && action.data.add_action) {
    const ids = action.data.origin.map(o => { return { id: o.id, min: 0, max: path.length - 1 } })
    const drops = action.data.add_action.filter(a => a.type === gameActionAddActionType.Drop).map(a => {
      return { id: a.id, index: a.index - 2 }
    })
    const loads = action.data.add_action.filter(a => a.type === gameActionAddActionType.Load).map(a => {
      ids.push({ id: a.id ?? "", min: 0, max: path.length - 1 })
      return { id: a.id, index: a.index - 1 }
    })
    const units = ids.map(i => {
      const unit = game.findUnitById(i.id) as Unit
      let min = i.min
      let max = i.max
      for (const d of drops) {
        if (d.id === i.id) { max = d.index}
      }
      for (const l of loads) {
        if (l.id === i.id) { min = l.index}
      }
      return { u: unit, min, max }
    })
    for (let i = 0; i < path.length; i++) {
      for (const u of units) {
        const check = game.scenario.map.unitAtId(new Coordinate(path[i].x, path[i].y), u.u.id)
        if (!check) {
          const copy = u.u.clone()
          if (path[i].facing && copy.rotates) { copy.facing = path[i].facing as Direction}
          if (path[i].turret && copy.turreted) { copy.turretFacing = path[i].turret as Direction}
          copy.id = u.u.id
          if (u.max >= i && u.min <= i) {
            game.scenario.map.addGhost(new Coordinate(path[i].x, path[i].y), copy)
          }
        }
      }
    }
  }
}

function reactionFireAction(game: Game): BaseAction {
  // assumes Game->reactionFireCheck check is true and has been checked
  let last = game.actions[0]
  for (const a of game.actions.filter(a => !a.undone)) {
    if (["move", "rush", "fire", "intensive_fire"].includes(a.type)) {
      last = a
    }
  }
  return last
}