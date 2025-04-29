import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { getAPI } from "../../utilities/network";
import Header from "../Header";
import ChatDisplay from "../ChatDisplay";
import MoveDisplay from "./MoveDisplay";
import GameMap from "./map/GameMap";
import GameControls from "./controls/GameControls";
import Game from "../../engine/Game";
import Map from "../../engine/Map";
import Counter from "../../engine/Counter";
import GameMove from "../../engine/GameMove";
import { Direction } from "../../utilities/commonTypes";
import { ReinforcementItem } from "../../engine/Scenario";

export default function GameDisplay() {
  const { id } = useParams()

  const [game, setGame] = useState<{ k?: Game, turn: number, state?: string }>({
    turn: 0
  })
  const [map, setMap] = useState<Map | undefined>(undefined)
  const [controls, setControls] = useState<JSX.Element | undefined>(undefined)

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
    game.k?.loadNewMoves()
  }

  const gameNotification = (g: Game) => {
    setGame({
      k: g,
      turn: g.turn,
      state: g.state,
    })
    setControls(<GameControls key={Number(new Date)} game={g} />) // TODO: fix key hack to force updates
  }

  const showInput = () => {
    if (!localStorage.getItem("username")) { return false }
    return game.k?.id === 0 ||
           localStorage.getItem("username") === game.k?.playerOneName ||
           localStorage.getItem("username") === game.k?.playerTwoName
  }

  const executeMove = (x: number, y: number, counter: ReinforcementItem, d: Direction) => {
    if (game.k?.reinforcementSelection) {
      const move = new GameMove({
        user: game.k.currentPlayer,
        player: game.k.reinforcementSelection.player,
        data: {
          action: "deploy", originIndex: game.k.reinforcementSelection.index,
          target: [x, y], orientation: d, turn: game.k.turn
        }
      }, game.k, game.k.moves.length)
      game.k.executeMove(move)
      gameNotification(game.k)
      if (counter.x == counter.used) {
        game.k.reinforcementSelection = undefined
      }
      game.k.reinforcementNeedsDirection = undefined
    }
  }

  const hexSelection = (x: number, y: number) => {
    console.log(`GD processing ${x},${y}`)
    if (game.k?.reinforcementSelection) {
      const counter = game.k.availableReinforcements(game.k.currentPlayer)[game.k.turn][
        game.k.reinforcementSelection.index]
      if (!counter.counter.rotates || !game.k.reinforcementNeedsDirection) {
        executeMove(x, y, counter, 1)
      }
    }
  }

  const unitSelection = (x: number, y: number, counter: Counter) => {
    const key = `x ${x}-${y}-${counter.trueIndex}`
    console.log(key)
  }

  const directionSelection = (x: number, y: number, d: Direction) => {
    const key = `D ${x}-${y}-${d}`
    console.log(key)
    if (game.k?.reinforcementSelection) {
      // TODO: consolidate
      const counter = game.k.availableReinforcements(game.k.currentPlayer)[game.k.turn][
        game.k.reinforcementSelection.index]
      executeMove(x, y, counter, d)
    }
  }

  const resetDisplay = () => {
    setShowLos(false)
    setHideCounters(false)
  }

  return (
    <div className="main-page">
      <Header />
      <div className="game-control ml05em mr05em mt05em">
        <div className="red monospace mr05em">
          {game.k?.scenario?.code}:
        </div>
        <div className="green nowrap">
          {game.k?.scenario?.name} 
        </div>
        <div className="ml1em mr1em nowrap">
          (
            { game.turn > 0 ? <span>turn {game.turn}/{game.k?.scenario?.turns}</span> : "initial setup" }
            { game.state === "needs_player" ? " - waiting for player to join" : "" }
            { game.state === "ready" ? " - waiting for game to start" : "" }
          )
        </div>
        <div className="flex-fill align-end">
          {game.k?.name}
        </div>
      </div>
      <div className="standard-body">
        <div className="game-page-moves">
          <MoveDisplay game={game.k}
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
        <GameMap map={map as Map} scale={scale} showCoords={coords} showStatusCounters={showStatusCounters}
                 showLos={showLos} hideCounters={hideCounters} showTerrain={showTerrain}
                 hexCallback={hexSelection} counterCallback={unitSelection}
                 directionCallback={directionSelection} resetCallback={resetDisplay} />
      </div>
    </div>
  )
}
