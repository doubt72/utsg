import { Coordinate, CounterSelectionTarget, hexOpenType, HexOpenType, unitType } from "../../../utilities/commonTypes";
import Counter from "../../Counter";
import Game from "../../Game";
import GameAction, { GameActionUnit } from "../../GameAction";
import BaseState, { stateType } from "./BaseState";

export default class SquadJoinState extends BaseState {

  constructor(game: Game) {
    super(game, stateType.SquadJoin, game.currentPlayer)
  
    const selection = this.map.selection as Counter
    const loc = selection.hex as Coordinate
    this.selection = [{
      x: loc.x, y: loc.y, id: selection.unit.id, name: selection.unit.name, counter: selection,
    }]
    this.map.clearAllSelections()
    this.map.loaderSelect(selection.unit)

    game.refreshCallback(game)
  }

  openHex(x: number, y: number): HexOpenType {
    if (x === this.selection[0].x && y === this.selection[0].y) { return hexOpenType.Open }
    return hexOpenType.Closed
  }

  select(selection: CounterSelectionTarget, callback: () => void): void {
    this.map.select(selection.counter.unit)
    callback()
  }

  selectable(selection: CounterSelectionTarget): boolean {
    if (selection.target.type === "reinforcement") { return false }
    const target = selection.counter.unit
    const source = this.selection[0].counter.unit
    if (target.id === source.id) { return false }
    if (target.playerNation !== source.playerNation) {return false}
    if (target.type !== unitType.Team) {
      this.game.addMessage("can only join teams")
      return false
    }
    if (target.isBroken) {
      this.game.addMessage("broken teams cannot combine")
      return false
    }
    if (target.pinned) {
      this.game.addMessage("pinned teams cannot combine")
      return false
    }
    if (target.name !== source.name) {
      this.game.addMessage("teams are not of the same type")
      return false
    }
    if (target.children.length > 0 && source.children.length > 0) {
      this.game.addMessage("can't join teams that are both carrying and/or crewing weapons")
      return false
    }
    return true
  }

  get activeCounters(): Counter[] {
    const sel = this.selection[0]
    const loc = new Coordinate(sel.x, sel.y)
    return this.map.countersAt(loc)
  }

  finish(): void {
    const one = this.selection[0]
    const two = this.map.selection as Counter
    const loc = two.hex as Coordinate
    const target1 = { x: loc.x, y: loc.y, id: one.id, name: one.name, status: one.counter.unit.status }
    const target2: GameActionUnit = {
      x: loc.x, y: loc.y, id: two.unit.id, name: two.unit.name,
      children: two.unit.children.length > 0 ? two.unit.children.map(c => c.id) : undefined,
      status: two.unit.status,
    }
    this.game.executeAction(new GameAction({
      user: this.game.currentUser, player: this.game.currentPlayer,
      data: {
        action: "squad_join", old_initiative: this.game.initiative, target: [target1, target2],
      }
    }, this.game), false)
    this.map.clearAllSelections()
  }
}
