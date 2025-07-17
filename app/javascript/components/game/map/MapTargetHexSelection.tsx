import React from "react";
import Hex from "../../../engine/Hex";
import { clearColor } from "../../../utilities/graphics";

interface MapTargetHexSelectionProps {
  hex: Hex;
  target: boolean;
}

export default function MapTargetHexSelection({ hex, target }: MapTargetHexSelectionProps) {
  console.log("here")
  return (
    <g>
      <polygon points={hex.hexCoords} style={{ fill: clearColor, stroke: "#E00", strokeWidth: 4 }} />
      { target ? <g>
        
      </g> : "" }
    </g>
  )
}