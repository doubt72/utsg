import { Coordinate, CounterSelectionTarget, hexOpenType, HexOpenType, unitStatus } from "../../../utilities/commonTypes";
import { roll2d10 } from "../../../utilities/utilities";
import Counter from "../../Counter";
import Game from "../../Game";
import GameAction, { GameActionUnit } from "../../GameAction";
import Unit from "../../Unit";
import { leadershipAt } from "../fire";
import BaseState, { stateType } from "./BaseState";

export default class RallyState extends BaseState {
  constructor(game: Game) {
    super(game, stateType.Rally, game.currentPlayer)
    game.refreshCallback(game)
  }

  openHex(x: number, y: number): HexOpenType {
    const map = this.game.scenario.map
    const counters = map.countersAt(new Coordinate(x, y))
    const unbrokerLeader = this.leaderAtHex(x, y)
    for (const c of counters) {
      const u = c.unit
      if (!u.isFeature) {
        const unit = u as Unit
        if (this.samePlayer(unit)) {
          if ((unit.isBroken || unit.jammed) &&
            (this.game.freeRally || unbrokerLeader)) {
            return hexOpenType.Open
          }
        }
      }
    }
    return hexOpenType.Closed;
  }

  select(selection: CounterSelectionTarget, callback: () => void) {
    if (selection.target.type === "reinforcement") { return }
    const map = this.game.scenario.map
    const x = selection.target.xy.x
    const y = selection.target.xy.y
    const id = selection.counter.target.id
    const counter = map.unitAtId(new Coordinate(x, y), id) as Counter
    if (!counter.unit.isFeature && this.samePlayer(counter.unit)) {
      if ((counter.unit.isBroken || counter.unit.jammed) &&
        (this.game.freeRally || this.leaderAtHex(x, y))) {
        if (this.alreadyRallied(id)) {
          this.game.addMessage("unit already attempted to rally")
        } else {
          counter.unit.select()
          map.clearOtherTargetSelections(x, y, counter.unit.id)
        }
      }
    }
    callback()
  }

  alreadyRallied(id: string): boolean {
    for (let i = this.game.actions.length - 1; i >= 0; i--) {
      const action = this.game.actions[i]
      if (action.type === "phase") { break }
      if ((action.data.target as GameActionUnit[])[0].id === id) { return true }
    }
    return false
  }

  leaderAtHex(x: number, y: number): boolean {
    const map = this.game.scenario.map
    const counters = map.countersAt(new Coordinate(x, y))
    for (const c of counters) {
      const u = c.unit
      if (!u.isFeature) {
        const unit = u as Unit
        if (unit.nation === this.game.currentPlayerNation) {
          if (!unit.isBroken && unit.leader) {
            return true
          }
        }
      }
    }
    return false
  }

  nextToEnemy(loc: Coordinate): boolean {
    const map = this.game.scenario.map
    for (let d = 1; d <= 6; d++) {
      const hex = map.neightborCoordinate(loc, d)
      const counters = map.countersAt(hex)
      for (const c of counters) {
        if (!c.unit.isFeature && c.unit.status !== unitStatus.Broken &&
          !this.samePlayer(c.unit)) { return true }
      }
    }
    return false
  }

  pass() {
    const action = new GameAction({
      user: this.game.currentUser, player: this.player,
      data: { action: "rally_pass", old_initiative: this.game.initiative },
    }, this.game)
    this.execute(action)
  }

  finish() {
    const map = this.game.scenario.map
    const dice = [{ result: roll2d10(), type: "2d10" }]
    const counter = map.currentSelection[0]
    const hex = counter.hex as Coordinate
    const data = counter.unit.canCarrySupport ? {
      infantry: {
        morale_base: counter.unit.currentMorale,
        leader_mod: leadershipAt(this.game, hex),
        terrain_mod: map.hexAt(hex)?.terrain.cover as number,
        next_to_enemy: this.nextToEnemy(hex),
      },
      free_rally: this.leaderAtHex(hex.x, hex.y),
    } : {
      weapon: {
        fix_roll: counter.unit.repairRoll as number,
        break_roll: counter.unit.breakWeaponRoll as number,
      },
      free_rally: this.leaderAtHex(hex.x, hex.y),
    }
    const action = new GameAction({
      user: this.game.currentUser, player: this.player,
      data: {
        action: "rally", target: [
          { x: hex.x, y: hex.y, id: counter.unit.id, status: counter.unit.status }
        ],
        rally_data: data,
        old_initiative: this.game.initiative,
        dice_result: dice,
      },
    }, this.game)
    this.execute(action)
  }
}
