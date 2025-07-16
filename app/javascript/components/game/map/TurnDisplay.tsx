import React, { useEffect, useState } from "react";
import MapCounter from "./MapCounter";
import { baseCounterPath, circlePath, roundedRectangle } from "../../../utilities/graphics";
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

  const slots = (): number[] => {
    const turns = map.game?.scenario.turns ?? 1
    const current = map.game?.turn || 0
    if (current < 2) {
      return [0, 1, 2].concat([turns - 1, turns])
    } else if (current > turns - 2) {
      return [0, 1].concat([turns - 2, turns - 1, turns])
    } else {
      return [0].concat([current - 1, current, current + 1]).concat([turns])
    }
  }

  const index = (): number => {
    const turns = map.game?.scenario.turns ?? 1
    const current = map.game?.turn || 0
    if (current < 3) {
      return current
    } else if (current > turns - 2) {
      return current - turns + 4
    } else {
      return 2
    }
  }

  const shifts = (index: number): number => {
    const turns = map.game?.scenario.turns ?? 1
    const current = map.game?.turn || 0
    if (current < 2) {
      return index > 2 ? 1 : 0
    } else if (current < 3) {
      return index > 3 ? 1 : 0
    } else if (current > turns - 2) {
      return index > 1 ? 1 : 0
    } else {
      if (current !== turns - 2 && index > 3) { return 2 }
      return index > 0 ? 1 : 0
    }
  }

  useEffect(() => {
    let oldShift = 0
    setBase(
      <g>
        <path d={roundedRectangle(xx, yy, 460 + 15 * shifts(4), 100)}
              style={{ fill: "#EEE", stroke: "#D5D5D5", strokeWidth: 1 }} />
        {
          slots().map((n, i) => {
            const x = xx + 10 + 90 * i + shifts(i) * 15
            const y = yy + 10
            let spacer = undefined
            if (shifts(i) > oldShift) {
              oldShift = shifts(i)
              spacer = <g>
                <path d={circlePath(new Coordinate(x - 12.5, y + 30), 3)} style={{ fill: "#777" }} />
                <path d={circlePath(new Coordinate(x - 12.5, y + 40), 3)} style={{ fill: "#777" }} />
                <path d={circlePath(new Coordinate(x - 12.5, y + 50), 3)} style={{ fill: "#777" }} />
              </g>
            }
            return (
              <g key={i}>
                { spacer }
                <path d={baseCounterPath(x, y)}
                      style={{ fill: "white", stroke: "black", strokeWidth: 1.5 }} />
                <text x={x + 40} y={y + (i ? 50 : 44)} fontSize={i ? 40 : 20} textAnchor="middle"
                      fontFamily="'Courier Prime', monospace" style={{ fill: "#AAA" }}>
                  { n ? n : "setup" }
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
      const counter = new Counter(
        new Coordinate(xx + 10 + index()*90 + shifts(index()) * 15, yy+10), new Marker({
          type: markerType.Turn, v: map.game.playerOneNation,
          v2: map.game.playerTwoNation, mk: 1
        }), map, true
      )
      const cb = () => { ovCallback({ show: true, counters: [counter] }) }
      setTurn(<MapCounter counter={counter} ovCallback={cb} />)
    }
  }, [xx, yy, hideCounters, map.game?.scenario.turns, map.game?.turn])

  return (
    <g>
      {base}
      {turn}
    </g>
  )
}
