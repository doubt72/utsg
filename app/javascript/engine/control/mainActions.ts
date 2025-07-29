import { Coordinate, Direction, featureType } from "../../utilities/commonTypes"
import { normalDir, roll2d10, rolld10, togglePlayer } from "../../utilities/utilities"
import Feature from "../Feature"
import Game from "../Game"
import GameAction, {
  GameActionAddAction, gameActionAddActionType, GameActionDiceResult, GameActionPath
} from "../GameAction"
import Counter from "../Counter"
import { canMultiSelectFire, moraleModifiers } from "./fire"
import Unit from "../Unit"
import { placeReactionFireGhosts } from "./reactionFire"
import { findRoutPathTree, routPaths } from "./rout"
import { intensiveFiring, rushing } from "./checks"
import { actionType } from "./actionState"

export function startInitiative(game: Game) {
  const action = game.lastAction
  if (!action || game.gameState?.currentAction === actionType.Initiative) { return }
  game.gameState = {
    player: game.currentPlayer, currentAction: actionType.Initiative,
    selection: []
  }
  game.refreshCallback(game)
}

export function finishInitiative(game: Game) {
  if (!game.gameState || game.gameState.currentAction !== actionType.Initiative) { return }
  let result: GameActionDiceResult[] | undefined = undefined
  if ((game.currentPlayer === 1 && game.initiative > 0) ||
      (game.currentPlayer === 2 && game.initiative < 0)) {
    result = [{ result: roll2d10(), type: "2d10" }]
  }
  const init = new GameAction({
    user: game.currentUser,
    player: game.gameState?.player,
    data: {
      action: "initiative", old_initiative: game.initiative,
      dice_result: result,
    },
  }, game, game.actions.length)
  game.gameState = undefined
  game.scenario.map.clearAllSelections()
  game.executeAction(init, false)
}

export function startPass(game: Game) {
  if (game.gameState) { return }
  game.gameState = {
    player: game.currentPlayer, currentAction: actionType.Pass,
    selection: []
  }
  game.refreshCallback(game)
}

export function finishPass(game: Game) {
  if (!game.gameState || game.gameState.currentAction !== actionType.Pass) { return }
  const pass = new GameAction({
    user: game.currentUser,
    player: game.gameState?.player,
    data: { action: "pass", old_initiative: game.initiative },
  }, game, game.actions.length)
  game.gameState = undefined
  game.scenario.map.clearAllSelections()
  game.executeAction(pass, false)
}

export function startFire(game: Game) {
  const selection = game.scenario.map.currentSelection[0]
  game.sponsonFire = false
  if (game.reactionFire) {
    placeReactionFireGhosts(game)
  }
  if (selection && selection.hex) {
    if (selection.unit.sponson && (selection.unit.jammed || selection.unit.weaponDestroyed)) {
      game.sponsonFire = true
    }
    const loc = {
      x: selection.hex.x, y: selection.hex.y,
      facing: selection.unit.rotates ? selection.unit.facing : undefined,
      turret: selection.unit.turreted ? selection.unit.turretFacing : undefined,
    }
    const canSelect = canMultiSelectFire(game, loc.x, loc.y, selection.unit)
    const allSelection = [{ x: loc.x, y: loc.y, id: selection.unit.id, counter: selection }]
    const initialSelection = [{ x: loc.x, y: loc.y, id: selection.unit.id, counter: selection }]
    if (canSelect) {
      game.openOverlay = game.scenario.map.hexAt(selection.hex)
    }
    game.gameState = {
      player: game.reactionFire ? game.opponentPlayer : game.currentPlayer,
      currentAction: actionType.Fire,
      selection: allSelection,
      fire: {
        initialSelection, doneSelect: !canSelect, path: [loc], targetSelection: [],
        firingSmoke: false, doneRotating: !selection.unit.turreted || game.sponsonFire, targetHexes: []
      }
    }
  }
}

export function fireAtHex(game: Game, x: number, y: number) {
  if (!game.gameState?.fire) { return }
  if (game.gameState.selection[0].counter.unit.offBoard ||
      game.gameState.fire.firingSmoke) {
    game.gameState.fire.targetHexes = [new Coordinate(x, y)]
  }
}

export function fireRotate(game: Game, dir: Direction) {
  if (!game.gameState?.fire) { return }
  const path = game.gameState.fire.path
  const x = path[0].x
  const y = path[0].y
  const origDir = path[0].turret
  if (dir === origDir) {
    game.gameState.fire.path = [path[0]]
  } else if (path.length > 1) {
    path[1].turret = dir
  } else {
    path.push({ x, y, turret: dir })
  }
}

export function fireSponsonToggle(game: Game) {
  if (!game.gameState?.fire) { return }
  game.sponsonFire = !game.sponsonFire
  game.gameState.fire.targetSelection = []
  game.gameState.fire.targetHexes = []
  game.scenario.map.clearAllTargetSelections()
  if (game.sponsonFire) {
    game.gameState.fire.path = [game.gameState.fire.path[0]]
    game.gameState.fire.doneRotating = true
  } else {
    game.gameState.fire.doneRotating = false
  }
}

export function fireSmokeToggle(game: Game) {
  if (!game.gameState?.fire) { return }
  if (game.gameState.fire.firingSmoke) {
    game.gameState.fire.firingSmoke = false
  } else {
    game.gameState.fire.firingSmoke = true
  }
  game.gameState.fire.targetHexes = []
  game.gameState.fire.targetSelection = []
  game.scenario.map.clearAllTargetSelections()
}

export function finishFire(game: Game) {
  if (!game.gameState?.fire) { return }
  const action = game.reactionFire ? (intensiveFiring(game) ? "reaction_intensive_fire" : "reaction_fire" ) :
    (intensiveFiring(game) ? "intensive_fire" : "fire" )
  const fire = new GameAction({
    user: game.reactionFire ? game.opponentUser : game.currentUser,
    player: game.gameState.player,
    data: {
      action, old_initiative: game.initiative,
      path: game.gameState.fire.path,
      origin: game.gameState.selection.map(s => {
        return {
          x: s.x, y: s.y, id: s.counter.unit.id, status: s.counter.unit.status,
          sponson: game.sponsonFire, wire: game.scenario.map.wireAt(new Coordinate(s.x, s.y))
        }
      }),
      target: game.gameState.fire.targetSelection.map(t => {
        return { x: t.x, y: t.y, id: t.counter.unit.id, status: t.counter.unit.status }
      }),
      fire_data: {
        start: game.gameState.fire.targetHexes.map(h => {
          return { x: h.x, y: h.y, smoke: !!game.gameState?.fire?.firingSmoke }
        }),
        final: []
      },
      dice_result: [],
    }
  }, game, game.actions.length)
  game.gameState = undefined
  game.reactionFire = false
  game.scenario.map.clearGhosts()
  game.scenario.map.clearAllSelections()
  game.executeAction(fire, false)
}

export function startReaction(game: Game) {
  game.reactionFire = true
}

export function passReaction(game: Game) {
  if (game.gameState) { return }
  const pass = new GameAction({
    user: game.currentUser,
    player: togglePlayer(game.currentPlayer),
    data: { action: "reaction_pass", old_initiative: game.initiative },
  }, game, game.actions.length)
  game.scenario.map.clearAllSelections()
  game.executeAction(pass, false)
}

export function startSniper(game: Game) {
  if (game.gameState || game.sniperNeeded.length < 1) { return }
  game.gameState = {
    player: game.currentPlayer, currentAction: actionType.Sniper,
    selection: game.sniperNeeded.map(s => {
      s.unit.select()
      return {
        x: s.loc.x, y: s.loc.y, id: s.unit.id,counter: game.findCounterById(s.unit.id) as Counter
      }
    })
  }
}

export function finishSniper(game: Game) {
  if (!game.gameState || game.gameState.currentAction !== actionType.Sniper) { return }
  const snipe = new GameAction({
    user: game.currentUser,
    player: game.gameState?.player,
    data: {
      action: "sniper", old_initiative: game.initiative,
      dice_result: [{ result: roll2d10(), type: "2d10" }],
      target: game.gameState.selection.map(s => {
        return { x: s.x, y: s.y, id: s.id, status: s.counter.unit.status }
      }),
    },
  }, game, game.actions.length)
  game.gameState = undefined
  game.scenario.map.clearAllSelections()
  game.executeAction(snipe, false)
}

export function startMoraleCheck(game: Game) {
  if (game.gameState || game.moraleChecksNeeded.length < 1) { return }
  const check = game.moraleChecksNeeded[0] as {
    unit: Unit, from: Coordinate[], to: Coordinate, incendiary?: boolean
  }
  const modifiers = moraleModifiers(game, check.unit, check.from, check.to, !!check.incendiary)
  const player = check.unit.playerNation === game.currentPlayerNation ?
    game.currentPlayer : game.opponentPlayer
  const counter = game.findCounterById(check.unit.id) as Counter
  game.gameState = {
    player, currentAction: actionType.MoraleCheck,
    selection: [{ x: check.to.x, y: check.to.y, id: check.unit.id, counter }],
    moraleCheck: {
      mod: modifiers.mod, why: modifiers.why,
      short: check.to.x !== counter.hex?.x || check.to.y !== counter.hex?.y,
    }
  }
  check.unit.select()
  game.refreshCallback(game)
}

export function finishMoraleCheck(game: Game) {
  if (!game.gameState || game.gameState.currentAction !== actionType.MoraleCheck) { return }
  const sel = game.gameState.selection[0]
  const mc = new GameAction({
    user: game.currentPlayer === game.gameState.player ?
      game.currentUser : game.opponentUser,
    player: game.gameState?.player,
    data: {
      action: "morale_check", old_initiative: game.initiative,
      dice_result: [{ result: roll2d10(), type: "2d10" }],
      morale_data: game.gameState.moraleCheck,
      target: [{ x: sel.x, y: sel.y, id: sel.id, status: sel.counter.unit.status }],
    },
  }, game, game.actions.length)
  game.gameState = undefined
  game.scenario.map.clearAllSelections()
  game.executeAction(mc, false)
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
      game.openOverlay = game.scenario.map.hexAt(selection.hex)
    }
    game.gameState = {
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

export function doMove(game: Game, x: number, y: number) {
  if (!game.gameState?.move) { return }
  if (!game.gameState?.selection) { return }
  const selection = game.gameState.selection
  const move = game.gameState.move
  const target = selection[0].counter.unit
  const lastPath = game.lastPath as GameActionPath
  if (move.placingSmoke) {
    const id = `uf-${game.actions.length}-${move.addActions.length}`
    move.addActions.push({
      x, y, type: "smoke", cost: lastPath.x === x && lastPath.y === y ? 1 : 2, id,
      index: game.gameState.move.path.length
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
      move.addActions.push({ x, y, type: gameActionAddActionType.VP, cost: 0,
      index: game.gameState.move.path.length })
    }
  }
  move.doneSelect = true
  game.closeOverlay = true
}

export function rotateToggle(game: Game) {
  if (!game.gameState?.move) { return }
  game.gameState.move.rotatingTurret = !game.gameState.move.rotatingTurret
}

export function moveRotate(game: Game, x: number, y: number, dir: Direction) {
  if (!game.gameState?.move) { return }
  const last = game.lastPath as GameActionPath
  if (game.gameState.move.rotatingTurret) {
    last.turret = dir
  } else {
    const lastDir = last.facing
    let turret = last.turret
    if (lastDir && turret) {
      turret = normalDir(turret + dir - lastDir)
    }
    game.gameState.move.path.push({
      x: x, y: y, facing: dir, turret,
    })
  }
}

export function placeSmokeToggle(game: Game) {
  if (!game.gameState?.move) { return }
  game.gameState.move.placingSmoke = !game.gameState.move.placingSmoke
  game.gameState.move.loadingMove = false
  game.gameState.move.droppingMove = false
}

export function shortingMoveToggle(game: Game) {
  if (!game.gameState?.move) { return }
  game.gameState.move.droppingMove = !game.gameState.move.droppingMove
  if (game.gameState.move.droppingMove) {
    const first = game.gameState.move.path[0]
    game.openOverlay = game.scenario.map.hexAt(new Coordinate(first.x, first.y))
  }
  game.gameState.move.loadingMove = false
  game.gameState.move.placingSmoke = false
}

export function loadingMoveToggle(game: Game) {
  if (!game.gameState?.move) { return }
  game.gameState.move.loadingMove = !game.gameState.move.loadingMove
  if (game.gameState.move.loadingMove) {
    if (needPickUpDisambiguate(game)) {
      const first = game.gameState.move.path[0]
      game.openOverlay = game.scenario.map.hexAt(new Coordinate(first.x, first.y))
    } else {
      const last = game.lastPath as GameActionPath
      game.openOverlay = game.scenario.map.hexAt(new Coordinate(last.x, last.y))
    }
    const last = game.lastPath as GameActionPath
    game.openOverlay = game.scenario.map.hexAt(new Coordinate(last.x, last.y))
  }
  game.gameState.move.droppingMove = false
  game.gameState.move.placingSmoke = false
}

export function finishMove(game: Game) {
  if (!game.gameState?.move) { return }
  const lastPath = game.lastPath as GameActionPath
  const counters = game.scenario.map.countersAt(new Coordinate(lastPath.x, lastPath.y))
  let check = undefined
  for (const c of counters) {
    if (c.hasFeature && c.feature.type === featureType.Mines) { check = c.feature; break }
  }
  const moveData = check ? { mines:
    {
      firepower: check.baseFirepower as number, infantry: !check.antiTank,
      antitank: check.fieldGun || check.antiTank
    }
   } : undefined
  const dice: GameActionDiceResult[] = []
  if (moveData) {
    const unit = game.gameState.selection[0].counter.unit
    const mines = moveData.mines
    if ((unit.armored && mines.antitank) || (!unit.armored && mines.infantry)) {
      dice.push({ result: roll2d10(), type: "2d10" })
    }
  }
  for (const a of game.gameState.move.addActions) {
    if (a.type === gameActionAddActionType.Smoke) { dice.push({ result: rolld10(), type: "d10" }) }
  }
  const move = new GameAction({
    user: game.currentUser,
    player: game.gameState.player,
    data: {
      action: rushing(game) ? "rush" : "move", old_initiative: game.initiative,
      path: game.gameState.move.path,
      origin: game.gameState.selection.map(s => {
        return { x: s.x, y: s.y, id: s.counter.unit.id, status: s.counter.unit.status }
      }),
      add_action: game.gameState.move.addActions.map(a => {
        return {
          type: a.type, x: a.x, y: a.y, id: a.id, parent_id: a.parent_id, facing: a.facing,
          status: a.status, index: a.index,
        }
      }),
      move_data: moveData,
      dice_result: dice,
    }
  }, game, game.actions.length)
  game.gameState = undefined
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
      game.openOverlay = game.scenario.map.hexAt(selection.hex)
    }
    game.gameState = {
      player: game.currentPlayer, currentAction: actionType.Assault, selection: allSelection,
      assault: { initialSelection, doneSelect: !canSelect, path: [loc], addActions: [] }
    }
  }
}

export function doAssault(game: Game, x: number, y: number) {
  if (!game.gameState?.assault) { return }
  if (!game.gameState?.selection) { return }
  const selection = game.gameState.selection
  const assault = game.gameState.assault
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
    assault.addActions.push({ x, y, type: gameActionAddActionType.VP, cost: 0, index: 0 })
  }
  assault.doneSelect = true
  game.closeOverlay = true
}

export function assaultRotate(game: Game, x: number, y: number, dir: Direction) {
  if (!game.gameState?.assault) { return }
  const last = game.lastPath as GameActionPath
  last.turret = dir
}

export function assaultClear(game: Game) {
  if (!game.gameState?.assault) { return }
  const assault = game.gameState.assault
  const x = game.gameState.selection[0].x
  const y = game.gameState.selection[0].y
  const f = game.scenario.map.countersAt(new Coordinate(x, y)).filter(c => c.hasFeature)[0]
  assault.addActions.push({ x, y, type: gameActionAddActionType.Clear, cost: 0, id: f.feature.id, index: 0 })
  game.closeOverlay = true
}

export function assaultEntrench(game: Game) {
  if (!game.gameState?.assault) { return }
  const assault = game.gameState.assault
  const x = game.gameState.selection[0].x
  const y = game.gameState.selection[0].y
  game.scenario.map.unshiftGhost(new Coordinate(x, y), new Feature({
    ft: 1, n: "Shell Scrape", t: "foxhole", i: "foxhole", d: 1,
  }))
  assault.addActions.push({ x, y, type: gameActionAddActionType.Entrench, cost: 0, index: 0 })
  game.closeOverlay = true
}

export function finishAssault(game: Game) {
  if (!game.gameState?.assault) { return }
  const assault = new GameAction({
    user: game.currentUser,
    player: game.gameState.player,
    data: {
      action: "assault_move", old_initiative: game.initiative,
      path: game.gameState.assault.path,
      origin: game.gameState.selection.map(s => {
        return { x: s.x, y: s.y, id: s.counter.unit.id, status: s.counter.unit.status }
      }),
      add_action: game.gameState.assault.addActions.map(a => {
        return { type: a.type, x: a.x, y: a.y, id: a.id, index: a.index }
      }),
    }
  }, game, game.actions.length)
  game.gameState = undefined
  game.scenario.map.clearGhosts()
  game.scenario.map.clearAllSelections()
  game.executeAction(assault, false)
}

export function startBreakdown(game: Game) {
  const action = game.lastAction
  if (!action || game.gameState?.currentAction === actionType.Breakdown) { return }
  if (action.data.origin && action.data.origin.length > 0) {
    const id = action.data.origin[0].id
    const counter = game.findCounterById(id) as Counter
    if (["move", "assault_move"].includes(action.data.action) && counter.unit.breakdownRoll) {
      game.gameState = {
        player: game.currentPlayer, currentAction: actionType.Breakdown,
        selection: [{
          x: counter.hex?.x ?? 0, y: counter.hex?.y ?? 0, id: counter.unit.id, counter,
        }],
      }
      counter.unit.select()
      game.refreshCallback(game)
    }
  }
}

export function finishBreakdown(game: Game) {
  if (!game.gameState || game.gameState.currentAction !== actionType.Breakdown) { return }
  const bd = new GameAction({
    user: game.currentUser,
    player: game.gameState?.player,
    data: {
      action: "breakdown", old_initiative: game.initiative,
      origin: game.gameState.selection.map(s => {
        return { x: s.x, y: s.y, id: s.counter.unit.id, status: s.counter.unit.status }
      }),
      dice_result: [{ result: roll2d10(), type: "2d10" }],
    },
  }, game, game.actions.length)
  game.gameState = undefined
  game.scenario.map.clearAllSelections()
  game.executeAction(bd, false)
}

export function startRoutAll(game: Game) {
  const counters: Counter[] = []
  game.scenario.map.allUnits.forEach(c => {
    if (c.unit.isBroken && !c.unit.routed && c.unit.playerNation !== game.currentPlayerNation) {
      counters.push(c)
    }
  })
  game.gameState = {
    player: game.currentPlayer, currentAction: actionType.RoutAll,
    selection: counters.map(c => {
      const hex = c.hex as Coordinate
      c.unit.select()
      return { x: hex.x, y: hex.y, id: c.unit.id, counter: c }
    })
  }
  game.refreshCallback(game)
}

export function finishRoutAll(game: Game) {
  if (!game.gameState || game.gameState.currentAction !== actionType.RoutAll) { return }
  const ra = new GameAction({
    user: game.currentUser,
    player: game.gameState?.player,
    data: {
      action: "rout_all", old_initiative: game.initiative,
      target: game.gameState.selection.map(s => {
        return { x: s.x, y: s.y, id: s.counter.unit.id, status: s.counter.unit.status }
      }),
    },
  }, game, game.actions.length)
  game.gameState = undefined
  game.scenario.map.clearAllSelections()
  game.executeAction(ra, false)
  game.refreshCallback(game)
}

export function startRoutCheck(game: Game) {
  if (game.gameState || game.routCheckNeeded.length < 1) { return }
  const check = game.routCheckNeeded[0] as { unit: Unit, loc: Coordinate }
  const modifiers = moraleModifiers(game, check.unit, [check.loc], check.loc, false)
  const player = game.opponentPlayer
  const counter = game.findCounterById(check.unit.id) as Counter
  game.gameState = {
    player, currentAction: actionType.RoutCheck,
    selection: [{ x: check.loc.x, y: check.loc.y, id: check.unit.id, counter }],
    routCheck: { mod: modifiers.mod, why: modifiers.why }
  }
  check.unit.select()
  game.refreshCallback(game)
}

export function finishRoutCheck(game: Game) {
  if (!game.gameState || game.gameState.currentAction !== actionType.RoutCheck) { return }
  const sel = game.gameState.selection[0]
  const rc = new GameAction({
    user: game.currentPlayer === game.gameState.player ?
      game.currentUser : game.opponentUser,
    player: game.gameState?.player,
    data: {
      action: "rout_check", old_initiative: game.initiative,
      dice_result: [{ result: roll2d10(), type: "2d10" }],
      rout_check_data: game.gameState.routCheck,
      target: [{ x: sel.x, y: sel.y, id: sel.id, status: sel.counter.unit.status }],
    },
  }, game, game.actions.length)
  game.gameState = undefined
  game.scenario.map.clearAllSelections()
  game.executeAction(rc, false)
}

export function startRout(game: Game, optional: boolean) {
  const selection = game.scenario.map.currentSelection[0]
  const player = selection.unit.playerNation === game.currentPlayerNation ?
    game.currentPlayer : game.opponentPlayer
  const hex = selection.hex as Coordinate
  game.gameState = {
    player, currentAction: actionType.Rout,
    selection: [{ x: hex.x, y: hex.y, id: selection.unit.id, counter: selection }],
    rout: {
      optional: optional,
      routPathTree: findRoutPathTree(game, hex, selection.unit.currentMovement, player, selection.unit),
    }
  }
  game.refreshCallback(game)
}

export function finishRout(game: Game, x?: number, y?: number) {
  if (!game.gameState || game.gameState.currentAction !== actionType.Rout) { return }
  let path: Coordinate[] = []
  if (x !== undefined && y !== undefined) {
    if (!game.gameState.rout?.routPathTree) { return }
    const paths = routPaths(game.gameState.rout.routPathTree)
    for (const p of paths) {
      const last = p[p.length - 1]
      if (last.x === x && last.y === y) {
        path = p
        break
      }
    }
  } else if (game.gameState.rout?.routPathTree) { return }
  const addAction: GameActionAddAction[] = []
  const counter = game.gameState.selection[0].counter
  if (counter.unit.children.length > 0) {
    const hex = counter.hex as Coordinate
    const child = counter.unit.children[0]
    const facing = child.rotates ? child.facing : undefined
    addAction.push({
      type: gameActionAddActionType.Drop, x: hex.x, y: hex.y, id: child.id, index: 0, facing
    })
  }
  const rout = new GameAction({
    user: game.currentUser,
    player: game.gameState?.player,
    data: {
      action: game.gameState.rout?.optional ? "rout_self" : "rout_move",
      old_initiative: game.initiative,
      path: path.map(c => { return { x: c.x, y: c.y } }),
      target: game.gameState.selection.map(s => {
        return {
          x: s.x, y: s.y, id: s.counter.unit.id, status: s.counter.unit.status
        }
      }),
      add_action: addAction,
    },
  }, game, game.actions.length)
  game.gameState = undefined
  game.scenario.map.clearAllSelections()
  game.executeAction(rout, false)
}

export function needPickUpDisambiguate(game: Game): boolean {
  const action = game.gameState
  if (!action?.move) { return false }
  if (action.move.loader) { return false }
  return getLoader(game).length > 1 && !getLoader(game)[0].unit.transport
}

export function getLoader(game: Game): Counter[] {
  const action = game.gameState
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
