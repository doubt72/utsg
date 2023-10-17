import { Scenario } from "./scenario"

const Game = class {
  constructor(data) {
    this.id = data.id
    this.name = data.name
    this.scenario = new Scenario(data.scenario)
    this.state = data.state // TODO: make enum?
    this.ownerName = data.owner
    this.playerOneName = data.player_one
    this.playerTwoName = data.player_two
    this.currentPlayerName = data.current_player
    this.winner = data.winner

    this.turn = data.metadata.turn

  }
}

export { Game }
