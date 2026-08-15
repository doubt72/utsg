import React, { useEffect, useState } from "react";
import MapHexPatterns from "./MapHexPatterns";
import { Coordinate, Player } from "../../../utilities/commonTypes";
import Scenario from "../../../engine/Scenario";
import { deployHex } from "../../../engine/control/deploy";
import { DeployHexesTurn } from "../../../engine/Map";

interface MapDeployDisplayProps {
  scenario: Scenario,
  scale: number,
  turn: number,
  player: Player,
}

export default function MapDeployDisplay({ scenario, scale, turn, player }: MapDeployDisplayProps) {
  const [hexDisplay, setHexDisplay] = useState<JSX.Element[]>([])
  const [vpDisplay, setVPDisplay] = useState<JSX.Element[]>([])

  const width = scenario.map.xSize * scale
  const height = scenario.map.ySize * scale

  useEffect(() => {
    const hexLoader: JSX.Element[] = []
    const vpLoader: JSX.Element[] = []
    scenario.map.mapHexes.forEach((row, y) => {
      row.forEach((hex, x) => {
        const hexes = player === 1 ? (scenario.map.alliedSetupHexes as DeployHexesTurn)[turn] :
          (scenario.map.axisSetupHexes as DeployHexesTurn)[turn]
        const show = deployHex(hexes, x, y) ? scenario.map.baseTerrainColor : "#AAA"
        hexLoader.push(
          <polygon key={`${x}-${y}-h`} points={hex.hexCoords}
                   style={{ fill: show, stroke: "#777", strokeWidth: 2 }} />
        )
        const vp = scenario.map.victoryAt(new Coordinate(x, y)) 
        if (vp) {
          const fill = `url(#nation-${vp === 1 ? scenario.alliedFactions[0] : scenario.axisFactions[0]}-16)`
          vpLoader.push(
            <circle transform={`scale(3) translate(${-hex.xOffset/1.5} ${-hex.yOffset/1.5})`} key={`${x}-${y}-vp`}
                    cx={hex.xOffset} cy={hex.yOffset} r={16} style={{ fill, strokeWidth: 1, stroke: "black" }}/>
          )
        }
      })
    })
    setHexDisplay(hexLoader)
    setVPDisplay(vpLoader)
  }, [scenario])

  return (
    <svg className="map-svg" width={width} height={height}
         viewBox={`0 0 ${width / scale} ${height / scale}`}>
      <MapHexPatterns map={scenario.map} />
      {hexDisplay}
      {vpDisplay}
    </svg>
  )
}
