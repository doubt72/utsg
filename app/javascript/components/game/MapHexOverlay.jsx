import React from "react";
import PropTypes from "prop-types"
import { Hex } from "../../engine/hex";

export default function MapHexOverlay(props) {

  const river = () => {
    if (!props.hex.river) { return "" }
    const path = props.hex.riverPath
    return (
      <path d={path} style={props.hex.riverStyle} />
    )
  }

  const road = () => {
    if (!props.hex.road) { return "" }
    const path = props.hex.roadPath
    return (
      <g>
        <path d={path} style={props.hex.roadOutlineStyle} />
        { props.hex.river ? <path d={path} style={props.hex.bridgeStyle} /> : "" }
        <path d={path} style={props.hex.roadEdgeStyle} />
        <path d={path} style={props.hex.roadStyle} />
      </g>
    )
  }

  const edge = () => {
    const path = props.hex.edgePath
    if (!path) { return "" }
    return (
      <g>
        <path d={path} style={props.hex.edgeCoreStyle} />
        <path d={path} style={props.hex.edgeDecorationStyle} />
      </g>
    )
  }

  const outline = (
    <polygon points={props.hex.hexCoords}
             style={{ strokeWidth: 1, stroke: "rgba(0,0,0,0.16)", fill: "rgba(0,0,0,0)" }} />
  )

  return (
    <g>
      {river()}
      {road()}
      {outline}
      {edge()}
    </g>
  )
}

MapHexOverlay.propTypes = {
  hex: PropTypes.instanceOf(Hex),
}