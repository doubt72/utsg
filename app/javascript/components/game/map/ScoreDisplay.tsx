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

  const nationOne = () => {
    const n = map.game?.playerOneNation
    return {
      fill: `url(#nation-${n}-16)`, strokeWidth: 1, stroke: "#000"
    }
  }

  const nationTwo = () => {
    const n = map.game?.playerTwoNation
    return {
      fill: `url(#nation-${n}-16)`, strokeWidth: 1, stroke: "#000"
    }
  }

  useEffect(() => {
    setBase(
      <g>
        <path d={roundedRectangle(xx, yy, 190, 52)}
              style={{ fill: "#EEE", stroke: "#D5D5D5", strokeWidth: 1 }} />
        <circle cx={xx + 26} cy={yy + 26} r={16} style={nationTwo()}/>
        <text x={xx + 48} y={yy + 32} fontSize={20} textAnchor="start"
                fontFamily="'Courier Prime', monospace" style={{ fill: "black" }}>
          {map.game?.playerTwoScore}
        </text>
        <circle cx={xx + 164} cy={yy + 26} r={16} style={nationOne()}/>
        <text x={xx + 142} y={yy + 32} fontSize={20} textAnchor="end"
                fontFamily="'Courier Prime', monospace" style={{ fill: "black" }}>
          {map.game?.playerOneScore}
        </text>
      </g>
    )
  }, [xx, yy, map.game?.playerOneScore, map.game?.playerTwoScore])

  return (
    <g>
      {base}
    </g>
  )
}
