import React, { useEffect, useRef, useState } from "react";
import MapHexPatterns from "./MapHexPatterns";
import MapHex from "./MapHex";
import MapHexDetail from "./MapHexDetail";
import MapCounter from "./MapCounter";
import MapCounterOverlay from "./MapCounterOverlay";
import MapLosOverlay from "./MapLosOverlay";
import MapLosDebugOverlay from "./MapLosDebugOverlay";
import WeatherDisplay from "./WeatherDisplay";
import InitiativeDisplay from "./InitiativeDisplay";
import ScoreDisplay from "./ScoreDisplay";
import TurnDisplay from "./TurnDisplay";
import Reinforcements from "../controls/Reinforcements";
import SniperDisplay from "./SniperDisplay";
import Map from "../../../engine/Map";
import Counter from "../../../engine/Counter";
import ReinforcementPanel from "../controls/ReinforcementPanel";
import { Coordinate, CounterSelectionTarget, Direction, Player } from "../../../utilities/commonTypes";
import MapHexOverlay from "./MapHexOverlay";
import DirectionSelector from "./DirectionSelector";
import MiniMap from "./MiniMap";
import { roundedRectangle, yMapOffset } from "../../../utilities/graphics";
import { normalDir } from "../../../utilities/utilities";
import MoveTrackOverlay from "./MoveTrackOverlay";
import openHex, { openHexRotateOpen } from "../../../engine/control/openHex";
import select from "../../../engine/control/select";
import Unit from "../../../engine/Unit";
import { GameActionPath } from "../../../engine/GameAction";

interface MapDisplayProps {
  map?: Map;
  scale: number;
  mapScale?: number;
  showCoords?: boolean;
  showStatusCounters?: boolean;
  showLos?: boolean;
  hideCounters?: boolean;
  showTerrain?: boolean;
  preview: boolean;
  guiCollapse?: boolean;
  forceUpdate: number;
  hexCallback?: (x: number, y: number) => void;
  counterCallback?: () => void;
  directionCallback?: (x: number, y: number, d: Direction) => void;
  resetCallback?: () => void;
  clearActionCallback?: () => void;
}

export default function MapDisplay({
  map, scale, mapScale, showCoords = false, showStatusCounters = false, showLos = false,
  hideCounters = false, showTerrain = false, preview, guiCollapse = false, forceUpdate,
  hexCallback = () => {}, counterCallback = () => {}, directionCallback = () => {}, resetCallback = () => {},
  clearActionCallback = () => {}
}: MapDisplayProps) {
  const [mapUpdate, setMapUpdate] = useState(0)

  const [hexDisplay, setHexDisplay] = useState<JSX.Element[]>([])
  const [hexDisplayDetail, setHexDisplayDetail] = useState<JSX.Element[]>([])
  const [hexDisplayOverlays, setHexDisplayOverlays] = useState<JSX.Element[]>([])
  const [counterDisplay, setCounterDisplay] = useState<JSX.Element[]>([])
  const [actionCounterDisplay, setActionCounterDisplay] = useState<JSX.Element[]>([])
  const [overlay, setOverlay] = useState<{
    show: boolean, x: number, y: number, counters?: Counter[]
  }>({ show: false, x: -1, y: -1 })
  const [losOverlay, setLosOverlay] = useState<JSX.Element | undefined>()
  const [counterLosOverlay, setCounterLosOverlay] = useState<JSX.Element[] | undefined>()
  const [counterOverlay, setCounterOverlay] = useState<JSX.Element | undefined>()
  const [terrainInfoOverlay, setTerrainInfoOverlay] = useState<JSX.Element | undefined>()
  const [reinforcementsOverlay, setReinforcementsOverlay] = useState<JSX.Element | undefined>()
  const [directionSelectionOverlay, setDirectionSelectionOverlay] = useState<JSX.Element | undefined>()

  const [weather, setWeather] = useState<JSX.Element | undefined>()
  const [initiative, setInitiative] = useState<JSX.Element | undefined>()
  const [score, setScore] = useState<JSX.Element | undefined>()
  const [turn, setTurn] = useState<JSX.Element | undefined>()
  const [sniper, setSniper] = useState<JSX.Element | undefined>()
  const [reinforcements, setReinforcements] = useState<JSX.Element | undefined>()
  const [minimap, setMinimap] = useState<JSX.Element | undefined>()

  const [xOffset, setXOffset] = useState<number>(0)
  const [yOffset, setYOffset] = useState<number>(0)
  const [reinforcementOffset, setReinforcementOffset] = useState<number>(269)

  const [moveTrack, setMoveTrack] = useState<JSX.Element | undefined>()

  const [notification, setNotification] = useState<JSX.Element | undefined>()
  const [notificationDetails, setNotificationDetails] = useState<{
    error: string, timer: number
  }>({ error: "", timer: 0 })

  const minHeight = (height: number, scale: number = 1, m?: Map) => {
    if (!map) { return 9999 }
    if (preview || m?.preview) { return map.ySize * scale }
    const gc = guiCollapse ? 178 : 0
    const fill = m?.debug ? 16 : 408 - gc
    const available = 1254 + 50 / scale - 50
    return height - fill < available * scale ? available * scale : height - fill
  }
  const minWidth = (width: number, scale: number = 1, m?: Map) => {
    if (!map) { return 9999 }
    if (preview || m?.preview) { return map.xSize * scale }
    let min = 705 + (m?.game?.scenario.turns ?? 0) * 90
    if (m?.game?.alliedSniper || m?.game?.axisSniper) { min += 280 }
    return width - 24 < min * scale ? min * scale : width - 24
  }

  const [width, setWidth] = useState<number>(minWidth(window.innerWidth, 1, map))
  const [height, setHeight] = useState<number>(minHeight(window.innerHeight, 1, map))

  // IDEK what I'm doing with types here
  const svgRef = useRef<HTMLElement | SVGSVGElement>()

  useEffect(() => {
    if (!map || !map.game) { return }
    const timer = notificationDetails.timer
    if (timer < 1) {
      if (map.game.messageQueue.length > 0) {
        setNotificationDetails({ error: map.game.getMessage() as string, timer: 200 })
      } else {
        setNotification(undefined)
      }
      return
    }
    const alpha =  timer < 30 ? timer / 30 : 1
    const error = notificationDetails.error
    const twidth = error.length * 9.6 + 24
    const x = width / scale - 216 - twidth
    const y = 50 + map?.yStatusSize + 50 / scale - 50
    setNotification(
      <g>
        <path d={roundedRectangle(x, y, twidth, 32)} style={{ fill: `rgba(221,221,221,${alpha})` }}/>
        <text x={x + 12} y={y + 20} fontSize={16} fontFamily="'Courier Prime', monospace"
                  textAnchor="start" style={{ fill: `rgba(0,0,0,${alpha})` }}>{error}</text>
      </g>
    )
    setTimeout(() => setNotificationDetails(s => { return { error: s.error, timer: s.timer - 2 } }), 20)
  }, [notificationDetails])

  useEffect(() => {
    if (!map || !map.game || map.game.messageQueue.length < 1) { return }
    if (notificationDetails.timer < 1) {
      setNotificationDetails({ error: map.game.getMessage() as string, timer: 200 })
    }
  }, [map?.game?.messageQueue.length])

  useEffect(() => {
    const handleResize = () => {
      setWidth(minWidth(window.innerWidth, scale, map))
      setHeight(minHeight(window.innerHeight, scale, map))
    }
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [scale, map, guiCollapse])

  useEffect(() => {
    setWidth(minWidth(window.innerWidth, scale, map))
    setHeight(minHeight(window.innerHeight, scale, map))
  }, [scale, map, guiCollapse])

  const minimapCallback = (event: React.MouseEvent, calculated: {
    mapSize: Coordinate, scale: number
  }) => {
    if (!map) { return }
    const element = event.target as SVGPathElement
    const rect = element.getBoundingClientRect()
    const x = event.clientX - rect.x;
    const y = event.clientY - rect.y;

    let xScale = (width - 200 * scale) / map.previewXSize / scale / (mapScale ?? 1)
    let yScale = (height + 50 - 50 / scale - yMapOffset * scale) / map.ySize / scale / (mapScale ?? 1)
    if (xScale > 1) { xScale = 1}
    if (yScale > 1) { yScale = 1}

    let xNotMap = (1 - calculated.mapSize.x / rect.width) + xScale
    if (xNotMap > 0.999) { xNotMap = 0.999 }
    let xRelative = (x / rect.width - xNotMap/2) / (1 - xNotMap) 
    if (xRelative < 0) { xRelative = 0 }
    if (xRelative > 1) { xRelative = 1}
    let yNotMap = (1 - calculated.mapSize.y / rect.height) + yScale
    if (yNotMap > 0.999) { yNotMap = 0.999 }
    let yRelative = (y / rect.height - yNotMap/2) / (1 - yNotMap)
    if (yRelative < 0) { yRelative = 0 }
    if (yRelative > 1) { yRelative = 1}
    
    setXOffset(xRelative * (1 - xScale))
    setYOffset(yRelative * (1 - yScale))
  }

  useEffect(() => {
    if (!map || map.preview || preview) { return }

    let xScale = (width - 200 * scale) / map.previewXSize / scale / (mapScale ?? 1)
    let yScale = (height + 50 - 50 / scale - yMapOffset * scale) / map.ySize / scale / (mapScale ?? 1)
    if (xScale > 1) { xScale = 1}
    if (yScale > 1) { yScale = 1}
    if (xOffset > 1 - xScale) { setXOffset(1 - xScale) }
    if (yOffset > 1 - yScale) { setYOffset(1 - yScale) }

    setMinimap(
      <MiniMap map={map} xx={2} yy={5} maxX={width / scale} maxY={height / scale}
                scale={scale} mapScale={mapScale ?? 1} svgRef={svgRef as React.MutableRefObject<HTMLElement>}
                xScale={xScale > 1 ? 1 : xScale} yScale={yScale > 1 ? 1 : yScale}
                xOffset={xOffset} yOffset={yOffset} callback={minimapCallback}
                widthCallback={setReinforcementOffset} />
    )
  }, [map, mapScale, width, height, scale, xOffset, yOffset, map?.game?.lastAction])

  useEffect(() => {
    if (!map || map.debug) { return }
    if (hideCounters || showLos) {
      if (map.game?.gameActionState) {
        map.game.cancelAction()
        clearActionCallback()
      }
      setReinforcementsOverlay(undefined)
    }
  }, [hideCounters, showLos])

  useEffect(() => {
    if (!map?.game) { return }
    map.game.cancelAction()
    clearActionCallback()
    setReinforcementsOverlay(undefined)
  }, [showTerrain])

  useEffect(() => {
    if (!map) { return }
    const hexLoader: JSX.Element[] = []
    const detailLoader: JSX.Element[] = []
    const overlayLoader: JSX.Element[] = []
    map.showCoords = showCoords
    map.showAllCounters = showStatusCounters
    map.hideCounters = hideCounters
    map.mapHexes.forEach((row, y) => {
      row.forEach((hex, x) => {
        hexLoader.push(<MapHex key={`${x}-${y}`} hex={hex} />)
        detailLoader.push(<MapHexDetail key={`${x}-${y}-d`} hex={hex} maxX={width / scale} maxY={height / scale}
                                        selectCallback={hexSelection} showTerrain={showTerrain}
                                        terrainCallback={showTerrain ?
                                          setTerrainInfoOverlay : () => setTerrainInfoOverlay(undefined) }
                                        svgRef={svgRef as React.MutableRefObject<HTMLElement>}
                                        scale={scale} />)
        if (map.game?.gameActionState?.deploy || map.game?.gameActionState?.move) {
          const shaded = openHex(map, x, y)
          overlayLoader.push(<MapHexOverlay key={`${x}-${y}-o`} hex={hex}
                                            selectCallback={hexSelection} shaded={shaded} />)
        }
      })
    })
    setHexDisplay(hexLoader)
    setHexDisplayDetail(detailLoader)
    setHexDisplayOverlays(overlayLoader)
    setCounterDisplay(map.counters.map((counter, i) => {
      return <MapCounter key={i} counter={counter} ovCallback={setOverlay} />
    }))
    setActionCounterDisplay(map.actionCounters.map((counter, i) => {
      return <MapCounter key={i} counter={counter} ovCallback={setOverlay} />
    }))
    setWeather(() =>
      map.preview || preview ? undefined :
        <WeatherDisplay preview={false} map={map} hideCounters={hideCounters}
                        xx={width / scale - 192} yy={2 + map?.yStatusSize + 50 / scale - 50}
                        ovCallback={setOverlay} />
    )
    setScore(() =>
      map.preview || preview ? undefined :
        <ScoreDisplay map={map} xx={width / scale - 192} yy={280 + map?.yStatusSize + 50 / scale - 50}
                      maxX={width / scale} maxY={height / scale} scale={scale} />
    )
    setInitiative(() =>
      map.preview || preview ? undefined :
        <InitiativeDisplay map={map} ovCallback={setOverlay} hideCounters={hideCounters}
                           xx={width / scale - 192} yy={342 + map?.yStatusSize + 50 / scale - 50} />
    )
    setTurn(() =>
      map.preview || preview ? undefined :
        <TurnDisplay xx={width / scale - 102 - (map?.game?.scenario.turns ?? 0) * 90}
                     yy={52 + 50 / scale - 50} hideCounters={hideCounters} map={map}
                     ovCallback={setOverlay}/>
    )
    setSniper(() => {
      const x = width / scale - 384 - (map.game?.scenario.turns ?? 0) * 90
      return map.preview || preview || (!map?.game?.alliedSniper && !map?.game?.axisSniper) ?
        undefined :
        <SniperDisplay xx={x} yy={52 + 50 / scale - 50} hideCounters={hideCounters} map={map}
                       ovCallback={setOverlay}/>
    })
    setReinforcements(() =>
      map.preview || preview ? undefined :
        <Reinforcements map={map} xx={reinforcementOffset} yy={52 + 50 / scale - 50}
                        maxX={width / scale} maxY={height / scale} scale={scale}
                        svgRef={svgRef as React.MutableRefObject<HTMLElement>}
                        callback={showReinforcements} update={{key: true}}/>
    )
    if (map?.game?.closeReinforcementPanel) {
      setReinforcementsOverlay(undefined)
      map.game.closeReinforcementPanel = false
    } else {
      setReinforcementsOverlay(rp => {
        if (!rp) { return undefined }
        const xx = rp.props.xx
        const yy = rp.props.yy
        const player = rp.props.player
        return (
          <ReinforcementPanel map={map} xx={xx} yy={yy} player={player}
                              closeCallback={() => {
                                setReinforcementsOverlay(undefined)
                                map.game?.setReinforcementSelection(1, undefined)
                              }}
                              shifted={rp?.props.shifted ?? false} shiftCallback={shift}
                              ovCallback={setOverlay} forceUpdate={mapUpdate} />
        )
      })
    }
    if (map.game?.openOverlay) {
      setOverlay({ show: true, x: map.game.openOverlay.x, y: map.game.openOverlay.y })
      map.game.openOverlay = undefined
    }
    if (map.game?.closeOverlay) {
      setOverlay({ show: false, x: -1, y: -1 })
      setCounterOverlay(undefined)
      map.game.closeOverlay = false
    }
  }, [
    map, showCoords, showStatusCounters, hideCounters, mapUpdate, showTerrain,
    map?.currentWeather, map?.baseWeather, map?.precip, map?.precipChance,
    map?.windSpeed, map?.windDirection, map?.windVariable, width, height, scale,
    map?.game?.currentPlayer, map?.game?.lastActionIndex, map?.game?.lastAction?.undone,
    map?.game?.initiative, map?.game?.currentPlayer, map?.game?.turn,
    map?.game?.playerOneScore, map?.game?.playerTwoScore, forceUpdate,
    map?.game?.closeReinforcementPanel, map?.game?.gameActionState?.currentAction,
    map?.baseTerrain, map?.night // debugging only, don't change in actual games
  ])

  useEffect(() => {
    if (!map) { return }
    if (overlay.x < 0) { return }
    if (!overlay.show) {
      setLosOverlay(undefined)
      setCounterLosOverlay(undefined)
      setCounterOverlay(undefined)
      return
    }
    const xShift = (map?.previewXSize ?? 1) * xOffset
    const yShift = (map?.ySize ?? 1) * yOffset - 50 / scale + 50
    if (showLos && !overlay.counters) {
      const counters = map.counterDataAt(new Coordinate(overlay.x, overlay.y)).filter(c => !c.u.isFeature)
      if (counters.length < 1) { return }
      if (map.debugLos) { // debugging only, never set in actual games
        setLosOverlay(
          <MapLosDebugOverlay xx={overlay.x} yy={overlay.y} map={map} setOverlay={setOverlay} />
        )
      } else {
        setLosOverlay(
          <MapLosOverlay xx={overlay.x} yy={overlay.y} map={map} setOverlay={setOverlay} />
        )
        setCounterLosOverlay(map.countersAt(new Coordinate(overlay.x, overlay.y)).map((c, i) => 
          <MapCounter key={i} counter={c} ovCallback={() => {}} />
        ))
      }
    } else if (!overlay.counters) {
      setCounterOverlay(
        <MapCounterOverlay xx={overlay.x} yy={overlay.y} map={map} setOverlay={setOverlay}
                           selectionCallback={unitSelection} maxX={width / scale} maxY={height / scale}
                           shiftX={xShift} shiftY={yShift} mapScale={mapScale ?? 1}/>
      )
    } else if (!showLos) {
      setCounterOverlay(
        <MapCounterOverlay counters={overlay.counters} map={map} setOverlay={setOverlay}
                           selectionCallback={unitSelection} maxX={width / scale} maxY={height / scale}
                           shiftX={xShift} shiftY={yShift} mapScale={mapScale ?? 1} />
      )
    }
  }, [overlay.show, overlay.x, overlay.y, overlay.counters, map?.debugLos])

  useEffect(() => {
    setOverlay({ show: false, x: -1, y: -1 })
  }, [showLos])

  useEffect(() => {
    if (!map) { return }
    const lastSigAction = map.game?.lastSignificatAction
    if (map?.game?.gameActionState?.move || (lastSigAction && lastSigAction.data.action === "move")) {
      setMoveTrack(<MoveTrackOverlay map={map} />)
    } else {
      setMoveTrack(undefined)
    }
  }, [map?.game?.lastSignificatAction, mapUpdate, forceUpdate])

  useEffect(() => {
    if (map?.game?.gameActionState?.move) {
      const lastPath = map.game.lastPath as GameActionPath
      const coord = new Coordinate(lastPath.x, lastPath.y)
      if (openHexRotateOpen(map) || map.game.gameActionState.move.rotatingTurret) {
        const hex = map.hexAt(coord)
        setDirectionSelectionOverlay(
          <DirectionSelector hex={hex} selectCallback={directionSelection} />
        )
      } else {
        setDirectionSelectionOverlay(undefined)
      }
    } else if (map?.game?.gameActionState?.deploy) {
      if (map.game.gameActionState.deploy.needsDirection) {
        const [x, y] = map.game.gameActionState.deploy.needsDirection
        setDirectionSelectionOverlay(<DirectionSelector hex={map.hexAt(new Coordinate(x, y))}
                                                        selectCallback={directionSelection} />)
      } else {
        setDirectionSelectionOverlay(undefined)
      }
    } else {
      setDirectionSelectionOverlay(undefined)
    }
  }, [
    map?.game?.gameActionState?.deploy, map?.game?.gameActionState?.deploy?.needsDirection,
    mapUpdate, forceUpdate
  ])

  const shift = () => {
    setReinforcementsOverlay(rp => 
      <ReinforcementPanel map={map} xx={rp?.props.xx} yy={rp?.props.yy} player={rp?.props.player}
                          closeCallback={() => setReinforcementsOverlay(undefined)}
                          shifted={!rp?.props.shifted} shiftCallback={shift}
                          ovCallback={setOverlay} forceUpdate={mapUpdate} />
    )
  }

  const hexSelection = (x: number, y: number) => {
    if (!map) { return }
    if (hexCallback) {
      let doCallback = true
      if (map.game?.gameActionState?.deploy) {
        const counter = map.game.availableReinforcements(map.game.currentPlayer)[
          map.game.turn][map.game.gameActionState.deploy.index]
        if (counter.counter.rotates && !map.game.gameActionState.deploy.needsDirection) {
          map.game.gameActionState.deploy.needsDirection = [x, y]
          const list = map.units[y][x]
          const last = list[list.length - 1] as Unit
          if (last && last.canTow) {
            directionCallback(x, y, normalDir(last.facing + 3))
            doCallback = false
          }
        }
      } else if (map.game?.gameActionState?.move) {
        map.game.move(x, y)
      }
      setMapUpdate(s => s + 1)
      if (doCallback) { hexCallback(x, y) }
    }
  }

  const handleSelect = () => {
    counterCallback()
  }

  const unitSelection = (selection: CounterSelectionTarget) => {
    if (!map) { return }
    if (selection.target.type === "map") {
      select(map, selection, handleSelect)
    } else if (selection.target.type === "reinforcement" && map.game) {
      if (map.game.gameActionState?.deploy &&
          map.game.gameActionState.deploy.index !== selection.target.index) {
        map.game.gameActionState.deploy.needsDirection = undefined
      }
      const player = selection.target.player
      map.game.setReinforcementSelection(player, {
        turn: selection.target.turn,
        index: selection.target.index,
      })
      const x = reinforcementsOverlay?.props.xx
      const y = reinforcementsOverlay?.props.yy
      setReinforcementsOverlay(rp =>
        <ReinforcementPanel map={map} xx={x} yy={y} player={player}
                            closeCallback={() => {
                              setReinforcementsOverlay(undefined)
                              map.game?.setReinforcementSelection(1, undefined)
                            }}
                            shifted={rp?.props.shifted ?? false} shiftCallback={shift}
                            ovCallback={setOverlay} forceUpdate={mapUpdate} />
      )
    }
    setMapUpdate(s => s + 1)
  }

  const directionSelection = (x: number, y: number, d: Direction) => {
    if (!map) { return }
    directionCallback(x, y, d)
    if (map.game?.gameActionState?.deploy || map.game?.gameActionState?.move) {
      setMapUpdate(s => s+1)
    }
  }

  const showReinforcements = (x: number, y: number, player: Player) => {
    resetCallback()
    setReinforcementsOverlay(rp => {
      if (!rp || rp.props.player !== player) {
        return (
          <ReinforcementPanel map={map} xx={x-10} yy={y-10} player={player}
                              closeCallback={() => setReinforcementsOverlay(undefined)}
                              shifted={false} shiftCallback={shift}
                              ovCallback={setOverlay} forceUpdate={mapUpdate} />
        )
      } else {
        return undefined
      }
    }
    )
  }

  const mapDisplay = () => {
    if (map?.preview || preview) {
      return (
        <g>
          {hexDisplay}
          {hexDisplayDetail}
          {counterDisplay}
        </g>
      )
    } else {
      let mWidth = width / scale - 202
      let mHeight = height / scale - yMapOffset - 50 / scale + 50
      if (map) {
        if (mWidth > map.previewXSize) { mWidth = map.previewXSize }
        if (mHeight > map.ySize) { mHeight = map.ySize }
      }
      const xShift = (map?.previewXSize ?? 1) * xOffset
      const yShift = (map?.ySize ?? 1) * yOffset
      const action = !!map?.game?.gameActionState
      return (
        <svg x={0} y={yMapOffset + 50 / scale - 50} width={mWidth} height={mHeight}
             viewBox={`${xShift} ${yShift} ${mWidth / (mapScale ?? 1)} ${mHeight / (mapScale ?? 1)}`}>
          {hexDisplay}
          {hexDisplayDetail}
          {counterDisplay}
          {losOverlay}
          {counterLosOverlay}
          {action ? hexDisplayOverlays : ""}
          {actionCounterDisplay}
          {moveTrack}
          {directionSelectionOverlay}
        </svg>
      )
    }
  }

  return (
    <svg ref={svgRef as React.LegacyRef<SVGSVGElement>}
         className="map-svg" width={width} height={height}
         viewBox={`0 0 ${width / scale} ${height / scale}`}>
      <MapHexPatterns />
      {mapDisplay()}
      {weather}
      {initiative}
      {score}
      {turn}
      {sniper}
      {reinforcements}
      {reinforcementsOverlay}
      {minimap}
      {counterOverlay}
      {terrainInfoOverlay}
      {notification}
    </svg>
  )
}
