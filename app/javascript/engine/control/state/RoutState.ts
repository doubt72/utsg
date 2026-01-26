import { Coordinate, hexOpenType } from "../../../utilities/commonTypes";
import Counter from "../../Counter";
import Game from "../../Game";
import GameAction, { GameActionAddAction, gameActionAddActionType } from "../../GameAction";
import { findRoutPathTree, routEnds, routPaths } from "../rout";
import BaseState, { stateType } from "./BaseState";

export type RoutPathTree = {
  x: number, y: number, children: RoutPathTree[],
}

export default class RoutState extends BaseState {
  optional: boolean;
  routPathTree: RoutPathTree | false;

  constructor(game: Game, optional: boolean) {
    const unit = game.routNeeded[0].unit
    const counter = game.scenario.map.findCounterById(unit.id) as Counter
    const player = unit.playerNation === game.currentPlayerNation ? game.currentPlayer : game.opponentPlayer
    super(game, stateType.Rout, player)
    const hex = game.routNeeded[0].loc
    this.selection = [{ x: hex.x, y: hex.y, id: unit.id, counter }]
    this.routPathTree = findRoutPathTree(game, hex, unit.currentMovement, player, unit)
    this.optional = optional
  }

  openHex(x: number, y: number) {
    if (!this.routPathTree) { return hexOpenType.Closed }
    const hexes = routEnds(this.routPathTree)
    for (const h of hexes) {
      if (h.x === x && h.y === y) { return hexOpenType.Open }
    }
    return hexOpenType.Closed
  }

  get activeCounters(): Counter[] {
    const first = this.selection[0]
    return this.game.scenario.map.countersAt(new Coordinate(first.x, first.y))
  }

  finishXY(x?: number, y?: number) {
    let path: Coordinate[] = []
    if (x !== undefined && y !== undefined) {
      if (!this.routPathTree) { return }
      const paths = routPaths(this.routPathTree)
      for (const p of paths) {
        const last = p[p.length - 1]
        if (last.x === x && last.y === y) {
          path = p
          break
        }
      }
    } else if (this.routPathTree) { return }
    const addAction: GameActionAddAction[] = []
    const counter = this.selection[0].counter
    if (counter.unit.children.length > 0) {
      const hex = counter.hex as Coordinate
      const child = counter.unit.children[0]
      const facing = child.rotates ? child.facing : undefined
      addAction.push({
        type: gameActionAddActionType.Drop, x: hex.x, y: hex.y, id: child.id, index: 0, facing
      })
    }
    const action = new GameAction({
      user: this.game.currentUser,
      player: this.player,
      data: {
        action: this.optional ? "rout_self" : "rout_move",
        old_initiative: this.game.initiative,
        path: path.map(c => { return { x: c.x, y: c.y } }),
        target: this.selection.map(s => {
          return {
            x: s.x, y: s.y, id: s.counter.unit.id, status: s.counter.unit.status
          }
        }),
        add_action: addAction,
      },
    }, this.game)
    this.execute(action)
  }
}
