import { Player } from "../../utilities/commonTypes";
import Game, { GamePhase, gamePhaseType } from "../Game";
import { GameMoveData } from "../GameMove";
import BaseMove from "./BaseMove";

export default class PhaseMove extends BaseMove {
  oldPhase: GamePhase;
  newPhase: GamePhase;
  oldTurn: number;
  newTurn: number;
  newPlayer: Player;

  constructor(data: GameMoveData, game: Game, index: number) {
    super(data, game, index)

    this.validate(data.data.phase)
    this.validate(data.data.turn)
    this.validate(data.data.player)

    this.oldPhase = (data.data.phase ?? [gamePhaseType.Deployment])[0]
    this.newPhase = (data.data.phase ?? [0, gamePhaseType.Deployment])[1]
    this.oldTurn = (data.data.turn as [number, number])[0]
    this.newTurn = (data.data.turn as [number, number])[1]
    this.newPlayer = data.data.player as Player
  }

  get stringValue(): string {
    const undoMsg = this.undone ? " [cancelled]" : ""
    if (this.newPhase === gamePhaseType.Deployment) { return this.deploymentMessage + undoMsg }
    if (this.newPhase === gamePhaseType.Prep) { return this.prepMessage + undoMsg }
    if (this.newPhase === gamePhaseType.Main) { return this.mainMessage + undoMsg }
    if (this.newPhase === gamePhaseType.Cleanup) { return this.cleanupMessage + undoMsg }
    return `problem parsing data ${this.data}`
  }

  get deploymentMessage(): string {
    let first = this.game.scenario.firstMove
    let last = this.newTurn === 1 ? "setup finished" : "cleanup finished"
    if (this.newTurn === 0) {
      first = this.game.scenario.firstSetup as Player
      last = "game started"
    }
    if (first === 1) {
      if (this.newPlayer === 1) {
        return last + ", begin Allied deployment"
      } else {
        return "Allied deployment done, begin Axis deployment"
      }
    } else {
      if (this.newPlayer === 1) {
        return "Axis deployment done, begin Allied deployment"
      } else {
        return last + ", begin Axis deployment"
      }
    }
  }

  get prepMessage(): string {
    const first = this.game.scenario.firstMove
    if (first === 1) {
      if (this.newPlayer === 1) {
        return "deployment done, begin Allied rally phase"
      } else {
        return "Allied rally phase done, begin Axis rally phase"
      }
    } else {
      if (this.newPlayer === 1) {
        return "Axis rally phase done, begin Allied rally phase"
      } else {
        return "deployment done, begin Axis rally phase"
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
    return this.game.previousMoveUndoPossible(this.index)
  }

  mutateGame(): void {
    this.game.phase = this.newPhase
    this.game.turn = this.newTurn
    this.game.currentPlayer = this.newPlayer
  }
  
  undo(): void {
    this.game.phase = this.oldPhase
    this.game.turn = this.oldTurn
    this.game.currentPlayer = this.player
    this.undone = true;
  }

  get lastUndoCascade(): boolean { return true }
}
