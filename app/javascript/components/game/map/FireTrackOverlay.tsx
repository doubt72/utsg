import React from "react";
import Map from "../../../engine/Map";
import { stateType } from "../../../engine/control/state/BaseState";

interface FireTrackOverlayProps {
  map: Map;
}

export default function FireTrackOverlay({ map }: FireTrackOverlayProps) {
  const hexTracks = () => {
    if (!map.game) { return }
    const rc: JSX.Element[] = []
    if (map.game.gameState?.type === stateType.Fire) {
      const selection = map.game.fireState.selection
      const targets = map.game.fireState.targetHexes
      for (let i = 0; i < selection.length; i++) {
        const sel = selection[i]
        for (let j = 0; j < targets.length; j++) {
          const targ = map.game.fireState.targetHexes[j]
          const x1 = map.xOffset(sel.x, sel.y)
          const y1 = map.yOffset(sel.y)
          const x2 = map.xOffset(targ.x, targ.y)
          const y2 = map.yOffset(targ.y)
          rc.push(<line key={`${i}-${j}`} x1={x1} y1={y1} x2={x2} y2={y2}
                        style={{ stroke: "#E00", strokeWidth: 4, strokeDasharray: "5, 5" }} />)
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