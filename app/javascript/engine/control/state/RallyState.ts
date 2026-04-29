import { Coordinate, CounterSelectionTarget, hexOpenType, HexOpenType, Player } from "../../../utilities/commonTypes";
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

export function nextToEnemy(game: Game, loc: Coordinate): boolean {
  const map = game.scenario.map
  const counters = map.countersAt(loc)
  for (const c of counters) {
    if (!c.unit.isFeature && !c.unit.isBroken &&
      c.unit.playerNation !== game.currentPlayerNation) { return true }
  }
  for (let d = 1; d <= 6; d++) {
    const hex = map.neightborCoordinate(loc, d)
    const hexCounters = map.countersAt(hex)
    for (const c of hexCounters) {
      if (!c.unit.isFeature && !c.unit.isBroken &&
        c.unit.playerNation !== game.currentPlayerNation) { return true }
    }
  }
  return false
}

export function leaderAtHex(game: Game, x: number, y: number, player: Player, checkedUnit?: Unit): boolean {
  const counters = game.scenario.map.countersAt(new Coordinate(x, y))
  const nation = player === 1 ? game.playerOneNation : game.playerTwoNation
  for (const c of counters) {
    const u = c.unit
    if (!u.isFeature) {
      if (u.playerNation === nation && u.id !== checkedUnit?.id) {
        if (!u.isBroken && u.leader) { return true }
      }
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
    const unbrokerLeader = leaderAtHex(this.game, x, y, this.game.currentPlayer, undefined)
    for (const c of counters) {
      const u = c.unit
      if (!u.isFeature) {
        const unit = u as Unit
        if (this.samePlayer(unit)) {
          if (unit.isBroken || ((unit.jammed || unit.sponsonJammed) && !unit.isWreck)) {
            if (this.game.freeRallyAvailable(this.game.currentPlayer) || unbrokerLeader) {
              if (alreadyRallied(this.game, unit.id)) { continue }
              if (unit.operated && !unit.parent) { continue }
              return hexOpenType.Open
            }
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
      if ((counter.unit.isBroken || ((counter.unit.jammed || counter.unit.sponsonJammed) && !counter.unit.isWreck)) &&
        (this.game.freeRallyAvailable(this.game.currentPlayer) ||
         leaderAtHex(this.game, x, y, this.game.currentPlayer, counter.unit))) {
        if (alreadyRallied(this.game, id)) {
          this.game.addMessage("unit already attempted to rally")
        } else if (counter.unit.operated && !counter.unit.parent) {
          this.game.addMessage("can't repair unmanned weapon")
        } else {
          this.map.select(counter.unit)
          this.map.clearOtherSelections(x, y, counter.unit.id)
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

  pass() {
    const action = new GameAction({
      user: this.game.currentUser, player: this.player,
      data: { action: "rally_pass", old_initiative: this.game.initiative },
    }, this.game)
    this.execute(action)
  }

  finish() {
    const counter = this.map.selection as Counter
    const hex = counter.hex as Coordinate
    const data = counter.unit.canCarrySupport ? {
      infantry: {
        morale_base: counter.unit.currentMorale,
        leader_mod: leadershipAt(this.game, hex),
        terrain_mod: this.map.hexAt(hex)?.terrain.cover as number,
        next_to_enemy: nextToEnemy(this.game, hex),
      },
      free_rally: leaderAtHex(this.game, hex.x, hex.y, this.game.currentPlayer, counter.unit),
    } : {
      weapon: {
        fix_roll: counter.unit.repairRoll as number,
        break_roll: counter.unit.breakWeaponRoll as number,
      },
      free_rally: leaderAtHex(this.game, hex.x, hex.y, this.game.currentPlayer, counter.unit),
    }
    const target: GameActionUnit = {
      x: hex.x, y: hex.y, id: counter.unit.id, name: counter.unit.name, status: counter.unit.status
    }
    const action = new GameAction({
      user: this.game.currentUser, player: this.player,
      data: {
        action: "rally", target: [target], rally_data: data,
        old_initiative: this.game.initiative,  dice_result: [{ result: roll2d10() }],
      },
    }, this.game)
    this.execute(action)
  }
}
