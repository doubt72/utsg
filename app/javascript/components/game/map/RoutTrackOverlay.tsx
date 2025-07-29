import React from "react";
import Map from "../../../engine/Map";
import { Coordinate } from "../../../utilities/commonTypes";
import { circlePath } from "../../../utilities/graphics";
import { routEnds, routPaths } from "../../../engine/control/rout";

interface RoutTrackOverlayProps {
  map: Map;
}

export default function RoutTrackOverlay({ map }: RoutTrackOverlayProps) {
  const hexTracks = () => {
    if (!map.game?.gameState?.rout?.routPathTree) { return }
    const rc: JSX.Element[] = []
    const paths = routPaths(map.game.gameState.rout.routPathTree)
    for (let i = 0; i < paths.length; i++) {
      const path = paths[i]
      for (let j = 1; j < path.length; j++) {
        const last = path[j-1]
        const next = path[j]
        const offset1 = Math.max(map.counterDataAt(last).length * 5 - 5, 0)
        const x1 = map.xOffset(last.x, last.y) + offset1
        const y1 = map.yOffset(last.y) - offset1
        const offset2 = Math.max(map.counterDataAt(next).length * 5 - 5, 0)
        const x2 = map.xOffset(next.x, next.y) + offset2
        const y2 = map.yOffset(next.y) - offset2
        rc.push(
          <g key={`${i}-${j}-line`}>
            <line x1={x1} y1={y1} x2={x2} y2={y2} style={{ stroke: "#DDD", strokeWidth: 4 }} />
            <line x1={x1} y1={y1} x2={x2} y2={y2}
                  style={{ stroke: "#333", strokeWidth: 4, strokeDasharray: "5, 5" }} />
            <path d={circlePath(new Coordinate(x1, y1), 12)}
                  style={{ fill: "#AAA", stroke: "#777", strokeWidth: 4 }} />
          </g>
        )
      }
    }
    return rc
  }

  const hexEnds = () => {
    if (!map.game?.gameState?.rout?.routPathTree) { return }
    const rc: JSX.Element[] = []
    const ends = routEnds(map.game.gameState.rout.routPathTree)
    for (let i = 0; i < ends.length; i++) {
      const loc = ends[i]
      const offset1 = Math.max(map.counterDataAt(loc).length * 5 - 5, 0)
      const x = map.xOffset(loc.x, loc.y) + offset1
      const y = map.yOffset(loc.y) - offset1
      rc.push(
        <path key={`${i}-end`} d={circlePath(new Coordinate(x, y), 12)}
              style={{ fill: "#DDD", stroke: "#E00", strokeWidth: 4 }} />
      )
    }
    return rc
  }

  const track = () => {
    return (
      <g>
        { hexTracks() }
        { hexEnds() }
      </g>
    )
  }

  return track()
}