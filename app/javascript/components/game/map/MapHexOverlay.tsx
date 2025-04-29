import React from "react";
import Hex from "../../../engine/Hex";

interface MapHexOverlayProps {
  hex: Hex;
  selectCallback: (x: number, y: number) => void,
  shaded: boolean;
}

export default function MapHexOverlay({
  hex, selectCallback, shaded
}: MapHexOverlayProps) {
  const shadedStyle = { fill: "rgba(0,0,0,0.25)" }
  const unshadedStyle = { fill: "rgba(0,0,0,0)" }

  const shadedSVG = (
    shaded ? <polygon points={hex.hexCoords} style={shadedStyle}
                      onClick={() => {}} /> :
             <polygon points={hex.hexCoords} style={unshadedStyle}
                      onClick={() => selectCallback(hex.coord.x, hex.coord.y)} />
  )
  return (
    <g>
      {shadedSVG}
    </g>
  )
}
