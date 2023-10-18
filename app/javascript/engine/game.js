import { getAPI } from "../utilities/network"
import { GameMove } from "./gameMove"
import { Scenario } from "./scenario"

const Game = class {
  constructor(data, refreshCallback) {
    // Immutable state only
    this.id = data.id
    this.name = data.name
    this.scenario = new Scenario(data.scenario)
    this.ownerName = data.owner
    this.refreshCallback = refreshCallback

    this.loadCurrentState(data)
    this.loadAllMoves()
  }

  loadCurrentState(data) {
    // The mutable parts of the game state for when handling moves:
    this.state = data.state // TODO: make enum?
    this.playerOneName = data.player_one
    this.playerTwoName = data.player_two
    this.currentPlayerName = data.current_player
    this.winner = data.winner
    this.turn = data.metadata.turn
  }

  loadAllMoves() {
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

  loadNewMoves() {
    const limit = this.moves[this.moves.length - 1].id
    console.log(limit)
    getAPI(`/api/v1/game_moves?game_id=${this.id}&after_id=${limit}`, {
      ok: response => response.json().then(json => {
        for (const move of json) {
          // TODO someday need to actually process the moves
          // read only!  Game state should only change/be saved when creating moves
          console.log(`adding move ${move.data.action}`)
          this.moves.push(new GameMove(move))
        }
        // Moves can change game state
        getAPI(`/api/v1/games/${this.id}`, {
          ok: response => response.json().then(json => {
            console.log(`updating game state ${json.state}`)
            this.loadCurrentState(json)
            this.refreshCallback(this)
          })
        })
      })
    })
  }

  actionsAvailable(currentPlayer) {
    if (this.state === "needs_player") {
      if (this.ownerName === currentPlayer || !currentPlayer) {
        return [{ type: "none", message: "waiting for player to join" }]
      } else {
        return [{ type: "join" }]
      }
    } else if (this.state === "ready") {
      if (this.ownerName === currentPlayer) {
        return [{ type: "start" }]
      } else {
        return [{ type: "none", message: "waiting for game to start" }]
      }
    } else {
      return [{ type: "none", message: "not implemented yet" }]
    }
  }
}

export { Game }