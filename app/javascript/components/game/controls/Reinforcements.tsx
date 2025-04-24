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
}

export default function Reinforcements({ map, xx, yy, callback }: ReinforcementsProps) {
  const [base, setBase] = useState<JSX.Element | undefined>()

  const nation = (x: number, y: number, n: string, player: Player, enabled: boolean) => {
    const showDisabled = enabled ? (
      <path d={baseCounterPath(x, y)} style={{ fill: "rgba(0,0,0,0)" }}
      onMouseEnter={() => callback(x, y, player)}/>
    ) : (
      <path d={baseCounterPath(x, y)} style={{ fill: "rgba(0,0,0,0.33)" }}
      onMouseEnter={() => callback(x, y, player)}/>
    )
    return (
      <g>
        <path d={baseCounterPath(x, y)}
              style={{ fill: nationalColors[n], stroke: "black", strokeWidth: 1 }}/>
        <image width={80} height={80} x={x} y={y} href={`/assets/units/${n}.svg`}/>
        {showDisabled}
      </g>
    )
  }

  const nationOne = (x: number, y: number) => {
    return nation(
      x, y, map.game?.playerOneNation as string, 1,
      map.game?.phase === gamePhaseType.Placement && map.game.currentPlayer === 1
    );
  }

  const nationTwo = (x: number, y: number) => {
    return nation(
      x, y, map.game?.playerTwoNation as string, 2,
      map.game?.phase === gamePhaseType.Placement && map.game.currentPlayer === 2
    )
  }

  useEffect(() => {
    setBase(
      <g>
        <path d={roundedRectangle(xx, yy, 248, 100)}
              style={{ fill: "#EEE", stroke: "#D5D5D5", strokeWidth: 1 }} />
        <text x={xx + 190} y={yy + 22} fontSize={16} textAnchor="start"
              fontFamily="'Courier Prime', monospace" style={{ fill: "#000" }}>
          units
        </text>
        {nationOne(xx + 10, yy + 10)}
        {nationTwo(xx + 100, yy + 10)}
      </g>
    )
  }, [xx, yy])

  return (
    <g>
      {base}
    </g>
  )
}
