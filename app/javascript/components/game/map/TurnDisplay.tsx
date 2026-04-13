import React, { useEffect, useState } from "react";
import MapCounter from "./MapCounter";
import { circlePath, roundedRectangle } from "../../../utilities/graphics";
import Map from "../../../engine/Map"
import { Coordinate, markerType } from "../../../utilities/commonTypes";
import Marker from "../../../engine/Marker";
import Counter from "../../../engine/Counter";
import Game from "../../../engine/Game";

interface TurnDisplayProps {
  map: Map;
  xx: number;
  yy: number;
  hideCounters: boolean;
  small: 0 | 1;
  // eslint-disable-next-line @typescript-eslint/ban-types
  ovCallback: Function;
}

export default function TurnDisplay({
  map, xx, yy, hideCounters, small, ovCallback
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

  const offset = (game: Game, turn: number): number => {
    if (small === 0) { return 0 }
    return slots().slice(1).reduce((sum, n) => (turn >= n && n !== game.turn + 1) ? sum + 1 : sum, 0)
  }

  const totalOffset = (): number => {
    if (small === 1) {
      return (slots().length - 1) * 60
    }
    return 0
  }

  const shrink = (game: Game, turn: number): boolean => {
    if (game.turn === turn) { return false}
    if (small === 1 && game.turn !== turn) { return true }
    return false
  }

  useEffect(() => {
    let oldShift = 0
    setBase(
      <g>
        <path d={roundedRectangle(xx, yy, 460 + 15 * shifts(4) - totalOffset(), 100)}
              style={{ fill: "#EEE", stroke: "#D5D5D5", strokeWidth: 1 }} />
        {
          slots().map((n, i) => {
            if (!map.game) { return }
            const x = xx + 10 + 90 * i + shifts(i) * 15 - 60 * offset(map.game, n)
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
                <path d={roundedRectangle(x, y, shrink(map.game, n) ? 20 : 80, 80, 4)}
                      style={{ fill: "white", stroke: "black", strokeWidth: 1.5 }} />
                { small === 0 ?
                  <text x={x + 40} y={y + (i ? 50 : 44)} fontSize={i ? 40 : 20} textAnchor="middle"
                        fontFamily="'Courier Prime', monospace" style={{ fill: "#AAA" }}>
                    { n ? n : "setup" }
                  </text> :
                  <text x={x + (n ? 15 : 14)} y={y + 40} fontSize={18} textAnchor="middle"
                        fontFamily="'Courier Prime', monospace" style={{ fill: "#AAA" }}
                        transform={`rotate(-90, ${x + (n ? 15 : 14)},${y + 40})`} >
                    { n ? n : "setup" }
                  </text>
                }
              </g>
              )
            }
          )
        }
      </g>
    )
  }, [xx, yy, map.game?.scenario.turns, map.game?.turn, small])

  useEffect(() => {
    if (!map || !map.game) { return }
    if (hideCounters) {
      setTurn(undefined)
    } else {
      const x = xx + 10 + index()*90 + shifts(index()) * 15 - 60 * offset(map.game, slots()[index()])
      const counter = new Counter(
        new Coordinate(x, yy+10), new Marker({
          type: markerType.Turn, v: map.game.playerOneNation,
          v2: map.game.playerTwoNation, mk: 1
        }), map, true
      )
      const cb = () => { ovCallback({ show: true, counters: [counter] }) }
      setTurn(<MapCounter counter={counter} ovCallback={cb} />)
    }
  }, [xx, yy, hideCounters, map.game?.scenario.turns, map.game?.turn, small])

  return (
    <g>
      {base}
      {turn}
    </g>
  )
}
