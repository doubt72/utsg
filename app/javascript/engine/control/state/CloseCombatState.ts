import { Coordinate, CounterSelectionTarget, hexOpenType, HexOpenType } from "../../../utilities/commonTypes";
import { rolld10, otherPlayer } from "../../../utilities/utilities";
import Counter from "../../Counter";
import Game, { closeProgress } from "../../Game";
import GameAction, { GameActionUnit } from "../../GameAction";
import { closeCombatCasualtyNeeded, closeCombatFirepower } from "../closeCombat";
import BaseState, { stateType } from "./BaseState";

export default class CloseCombatState extends BaseState {
  constructor(game: Game) {
    super(game, stateType.CloseCombat, game.currentPlayer)
    this.startIfNotStarted()
    game.refreshCallback(game)
  }

  openHex(x: number, y: number): HexOpenType {
    let needsCasualties = false
    for (const cn of this.game.closeNeeded) {
      if (cn.state === closeProgress.NeedsCasualties) { needsCasualties = true }
      if (cn.loc.x === x && cn.loc.y === y && cn.state === closeProgress.NeedsCasualties ) { return hexOpenType.Open }
    }
    if (needsCasualties) { return hexOpenType.Closed }
    for (const cn of this.game.closeNeeded) {
      if (cn.loc.x === x && cn.loc.y === y && cn.state !== closeProgress.Done ) { return hexOpenType.Open }
    }
    return hexOpenType.Closed
  }

  select(selection: CounterSelectionTarget, callback: () => void) {
    if (selection.target.type === "reinforcement") { return }
    const x = selection.target.xy.x
    const y = selection.target.xy.y
    const id = selection.counter.target.id
    const counter = this.map.unitAtId(new Coordinate(x, y), id) as Counter
    if (counter.unit.selected) {
      this.map.clearAllSelections()
    } else {
      const casualty = closeCombatCasualtyNeeded(this.game)
      if (casualty) {
        counter.unit.select()
        this.map.clearOtherSelections(x, y, id)
      } else {
        this.map.selectAllAt(x, y)
      }
    }
    callback()
  }

  selectable(selection: CounterSelectionTarget): boolean {
    if (selection.target.type !== "map") { return false }
    const xy = selection.target.xy
    for (const cn of this.game.closeNeeded) {
      if (cn.state === closeProgress.NeedsCasualties) {
        if (selection.counter.unit.operated) { return false }
        // if (this.samePlayer(selection.counter.unit) && cn.oReduce === 0) { return false }
        if (!this.samePlayer(selection.counter.unit)) { return false }
        return cn.loc.x === xy.x && cn.loc.y === xy.y
      }
    }
    for (const cn of this.game.closeNeeded) {
      if (cn.state !== closeProgress.Done && cn.loc.x === xy.x && cn.loc.y === xy.y) {
        return true
      }
    }
    return false
  }

  get activeCounters(): Counter[] {
    let rc: Counter[] = []
    for (const cn of this.game.closeNeeded) {
      const counters = this.map.countersAt(cn.loc)
      if (cn.state === closeProgress.NeedsCasualties) {
        return counters
      }
      if (cn.state !== closeProgress.Done) {
        rc = rc.concat(counters)
      }
    }
    return rc
  }

  rollForCombat() {
    const dice = [{ result: rolld10(), type: "d10" }, { result: rolld10(), type: "d10" }]
    const origin: GameActionUnit[] = []
    const target: GameActionUnit[] = []
    const counters = this.map.currentSelection
    counters.forEach(c => {
      const hex = c.hex as Coordinate
      if (this.samePlayer(c.unit)) {
        origin.push({ x: hex.x, y: hex.y, id: c.unit.id, status: c.unit.status })
      } else {
        target.push({ x: hex.x, y: hex.y, id: c.unit.id, status: c.unit.status })
      }
    })
    const p0 = this.player === 1 ? 1 : 2
    const oBase = closeCombatFirepower(this.game, counters[0].hex as Coordinate, p0)
    const tBase = closeCombatFirepower(this.game, counters[0].hex as Coordinate, otherPlayer(p0))
    const action = new GameAction({
      user: this.game.currentPlayer === this.player ? this.game.currentUser : this.game.opponentUser,
      player: this.player,
      data: {
        action: "close_combat_roll", old_initiative: this.game.initiative,
        dice_result: dice, origin, target, cc_data: { o_base: oBase, t_base: tBase },
      }
    }, this.game)
    this.map.clearAllSelections()
    this.game.executeAction(action, false)
  }

  reduceUnit() {
    const counter = this.map.currentSelection[0]
    const hex = counter.hex as Coordinate
    const player = counter.unit.nation === this.game.currentPlayerNation ? this.game.currentPlayer :
      this.game.opponentPlayer
    const action = new GameAction({
      user: this.game.currentPlayer === player ? this.game.currentUser : this.game.opponentUser,
      player: player,
      data: {
        action: "close_combat_reduce", old_initiative: this.game.initiative,
        target: [{ x: hex.x, y: hex.y, id: counter.unit.id, status: counter.unit.status }],
      }
    }, this.game)
    this.map.clearAllSelections()
    this.game.executeAction(action, false)
  }

  finish() {
    const action = new GameAction({
      user: this.game.currentUser, player: this.game.currentPlayer,
      data: {
        action: "close_combat_finish", old_initiative: this.game.initiative,
        cc_data: { count: this.game.closeNeeded.length },
      }
    }, this.game)
    this.execute(action)
  }

  get resolved(): boolean {
    return this.game.closeNeeded.filter(cn => cn.state !== closeProgress.Done).length < 1
  }

  startIfNotStarted() {
    for (let i = this.game.lastActionIndex; i >= 0; i--) {
      const action = this.game.actions[i]
      if (action.type === "close_combat_start") { return }
      if (action.type === "phase") { break }
    }
    this.game.executeAction(new GameAction({
      user: this.game.currentUser, player: this.game.currentPlayer,
      data: { action: "close_combat_start", old_initiative: this.game.initiative }
    }, this.game), false)
    if (this.game.closeNeeded.length < 1) {
      this.game.executeAction(new GameAction({
        player: this.game.currentPlayer, user: this.game.currentUser, data: {
          action: "info", message: "no units in contact, skipping close combat",
          old_initiative: this.game.initiative,
        }
      }, this.game), false)
    }
  }
}
