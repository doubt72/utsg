import React from "react";
import Hex from "../../../engine/Hex";
import { Direction } from "../../../utilities/commonTypes";

interface MapHexProps {
  hex?: Hex;
  selectCallback: (x: number, y: number, d: Direction) => void;
}

export default function DirectionSelector({ hex, selectCallback }: MapHexProps) {

  const directions = () => {
    if (!hex?.map?.game?.gameActionState?.deploy) { return }
    const player = hex.map.game.gameActionState.player
    const turn = hex.map.game.gameActionState.deploy.turn
    const index = hex.map.game.gameActionState.deploy.index
    const uf = player === 1 ?
      hex.map.game.scenario.alliedReinforcements[turn][index].counter :
      hex.map.game.scenario.axisReinforcements[turn][index].counter
    let dirs: Direction[] = [1, 2, 3, 4, 5, 6]
    if (!hex.terrain.vehicle && (uf.isTracked || uf.isWheeled)) {
      dirs = hex.roadDirections ?? []
    }

    return dirs.map(v => {
      if (!hex) { return undefined }
      const points = hex.directionSelectionCoords(v as Direction)
      const style = { fill: "#FFF", strokeWidth: 1, stroke: "#000" }
      return (
        <g key={v}>
          <path d={points[0]} style={style} />
          <text x={points[1][0]} y={points[1][1]} fontSize={22.5} textAnchor="middle"
                transform={`rotate(${v * 60 - 150} ${points[1][0]} ${points[1][1]}) translate(0 6)`}
                fontFamily="'Courier Prime', monospace" style={{ fill: "#000" }}>{v}</text>
          <path d={points[0]} style={{ fill: "rgba(0,0,0,0)"}} onClick={() => {
            selectCallback(hex.coord.x, hex.coord.y, v as Direction)
          }} />
        </g>
      )
    })
  }

  const text = () => {
    const y = hex ? hex?.yOffset : 0
    return (
      <g>
        <text x={hex?.xOffset} y={y + 2} fontSize={13.5} textAnchor="middle"
              fontFamily="'Courier Prime', monospace" style={{ fill: "#FFF" }}>facing</text>
      </g>
    )
  }

  return (
    <g>
      { text() }
      { directions() }
    </g>
  )
}
