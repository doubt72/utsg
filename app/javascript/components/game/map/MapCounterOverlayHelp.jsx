import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Map } from "../../../engine/map";
import { Counter } from "../../../engine/counter";

export default function MapCounterOverlayHelp(props) {
  const [helpButton, setHelpButton] = useState("")

  useEffect(() => {
    const bl = props.map.counterHelpButtonLayout(props.x, props.y, props.counter)
    setHelpButton(
      <g onMouseOver={() => showHelp()} onMouseLeave={() => hideHelp()} >
        <path d={bl.path} style={{ fill: "black", stroke: "white", strokeWidth: 2 }} />
        <text x={bl.x} y={bl.y} fontSize={bl.size} textAnchor="middle" fontFamily="'Courier Prime', monospace"
              style={{ fill: "white" }} cursor="default">?</text>
      </g>
    )
  }, [props.x, props.y])

  const showHelp = () => {
    const layout = props.counter.helpLayout(props.x + 20, props.y - 10)
    props.setHelpDisplay(
      <g>
        <path d={layout.path} style={layout.style} />
        {
          layout.texts.map((t, i) => 
            <text key={i} x={t.x} y={t.y} fontSize={layout.size} fontFamily="'Courier Prime', monospace"
                  textAnchor="start" style={{ fill: "white" }}>{t.v}</text>
          )
        }
      </g>
    )
  }

  const hideHelp = () => {
    props.setHelpDisplay("")
  }

  return (
    <g>
      {helpButton}
    </g>
  )
}

MapCounterOverlayHelp.propTypes = {
  map: PropTypes.instanceOf(Map),
  counter: PropTypes.instanceOf(Counter),
  x: PropTypes.number,
  y: PropTypes.number,
  setHelpDisplay: PropTypes.func,
}
