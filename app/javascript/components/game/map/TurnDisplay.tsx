import React, { useEffect, useState } from "react";
import MapCounter from "./MapCounter";
import { baseCounterPath, roundedRectangle } from "../../../utilities/graphics";
import Map from "../../../engine/Map"
import { Coordinate, markerType } from "../../../utilities/commonTypes";
import Marker from "../../../engine/Marker";
import Counter from "../../../engine/Counter";

interface TurnDisplayProps {
  map: Map;
  xx: number;
  yy: number;
  hideCounters: boolean;
  // eslint-disable-next-line @typescript-eslint/ban-types
  ovCallback: Function;
}

export default function TurnDisplay({
  map, xx, yy, hideCounters, ovCallback
}: TurnDisplayProps) {
  const [base, setBase] = useState<JSX.Element | undefined>()
  const [turn, setTurn] = useState<JSX.Element | undefined>()

  useEffect(() => {
    const turns = map.game?.scenario.turns ?? 1
    setBase(
      <g>
        <path d={roundedRectangle(xx, yy, 100 + 90 * turns, 100)}
              style={{ fill: "#EEE", stroke: "#D5D5D5", strokeWidth: 1 }} />
        {
          [...Array(turns + 1).keys()].map(i => {
            const x = xx + 10 + 90 * i
            const y = yy + 10
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
  }, [xx, yy, map.game?.scenario.turns])

  useEffect(() => {
    if (!map || !map.game) { return }
    if (hideCounters) {
      setTurn(undefined)
    } else {
      const turn = map.game?.turn || 0
      const counter = new Counter(new Coordinate(xx + 10 + turn*90, yy+10), new Marker({
        type: markerType.Turn, v: map.game.playerOneNation,
        v2: map.game.playerTwoNation, mk: 1
      }), map, true)
      const cb = () => { ovCallback({ show: true, counters: [counter] }) }
      setTurn(<MapCounter counter={counter} ovCallback={cb} />)
    }
  }, [xx, yy, hideCounters, map.game?.scenario.turns])

  return (
    <g>
      {base}
      {turn}
    </g>
  )
}
