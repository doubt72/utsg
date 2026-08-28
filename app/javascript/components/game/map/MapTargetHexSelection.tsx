import React from "react";
import Hex from "../../../engine/Hex";
import { circlePath, clearColor } from "../../../utilities/graphics";
import { Coordinate } from "../../../utilities/commonTypes";
import { normalDir } from "../../../utilities/utilities";

interface MapTargetHexSelectionProps {
  hex: Hex;
  target: boolean;
  active: boolean;
  offboard?: boolean;
}

export default function MapTargetHexSelection({ hex, target, active, offboard }: MapTargetHexSelectionProps) {
  const color = active ? "#E00" : "#00E"
  const x = hex.xOffset
  const y = hex.yOffset
  const strokeWidth = 2
  const center = 5
  const inside = 15
  const outside = 25
  const length = 30
  const short = 10
  const tColor = active ? "#E00" : "#000"
  const offset = offboard ? -hex.narrow/10 : 0

  const hexCoords = (hex: Hex, offset: number) => {
    return [0, 1, 2, 3, 4, 5, 6].map(i => {
      return `${hex.xCorner(normalDir(i), offset)},${hex.yCorner(normalDir(i),  offset)}`
    }).join(" ")
  }

  return (
    <g>
      <polygon points={hexCoords(hex, offset)}
               style={{ fill: clearColor, stroke: color, strokeWidth: 4 }} />
      { target ? <g>
          <path d={circlePath(new Coordinate(x, y), center)}
                style={{ fill: tColor, stroke: tColor, strokeWidth }} />
          <path d={circlePath(new Coordinate(x, y), inside)}
                style={{ fill: clearColor, stroke: tColor, strokeWidth }} />
          <path d={circlePath(new Coordinate(x, y), outside)}
                style={{ fill: clearColor, stroke: tColor, strokeWidth }} />
          <line x1={x+short} x2={x+length} y1={y} y2={y} style={{ stroke: tColor, strokeWidth }} />
          <line x1={x} x2={x} y1={y+short} y2={y+length} style={{ stroke: tColor, strokeWidth }} />
          <line x1={x-short} x2={x-length} y1={y} y2={y} style={{ stroke: tColor, strokeWidth }} />
          <line x1={x} x2={x} y1={y-short} y2={y-length} style={{ stroke: tColor, strokeWidth }} />
        </g> : "" }
      { offboard ? <g>
          { [1, 2, 3, 4, 5, 6].map((d, i) => {
            const dd = normalDir(d)
            const h = hex.map.neighborAt(hex.coord, dd)
            const o = hex.narrow/5
            if (!h) { return }
            return <polygon key={`e-hex-${i}`} points={hexCoords(h, o)}
                            style={{ fill: clearColor, stroke: color, strokeWidth: 4 }} />
          }) }
        </g> : ""}
    </g>
  )
}