import React, { useEffect, useState } from "react";
import { baseCounterPath, nationalColors, roundedRectangle } from "../../../utilities/graphics";
import Map from "../../../engine/Map";
import { Coordinate, Player } from "../../../utilities/commonTypes";
import { gamePhaseType } from "../../../engine/Game";
import { mapHelpLayout } from "../../../engine/support/help";
import { HelpOverlay } from "../map/Help";

interface ReinforcementsProps {
  map: Map;
  xx: number;
  yy: number;
  maxX: number;
  maxY: number;
  scale: number;
  svgRef: React.MutableRefObject<HTMLElement>;
  callback: (x: number, y: number, player: Player) => void;
  update: { key: boolean };
}

export default function Reinforcements(
  { map, xx, yy, maxX, maxY, scale, svgRef, callback, update }: ReinforcementsProps
) {
  const [base, setBase] = useState<JSX.Element | undefined>()
  const [helpDisplay, setHelpDisplay] = useState<JSX.Element | undefined>()

  const nation = (x: number, y: number, n: string, player: Player, enabled: boolean) => {
    const faction = player === 1 ? "allied" : "axis"
    const overlay = enabled ? (
      <path className="svg-button-hover" d={baseCounterPath(x, y)}
            onClick={() => callback(player === 1 ? x : x - 90, y, player)}
            onMouseLeave={() => setHelpDisplay(undefined)}
            onMouseMove={e => updateHelpOverlay(e, faction)} />
    ) : (
      <path d={baseCounterPath(x, y)} style={{ fill: "rgba(0,0,0,0.33)" }}
            onClick={() => callback(player === 1 ? x : x - 90, y, player)}
            onMouseLeave={() => setHelpDisplay(undefined)}
            onMouseMove={e => updateHelpOverlay(e, faction)} />
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

  const updateHelpOverlay = (e: React.MouseEvent, side: string) => {
    const text = [
      `${side} units:`,
      "reinforcements and casualties",
    ]
    if (svgRef.current) {
      const x = e.clientX / scale - svgRef.current.getBoundingClientRect().x + 10
      const y = e.clientY / scale - svgRef.current.getBoundingClientRect().y + 10 - 200 / scale + 200
      const layout = mapHelpLayout(new Coordinate(x, y), new Coordinate(maxX, maxY), text, scale)
      if (!layout.texts) { return }
      setHelpDisplay(HelpOverlay(layout))
    }
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
  }, [xx, yy, update, map.game?.lastActionIndex])

  return (
    <g>
      {base}
      {helpDisplay}
    </g>
  )
}
