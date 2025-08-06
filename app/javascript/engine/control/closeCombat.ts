import { Coordinate, Player, unitType } from "../../utilities/commonTypes";
import Game from "../Game";

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
    } else if (c.unit.canCarrySupport) {
      rc += c.unit.currentFirepower + (c.unit.assault ? 2 : 0) + leadership
    } else if (c.unit.assault && c.unit.parent) {
      rc += 2
    }
  }
  return rc
}
