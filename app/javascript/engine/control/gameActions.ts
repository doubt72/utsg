import { Coordinate, Direction, featureType } from "../../utilities/commonTypes"
import { normalDir, roll2d10, rolld10 } from "../../utilities/utilities"
import Feature from "../Feature"
import Game, { actionType } from "../Game"
import GameAction, { addActionType, GameActionDiceResult, GameActionPath } from "../GameAction"
import Counter from "../Counter"
import { canMultiSelectFire } from "./fire"

export function startInitiative(game: Game) {
  const action = game.lastAction
  if (!action || game.gameActionState?.currentAction === actionType.Initiative) { return }
  game.gameActionState = {
    player: game.currentPlayer, currentAction: actionType.Initiative,
    selection: []
  }
  game.refreshCallback(game)
}

export function finishInitiative(game: Game) {
  if (!game.gameActionState || game.gameActionState.currentAction !== actionType.Initiative) { return }
  let result: GameActionDiceResult[] | undefined = undefined
  if ((game.currentPlayer === 1 && game.initiative > 0) ||
      (game.currentPlayer === 2 && game.initiative < 0)) {
    result = [{ result: roll2d10(), type: "2d10" }]
  }
  const init = new GameAction({
    user: game.currentUser,
    player: game.gameActionState?.player,
    data: {
      action: "initiative", old_initiative: game.initiative,
      dice_result: result,
    },
  }, game, game.actions.length)
  game.gameActionState = undefined
  game.scenario.map.clearAllSelections()
  game.executeAction(init, false)
}

export function startPass(game: Game) {
  if (game.gameActionState) { return }
  game.gameActionState = {
    player: game.currentPlayer, currentAction: actionType.Pass,
    selection: []
  }
  game.refreshCallback(game)
}

export function finishPass(game: Game) {
  if (!game.gameActionState || game.gameActionState.currentAction !== actionType.Pass) { return }
  const pass = new GameAction({
    user: game.currentUser,
    player: game.gameActionState?.player,
    data: { action: "pass", old_initiative: game.initiative },
  }, game, game.actions.length)
  game.gameActionState = undefined
  game.scenario.map.clearAllSelections()
  game.executeAction(pass, false)
}

export function startFire(game: Game) {
  const selection = game.scenario.map.currentSelection[0]
  if (selection && selection.hex) {
    const loc = {
      x: selection.hex.x, y: selection.hex.y,
      facing: selection.unit.rotates ? selection.unit.facing : undefined,
      turret: selection.unit.turreted ? selection.unit.turretFacing : undefined,
    }
    const canSelect = canMultiSelectFire(game, loc.x, loc.y, selection.unit)
    const allSelection = [{ x: loc.x, y: loc.y, id: selection.unit.id, counter: selection }]
    const initialSelection = [{ x: loc.x, y: loc.y, id: selection.unit.id, counter: selection }]
    if (canSelect) {
      game.openOverlay = { x: selection.hex.x, y: selection.hex.y }
    }
    game.gameActionState = {
      player: game.currentPlayer,
      currentAction: actionType.Fire,
      selection: allSelection,
      fire: {
        initialSelection, doneSelect: !canSelect, path: [loc], targetSelection: [],
        doneRotating: !selection.unit.turreted,
      }
    }
  }
}

export function finishFire(game: Game) {
  game.actionInProgress
}

export function startMove(game: Game) {
  const selection = game.scenario.map.currentSelection[0]
  if (selection && selection.hex) {
    let facing = selection.unit.rotates ? selection.unit.facing : undefined
    const child = selection.unit.children[0]
    if (selection.unit.canHandle && child && child.crewed) { facing = child.facing }
    const loc = {
      x: selection.hex.x, y: selection.hex.y, facing,
      turret: selection.unit.turreted ? selection.unit.turretFacing : undefined,
    }
    const units = selection.children
    units.forEach(c => c.unit.select())
    let canSelect = selection.unit.canCarrySupport && (units.length < 1 || !units[0].unit.crewed)
    if (canSelect) {
      let check = false
      game.scenario.map.countersAt(new Coordinate(selection.hex.x, selection.hex.y)).forEach(c => {
        if (selection.unitIndex !== c.unitIndex && !c.unit.isFeature && c.unit.canCarrySupport &&
            (c.children.length < 1 || !c.children[0].unit.crewed)) {
          check = true
        }
      })
      canSelect = check
    }
    const allSelection = [{ x: loc.x, y: loc.y, id: selection.unit.id, counter: selection }]
    const initialSelection = [{ x: loc.x, y: loc.y, id: selection.unit.id, counter: selection }]
    units.forEach(u => {
      const hex = u.hex as Coordinate
      allSelection.push({ x: hex.x, y: hex.y, id: u.unit.id, counter: u })
      initialSelection.push({ x: hex.x, y: hex.y, id: u.unit.id, counter: u })
    })
    if (canSelect) {
      game.openOverlay = { x: selection.hex.x, y: selection.hex.y }
    }
    game.gameActionState = {
      player: game.currentPlayer,
      currentAction: actionType.Move,
      selection: allSelection,
      move: {
        initialSelection, doneSelect: !canSelect, path: [loc], addActions: [],
        rotatingTurret: false, placingSmoke: false, droppingMove: false, loadingMove: false,
      }
    }
  }
}

export function move(game: Game, x: number, y: number) {
  if (!game.gameActionState?.move) { return }
  if (!game.gameActionState?.selection) { return }
  const selection = game.gameActionState.selection
  const move = game.gameActionState.move
  const target = selection[0].counter.unit
  const lastPath = game.lastPath as GameActionPath
  if (move.placingSmoke) {
    const id = `uf-${game.actions.length}-${move.addActions.length}`
    move.addActions.push({
      x, y, type: "smoke", cost: lastPath.x === x && lastPath.y === y ? 1 : 2, id
    })
    game.scenario.map.addGhost(
      new Coordinate(x, y),
      new Feature({ ft: 1, t: featureType.Smoke, n: "Smoke", i: "smoke", h: 0 })
    )
  } else {
    let facing = target.rotates ? lastPath.facing : undefined
    const child = target.children[0]
    if (target.canHandle && child && child.crewed) { facing = child.facing }
    move.path.push({
      x, y, facing, turret: target.turreted ? lastPath.turret : undefined
    })
    const vp = game.scenario.map.victoryAt(new Coordinate(x, y))
    if (vp && vp !== game.currentPlayer) {
      move.addActions.push({ x, y, type: addActionType.VP, cost: 0 })
    }
  }
  move.doneSelect = true
  game.closeOverlay = true
}

export function rotateToggle(game: Game) {
  if (!game.gameActionState?.move) { return }
  game.gameActionState.move.rotatingTurret = !game.gameActionState.move.rotatingTurret
}

export function moveRotate(game: Game, x: number, y: number, dir: Direction) {
  if (!game.gameActionState?.move) { return }
  const last = game.lastPath as GameActionPath
  if (game.gameActionState.move.rotatingTurret) {
    last.turret = dir
  } else {
    const lastDir = last.facing
    let turret = last.turret
    if (lastDir && turret) {
      turret = normalDir(turret + dir - lastDir)
    }
    game.gameActionState.move.path.push({
      x: x, y: y, facing: dir, turret,
    })
  }
}

export function placeSmokeToggle(game: Game) {
  if (!game.gameActionState?.move) { return }
  game.gameActionState.move.placingSmoke = !game.gameActionState.move.placingSmoke
  game.gameActionState.move.loadingMove = false
  game.gameActionState.move.droppingMove = false
}

export function shortingMoveToggle(game: Game) {
  if (!game.gameActionState?.move) { return }
  game.gameActionState.move.droppingMove = !game.gameActionState.move.droppingMove
  if (game.gameActionState.move.droppingMove) {
    const first = game.gameActionState.move.path[0]
    game.openOverlay = { x: first.x, y: first.y }
  }
  game.gameActionState.move.loadingMove = false
  game.gameActionState.move.placingSmoke = false
}

export function loadingMoveToggle(game: Game) {
  if (!game.gameActionState?.move) { return }
  game.gameActionState.move.loadingMove = !game.gameActionState.move.loadingMove
  if (game.gameActionState.move.loadingMove) {
    if (needPickUpDisambiguate(game)) {
      const first = game.gameActionState.move.path[0]
      game.openOverlay = { x: first.x, y: first.y }
    } else {
      const last = game.lastPath as GameActionPath
      game.openOverlay = { x: last.x, y: last.y }
    }
    const last = game.lastPath as GameActionPath
    game.openOverlay = { x: last.x, y: last.y }
  }
  game.gameActionState.move.droppingMove = false
  game.gameActionState.move.placingSmoke = false
}

export function finishMove(game: Game) {
  if (!game.gameActionState?.move) { return }
  const dice: GameActionDiceResult[] = []
  for (const a of game.gameActionState.move.addActions) {
    if (a.type === addActionType.Smoke) { dice.push({ result: rolld10(), type: "d10" }) }
  }
  const move = new GameAction({
    user: game.currentUser,
    player: game.gameActionState.player,
    data: {
      action: game.rushing ? "rush" : "move", old_initiative: game.initiative,
      path: game.gameActionState.move.path,
      origin: game.gameActionState.selection.map(s => {
        return { x: s.x, y: s.y, id: s.counter.unit.id, status: s.counter.unit.status }
      }),
      add_action: game.gameActionState.move.addActions.map(a => {
        return {
          type: a.type, x: a.x, y: a.y, id: a.id, parent_id: a.parent_id, facing: a.facing,
          status: a.status,
        }
      }),
      dice_result: dice,
    }
  }, game, game.actions.length)
  game.gameActionState = undefined
  game.scenario.map.clearGhosts()
  game.scenario.map.clearAllSelections()
  game.executeAction(move, false)
}

export function startAssault(game: Game) {
  const selection = game.scenario.map.currentSelection[0]
  if (selection && selection.hex) {
    const loc = {
      x: selection.hex.x, y: selection.hex.y,
      facing: selection.unit.rotates ? selection.unit.facing : undefined ,
      turret: selection.unit.turreted ? selection.unit.turretFacing : undefined,
    }
    const units = selection.children
    units.forEach(c => c.unit.select())
    let canSelect = selection.unit.canCarrySupport
    if (canSelect) {
      let check = false
      game.scenario.map.countersAt(new Coordinate(selection.hex.x, selection.hex.y)).forEach(c => {
        if (selection.unitIndex !== c.unitIndex && !c.unit.isFeature && c.unit.canCarrySupport &&
            (c.children.length < 1 || !c.children[0].unit.crewed)) {
          check = true
        }
      })
      canSelect = check
    }
    const allSelection = [{ x: loc.x, y: loc.y, id: selection.unit.id, counter: selection }]
    const initialSelection = [{ x: loc.x, y: loc.y, id: selection.unit.id, counter: selection }]
    units.forEach(u => {
      const hex = u.hex as Coordinate
      allSelection.push({ x: hex.x, y: hex.y, id: u.unit.id, counter: u })
      initialSelection.push({ x: hex.x, y: hex.y, id: u.unit.id, counter: u })
    })
    if (canSelect) {
      game.openOverlay = { x: selection.hex.x, y: selection.hex.y }
    }
    game.gameActionState = {
      player: game.currentPlayer, currentAction: actionType.Assault, selection: allSelection,
      assault: { initialSelection, doneSelect: !canSelect, path: [loc], addActions: [] }
    }
  }
}

export function assault(game: Game, x: number, y: number) {
  if (!game.gameActionState?.assault) { return }
  if (!game.gameActionState?.selection) { return }
  const selection = game.gameActionState.selection
  const assault = game.gameActionState.assault
  const target = selection[0].counter.unit
  const path = assault.path[0]
  const facing = game.scenario.map.relativeDirection(
    new Coordinate(path.x, path.y), new Coordinate(x, y)) ?? 1
  assault.path.push({
    x, y, facing, turret: target.turreted ?
      normalDir(target.turretFacing - selection[0].counter.unit.facing + facing) : undefined
  })
  const vp = game.scenario.map.victoryAt(new Coordinate(x, y))
  if (vp && vp !== game.currentPlayer) {
    assault.addActions.push({ x, y, type: addActionType.VP, cost: 0 })
  }
  assault.doneSelect = true
  game.closeOverlay = true
}

export function assaultRotate(game: Game, x: number, y: number, dir: Direction) {
  if (!game.gameActionState?.assault) { return }
  const last = game.lastPath as GameActionPath
  last.turret = dir
}

export function assaultClear(game: Game) {
  if (!game.gameActionState?.assault) { return }
  const assault = game.gameActionState.assault
  const x = game.gameActionState.selection[0].x
  const y = game.gameActionState.selection[0].y
  const f = game.scenario.map.countersAt(new Coordinate(x, y)).filter(c => c.hasFeature)[0]
  assault.addActions.push({ x, y, type: addActionType.Clear, cost: 0, id: f.feature.id })
  game.closeOverlay = true
}

export function assaultEntrench(game: Game) {
  if (!game.gameActionState?.assault) { return }
  const assault = game.gameActionState.assault
  const x = game.gameActionState.selection[0].x
  const y = game.gameActionState.selection[0].y
  assault.addActions.push({ x, y, type: addActionType.Entrench, cost: 0 })
  game.closeOverlay = true
}

export function finishAssault(game: Game) {
  if (!game.gameActionState?.assault) { return }
  const assault = new GameAction({
    user: game.currentUser,
    player: game.gameActionState.player,
    data: {
      action: "assault_move", old_initiative: game.initiative,
      path: game.gameActionState.assault.path,
      origin: game.gameActionState.selection.map(s => {
        return { x: s.x, y: s.y, id: s.counter.unit.id, status: s.counter.unit.status }
      }),
      add_action: game.gameActionState.assault.addActions.map(a => {
        return { type: a.type, x: a.x, y: a.y, id: a.id }
      }),
    }
  }, game, game.actions.length)
  game.gameActionState = undefined
  game.scenario.map.clearAllSelections()
  game.executeAction(assault, false)
}

export function startBreakdown(game: Game) {
  const action = game.lastAction
  if (!action || game.gameActionState?.currentAction === actionType.Breakdown) { return }
  if (action.data.origin && action.data.origin.length > 0) {
    const id = action.data.origin[0].id
    const counter = game.findCounterById(id) as Counter
    if (["move", "assault_move"].includes(action.data.action) && counter.unit.breakdownRoll) {
      game.gameActionState = {
        player: game.currentPlayer, currentAction: actionType.Breakdown,
        selection: [{
          x: counter.hex?.x ?? 0, y: counter.hex?.y ?? 0, id: counter.unit.id, counter,
        }]
      }
      counter.unit.select()
      game.refreshCallback(game)
    }
  }
}

export function finishBreakdown(game: Game) {
  if (!game.gameActionState || game.gameActionState.currentAction !== actionType.Breakdown) { return }
  const bd = new GameAction({
    user: game.currentUser,
    player: game.gameActionState?.player,
    data: {
      action: "breakdown", old_initiative: game.initiative,
      origin: game.gameActionState.selection.map(s => {
        return {
          x: s.x, y: s.y, id: s.counter.unit.id, status: s.counter.unit.status
        }
      }),
      dice_result: [{ result: roll2d10(), type: "2d10" }]
    },
  }, game, game.actions.length)
  game.gameActionState = undefined
  game.scenario.map.clearAllSelections()
  game.executeAction(bd, false)
}

export function needPickUpDisambiguate(game: Game): boolean {
  const action = game.gameActionState
  if (!action?.move) { return false }
  if (action.move.loader) { return false }
  return getLoader(game).length > 1 && !getLoader(game)[0].unit.transport
}

export function getLoader(game: Game): Counter[] {
  const action = game.gameActionState
  if (!action?.move) { return [] }
  const selection = action.selection
  if (!selection || !game.lastPath) { return [] }
  const rc: Counter[] = []
  const counters = game.scenario.map.countersAt(new Coordinate(game.lastPath.x, game.lastPath.y))
  for (const c of counters) {
    if (c.hasFeature || c.unit.selected) { continue }
    for (const s of selection) {
      const unit = s.counter.unit
      const target = c.unit
      if (unit.canCarry(target)) { rc.push(s.counter) }
    }
  }
  return rc
}
