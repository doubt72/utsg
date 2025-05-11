import React, { useEffect, useState } from "react";
import { baseCounterPath, nationalColors, roundedRectangle } from "../../../utilities/graphics";
import Map from "../../../engine/Map";
import { Player } from "../../../utilities/commonTypes";
import { gamePhaseType } from "../../../engine/Game";

interface ReinforcementsProps {
  map: Map;
  xx: number;
  yy: number;
  callback: (x: number, y: number, player: Player) => void;
  update: { key: boolean };
}

export default function Reinforcements({ map, xx, yy, callback, update }: ReinforcementsProps) {
  const [base, setBase] = useState<JSX.Element | undefined>()

  const nation = (x: number, y: number, n: string, player: Player, enabled: boolean) => {
    const overlay = enabled ? (
      <path className="svg-button-hover" d={baseCounterPath(x, y)}
            onClick={() => callback(player === 1 ? x : x - 90, y, player)} />
    ) : (
      <path d={baseCounterPath(x, y)} style={{ fill: "rgba(0,0,0,0.33)" }}
            onClick={() => callback(player === 1 ? x : x - 90, y, player)}/>
    )
    return (
      <g>
        <path d={baseCounterPath(x, y)}
              style={{ fill: nationalColors[n], stroke: "black", strokeWidth: 2 }}/>
        <image width={80} height={80} x={x} y={y} href={`/assets/units/${n}.svg`}/>
        {overlay}
      </g>
    )
  }

  const nationOne = (x: number, y: number) => {
    const enabled = map.game?.phase === gamePhaseType.Deployment &&
      map.game.currentPlayer === 1 && map.game.state === "in_progress"
    return nation(x, y, map.game?.playerOneNation as string, 1, enabled);
  }

  const nationTwo = (x: number, y: number) => {
    const enabled = map.game?.phase === gamePhaseType.Deployment &&
      map.game.currentPlayer === 2 && map.game.state === "in_progress"
    return nation(x, y, map.game?.playerTwoNation as string, 2, enabled)
  }

  useEffect(() => {
    // do nothing
  }, [update])

  useEffect(() => {
    const deployment = map.game?.phase === gamePhaseType.Deployment
    setBase(
      <g>
        <path d={roundedRectangle(xx, yy, deployment ? 305 : 190 , 100)}
              style={{ fill: "#EEE", stroke: "#D5D5D5", strokeWidth: 1 }} />
        { deployment ?
          (
            <g>
              <text x={xx + 190} y={yy + 22} fontSize={16} textAnchor="start"
                    fontFamily="'Courier Prime', monospace" style={{ fill: "#000" }}>
                select icon
              </text>
              <text x={xx + 190} y={yy + 40} fontSize={16} textAnchor="start"
                    fontFamily="'Courier Prime', monospace" style={{ fill: "#000" }}>
                to deploy
              </text>
              <text x={xx + 190} y={yy + 58} fontSize={16} textAnchor="start"
                    fontFamily="'Courier Prime', monospace" style={{ fill: "#000" }}>
                units
              </text>
            </g>
          ) : undefined
        }
        <text x="0" y="0" fontSize={16} textAnchor="end"
                 fontFamily="'Courier Prime', monospace" style={{ fill: "#AAA" }}
                 transform={`translate(${xx + 195 + (deployment ? 115 : 0)},${yy + 95}) rotate(90)`}>
          units
        </text>
        {nationOne(xx + 10, yy + 10)}
        {nationTwo(xx + 100, yy + 10)}
      </g>
    )
  }, [xx, yy, update, map.game?.lastMoveIndex])

  return (
    <g>
      {base}
    </g>
  )
}
