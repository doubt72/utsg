import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import MapCounter from "./MapCounter";
import { Map } from "../../../engine/map";
import { Counter } from "../../../engine/counter";
import { Feature } from "../../../engine/feature";
import { baseCounterPath, roundedRectangle } from "../../../utilities/graphics";

export default function SniperDisplay(props) {
  const [base, setBase] = useState("")
  const [sniperOne, setSniperOne] = useState("")
  const [sniperTwo, setSniperTwo] = useState("")

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
        <path d={roundedRectangle(props.x, props.y, 272, 100)}
              style={{ fill: "#EEE", stroke: "#D5D5D5", strokeWidth: 1 }} />
        <circle cx={props.x + 26} cy={props.y + 50} r={16} style={nationOne()}/>
        <path d={baseCounterPath(props.x + 52, props.y + 10)}
              style={{ fill: "white", stroke: "black", strokeWidth: 1.5 }} />
        <text x={props.x + 92} y={props.y + 44} fontSize={16} textAnchor="middle"
              fontFamily="'Courier Prime', monospace" style={{ fill: "#000" }}>
          no
        </text>
        <text x={props.x + 82} y={props.y + 60} fontSize={16} textAnchor="middle"
              fontFamily="'Courier Prime', monospace" style={{ fill: "#000" }}>
          sniper
        </text>
        <path d={baseCounterPath(props.x + 142, props.y + 10)}
              style={{ fill: "white", stroke: "black", strokeWidth: 1.5 }} />
        <text x={props.x + 182} y={props.y + 44} fontSize={16} textAnchor="middle"
              fontFamily="'Courier Prime', monospace" style={{ fill: "#000" }}>
          no
        </text>
        <text x={props.x + 182} y={props.y + 60} fontSize={16} textAnchor="middle"
              fontFamily="'Courier Prime', monospace" style={{ fill: "#000" }}>
          sniper
        </text>
        <circle cx={props.x + 246} cy={props.y + 50} r={16} style={nationTwo()}/>
      </g>
    )
  }, [props.x, props.y])

  useEffect(() => {
    if (!props.map) { return }
    if (props.hideCounters) {
      setSniperOne("")
      setSniperTwo("")
    } else {
      if (props.map.game.allied_sniper) {
        const counter = new Counter(
          props.x + 52, props.y + 10, new Feature(props.map.game.allied_sniper), props.map, true
        )
        const cb = () => { props.ovCallback({ show: true, counters: [counter] }) }
        setSniperOne(<MapCounter counter={counter} ovCallback={cb} x={props.x + 52} y={props.y + 10} />)
      }
      if (props.map.game.axis_sniper) {
        const counter = new Counter(
          props.x + 142, props.y + 10, new Feature(props.map.game.axis_sniper), props.map, true
        )
        const cb = () => { props.ovCallback({ show: true, counters: [counter] }) }
        setSniperTwo(<MapCounter counter={counter} ovCallback={cb} x={props.x + 142} y={props.y + 10} />)
      }
    }
  }, [props.x, props.y, props.hideCounters])

  return (
    <g>
      {base}
      {sniperOne}
      {sniperTwo}
    </g>
  )
}

SniperDisplay.propTypes = {
  map: PropTypes.instanceOf(Map),
  x: PropTypes.number,
  y: PropTypes.number,
  hideCounters: PropTypes.bool,
  ovCallback: PropTypes.func,
}
