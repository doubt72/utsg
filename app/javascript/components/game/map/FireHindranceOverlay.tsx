import React from "react";
import Map from "../../../engine/Map";
import { Coordinate } from "../../../utilities/commonTypes";
import { circlePath, counterRed } from "../../../utilities/graphics";
import { fireHindranceAll } from "../../../engine/control/fire";
import { stateType } from "../../../engine/control/state/BaseState";

interface FireHindranceOverlayProps {
  map: Map;
}

export default function FireHindranceOverlay({ map }: FireHindranceOverlayProps) {
  const hindrance = () => {
    if (!map.game) { return }
    const rc: JSX.Element[] = []
    if (map.game.gameState?.type === stateType.Fire) {
      const action = map.game.fireState
      const hindrance = fireHindranceAll(map.game, action.selection, action.targetHexes)
      if (hindrance !== false) {
        const x = action.selection[0].x
        const y = action.selection[0].y
        const offset = Math.max(map.countersAt(new Coordinate(x, y)).length * 5 - 5, 0)
        const x0 = map.xOffset(x, y) + offset
        const y0 = map.yOffset(y) - offset
        rc.push(<path key="hindrance-circle" d={circlePath(new Coordinate(x0, y0), 16)}
                      style={{ stroke: "#FFF", strokeWidth: 2, fill: counterRed }}/>)
        rc.push(<text key="hindrance" x={x0} y={y0+6} fontSize={18} textAnchor="middle"
                      style={{ fill: "#FFF" }}>{hindrance}</text>)
      }
    }
    return rc
  }

  const track = () => {
    return (
      <g>
        { hindrance() }
      </g>
    )
  }

  return track()
}
