import React, { useEffect, useState } from "react";
import Map from "../../../engine/Map";
import { Coordinate } from "../../../utilities/commonTypes";
import { circlePath } from "../../../utilities/graphics";
import { facingLayout } from "../../../engine/support/unitLayout";

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
                  <path d={circlePath(new Coordinate(value.x, value.y), 30)}
                        style={{ fill: "rgba(0,0,0,0.3)" }}/>
                  <text x={value.x} y={value.y + 15} fontSize={value.size}
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
          if (!c.hasUnit) { return "" }
          const fl = facingLayout(c)
          const fl2 = facingLayout(c, !!c.unit.sponson)
          if (!fl || !fl2) { return "" }
          return (
            <g key={i}>
              <defs>
                <clipPath id="map-clip-firing-arc">
                  <rect x="0" y="0" width={map.previewXSize} height={map.ySize}></rect>
                </clipPath>
              </defs>
              <path d={fl2.path} style={fl2.style2 as object} clipPath="url(#map-clip-firing-arc)" />
              <path d={fl2.path} style={fl2.style as object} strokeDasharray={fl2.dash}
                    clipPath="url(#map-clip-firing-arc)" />
              <path d={fl.path} style={fl.style2 as object} clipPath="url(#map-clip-firing-arc)"/>
              <path d={fl.path} style={fl.style as object} strokeDasharray={fl.dash}
                    clipPath="url(#map-clip-firing-arc)"/>
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
