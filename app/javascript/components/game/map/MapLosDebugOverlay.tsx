import React, { useEffect, useState } from "react";
import Map from "../../../engine/Map";
import { Coordinate } from "../../../utilities/commonTypes";
import { losHexPath } from "../../../utilities/los";
import Hex from "../../../engine/Hex";
import { hexEdgeCoords } from "../../../engine/support/hexLayout";
import { clearColor } from "../../../utilities/graphics";

interface MapLosDebugOverlayProps {
  map: Map;
  // eslint-disable-next-line @typescript-eslint/ban-types
  setOverlay: Function;
  xx: number,
  yy: number,
}

export default function MapLosDebugOverlay({
  map, setOverlay, xx, yy
}: MapLosDebugOverlayProps) {
  const [overlayDisplay, setOverlayDisplay] = useState<JSX.Element | undefined>()
  const [targetPath, setTargetPath] = useState<JSX.Element | undefined>()
  const [target, setTarget] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const start = map.hexAt(new Coordinate(xx, yy)) as Hex
    const lastHex = map.hexAt(new Coordinate(target.x, target.y)) as Hex
    const losPath = losHexPath(map, start, lastHex)
    const lastLos = map.hexLos(new Coordinate(xx, yy), new Coordinate(target.x, target.y))
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
              {lastLos.value}
            </text>
          )
        }
        {losPath.map((p, i) => {
          if (p.hex) {
            return <polygon key={i} points={p.hex.hexCoords} style={{ fill: "rgba(255,0,0,0.5)" }} />
          } else if (p.edge) {
            return <path key={i} d={hexEdgeCoords(p.edgeHex as Hex, p.edge)}
                    style={{ fill: clearColor, strokeWidth: 12, stroke: "rgba(255,0,0,0.5)" }} />
          }
        }
        )}
      </g>
    )
  }, [target.x, target.y])

  useEffect(() => {
    setTarget({ x: xx, y: yy })
    setOverlayDisplay(
      <g>
        {
          map.mapHexes.map((row, y) =>
            row.map((hex, x) => {
              const key = `${x}-${y}`
              return <polygon key={key} points={hex.hexCoords} style={{ fill: clearColor }}
                              onMouseEnter={() => setTarget({ x: x, y: y })}
                              onClick={() => setOverlay({ show: false, x: 0, y: 0 })} />
            })
          )
        }
      </g>
    )
  }, [xx, yy])

  return (
    <g>
      {targetPath}
      {overlayDisplay}
    </g>
  )
}
