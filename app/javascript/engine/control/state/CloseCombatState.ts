import { Coordinate, CounterSelectionTarget, hexOpenType, HexOpenType } from "../../../utilities/commonTypes";
import { rollCC } from "../../../utilities/utilities";
import Counter from "../../Counter";
import Game, { closeProgress } from "../../Game";
import GameAction, { GameActionUnit } from "../../GameAction";
import { checkPhase } from "../../support/gamePhase";
import { closeCombatCasualtyNeeded, closeCombatFirepower, maxCCCasualties } from "../closeCombat";
import BaseState, { stateType } from "./BaseState";

export default class CloseCombatState extends BaseState {
  constructor(game: Game) {
    super(game, stateType.CloseCombat, game.currentPlayer)

    if (game.closeNeeded.length < 1) { game.addCloseCombatChecks() }
    if (!game.anyCloseCombatLeft) { checkPhase(game, false) }
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
    const origin: GameActionUnit[] = []
    const target: GameActionUnit[] = []
    const loc = this.map.currentSelection[0].hex as Coordinate
    const counters = this.map.currentSelection
    counters.forEach(c => {
      if (this.samePlayer(c.unit)) {
        origin.push({ x: loc.x, y: loc.y, id: c.unit.id, status: c.unit.status })
      } else {
        target.push({ x: loc.x, y: loc.y, id: c.unit.id, status: c.unit.status })
      }
    })
    const fp1 = closeCombatFirepower(this.game, counters[0].hex as Coordinate, 1)
    const fp2 = closeCombatFirepower(this.game, counters[0].hex as Coordinate, 2)
    const max1 = maxCCCasualties(this.map, loc, this.game.playerOneNation)
    const max2 = maxCCCasualties(this.map, loc, this.game.playerTwoNation)
    const action = new GameAction({
      user: this.game.currentPlayer === this.player ? this.game.currentUser : this.game.opponentUser,
      player: this.player,
      data: {
        action: "close_combat_roll", old_initiative: this.game.initiative,
        dice_result: [{ result: rollCC(fp1) }, { result: rollCC(fp2) }],
        origin, target, cc_data: { p1_fp: fp1, p2_fp: fp2, p1_max: max1, p2_max: max2 },
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
}
