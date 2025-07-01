import React, { useEffect, useState } from "react";
import MapCounter from "./MapCounter";
import { baseCounterPath, roundedRectangle } from "../../../utilities/graphics";
import Map from "../../../engine/Map";
import Marker from "../../../engine/Marker";
import { Coordinate, markerType } from "../../../utilities/commonTypes";
import Counter from "../../../engine/Counter";
import Game from "../../../engine/Game";

interface InitiativeDisplayProps {
  map: Map;
  xx: number;
  yy: number;
  hideCounters: boolean;
  // eslint-disable-next-line @typescript-eslint/ban-types
  ovCallback: Function;
}

export default function InitiativeDisplay({
  map, xx, yy, hideCounters, ovCallback
}: InitiativeDisplayProps) {
  const [base, setBase] = useState<JSX.Element | undefined>()
  const [initiative, setInitiative] = useState<JSX.Element | undefined>()

  const nationOne = () => {
    const n = map.game?.playerOneNation
    return {
      fill: `url(#nation-${n}-16)`, strokeWidth: 1, stroke: "#000"
    }
  }

  const nationTwo = () => {
    const n = map.game?.playerTwoNation
    return {
      fill: `url(#nation-${n}-16)`, strokeWidth: 1, stroke: "#000"
    }
  }

  const xOffset = (i: number) => {
    if (i < 0) { return xx + 10 }
    if (i > 0) { return xx + 100 }
    return xx + 55
  }

  const yOffset = (i: number) => {
    return yy + Math.abs(i)*90 + 32
  }

  const roll = (i: number) => {
    return ["-", 11, 14, 16, 17, 18, 19, 20][Math.abs(i)]
  }

  useEffect(() => {
    setBase(
      <g>
        <path d={roundedRectangle(xx, yy, 190, 752)}
              style={{ fill: "#EEE", stroke: "#D5D5D5", strokeWidth: 1 }} />
        <text x={xx + 10} y={yy + 20} fontSize={16} textAnchor="start"
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
        <circle cx={xx + 26} cy={yy + 72} r={16} style={nationOne()}/>
        <circle cx={xx + 164} cy={yy + 72} r={16} style={nationTwo()}/>
      </g>
    )
  }, [xx, yy, map.alliedDir, map.axisDir])

  useEffect(() => {
    if (!map) { return }
    if (hideCounters) {
      setInitiative(undefined)
    } else {
      const game = map.game as Game
      const nation = game.currentPlayer === 1 ?
        game.scenario.alliedFactions[0] :
        game.scenario.axisFactions[0]
      const index = game.initiative
      const counter = new Counter(
        new Coordinate(xOffset(index), yOffset(index)),
        new Marker({
          type: markerType.Initiative, nation: nation, i: nation, mk: 1
        }), map, true
      )
      const cb = () => { ovCallback({ show: true, counters: [counter] }) }
      setInitiative(<MapCounter counter={counter} ovCallback={cb} />)
    }
  }, [xx, yy, hideCounters, map.game?.initiative, map.game?.currentPlayer])

  return (
    <g>
      {base}
      {initiative}
    </g>
  )
}
