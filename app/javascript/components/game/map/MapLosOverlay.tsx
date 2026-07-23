import React, { useEffect, useState } from "react";
import Map from "../../../engine/Map";
import { Coordinate } from "../../../utilities/commonTypes";
import { circlePath, clearColor, greenHexColor, redHexColor, yellowHexColor } from "../../../utilities/graphics";
import { facingLayout } from "../../../engine/support/unitLayout";
import { hexDistance } from "../../../utilities/utilities";
import { hitFromArc } from "../../../engine/control/fire";
import Game from "../../../engine/Game";

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

  const from = new Coordinate(xx, yy)

  useEffect(() => {
    setOverlayDisplay(
      <g>
        {
          map.mapHexes.map((row, y) =>
            row.map((hex, x) => {
              const key = `${x}-${y}`
              const to = new Coordinate(x, y)
              const value = map.hexLos(from, to)
              const dist = hexDistance(from, to)
              let inRange = false
              let inArc = false
              for (const c of map.countersAt(from)) {
                if (!c.hasUnit) { continue }
                if ((c.unit.minimumRange ?? 0) <= dist && c.unit.currentRange >= dist &&
                    !c.unit.jammed && !c.unit.weaponDestroyed) {
                  inRange = true
                }
                if (c.unit.sponson && c.unit.sponson.range >= dist &&
                    !c.unit.sponsonJammed && !c.unit.sponsonDestroyed) {
                  inRange = true
                }
                if (!c.unit.rotates) {
                  inArc = true
                } else if (c.unit.backwardsMount) {
                  if (hitFromArc(map.game as Game, c.unit, to, from, false) === 2) { inArc = true }
                } else {
                  if (c.unit.turreted) {
                    if (hitFromArc(map.game as Game, c.unit, to, from, true) === 0) { inArc = true }
                  }
                  if (!c.unit.turreted || c.unit.sponson) {
                    if (hitFromArc(map.game as Game, c.unit, to, from, false) === 0) { inArc = true }
                  }
                }
              }
              let color = clearColor
              if (dist === 0) {
                color = greenHexColor
              } else if (inRange && !inArc) {
                color = yellowHexColor
              } else if (!inRange) {
                color = redHexColor
              }
              if (value === true) {
                return <polygon key={key} points={hex.hexCoords}
                                style={{ fill: color }}
                                onMouseEnter={() => setOverlay({ show: false, x: 0, y: 0 })} />
              }
              if (value === false) {
                const offset = Math.max(map.counterDataAt(to).length * 5 - 5, 0)
                const xd = hex.xOffset + offset
                const yd = hex.yOffset + 20 - (map.rotated ? -offset : offset)
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
                        style={value.style as object} transform={ map.rotated ? `rotate(90 ${value.x} ${value.y})` : "" }>
                    {value.value}
                  </text>
                  <polygon points={hex.hexCoords} style={{ fill: color }}
                           onMouseEnter={() => setOverlay({ show: false, x: 0, y: 0 })} />
                </g>
              )
            })
          )
        }
        {map.countersAt(from).map((c, i) => {
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
