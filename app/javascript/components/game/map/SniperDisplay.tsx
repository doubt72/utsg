import React, { useEffect, useState } from "react";
import MapCounter from "./MapCounter";
import { baseCounterPath, roundedRectangle } from "../../../utilities/graphics";
import Counter from "../../../engine/Counter";
import { Coordinate } from "../../../utilities/commonTypes";
import Map from "../../../engine/Map";

interface SniperDisplayProps {
  map: Map;
  xx: number,
  yy: number,
  hideCounters: boolean;
  // eslint-disable-next-line @typescript-eslint/ban-types
  ovCallback: Function;
}

export default function SniperDisplay({
  map, xx, yy, hideCounters, ovCallback
}: SniperDisplayProps) {
  const [base, setBase] = useState<JSX.Element | undefined>()
  const [sniperOne, setSniperOne] = useState<JSX.Element | undefined>()
  const [sniperTwo, setSniperTwo] = useState<JSX.Element | undefined>()

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

  useEffect(() => {
    setBase(
      <g>
        <path d={roundedRectangle(xx, yy, 272, 100)}
              style={{ fill: "#EEE", stroke: "#D5D5D5", strokeWidth: 1 }} />
        <circle cx={xx + 26} cy={yy + 50} r={16} style={nationOne()}/>
        <path d={baseCounterPath(xx + 52, yy + 10)}
              style={{ fill: "white", stroke: "black", strokeWidth: 1.5 }} />
        <text x={xx + 92} y={yy + 44} fontSize={16} textAnchor="middle"
              fontFamily="'Courier Prime', monospace" style={{ fill: "#000" }}>
          no
        </text>
        <text x={xx + 92} y={yy + 60} fontSize={16} textAnchor="middle"
              fontFamily="'Courier Prime', monospace" style={{ fill: "#000" }}>
          sniper
        </text>
        <path d={baseCounterPath(xx + 142, yy + 10)}
              style={{ fill: "white", stroke: "black", strokeWidth: 1.5 }} />
        <text x={xx + 182} y={yy + 44} fontSize={16} textAnchor="middle"
              fontFamily="'Courier Prime', monospace" style={{ fill: "#000" }}>
          no
        </text>
        <text x={xx + 182} y={yy + 60} fontSize={16} textAnchor="middle"
              fontFamily="'Courier Prime', monospace" style={{ fill: "#000" }}>
          sniper
        </text>
        <circle cx={xx + 246} cy={yy + 50} r={16} style={nationTwo()}/>
      </g>
    )
  }, [xx, yy])

  useEffect(() => {
    if (!map) { return }
    if (hideCounters) {
      setSniperOne(undefined)
      setSniperTwo(undefined)
    } else {
      if (map.game && map.game.alliedSniper) {
        const counter = new Counter(
          new Coordinate(xx + 52, yy + 10), map.game.alliedSniper, map, true
        )
        const cb = () => { ovCallback({ show: true, counters: [counter] }) }
        setSniperOne(<MapCounter counter={counter} ovCallback={cb} />)
      }
      if (map.game && map.game.axisSniper) {
        const counter = new Counter(
          new Coordinate(xx + 142, yy + 10), map.game.axisSniper, map, true
        )
        const cb = () => { ovCallback({ show: true, counters: [counter] }) }
        setSniperTwo(<MapCounter counter={counter} ovCallback={cb} />)
      }
    }
  }, [xx, yy, hideCounters])

  return (
    <g>
      {base}
      {sniperOne}
      {sniperTwo}
    </g>
  )
}
