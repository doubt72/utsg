import React from "react";
import Hex from "../../../engine/Hex";
import { Coordinate } from "../../../utilities/commonTypes";
import { hexHelpLayout } from "../../../engine/support/help";
import { HelpOverlay } from "./HelpOverlay";

interface MapHexNightProps {
  hex: Hex;
  maxX: number;
  maxY: number;
  showTerrain: boolean;
  terrainCallback: (a: JSX.Element | undefined) => void;
  svgRef: React.MutableRefObject<HTMLElement>;
  scale: number;
}

export default function MapHexNight({
  hex, maxX, maxY, showTerrain, terrainCallback, svgRef, scale
}: MapHexNightProps) {

  const updateTerrainInfo = (e: React.MouseEvent) => {
    if (showTerrain) {
      if (svgRef.current) {
        const x = (e.clientX - svgRef.current.getBoundingClientRect().x + 10) / scale
        const y = (e.clientY - svgRef.current.getBoundingClientRect().y + 10) / scale
        const layout = hexHelpLayout(hex, new Coordinate(x, y), new Coordinate(maxX, maxY), scale)
        terrainCallback(HelpOverlay(layout))
      }
    } else {
      terrainCallback(undefined)
    }
  }

  return (
    <polygon points={hex.hexCoords} style={{ fill: "rgba(0,0,0,0.125)" }}
             onMouseLeave={() => terrainCallback(undefined)}
             onMouseMove={e => updateTerrainInfo(e)} />
  )
}
