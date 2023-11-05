import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Map } from "../../engine/map";

export default function MapLOSOverlay(props) {
  const [overlayDisplay, setOverlayDisplay] = useState("")

  useEffect(() => {
    setOverlayDisplay(
      <g>
        {
          props.map.mapHexes.map((row, y) =>
            row.map((hex, x) => {
              const key = `${x}-${y}`
              const value = props.map.hexLOS(props.x, props.y, x, y)
              if (x === props.x && y === props.y || value === true) {
                return <polygon key={key} points={hex.hexCoords} style={{ fill: "rgba(0,0,0,0)" }}
                                onMouseEnter={() => props.setOverlay({ show: false, x: 0, y: 0 })} />
              }
              if (value === false) {
                return <polygon key={key} points={hex.hexCoords} style={{ fill: "rgba(0,0,0,0.4)" }}
                                onMouseEnter={() => props.setOverlay({ show: false, x: 0, y: 0 })} />
              }
              return (
                <g key={key}>
                  <text x={value.x} y={value.y} fontSize={value.size}
                        textAnchor="middle" fontFamily="monospace" style={value.style}>{value.text}</text>
                  <polygon points={hex.hexCoords} style={{ fill: "rgba(0,0,0,0)" }}
                           onMouseEnter={() => props.setOverlay({ show: false, x: 0, y: 0 })} />
                </g>
              )
            })
          )
        }
      </g>
    )
  }, [props.x, props.y])

  return (
    <g>
      {overlayDisplay}
    </g>
  )
}

MapLOSOverlay.propTypes = {
  map: PropTypes.instanceOf(Map),
  setOverlay: PropTypes.func,
  x: PropTypes.number,
  y: PropTypes.number,
}
