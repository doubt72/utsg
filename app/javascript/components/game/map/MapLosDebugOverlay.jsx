import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Los } from "../../../utilities/los";
import { Map } from "../../../engine/map";

export default function MapLosDebugOverlay(props) {
  const [overlayDisplay, setOverlayDisplay] = useState("")
  const [targetPath, setTargetPath] = useState("")
  const [target, setTarget] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const start = props.map.hexAt(props.x, props.y)
    const lastHex = props.map.hexAt(target.x, target.y)
    const losPath = new Los(props.map).hexPath(start, lastHex)
    const lastLos = props.map.hexLos(props.x, props.y, target.x, target.y)
    setTargetPath(
      <g>
        {
          !lastLos ?
            <g>
              <text x={lastHex.xOffset} y={lastHex.yOffset+20} fontSize={80}
                    textAnchor="middle" fontFamily="'Courier Prime', monospace" style={{ fill: "black" }}>
                &#8416;
              </text>
              <polygon points={lastHex.hexCoords} style={{ fill: "rgba(255,0,0,0.5)" }} />
            </g>:
          (lastLos === true ? "" :
            <text x={lastLos.x} y={lastLos.y} fontSize={lastLos.size}
                  textAnchor="middle" fontFamily="'Courier Prime', monospace" style={{ fill: "black" }}>
              {lastLos.text}
            </text>
          )
        }
        {losPath.map((p, i) => {
          if (p.hex) {
            return <polygon key={i} points={p.hex.hexCoords} style={{ fill: "rgba(255,0,0,0.5)" }} />
          } else if (p.edge) {
            return <path key={i} d={p.edgeHex.edgeCoords(p.edge)}
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
              return <polygon key={key} points={hex.hexCoords} style={{ fill: "rgba(0,0,0,0)" }}
                              onMouseEnter={() => setTarget({ x: x, y: y })}
                              onClick={() => props.setOverlay({ show: false, x: 0, y: 0 })} />
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

MapLosDebugOverlay.propTypes = {
  map: PropTypes.instanceOf(Map),
  setOverlay: PropTypes.func,
  x: PropTypes.number,
  y: PropTypes.number,
}
