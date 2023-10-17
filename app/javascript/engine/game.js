import { getAPI } from "../utilities/network"
import { GameMove } from "./gameMove"
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

    this.resetMoves()
  }

  resetMoves() {
    this.moves = []
    getAPI(`/api/v1/game_moves?game_id=${this.id}`, {
      ok: response => response.json().then(json => {
        for (const move of json) {
          // TODO someday need to actually process the moves
          this.moves.push(new GameMove(move))
        }
      })
    })
  }
}

export { Game }
