import React from "react";
import Hex from "../../../engine/Hex";
import { Direction, roadType } from "../../../utilities/commonTypes";
import Unit from "../../../engine/Unit";
import { GameActionPath } from "../../../engine/GameAction";
import { clearColor } from "../../../utilities/graphics";
import { stateType } from "../../../engine/control/state/BaseState";

interface DirectionSelectorProps {
  hex?: Hex;
  selectCallback: (d: Direction) => void;
}

export default function DirectionSelector({ hex, selectCallback }: DirectionSelectorProps) {

  const directions = () => {
    if (!hex?.map.game) { return undefined }
    const game = hex.map.game
    let dirs: Direction[] = [1, 2, 3, 4, 5, 6]
    let pointingDir: Direction | undefined = undefined
    if (game.gameState?.type === stateType.Deploy) {
      const player = game.gameState.player
      const turn = game.deployState.turn
      const index = game.deployState.index
      const uf = player === 1 ?
        game.scenario.alliedReinforcements[turn][index].counter :
        game.scenario.axisReinforcements[turn][index].counter
      const unit = uf as Unit
      if (!hex.terrain.vehicle && !uf.isFeature && unit.isVehicle && hex.roadType !== roadType.Path) {
        dirs = hex.roadDirections ?? []
      }
      if (hex.terrain.vehicle === "amph" && !uf.isFeature && unit.isVehicle &&
          !unit.amphibious && hex.roadType !== roadType.Path) {
        dirs = hex.roadDirections ?? []
      }
    } else if (game.gameState?.type === stateType.Fire) {
      const lastPath = game.fireState.lastPath as GameActionPath
      pointingDir = lastPath.turret
    } else if (game.gameState?.type === stateType.Move) {
      const lastPath = game.moveState.lastPath as GameActionPath
      if (game.moveState.rotatingTurret) {
        pointingDir = lastPath.turret
      } else {
        if (game.moveState.rotatePossible) {
          const unit = game.moveState.selection[0].counter.unit
          if (!hex.terrain.vehicle && unit.isVehicle && hex.roadType !== roadType.Path) {
            dirs = hex.roadDirections ?? []
          }
          if (hex.terrain.vehicle === "amph" && unit.isVehicle &&
              !unit.amphibious && hex.roadType !== roadType.Path) {
            dirs = hex.roadDirections ?? []
          }
        } else {
          dirs = [lastPath.facing as Direction]
        }
        pointingDir = lastPath.facing
      }
    } else if (game.gameState?.type === stateType.Assault) {
      const lastPath = game.assaultState.lastPath as GameActionPath
      pointingDir = lastPath.turret
    }

    return dirs.map(v => {
      const points = hex.directionSelectionCoords(v as Direction)
      const style = { fill: "#FFF", strokeWidth: 1, stroke: "#000" }
      const tStyle = { fill: "#000" }
      let callback = () => selectCallback(v as Direction)
      const type = game.gameState?.type
      if (type && ([stateType.Fire, stateType.Assault].includes(type) ||
          (type === stateType.Move && game.moveState.rotatingTurret))) {
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
          <path d={points[0]} style={{ fill: clearColor}} onClick={callback} />
        </g>
      )
    })
  }

  const overlay = () => {
    const type = hex?.map?.game?.gameState?.type
    if (type && ![stateType.Move, stateType.Assault].includes(type)) { return }
    return (
      <polygon points={hex?.hexCoords} style={{ fill: clearColor }} />
    )
  }

  const text = () => {
    if (hex?.map?.game?.gameState?.type !== stateType.Deploy) { return }
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
