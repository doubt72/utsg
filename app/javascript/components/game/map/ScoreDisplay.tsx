import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { roundedRectangle } from "../../../utilities/graphics";
import Map from "../../../engine/Map";

ScoreDisplay.propTypes = {
  map: PropTypes.instanceOf(Map),
  x: PropTypes.number,
  y: PropTypes.number,
}

interface ScoreDisplayProps {
  map: Map;
  xx: number;
  yy: number;
}

export default function ScoreDisplay({ map, xx, yy }: ScoreDisplayProps) {
  const [base, setBase] = useState<JSX.Element | undefined>()

  const nationOne = (size: number, stroke: number = 1) => {
    const n = map.game?.playerOneNation
    return {
      fill: `url(#nation-${n}-${size})`, strokeWidth: stroke, stroke: "#000"
    }
  }

  const nationTwo = (size: number, stroke: number = 1) => {
    const n = map.game?.playerTwoNation
    return {
      fill: `url(#nation-${n}-${size})`, strokeWidth: stroke, stroke: "#000"
    }
  }

  useEffect(() => {
    const radius = 21
    const size = 6
    const xl = xx + 26
    const xr = xx + 164
    const yd = yy + 26
    setBase(
      <g>
        <path d={roundedRectangle(xx, yy, 190, 52)}
              style={{ fill: "#EEE", stroke: "#D5D5D5", strokeWidth: 1 }} />
        <text x={xx + 50} y={yy + 33} fontSize={24} textAnchor="start"
                fontFamily="'Courier Prime', monospace" style={{ fill: "black" }}>
          {map.game?.playerOneScore}
        </text>
        <text x={xx + 140} y={yy + 33} fontSize={24} textAnchor="end"
                fontFamily="'Courier Prime', monospace" style={{ fill: "black" }}>
          {map.game?.playerTwoScore}
        </text>
        <g transform={`rotate(${(map.alliedDir - 1)*60} ${xl} ${yd})`}>
          <path d={`M ${xl - radius + size} ${yd - size} L ${xl - radius} ${yd} ` +
                    `L ${xl - radius + size} ${yd + size} M ${xl - radius} ${yd} L ${xl} ${yd}`}
                style={{ fill: "rgba(0,0,0,0)", stroke: "#444", strokeWidth: 2 }}/>
        </g>
        <g transform={`rotate(${(map.axisDir - 1)*60} ${xr} ${yd})`}>
          <path d={`M ${xr - radius + size} ${yd - size} L ${xr - radius} ${yd} ` +
                    `L ${xr - radius + size} ${yd + size} M ${xr - radius} ${yd} L ${xr} ${yd}`}
                style={{ fill: "rgba(0,0,0,0)", stroke: "#444", strokeWidth: 2 }}/>
        </g>
        <circle cx={xl} cy={yd} r={12} style={nationOne(12, 1)}/>
        <circle cx={xr} cy={yd} r={12} style={nationTwo(12, 1)}/>
      </g>
    )
  }, [xx, yy, map.game?.playerOneScore, map.game?.playerTwoScore, map.alliedDir, map.axisDir])

  return (
    <g>
      {base}
    </g>
  )
}
