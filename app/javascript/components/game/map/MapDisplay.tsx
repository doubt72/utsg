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
import select from "../../../engine/control/select";
import Unit from "../../../engine/Unit";
import { GameActionPath } from "../../../engine/GameAction";
import FireTrackOverlay from "./FireTrackOverlay";
import FireHindranceOverlay from "./FireHindranceOverlay";
import MapTargetHexSelection from "./MapTargetHexSelection";
import Hex from "../../../engine/Hex";
import RoutTrackOverlay from "./RoutTrackOverlay";
import { stateType } from "../../../engine/control/state/BaseState";
import DeployState from "../../../engine/control/state/DeployState";

interface MapDisplayProps {
  map: Map;
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
  directionCallback?: (d: Direction) => void;
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
    show: boolean, x: number, y: number, counters?: Counter[],
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
  const [fireTrack, setFireTrack] = useState<JSX.Element | undefined>()
  const [fireTargets, setFireTargets] = useState<JSX.Element[]>([])
  const [fireHindrance, setFireHindrance] = useState<JSX.Element | undefined>()
  const [routTrack, setRoutTrack] = useState<JSX.Element | undefined>()

  const [notification, setNotification] = useState<JSX.Element | undefined>()
  const [notificationDetails, setNotificationDetails] = useState<{
    error: string, timer: number
  }>({ error: "", timer: 0 })

  const checkMin = (m?: Map): boolean => {
    if (!m) { return false }
    const turn = m?.game?.turn ?? 0
    const turns = m?.game?.scenario.turns ?? 1
    return turn > 2 && turn < turns - 2
  }

  const minHeight = (height: number, scale: number = 1, m?: Map) => {
    if (preview || m?.preview) { return map.ySize * scale }
    const gc = guiCollapse ? 178 : 0
    const fill = m?.debug ? 16 : 408 - gc
    const available = 1144 + 50 / scale - 50
    return height - fill < available * scale ? available * scale : height - fill
  }

  const minWidth = (width: number, scale: number = 1, m?: Map) => {
    if (preview || m?.preview) { return map.xSize * scale }
    let min = 1274
    if (checkMin(m)) { min += 15 }
    if (m?.game?.alliedSniper || m?.game?.axisSniper) { min += 280 }
    return width - 24 < min * scale ? min * scale : width - 24
  }

  const [width, setWidth] = useState<number>(minWidth(window.innerWidth, 1, map))
  const [height, setHeight] = useState<number>(minHeight(window.innerHeight, 1, map))

  // IDEK what I'm doing with types here
  const svgRef = useRef<HTMLElement | SVGSVGElement>()

  useEffect(() => {
    if (!map.game) { return }
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
    const x = (map.previewXSize * (mapScale ?? 1) - 76 < width / scale - 216 ?
              map.previewXSize * (mapScale ?? 1) - 76 : width / scale - 216) - twidth
    const y = 50 + map.yStatusSize + 50 / scale - 50
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
    if (!map.game || map.game.messageQueue.length < 1) { return }
    if (notificationDetails.timer < 1) {
      setNotificationDetails({ error: map.game.getMessage() as string, timer: 200 })
    }
  }, [map.game?.messageQueue.length])

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
    if (map.preview || preview) { return }

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
  }, [map, mapScale, width, height, scale, xOffset, yOffset, map.game?.lastAction])

  useEffect(() => {
    if (map.debug) { return }
    if (hideCounters || showLos) {
      if (map.game?.gameState) {
        map.game.cancelAction()
        clearActionCallback()
      }
      setReinforcementsOverlay(undefined)
    }
  }, [hideCounters, showLos])

  useEffect(() => {
    if (!map.game) { return }
    map.game.cancelAction()
    clearActionCallback()
    setReinforcementsOverlay(undefined)
  }, [showTerrain])

  useEffect(() => {
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
        const state = map.game?.gameState
        if (state) {
          const shaded = state.openHex(x, y)
          overlayLoader.push(<MapHexOverlay key={`${x}-${y}-o`} hex={hex}
                                            selectCallback={hexSelection} shaded={shaded} />)
        }
      })
    })
    setHexDisplay(hexLoader)
    setHexDisplayDetail(detailLoader)
    setHexDisplayOverlays(overlayLoader)
    if (map.game?.gameState?.type === stateType.Fire) {
      const hexes: JSX.Element[] = []
      for (const c of map.game.fireState.targetHexes) {
        const target = map.units[c.y][c.x].length < 1
        const hex = map.hexAt(c) as Hex
        hexes.push(<MapTargetHexSelection key={`${c.y}-${c.x}`} hex={hex} target={target} active={true} />)
      }
      setFireTargets(hexes)
    } else if (map.game?.lastSignificantAction?.data.fire_data) {
      const hexes: JSX.Element[] = []
      for (const c of map.game.lastSignificantAction.data.fire_data.final) {
        const target = map.units[c.y][c.x].length < 1
        const hex = map.hexAt(new Coordinate(c.x, c.y)) as Hex
        hexes.push(<MapTargetHexSelection key={`${c.y}-${c.x}`} hex={hex} target={target} active={false} />)
      }
      setFireTargets(hexes)
    } else {
      setFireTargets([])
    }
    setCounterDisplay(map.counters.map((counter, i) => {
      return <MapCounter key={i} counter={counter} ovCallback={setOverlay} />
    }))
    if (map.game?.gameState) {
      setActionCounterDisplay(map.game.gameState.activeCounters.map((counter, i) => {
        return <MapCounter key={i} counter={counter} ovCallback={setOverlay} />
      }))
    } else {
      setActionCounterDisplay([])
    }
    setWeather(() =>
      map.preview || preview ? undefined :
        <WeatherDisplay preview={false} map={map} hideCounters={hideCounters}
                        xx={width / scale - 192} yy={52 + 50 / scale - 50}
                        ovCallback={setOverlay} />
    )
    setScore(() =>
      map.preview || preview ? undefined :
        <ScoreDisplay map={map} xx={width / scale - 192} yy={330 + 50 / scale - 50}
                      maxX={width / scale} maxY={height / scale} scale={scale} />
    )
    setInitiative(() =>
      map.preview || preview ? undefined :
        <InitiativeDisplay map={map} ovCallback={setOverlay} hideCounters={hideCounters}
                           xx={width / scale - 192} yy={392 + 50 / scale - 50} />
    )
    setTurn(() =>
      map.preview || preview ? undefined :
        <TurnDisplay xx={width / scale - 677 - (checkMin(map) ? 15 : 0)}
                     yy={52 + 50 / scale - 50} hideCounters={hideCounters} map={map}
                     ovCallback={setOverlay}/>
    )
    setSniper(() => {
      const x = width / scale - 959 - (checkMin(map) ? 15 : 0)
      return map.preview || preview || (!map.game?.alliedSniper && !map.game?.axisSniper) ?
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
    if (map.game?.closeReinforcementPanel) {
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
                                if (map.game) {
                                  map.game.gameState = undefined
                                }
                              }}
                              shifted={rp?.props.shifted ?? false} shiftCallback={shift}
                              ovCallback={setOverlay} forceUpdate={mapUpdate} />
        )
      })
    }
    if (map.game?.openOverlay) {
      setOverlay({
        show: true, x: map.game.openOverlay.coord.x, y: map.game.openOverlay.coord.y,
      })
      map.game.openOverlay = undefined
    }
    if (map.game?.closeOverlay) {
      setOverlay({ show: false, x: -1, y: -1 })
      setCounterOverlay(undefined)
      map.game.closeOverlay = false
    }
  }, [
    map, showCoords, showStatusCounters, hideCounters, mapUpdate, showTerrain,
    map.currentWeather, map.baseWeather, map.precip, map.precipChance,
    map.windSpeed, map.windDirection, map.windVariable, width, height, scale,
    map.game?.currentPlayer, map.game?.lastActionIndex, map.game?.lastAction?.undone,
    map.game?.initiative, map.game?.currentPlayer, map.game?.turn,
    map.game?.playerOneScore, map.game?.playerTwoScore, forceUpdate,
    map.game?.closeReinforcementPanel, map.game?.gameState?.type,
    map.baseTerrain, map.night // debugging only, don't change in actual games
  ])

  useEffect(() => {
    if (overlay.x < 0) { return }
    if (!overlay.show) {
      setLosOverlay(undefined)
      setCounterLosOverlay(undefined)
      setCounterOverlay(undefined)
      return
    }
    const xShift = (map.previewXSize ?? 1) * xOffset
    const yShift = (map.ySize ?? 1) * yOffset - 50 / scale + 50
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
                           shiftX={xShift} shiftY={yShift} mapScale={mapScale ?? 1} scale={scale}
                           svgRef={svgRef as React.MutableRefObject<HTMLElement>} />
      )
    } else if (!showLos) {
      setCounterOverlay(
        <MapCounterOverlay counters={overlay.counters} map={map} setOverlay={setOverlay}
                           selectionCallback={unitSelection} maxX={width / scale} maxY={height / scale}
                           shiftX={xShift} shiftY={yShift} mapScale={mapScale ?? 1} scale={scale}
                           svgRef={svgRef as React.MutableRefObject<HTMLElement>} />
      )
    }
  }, [overlay.show, overlay.x, overlay.y, overlay.counters, map.debugLos])

  useEffect(() => {
    setOverlay({ show: false, x: -1, y: -1 })
  }, [showLos])

  useEffect(() => {
    const lastSigAction = map.game?.lastSignificantAction
    if (map.game?.gameState?.type === stateType.Move || map.game?.gameState?.type === stateType.Assault ||
        (lastSigAction &&
         ["move", "rush", "assault_move", "rout_move", "rout_self"].includes(lastSigAction.data.action))) {
      setMoveTrack(<MoveTrackOverlay map={map} />)
    } else {
      setMoveTrack(undefined)
    }
    if (map.game?.gameState?.type === stateType.Fire ||
        (lastSigAction && ["fire"].includes(lastSigAction.data.action))) {
      setFireTrack(<FireTrackOverlay map={map} />)
      if (map.game?.gameState?.type === stateType.Fire && map.game.fireState.targetHexes.length > 0) {
        setFireHindrance(<FireHindranceOverlay map={map} />)
      } else {
        setFireHindrance(undefined)
      }
    } else {
      setFireTrack(undefined)
      setFireHindrance(undefined)
    }
    if (map.game?.gameState?.type === stateType.Rout) {
      setRoutTrack(<RoutTrackOverlay map={map} />)
    } else {
      setRoutTrack(undefined)
    }
  }, [map.game?.lastSignificantAction, mapUpdate, forceUpdate, map.game?.gameState])

  useEffect(() => {
    if (map.game?.gameState?.type === stateType.Move &&
        (map.game.moveState.rotateOpen || map.game.moveState.rotatingTurret)) {
      const lastPath = map.game.moveState.lastPath as GameActionPath
      const coord = new Coordinate(lastPath.x, lastPath.y)
      setDirectionSelectionOverlay(
        <DirectionSelector hex={map.hexAt(coord)} selectCallback={directionSelection} />
      )
    } else if (map.game?.gameState?.type === stateType.Assault && map.game.assaultState.rotateOpen) {
      const lastPath = map.game.assaultState.lastPath as GameActionPath
      const coord = new Coordinate(lastPath.x, lastPath.y)
      setDirectionSelectionOverlay(
        <DirectionSelector hex={map.hexAt(coord)} selectCallback={directionSelection} />
      )
    } else if (map.game?.gameState?.type === stateType.Fire && map.game.fireState.rotateOpen) {
      const lastPath = map.game.fireState.lastPath as GameActionPath
      const coord = new Coordinate(lastPath.x, lastPath.y)
      setDirectionSelectionOverlay(
        <DirectionSelector hex={map.hexAt(coord)} selectCallback={directionSelection} />
      )
    } else if (map.game?.gameState?.type === stateType.Deploy) {
      if (map.game.deployState.needsDirection) {
        const loc = map.game.deployState.location as Coordinate
        setDirectionSelectionOverlay(<DirectionSelector hex={map.hexAt(loc)}
                                                        selectCallback={directionSelection} />)
      } else {
        setDirectionSelectionOverlay(undefined)
      }
    } else {
      setDirectionSelectionOverlay(undefined)
    }
  }, [
    map.game?.gameState, mapUpdate, forceUpdate, map.game?.deployState?.needsDirection,
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
    if (hexCallback) {
      let doCallback = true
      if (map.game?.gameState?.type === stateType.Deploy) {
        const counter = map.game.availableReinforcements(map.game.currentPlayer)[
          map.game.turn][map.game.deployState.index]
        if (counter.counter.rotates && !map.game.deployState.needsDirection) {
          map.game.deployState.needsDirection = true
          map.game.deployState.toHex(x, y)
          const list = map.units[y][x]
          const last = list[list.length - 1] as Unit
          if (last && last.canTow) {
            directionCallback(normalDir(last.facing + 3))
            doCallback = false
          }
        }
      } else if (map.game?.gameState?.type === stateType.Move) {
        map.game.moveState.move(x, y)
      } else if (map.game?.gameState?.type === stateType.Assault) {
        map.game.assaultState.move(x, y)
      } else if (map.game?.gameState?.type === stateType.Fire) {
        map.game.fireState.toHex(x, y)
      } else if (map.game?.gameState?.type === stateType.Rout) {
        map.game.routState.finishXY(x, y)
      }
      setMapUpdate(s => s + 1)
      if (doCallback) { hexCallback(x, y) }
    }
  }

  const handleSelect = () => {
    counterCallback()
  }

  const unitSelection = (selection: CounterSelectionTarget) => {
    if (selection.target.type === "map") {
      select(map, selection, handleSelect)
    } else if (selection.target.type === "reinforcement" && map.game) {
      if (map.game.gameState?.type === stateType.Deploy &&
          map.game.deployState.index !== selection.target.index) {
        map.game.deployState.needsDirection = false
      }
      const player = selection.target.player
      map.game.gameState = new DeployState(map.game, selection.target.turn, selection.target.index)
      const x = reinforcementsOverlay?.props.xx
      const y = reinforcementsOverlay?.props.yy
      setReinforcementsOverlay(rp =>
        <ReinforcementPanel map={map} xx={x} yy={y} player={player}
                            closeCallback={() => {
                              setReinforcementsOverlay(undefined)
                              if (map.game) {
                                map.game.gameState = undefined
                              }
                            }}
                            shifted={rp?.props.shifted ?? false} shiftCallback={shift}
                            ovCallback={setOverlay} forceUpdate={mapUpdate} />
      )
    }
    setMapUpdate(s => s + 1)
  }

  const directionSelection = (d: Direction) => {
    directionCallback(d)
    if (map.game?.gameState?.type === stateType.Deploy || map.game?.gameState?.type === stateType.Fire ||
        map.game?.gameState?.type === stateType.Move || map.game?.gameState?.type === stateType.Assault) {
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
    if (map.preview || preview) {
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
      const xShift = (map.previewXSize ?? 1) * xOffset
      const yShift = (map.ySize ?? 1) * yOffset
      return (
        <svg x={0} y={yMapOffset + 50 / scale - 50} width={mWidth} height={mHeight}
             viewBox={`${xShift} ${yShift} ${mWidth / (mapScale ?? 1)} ${mHeight / (mapScale ?? 1)}`}>
          {hexDisplay}
          {hexDisplayDetail}
          {fireTargets}
          {fireTrack}
          {counterDisplay}
          {losOverlay}
          {counterLosOverlay}
          { map.game?.gameState?.showOverlays ? hexDisplayOverlays : "" }
          { map.game?.gameState?.showOverlays ? actionCounterDisplay : "" }
          {moveTrack}
          {routTrack}
          {fireHindrance}
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
