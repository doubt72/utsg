import { Coordinate, Player, unitStatus, unitType } from "../../utilities/commonTypes";
import Game, { closeProgress } from "../Game";
import Map from "../Map";
import { stateType } from "./state/BaseState";

export function maxCCCasualties(map: Map, loc: Coordinate, playerNation: string): number {
  const counters = map.countersAt(loc)
  let total = 0
  for (const c of counters) {
    if (c.hasUnit && c.unit.playerNation === playerNation) {
      if (c.unit.isVehicle && !c.unit.isWreck) {
        total += 1
      } else if (c.unit.canCarrySupport && c.unit.status === unitStatus.Broken) {
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

export function closeCombatCasualyNeeded(game: Game): Coordinate | false {
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
    if (c.unit.nation !== nation || c.unit.type !== unitType.Leader) { continue }
    if (c.unit.leadership > leadership) { leadership = c.unit.leadership }
  }
  for (const c of counters) {
    if (c.unit.nation !== nation && !c.unit.parent) { continue }
    if (c.unit.parent && c.unit.parent.nation !== nation) { continue }
    if (c.unit.isVehicle) {
      rc += c.unit.armored ? 2 : 1
    } else if (c.unit.leader) {
      rc += c.unit.currentFirepower
    } else if (c.unit.canCarrySupport) {
      rc += c.unit.currentFirepower + (c.unit.assault ? 2 : 0) + leadership
    } else if (c.unit.assault && c.unit.parent) {
      rc += 2
    }
  }
  return rc
}
