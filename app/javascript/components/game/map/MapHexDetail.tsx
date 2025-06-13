import React from "react";
import Hex from "../../../engine/Hex";
import { Coordinate, terrainType } from "../../../utilities/commonTypes";
import {
  bridgeStyle, hexEdgeCoreStyle, hexEdgeDecorationStyle, hexEdgePath, railroadBedStyle, railroadBridgeStyle,
  railroadPath, railroadtieStyle, railroadTrackStyle, riverPath, riverStyle, roadEdgeStyle, roadOutlineStyle,
  roadPath, roadRotate, roadStyle, victoryLayout
} from "../../../engine/support/hexLayout";
import { hexHelpLayout } from "../../../engine/support/help";

interface MapHexDetailProps {
  hex: Hex;
  maxX: number;
  maxY: number;
  selectCallback: (x: number, y: number) => void,
  showTerrain: boolean;
  terrainCallback: (a: JSX.Element | undefined) => void;
  svgRef: React.MutableRefObject<HTMLElement>;
  scale: number;
}

export default function MapHexDetail({
  hex, maxX, maxY, selectCallback, showTerrain, terrainCallback, svgRef, scale
}: MapHexDetailProps) {
  const river = () => {
    if (!hex.river) { return "" }
    const path = riverPath(hex)
    return <path d={path} style={riverStyle(hex) as object} />
  }

  const road = () => {
    if (!hex.road) { return "" }
    const path = roadPath(hex)
    return (
      <g>
        <path d={path} style={roadOutlineStyle(hex) as object} transform={roadRotate(hex)} />
        { (hex.river || hex.baseTerrain === terrainType.Water || hex.baseTerrain == terrainType.Shallow) ?
            <path d={path} style={bridgeStyle(hex) as object} transform={roadRotate(hex)} /> : "" }
        <path d={path} style={roadEdgeStyle(hex) as object} transform={roadRotate(hex)} />
        <path d={path} style={roadStyle(hex) as object} transform={roadRotate(hex)} />
      </g>
    )
  }

  const railroadBottom = () => {
    if (!hex.railroad) { return "" }
    const path = railroadPath(hex)
    return (
      <g>        
        { (hex.river || hex.baseTerrain === terrainType.Water || hex.baseTerrain == terrainType.Shallow) ?
            <path d={path} style={railroadBridgeStyle() as object} /> :
            <path d={path} style={railroadBedStyle() as object} /> }
        <path d={path} style={railroadtieStyle() as object} />
      </g>
    )
  }

  const railroad = () => {
    if (!hex.railroad) { return "" }
    const path = railroadPath(hex)
    return (
      <g>
        <path d={path} style={railroadTrackStyle() as object} />
      </g>
    )
  }

  const edge = () => {
    const path = hexEdgePath(hex)
    if (!path) { return "" }
    return (
      <g>
        <path d={path} style={hexEdgeCoreStyle(hex) as object} />
        <path d={path} style={hexEdgeDecorationStyle(hex) as object} />
      </g>
    )
  }

  const victory = () => {
    const layout = victoryLayout(hex)
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
        const x = e.clientX / scale - svgRef.current.getBoundingClientRect().x + 10
        const y = e.clientY / scale - svgRef.current.getBoundingClientRect().y + 10
        const layout = hexHelpLayout(hex, new Coordinate(x, y), new Coordinate(maxX, maxY))
        if (!layout.texts) { return }
        terrainCallback(
          <g>
            <path d={layout.path} style={layout.style as object} />
            {
              layout.texts.map((t, i) => 
                <text key={i} x={t.x} y={t.y} fontSize={layout.size} fontFamily="'Courier Prime', monospace"
                      textAnchor="start" style={{ fill: "white" }}>{t.value}</text>
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
