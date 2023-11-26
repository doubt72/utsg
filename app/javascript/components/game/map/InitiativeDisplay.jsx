import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import MapCounter from "./MapCounter";
import { Map } from "../../../engine/map";
import { baseCounterPath, roundedRectangle } from "../../../utilities/graphics";
import { Counter } from "../../../engine/counter";
import { Marker, markerType } from "../../../engine/marker";

export default function InitiativeDisplay(props) {
  const [base, setBase] = useState("")
  const [initiative, setInitiative] = useState("")

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

  const xOffset = (i) => {
    if (i < 0) { return props.x + 10 }
    if (i > 0) { return props.x + 100 }
    return props.x + 55
  }

  const yOffset = (i) => {
    return props.y + Math.abs(i)*90 + 32
  }

  const roll = (i) => {
    return ["-", 11, 14, 16, 17, 18, 19, 20][Math.abs(i)]
  }

  useEffect(() => {
    setBase(
      <g>
        <path d={roundedRectangle(props.x, props.y, 190, 752)}
              style={{ fill: "#EEE", stroke: "#D5D5D5", strokeWidth: 1 }} />
        <text x={props.x + 10} y={props.y + 20} fontSize={16} textAnchor="start"
                fontFamily="'Courier Prime', monospace" style={{ fill: "black" }}>
          initiative
        </text>
        {
          [...Array(15).keys()].map(i => {
            const x = xOffset(i - 7)
            const y = yOffset(i - 7)
            return (
              <g key={i}>
                <path d={baseCounterPath(x, y)}
                      style={{ fill: "white", stroke: "black", strokeWidth: 1.5 }} />
                <text x={x + 40} y={y + 50} fontSize={40} textAnchor="middle"
                      fontFamily="'Courier Prime', monospace" style={{ fill: "#AAA" }}>
                  { roll(i - 7) }
                </text>
              </g>
              )
            }
          )
        }
        <circle cx={props.x + 26} cy={props.y + 96} r={16} style={nationTwo()}/>
        <circle cx={props.x + 164} cy={props.y + 96} r={16} style={nationOne()}/>
      </g>
    )
  }, [props.x, props.y])

  useEffect(() => {
    if (!props.map) { return }
    if (props.hideCounters) {
      setInitiative("")
    } else {
      const nation = props.map.game.initiativePlayer === 1 ? props.map.game.scenario.alliedFactions[0] :
        props.map.game.scenario.axisFactions[0]
      const index = props.map.game.initiative
      const counter = new Counter(xOffset(index), yOffset(index), new Marker({
        type: markerType.Initiative, nation: nation, i: nation,
      }), props.map, true)
      const cb = () => { props.ovCallback({ show: true, counters: [counter] }) }
      setInitiative(<MapCounter counter={counter} ovCallback={cb} x={xOffset(index)} y={yOffset(index)} />)
    }
  }, [props.x, props.y, props.hideCounters, props.map.game.initiative, props.map.game.initiativePlayer])

  return (
    <g>
      {base}
      {initiative}
    </g>
  )
}

InitiativeDisplay.propTypes = {
  map: PropTypes.instanceOf(Map),
  x: PropTypes.number,
  y: PropTypes.number,
  hideCounters: PropTypes.bool,
  ovCallback: PropTypes.func,
}
