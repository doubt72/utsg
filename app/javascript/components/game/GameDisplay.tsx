import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { getAPI } from "../../utilities/network";
import Header from "../Header";
import ChatDisplay from "../ChatDisplay";
import ActionDisplay from "./ActionDisplay";
import MapDisplay from "./map/MapDisplay";
import GameControls from "./controls/GameControls";
import Game from "../../engine/Game";
import Map from "../../engine/Map";
import { Direction } from "../../utilities/commonTypes";
import ErrorDisplay from "./ErrorDisplay";
import {
  ArrowsAngleContract, ArrowsAngleExpand, Circle, CircleFill, DashCircle, EyeFill, GeoAlt,
  GeoAltFill, Hexagon, HexagonFill, Phone, PlusCircle, Square, SquareFill, Stack
} from "react-bootstrap-icons";
import { OverlayTrigger, Tooltip, TooltipProps } from "react-bootstrap";
import { stateType } from "../../engine/control/state/BaseState";

export default function GameDisplay() {
  const { id } = useParams()

  const [game, setGame] = useState<{ k?: Game, turn: number, state?: string }>({ turn: 0 })
  const [map, setMap] = useState<Map | undefined>()
  const [mapDisplay, setMapDisplay] = useState<JSX.Element | undefined>()
  const [actions, setActions] = useState<JSX.Element | undefined>()
  const [turn, setTurn] = useState<JSX.Element | undefined>()
  const [controls, setControls] = useState<JSX.Element | undefined>()
  const [errorWindow, setErrorWindow] = useState<JSX.Element | undefined>()

  const [collapseLayout, setCollapseLayout] = useState<boolean>(false)

  const [mapScale, setMapScale] = useState(1)
  const [interfaceShrink, setInterfaceShrink] = useState(0)
  const [coords, setCoords] = useState(true)
  const [showStatusCounters, setShowStatusCounters] = useState(false)
  const [hideCounters, setHideCounters] = useState(false)
  const [showTerrain, setShowTerrain] = useState(false)
  const [showLos, setShowLos] = useState(false)

  const [mapScaleMinusButton, setMapScaleMinusButton] = useState<JSX.Element | undefined>()
  const [mapScaleResetButton, setMapScaleResetButton] = useState<JSX.Element | undefined>()
  const [mapScalePlusButton, setMapScalePlusButton] = useState<JSX.Element | undefined>()
  const [largeInterfaceButton, setLargeInterfaceButton] = useState<JSX.Element | undefined>()
  const [smallInterfaceButton, setSmallInterfaceButton] = useState<JSX.Element | undefined>()
  const [mobileInterfaceButton, setMobileInterfaceButton] = useState<JSX.Element | undefined>()

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
    if (shrink !== null) {
      setInterfaceShrink(Number(shrink))
    } else {
      if (window.innerWidth < 1350) {
        setInterfaceShrink(2)
      } else if (window.innerWidth < 1800) {
        setInterfaceShrink(1)
      }
    }
    if (mScale !== null) { setMapScale(Number(mScale)) }
    if (collape !== null) { setCollapseLayout(collape == "true") }
    if (showCoords !== null) { setCoords(showCoords == "true") }
    if (showMarkers !== null) { setShowStatusCounters(showMarkers == "true") }
  }, [])

  useEffect(() => {
    if (!map) { return }
    setMapDisplay(
      <MapDisplay map={map} scale={shrinkScales[interfaceShrink]} mapScale={mapScale}
                  showCoords={coords} showStatusCounters={showStatusCounters} showLos={showLos}
                  hideCounters={hideCounters} showTerrain={showTerrain} preview={false}
                  guiCollapse={collapseLayout} forceUpdate={update}
                  hexCallback={hexSelection} counterCallback={unitSelection}
                  directionCallback={directionSelection} resetCallback={resetDisplay}
                  clearActionCallback={clearAction} />
    )
  }, [
    map, update, interfaceShrink, mapScale, coords, showStatusCounters, showLos,
    hideCounters, showTerrain, collapseLayout
  ])

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

  const scaleMinusTooltip = (props: TooltipProps) => (
    <Tooltip className="tooltip-game" {...props}>
      make the map smaller
    </Tooltip>
  )

  const scaleZeroTooltip = (props: TooltipProps) => (
    <Tooltip className="tooltip-game" {...props}>
      reset map size
    </Tooltip>
  )

  const scalePlusTooltip = (props: TooltipProps) => (
    <Tooltip className="tooltip-game" {...props}>
      make the map larger
    </Tooltip>
  )

  const largeSizeTooltip = (props: TooltipProps) => (
    <Tooltip className="tooltip-game" {...props}>
      set the size of the map status overlays and the unzoomed size of the map
      to best suit larger displays
    </Tooltip>
  )

  const smallSizeTooltip = (props: TooltipProps) => (
    <Tooltip className="tooltip-game" {...props}>
      set the size of the map status overlays and the unzoomed size of the map
      to best suit smaller displays
    </Tooltip>
  )

  const mobileSizeTooltip = (props: TooltipProps) => (
    <Tooltip className="tooltip-game" {...props}>
      set the size of the map status overlays and the unzoomed size of the map
      to best suit very small or mobile (tablet) displays
    </Tooltip>
  )

  useEffect(() => {
    setMapScaleMinusButton(
      <OverlayTrigger placement="bottom" overlay={scaleMinusTooltip}
                      delay={{ show: 0, hide: 0 }}>
        <div className={`custom-button normal-button button-left${mapScale > 0.52 ? "" : " custom-button-ghost"}`}
             onClick={() => switchMapScale(-1)}>
          <DashCircle />
        </div>
      </OverlayTrigger>
    )
    setMapScaleResetButton(
      <OverlayTrigger placement="bottom" overlay={scaleZeroTooltip}
                      delay={{ show: 0, hide: 0 }}>
        <div className={`custom-button normal-button button-middle${mapScale < 1 ? "" : " custom-button-ghost"}`}
             onClick={() => switchMapScale(0)}>
          <Circle />
        </div>
      </OverlayTrigger>
    )
    setMapScalePlusButton(
      <OverlayTrigger placement="bottom" overlay={scalePlusTooltip}
                      delay={{ show: 0, hide: 0 }}>
        <div className={`custom-button normal-button button-right${mapScale < 1 ? "" : " custom-button-ghost"}`}
             onClick={() => switchMapScale(1)}>
          <PlusCircle />
        </div>
      </OverlayTrigger>
    )
  }, [mapScale])
  useEffect(() => {
    setLargeInterfaceButton(
      <OverlayTrigger placement="bottom" overlay={largeSizeTooltip}
                      delay={{ show: 0, hide: 0 }}>
        <div className={ `custom-button normal-button button-left${interfaceShrink !== 0 ? "" : " custom-button-select"}` }
             onClick={() => selectInterfaceShrink(0)}>
          <ArrowsAngleExpand />
        </div>
      </OverlayTrigger>
    )
    setSmallInterfaceButton(
      <OverlayTrigger placement="bottom" overlay={smallSizeTooltip}
                      delay={{ show: 0, hide: 0 }}>
        <div className={ `custom-button normal-button button-middle${interfaceShrink !== 1 ? "" : " custom-button-select"}` }
             onClick={() => selectInterfaceShrink(1)}>
          <ArrowsAngleContract />
        </div>
      </OverlayTrigger>
    )
    setMobileInterfaceButton(
      <OverlayTrigger placement="bottom" overlay={mobileSizeTooltip}
                      delay={{ show: 0, hide: 0 }}>
        <div className={ `custom-button normal-button button-right${interfaceShrink !== 2 ? "" : " custom-button-select"}` }
             onClick={() => selectInterfaceShrink(2)}>
          <Phone />
        </div>
      </OverlayTrigger>
    )
  }, [mapScale, interfaceShrink])

  const selectInterfaceShrink = (setting: number) => {
    setInterfaceShrink(() => {
      let nv = setting
      if (nv < 0) { nv = 0 }
      if (nv > 2) { nv = 2 }
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
    if (!game.k || actions) { return }
    setActions(<ActionDisplay game={game.k} callback={actionNotification}
                          collapse={collapseLayout} chatInput={showInput()} />)
  }, [game.k])

  useEffect(() => {
    if (!game.k) { return }
    setActions(<ActionDisplay game={game.k} callback={actionNotification}
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
    game.k?.state, game.k?.lastAction?.undone, game.k?.lastAction?.id,
  ])

  const actionNotification = (actionId?: number) => {
    if (game.k) {
      game.k?.loadNewActions(actionId)
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
    setUpdate(s => s + 1)
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
    if (game.k?.gameState?.type === stateType.Deploy) {
      const counter = game.k.availableReinforcements(game.k.currentPlayer)[game.k.turn][
        game.k.deployState.index]
      if (!counter.counter.rotates || !game.k.deployState.needsDirection) {
        game.k.deployState.toHex(x, y)
        game.k.gameState.finish()
      } else {
        setControls(gc => {
          const key = Number(gc?.key ?? 0)
          return <GameControls key={key + 1} game={game.k as Game} callback={() => setUpdate(s => s+1)} />
        })
      }
    } else if (game.k?.gameState?.type === stateType.Move || game.k?.gameState?.type === stateType.Assault) {
      setControls(gc => {
        const key = Number(gc?.key ?? 0)
        return <GameControls key={key + 1} game={game.k as Game} callback={() => setUpdate(s => s+1)} />
      })
    } else if (game.k?.gameState?.type === stateType.Fire) {
      const fire = game.k.fireState
      if (fire.selection[0].counter.unit.offBoard || fire.smoke) {
        setControls(gc => {
          const key = Number(gc?.key ?? 0)
          return <GameControls key={key + 1} game={game.k as Game} callback={() => setUpdate(s => s+1)} />
        })
      }
    }
  }

  const unitSelection = () => {
    setControls(gc => {
      const key = Number(gc?.key ?? 0)
      return <GameControls key={key + 1} game={game.k as Game} callback={() => setUpdate(s => s+1)} />
    })
  }

  const directionSelection = (d: Direction) => {
    if (game.k?.gameState?.type === stateType.Deploy) {
      game.k.deployState.dir(d)
      game.k.gameState.finish()
    } else if (game.k?.gameState?.type === stateType.Fire) {
      game.k.fireState.rotate(d)
    } else if (game.k?.gameState?.type === stateType.Move) {
      game.k.moveState.rotate(d)
      setControls(gc => {
        const key = Number(gc?.key ?? 0)
        return <GameControls key={key + 1} game={game.k as Game} callback={() => setUpdate(s => s+1)} />
      })
    } else if (game.k?.gameState?.type === stateType.Assault) {
      game.k.assaultState.rotate(d)
      setControls(gc => {
        const key = Number(gc?.key ?? 0)
        return <GameControls key={key + 1} game={game.k as Game} callback={() => setUpdate(s => s+1)} />
      })
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

  const expandTooltip = (props: TooltipProps) => (
    <Tooltip className="tooltip-game" {...props}>
      expands move and chat displays and allows sending chat messages
    </Tooltip>
  )

  const collapseTooltip = (props: TooltipProps) => (
    <Tooltip className="tooltip-game" {...props}>
      collapses move and chat displays to make more room for the game map
    </Tooltip>
  )

  const layout = () => {
    if (collapseLayout) {
      return (
        <div className="flex">
          <OverlayTrigger placement="bottom" overlay={expandTooltip}
                          delay={{ show: 0, hide: 0 }}>
          <div className="custom-button normal-button expand-button"
               onClick={() => {
                 setCollapseLayout(false)
                 localStorage.setItem("mapCollapseLayout", "false")
               }}>
            <PlusCircle />
          </div>
          </OverlayTrigger>
          <div className="standard-body">
            <div className="game-page-actions">
              {actions}
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
            <OverlayTrigger placement="bottom" overlay={collapseTooltip}
                            delay={{ show: 0, hide: 0 }}>
            <div className="custom-button normal-button collapse-button"
                 onClick={() => {
                   setCollapseLayout(true)
                   localStorage.setItem("mapCollapseLayout", "true")
                 }}>
              <DashCircle />
            </div>
            </OverlayTrigger>
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
            <div className="game-page-actions">
              {actions}
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

  const coordsTooltip = (props: TooltipProps) => (
    <Tooltip className="tooltip-game" {...props}>
      toggles showing hex coordinate labels
    </Tooltip>
  )

  const statusTooltip = (props: TooltipProps) => (
    <Tooltip className="tooltip-game" {...props}>
      toggles between status badges and status markers
    </Tooltip>
  )

  const overlayTooltip = (props: TooltipProps) => (
    <Tooltip className="tooltip-game" {...props}>
      toggles between counter overlays and line-of-sight overlay
    </Tooltip>
  )

  const countersTooltip = (props: TooltipProps) => (
    <Tooltip className="tooltip-game" {...props}>
      toggles showing or hiding counters
    </Tooltip>
  )

  const terrainTooltip = (props: TooltipProps) => (
    <Tooltip className="tooltip-game" {...props}>
      toggles showing terrain info overlay
    </Tooltip>
  )

  const shrinkScales = [1, 0.75, 0.625]

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
        {largeInterfaceButton}
        {smallInterfaceButton}
        {mobileInterfaceButton}
        <OverlayTrigger placement="bottom" overlay={coordsTooltip}
                        delay={{ show: 0, hide: 0 }}>
        <div className="custom-button normal-button"
             onClick={() => toggleShowCoords()}>
          { coords ? <GeoAltFill /> : <GeoAlt /> } <span>coords</span>
        </div>
        </OverlayTrigger>
        <OverlayTrigger placement="bottom" overlay={statusTooltip}
                        delay={{ show: 0, hide: 0 }}>
        <div className="custom-button normal-button"
             onClick={() => toggleShowMarkers()}>
          { showStatusCounters ? <Stack /> : <CircleFill /> } <span>status</span>
        </div>
        </OverlayTrigger>
        <OverlayTrigger placement="bottom" overlay={overlayTooltip}
                        delay={{ show: 0, hide: 0 }}>
        <div className="custom-button normal-button"
             onClick={() => setShowLos(sl => !sl)}>
          { showLos ? <EyeFill /> : <Stack /> } <span>overlay</span>
        </div>
        </OverlayTrigger>
        <OverlayTrigger placement="bottom" overlay={countersTooltip}
                        delay={{ show: 0, hide: 0 }}>
        <div className="custom-button normal-button"
             onClick={() => setHideCounters(sc => !sc)}>
        { hideCounters ? <Square /> : <SquareFill /> } <span>counters</span>
        </div>
        </OverlayTrigger>
        <OverlayTrigger placement="bottom" overlay={terrainTooltip}
                        delay={{ show: 0, hide: 0 }}>
        <div className="custom-button normal-button"
             onClick={() => setShowTerrain(sc => !sc)}>
        { showTerrain ? <HexagonFill /> : <Hexagon /> } <span>terrain</span>
        </div>
        </OverlayTrigger>
      </div>
      <div className="game-map">
        { mapDisplay }
      </div>
      {errorWindow}
    </div>
  )
}
