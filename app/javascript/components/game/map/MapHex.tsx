import React from "react";
import Hex from "../../../engine/Hex";

interface MapHexProps {
  hex: Hex;
}

export default function MapHex({ hex }: MapHexProps) {

  const background = (
    <polygon points={hex.hexCoords} style={hex.background as object} />
  )

  const elevation = () => {
    const path = hex.elevationHex
    if (path) {
      return <path d={path.path} style={path.style as object} />
    }
    const path2 = hex.elevationContinuous
    if (path2) {
      return <path d={path2.path} style={path2.style as object} />
    }
  }

  const terrain = () => {
    const orchard = hex.orchardDisplay
    if (orchard) {
      return (
        <g>
          {orchard.map((c, i) => {
            return <circle key={i} cx={c.x} cy={c.y} r={c.r} style={c.style as object} />
          })}
        </g>
      )
    }
    const building = hex.buildingDisplay
    if (building) {
      return <path d={building.path} style={building.style as object} />
    }
  }

  const terrainPattern = () => {
    const terrainStyle = hex.terrainPattern
    if (terrainStyle) {
      if (hex.backgroundTerrain) {
        return <polygon points={hex.hexCoords} style={terrainStyle as object} />
      }
      const circle = hex.terrainCircle
      if (circle) {
        return <circle cx={circle.x} cy={circle.y} r={circle.r} style={terrainStyle as object} />
      }
      const path = hex.terrainContinuous
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
