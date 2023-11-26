import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { roundedRectangle } from "../../../utilities/graphics";
import { Map } from "../../../engine/map";

export default function ScoreDisplay(props) {
  const [base, setBase] = useState("")

  const nationOne = () => {
    const n = props.map.game.playerOneNation
    return {
      fill: `url(#nation-${n}-16)`, strokeWidth: 1, stroke: "#000"
    }
  }

  const nationTwo = () => {
    const n = props.map.game.playerTwoNation
    return {
      fill: `url(#nation-${n}-16)`, strokeWidth: 1, stroke: "#000"
    }
  }

  useEffect(() => {
    setBase(
      <g>
        <path d={roundedRectangle(props.x, props.y, 190, 52)}
              style={{ fill: "#EEE", stroke: "#D5D5D5", strokeWidth: 1 }} />
        <circle cx={props.x + 26} cy={props.y + 26} r={16} style={nationTwo()}/>
        <text x={props.x + 48} y={props.y + 32} fontSize={20} textAnchor="start"
                fontFamily="'Courier Prime', monospace" style={{ fill: "black" }}>
          {props.map.game.playerTwoScore}
        </text>
        <circle cx={props.x + 164} cy={props.y + 26} r={16} style={nationOne()}/>
        <text x={props.x + 142} y={props.y + 32} fontSize={20} textAnchor="end"
                fontFamily="'Courier Prime', monospace" style={{ fill: "black" }}>
          {props.map.game.playerOneScore}
        </text>
      </g>
    )
  }, [props.x, props.y, props.map.game.playerOneScore, props.map.game.playerTwoScore])

  return (
    <g>
      {base}
    </g>
  )
}

ScoreDisplay.propTypes = {
  map: PropTypes.instanceOf(Map),
  x: PropTypes.number,
  y: PropTypes.number,
}
