import { Coordinate, Player } from "../../utilities/commonTypes"
import Counter from "../Counter"
import Feature from "../Feature"
import Game from "../Game"
import GameAction from "../GameAction"
import Unit from "../Unit"

export function hideObserved(game: Game, uf: Unit | Feature): boolean {
  if (uf.isFeature) { return false }
  const unit = uf as Unit
  const player = unit.playerNation === game.playerOneNation ? 1 : 2
  const special = game.scenario.specialRules
  if (unit.canCarrySupport || unit.uncrewedSW) {
    if ((special.includes("allied_hidden_units") && player === 1) ||
        (special.includes("axis_hidden_units") && player === 2)) {
      return true
    }
  }
  return false
}

export function observeAction(game: Game, loc: Coordinate, counters: Counter[], action: string) {
  game.executeAction(new GameAction({
    user: game.currentUser, player: counters[0].unit.playerNation === game.playerOneNation ? 1 : 2,
    data: {
      action, old_initiative: game.initiative,
      target: counters.map(t => {
        return {
          x: loc.x, y: loc.y, id: t.unit.id, name: t.unit.name, status: t.unit.status
        }
      })
    }
  }, game), false)
}

export function observeFrom(game: Game, loc: Coordinate, player: Player) {
  const map = game.scenario.map
  const nation = player === 1 ? game.playerOneNation : game.playerTwoNation
  let contact = false
  for (const h of map.hexNeighbors(loc)) {
    if (!h) { continue }
    const counters = map.countersAt(h.coord)
    const decoys: Counter[] = []
    const targets: Counter[] = []
    for (const c of counters) {
      if (c.hasUnit && c.unit.nation !== nation) {
        contact = true
        if (c.unit.decoy) {
          decoys.push(c)
        } else if (!c.unit.observed) {
          targets.push(c)
        }
      }
    }
    if (targets.length > 0) { observeAction(game, h.coord, targets, "observe") }
    if (decoys.length > 0) { observeAction(game, h.coord, decoys, "remove_decoy") }
  }
  if (contact) {
    const counters = map.countersAt(loc)
    const decoys: Counter[] = []
    const targets: Counter[] = []
    for (const c of counters) {
      if (c.hasUnit && c.unit.nation === nation) {
        contact = true
        if (c.unit.decoy) {
          decoys.push(c)
        } else if (!c.unit.observed) {
          targets.push(c)
        }
      }
    }
    if (targets.length > 0) { observeAction(game, loc, targets, "observe") }
    if (decoys.length > 0) { observeAction(game, loc, decoys, "remove_decoy") }
  }
}

export function observe(game: Game, loc: Coordinate) {
  const counters = game.scenario.map.countersAt(loc)
  const decoys: Counter[] = []
  const targets: Counter[] = []
  for (const c of counters) {
    if (c.hasUnit) {
      if (c.unit.decoy) {
        decoys.push(c)
      } else if (!c.unit.observed) {
        targets.push(c)
      }
    }
  }
  if (targets.length > 0) { observeAction(game, loc, targets, "observe") }
  if (decoys.length > 0) { observeAction(game, loc, decoys, "remove_decoy") }
}
