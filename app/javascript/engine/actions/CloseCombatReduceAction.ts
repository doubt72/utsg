import { Coordinate, unitStatus } from "../../utilities/commonTypes";
import { coordinateToLabel } from "../../utilities/utilities";
import { setCCPlayer } from "../control/closeCombat";
import Game, { closeProgress } from "../Game";
import { GameActionData, GameActionUnit } from "../GameAction";
import Unit from "../Unit";
import BaseAction from "./BaseAction";

export default class CloseCombatReduceAction extends BaseAction {
  target: GameActionUnit

  constructor(data: GameActionData, game: Game, index: number) {
    super(data, game, index)

    this.validate(data.data.target as GameActionUnit[])

    this.target = (data.data.target as GameActionUnit[])[0]
  }

  get type(): string { return "close_combat_reduce" }

  get stringValue(): string {
    const loc = new Coordinate(this.target.x, this.target.y)
    const unit = this.game.findUnitById(this.target.id) as Unit
    if (unit.isVehicle || this.target.status === unitStatus.Broken) {
      return `${this.game.nationNameForPlayer(this.player)} ${unit.name} at ${coordinateToLabel(loc)} eliminated`
    } else {
      return `${this.game.nationNameForPlayer(this.player)} ${unit.name} at ${coordinateToLabel(loc)} broken`
    }
  }

  get undoPossible() {
    return false
  }

  mutateGame(): void {
    const loc = new Coordinate(this.target.x, this.target.y)
    const unit = this.game.findUnitById(this.target.id) as Unit
    if (unit.isVehicle) {
      unit.wreck(this.game)
    } else if (unit.isBroken) {
      this.game.scenario.map.eliminateCounter(loc, this.target.id)
    } else {
      unit.break()
    }
    const current = this.game.closeNeeded.filter(cn => cn.loc.x === this.target.x && cn.loc.y === this.target.y)[0]
    if (this.game.currentPlayer === 1) {
      current.p1Reduce -= 1
    } else {
      current.p2Reduce -= 1
    }
    if (current.p1Reduce < 1 && current.p2Reduce < 1) {
      current.state = closeProgress.Done
      const counters = this.game.scenario.map.countersAt(loc)
      if (!this.map.contactAt(loc)) {
        for (const c of counters) {
          if (c.hasUnit && !c.unit.isWreck && !c.unit.isBroken && (c.unit.isVehicle || c.unit.canCarrySupport) ) {
            c.unit.exhaust()
            const current = c.unit.playerNation === this.game.currentPlayerNation
            const vp = this.map.victoryAt(loc)
            const currentVP = vp === this.game.currentPlayer
            if (current !== currentVP) { this.map.toggleVP(loc) }
          }
        }
      }
    }
    setCCPlayer(this.game, current)
    this.game.closeOverlay = true
    if (!this.game.testGame && localStorage.getItem("username") === this.game.currentUser &&
        (current.p1Reduce > 0 || current.p2Reduce > 0)) {
      this.game.openOverlay = this.game.scenario.map.hexAt(loc)
    }
  }
}
