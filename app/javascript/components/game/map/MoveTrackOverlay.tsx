import React from "react";
import Map from "../../../engine/Map";
import { Coordinate } from "../../../utilities/commonTypes";
import Hex from "../../../engine/Hex";
import { circlePath } from "../../../utilities/graphics";

interface MoveTrackOverlayProps {
  map: Map;
}

export default function MoveTrackOverlay({ map }: MoveTrackOverlayProps) {
  const hexes = (): Hex[] => {
    if (!map.game?.gameActionState?.move) { return [] }
    return map.game.gameActionState.move.path.map(p => map.hexAt(new Coordinate(p.x, p.y)) as Hex)
  }

  const hexCenters = () => {
    return hexes().map((h, i) => {
      const offset = Math.max(map.counterDataAt(h.coord).length * 5 - 5, 0)
      const x = h.xOffset + offset
      const y = h.yOffset - offset
      return <path key={`${i}-c`} d={circlePath(new Coordinate(x, y), 12)}
                    style={{ fill: "#DDD", stroke: "#777", strokeWidth: 4 }} />
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