import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Map } from "../../engine/map";
import MapHex from "./MapHex";
import MapHexOverlay from "./MapHexOverlay";
import MapHexPatterns from "./MapHexPatterns";

export default function GameMap(props) {
  const [hexes, setHexes] = useState([])
  const [overlays, setOverlays] = useState([])

  useEffect(() => {
    if (!props.map) { return }
    const hexLoader = []
    const overlayLoader = []
    props.map.mapHexes.forEach((row, y) => {
      row.forEach((hex, x) => {
        hexLoader.push(<MapHex key={`${x}-${y}`} hex={hex}/>)
        overlayLoader.push(<MapHexOverlay key={`${x}-${y}-o`} hex={hex}/>)
      })
    })
    setHexes(hexLoader)
    setOverlays(overlayLoader)
  }, [props.map])

  const hexNarrow = 96
  const hexWide = hexNarrow / 2 / Math.sin(1/3 * Math.PI) * 1.5
  const width = hexNarrow * ((props.map?.width || 0) + 0.5) + 2
  const height = hexWide * ((props.map?.height || 0) + 0.3333) + 2

  return (
    <div className="map-container">
      <svg className="map-svg" width={width * props.scale} height={height * props.scale}
           viewBox={`0 0 ${width} ${height}`}>
        <MapHexPatterns />
        {hexes}
        {overlays}
      </svg>
    </div>
  )
}

GameMap.propTypes = {
  map: PropTypes.instanceOf(Map),
  scale: PropTypes.number.isRequired,
}
