import { Coordinate } from "../../../utilities/commonTypes";
import { roll2d10 } from "../../../utilities/utilities";
import Counter from "../../Counter";
import Game, { ComplexCheck } from "../../Game";
import GameAction, { GameActionMoraleData } from "../../GameAction";
import { moraleModifiers } from "../fire";
import BaseState, { stateType } from "./BaseState";

export default class MoraleCheckState extends BaseState {
  moraleCheck: GameActionMoraleData;

  constructor(game: Game) {
    super(game, stateType.MoraleCheck, game.currentPlayer)
    const check = game.moraleChecksNeeded[0] as ComplexCheck
    const modifiers = moraleModifiers(game, check.unit, check.from, check.to, !!check.incendiary)
    this.player = check.unit.playerNation === game.currentPlayerNation ?
      game.currentPlayer : game.opponentPlayer
    const counter = game.findCounterById(check.unit.id) as Counter
    this.selection = [{ x: check.to.x, y: check.to.y, id: check.unit.id, counter }]
    this.moraleCheck = {
      mod: modifiers.mod, why: modifiers.why,
      short: check.to.x !== counter.hex?.x || check.to.y !== counter.hex?.y,
    }
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
        action: "morale_check", old_initiative: this.game.initiative,
        dice_result: [{ result: roll2d10(), type: "2d10" }], morale_data: this.moraleCheck,
        target: [{ x: sel.x, y: sel.y, id: sel.id, status: sel.counter.unit.status }],
      },
    }, this.game)
    this.execute(action)
  }
}
