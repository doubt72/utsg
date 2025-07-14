import React, { MouseEventHandler, useEffect, useState } from "react";
import MapCounter from "../map/MapCounter";
import { roundedRectangle } from "../../../utilities/graphics";
import Map from "../../../engine/Map";
import { Coordinate, Player } from "../../../utilities/commonTypes";
import Counter from "../../../engine/Counter";
import { ReinforcementSchedule } from "../../../engine/Scenario";
import { gamePhaseType } from "../../../engine/Game";

interface ReinforcementPanelProps {
  map?: Map;
  player: Player;
  xx: number;
  yy: number;
  shifted: boolean;
  closeCallback: MouseEventHandler;
  shiftCallback: MouseEventHandler;
  // eslint-disable-next-line @typescript-eslint/ban-types
  ovCallback: Function;
  forceUpdate: number;
}

export default function ReinforcementPanel({
  map, player, xx, yy, shifted, closeCallback, shiftCallback, ovCallback, forceUpdate,
}: ReinforcementPanelProps ) {
  const [base, setBase] = useState<JSX.Element | undefined>()
  const [shiftButtonHover, setShiftButtonHover] = useState<boolean>(false)
  const [closeButtonHover, setCloseButtonHover] = useState<boolean>(false)

  const allUnits = (): ReinforcementSchedule | undefined => {
    if (!map) { return }
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
    if (!map) { return }
    const units = allUnits()
    const x = xx + (shifted ? (units ? maxWidth(units) : 300) : 0)
    const closeX = !units || Object.keys(units).length == 0 ? x + 210 : x + maxWidth(units) - 15
    const closeY = yy + 18
    const ff = Math.sin(45 * Math.PI / 180) * 8
    const cStroke = closeButtonHover ? "#F77" : "#F55"
    const cFill = closeButtonHover ? "#EEE" : "#CCC"
    const closeButton = (
      <g>
        <circle cx={closeX} cy={closeY} r={8} style={{ fill: cFill, stroke: cStroke, strokeWidth: 2 }} />
        <line x1={closeX - ff} y1={closeY - ff} x2={closeX + ff} y2={closeY + ff}
              style={{ stroke: cStroke, strokeWidth: 2 }}
              onClick={closeCallback}/>
        <line x1={closeX - ff} y1={closeY + ff} x2={closeX + ff} y2={closeY - ff}
              style={{ stroke: cStroke, strokeWidth: 2 }}
              onClick={closeCallback}/>
        <circle cx={closeX} cy={closeY} r={8} style={{ fill: "rgba(0,0,0,0)" }}
                onClick={closeCallback} onMouseEnter={() => setCloseButtonHover(true)}
                onMouseLeave={() => setCloseButtonHover(false)} />
      </g>
    )
    const mainFill = "rgba(143,143,143,0.95)"
    if (!units || Object.keys(units).length === 0) {
      setBase(
        <g>
          <path d={roundedRectangle(x, yy, 225, 100)}
                style={{ fill: mainFill, stroke: "#777", strokeWidth: 1 }}/>
          <text x={x + 10} y={yy + 22} fontSize={16} textAnchor="start"
                fontFamily="'Courier Prime', monospace" style={{ fill: "#FFF" }}>
            available units:
          </text>
          <text x={x + 15} y={yy + 60} fontSize={16} textAnchor="start"
                fontFamily="'Courier Prime', monospace" style={{ fill: "#FFF" }}>
            (all units deployed)
          </text>
          {closeButton}
        </g>
      )
      return
    }
    const sX2 = closeX - 16
    const sX1 = sX2 - 16
    const sY1 = closeY - 8
    const sY2 = closeY + 8
    const sX12 = sX2 - (shifted ? 4 : 12)
    const sX21 = sX2 - (shifted ? 12 : 4)
    const path = `M ${sX1} ${sY1} L ${sX2} ${sY1} L ${sX2} ${sY2} L ${sX1} ${sY2} Z`
    const sStroke = shiftButtonHover ? "#3A3" : "#070"
    const pFill = shiftButtonHover ? "#EEE" : "#CCC"
    const shiftButton = (
      <g>
        <path d={path} style={{ fill: pFill, stroke: sStroke, strokeWidth: 2 }} />
        <line x1={sX12} y1={sY1} x2={sX21} y2={closeY} style={{ stroke: sStroke, strokeWidth: 2 }}
              onClick={shiftCallback}/>
        <line x1={sX12} y1={sY2} x2={sX21} y2={closeY} style={{ stroke: sStroke, strokeWidth: 2 }}
              onClick={shiftCallback}/>
        <path d={path} style={{ fill: "rgba(0,0,0,0)" }} onClick={shiftCallback}
              onMouseEnter={() => setShiftButtonHover(true)}
              onMouseLeave={() => setShiftButtonHover(false)}/>
      </g>
    )
    setBase(
      <g>
        <path d={roundedRectangle(x, yy, maxWidth(units), Object.keys(units).length * 106 + 44)}
              style={{ fill: mainFill, stroke: "#777", strokeWidth: 1 }} />
        <text x={x + 10} y={yy + 22} fontSize={16} textAnchor="start"
              fontFamily="'Courier Prime', monospace" style={{ fill: "#FFF" }}>
          available units:
        </text>
        {shiftButton}
        {closeButton}
        {
          Object.entries(units).map((pair, i) => {
            const turn = Number(pair[0])
            return (
              <g key={i}>
                <text x={x + 10} y={yy + 100 + 106*i} fontSize={16} textAnchor="start"
                      fontFamily="'Courier Prime', monospace" style={{ fill: "#FFF" }}>
                  {turn > 0 ? `turn ${turn}` : "setup"}
                </text>
                {
                  pair[1].map((u, j) => {
                    const x0 = x + 80 + 90*j
                    const y = yy + 52 + 106*i
                    const counter = new Counter(new Coordinate(x0, y+5), u.counter, map, true)
                    counter.onMap = false
                    if (player === map.game?.currentPlayer) {
                      counter.reinforcement = { player, turn, index: j }
                    }
                    const r = map.game?.gameActionState
                    if (r && player === r.player && turn === r.deploy?.turn && j === r.deploy.index) {
                      if (!counter.targetUF.selected) {
                        counter.targetUF.select()
                      }
                    } else if (counter.targetUF.selected) {
                      counter.targetUF.select()
                    }
                    counter.showDisabled = map.game?.phase !== gamePhaseType.Deployment ||
                      map.game.currentPlayer !== player || map.game.state !== 'in_progress' ||
                      map.game.turn !== turn
                    const count = (u.x || 1) - (u.used || 0)
                    const cb = () => { ovCallback({show: true, counters: [counter]})}
                    if (count < 1) {
                      counter.showDisabled = true
                      if (counter.targetUF.selected) {
                        counter.targetUF.select()
                      }
                      return (
                        <g key={j}>
                          <text x={x0} y={y} fontSize={16} textAnchor="start"
                                fontFamily="'Courier Prime', monospace" style={{ fill: "#555" }}>
                            {u.x}x
                          </text>
                          <MapCounter counter={counter} ovCallback={cb} />
                        </g>
                      )
                    } else {
                      return (
                        <g key={j}>
                          <text x={x0} y={y} fontSize={16} textAnchor="start"
                                fontFamily="'Courier Prime', monospace" style={{ fill: "#FFF" }}>
                            {u.used > 0 ? `${u.used}/${u.x}` : count}x
                          </text>
                          <MapCounter counter={counter} ovCallback={cb} />
                        </g>
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
  }, [
    xx, yy, shifted, map?.game?.gameActionState?.deploy, map?.game?.lastAction, map?.game?.lastActionIndex,
    forceUpdate, closeButtonHover, shiftButtonHover
  ])

  return (
    <g>
      {base}
    </g>
  )
}
