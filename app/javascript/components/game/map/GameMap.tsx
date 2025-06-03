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
import { yMapOffset } from "../../../utilities/graphics";
import { normalDir } from "../../../utilities/utilities";

interface GameMapProps {
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
  hexCallback?: (x: number, y: number) => void;
  counterCallback?: (x: number, y: number, counter: Counter) => void;
  directionCallback?: (x: number, y: number, d: Direction) => void;
  resetCallback?: () => void;
}

export default function GameMap({
  map, scale, mapScale, showCoords = false, showStatusCounters = false, showLos = false,
  hideCounters = false, showTerrain = false, preview, guiCollapse = false,
  hexCallback = () => {}, counterCallback = () => {}, directionCallback = () => {}, resetCallback = () => {}
}: GameMapProps) {
  const [hexDisplay, setHexDisplay] = useState<JSX.Element[]>([])
  const [hexDisplayDetail, setHexDisplayDetail] = useState<JSX.Element[]>([])
  const [hexDisplayOverlays, setHexDisplayOverlays] = useState<JSX.Element[]>([])
  const [counterDisplay, setCounterDisplay] = useState<JSX.Element[]>([])
  const [overlay, setOverlay] = useState<{
    show: boolean, x: number, y: number, counters?: Counter[]
  }>({ show: false, x: -1, y: -1 })
  const [updateUnitshaded, setUpdateUnitshaded] = useState(0)
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

  const minHeight = (height: number, scale: number = 1, m?: Map) => {
    if (preview || m?.preview) { return map.ySize * scale }
    const gc = guiCollapse ? 178 : 0
    const fill = m?.debug ? 16 : 408 - gc
    const available = 1254 + 50 / scale - 50
    return height - fill < available * scale ? available * scale : height - fill
  }
  const minWidth = (width: number, scale: number = 1, m?: Map) => {
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
    if (!map || map.preview || preview) { return }

    let xScale = (width - 200 * scale) / map.previewXSize / scale / (mapScale ?? 1)
    let yScale = (height + 50 - 50 / scale - yMapOffset * scale) / map.ySize / scale / (mapScale ?? 1)
    if (xScale > 1) { xScale = 1}
    if (yScale > 1) { yScale = 1}
    if (xOffset > 1 - xScale) { setXOffset(1 - xScale) }
    if (yOffset > 1 - yScale) { setYOffset(1 - yScale) }

    setMinimap(<MiniMap map={map} xx={2} yy={5} scale={scale} mapScale={mapScale ?? 1}
                        xScale={xScale > 1 ? 1 : xScale} yScale={yScale > 1 ? 1 : yScale}
                        xOffset={xOffset} yOffset={yOffset} callback={minimapCallback}
                        widthCallback={setReinforcementOffset} />)
  }, [map, mapScale, width, height, scale, xOffset, yOffset, map?.game?.lastMove])

  useEffect(() => {
    if (!map || map.debug) { return }
    if (hideCounters || showLos) {
      if (map.game?.reinforcementSelection) {
        map.game.reinforcementSelection = undefined
      }
      setReinforcementsOverlay(undefined)
    }
  }, [hideCounters, showLos])

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
        detailLoader.push(<MapHexDetail key={`${x}-${y}-d`} hex={hex}
                                        selectCallback={hexSelection} showTerrain={showTerrain}
                                        terrainCallback={showTerrain ?
                                          setTerrainInfoOverlay : () => setTerrainInfoOverlay(undefined) }
                                        svgRef={svgRef as React.MutableRefObject<HTMLElement>}
                                        scale={scale} />)
        if (map.game?.reinforcementSelection) {
          const shaded = map.openHex(x, y)
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
    setWeather(() =>
      map.preview || preview ? undefined :
        <WeatherDisplay preview={false} map={map} hideCounters={hideCounters}
                        xx={width / scale - 192} yy={2 + map?.yStatusSize + 50 / scale - 50}
                        ovCallback={setOverlay} />
    )
    setScore(() =>
      map.preview || preview ? undefined :
        <ScoreDisplay map={map} xx={width / scale - 192} yy={280 + map?.yStatusSize + 50 / scale - 50}/>
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
        <Reinforcements xx={reinforcementOffset} yy={52 + 50 / scale - 50} map={map}
                        callback={showReinforcements} update={{key: true}}/>
    )
    setDirectionSelectionOverlay(() => {
      if (!map.game?.reinforcementNeedsDirection || !map.game.reinforcementSelection) {
        return undefined
      }
      const [x, y] = map.game.reinforcementNeedsDirection
      return <DirectionSelector hex={map.hexAt(new Coordinate(x, y))}
                                selectCallback={directionSelection} />
    })
    updateReinforcementOverlays()
  }, [
    map, showCoords, showStatusCounters, hideCounters, updateUnitshaded, showTerrain,
    map?.currentWeather, map?.baseWeather, map?.precip, map?.precipChance,
    map?.windSpeed, map?.windDirection, map?.windVariable, width, height, scale,
    map?.game?.currentPlayer, map?.game?.lastMoveIndex, map?.game?.lastMove?.undone,
    map?.game?.initiative, map?.game?.initiativePlayer, map?.game?.turn,
    map?.game?.playerOneScore, map?.game?.playerTwoScore,
    map?.game?.reinforcementSelection, map?.game?.reinforcementNeedsDirection,
    map?.baseTerrain, map?.night // debugging only, don't change in actual games
  ])

  useEffect(() => {
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

  const shift = () => {
    setReinforcementsOverlay(rp => 
      <ReinforcementPanel map={map} xx={rp?.props.xx} yy={rp?.props.yy} player={rp?.props.player}
                          closeCallback={() => setReinforcementsOverlay(undefined)}
                          shifted={!rp?.props.shifted}
                          shiftCallback={shift}
                          ovCallback={setOverlay}/>
    )
  }

  const updateReinforcementOverlays = () => {
    setReinforcements(r => {
      if (r) { r.props.update.key = !r.props.update.key }
      return r
    })
    setReinforcementsOverlay(rp => {
      if (!rp) { return undefined }
      const xx = rp.props.xx
      const yy = rp.props.yy
      const player = rp.props.player
      const key = Number(rp.key)
      return (
        <ReinforcementPanel key={key + 1} map={map} xx={xx} yy={yy} player={player}
                            closeCallback={() => {
                              setReinforcementsOverlay(undefined)
                              map.game?.setReinforcementSelection(undefined)
                            }}
                            shifted={rp?.props.shifted ?? false}
                            shiftCallback={shift} ovCallback={setOverlay}/>
      )
    })
  }

  const hexSelection = (x: number, y: number) => {
    if (hexCallback) {
      let doCallback = true
      if (map.game?.reinforcementSelection) {
        const counter = map.game.availableReinforcements(map.game.currentPlayer)[
          map.game.turn][map.game.reinforcementSelection.index]
        if (counter.counter.rotates && !map.game.reinforcementNeedsDirection) {
          map.game.reinforcementNeedsDirection = [x, y]
          const list = map.units[y][x]
          const last = list[list.length - 1]
          if (last && last.canTow) {
            directionCallback(x, y, normalDir(last.facing + 3))
            doCallback = false
          }
        }
      }
      if (doCallback) { hexCallback(x, y) }
    }
    updateReinforcementOverlays()
  }

  const unitSelection = (selection: CounterSelectionTarget) => {
    if (selection.target.type === "map") {
      map.selectUnit(selection, counterCallback)
    } else if (selection.target.type === "reinforcement" && map.game) {
      if (map.game.reinforcementSelection?.index !== selection.target.index) {
        map.game.reinforcementNeedsDirection = undefined
      }
      const player = selection.target.player
      map.game.setReinforcementSelection({
        player: player,
        turn: selection.target.turn,
        index: selection.target.index,
      })
      const x = reinforcementsOverlay?.props.xx
      const y = reinforcementsOverlay?.props.yy
      setReinforcementsOverlay(rp =>
        <ReinforcementPanel map={map} xx={x} yy={y} player={player}
                            closeCallback={() => {
                              setReinforcementsOverlay(undefined)
                              map.game?.setReinforcementSelection(undefined)
                            }}
                            shifted={rp?.props.shifted ?? false}
                            shiftCallback={shift}
                            ovCallback={setOverlay}/>
      )
    }
    setUpdateUnitshaded(s => s + 1)
  }

  const directionSelection = (x: number, y: number, d: Direction) => {
    directionCallback(x, y, d)
    updateReinforcementOverlays()
  }

  const showReinforcements = (x: number, y: number, player: Player) => {
    resetCallback()
    setReinforcementsOverlay(rp => {
      if (!rp || rp.props.player !== player) {
        return (
          <ReinforcementPanel map={map} xx={x-10} yy={y-10} player={player}
                              closeCallback={() => setReinforcementsOverlay(undefined)}
                              shifted={false} shiftCallback={shift}
                              ovCallback={setOverlay}/>
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
      return (
        <svg x={0} y={yMapOffset + 50 / scale - 50} width={mWidth} height={mHeight}
             viewBox={`${xShift} ${yShift} ${mWidth / (mapScale ?? 1)} ${mHeight / (mapScale ?? 1)}`}>
          {hexDisplay}
          {hexDisplayDetail}
          {counterDisplay}
          {losOverlay}
          {counterLosOverlay}
          {hexDisplayOverlays}
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
    </svg>
  )
}
