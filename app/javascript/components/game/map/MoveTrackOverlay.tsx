import React from "react";
import Map from "../../../engine/Map";
import { Coordinate } from "../../../utilities/commonTypes";
import Hex from "../../../engine/Hex";
import { circlePath } from "../../../utilities/graphics";
import { stateType } from "../../../engine/control/state/BaseState";

interface MoveTrackOverlayProps {
  map: Map;
}

export default function MoveTrackOverlay({ map }: MoveTrackOverlayProps) {
  const hexes = (): Hex[] => {
    if (map.game?.gameState?.type === stateType.Move) {
      return map.game.moveState.path.map(p => map.hexAt(new Coordinate(p.x, p.y)) as Hex)
    } else if (map.game?.gameState?.type === stateType.Assault) {
      return map.game.assaultState.path.map(p => map.hexAt(new Coordinate(p.x, p.y)) as Hex)
    } else if (map.game?.gameState?.type === stateType.FireDisplace) {
      return map.game.assaultState.path.map(p => map.hexAt(new Coordinate(p.x, p.y)) as Hex)
    }
    const lastSigAction = map.game?.lastSignificantAction
    if (lastSigAction &&
        ["move", "rush", "assault_move", "rout_move", "rout_self"].
          includes(lastSigAction.data.action) && lastSigAction.data.path) {
      return lastSigAction.data.path.map(p => map.hexAt(new Coordinate(p.x, p.y)) as Hex)
    }
    // TODO: if last sig action was fire, check for displace
    return []
  }

  const hexCenters = () => {
    const action = map.game?.lastSignificantAction?.data.action ?? ""
    // TODO: if last sig action was fire, check for displace here
    const routing = ["rout_move", "rout_self"].includes(action)
    let first = true
    return hexes().map((h, i) => {
      const offset = Math.max(map.counterDataAt(h.coord).length * 5 - 5, 0)
      const x = h.xOffset + offset
      const y = h.yOffset - offset
      const fill = first ? "#AAA" : "#DDD"
      if (!routing) { first = false }
      return <path key={`${i}-c`} d={circlePath(new Coordinate(x, y), 12)}
                    style={{ fill, stroke: "#777", strokeWidth: 4 }} />
    })
  }

  const hexTracks = () => {
    const rc: JSX.Element[] = []
    const hx = hexes()
    for (let i = 1; i < hx.length; i++) {
      const offset1 = Math.max(map.counterDataAt(hx[i-1].coord).length * 5 - 5, 0)
      const x1 = hx[i-1].xOffset + offset1
      const y1 = hx[i-1].yOffset - offset1
      const offset2 = Math.max(map.counterDataAt(hx[i].coord).length * 5 - 5, 0)
      const x2 = hx[i].xOffset + offset2
      const y2 = hx[i].yOffset - offset2
      rc.push(
        <g key={`${i}-g`}>
          <line key={`${i}-la`} x1={x1} y1={y1} x2={x2} y2={y2}
                style={{ stroke: "#DDD", strokeWidth: 4 }} />
          <line key={`${i}-lb`} x1={x1} y1={y1} x2={x2} y2={y2}
                style={{ stroke: "#333", strokeWidth: 4, strokeDasharray: "5, 5" }} />
        </g>
      )
    }
    return rc
  }

  const track = () => {
    if (hexes().length < 2) { return }
    return (
      <g>
        { hexTracks() }
        { hexCenters() }
      </g>
    )
  }

  return track()
}