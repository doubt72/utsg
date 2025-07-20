import { Coordinate } from "../../utilities/commonTypes"
import BaseAction from "../actions/BaseAction"
import Game from "../Game"
import { addActionType } from "../GameAction"
import Unit from "../Unit"

export function reactionFireHexes(game: Game): Coordinate[] {
  const action = reactionFireAction(game)
  const rc: Coordinate[] = []
  if (["move", "rush"].includes(action.type)) {
    if (action.data.path) {
      for (let i = 1; i < action.data.path.length; i++) {
        const s = action.data.path[i]
        let check = false
        for (const c of rc) {
          if (c.x === s.x && c.y === s.y) { check = true }
        }
        if (!check) { rc.push(new Coordinate(s.x, s.y)) }
      }
    }
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
  if (!game.reactionFire) { return }
  const action = reactionFireAction(game)
  if (!["move", "rush"].includes(action.type)) { return }
  const hexes = reactionFireHexes(game)
  if (action.data.origin && action.data.add_action) {
    const ids = action.data.origin.map(o => { return { id: o.id, min: 0, max: hexes.length - 1 } })
    const drops = action.data.add_action.filter(a => a.type === addActionType.Drop).map(a => {
      return { id: a.id, index: a.index - 2 }
    })
    const loads = action.data.add_action.filter(a => a.type === addActionType.Load).map(a => {
      return { id: a.id, index: a.index - 2 }
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
    for (let i = 0; i < hexes.length; i++) {
      for (const u of units) {
        const check = game.scenario.map.unitAtId(hexes[i], u.u.id)
        if (!check) {
          const copy = u.u.clone()
          copy.id = u.u.id
          if (u.max >= i && u.min <= i) { game.scenario.map.addGhost(hexes[i], copy) }
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