import React from "react";
import Hex from "../../../engine/Hex";
import { terrainType } from "../../../utilities/commonTypes";

interface MapHexDetailProps {
  hex: Hex;
  selectCallback: (x: number, y: number) => void,
  showTerrain: boolean;
  terrainCallback: (a: JSX.Element | undefined) => void;
  svgRef: React.MutableRefObject<HTMLElement>;
}

export default function MapHexDetail({
  hex, selectCallback, showTerrain, terrainCallback, svgRef
}: MapHexDetailProps) {
  const river = () => {
    if (!hex.river) { return "" }
    const path = hex.riverPath
    return <path d={path} style={hex.riverStyle as object} />
  }

  const road = () => {
    if (!hex.road) { return "" }
    const path = hex.roadPath
    return (
      <g>
        <path d={path} style={hex.roadOutlineStyle as object} transform={hex.roadRotate} />
        { (hex.river || hex.baseTerrain === terrainType.Water || hex.baseTerrain == terrainType.Shallow) ?
            <path d={path} style={hex.bridgeStyle as object} transform={hex.roadRotate} /> : "" }
        <path d={path} style={hex.roadEdgeStyle as object} transform={hex.roadRotate} />
        <path d={path} style={hex.roadStyle as object} transform={hex.roadRotate} />
      </g>
    )
  }

  const railroadBottom = () => {
    if (!hex.railroad) { return "" }
    const path = hex.railroadPath
    return (
      <g>        
        { (hex.river || hex.baseTerrain === terrainType.Water || hex.baseTerrain == terrainType.Shallow) ?
            <path d={path} style={hex.railroadBridgeStyle as object} /> :
            <path d={path} style={hex.railroadBedStyle as object} /> }
        <path d={path} style={hex.railroadtieStyle as object} />
      </g>
    )
  }

  const railroad = () => {
    if (!hex.railroad) { return "" }
    const path = hex.railroadPath
    return (
      <g>
        <path d={path} style={hex.railroadTrackStyle as object} />
      </g>
    )
  }

  const edge = () => {
    const path = hex.edgePath
    if (!path) { return "" }
    return (
      <g>
        <path d={path} style={hex.edgeCoreStyle as object} />
        <path d={path} style={hex.edgeDecorationStyle as object} />
      </g>
    )
  }

  const victory = () => {
    const layout = hex.victoryLayout
    if (!layout) { return "" }
    return <circle cx={layout.x} cy={layout.y} r={layout.r} style={layout.style as object}/>
  }

  const night = (
    <polygon points={hex.hexCoords} style={{ fill: "rgba(0,0,0,0.1)" }} />
  )

  const outline = (
    <polygon points={hex.hexCoords}
             style={{ strokeWidth: 1, stroke: "rgba(0,0,0,0.16)", fill: "rgba(0,0,0,0)" }} />
  )

  const updateTerrainInfo = (e: React.MouseEvent) => {
    if (showTerrain) {
      if (svgRef.current) {
        const x = e.clientX - svgRef.current.getBoundingClientRect().x + 10
        const y = e.clientY - svgRef.current.getBoundingClientRect().y + 10
        const layout = hex.helpLayout(x, y)
        terrainCallback(
          <g>
            <path d={layout.path} style={layout.style as object} />
            {
              layout.texts.map((t, i) => 
                <text key={i} x={t.x} y={t.y} fontSize={layout.size} fontFamily="'Courier Prime', monospace"
                      textAnchor="start" style={{ fill: "white" }}>{t.v}</text>
              )
            }
          </g>
        )
      }
    } else {
      terrainCallback(undefined)
    }
  }

  const interactionOverly = (
    <polygon points={hex.hexCoords} style={{ fill: "rgba(0,0,0,0)" }}
             onClick={() => selectCallback(hex.coord.x, hex.coord.y)}
             onMouseLeave={() => terrainCallback(undefined)}
             onMouseMove={e => updateTerrainInfo(e)} />
  )

  return (
    <g>
      {river()}
      {railroadBottom()}
      {road()}
      {railroad()}
      {outline}
      {hex.night ? night : ""}
      {edge()}
      {victory()}
      {interactionOverly}
    </g>
  )
}
