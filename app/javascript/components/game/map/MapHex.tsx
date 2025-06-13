import React from "react";
import Hex from "../../../engine/Hex";
import {
  buildingDisplay, hexElevationContinuous, hexElevation, hexBackground, hexTerrainPattern, orchardDisplay,
  hexTerrainCircle, hexTerrainContinuous
} from "../../../engine/support/hexLayout";

interface MapHexProps {
  hex: Hex;
}

export default function MapHex({ hex }: MapHexProps) {

  const background = (
    <polygon points={hex.hexCoords} style={hexBackground(hex) as object} />
  )

  const elevation = () => {
    const path = hexElevation(hex)
    if (path) {
      return <path d={path.path} style={path.style as object} />
    }
    const path2 = hexElevationContinuous(hex)
    if (path2) {
      return <path d={path2.path} style={path2.style as object} />
    }
  }

  const terrain = () => {
    const orchard = orchardDisplay(hex)
    if (orchard) {
      return (
        <g>
          {orchard.map((c, i) => {
            return <circle key={i} cx={c.x} cy={c.y} r={c.r} style={c.style as object} />
          })}
        </g>
      )
    }
    const building = buildingDisplay(hex)
    if (building) {
      return <path d={building.path} style={building.style as object} />
    }
  }

  const terrainPattern = () => {
    const terrainStyle = hexTerrainPattern(hex)
    if (terrainStyle) {
      if (hex.backgroundTerrain) {
        return <polygon points={hex.hexCoords} style={terrainStyle as object} />
      }
      const circle = hexTerrainCircle(hex)
      if (circle) {
        return <circle cx={circle.x} cy={circle.y} r={circle.r} style={terrainStyle as object} />
      }
      const path = hexTerrainContinuous(hex)
      if (path) {
        return <path d={path.path} style={terrainStyle as object} />
      }
    }
  }

  const label = (
    <text x={hex.labelX} y={hex.labelY} style={{
      fill: "rgba(0,0,0,0.33)", textAnchor: "middle", fontFamily: "'Courier Prime', monospace", fontSize: "15px" }}>
      {hex.label}
    </text>
  )

  return (
    <g>
      {background}
      {elevation()}
      {terrain()}
      {terrainPattern()}
      {label}
    </g>
  )
}
