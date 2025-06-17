import React from "react";
import Hex from "../../../engine/Hex";
import { Direction, roadType } from "../../../utilities/commonTypes";
import Unit from "../../../engine/Unit";
import { GameMoveActionPath } from "../../../engine/GameMove";

interface DirectionSelectorProps {
  hex?: Hex;
  selectCallback: (x: number, y: number, d: Direction) => void;
}

export default function DirectionSelector({ hex, selectCallback }: DirectionSelectorProps) {

  const directions = () => {
    let dirs: Direction[] = [1, 2, 3, 4, 5, 6]
    let pointingDir: Direction | undefined = undefined
    if (hex?.map?.game?.gameActionState?.deploy) {
      const player = hex.map.game.gameActionState.player
      const turn = hex.map.game.gameActionState.deploy.turn
      const index = hex.map.game.gameActionState.deploy.index
      const uf = player === 1 ?
        hex.map.game.scenario.alliedReinforcements[turn][index].counter :
        hex.map.game.scenario.axisReinforcements[turn][index].counter
      const unit = uf as Unit
      if (!hex.terrain.vehicle && !uf.isFeature && (unit.isTracked || unit.isWheeled) &&
          hex.roadType !== roadType.Path) {
        dirs = hex.roadDirections ?? []
      }
      if (hex.terrain.vehicle === "amph" && !uf.isFeature && (unit.isTracked || unit.isWheeled) &&
          !unit.amphibious && hex.roadType !== roadType.Path) {
        dirs = hex.roadDirections ?? []
      }
    } else if (hex?.map.game?.gameActionState?.move && hex.map.game.gameActionState.selection) {
      const lastPath = hex.map.game.lastPath as GameMoveActionPath
      if (hex.map.game.gameActionState.move.rotatingTurret) {
        pointingDir = lastPath.turret
      } else {
        const unit = hex.map.game.gameActionState.selection[0].counter.unit
        if (!hex.terrain.vehicle && (unit.isTracked || unit.isWheeled) && hex.roadType !== roadType.Path) {
          dirs = hex.roadDirections ?? []
        }
        if (hex.terrain.vehicle === "amph" && (unit.isTracked || unit.isWheeled) &&
            !unit.amphibious && hex.roadType !== roadType.Path) {
          dirs = hex.roadDirections ?? []
        }
        pointingDir = lastPath.facing
      }
    }

    return dirs.map(v => {
      if (!hex) { return undefined }
      const points = hex.directionSelectionCoords(v as Direction)
      const style = { fill: "#FFF", strokeWidth: 1, stroke: "#000" }
      const tStyle = { fill: "#000" }
      let callback = () => selectCallback(hex.coord.x, hex.coord.y, v as Direction)
      if (hex.map.game?.gameActionState?.move?.rotatingTurret) {
        style.fill = "#FF0"
      }
      if (v === pointingDir) {
        style.fill = "#000"
        style.stroke = "#FFF"
        tStyle.fill = "#FFF"
        callback = () => {}
      }
      return (
        <g key={v}>
          <path d={points[0]} style={style} />
          <text x={points[1][0]} y={points[1][1]} fontSize={22.5} textAnchor="middle"
                transform={`rotate(${v * 60 - 150} ${points[1][0]} ${points[1][1]}) translate(0 6)`}
                fontFamily="'Courier Prime', monospace" style={tStyle}>{v}</text>
          <path d={points[0]} style={{ fill: "rgba(0,0,0,0)"}} onClick={callback} />
        </g>
      )
    })
  }

  const overlay = () => {
    if (!hex?.map?.game?.gameActionState?.move) { return }
    return (
      <polygon points={hex.hexCoords} style={{ fill: "rgba(0,0,0,0)" }} />
    )
  }

  const text = () => {
    if (!hex?.map?.game?.gameActionState?.deploy) { return }
    const y = hex ? hex?.yOffset : 0
    return (
      <text x={hex?.xOffset} y={y + 2} fontSize={13.5} textAnchor="middle"
            fontFamily="'Courier Prime', monospace" style={{ fill: "#FFF" }}>facing</text>
    )
  }

  return (
    <g>
      { text() }
      { overlay() }
      { directions() }
    </g>
  )
}
