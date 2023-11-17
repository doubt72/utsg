import React from "react";
import PropTypes from "prop-types";
import { Map } from "../../engine/map";
import { baseCounterPath, baseHexCoords, roundedRectangle } from "../../utilities/graphics";

export default function WeatherDisplay(props) {
  return (
    <g>
      <path d={roundedRectangle(props.x, props.y, 442, 150)}
            style={{ fill: props.map?.baseTerrainColor, stroke: "#777", strokeWidth: 2 }} />
      <text x={props.x + 14} y={props.y + 140} fontSize={16} textAnchor="left"
              fontFamily="'Courier Prime', monospace" style={{ fill: "black" }}>
        terrain: {props.map?.baseTerrainName}
      </text>
      <path d={baseCounterPath(props.x+10, props.y+24)}
            style={{ fill: "white", stroke: "black", strokeWidth: 1.5 }} />
      <text x={props.x + 14} y={props.y + 18} fontSize={16} textAnchor="left"
            fontFamily="'Courier Prime', monospace" style={{ fill: "black" }}>
        current
      </text>
      <path d={baseCounterPath(props.x+100, props.y+24)}
            style={{ fill: "white", stroke: "black", strokeWidth: 1.5 }} />
      <text x={props.x + 104} y={props.y + 18} fontSize={16} textAnchor="left"
            fontFamily="'Courier Prime', monospace" style={{ fill: "black" }}>
        base
      </text>
      <path d={baseCounterPath(props.x+190, props.y+24)}
            style={{ fill: "white", stroke: "black", strokeWidth: 1.5 }} />
      <text x={props.x + 194} y={props.y + 18} fontSize={16} textAnchor="left"
            fontFamily="'Courier Prime', monospace" style={{ fill: "black" }}>
        precip
      </text>
      <polygon points={baseHexCoords(props.map || { radius: 0 }, props.x+356, props.y+76)}
               style={{ fill: "white", stroke: "black", strokeWidth: 1.5 }} />
      {[1, 2, 3, 4, 5, 6].map(d => {
        if (!props.map) { return }
        const x = 356 - (props.map.radius-4) * Math.cos((d-1)/3 * Math.PI)
        const y = 76 - (props.map.radius-4) * Math.sin((d-1)/3 * Math.PI)
        return (
          <text key={d} fontSize={24} textAnchor="middle"
                fontFamily="'Courier Prime', monospace" style={{ fill: "black" }}
                transform={`translate(${x+2},${y+2}) rotate(${d*60 - 150})`}>
            {d}
          </text>
        )
      })}
      <text x={props.x + 356} y={props.y + 34} fontSize={16} textAnchor="middle"
              fontFamily="'Courier Prime', monospace" style={{ fill: "black" }}>
        wind
      </text>
      <text x={props.x + 356} y={props.y + 50} fontSize={16} textAnchor="middle"
              fontFamily="'Courier Prime', monospace" style={{ fill: "black" }}>
        direction
      </text>
    </g>
  )
}

WeatherDisplay.propTypes = {
  map: PropTypes.instanceOf(Map),
  x: PropTypes.number,
  y: PropTypes.number,
}
