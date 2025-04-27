import React from "react";
import Hex from "../../../engine/Hex";

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
        <path d={path} style={hex.roadOutlineStyle as object} />
        { hex.river ? <path d={path} style={hex.bridgeStyle as object} /> : "" }
        <path d={path} style={hex.roadEdgeStyle as object} />
        <path d={path} style={hex.roadStyle as object} />
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
    <polygon points={hex.hexCoords} style={{ fill: "rgba(0,0,0,0.16)" }} />
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
             onClick={() => { console.log(`clicky ${hex.coord.x},${hex.coord.y}`); selectCallback(hex.coord.x, hex.coord.y) }}
             onMouseLeave={() => terrainCallback(undefined)}
             onMouseMove={e => updateTerrainInfo(e)} />
  )

  return (
    <g>
      {river()}
      {road()}
      {outline}
      {hex.night ? night : ""}
      {edge()}
      {victory()}
      {interactionOverly}
    </g>
  )
}
