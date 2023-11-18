import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { getAPI } from "../../utilities/network";
import { Game } from "../../engine/game";
import Header from "../Header";
import ChatDisplay from "../ChatDisplay";
import MoveDisplay from "./MoveDisplay";
import GameControls from "./GameControls";
import GameMap from "./GameMap";

export default function GameDisplay() {
  const { id } = useParams()
  const [game, setGame] = useState({ k: {}, turn: 0, state: "" })
  const [map, setMap] = useState(null)
  const [controls, setControls] = useState(null)

  useEffect(() => {
    getAPI(`/api/v1/games/${id}`, {
      ok: response => response.json().then(json => {
        const code = json.scenario
        getAPI(`/api/v1/scenarios/${code}`, {
          ok: response => response.json().then(scenario => {
            json.scenario = scenario
            const g = new Game(json, gameNotification)
            setGame({k: g, turn: g.turn, state: g.state})
            setControls(<GameControls game={g} />)
            setMap(g.scenario.map)
          })
        })
      })
    })
  }, [])

  const moveNotification = () => {
    game.k.loadNewMoves()
  }

  const gameNotification = (g) => {
    setGame({
      k: g,
      turn: g.turn,
      state: g.state,
    })
    setControls(<GameControls key={Number(new Date)} game={g} />) // key hack to force updates
  }

  const showInput = () => {
    if (!localStorage.getItem("username")) { return false }
    return game.k.id === 0 ||
           localStorage.getItem("username") === game.k.playerOneName ||
           localStorage.getItem("username") === game.k.playerTwoName
  }

  return (
    <div className="main-page">
      <Header />
      <div className="game-control ml05em mr05em mt05em">
        <div className="red monospace mr05em">
          {game.k.scenario?.code}:
        </div>
        <div className="green nowrap">
          {game.k.scenario?.name} 
        </div>
        <div className="ml1em mr1em nowrap">
          (
            { game.turn > 0 ? <span>turn {game.turn}/{game.k.scenario?.turns}</span> : "initial setup" }
            { game.state === "needs_player" ? " - waiting for player to join" : "" }
            { game.state === "ready" ? " - waiting for game to start" : "" }
          )
        </div>
        <div className="flex-fill align-end">
          {game.k.name}
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
      {controls}
      <div className="mt05em mb05em ml05em mr05em">
        <GameMap map={map} scale={1} showCoords={true} showStatusCounters={true}
                hideCounters={false} />
      </div>
    </div>
  )
}
