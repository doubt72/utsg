import { Player } from "../../utilities/commonTypes";
import Game, { GamePhase, gamePhaseType } from "../Game";
import { GameActionData } from "../GameAction";
import organizeStacks from "../support/organizeStacks";
import BaseAction from "./BaseAction";

export default class PhaseAction extends BaseAction {
  oldPhase: GamePhase;
  newPhase: GamePhase;
  oldTurn: number;
  newTurn: number;
  newPlayer: Player;

  constructor(data: GameActionData, game: Game, index: number) {
    super(data, game, index)

    this.validate(data.data.phase_data?.old_phase)
    this.validate(data.data.phase_data?.new_phase)
    this.validate(data.data.phase_data?.old_turn)
    this.validate(data.data.phase_data?.new_turn)
    this.validate(data.data.phase_data?.new_player)

    // Validate will already error out if data is missing, but the linter can't tell
    this.oldPhase = data.data.phase_data?.old_phase as GamePhase
    this.newPhase = data.data.phase_data?.new_phase as GamePhase
    this.oldTurn = data.data.phase_data?.old_turn as number
    this.newTurn = data.data.phase_data?.new_turn as number
    this.newPlayer = data.data.phase_data?.new_player as Player
  }

  get type(): string { return "phase" }

  get stringValue(): string {
    const undoMsg = this.undone ? " [cancelled]" : ""
    if (this.newPhase === gamePhaseType.Deployment) { return this.deploymentMessage + undoMsg }
    if (this.newPhase === gamePhaseType.Prep) { return this.prepMessage + undoMsg }
    if (this.newPhase === gamePhaseType.Main) { return this.mainMessage + undoMsg }
    if (this.newPhase === gamePhaseType.Cleanup) { return this.cleanupMessage + undoMsg }
    return `problem parsing data ${this.data}`
  }

  get alliedName(): string {
    return this.game.alliedName
  }

  get axisName(): string {
    return this.game.axisName
  }

  get deploymentMessage(): string {
    let first = this.game.scenario.firstAction
    let last = this.newTurn === 1 ? "setup finished" : "cleanup finished"
    if (this.newTurn === 0) {
      first = this.game.scenario.firstDeploy as Player
      last = "game started"
    }
    if (first === 1) {
      if (this.newPlayer === 1) {
        return last + `, begin ${this.alliedName} deployment`
      } else {
        return `${this.alliedName} deployment done, begin ${this.axisName} deployment`
      }
    } else {
      if (this.newPlayer === 1) {
        return `${this.axisName} deployment done, begin ${this.alliedName} deployment`
      } else {
        return last + `, begin ${this.axisName} deployment`
      }
    }
  }

  get prepMessage(): string {
    const first = this.game.scenario.firstAction
    if (first === 1) {
      if (this.newPlayer === 1) {
        return `deployment done, begin ${this.alliedName} rally phase`
      } else {
        return `${this.alliedName} rally phase done, begin ${this.axisName} rally phase`
      }
    } else {
      if (this.newPlayer === 1) {
        return `${this.axisName} rally phase done, begin ${this.alliedName} rally phase`
      } else {
        return `deployment done, begin ${this.axisName} rally phase`
      }
    }
  }

  get mainMessage(): string {
    return "rally phase done, begin main phase"
  }

  get cleanupMessage(): string {
    return "main phase done, begin cleanup phase"
  }

  get undoPossible() {
    return this.game.previousActionUndoPossible(this.index)
  }

  mutateGame(): void {
    this.game.phase = this.newPhase
    this.game.setTurn(this.newTurn)
    this.game.setCurrentPlayer(this.newPlayer)
    organizeStacks(this.game.scenario.map)
  }
  
  undo(): void {
    this.game.phase = this.oldPhase
    this.game.setTurn(this.oldTurn)
    this.game.setCurrentPlayer(this.player)
    this.undone = true;
  }

  get lastUndoCascade(): boolean { return true }
}
