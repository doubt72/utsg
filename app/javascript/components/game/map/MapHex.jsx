import React from "react";
import PropTypes from "prop-types"
import { Hex } from "../../../engine/hex";

export default function MapHex(props) {

  const background = (
    <polygon points={props.hex.hexCoords} style={props.hex.background} />
  )

  const elevation = () => {
    const hex = props.hex.elevationHex
    if (hex) {
      return <path d={hex.d} style={hex.style} />
    }
    const path = props.hex.elevationContinuous
    if (path) {
      return <path d={path.d} style={path.style} />
    }
  }

  const terrain = () => {
    const orchard = props.hex.orchardDisplay
    if (orchard) {
      return (
        <g>
          {orchard.map((c, i) => {
            return <circle key={i} cx={c.x} cy={c.y} r={c.r} style={c.style} />
          })}
        </g>
      )
    }
    const building = props.hex.buildingDisplay
    if (building) {
      return <path d={building.d} style={building.style} />
    }
    const circle = props.hex.terrainCircle
    if (circle) {
      return <circle cx={circle.x} cy={circle.y} r={circle.r} style={circle.style} />
    }
    const path = props.hex.terrainContinuous
    if (path) {
      return <path d={path.d} style={path.style} />
    }
  }

  const terrainPattern = () => {
    const terrainStyle = props.hex.terrainPattern
    if (terrainStyle) {
      if (props.hex.backgroundTerrain) {
        return <polygon points={props.hex.hexCoords} style={terrainStyle} />
      }
      const circle = props.hex.terrainCircle
      if (circle) {
        return <circle cx={circle.x} cy={circle.y} r={circle.r} style={terrainStyle} />
      }
      const path = props.hex.terrainContinuous
      if (path) {
        return <path d={path.d} style={terrainStyle} />
      }
    }
  }

  const label = (
    <text x={props.hex.labelX} y={props.hex.labelY} style={{
      fill: "rgba(0,0,0,0.33)", textAnchor: "middle", fontFamily: "'Courier Prime', monospace", fontSize: "15px" }}>
      {props.hex.label}
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

MapHex.propTypes = {
  hex: PropTypes.instanceOf(Hex),
}
