import React, { MouseEventHandler, useEffect, useState } from "react";
import MapCounter from "../map/MapCounter";
import { roundedRectangle } from "../../../utilities/graphics";
import Map from "../../../engine/Map";
import { Coordinate, Player } from "../../../utilities/commonTypes";
import Feature, { FeatureData } from "../../../engine/Feature";
import Unit, { UnitData } from "../../../engine/Unit";
import Counter from "../../../engine/Counter";

interface ReinforcementPanelProps {
  map: Map;
  player: Player;
  xx: number;
  yy: number;
  // selCallback: Function;
  leaveCallback: MouseEventHandler;
}

export default function ReinforcementPanel({
  map, player, xx, yy, leaveCallback
}: ReinforcementPanelProps ) {
  const [base, setBase] = useState<JSX.Element | undefined>()

  const makeUnit = (data: FeatureData | UnitData) => {
    if (data.ft) {
      return new Feature(data)
    } else {
      return new Unit(data)
    }
  }

  type AllUnitData = {
    [index: string]: {
      x: number;
      id?: string;
      u: Unit | Feature;
    }[]
  }

  // TODO: this logic (and type) belongs somewhere else (game object)
  const allUnits = (): AllUnitData | false => {
    const turn = (map.game?.turn as number).toString()
    const all = player === 1 ? map.game?.scenario.alliedReinforcements :
      map.game?.scenario.axisReinforcements
    if (!all) { return false }
    const rc: AllUnitData = {}
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

  const maxWidth = (units: object) => {
    let length = 1
    for (const value of Object.values(units)) {
      if (value.length > length) { length = value.length }
    }
    return length * 90 + 80
  }

  useEffect(() => {
    const units = allUnits()
    if (!units) {
      setBase(
        <g onMouseLeave={leaveCallback}>
          <path d={roundedRectangle(xx, yy, 170, 100)}
                style={{ fill: "#555", stroke: "#D5D5D5", strokeWidth: 1 }}/>
          <text x={xx + 10} y={yy + 22} fontSize={16} textAnchor="start"
                fontFamily="'Courier Prime', monospace" style={{ fill: "#FFF" }}>
            available units
          </text>
          <text x={xx + 10} y={yy + 52} fontSize={16} textAnchor="start"
                fontFamily="'Courier Prime', monospace" style={{ fill: "#FFF" }}>
            all units
          </text>
          <text x={xx + 10} y={yy + 70} fontSize={16} textAnchor="start"
                fontFamily="'Courier Prime', monospace" style={{ fill: "#FFF" }}>
            deployed
          </text>
        </g>
      )
      return
    }
    setBase(
      <g onMouseLeave={leaveCallback}>
        <path d={roundedRectangle(xx, yy, maxWidth(units), Object.keys(units).length * 106 + 44)}
              style={{ fill: "#555", stroke: "#D5D5D5", strokeWidth: 1 }}/>
        <text x={xx + 10} y={yy + 22} fontSize={16} textAnchor="start"
              fontFamily="'Courier Prime', monospace" style={{ fill: "#FFF" }}>
          available units
        </text>
        {
          Object.entries(units).map((pair, i) => 
            <g key={i}>
              <text x={xx + 10} y={yy + 100 + 106*i} fontSize={16} textAnchor="start"
                    fontFamily="'Courier Prime', monospace" style={{ fill: "#FFF" }}>
                {Number(pair[0]) > 0 ? `turn ${pair[0]}` : "setup"}
              </text>
              {
                pair[1].map((u, j) => {
                  const x = xx + 80 + 90*j
                  const y = yy + 52 + 106*i
                  const counter = new Counter(new Coordinate(x, y+5), u.u, undefined, true)
                  return (
                    <g key={j}>
                      <text x={x} y={y} fontSize={16} textAnchor="start"
                            fontFamily="'Courier Prime', monospace" style={{ fill: "#FFF" }}>
                        {u.x || 1}x
                      </text>
                      <MapCounter counter={counter} ovCallback={() => {}}/>
                    </g>
                  )
                })
              }
            </g>
          )
        }
      </g>
    )
  }, [xx, yy])

  return (
    <g>
      {base}
    </g>
  )
}
