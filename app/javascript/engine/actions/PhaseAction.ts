import { Player } from "../../utilities/commonTypes";
import { actionOrange } from "../../utilities/graphics";
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
  messages: string[];

  constructor(data: GameActionData, game: Game, index: number) {
    super(data, game, index)

    this.validate(data.data.phase_data?.old_phase)
    this.validate(data.data.phase_data?.new_phase)
    this.validate(data.data.phase_data?.old_turn)
    this.validate(data.data.phase_data?.new_turn)
    this.validate(data.data.phase_data?.new_player)
    this.validate(data.data.phase_data?.messages)

    // Validate will already error out if data is missing, but the linter can't tell
    this.oldPhase = data.data.phase_data?.old_phase as GamePhase
    this.newPhase = data.data.phase_data?.new_phase as GamePhase
    this.oldTurn = data.data.phase_data?.old_turn as number
    this.newTurn = data.data.phase_data?.new_turn as number
    this.newPlayer = data.data.phase_data?.new_player as Player
    this.messages = data.data.phase_data?.messages as string[]
  }

  get type(): string { return "phase" }

  get htmlValue(): string {
    return this.messages.join(` <span style="color: ${actionOrange()};">></span> `)
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
    this.game.clearGameState()
    this.game.openOverlay = undefined
  }
  
  undo(): void {
    this.game.phase = this.oldPhase
    this.game.setTurn(this.oldTurn)
    this.game.setCurrentPlayer(this.player)
  }

  get lastUndoCascade(): boolean { return true }

  phaseNotification() {
    const map = this.game.scenario.map
    if (this.newPhase === gamePhaseType.Deploy || this.newPhase === gamePhaseType.PrepRally) {
      const selectMessage = this.newPhase === gamePhaseType.Deploy ?
        "Select units to deploy in the units panel and click on the map to deploy them." :
        "Select unit on map to attempt to rally/fix."
      const oppMessage = `Opponent is ${
        this.newPhase === gamePhaseType.Deploy ? "deploying" : "rallying"
      } their units.`
      const action = this.newPhase === gamePhaseType.Deploy ? "deployment" : "rally"
      const count = this.game.reinforcementsCount(this.newTurn, this.newPlayer)[0]
      const check1 = this.newPhase === gamePhaseType.Deploy ? count > 0 : map.anyUnitsCanRally(1)
      const check2 = this.newPhase === gamePhaseType.Deploy ? count > 0 : map.anyUnitsCanRally(2)
      if (this.game.playerOneName === this.game.playerTwoName && (check1 || check2)) {
        this.game.playerOneNotification = [
          `Begin ${ this.newPlayer === 1 ? this.game.alliedName : this.game.axisName } ${action}`,
          selectMessage,
        ]
      } else if (this.newPlayer === 1 && check1) {
        const title = `Begin ${this.game.alliedName} ${action}`
        this.game.playerOneNotification = [title, selectMessage]
        this.game.playerTwoNotification = [title, oppMessage]
      } else if (check2) {
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
