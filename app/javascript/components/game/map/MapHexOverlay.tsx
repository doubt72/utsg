import React from "react";
import Hex from "../../../engine/Hex";
import { hexOpenType, HexOpenType } from "../../../utilities/commonTypes";

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
    let style = shaded === hexOpenType.Open ? unshadedStyle : shadedStyle
    if (shaded === hexOpenType.Green) { style = greenStyle }
    if (shaded === hexOpenType.Yellow) { style = yellowStyle }
    if (shaded === hexOpenType.Red) { style = redStyle }
    return <polygon points={hex.hexCoords} style={style}
                    onClick={() => selectCallback(hex.coord.x, hex.coord.y)} />
  }

  return (
    <g>
      {overlay()}
    </g>
  )
}
