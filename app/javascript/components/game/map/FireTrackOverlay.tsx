import React from "react";
import Map from "../../../engine/Map";

interface FireTrackOverlayProps {
  map: Map;
}

export default function FireTrackOverlay({ map }: FireTrackOverlayProps) {

  const hexTracks = () => {
    if (!map.game) { return }
    const rc: JSX.Element[] = []
    // TODO: handle last action, see move track
    if (map.game.gameActionState?.fire) {
      const selection = map.game.gameActionState.selection
      const targets = map.game.gameActionState.fire.targetSelection
      for (let i = 0; i < selection.length; i++) {
        const sel = selection[i]
        for (let j = 0; j < targets.length; j++) {
          const targ = map.game.gameActionState.fire.targetSelection[j]
          const x1 = map.xOffset(sel.x, sel.y)
          const y1 = map.yOffset(sel.y)
          const x2 = map.xOffset(targ.x, targ.y)
          const y2 = map.yOffset(targ.y)
          rc.push(<g key={`${i}-${j}`}>
            <line x1={x1} y1={y1} x2={x2} y2={y2}
                  style={{ stroke: "#E00", strokeWidth: 4, strokeDasharray: "5, 5" }} />
          </g>)
        }
      }
    }
    return rc
  }

  const track = () => {
    return (
      <g>
        { hexTracks() }
      </g>
    )
  }

  return track()
}