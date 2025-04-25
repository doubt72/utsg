import React, { MouseEventHandler, useEffect, useState } from "react";
import MapCounter from "../map/MapCounter";
import { roundedRectangle } from "../../../utilities/graphics";
import Map from "../../../engine/Map";
import { Coordinate, Player } from "../../../utilities/commonTypes";
import Counter from "../../../engine/Counter";
import { ReinforcementSchedule } from "../../../engine/Scenario";
import { gamePhaseType } from "../../../engine/Game";

interface ReinforcementPanelProps {
  map: Map;
  player: Player;
  xx: number;
  yy: number;
  selectionUpdate: number;
  closeCallback: MouseEventHandler;
  // eslint-disable-next-line @typescript-eslint/ban-types
  ovCallback: Function;
}

export default function ReinforcementPanel({
  map, player, xx, yy, selectionUpdate, closeCallback, ovCallback
}: ReinforcementPanelProps ) {
  const [base, setBase] = useState<JSX.Element | undefined>()

  const allUnits = (): ReinforcementSchedule | undefined => {
    return map.game?.availableReinforcements(player)
  }

  const maxWidth = (units: object) => {
    let length = 1
    for (const value of Object.values(units)) {
      if (value.length > length) { length = value.length }
    }
    return length == 1 ? 225 : length * 90 + 80
  }

  useEffect(() => {
    const units = allUnits()
    const closeX = !units || Object.keys(units).length == 0 ? xx + 210 : xx + maxWidth(units) - 15
    const closeY = yy + 18
    const ff = Math.sin(45 * Math.PI / 180) * 8
    const close = (
      <g>
        <circle cx={closeX} cy={closeY} r={8}
          style={{ fill: "#CCC", stroke: "#F55", strokeWidth: 2 }}
          onClick={closeCallback}/>
        <line x1={closeX - ff} y1={closeY - ff} x2={closeX + ff} y2={closeY + ff}
          style={{ stroke: "#F55", strokeWidth: 2 }}
          onClick={closeCallback}/>
        <line x1={closeX - ff} y1={closeY + ff} x2={closeX + ff} y2={closeY - ff}
          style={{ stroke: "#F55", strokeWidth: 2 }}
          onClick={closeCallback}/>
      </g>
    )
    if (!units || Object.keys(units).length === 0) {
      setBase(
        <g>
          <path d={roundedRectangle(xx, yy, 225, 100)}
                style={{ fill: "#AAA", stroke: "#D5D5D5", strokeWidth: 1 }}/>
          <text x={xx + 10} y={yy + 22} fontSize={16} textAnchor="start"
                fontFamily="'Courier Prime', monospace" style={{ fill: "#FFF" }}>
            available units:
          </text>
          <text x={xx + 15} y={yy + 60} fontSize={16} textAnchor="start"
                fontFamily="'Courier Prime', monospace" style={{ fill: "#FFF" }}>
            (all units deployed)
          </text>
          {close}
        </g>
      )
      return
    }
    setBase(
      <g>
        <path d={roundedRectangle(xx, yy, maxWidth(units), Object.keys(units).length * 106 + 44)}
              style={{ fill: "#AAA", stroke: "#D5D5D5", strokeWidth: 1 }}/>
        <text x={xx + 10} y={yy + 22} fontSize={16} textAnchor="start"
              fontFamily="'Courier Prime', monospace" style={{ fill: "#FFF" }}>
          available units:
        </text>
        {close}
        {
          Object.entries(units).map((pair, i) => {
            const turn = Number(pair[0])
            return (
              <g key={i}>
                <text x={xx + 10} y={yy + 100 + 106*i} fontSize={16} textAnchor="start"
                      fontFamily="'Courier Prime', monospace" style={{ fill: "#FFF" }}>
                  {turn > 0 ? `turn ${turn}` : "setup"}
                </text>
                {
                  pair[1].map((u, j) => {
                    const x = xx + 80 + 90*j
                    const y = yy + 52 + 106*i
                    const counter = new Counter(new Coordinate(x, y+5), u.counter, map, true)
                    counter.reinforcement = { player, turn, index: j }
                    const r = map.game?.currentReinforcementSelection
                    if (r && player === r.player && turn === r.turn && j === r.index) {
                      if (!counter.target.selected) {
                        counter.target.select()
                      }
                    } else if (counter.target.selected) {
                      counter.target.select()
                    }
                    counter.showDisabled = map.game?.phase !== gamePhaseType.Placement ||
                      map.game.currentPlayer !== player
                    const count = (u.x || 1) - (u.used || 0)
                    if (count > 0) {
                      const cb = () => { ovCallback({show: true, counters: [counter]})}
                      return (
                        <g key={j}>
                          <text x={x} y={y} fontSize={16} textAnchor="start"
                                fontFamily="'Courier Prime', monospace" style={{ fill: "#FFF" }}>
                            {count}x
                          </text>
                          <MapCounter counter={counter} ovCallback={cb} />
                        </g>
                      )
                    } else {
                      return (
                        <g key={j}></g>
                      )
                    }
                  })
                }
              </g>
            )
          })
        }
      </g>
    )
  }, [xx, yy, selectionUpdate])

  return (
    <g>
      {base}
    </g>
  )
}
