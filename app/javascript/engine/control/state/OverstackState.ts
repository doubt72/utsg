import { Coordinate, CounterSelectionTarget, hexOpenType, HexOpenType } from "../../../utilities/commonTypes";
import Counter from "../../Counter";
import Game from "../../Game";
import GameAction, { GameActionUnit } from "../../GameAction";
import BaseState, { stateType } from "./BaseState";

export default class OverstackState extends BaseState {
  constructor(game: Game) {
    super(game, stateType.Overstack, game.currentPlayer)
    game.refreshCallback(game)
  }

  openHex(x: number, y: number): HexOpenType {
    return this.game.scenario.map.overstackAt(x, y, this.game.currentPlayer) ? hexOpenType.Open : hexOpenType.Closed
  }

  select(selection: CounterSelectionTarget, callback: () => void): void {
    if (selection.target.type === "reinforcement") { return }
    const x = selection.target.xy.x
    const y = selection.target.xy.y
    const id = selection.counter.target.id
    const counter = this.map.unitAtId(new Coordinate(x, y), id) as Counter
    if (!counter.unit.isFeature && this.samePlayer(counter.unit)) {
      if (this.openHex(x, y) === hexOpenType.Open) {
        counter.unit.select()
        this.map.clearOtherTargetSelections(x, y, counter.unit.id)
      }
    }
    callback()
  }

  selectable(selection: CounterSelectionTarget): boolean {
    if (selection.target.type === "reinforcement") { return false }
    if (selection.counter.unit.playerNation !== this.game.currentPlayerNation) { return false }
    const loc = selection.target.xy
    return this.openHex(loc.x, loc.y) === hexOpenType.Open
  }

  get actionInProgress(): boolean {
    return false
  }

  get activeCounters(): Counter[] {
    let rc: Counter[] = []
    const map = this.game.scenario.map
    for (let x = 0; x < map.width; x++) {
      for (let y = 0; y < map.height; y++) {
        if (map.overstackAt(x, y, this.game.currentPlayer)) {
          rc = rc.concat(map.countersAt(new Coordinate(x, y)))
        }
      }
    }
    return rc
  }

  finish() {
    const counter = this.map.currentSelection[0]
    const hex = counter.hex as Coordinate
    const target: GameActionUnit = {
      x: hex.x, y: hex.y, id: counter.unit.id, name: counter.unit.name, status: counter.unit.status,
      parent: counter.unit.parent?.id, children: counter.children.map(c => {
        return c.unit.id
      })
    }
    const action = new GameAction({
      user: this.game.currentUser, player: this.player,
      data: {
        action: "overstack_reduce", target: [target], old_initiative: this.game.initiative,
      }
    }, this.game)
    this.execute(action)
  }
}
