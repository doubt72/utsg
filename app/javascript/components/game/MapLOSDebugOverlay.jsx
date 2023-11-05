import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Map } from "../../engine/map";

export default function MapLOSDebugOverlay(props) {
  const [overlayDisplay, setOverlayDisplay] = useState("")
  const [targetPath, setTargetPath] = useState("")
  const [target, setTarget] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const losPath = props.map.hexPath(props.x, props.y, target.x, target.y)
    setTargetPath(
      <g>
        {losPath.map((p, i) => {
          if (p.h) {
            return <polygon key={i} points={p.h.hexCoords} style={{ fill: "rgba(255,0,0,0.5)" }} />
          } else if (p.e) {
            return <path key={i} d={p.eh.edgeCoords(p.e)}
                    style={{ fill: "rgba(0,0,0,0)", strokeWidth: 12, stroke: "rgba(255,0,0,0.5)" }} />
          }
        }
        )}
      </g>
    )
  }, [target.x, target.y])

  useEffect(() => {
    setTarget({ x: props.x, y: props.y })
    setOverlayDisplay(
      <g>
        {
          props.map.mapHexes.map((row, y) =>
            row.map((hex, x) => {
              const key = `${x}-${y}`
              const value = props.map.hexLOS(props.x, props.y, x, y)
              if (x === props.x && y === props.y || value === true) {
                return <polygon key={key} points={hex.hexCoords} style={{ fill: "rgba(0,0,0,0)" }}
                                onMouseEnter={() => setTarget({ x: x, y: y })} />
              }
              if (value === false) {
                return <polygon key={key} points={hex.hexCoords} style={{ fill: "rgba(0,0,0,0.4)" }}
                                onMouseEnter={() => setTarget({ x: x, y: y })} />
              }
              return (
                <g key={key}>
                  <text x={value.x} y={value.y} fontSize={value.size}
                        textAnchor="middle" fontFamily="monospace" style={value.style}>{value.text}</text>
                  <polygon points={hex.hexCoords} style={{ fill: "rgba(0,0,0,0)" }}
                           onMouseEnter={() => setTarget({ x: x, y: y })} />
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
      {targetPath}
      {overlayDisplay}
    </g>
  )
}

MapLOSDebugOverlay.propTypes = {
  map: PropTypes.instanceOf(Map),
  x: PropTypes.number,
  y: PropTypes.number,
}
