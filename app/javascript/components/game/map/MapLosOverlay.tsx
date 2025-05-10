import React, { useEffect, useState } from "react";
import Map from "../../../engine/Map";
import { Coordinate } from "../../../utilities/commonTypes";

interface MapLosOverlayProps {
  map: Map;
  // eslint-disable-next-line @typescript-eslint/ban-types
  setOverlay: Function;
  xx: number;
  yy: number;
}

export default function MapLosOverlay({
  map, setOverlay, xx, yy
}: MapLosOverlayProps) {
  const [overlayDisplay, setOverlayDisplay] = useState<JSX.Element | undefined>()

  useEffect(() => {
    setOverlayDisplay(
      <g>
        {
          map.mapHexes.map((row, y) =>
            row.map((hex, x) => {
              const key = `${x}-${y}`
              const value = map.hexLos(new Coordinate(xx, yy), new Coordinate(x, y))
              if (value === true) {
                return <polygon key={key} points={hex.hexCoords}
                                style={{ fill: "rgba(0,0,0,0)" }}
                                onMouseEnter={() => setOverlay({ show: false, x: 0, y: 0 })} />
              }
              if (value === false) {
                const offset = Math.max(map.counterDataAt(
                  new Coordinate(x, y)
                ).length * 5 - 5, 0)
                const xd = hex.xOffset + offset
                const yd = hex.yOffset + 20 - offset
                return (
                  <g key={key}>
                    <text x={xd} y={yd} fontSize={80}
                          textAnchor="middle" fontFamily="'Courier Prime', monospace"
                          style={{ fill: "rgba(0,0,0,0.2)" }}>
                      &#8416;
                    </text>
                    <polygon points={hex.hexCoords} style={{ fill: "rgba(0,0,0,0.4)" }}
                             onMouseEnter={() => setOverlay({ show: false, x: 0, y: 0 })} />
                  </g>
                )
              }
              return (
                <g key={key}>
                  <text x={value.x} y={value.y} fontSize={value.size}
                        textAnchor="middle" fontFamily="'Courier Prime', monospace"
                        style={value.style as object}>{value.value}</text>
                  <polygon points={hex.hexCoords} style={{ fill: "rgba(0,0,0,0)" }}
                           onMouseEnter={() => setOverlay({ show: false, x: 0, y: 0 })} />
                </g>
              )
            })
          )
        }
        {map.countersAt(new Coordinate(xx, yy)).map((c, i) => {
          if (!c.isUnit) { return "" }
          const fl = c.facingLayout
          if (!fl) { return "" }
          return (
            <g key={i}>
              {fl ? <path d={fl.path} style={fl.style2 as object} /> : ""}
              {fl ? <path d={fl.path} style={fl.style as object} strokeDasharray={fl.dash} /> : ""}
            </g>
          )
        })}
      </g>
    )
  }, [xx, yy])

  return (
    <g>
      {overlayDisplay}
    </g>
  )
}
