import React, { MouseEventHandler, useEffect, useState } from "react";
import MapCounter from "../map/MapCounter";
import { clearColor, roundedRectangle } from "../../../utilities/graphics";
import Map from "../../../engine/Map";
import { Coordinate, Player } from "../../../utilities/commonTypes";
import Counter from "../../../engine/Counter";
import { ReinforcementSchedule } from "../../../engine/Scenario";
import { gamePhaseType } from "../../../engine/support/gamePhase";
import { sortReinforcementList } from "../../../utilities/utilities";

interface ReinforcementPanelProps {
  map?: Map;
  player: Player;
  xx: number;
  yy: number;
  scale: number;
  mapScale: number;
  closeCallback: MouseEventHandler;
  // eslint-disable-next-line @typescript-eslint/ban-types
  ovCallback: Function;
  forceUpdate: number;
}

export default function ReinforcementPanel({
  map, player, xx, yy, scale, mapScale, closeCallback, ovCallback, forceUpdate,
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
    const last = map.game.panelCasualties(player)
    if (Object.keys(last).length > 0) { rc[99] = last }
    return rc
  }

  const maxWidth = (units: ReinforcementSchedule) => {
    let length = 1
    for (const value of Object.values(units)) {
      const keys = Object.keys(value)
      if (keys.length > length) { length = keys.length }
    }
    return length < 3 ? 320 : length * 90 + 84
  }

  const dragCallback = (event: React.MouseEvent) => {
    const x = event.movementX / scale / mapScale
    const y = event.movementY / scale / mapScale
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
    const width = maxWidth(units)
    const height = Object.keys(units).length * 106 + 64
    setBase(
      <g onMouseDown={() => setMouseDown(true)}
         onMouseUp={() => setMouseDown(false)}
         onMouseLeave={() => setMouseDown(false)}
         onMouseMove={(event) => {
           if (mouseDown) { dragCallback(event) }
         }} >
        <path d={roundedRectangle(x, y, width, height)}
              style={{ fill: mainFill, stroke: "#777", strokeWidth: 1 }} />
        <text x={x + 10} y={y + 22} fontSize={16} textAnchor="start"
              fontFamily="'Courier Prime', monospace" style={{ fill: "#FFF" }}>
          available units{ units[99] ? ", losses" : "" }:
        </text>
        <text x={x + 10} y={y + 44} fontSize={16} textAnchor="start"
              fontFamily="'Courier Prime', monospace" style={{ fill: "#FFF" }}>
          { map.game?.phase === gamePhaseType.Deploy ? "[select, then click on map]" :
              "[nothing to deploy]" }
        </text>
        {
          Object.entries(units).map((pair, i) => {
            const turn = Number(pair[0])
            const label = turn > 98 ? "losses" : (turn > 0 ? `turn ${turn}` : "setup")
            return (
              <g key={i}>
                <text x={x + 10} y={y + 120 + 106*i} fontSize={16} textAnchor="start"
                      fontFamily="'Courier Prime', monospace" style={{ fill: "#FFF" }}>
                  {label}
                </text>
                {
                  sortReinforcementList(Object.values(pair[1])).map((data, j) => {
                    const x0 = x + 84 + 90*j
                    const y0 = y + 72 + 106*i
                    const counter = new Counter(new Coordinate(x0, y0+5), data.counter, map, true)
                    counter.onMap = false
                    if (player === map.game?.currentPlayer) {
                      counter.reinforcement = { player, turn, key: data.id }
                    }
                    const r = map.game?.deployState
                    if (r && player === r.player && turn === r.turn && data.id === r.key) {
                      if (!counter.targetUF.selected) {
                        map.select(counter.targetUF)
                      }
                    } else if (counter.targetUF.selected) {
                        map.select(counter.targetUF)
                    }
                    counter.showDisabled = (map.game?.phase !== gamePhaseType.Deploy ||
                      map.game?.currentPlayer !== player || map.game.state !== 'in_progress' ||
                      map.game.turn !== turn) && turn !== 99
                    const count = (data.x || 1) - (data.used || 0)
                    const cb = () => { ovCallback({show: true, counters: [counter]})}
                    if (count < 1) {
                      counter.showDisabled = true
                      if (counter.targetUF.selected) {
                        map.select(counter.targetUF)
                      }
                      return (
                        <g key={j}>
                          <text x={x0} y={y0} fontSize={16} textAnchor="start"
                                fontFamily="'Courier Prime', monospace" style={{ fill: "#555" }}>
                            {data.x}x
                          </text>
                          <MapCounter counter={counter} ovCallback={cb} />
                        </g>
                      )
                    } else {
                      return (
                        <g key={j}>
                          <text x={x0} y={y0} fontSize={16} textAnchor="start"
                                fontFamily="'Courier Prime', monospace" style={{ fill: "#FFF" }}>
                            {data.used > 0 ? `${data.used}/${data.x}` : count}x
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
        { mouseDown ?
          <path d={roundedRectangle(x - 1000, y - 1000, width + 2000, height + 2000)}
                style={{ fill: "rgba(0,0,0,0)" }} /> : "" }
        {closeButton}
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
