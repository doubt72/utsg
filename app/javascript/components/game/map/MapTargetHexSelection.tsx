import React from "react";
import Hex from "../../../engine/Hex";
import { circlePath, clearColor } from "../../../utilities/graphics";
import { Coordinate } from "../../../utilities/commonTypes";

interface MapTargetHexSelectionProps {
  hex: Hex;
  target: boolean;
  active: boolean;
}

export default function MapTargetHexSelection({ hex, target, active }: MapTargetHexSelectionProps) {
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

  return (
    <g>
      <polygon points={hex.hexCoords} style={{ fill: clearColor, stroke: color, strokeWidth: 4 }} />
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
    </g>
  )
}