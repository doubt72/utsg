import { CounterSelectionTarget } from "../../../utilities/commonTypes";
import Game from "../../Game";
import GameAction from "../../GameAction";
import select, { selectable } from "../select";
import BaseState, { stateType } from "./BaseState";

export default class FinishDeployState extends BaseState {
  constructor(game: Game) {
    super(game, stateType.FinishDeploy, game.currentPlayer)
    game.refreshCallback(game)
  }

  get actionInProgress(): boolean {
    return false
  }

  get showOverlays(): boolean {
    return false
  }

  select(selection: CounterSelectionTarget, callback: () => void) {
    return select(this.map, selection, callback, false)
  }

  selectable(selection: CounterSelectionTarget): boolean {
    return selectable(this.map, selection, false)
  }

  finish() {
    const action = new GameAction({
      user: this.game.currentUser,
      player: this.player,
      data: {
        action: "finish_deploy", old_initiative: this.game.initiative,
      }
    }, this.game)
    this.game.executeAction(action, false)
  }
}
