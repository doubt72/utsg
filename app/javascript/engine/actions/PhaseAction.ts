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
    const first = this.game.currentInitiativePlayer
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
    return this.game.previousActionUndoPossible(this.index)
  }

  mutateGame(): void {
    this.game.phase = this.newPhase
    this.game.setTurn(this.newTurn)
    this.game.setCurrentPlayer(this.newPlayer)
    this.phaseNotification()
    organizeStacks(this.game.scenario.map)
  }
  
  undo(): void {
    this.game.phase = this.oldPhase
    this.game.setTurn(this.oldTurn)
    this.game.setCurrentPlayer(this.player)
  }

  get lastUndoCascade(): boolean { return true }

  phaseNotification() {
    if (this.newPhase === gamePhaseType.Deployment || this.newPhase === gamePhaseType.PrepRally) {
      const selectMessage = this.newPhase === gamePhaseType.Deployment ?
        "Select units to deploy in the units panel and click on the map to deploy them." :
        "Select unit on map to attempt to rally/fix."
      const oppMessage = `Opponent is ${
        this.newPhase === gamePhaseType.Deployment ? "deploying" : "rallying"
      } their units.`
      const action = this.newPhase === gamePhaseType.Deployment ? "deployment" : "rally"
      if (this.game.playerOneName === this.game.playerTwoName) {
        this.game.playerOneNotification = [
          `Begin ${ this.newPlayer === 1 ? this.game.alliedName : this.game.axisName } ${action}`,
          selectMessage,
        ]
      } else if (this.newPlayer === 1) {
        const title = `Begin ${this.game.alliedName} ${action}`
        this.game.playerOneNotification = [title, selectMessage]
        this.game.playerTwoNotification = [title, oppMessage]
      } else {
        const title = `Begin ${this.game.axisName} ${action}`
        this.game.playerOneNotification = [title, oppMessage]
        this.game.playerTwoNotification = [title, selectMessage]
      }
    } else if (this.newPhase === gamePhaseType.CleanupOverstack) {
      const selectMessage = "Units are overstacked, select units to remove to comply with stacking limits."
      const oppMessage = "Opponent is removing overstacked units."
      if (this.game.playerOneName === this.game.playerTwoName) {
        this.game.playerOneNotification = [
          `${ this.newPlayer === 1 ? this.game.alliedName : this.game.axisName } are overstacked`,
          selectMessage,
        ]
      } else if (this.newPlayer === 1) {
        const title = `${this.game.alliedName} are overstacked`
        this.game.playerOneNotification = [title, selectMessage]
        this.game.playerTwoNotification = [title, oppMessage]
      } else {
        const title = `${this.game.axisName} are overstacked`
        this.game.playerOneNotification = [title, oppMessage]
        this.game.playerTwoNotification = [title, selectMessage]
      }
    } else if (this.newPhase === gamePhaseType.Main) {
      const title = `Turn ${this.newTurn}: main phase`
      const message = `Main phase has begun, the ${this.game.currentInitiativeNationName} player has initiative ` +
        "and gets to take the first action."
      this.game.playerOneNotification = [title, message]
      if (this.game.playerOneName !== this.game.playerTwoName) {
        this.game.playerTwoNotification = [title, message]
      }
    } else if (this.newPhase === gamePhaseType.CleanupCloseCombat) {
      const title = `Turn ${this.newTurn}: close combat`
      const message = `Resolving close combat, the ${this.game.currentInitiativeNationName} player has initiative ` +
        "and chooses order of battles."
      this.game.playerOneNotification = [title, message]
      if (this.game.playerOneName !== this.game.playerTwoName) {
        this.game.playerTwoNotification = [title, message]
      }
    } else if (this.newPhase === gamePhaseType.PrepPrecip) {
      const title = `Turn ${this.newTurn}: preciptitation`
      const message = `Checking precipitation, the ${this.game.currentInitiativeNationName} player has initiative ` +
        "and handles rolls."
      this.game.playerOneNotification = [title, message]
      if (this.game.playerOneName !== this.game.playerTwoName) {
        this.game.playerTwoNotification = [title, message]
      }
    } else if (this.newPhase === gamePhaseType.CleanupSmoke) {
      const title = `Turn ${this.newTurn}: smoke check`
      const message = `Checking for smoke dispersion, the ${this.game.currentInitiativeNationName} ` +
        "player has initiative and handles rolls."
      this.game.playerOneNotification = [title, message]
      if (this.game.playerOneName !== this.game.playerTwoName) {
        this.game.playerTwoNotification = [title, message]
      }
    } else if (this.newPhase === gamePhaseType.CleanupFire) {
      const title = `Turn ${this.newTurn}: fire check`
      const message = "Checking for blazes extinguishing or spreading, " +
        `the ${this.game.currentInitiativeNationName} player has initiative and handles rolls.`
      this.game.playerOneNotification = [title, message]
      if (this.game.playerOneName !== this.game.playerTwoName) {
        this.game.playerTwoNotification = [title, message]
      }
    } else if (this.newPhase === gamePhaseType.CleanupWeather) {
      const title = `Turn ${this.newTurn}: variable weather`
      const message = `Checking variable weather, the ${this.game.currentInitiativeNationName} ` +
        "player has initiative and handles rolls."
      this.game.playerOneNotification = [title, message]
      if (this.game.playerOneName !== this.game.playerTwoName) {
        this.game.playerTwoNotification = [title, message]
      }
    } else {
      this.game.playerOneNotification = undefined
      this.game.playerTwoNotification = undefined
    }
  }
}
