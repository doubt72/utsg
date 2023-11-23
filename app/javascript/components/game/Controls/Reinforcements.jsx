import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Map } from "../../../engine/map";
import { baseCounterPath, nationalColors, roundedRectangle } from "../../../utilities/graphics";

export default function Reinforcements(props) {
  const [base, setBase] = useState("")

  const nation = (x, y, n) => {
    return (
      <g>
        <path d={baseCounterPath(x, y)}
              style={{ fill: nationalColors[n], stroke: "black", strokeWidth: 1 }}/>
        <image width={80} height={80} x={x} y={y} href={`/assets/units/${n}.svg`}/> 
      </g>
    )
  }

  const nationOne = (x, y) => {
    return nation(x, y, props.map.game.playerOneNation)
  }

  const nationTwo = (x, y) => {
    return nation(x, y, props.map.game.playerTwoNation)
  }

  useEffect(() => {
    setBase(
      <g>
        <path d={roundedRectangle(props.x, props.y, 248, 100)}
              style={{ fill: "#EEE", stroke: "#D5D5D5", strokeWidth: 1 }} />
        <text x={props.x + 190} y={props.y + 22} fontSize={16} textAnchor="start"
              fontFamily="'Courier Prime', monospace" style={{ fill: "#000" }}>
          units
        </text>
        {nationOne(props.x + 10, props.y + 10)}
        {nationTwo(props.x + 100, props.y + 10)}
      </g>
    )
  }, [props.x, props.y])

  return (
    <g>
      {base}
    </g>
  )
}

Reinforcements.propTypes = {
  map: PropTypes.instanceOf(Map),
  x: PropTypes.number,
  y: PropTypes.number,
  callback: PropTypes.func,
}
