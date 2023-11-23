import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Map } from "../../engine/map";
import { baseCounterPath, roundedRectangle } from "../../utilities/graphics";
import MapCounter from "./MapCounter";
import { Counter } from "../../engine/counter";
import { Marker, markerType } from "../../engine/marker";

export default function TurnDisplay(props) {
  const [base, setBase] = useState("")
  const [turn, setTurn] = useState("")

  useEffect(() => {
    const turns = props.map.game.scenario.turns
    setBase(
      <g>
        <path d={roundedRectangle(props.x, props.y, 100 + 90 * turns, 100)}
              style={{ fill: "#EEE", stroke: "#D5D5D5", strokeWidth: 1 }} />
        {
          [...Array(turns + 1).keys()].map(i => {
            const x = props.x + 10 + 90 * i
            const y = props.y + 10
            return (
              <g key={i}>
                <path d={baseCounterPath(x, y)}
                      style={{ fill: "white", stroke: "black", strokeWidth: 1.5 }} />
                <text x={x + 40} y={y + (i ? 50 : 44)} fontSize={i ? 40 : 20} textAnchor="middle"
                      fontFamily="'Courier Prime', monospace" style={{ fill: "#AAA" }}>
                  { i ? i : "setup" }
                </text>
              </g>
              )
            }
          )
        }
      </g>
    )
  }, [props.x, props.y, props.map.game.scenario.turns])

  useEffect(() => {
    if (!props.map) { return }
    if (props.hideCounters) {
      setTurn("")
    } else {
      const turn = props.map.game.turn
      const counter = new Counter(props.x + 10 + turn * 90, props.y + 10, new Marker({
        type: markerType.Turn, v: props.map.game.playerOneNation, v2: props.map.game.playerTwoNation
      }), props.map, true)
      const cb = () => { props.ovCallback({ show: true, counters: [counter] }) }
      setTurn(<MapCounter counter={counter} ovCallback={cb} x={props.x + 10 + turn * 90} y={props.y + 10} />)
    }
  }, [props.x, props.y, props.hideCounters, props.map.game.scenario.turns])

  return (
    <g>
      {base}
      {turn}
    </g>
  )
}

TurnDisplay.propTypes = {
  map: PropTypes.instanceOf(Map),
  x: PropTypes.number,
  y: PropTypes.number,
  hideCounters: PropTypes.bool,
  ovCallback: PropTypes.func,
}
