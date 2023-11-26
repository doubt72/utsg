import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { getAPI } from "../../utilities/network";
import { Game } from "../../engine/game";
import Header from "../Header";
import ChatDisplay from "../ChatDisplay";
import MoveDisplay from "./MoveDisplay";
import GameControls from "./Controls/GameControls";
import GameMap from "./map/GameMap";

export default function GameDisplay() {
  const { id } = useParams()

  const [game, setGame] = useState({ k: {}, turn: 0, state: "" })
  const [map, setMap] = useState(null)
  const [controls, setControls] = useState(null)

  const [scale, setScale] = useState(1)
  const [coords, setCoords] = useState(true)
  const [showStatusCounters, setShowStatusCounters] = useState(false)
  const [hideCounters, setHideCounters] = useState(false)
  const [showTerrain, setShowTerrain] = useState(false)
  const [showLos, setShowLos] = useState(false)

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

  const hexSelection = (x, y) => {
    const key = `${x}-${y}`
    console.log(key)
  }

  const unitSelection = (x, y, counter) => {
    const key = `x ${x}-${y}-${counter.trueIndex}`
    console.log(key)
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
      <div className="flex mr05em p05em">
        <div className="flex-fill"></div>
        <div className="custom-button" onClick={() => setScale(s => Math.max(s/1.25, 0.4))}>
          size -
        </div>
        <div className="custom-button" onClick={() => setScale(1)}>
          0
        </div>
        <div className="custom-button" onClick={() => setScale(s => Math.min(s*1.25, 2.5))}>
          + size
        </div>
        <div className="custom-button" onClick={() => setCoords(c => !c)}>
          coords { coords ? "on" : "off" }
        </div>
        <div className="custom-button" onClick={() => setShowStatusCounters(ssc => !ssc)}>
          status { showStatusCounters ? "counters" : "badges" }
        </div>
        <div className="custom-button" onClick={() => setShowLos(sl => !sl)}>
          { showLos ? "LOS" : "stack" } overlays
        </div>
        <div className="custom-button" onClick={() => setHideCounters(sc => !sc)}>
          { hideCounters ? "show" : "hide" } counters
        </div>
        <div className="custom-button" onClick={() => setShowTerrain(sc => !sc)}>
          terrain info { showTerrain ? "on" : "off" }
        </div>
      </div>
      <div className="mb05em ml05em mr05em">
        <GameMap map={map} scale={scale} showCoords={coords} showStatusCounters={showStatusCounters}
                showLos={showLos} hideCounters={hideCounters} showTerrain={showTerrain}
                hexCallback={hexSelection} counterCallback={unitSelection} />
      </div>
    </div>
  )
}
