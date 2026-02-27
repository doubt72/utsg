import { Coordinate } from "../../../utilities/commonTypes";
import { roll2d10 } from "../../../utilities/utilities";
import Counter from "../../Counter";
import Game, { SimpleUnitCheck } from "../../Game";
import GameAction, { GameActionRoutData } from "../../GameAction";
import { moraleModifiers } from "../fire";
import BaseState, { stateType } from "./BaseState";

export default class RoutCheckState extends BaseState {
  routCheck: GameActionRoutData;

  constructor(game: Game) {
    super(game, stateType.RoutCheck, game.opponentPlayer)
    const check = game.routCheckNeeded[0] as SimpleUnitCheck
    const modifiers = moraleModifiers(game, check.unit, [check.loc], check.loc, false)
    const counter = game.findCounterById(check.unit.id) as Counter
    this.selection = [{ x: check.loc.x, y: check.loc.y, id: check.unit.id, counter }]
    this.routCheck = { mod: modifiers.mod, why: modifiers.why }
    check.unit.select()
    game.refreshCallback(game)
  }

  get activeCounters(): Counter[] {
    const first = this.selection[0]
    return this.game.scenario.map.countersAt(new Coordinate(first.x, first.y))
  }

  finish() {
    const sel = this.selection[0]
    const action = new GameAction({
      user: this.game.currentPlayer === this.player ? this.game.currentUser : this.game.opponentUser,
      player: this.player,
      data: {
        action: "rout_check", old_initiative: this.game.initiative,
        dice_result: [{ result: roll2d10(), type: "2d10" }],
        rout_check_data: this.routCheck,
        target: [{ x: sel.x, y: sel.y, id: sel.id, status: sel.counter.unit.status }],
      },
    }, this.game)
    this.execute(action)
  }
}
