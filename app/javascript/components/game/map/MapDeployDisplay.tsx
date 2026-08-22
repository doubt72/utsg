import React, { useEffect, useState } from "react";
import MapHexPatterns from "./MapHexPatterns";
import { Coordinate, ExtendedDirection, Player } from "../../../utilities/commonTypes";
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
  const [isolatedHexDisplay, setIsolatedHexDisplay] = useState<JSX.Element[]>([])
  const [vpDisplay, setVPDisplay] = useState<JSX.Element[]>([])

  const width = scenario.map.xSize * scale
  const height = scenario.map.ySize * scale

  useEffect(() => {
    const hexLoader: JSX.Element[] = []
    const isolatedHexLoader: JSX.Element[] = []
    const vpLoader: JSX.Element[] = []
    scenario.map.mapHexes.forEach((row, y) => {
      row.forEach((hex, x) => {
        const loc = new Coordinate(x, y)
        const hexes = player === 1 ? (scenario.map.alliedSetupHexes as DeployHexesTurn)[turn] :
          (scenario.map.axisSetupHexes as DeployHexesTurn)[turn]
        const show = deployHex(hexes, x, y) ? scenario.map.baseTerrainColor : "#AAA"
        const showStroke = deployHex(hexes, x, y) ? "#BBB" : "#777"
        hexLoader.push(
          <polygon key={`${x}-${y}-h`} points={hex.hexCoords}
                   style={{ fill: show, stroke: showStroke, strokeWidth: 2 }} />
        )
        const neighbors = scenario.map.hexNeighbors(loc)
        if (deployHex(hexes, x, y)) {
          let isolated = true
          for (const n of neighbors) {
            if (n && deployHex(hexes, n.coord.x, n.coord.y)) { isolated = false }
          }
          if (isolated) {
            const coords = [0, 1, 2, 3, 4, 5, 6].map(i => {
              return `${hex.xCorner(i as ExtendedDirection, -24)},${hex.yCorner(i as ExtendedDirection, -24)}`
            }).join(" ")
            isolatedHexLoader.push(
              <polygon key={`${x}-${y}-h`} points={coords}
                      style={{ fill: scenario.map.baseTerrainColor, strokeWidth: 0 }} />
            )
          }
        }
        const vp = scenario.map.victoryAt(loc)
        if (vp) {
          const fill = `url(#nation-${vp === 1 ? scenario.alliedFactions[0] : scenario.axisFactions[0]}-16)`
          vpLoader.push(
            <circle transform={`scale(3) translate(${-hex.xOffset/1.5} ${-hex.yOffset/1.5})`} key={`${x}-${y}-vp`}
                    cx={hex.xOffset} cy={hex.yOffset} r={16} style={{ fill, strokeWidth: 0 }}/>
          )
        }
      })
    })
    setHexDisplay(hexLoader)
    setIsolatedHexDisplay(isolatedHexLoader)
    setVPDisplay(vpLoader)
  }, [scenario])

  return (
    <svg className="map-svg" width={width} height={height}
         viewBox={`0 0 ${width / scale} ${height / scale}`}>
      <MapHexPatterns map={scenario.map} />
      {hexDisplay}
      {isolatedHexDisplay}
      {vpDisplay}
    </svg>
  )
}
