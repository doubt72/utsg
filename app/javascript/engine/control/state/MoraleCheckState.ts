import { Coordinate, hexOpenType, HexOpenType } from "../../../utilities/commonTypes";
import { roll2d10 } from "../../../utilities/utilities";
import Counter from "../../Counter";
import Game, { ComplexCheck } from "../../Game";
import GameAction, { GameActionMoraleData, GameActionUnit } from "../../GameAction";
import { moraleModifiers } from "../fire";
import { placeReactionMoraleCheckGhosts } from "../reactionFire";
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
    this.selection = [{ x: check.to.x, y: check.to.y, id: check.unit.id, name: check.unit.name, counter }]
    this.moraleCheck = {
      mod: modifiers.mod, why: modifiers.why,
      short: check.to.x !== counter.hex?.x || check.to.y !== counter.hex?.y,
    }
    if (!check.unit.selected) { check.unit.select() }

    placeReactionMoraleCheckGhosts(game, check.to)

    game.openOverlay = game.scenario.map.hexAt(check.to)
    game.refreshCallback(game)
  }

  openHex(x: number, y: number): HexOpenType {
    const first = this.selection[0]
    return x === first.x && y === first.y ? hexOpenType.Open : hexOpenType.Closed
  }

  get activeCounters(): Counter[] {
    const first = this.selection[0]
    return this.game.scenario.map.countersAt(new Coordinate(first.x, first.y))
  }

  finish() {
    const sel = this.selection[0]
    const target: GameActionUnit = { x: sel.x, y: sel.y, id: sel.id, name: sel.name, status: sel.counter.unit.status }
    const action = new GameAction({
      user: this.game.currentPlayer === this.player ? this.game.currentUser : this.game.opponentUser,
      player: this.player,
      data: {
        action: "morale_check", old_initiative: this.game.initiative,
        dice_result: [{ result: roll2d10() }], morale_data: this.moraleCheck,
        target: [target],
      },
    }, this.game)
    this.execute(action)
  }
}
