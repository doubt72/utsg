import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { getAPI } from "../../utilities/network";
import { Game } from "../../engine/game";
import Header from "../Header";
import ChatDisplay from "../ChatDisplay";
import MoveDisplay from "./MoveDisplay";
import Gamecontrols from "./GameControls";

export default function GameDisplay() {
  const { id } = useParams()
  const [game, setGame] = useState({})

  useEffect(() => {
    getAPI(`/api/v1/games/${id}`, {
      ok: response => response.json().then(json => {
        const code = json.scenario
        getAPI(`/api/v1/scenarios/${code}`, {
          ok: response => response.json().then(scenario => {
            json.scenario = scenario
            const game = new Game(json)
            setGame(game)
            game.resetMoves()
          })
        })
      })
    })
  }, [])

  const moveNotification = (move) => {
    console.log("Thinking about doing a thing.")
    if (["create", "join"].includes(move.data.type)) {
      console.log("I'm doing a thing!")
      game.resetMoves()
    }
  }

  const showInput = () => {
    if (!localStorage.getItem("username")) { return false }
    return game.id === 0 ||
           localStorage.getItem("username") === game.playerOneName ||
           localStorage.getItem("username") === game.playerTwoName
  }

  return (
    <div className="main-page">
      <Header />
      <div className="game-control ml05em mr05em mt05em">
        <div className="red monospace mr05em">
          {game.scenario?.code}:
        </div>
        <div className="green nowrap">
          {game.scenario?.name} 
        </div>
        <div className="ml1em mr1em nowrap">
          (
            { game.turn > 0 ? <span>turn {game.turn}/{game.scenario?.turns}</span> : "initial setup" }
            { game.state === "needs_player" ? " - waiting for player to join" : "" }
            { game.state === "ready" ? " - waiting for game to start" : "" }
          )
        </div>
        <div className="flex-fill align-end">
          {game.name}
        </div>
      </div>
      <div className="standard-body">
        <div className="game-page-moves">
          <MoveDisplay gameId={Number(id)}
                       callback={moveNotification}
                       chatInput={showInput()} />
        </div>
        <div className="chat-section">
          <ChatDisplay gameId={Number(id)}
                       showInput={showInput()} />
        </div>
      </div>
      <Gamecontrols game={game} />
    </div>
  )
}
