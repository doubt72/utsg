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
import { Direction } from "../../utilities/commonTypes";
import ErrorDisplay from "./ErrorDisplay";
import {
  ArrowsCollapse, ArrowsExpand, Circle, CircleFill, DashCircle, EyeFill, GeoAlt,
  GeoAltFill, Hexagon, HexagonFill, PlusCircle, Square, SquareFill, Stack
} from "react-bootstrap-icons";

export default function GameDisplay() {
  const { id } = useParams()

  const [game, setGame] = useState<{ k?: Game, turn: number, state?: string }>({ turn: 0 })
  const [map, setMap] = useState<Map | undefined>(undefined)
  const [moves, setMoves] = useState<JSX.Element | undefined>(undefined)
  const [turn, setTurn] = useState<JSX.Element | undefined>(undefined)
  const [controls, setControls] = useState<JSX.Element | undefined>(undefined)
  const [errorWindow, setErrorWindow] = useState<JSX.Element | undefined>(undefined)

  const [collapseLayout, setCollapseLayout] = useState<boolean>(false)

  const [mapScale, setMapScale] = useState(1)
  const [interfaceShrink, setInterfaceShrink] = useState(false)
  const [coords, setCoords] = useState(true)
  const [showStatusCounters, setShowStatusCounters] = useState(false)
  const [hideCounters, setHideCounters] = useState(false)
  const [showTerrain, setShowTerrain] = useState(false)
  const [showLos, setShowLos] = useState(false)

  const [mapScaleMinusButton, setMapScaleMinusButton] = useState<JSX.Element | undefined>()
  const [mapScaleResetButton, setMapScaleResetButton] = useState<JSX.Element | undefined>()
  const [mapScalePlusButton, setMapScalePlusButton] = useState<JSX.Element | undefined>()

  const [update, setUpdate] = useState(0)

  useEffect(() => {
    getAPI(`/api/v1/games/${id}`, {
      ok: response => response.json().then(json => {
        const code = json.scenario
        getAPI(`/api/v1/scenarios/${code}`, {
          ok: response => response.json().then(scenario => {
            json.scenario = scenario
            const g = new Game(json, gameNotification)
            setGame({k: g, turn: g.turn, state: g.state})
            setControls(<GameControls game={g} callback={() => setUpdate(s => s+1)} />)
            setMap(g.scenario.map)
          })
        })
      })
    })
    const shrink = localStorage.getItem("mapInterfaceShrink")
    const mScale = localStorage.getItem("mapScale")
    const collape = localStorage.getItem("mapCollapseLayout")
    const showCoords = localStorage.getItem("mapCoords")
    const showMarkers = localStorage.getItem("mapMarkers")
    if (shrink !== null) { setInterfaceShrink(shrink === "true") }
    if (mScale !== null) { setMapScale(Number(mScale)) }
    if (collape !== null) { setCollapseLayout(collape == "true") }
    if (showCoords !== null) { setCoords(showCoords == "true") }
    if (showMarkers !== null) { setShowStatusCounters(showMarkers == "true") }
  }, [])

  const switchMapScale = (set: -1 | 0 | 1) => {
    if (set < 0) {
      setMapScale(ms => {
        const nv = Math.max(ms/1.25, 0.512)
        localStorage.setItem("mapScale", String(nv))
        return nv
      })
    } else if (set > 0) {
      setMapScale(ms => {
        const nv = Math.min(ms*1.25, 1.0)
        localStorage.setItem("mapScale", String(nv))
        return nv
      })
    } else {
      setMapScale(() => {
        localStorage.setItem("mapScale", String(1))
        return 1
      })
    }
  }

  useEffect(() => {
    setMapScaleMinusButton(
      <div className={
        mapScale > 0.52 ? "custom-button normal-button" :
          "custom-button normal-button custom-button-ghost"
      }
           onClick={() => switchMapScale(-1)}>
        <span>map</span> <DashCircle />
      </div>
    )
    setMapScaleResetButton(
      <div className={
        mapScale < 1 ? "custom-button normal-button" :
          "custom-button normal-button custom-button-ghost"
      }
           onClick={() => switchMapScale(0)}>
        <Circle />
      </div>
    )
    setMapScalePlusButton(
      <div className={
        mapScale < 1 ? "custom-button normal-button" :
          "custom-button normal-button custom-button-ghost"
      }
           onClick={() => switchMapScale(1)}>
        <PlusCircle /> <span>map</span>
      </div>
    )
  }, [mapScale])

  const toggleInterfaceShrink = () => {
    setInterfaceShrink(is => {
      const nv = !is
      localStorage.setItem("mapInterfaceShrink", String(nv))
      return nv
    })
  }

  const toggleShowCoords = () => {
    setCoords(c => {
      const nc = !c
      localStorage.setItem("mapCoords", String(nc))
      return nc
    })
  }

  const toggleShowMarkers = () => {
    setShowStatusCounters(sc => {
      const nc = !sc
      localStorage.setItem("mapMarkers", String(nc))
      return nc
    })
  }

  useEffect(() => {
    if (!game.k || moves) { return }
    setMoves(<MoveDisplay game={game.k} callback={moveNotification}
                          collapse={collapseLayout} chatInput={showInput()} />)
  }, [game.k])

  useEffect(() => {
    if (!game.k) { return }
    setMoves(<MoveDisplay game={game.k} callback={moveNotification}
                          collapse={collapseLayout} chatInput={showInput()} />)
  }, [collapseLayout])

  useEffect(() => {
    if (!game.k) { return }
    setControls(gc => {
      const key = Number(gc?.key ?? 0)
      return <GameControls key={key + 1} game={game.k as Game} callback={() => setUpdate(s => s+1)} />
    })

    let status = game.k.turn > 0 ? <span>turn {game.k.turn}/{game.k.scenario.turns}</span> : "initial setup"
    if (game.k.state === "needs_player") { status += " - waiting for player to join" }
    if (game.k.state === "ready") { status += " - waiting for game to start"}
    setTurn(<>{status}</>)
  }, [
    game.k?.state, game.k?.lastMove?.undone, game.k?.lastMove?.id,
  ])

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
    if (game.k?.gameActionState?.deploy) {
      const counter = game.k.availableReinforcements(game.k.currentPlayer)[game.k.turn][
        game.k.gameActionState.deploy.index]
      if (!counter.counter.rotates || !game.k.gameActionState.deploy.needsDirection) {
        game.k.executeReinforcement(x, y, counter, 1, gameNotification)
      } else {
        setControls(gc => {
          const key = Number(gc?.key ?? 0)
          return <GameControls key={key + 1} game={game.k as Game} callback={() => setUpdate(s => s+1)} />
        })
      }
    } else if (game.k?.gameActionState?.move) {
      setControls(gc => {
        const key = Number(gc?.key ?? 0)
        return <GameControls key={key + 1} game={game.k as Game} callback={() => setUpdate(s => s+1)} />
      })
    }
  }

  const unitSelection = () => {
    setControls(gc => {
      const key = Number(gc?.key ?? 0)
      return <GameControls key={key + 1} game={game.k as Game} callback={() => setUpdate(s => s+1)} />
    })
  }

  const directionSelection = (x: number, y: number, d: Direction) => {
    if (game.k?.gameActionState?.deploy) {
      const counter = game.k.availableReinforcements(game.k.currentPlayer)[game.k.turn][
        game.k.gameActionState.deploy.index]
      game.k.executeReinforcement(x, y, counter, d, gameNotification)
    } else if (game.k?.gameActionState?.move) {
      game.k.moveRotate(x, y, d)
    }
  }

  const clearAction = () => {
    map?.clearAllSelections()
    setControls(gc => {
      const key = Number(gc?.key ?? 0)
      return <GameControls key={key + 1} game={game.k as Game} callback={() => setUpdate(s => s+1)} />
    })
    setUpdate(s => s+1)
  }

  const resetDisplay = () => {
    setShowLos(false)
    setHideCounters(false)
  }

  const layout = () => {
    if (collapseLayout) {
      return (
        <div className="flex">
          <div className="custom-button normal-button expand-button"
               onClick={() => {
                 setCollapseLayout(false)
                 localStorage.setItem("mapCollapseLayout", "false")
               }}>
            <PlusCircle />
          </div>
          <div className="standard-body">
            <div className="game-page-moves">
              {moves}
            </div>
            <div className="chat-section">
              <ChatDisplay gameId={Number(id)} collapse={true}
                           showInput={showInput()} />
            </div>
          </div>
        </div>
      )
    } else {
      return (
        <div>
          <div className="flex">
            <div className="custom-button normal-button collapse-button"
                 onClick={() => {
                   setCollapseLayout(true)
                   localStorage.setItem("mapCollapseLayout", "true")
                 }}>
              <DashCircle />
            </div>
            <div className="game-control ml05em mr05em mt05em flex-fill">
              <div className="red monospace mr05em">
                {game.k?.scenario?.code}:
              </div>
              <div className="green nowrap">
                {game.k?.scenario?.name} 
              </div>
              <div className="ml1em mr1em nowrap">
                ({turn})
              </div>
              <div className="flex-fill align-end mr05em">
                {game.k?.name}
              </div>
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
        </div>
      )
    }
  }

  return (
    <div className="main-page">
      <Header />
      {layout()}
      {controls}
      <div className="flex map-control">
        <div className="flex-fill"></div>
        {mapScaleMinusButton}
        {mapScaleResetButton}
        {mapScalePlusButton}
        <div className="custom-button normal-button"
             onClick={() => toggleInterfaceShrink()}>
          { interfaceShrink ? <ArrowsCollapse /> : <ArrowsExpand /> } <span>controls</span>
        </div>
        <div className="custom-button normal-button"
             onClick={() => toggleShowCoords()}>
          { coords ? <GeoAltFill /> : <GeoAlt /> } <span>coords</span>
        </div>
        <div className="custom-button normal-button"
             onClick={() => toggleShowMarkers()}>
          { showStatusCounters ? <Stack /> : <CircleFill /> } <span>status</span>
        </div>
        <div className="custom-button normal-button"
             onClick={() => setShowLos(sl => !sl)}>
          { showLos ? <EyeFill /> : <Stack /> } <span>overlay</span>
        </div>
        <div className="custom-button normal-button"
             onClick={() => setHideCounters(sc => !sc)}>
        { hideCounters ? <Square /> : <SquareFill /> } <span>counters</span>
        </div>
        <div className="custom-button normal-button"
             onClick={() => setShowTerrain(sc => !sc)}>
        { showTerrain ? <HexagonFill /> : <Hexagon /> } <span>terrain info</span>
        </div>
      </div>
      <div className="game-map">
        <GameMap map={map as Map} scale={interfaceShrink ? 0.75 : 1} mapScale={mapScale}
                 showCoords={coords} showStatusCounters={showStatusCounters} showLos={showLos}
                 hideCounters={hideCounters} showTerrain={showTerrain} preview={false}
                 guiCollapse={collapseLayout} forceUpdate={update}
                 hexCallback={hexSelection} counterCallback={unitSelection}
                 directionCallback={directionSelection} resetCallback={resetDisplay}
                 clearActionCallback={clearAction} />
      </div>
      {errorWindow}
    </div>
  )
}
