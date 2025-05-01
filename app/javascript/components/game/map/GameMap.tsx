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

interface GameMapProps {
  map: Map;
  scale: number;
  showCoords?: boolean;
  showStatusCounters?: boolean;
  showLos?: boolean;
  hideCounters?: boolean;
  showTerrain?: boolean;
  hexCallback?: (x: number, y: number) => void;
  counterCallback?: (x: number, y: number, counter: Counter) => void;
  directionCallback?: (x: number, y: number, d: Direction) => void;
  resetCallback?: () => void;
}

export default function GameMap({
  map, scale, showCoords = false, showStatusCounters = false, showLos = false,
  hideCounters = false, showTerrain = false,
  hexCallback = () => {}, counterCallback = () => {}, directionCallback = () => {}, resetCallback = () => {}
}: GameMapProps) {
  const [hexDisplay, setHexDisplay] = useState<JSX.Element[]>([])
  const [hexDisplayDetail, setHexDisplayDetail] = useState<JSX.Element[]>([])
  const [hexDisplayOverlays, setHexDisplayOverlays] = useState<JSX.Element[]>([])
  const [counterDisplay, setCounterDisplay] = useState<JSX.Element[]>([])
  const [overlay, setOverlay] = useState<{
    show: boolean, x: number, y: number, counters?: Counter[]
  }>({ show: false, x: -1, y: -1 })
  const [overlayDisplay, setOverlayDisplay] = useState<JSX.Element | undefined>()
  const [updateUnitshaded, setUpdateUnitshaded] = useState(0)
  const [counterLosOverlay, setCounterLosOverlay] = useState<JSX.Element[] | undefined>()
  const [terrainInfoOverlay, setTerrainInfoOverlay] = useState<JSX.Element | undefined>()
  const [reinforcementsOverlay, setReinforcementsOverlay] = useState<JSX.Element | undefined>()
  const [directionSelectionOverlay, setDirectionSelectionOverlay] = useState<JSX.Element | undefined>()

  const [weather, setWeather] = useState<JSX.Element | undefined>()
  const [initiative, setInitiative] = useState<JSX.Element | undefined>()
  const [score, setScore] = useState<JSX.Element | undefined>()
  const [turn, setTurn] = useState<JSX.Element | undefined>()
  const [sniper, setSniper] = useState<JSX.Element | undefined>()
  const [reinforcements, setReinforcements] = useState<JSX.Element | undefined>()

  // IDEK what I'm doing with types here
  const svgRef = useRef<HTMLElement | SVGSVGElement>()

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
                                        svgRef={svgRef as React.MutableRefObject<HTMLElement>} />)
        if (map.game?.reinforcementSelection) {
          const shaded = !map.openHex(x, y)
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
        <Reinforcements xx={2} yy={2} map={map} callback={showReinforcements} update={{key: true}}/>
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
    map?.windSpeed, map?.windDirection, map?.windVariable,
    map?.game?.currentPlayer, map?.game?.lastMoveIndex, map?.game?.lastMove?.undone,
    map?.game?.initiative, map?.game?.initiativePlayer, map?.game?.turn,
    map?.game?.playerOneScore, map?.game?.playerTwoScore,
    map?.game?.reinforcementSelection, map?.game?.reinforcementNeedsDirection,
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
      if (map.game?.reinforcementSelection) {
        const counter = map.game.availableReinforcements(map.game.currentPlayer)[
          map.game.turn][map.game.reinforcementSelection.index]
        if (counter.counter.rotates && !map.game.reinforcementNeedsDirection) {
          map.game.reinforcementNeedsDirection = [x, y]
        }
      }
      hexCallback(x, y)
    }
    updateReinforcementOverlays()
  }

  const unitSelection = (selection: CounterSelectionTarget) => {
    if (selection.target.type === "map") {
      const x = selection.target.xy.x
      const y = selection.target.xy.y
      if (selection.counter.trueIndex === undefined) { return }
      map.units[y][x][selection.counter.trueIndex].select()
      counterCallback(x, y, selection.counter)
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

  return (
    <svg ref={svgRef as React.LegacyRef<SVGSVGElement>}
         className="map-svg" width={(map?.xSize || 1) * (scale || 1)}
         height={(map?.ySize || 1) * (scale || 1)}
         viewBox={`0 0 ${map?.xSize || 1} ${map?.ySize || 1}`}>
      <MapHexPatterns />
      {hexDisplay}
      {hexDisplayDetail}
      {weather}
      {initiative}
      {score}
      {turn}
      {sniper}
      {reinforcements}
      {counterDisplay}
      {hexDisplayOverlays}
      {reinforcementsOverlay}
      {overlayDisplay}
      {counterLosOverlay}
      {directionSelectionOverlay}
      {terrainInfoOverlay}
    </svg>
  )
}
