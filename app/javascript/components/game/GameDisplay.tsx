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
import { Direction } from "../../utilities/commonTypes";
import ErrorDisplay from "./ErrorDisplay";
import {
  Circle, CircleFill, DashCircle, EyeFill, GeoAlt, GeoAltFill, Hexagon, HexagonFill,
  PlusCircle, Square, SquareFill, Stack
} from "react-bootstrap-icons";

export default function GameDisplay() {
  const { id } = useParams()

  const [game, setGame] = useState<{ k?: Game, turn: number, state?: string }>({
    turn: 0
  })
  const [map, setMap] = useState<Map | undefined>(undefined)
  const [moves, setMoves] = useState<JSX.Element | undefined>(undefined)
  const [turn, setTurn] = useState<JSX.Element | undefined>(undefined)
  const [controls, setControls] = useState<JSX.Element | undefined>(undefined)
  const [errorWindow, setErrorWindow] = useState<JSX.Element | undefined>(undefined)

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

  useEffect(() => {
    if (!game.k || moves) { return }
    setMoves(<MoveDisplay game={game.k} callback={moveNotification} chatInput={showInput()} />)
  }, [game.k])

  useEffect(() => {
    if (!game.k) { return }
    setControls(gc => {
      const key = Number(gc?.key ?? 0)
      return <GameControls key={key + 1} game={game.k as Game} />
    })

    let status = game.k.turn > 0 ? <span>turn {game.k.turn}/{game.k.scenario.turns}</span> : "initial setup"
    if (game.k.state === "needs_player") { status += " - waiting for player to join" }
    if (game.k.state === "ready") { status += " - waiting for game to start"}
    setTurn(<>{status}</>)
  }, [game.k?.state, game.k?.lastMove?.undone, game.k?.lastMove?.id])

  const moveNotification = (moveId?: number) => {
    if (game.k) {
      game.k?.loadNewMoves(moveId)
      gameNotification(game.k)
    }
  }

  const gameNotification = (g: Game, error?: [string, string]) => {
    if (error) {
      setErrorWindow(
        <ErrorDisplay type={error[0]} message={error[1]} callBack={
          () => setErrorWindow(undefined)
        } />
      )
      return
    }
    setGame({
      k: g,
      turn: g.turn,
      state: g.state,
    })
  }

  const showInput = () => {
    if (!localStorage.getItem("username")) { return false }
    return game.k?.id === 0 ||
           localStorage.getItem("username") === game.k?.playerOneName ||
           localStorage.getItem("username") === game.k?.playerTwoName
  }

  const hexSelection = (x: number, y: number) => {
    if (game.k?.reinforcementSelection) {
      const counter = game.k.availableReinforcements(game.k.currentPlayer)[game.k.turn][
        game.k.reinforcementSelection.index]
      if (!counter.counter.rotates || !game.k.reinforcementNeedsDirection) {
        game.k.executeReinforcement(x, y, counter, 1, gameNotification)
      }
    }
  }

  const unitSelection = (x: number, y: number, counter: Counter) => {
    const key = `x ${x}-${y}-${counter.trueIndex}`
    console.log(key)
    setControls(gc => {
      const key = Number(gc?.key ?? 0)
      return <GameControls key={key + 1} game={game.k as Game} />
    })
  }

  const directionSelection = (x: number, y: number, d: Direction) => {
    if (game.k?.reinforcementSelection) {
      const counter = game.k.availableReinforcements(game.k.currentPlayer)[game.k.turn][
        game.k.reinforcementSelection.index]
      game.k.executeReinforcement(x, y, counter, d, gameNotification)
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
          ({turn})
        </div>
        <div className="flex-fill align-end">
          {game.k?.name}
        </div>
      </div>
      <div className="standard-body">
        <div className="game-page-moves">
          {moves}
        </div>
        <div className="chat-section">
          <ChatDisplay gameId={Number(id)}
                       showInput={showInput()} />
        </div>
      </div>
      {controls}
      <div className="flex map-control">
        <div className="flex-fill"></div>
        <div className="custom-button" onClick={() => setScale(s => Math.max(s/1.25, 0.4))}>
          <span>size</span> <DashCircle />
        </div>
        <div className="custom-button" onClick={() => setScale(1)}>
          <Circle />
        </div>
        <div className="custom-button" onClick={() => setScale(s => Math.min(s*1.25, 2.5))}>
          <PlusCircle /> <span>size</span>
        </div>
        <div className="custom-button" onClick={() => setCoords(c => !c)}>
          { coords ? <GeoAltFill /> : <GeoAlt /> } <span>coords</span>
        </div>
        <div className="custom-button" onClick={() => setShowStatusCounters(ssc => !ssc)}>
          { showStatusCounters ? <Stack /> : <CircleFill /> } <span>status</span>
        </div>
        <div className="custom-button" onClick={() => setShowLos(sl => !sl)}>
          { showLos ? <EyeFill /> : <Stack /> } <span>overlay</span>
        </div>
        <div className="custom-button" onClick={() => setHideCounters(sc => !sc)}>
        { hideCounters ? <Square /> : <SquareFill /> } <span>counters</span>
        </div>
        <div className="custom-button" onClick={() => setShowTerrain(sc => !sc)}>
        { showTerrain ? <HexagonFill /> : <Hexagon /> } <span>terrain info</span>
        </div>
      </div>
      <div className="game-map">
        <GameMap map={map as Map} scale={scale} showCoords={coords} showStatusCounters={showStatusCounters}
                 showLos={showLos} hideCounters={hideCounters} showTerrain={showTerrain} preview={false}
                 hexCallback={hexSelection} counterCallback={unitSelection}
                 directionCallback={directionSelection} resetCallback={resetDisplay} />
      </div>
      {errorWindow}
    </div>
  )
}
