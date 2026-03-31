import { Coordinate, Direction, markerType } from "../../utilities/commonTypes"
import { los } from "../../utilities/los"
import { hexDistance } from "../../utilities/utilities"
import BaseAction, { significantActions } from "../actions/BaseAction"
import FireAction from "../actions/FireAction"
import MoveAction from "../actions/MoveAction"
import Game from "../Game"
import GameAction, { gameActionAddActionType, GameActionPath } from "../GameAction"
import Marker from "../Marker"
import { gamePhaseType } from "../support/gamePhase"
import Unit from "../Unit"
import { hitFromArc } from "./fire"
import BaseState from "./state/BaseState"

export const reactionActions = ["move", "rush", "fire", "intensive_fire"]

export function reactionFireCheck(game: Game, action: boolean = true): boolean {
  if (game.gameState !== undefined) { return false }
  if (game.phase !== gamePhaseType.Main) { return false }
  let rc = false
  let last = ""
  for (let i = game.actions.length - 1; i >= 0; i--) {
    const a = game.actions[i]
    if (a.undone) { continue }
    if (a.type === "reaction_pass") { return false }
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
            message: "no valid units have range and line-of-sight, skipping reaction fire",
          },
        }, game))
        game.resetCurrentPlayer()
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
      if (map.contactAt(loc)) { continue }
      const counters = map.countersAt(loc)
      for (const c of counters) {
        if (c.hasUnit) {
          let added = false
          if (c.unit.playerNation === otherNation) { continue }
          if (c.unit.areaFire || c.unit.isBroken) { continue }
          if (c.unit.uncrewedSW) {
            if (c.unit.parent === undefined) { continue }
            if (c.unit.parent.isBroken || c.unit.parent.isExhausted) { continue }
          }
          if (c.unit.isExhausted) { continue }
          if (c.unit.children.length > 0 && c.unit.children[0].crewed) { continue }
          if (c.unit.rotates && !c.unit.turreted && !c.unit.rotatingMount && !c.unit.rotatingVehicleMount) {
            let arc = false
            for (const t of targets) {
              const toc = new Coordinate(t.x, t.y)
              if (c.unit.backwardsMount) {
                if (hitFromArc(game, c.unit, toc, loc, false) === 2) { arc = true }
              } else {
                if (hitFromArc(game, c.unit, toc, loc, false) === 0) { arc = true }
              }
            }
            if (!arc) { continue }
          }
          if (c.unit.rotates && c.unit.turreted && c.unit.turretJammed) {
            let arc = false
            for (const t of targets) {
              const toc = new Coordinate(t.x, t.y)
              if (hitFromArc(game, c.unit, toc, loc, true) === 0) { arc = true }
            }
            if (!arc) { continue }
          }
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

export function reactionFireHexes(game: Game): GameActionPath[] {
  const action = reactionFireAction(game)
  if (!action) { return [] }
  const rc: GameActionPath[] = []
  if (["move", "rush"].includes(action.type)) {
    if (action.data.path) {
      for (let i = action.data.path.length - 1; i >= 0; i--) {
        if (i === 0) {
          if (!action.data.add_action || action.data.add_action.length < 1 ||
              action.data.add_action[0].index !== 0) {
            continue
          }
        }
        const s = action.data.path[i]
        let check = false
        for (const c of rc) {
          if (c.x === s.x && c.y === s.y) { check = true }
        }
        if (!check) { rc.push({ x: s.x, y: s.y, facing: s.facing, turret: s.turret }) }
      }
    }
    rc.reverse()
  } else if (["fire", "intensive_fire"].includes(action.type)) {
    action.data.origin?.forEach(s => {
      let check = false
      for (const c of rc) {
        if (c.x === s.x && c.y === s.y) { check = true; break }
      }
      if (!check) { rc.push({ x: s.x, y: s.y }) }
    })
  }
  return rc
}

export function placeReactionFireGhosts(game: Game) {
  const action = reactionFireAction(game)
  if (!action) { return }
  if (!["move", "rush"].includes(action.type)) { return }
  const path = reactionFireHexes(game)
  if (action.data.origin && action.data.add_action) {
    const ids = action.data.origin.map(o => { return { id: o.id, min: 0, max: path.length - 1 } })
    const drops = action.data.add_action.filter(a => a.type === gameActionAddActionType.Drop).map(a => {
      return { id: a.id, index: a.index - 1 }
    })
    const loads = action.data.add_action.filter(a => a.type === gameActionAddActionType.Load).map(a => {
      ids.push({ id: a.id ?? "", min: 0, max: path.length - 1 })
      return { id: a.id, index: a.index }
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

export function placeReactionMoraleCheckGhosts(game: Game, loc: Coordinate) {
  const fireAction = game.lastSignificantAction as FireAction
  if (!["reaction_fire", "reaction_intensive_fire"].includes(fireAction?.type) ||
      !fireAction?.reaction || fireAction?.fireHex.moveSeq === undefined) { return }

  const action = game.findActionBySequence(fireAction.fireHex.moveSeq) as MoveAction
  if (!action) { return }

  if (action.data.origin && action.data.add_action) {
    const ids = action.data.origin.map(o => { return { id: o.id, min: 0, max: action.path.length - 1 } })
    const drops = action.data.add_action.filter(a => a.type === gameActionAddActionType.Drop).map(a => {
      return { id: a.id, index: a.index - 2 }
    })
    const loads = action.data.add_action.filter(a => a.type === gameActionAddActionType.Load).map(a => {
      ids.push({ id: a.id ?? "", min: 0, max: action.path.length - 1 })
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
    for (let i = 0; i < action.path.length; i++) {
      if (action.path[i].x !== loc.x || action.path[i].y !== loc.y) { continue }
      for (const u of units) {
        const check = game.scenario.map.unitAtId(new Coordinate(action.path[i].x, action.path[i].y), u.u.id)
        if (!check) {
          const copy = u.u.clone()
          if (action.path[i].facing && copy.rotates) { copy.facing = action.path[i].facing as Direction}
          if (action.path[i].turret && copy.turreted) { copy.turretFacing = action.path[i].turret as Direction}
          copy.id = u.u.id
          if (u.max >= i && u.min <= i) {
            game.scenario.map.addGhost(new Coordinate(action.path[i].x, action.path[i].y), copy)
            if (u.u.selected) { copy.select() }
          }
        }
      }
    }
  }
}

export function reactionFireInRange(game: Game, unit: Unit, loc: Coordinate): boolean {
  for (const hex of reactionFireHexes(game)) {
    const range = hexDistance(loc, new Coordinate(hex.x, hex.y))
    const actualUnit = unit.isMarker && (unit as unknown as Marker).type === markerType.TrackedHull ?
      (unit as unknown as Marker).turret as Unit : unit
    if (range <= actualUnit.currentRange) { return true }
    if (actualUnit.sponson && !(actualUnit.sponsonJammed || actualUnit.sponsonDestroyed) &&
        range <= actualUnit.sponson.range) { return true }
  }
  return false
}

function reactionFireAction(game: Game): BaseAction | undefined {
  // assumes Game->reactionFireCheck check is true and has been checked
  for (let i = game.actions.length - 1; i >= 0; i--) {
    const a = game.actions[i]
    if (a.undone) { continue }
    if (significantActions.includes(a.type)) { return a }
  }
}