import { Player } from "../../utilities/commonTypes";
import Game from "../Game";
import { GameActionData } from "../GameAction";
import { GamePhase, gamePhaseType } from "../support/gamePhase";
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
    if (this.newPhase === gamePhaseType.PrepRally) { return this.prepRallyMessage + undoMsg }
    if (this.newPhase === gamePhaseType.PrepPrecip) { return this.prepPrecipMessage + undoMsg }
    if (this.newPhase === gamePhaseType.Main) { return this.mainMessage + undoMsg }
    if (this.newPhase === gamePhaseType.CleanupCloseCombat) { return this.cleanupCloseCombatMessage + undoMsg }
    if (this.newPhase === gamePhaseType.CleanupOverstack) { return this.cleanupOverstackMessage + undoMsg }
    if (this.newPhase === gamePhaseType.CleanupStatus) { return this.cleanupStatusMessage + undoMsg }
    if (this.newPhase === gamePhaseType.CleanupSmoke) { return this.cleanupSmokeMessage + undoMsg }
    if (this.newPhase === gamePhaseType.CleanupFire) { return this.cleanupFireMessage + undoMsg }
    if (this.newPhase === gamePhaseType.CleanupWeather) { return this.cleanupWeatherMessage + undoMsg }
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

  get prepRallyMessage(): string {
    const first = this.game.scenario.firstAction
    if (first === 1) {
      if (this.newPlayer === 1) {
        return `deployment done, begin prep phase, ${this.alliedName} rally`
      } else {
        return `${this.alliedName} rally done, begin ${this.axisName} rally`
      }
    } else {
      if (this.newPlayer === 1) {
        return `${this.axisName} rally done, begin ${this.alliedName} rally`
      } else {
        return `deployment done, begin prep phase, ${this.axisName} rally`
      }
    }
  }

  get prepPrecipMessage(): string {
    return "rally done, checking precipitation"
  }

  get mainMessage(): string {
    return "done checking precipitation, begin main phase"
  }

  get cleanupCloseCombatMessage(): string {
    return "main phase done, begin cleanup phase, checking for close combat"
  }

  get cleanupOverstackMessage(): string {
    return "close combat done, begin housekeeping, checking for overstacking"
  }

  get cleanupStatusMessage(): string {
    return "done checking for overstacking, updating unit status"
  }

  get cleanupSmokeMessage(): string {
    return "done updating unit status, checking smoke"
  }

  get cleanupFireMessage(): string {
    return "done checking smoke, checking blazes"
  }

  get cleanupWeatherMessage(): string {
    return "done checking blazes, checking for variable weather"
  }

  get undoPossible() {
    // return this.game.previousActionUndoPossible(this.index)
    return false
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
  }

  get lastUndoCascade(): boolean { return true }
}
