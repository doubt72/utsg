import React from "react";
import Hex from "../../../engine/Hex";
import { Coordinate, hexOpenType, HexOpenType } from "../../../utilities/commonTypes";
import {
  circlePath, clearColor, falseShadedHexColor, greenHexColor, redHexColor, shadedHexColor, yellowHexColor
} from "../../../utilities/graphics";

interface MapHexOverlayProps {
  hex: Hex;
  selectCallback: (x: number, y: number) => void,
  shaded: HexOpenType;
  firingSmoke?: boolean;
}

export default function MapHexOverlay({
  hex, selectCallback, shaded, firingSmoke,
}: MapHexOverlayProps) {
  const shadedStyle = { fill: shadedHexColor }
  const falseClosedStyle = { fill: falseShadedHexColor }
  const greenStyle = { fill: greenHexColor }
  const yellowStyle = { fill: yellowHexColor }
  const redStyle = { fill: redHexColor }
  const unshadedStyle = { fill: clearColor }

  const overlay = () => {
    let style = shaded === hexOpenType.Closed ? shadedStyle : unshadedStyle
    if (shaded === hexOpenType.Green) {style = greenStyle }
    if (shaded === hexOpenType.Yellow) { style = yellowStyle }
    if (shaded === hexOpenType.Red) { style = redStyle }
    if (shaded === hexOpenType.Overstack) { style = shadedStyle }
    if (shaded === hexOpenType.Enemy) { style = shadedStyle }
    if (shaded === hexOpenType.FalseClosed) { style = falseClosedStyle }
    const x = hex.xOffset
    const y = hex.yOffset
    const xoffset = Math.max(hex.map.countersAt(hex.coord).length * 5 - 5, 0)
    let yoffset = Math.max(hex.map.countersAt(hex.coord).length * 5 - 5, 0)
    if (hex.map.rotated) { yoffset = -Math.max(hex.map.countersAt(hex.coord).length * 5 - 5, 0) }
    const open = ![hexOpenType.Closed, hexOpenType.Overstack, hexOpenType.Enemy].includes(shaded)
    let circle: JSX.Element | string = ""
    if (typeof shaded === "number" || [hexOpenType.All, hexOpenType.Overstack, hexOpenType.Enemy].includes(shaded)) {
      let decoration = shaded === hexOpenType.All ? "A" : shaded
      if (shaded === hexOpenType.Overstack) { decoration = "+" }
      if (shaded === hexOpenType.Enemy) { decoration = "X" }
      if (decoration === 0.5) { decoration = "½" }
      circle = (
        <g className={"tracking-mho-c"} transform={ hex.map.rotated ? `rotate(90 ${x + xoffset} ${y - yoffset})` : "" } >
          <path d={circlePath(new Coordinate(x + xoffset, y - yoffset), 30)}
                style={{ fill: "rgba(0,0,0,0.3)" }} />
          <text x={x + xoffset} y={y - yoffset + 15} fontSize={56} textAnchor="middle"
                fontFamily="'Courier Prime', monospace" style={{ fill: "rgba(255,255,255,0.6)"}}>
            {decoration}
          </text>
        </g>
      )
    }
    return (
      <g className={firingSmoke ? "tracking-mho-sc smoke-cursor" : "tracking-mho-sc"} >
        { circle }
        <polygon points={hex.hexCoords} style={style}
                 onClick={() => open ? selectCallback(hex.coord.x, hex.coord.y) : {}}
                 onContextMenu={e => {
                   e.preventDefault()
                   open ? selectCallback(hex.coord.x, hex.coord.y) : {}
                 }} />
      </g>
    )
  }

  return (
    <g className={"tracking-mho-cp"}>
      {overlay()}
    </g>
  )
}
