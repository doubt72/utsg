import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import MapCounter from "../map/MapCounter";
import { Counter } from "../../../engine/counter";
import { Feature } from "../../../engine/feature";
import { Map } from "../../../engine/map";
import { Unit } from "../../../engine/unit";
import { roundedRectangle } from "../../../utilities/graphics";

export default function ReinforcementPanel(props) {
  const [base, setBase] = useState("")

  const makeUnit = (data) => {
    if (data.ft) {
      return new Feature(data)
    } else {
      return new Unit(data)
    }
  }

  const allUnits = () => {
    const turn = props.map.game.turn
    const all = props.player === 1 ? props.map.game.scenario.alliedReinforcements :
      props.map.game.scenario.axisReinforcements
    const rc = {}
    for (const [key, value] of Object.entries(all)) {
      if (key <= turn) {
        if (!rc[turn]) { rc[turn] = [] }
        for (const e of value.list) {
          const current = rc[turn].find(u => u.id === e.id)
          if (current) {
            current.x += (e.x || 1)
          } else {
            rc[turn].push({ x: (e.x || 1), id: e.id, u: makeUnit(e) })
          }
        }
      } else {
        rc[key] = value.list.map(u => {
          return { x: (u.x || 1), id: u.id, u: makeUnit(u) }
        })
      }
    }
    return rc
  }

  const maxWidth = (units) => {
    let length = 1
    for (const value of Object.values(units)) {
      if (value.length > length) { length = value.length }
    }
    return length * 90 + 80
  }

  useEffect(() => {
    const units = allUnits()
    setBase(
      <g onMouseLeave={props.leaveCallback}>
        <path d={roundedRectangle(props.x, props.y, maxWidth(units), Object.keys(units).length * 106 + 36)}
              style={{ fill: "#555", stroke: "#D5D5D5", strokeWidth: 1 }}/>
        <text x={props.x + 10} y={props.y + 22} fontSize={16} textAnchor="start"
              fontFamily="'Courier Prime', monospace" style={{ fill: "#FFF" }}>
          available units
        </text>
        {
          Object.entries(units).map((pair, i) => 
            <g key={i}>
              <text x={props.x + 10} y={props.y + 92 + 106*i} fontSize={16} textAnchor="start"
                    fontFamily="'Courier Prime', monospace" style={{ fill: "#FFF" }}>
                {pair[0] > 0 ? `turn ${pair[0]}` : "setup"}
              </text>
              {
                pair[1].map((u, j) => {
                  const x = props.x + 80 + 90*j
                  const y = props.y + 44 + 106*i
                  const counter = new Counter(x, y+5, u.u, null, true)
                  return (
                    <g key={j}>
                      <text x={x} y={y} fontSize={16} textAnchor="start"
                            fontFamily="'Courier Prime', monospace" style={{ fill: "#FFF" }}>
                        {u.x || 1}x
                      </text>
                      <MapCounter counter={counter} x={x} y={y}
                                  ovCallback={() => {}}/>
                    </g>
                  )
                })
              }
            </g>
          )
        }
      </g>
    )
  }, [props.x, props.y])

  return (
    <g>
      {base}
    </g>
  )
}

ReinforcementPanel.propTypes = {
  map: PropTypes.instanceOf(Map),
  player: PropTypes.number,
  x: PropTypes.number,
  y: PropTypes.number,
  selCallback: PropTypes.func,
  leaveCallback: PropTypes.func,
}