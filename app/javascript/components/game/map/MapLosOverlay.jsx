import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Map } from "../../../engine/map";

export default function MapLosOverlay(props) {
  const [overlayDisplay, setOverlayDisplay] = useState("")

  useEffect(() => {
    setOverlayDisplay(
      <g>
        {
          props.map.mapHexes.map((row, y) =>
            row.map((hex, x) => {
              const key = `${x}-${y}`
              const value = props.map.hexLos(props.x, props.y, x, y)
              if (value === true) {
                return <polygon key={key} points={hex.hexCoords} style={{ fill: "rgba(0,0,0,0)" }}
                                onMouseEnter={() => props.setOverlay({ show: false, x: 0, y: 0 })} />
              }
              if (value === false) {
                const offset = Math.max(props.map.counterDataAt(x, y).length * 5 - 5, 0)
                const xd = hex.xOffset + offset
                const yd = hex.yOffset + 20 - offset
                return (
                  <g key={key}>
                    <text x={xd} y={yd} fontSize={80}
                          textAnchor="middle" fontFamily="'Courier Prime', monospace" style={{ fill: "rgba(0,0,0,0.2)" }}>
                      &#8416;
                    </text>
                    <polygon points={hex.hexCoords} style={{ fill: "rgba(0,0,0,0.4)" }}
                             onMouseEnter={() => props.setOverlay({ show: false, x: 0, y: 0 })} />
                  </g>
                )
              }
              return (
                <g key={key}>
                  <text x={value.x} y={value.y} fontSize={value.size}
                        textAnchor="middle" fontFamily="'Courier Prime', monospace" style={value.style}>{value.text}</text>
                  <polygon points={hex.hexCoords} style={{ fill: "rgba(0,0,0,0)" }}
                           onMouseEnter={() => props.setOverlay({ show: false, x: 0, y: 0 })} />
                </g>
              )
            })
          )
        }
        {props.map.countersAt(props.x, props.y).map((c, i) => {
          if (c.target.isMarker || c.target.isFeature) { return "" }
          const fl = c.facingLayout
          if (!fl) { return "" }
          return (
            <g key={i}>
              {fl ? <path d={fl.path} style={fl.style2} /> : ""}
              {fl ? <path d={fl.path} style={fl.style} strokeDasharray={fl.dash} /> : ""}
            </g>
          )
        })}
      </g>
    )
  }, [props.x, props.y])

  return (
    <g>
      {overlayDisplay}
    </g>
  )
}

MapLosOverlay.propTypes = {
  map: PropTypes.instanceOf(Map),
  setOverlay: PropTypes.func,
  x: PropTypes.number,
  y: PropTypes.number,
}
