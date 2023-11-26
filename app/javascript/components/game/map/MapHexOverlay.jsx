import React from "react";
import PropTypes from "prop-types"
import { Hex } from "../../../engine/hex";

export default function MapHexOverlay(props) {
  const river = () => {
    if (!props.hex.river) { return "" }
    const path = props.hex.riverPath
    return <path d={path} style={props.hex.riverStyle} />
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

  const victory = () => {
    const layout = props.hex.victoryLayout
    if (!layout) { return "" }
    return <circle cx={layout.x} cy={layout.y} r={layout.r} style={layout.style}/>
  }

  const night = (
    <polygon points={props.hex.hexCoords} style={{ fill: "rgba(0,0,0,0.16)" }} />
  )

  const outline = (
    <polygon points={props.hex.hexCoords}
             style={{ strokeWidth: 1, stroke: "rgba(0,0,0,0.16)", fill: "rgba(0,0,0,0)" }} />
  )

  const updateTerrainInfo = (e) => {
    if (props.showTerrain) {
      const x = e.clientX - props.svgRef.current.getBoundingClientRect().x + 10
      const y = e.clientY - props.svgRef.current.getBoundingClientRect().y + 10
      const layout = props.hex.helpLayout(x, y)
      props.terrainCallback(
        <g>
          <path d={layout.path} style={layout.style} />
          {
            layout.texts.map((t, i) => 
              <text key={i} x={t.x} y={t.y} fontSize={layout.size} fontFamily="'Courier Prime', monospace"
                    textAnchor="start" style={{ fill: "white" }}>{t.v}</text>
            )
          }
        </g>
      )
    } else {
      props.terrainCallback("")
    }
  }

  const selectedStyle = { fill: "rgba(0,0,0,0.1)" }
  const unSelectedStyle = { fill: "rgba(0,0,0,0)" }

  const selected = (
    props.selected ? <polygon points={props.hex.hexCoords} style={selectedStyle}
                              onClick={() => props.selectCallback(props.hex.x, props.hex.y)}
                              onMouseLeave={() => props.terrainCallback("")}
                              onMouseMove={e => updateTerrainInfo(e)} /> :
                    <polygon points={props.hex.hexCoords} style={unSelectedStyle}
                              onClick={() => props.selectCallback(props.hex.x, props.hex.y)}
                              onMouseLeave={() => props.terrainCallback("")}
                              onMouseMove={e => updateTerrainInfo(e)} />
  )

  return (
    <g>
      {river()}
      {road()}
      {outline}
      {props.hex.night ? night : ""}
      {edge()}
      {victory()}
      {selected}
    </g>
  )
}

MapHexOverlay.propTypes = {
  hex: PropTypes.instanceOf(Hex),
  selectCallback: PropTypes.func.isRequired,
  selected: PropTypes.bool,
  showTerrain: PropTypes.bool,
  terrainCallback: PropTypes.func,
  svgRef: PropTypes.object,
}