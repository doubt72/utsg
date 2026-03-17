import { Coordinate, CounterSelectionTarget, hexOpenType, HexOpenType } from "../../../utilities/commonTypes";
import { roll2d10 } from "../../../utilities/utilities";
import Counter from "../../Counter";
import Game from "../../Game";
import GameAction, { GameActionUnit } from "../../GameAction";
import { checkPhase } from "../../support/gamePhase";
import Unit from "../../Unit";
import { leadershipAt } from "../fire";
import BaseState, { stateType } from "./BaseState";

export function alreadyRallied(game: Game, id: string): boolean {
  for (let i = game.actions.length - 1; i >= 0; i--) {
    const action = game.actions[i]
    if (action.type !== "rally") { break }
    if ((action.data.target as GameActionUnit[])[0].id === id) {
      return true
    }
  }
  return false
}

export default class RallyState extends BaseState {
  constructor(game: Game) {
    super(game, stateType.Rally, game.currentPlayer)
    if (!game.scenario.map.anyUnitsCanRally(game.currentPlayer)) { checkPhase(game, false) }
    game.refreshCallback(game)
  }

  openHex(x: number, y: number): HexOpenType {
    const counters = this.map.countersAt(new Coordinate(x, y))
    const unbrokerLeader = this.leaderAtHex(x, y, undefined)
    for (const c of counters) {
      const u = c.unit
      if (!u.isFeature) {
        const unit = u as Unit
        if (this.samePlayer(unit)) {
          if ((unit.isBroken || unit.jammed) &&
            (this.game.freeRallyAvailable || unbrokerLeader)) {
            return hexOpenType.Open
          }
        }
      }
    }
    return hexOpenType.Closed;
  }

  select(selection: CounterSelectionTarget, callback: () => void) {
    if (selection.target.type === "reinforcement") { return }
    const x = selection.target.xy.x
    const y = selection.target.xy.y
    const id = selection.counter.target.id
    const counter = this.map.unitAtId(new Coordinate(x, y), id) as Counter
    if (!counter.unit.isFeature && this.samePlayer(counter.unit)) {
      if ((counter.unit.isBroken || counter.unit.jammed) &&
        (this.game.freeRallyAvailable || this.leaderAtHex(x, y, counter.unit))) {
        if (alreadyRallied(this.game, id)) {
          this.game.addMessage("unit already attempted to rally")
        } else {
          counter.unit.select()
          this.map.clearOtherTargetSelections(x, y, counter.unit.id)
        }
      }
    }
    callback()
  }

  selectable(selection: CounterSelectionTarget): boolean {
    if (selection.target.type !== "map") { return false }
    const unit = selection.counter.unit
    if (this.samePlayer(unit) && (unit.isBroken || unit.jammed || unit.sponsonJammed)) {
      return true
    } else { return false }
  }

  get activeCounters(): Counter[] {
    const rc: Counter[] = []
    for (const c of this.game.scenario.map.allCounters) {
      const hex = c.hex as Coordinate
      if (this.openHex(hex.x, hex.y)) { rc.push(c) }
    }
    return rc
  }

  leaderAtHex(x: number, y: number, checkedUnit?: Unit): boolean {
    const counters = this.map.countersAt(new Coordinate(x, y))
    for (const c of counters) {
      const u = c.unit
      if (!u.isFeature) {
        const unit = u as Unit
        if (unit.nation === this.game.currentPlayerNation && unit.id !== checkedUnit?.id) {
          if (!unit.isBroken && unit.leader) { return true }
        }
      }
    }
    return false
  }

  nextToEnemy(loc: Coordinate): boolean {
    for (let d = 1; d <= 6; d++) {
      const hex = this.map.neightborCoordinate(loc, d)
      const counters = this.map.countersAt(hex)
      for (const c of counters) {
        if (!c.unit.isFeature && !c.unit.isBroken &&
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
    const dice = [{ result: roll2d10(), type: "2d10" }]
    const counter = this.map.currentSelection[0]
    const hex = counter.hex as Coordinate
    const data = counter.unit.canCarrySupport ? {
      infantry: {
        morale_base: counter.unit.currentMorale,
        leader_mod: leadershipAt(this.game, hex),
        terrain_mod: this.map.hexAt(hex)?.terrain.cover as number,
        next_to_enemy: this.nextToEnemy(hex),
      },
      free_rally: this.leaderAtHex(hex.x, hex.y, counter.unit),
    } : {
      weapon: {
        fix_roll: counter.unit.repairRoll as number,
        break_roll: counter.unit.breakWeaponRoll as number,
      },
      free_rally: this.leaderAtHex(hex.x, hex.y, counter.unit),
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
