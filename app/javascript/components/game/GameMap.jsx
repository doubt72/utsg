import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { Map } from "../../engine/map";
import MapHexPatterns from "./MapHexPatterns";
import MapHex from "./MapHex";
import MapHexOverlay from "./MapHexOverlay";
import MapCounter from "./MapCounter";
import MapCounterOverlay from "./MapCounterOverlay";
import MapLosOverlay from "./MapLosOverlay";
import MapLosDebugOverlay from "./MapLosDebugOverlay";
import WeatherDisplay from "./WeatherDisplay";

export default function GameMap(props) {
  const [hexDisplay, setHexDisplay] = useState([])
  const [hexDisplayOverlays, setHexDisplayOverlays] = useState([])
  const [counterDisplay, setCounterDisplay] = useState([])
  const [overlay, setOverlay] = useState({ show: false, x: -1, y: -1 })
  const [overlayDisplay, setOverlayDisplay] = useState("")
  const [updateUnitSelected, setUpdateUnitSelected] = useState(0)
  const [counterLosOverlay, setCounterLosOverlay] = useState("")
  const [terrainInfoOverlay, setTerrainInfoOverlay] = useState("")
  const [weather, setWeather] = useState("")

  const svgRef = useRef()

  useEffect(() => {
    if (!props.map) { return }
    const hexLoader = []
    const overlayLoader = []
    props.map.showCoords = props.showCoords
    props.map.showAllCounters = props.showStatusCounters
    props.map.hideCounters = props.hideCounters
    props.map.mapHexes.forEach((row, y) => {
      row.forEach((hex, x) => {
        hexLoader.push(<MapHex key={`${x}-${y}`} hex={hex} />)
        overlayLoader.push(<MapHexOverlay key={`${x}-${y}-o`} hex={hex} selected={false}
                                          selectCallback={hexSelection} showTerrain={props.showTerrain}
                                          terrainCallback={props.showTerrain ?
                                            setTerrainInfoOverlay : () => setTerrainInfoOverlay("") }
                                          svgRef={svgRef} />)
      })
    })
    setHexDisplay(hexLoader)
    setHexDisplayOverlays(overlayLoader)
    setCounterDisplay(props.map.counters.map((counter, i) => {
      return <MapCounter key={i} counter={counter} ovCallback={setOverlay} />
    }))
    setWeather(() =>
      props.map?.preview ? "" :
        <WeatherDisplay preview={false} map={props.map} game={props.map.game} hideCounters={props.hideCounters}
                        x={(props.map?.xSize || 0) - 192} y={2} ovCallback={setOverlay} />
    )
  }, [
    props.map, props.showCoords, props.showStatusCounters, props.hideCounters, updateUnitSelected,
    props.showTerrain,
    props.map?.currentWeather, props.map?.baseWeather, props.map?.precip, props.map?.precipChance,
    props.map?.windSpeed, props.map?.windDirection, props.map?.windVariable,
    props.map?.baseTerrain, props.map?.night // debugging only, don't change in actual games
  ])

  useEffect(() => {
    if (overlay.x < 0) { return }
    if (!overlay.show) { setOverlayDisplay(""); setCounterLosOverlay(""); return }
    if (props.showLos && !overlay.counter) {
      const counters = props.map.counterDataAt(overlay.x, overlay.y).filter(c => !c.u.isFeature)
      if (counters.length < 1) { return }
      if (props.map.debug) { // debugging only, never set in actual games
        setOverlayDisplay(
          <MapLosDebugOverlay x={overlay.x} y={overlay.y} map={props.map} setOverlay={setOverlay} />
        )
      } else {
        setOverlayDisplay(
          <MapLosOverlay x={overlay.x} y={overlay.y} map={props.map} setOverlay={setOverlay} />
        )
        setCounterLosOverlay(props.map.countersAt(overlay.x, overlay.y).map((c, i) => 
          <MapCounter key={i} counter={c} ovCallback={() => {}} />
        ))
      }
    } else if (!overlay.counters) {
      setOverlayDisplay(
        <MapCounterOverlay x={overlay.x} y={overlay.y} map={props.map} setOverlay={setOverlay}
                           selectionCallback={unitSelection} />
      )
    } else if (!props.showLos) {
      setOverlayDisplay(
        <MapCounterOverlay counters={overlay.counters} map={props.map} setOverlay={setOverlay}
                           selectionCallback={unitSelection} />
      )
    }
  }, [overlay.show, overlay.x, overlay.y, overlay.counter])

  const hexSelection = (x, y) => {
    const key = `${x}-${y}`
    setHexDisplayOverlays(overlays =>
      overlays.map(h => {
        if (h.key === `${key}-o`) {
          if (props.hexCallback) {
            props.hexCallback(x, y, !h.props.selected)
          }
          return <MapHexOverlay key={`${x}-${y}-o`} hex={h.props.hex} selected={!h.props.selected}
                                selectCallback={hexSelection} showTerrain={props.showTerrain}
                                terrainCallback={setTerrainInfoOverlay} svgRef={svgRef} />
        } else {
          return h
        }
      })
    )
  }

  const unitSelection = (x, y, counter) => {
    if (counter.trueIndex === undefined) { return }
    props.map.units[y][x][counter.trueIndex].select()
    setUpdateUnitSelected(s => s+1)
    props.counterCallback(x, y, counter)
  }

  return (
    <svg ref={svgRef} className="map-svg" width={(props.map?.xSize || 1) * (props.scale || 1)}
         height={(props.map?.ySize || 1) * (props.scale || 1)}
         viewBox={`0 0 ${props.map?.xSize || 1} ${props.map?.ySize || 1}`}>
      <MapHexPatterns />
      {hexDisplay}
      {hexDisplayOverlays}
      {weather}
      {counterDisplay}
      {overlayDisplay}
      {counterLosOverlay}
      {terrainInfoOverlay}
    </svg>
  )
}

GameMap.propTypes = {
  map: PropTypes.instanceOf(Map),
  scale: PropTypes.number,
  showCoords: PropTypes.bool,
  showStatusCounters: PropTypes.bool,
  showLos: PropTypes.bool,
  hideCounters: PropTypes.bool,
  showTerrain: PropTypes.bool,
  hexCallback: PropTypes.func,
  counterCallback: PropTypes.func,
}
