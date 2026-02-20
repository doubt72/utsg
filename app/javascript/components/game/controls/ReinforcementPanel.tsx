import React, { MouseEventHandler, useEffect, useState } from "react";
import MapCounter from "../map/MapCounter";
import { clearColor, roundedRectangle } from "../../../utilities/graphics";
import Map from "../../../engine/Map";
import { Coordinate, Player } from "../../../utilities/commonTypes";
import Counter from "../../../engine/Counter";
import { ReinforcementSchedule } from "../../../engine/Scenario";
import { gamePhaseType } from "../../../engine/support/gamePhase";

interface ReinforcementPanelProps {
  map?: Map;
  player: Player;
  xx: number;
  yy: number;
  closeCallback: MouseEventHandler;
  // eslint-disable-next-line @typescript-eslint/ban-types
  ovCallback: Function;
  forceUpdate: number;
}

export default function ReinforcementPanel({
  map, player, xx, yy, closeCallback, ovCallback, forceUpdate,
}: ReinforcementPanelProps ) {
  const [base, setBase] = useState<JSX.Element | undefined>()
  const [closeButtonHover, setCloseButtonHover] = useState<boolean>(false)

  const [shiftX, setShiftX] = useState<number>(0)
  const [shiftY, setShiftT] = useState<number>(0)
  const [mouseDown, setMouseDown] = useState<boolean>(false)

  const allUnits = (): ReinforcementSchedule | undefined => {
    if (!map || !map.game) { return }
    const rc: ReinforcementSchedule = {}
    const reinf = map.game.availableReinforcements(player)
    for (const key in reinf) {
      const n = Number(key)
      rc[n] = reinf[n]
    }
    const last = map.game.sortedCasualties(player)
    if (last.length > 0) { rc[99] = last }
    return rc
  }

  const maxWidth = (units: object) => {
    let length = 1
    for (const value of Object.values(units)) {
      if (value.length > length) { length = value.length }
    }
    return length == 1 ? 225 : length * 90 + 84
  }

  const dragCallback = (event: React.MouseEvent) => {
    const x = event.movementX
    const y = event.movementY
    if (event.buttons !== 1) { return }

    setShiftX(o => { return x + o })
    setShiftT(o => { return y + o })
  }

  useEffect(() => {
    if (!map) { return }
    const units = allUnits()
    const x = xx + shiftX
    const y = yy + shiftY
    const closeX = !units || Object.keys(units).length == 0 ? x + 210 : x + maxWidth(units) - 15
    const closeY = y + 18
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
        <circle cx={closeX} cy={closeY} r={8} style={{ fill: clearColor }}
                onClick={closeCallback} onMouseEnter={() => setCloseButtonHover(true)}
                onMouseLeave={() => setCloseButtonHover(false)} />
      </g>
    )
    const mainFill = "rgba(143,143,143,0.95)"
    if (!units || Object.keys(units).length === 0) {
      setBase(
        <g>
          <path d={roundedRectangle(x, y, 225, 100)}
                style={{ fill: mainFill, stroke: "#777", strokeWidth: 1 }}/>
          <text x={x + 10} y={y + 22} fontSize={16} textAnchor="start"
                fontFamily="'Courier Prime', monospace" style={{ fill: "#FFF" }}>
            available units, losses:
          </text>
          <text x={x + 15} y={y + 60} fontSize={16} textAnchor="start"
                fontFamily="'Courier Prime', monospace" style={{ fill: "#FFF" }}>
            (all units deployed)
          </text>
          {closeButton}
        </g>
      )
      return
    }
    setBase(
      <g onMouseDown={() => setMouseDown(true)}
         onMouseUp={() => setMouseDown(false)}
         onMouseLeave={() => setMouseDown(false)}
         onMouseMove={(event) => {
           if (mouseDown) { dragCallback(event) }
         }} >
        <path d={roundedRectangle(x, y, maxWidth(units), Object.keys(units).length * 106 + 44)}
              style={{ fill: mainFill, stroke: "#777", strokeWidth: 1 }} />
        <text x={x + 10} y={y + 22} fontSize={16} textAnchor="start"
              fontFamily="'Courier Prime', monospace" style={{ fill: "#FFF" }}>
          available units{ units[99] ? ", losses" : "" }:
        </text>
        {closeButton}
        {
          Object.entries(units).map((pair, i) => {
            const turn = Number(pair[0])
            const label = turn > 98 ? "losses" : (turn > 0 ? `turn ${turn}` : "setup")
            return (
              <g key={i}>
                <text x={x + 10} y={y + 100 + 106*i} fontSize={16} textAnchor="start"
                      fontFamily="'Courier Prime', monospace" style={{ fill: "#FFF" }}>
                  {label}
                </text>
                {
                  pair[1].map((u, j) => {
                    const x0 = x + 84 + 90*j
                    const y0 = y + 52 + 106*i
                    const counter = new Counter(new Coordinate(x0, y0+5), u.counter, map, true)
                    counter.onMap = false
                    if (player === map.game?.currentPlayer) {
                      counter.reinforcement = { player, turn, index: j }
                    }
                    const r = map.game?.deployState
                    if (r && player === r.player && turn === r.turn && j === r.index) {
                      if (!counter.targetUF.selected) {
                        counter.targetUF.select()
                      }
                    } else if (counter.targetUF.selected) {
                      counter.targetUF.select()
                    }
                    counter.showDisabled = (map.game?.phase !== gamePhaseType.Deployment ||
                      map.game?.currentPlayer !== player || map.game.state !== 'in_progress' ||
                      map.game.turn !== turn) && turn !== 99
                    const count = (u.x || 1) - (u.used || 0)
                    const cb = () => { ovCallback({show: true, counters: [counter]})}
                    if (count < 1) {
                      counter.showDisabled = true
                      if (counter.targetUF.selected) {
                        counter.targetUF.select()
                      }
                      return (
                        <g key={j}>
                          <text x={x0} y={y0} fontSize={16} textAnchor="start"
                                fontFamily="'Courier Prime', monospace" style={{ fill: "#555" }}>
                            {u.x}x
                          </text>
                          <MapCounter counter={counter} ovCallback={cb} />
                        </g>
                      )
                    } else {
                      return (
                        <g key={j}>
                          <text x={x0} y={y0} fontSize={16} textAnchor="start"
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
    xx, yy, shiftX, shiftY, map?.game?.gameState, map?.game?.lastAction, map?.game?.lastActionIndex,
    forceUpdate, closeButtonHover, mouseDown
  ])

  return (
    <g>
      {base}
    </g>
  )
}
