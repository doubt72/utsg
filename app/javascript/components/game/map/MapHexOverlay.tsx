import React from "react";
import Hex from "../../../engine/Hex";
import { Coordinate, hexOpenType, HexOpenType } from "../../../utilities/commonTypes";
import { circlePath } from "../../../utilities/graphics";

interface MapHexOverlayProps {
  hex: Hex;
  selectCallback: (x: number, y: number) => void,
  shaded: HexOpenType;
}

export default function MapHexOverlay({
  hex, selectCallback, shaded
}: MapHexOverlayProps) {
  const shadedStyle = { fill: "rgba(0,0,0,0.3)" }
  const greenStyle = { fill: "rgba(0,255,0,0.15)" }
  // TODO: not sure we'll ever use yellow
  const yellowStyle = { fill: "rgba(255,255,0,0.15)" }
  const redStyle = { fill: "rgba(255,0,0,0.15)" }
  const unshadedStyle = { fill: "rgba(0,0,0,0)" }

  const overlay = () => {
    let style = shaded === hexOpenType.Closed ? shadedStyle : unshadedStyle
    if (shaded === hexOpenType.Green) {style = greenStyle }
    if (shaded === hexOpenType.Yellow) { style = yellowStyle }
    if (shaded === hexOpenType.Red) { style = redStyle }
    const x = hex.xOffset
    const y = hex.yOffset
    const offset = Math.max(hex.map.counterDataAt(hex.coord).length * 5 - 5, 0)
    const open = shaded !== hexOpenType.Closed
    let circle: JSX.Element | string = ""
    if (typeof shaded === "number" || shaded === hexOpenType.All) {
      circle = (
        <g>
          <path d={circlePath(new Coordinate(x + offset, y - offset), 30)}
                style={{ fill: "rgba(0,0,0,0.3)" }} />
          <text x={x + offset} y={y - offset + 15} fontSize={56} textAnchor="middle"
                fontFamily="'Courier Prime', monospace"
                style={{ fill: "rgba(255,255,255,0.6)"}}>{shaded === hexOpenType.All ? "A" : shaded}</text>
        </g>
      )
    }
    return (
      <g>
        { circle }
        <polygon points={hex.hexCoords} style={style}
                 onClick={() => open ? selectCallback(hex.coord.x, hex.coord.y) : {}} />
      </g>
    )
  }

  return (
    <g>
      {overlay()}
    </g>
  )
}
