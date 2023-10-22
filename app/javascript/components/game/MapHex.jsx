import React from "react";
import PropTypes from "prop-types"
import { Hex } from "../../engine/hex";

export default function MapHex(props) {

  const background = (
    <polygon points={props.hex.hexCoords} style={props.hex.background} />
  )

  const elevation = () => {
    const hex = props.hex.elevationHex
    if (hex) {
      console.log(hex.d)
      return <path d={hex.d} style={hex.style} />
    }
    const path = props.hex.elevationContinuous
    if (path) {
      return <path d={path} style={props.hex.elevationStyle} />
    }
  }

  const label = (
    <text x={props.hex.labelX} y={props.hex.labelY} style={{
      fill: "#777", textAnchor: "middle", fontFamily: "monospace", fontSize: "12px" }}>
      {props.hex.label}
    </text>
  )

  const terrain = () => {
    const circle = props.hex.terrainCircle
    if (circle) {
      return <circle cx={circle.x} cy={circle.y} r={circle.r} style={circle.style} />
    }
    const path = props.hex.terrainContinuous
    if (path) {
      return <path d={path} style={props.hex.terrainContinuousStyle} />
    }
  }

  const road = () => {
    if (!props.hex.road) { return "" }
    const path = props.hex.roadPath
    return (
      <g>
        <path d={path} style={props.hex.roadOutlineStyle} />
        <path d={path} style={props.hex.roadEdgeStyle} />
        <path d={path} style={props.hex.roadStyle} />
      </g>
    )
  }

  const outline = (
    <polygon points={props.hex.hexCoords} style={{ strokeWidth: 1, stroke: "#CCC", fill: "rgba(0,0,0,0)" }} />
  )

  return (
    <g>
      {background}
      {elevation()}
      {label}
      {terrain()}
      {road()}
      {outline}
    </g>
  )
}

MapHex.propTypes = {
  hex: PropTypes.instanceOf(Hex),
}