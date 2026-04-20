import React from "react";
import { ActionAnimationDetails } from "../../../engine/Game";
import Map from "../../../engine/Map";
import Hex from "../../../engine/Hex";

interface ActionAnimationProps {
  map: Map;
  timer: number;
  details: ActionAnimationDetails;
  animate: boolean;
}

export default function ActionAnimation({map, timer, details, animate}: ActionAnimationProps) {
  let alpha = 1
  const iTimer = animate ? timer : 1400
  if (iTimer < 400) { alpha = iTimer / 400 }
  if (iTimer > 1400) { alpha = (2000 - iTimer) / 600 }
  const message = details.message
  const textSize = 80 / Math.sqrt(message.reduce((max, m) => m.length > max ? m.length : max, 0))
  const outlineSize = textSize/5 > 8 ? 8 : textSize/5
  const hex = map.hexAt(details.loc) as Hex
  const x = hex.xOffset
  const yInterval = textSize * 1.1
  const y = hex.yOffset + textSize / 4 - (message.length / 2 - 0.5) * yInterval
  const color = details.textColor
  const bg = details.backgroundColor
  const size = 1 + (2000 - iTimer) / 4000

  return (
    <g opacity={alpha}
        transform={`translate(${(1 - size)*x} ${(1 - size)*y}) scale(${size})`}>
      { message.map((m, i) => {
          return <text key={i} x={x} y={y + i*yInterval - size*80 + 80} fontSize={textSize}
                        fontFamily="'Courier Prime', monospace"
                        textAnchor="middle" style={{
                          fill: color, stroke: bg, paintOrder: "stroke", strokeWidth: outlineSize,
                        }}>{m}</text>
      })}
    </g>
  )
}