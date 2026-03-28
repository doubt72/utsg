import { Coordinate, Player } from "../../utilities/commonTypes";
import Game, { CloseCheck, closeProgress } from "../Game";
import Map from "../Map";
import { stateType } from "./state/BaseState";

export function maxCCCasualties(map: Map, loc: Coordinate, playerNation: string): number {
  const counters = map.countersAt(loc)
  let total = 0
  for (const c of counters) {
    if (c.hasUnit && c.unit.playerNation === playerNation) {
      if (c.unit.isVehicle && !c.unit.isWreck) {
        total += 1
      } else if (c.unit.canCarrySupport && c.unit.isBroken) {
        total += 1
      } else if (c.unit.canCarrySupport) {
        total += 2
      }
    }
  }
  return total
}

export function closeCombatDone(game: Game): boolean {
  if (game.gameState?.type !== stateType.CloseCombat) { return false }
  return game.closeNeeded.filter(cn => cn.state !== closeProgress.Done).length < 1
}

export function closeCombatCasualtyNeeded(game: Game): Coordinate | false {
  if (game.gameState?.type !== stateType.CloseCombat) { return false }
  const casualty = game.closeNeeded.filter(cn => cn.state === closeProgress.NeedsCasualties)
  if (casualty.length < 1) { return false }
  return casualty[0].loc
}

export function closeCombatFirepower(game: Game, loc: Coordinate, player: Player): number {
  let rc = 0
  const nation = player === 1 ? game.playerOneNation : game.playerTwoNation
  let leadership = 0
  const counters = game.scenario.map.countersAt(loc)
  for (const c of counters) {
    if (c.unit.nation !== nation || !c.unit.leader) { continue }
    if (c.unit.currentLeadership > leadership) { leadership = c.unit.currentLeadership }
  }
  for (const c of counters) {
    if (!c.hasUnit) { continue }
    if (c.unit.nation !== nation && !c.unit.parent) { continue }
    if (c.unit.parent && c.unit.parent.nation !== nation) { continue }
    if (c.unit.canCarrySupport && !c.unit.leader) {
      rc += c.unit.closeCombatFirepower + leadership
    } else {
      rc += c.unit.closeCombatFirepower
    }
  }
  return rc
}

export function setCCPlayer(game: Game, current: CloseCheck) {
  if (current.p1Reduce > 0) {
    if (game.currentPlayer !== 1) { game.togglePlayer() }
  } else if (current.p2Reduce > 0) {
    if (game.currentPlayer !== 2) { game.togglePlayer() }
  } else if (current.p1Reduce < 1 && current.p2Reduce < 1) {
    game.resetCurrentPlayer()
  }
}
