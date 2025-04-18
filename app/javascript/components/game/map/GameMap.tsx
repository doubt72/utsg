import React, { useEffect, useRef, useState } from "react";
import MapHexPatterns from "./MapHexPatterns";
import MapHex from "./MapHex";
import MapHexOverlay from "./MapHexOverlay";
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
import { Coordinate, Player } from "../../../utilities/commonTypes";

interface GameMapProps {
  map: Map;
  scale: number;
  showCoords?: boolean;
  showStatusCounters?: boolean;
  showLos?: boolean;
  hideCounters?: boolean;
  showTerrain?: boolean;
  hexCallback?: (x: number, y: number, sel: boolean) => void;
  counterCallback?: (x: number, y: number, counter: Counter) => void;
}

export default function GameMap({
  map, scale, showCoords = false, showStatusCounters = false, showLos = false,
  hideCounters = false, showTerrain = false,
  hexCallback = () => {}, counterCallback = () => {}
}: GameMapProps) {
  const [hexDisplay, setHexDisplay] = useState<JSX.Element[]>([])
  const [hexDisplayOverlays, setHexDisplayOverlays] = useState<JSX.Element[]>([])
  const [counterDisplay, setCounterDisplay] = useState<JSX.Element[]>([])
  const [overlay, setOverlay] = useState<{
    show: boolean, x: number, y: number, counters?: Counter[]
  }>({ show: false, x: -1, y: -1 })
  const [overlayDisplay, setOverlayDisplay] = useState<JSX.Element | undefined>()
  const [updateUnitSelected, setUpdateUnitSelected] = useState(0)
  const [counterLosOverlay, setCounterLosOverlay] = useState<JSX.Element[] | undefined>()
  const [terrainInfoOverlay, setTerrainInfoOverlay] = useState<JSX.Element | undefined>()
  const [reinforcementsOverlay, setReinforcementsOverlay] = useState<JSX.Element | undefined>()

  const [weather, setWeather] = useState<JSX.Element | undefined>()
  const [initiative, setInitiative] = useState<JSX.Element | undefined>()
  const [score, setScore] = useState<JSX.Element | undefined>()
  const [turn, setTurn] = useState<JSX.Element | undefined>()
  const [sniper, setSniper] = useState<JSX.Element | undefined>()
  const [reinforcements, setReinforcements] = useState<JSX.Element | undefined>()

  // IDEK what I'm doing with types here
  const svgRef = useRef<HTMLElement | SVGSVGElement>()

  useEffect(() => {
    if (!map) { return }
    const hexLoader: JSX.Element[] = []
    const overlayLoader: JSX.Element[] = []
    map.showCoords = showCoords
    map.showAllCounters = showStatusCounters
    map.hideCounters = hideCounters
    map.mapHexes.forEach((row, y) => {
      row.forEach((hex, x) => {
        hexLoader.push(<MapHex key={`${x}-${y}`} hex={hex} />)
        overlayLoader.push(<MapHexOverlay key={`${x}-${y}-o`} hex={hex} selected={false}
                                          selectCallback={hexSelection} showTerrain={showTerrain}
                                          terrainCallback={showTerrain ?
                                            setTerrainInfoOverlay : () => setTerrainInfoOverlay(undefined) }
                                          svgRef={svgRef as React.MutableRefObject<HTMLElement>} />)
      })
    })
    setHexDisplay(hexLoader)
    setHexDisplayOverlays(overlayLoader)
    setCounterDisplay(map.counters.map((counter, i) => {
      return <MapCounter key={i} counter={counter} ovCallback={setOverlay} />
    }))
    setWeather(() =>
      map?.preview ? undefined :
        <WeatherDisplay preview={false} map={map} hideCounters={hideCounters}
                        xx={(map?.xSize || 0) - 192} yy={2 + map?.yStatusSize}
                        ovCallback={setOverlay} />
    )
    setScore(() =>
      map?.preview ? undefined :
        <ScoreDisplay map={map} xx={(map?.xSize || 0) - 192} yy={280  + map?.yStatusSize}/>
    )
    setInitiative(() =>
      map?.preview ? undefined :
        <InitiativeDisplay map={map} ovCallback={setOverlay} hideCounters={hideCounters}
                           xx={(map?.xSize || 0) - 192} yy={342 + map?.yStatusSize} />
    )
    setTurn(() =>
      map?.preview ? undefined :
        <TurnDisplay xx={(map?.xSize || 0) - 102 - (map?.game?.scenario.turns ?? 0) * 90}
                     yy={2} hideCounters={hideCounters} map={map} ovCallback={setOverlay}/>
    )
    setSniper(() =>
      map?.preview || (!map?.game?.alliedSniper && !map?.game?.axisSniper) ? undefined :
        <SniperDisplay xx={260} yy={2} hideCounters={hideCounters} map={map}
                       ovCallback={setOverlay}/>
    )
    setReinforcements(() =>
      map?.preview ? undefined :
        <Reinforcements xx={2} yy={2} map={map} callback={showReinforcements}/>
    )
  }, [
    map, showCoords, showStatusCounters, hideCounters, updateUnitSelected,
    showTerrain,
    map?.currentWeather, map?.baseWeather, map?.precip, map?.precipChance,
    map?.windSpeed, map?.windDirection, map?.windVariable,
    map?.game?.initiative, map?.game?.initiativePlayer, map?.game?.turn,
    map?.game?.playerOneScore, map?.game?.playerTwoScore,
    map?.baseTerrain, map?.night // debugging only, don't change in actual games
  ])

  useEffect(() => {
    if (overlay.x < 0) { return }
    if (!overlay.show) {
      setOverlayDisplay(undefined)
      setCounterLosOverlay(undefined)
      return
    }
    if (showLos && !overlay.counters) {
      const counters = map.counterDataAt(new Coordinate(overlay.x, overlay.y)).filter(c => !c.u.isFeature)
      if (counters.length < 1) { return }
      if (map.debug) { // debugging only, never set in actual games
        setOverlayDisplay(
          <MapLosDebugOverlay xx={overlay.x} yy={overlay.y} map={map} setOverlay={setOverlay} />
        )
      } else {
        setOverlayDisplay(
          <MapLosOverlay xx={overlay.x} yy={overlay.y} map={map} setOverlay={setOverlay} />
        )
        setCounterLosOverlay(map.countersAt(new Coordinate(overlay.x, overlay.y)).map((c, i) => 
          <MapCounter key={i} counter={c} ovCallback={() => {}} />
        ))
      }
    } else if (!overlay.counters) {
      setOverlayDisplay(
        <MapCounterOverlay xx={overlay.x} yy={overlay.y} map={map} setOverlay={setOverlay}
                           selectionCallback={unitSelection} />
      )
    } else if (!showLos) {
      setOverlayDisplay(
        <MapCounterOverlay counters={overlay.counters} map={map} setOverlay={setOverlay}
                           selectionCallback={unitSelection} />
      )
    }
  }, [overlay.show, overlay.x, overlay.y, overlay.counters])

  useEffect(() => {
    setOverlay({ show: false, x: -1, y: -1 })
  }, [showLos])

  const hexSelection = (x: number, y: number) => {
    const key = `${x}-${y}`
    setHexDisplayOverlays(overlays =>
      overlays.map(h => {
        if (h.key === `${key}-o`) {
          if (hexCallback) {
            hexCallback(x, y, !h.props.selected)
          }
          return <MapHexOverlay key={`${x}-${y}-o`} hex={h.props.hex} selected={!h.props.selected}
                                selectCallback={hexSelection} showTerrain={showTerrain}
                                terrainCallback={setTerrainInfoOverlay}
                                svgRef={svgRef as React.MutableRefObject<HTMLElement>} />
        } else {
          return h
        }
      })
    )
  }

  const unitSelection = (x: number, y: number, counter: Counter) => {
    if (counter.trueIndex === undefined) { return }
    map.units[y][x][counter.trueIndex].select()
    setUpdateUnitSelected(s => s+1)
    counterCallback(x, y, counter)
  }

  const showReinforcements = (x: number, y: number, player: Player) => {
    setReinforcementsOverlay(
      <ReinforcementPanel map={map} xx={x-10} yy={y-10} player={player}
                          leaveCallback={() => setReinforcementsOverlay(undefined)}/>
    )
  }

  return (
    <svg ref={svgRef as React.LegacyRef<SVGSVGElement>}
         className="map-svg" width={(map?.xSize || 1) * (scale || 1)}
         height={(map?.ySize || 1) * (scale || 1)}
         viewBox={`0 0 ${map?.xSize || 1} ${map?.ySize || 1}`}>
      <MapHexPatterns />
      {hexDisplay}
      {hexDisplayOverlays}
      {weather}
      {initiative}
      {score}
      {turn}
      {sniper}
      {reinforcements}
      {counterDisplay}
      {overlayDisplay}
      {counterLosOverlay}
      {terrainInfoOverlay}
      {reinforcementsOverlay}
    </svg>
  )
}
