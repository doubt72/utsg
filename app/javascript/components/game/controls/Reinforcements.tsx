import React, { useEffect, useState } from "react";
import { baseCounterPath, nationalColors, roundedRectangle } from "../../../utilities/graphics";
import Map from "../../../engine/Map";
import { Player } from "../../../utilities/commonTypes";
import { gamePhaseType } from "../../../engine/Game";

interface OverlayProps {
  x: number;
  y: number;
  player: Player;
  fillColor: string;
  callback: (x: number, y: number, player: Player) => void;
  mouseIn: () => void;
  mouseOut: () => void;
}

function Overlay({ x, y, player, callback, mouseIn, mouseOut, fillColor}: OverlayProps) {
  return (
    <path d={baseCounterPath(x, y)} style={{ fill: fillColor }}
          onClick={() => callback(x, y, player)}
          onMouseEnter={() => mouseIn()}
          onMouseLeave={() => mouseOut()} />
  )
}

interface ReinforcementsProps {
  map: Map;
  xx: number;
  yy: number;
  callback: (x: number, y: number, player: Player) => void;
  update: { key: boolean };
}

export default function Reinforcements({ map, xx, yy, callback, update }: ReinforcementsProps) {
  const [base, setBase] = useState<JSX.Element | undefined>()
  const [hover, setHover] = useState<JSX.Element | undefined>()

  const enter = () => {
    setHover(h => {
      if (h) {
        const x = h.props.x
        const y = h.props.y
        const player = h.props.player
        return <Overlay x={x} y={y} player={player} callback={callback} mouseIn={enter} mouseOut={exit}
                        fillColor="rgba(255,255,255,0.1)" />
      }
      return h
    })
  }

  const exit = () => {
    setHover(h => {
      if (h) {
        const x = h.props.x
        const y = h.props.y
        const player = h.props.player
        return <Overlay x={x} y={y} player={player} callback={callback} mouseIn={enter} mouseOut={exit}
                        fillColor="rgba(0,0,0,0)" />
      }
      return h
    })
  }

  const nation = (x: number, y: number, n: string, player: Player, enabled: boolean) => {
    const overlay = enabled ? (
      <Overlay x={x} y={y} player={player} callback={callback} mouseIn={enter} mouseOut={exit}
               fillColor="rgba(0,0,0,0)" />
    ) : (
      <path d={baseCounterPath(x, y)} style={{ fill: "rgba(0,0,0,0.33)" }}
            onClick={() => callback(x, y, player)}/>
    )
    if (enabled) { setHover(() => overlay) }
    return (
      <g>
        <path d={baseCounterPath(x, y)}
              style={{ fill: nationalColors[n], stroke: "black", strokeWidth: 1 }}/>
        <image width={80} height={80} x={x} y={y} href={`/assets/units/${n}.svg`}/>
        {enabled ? undefined : overlay}
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
      {hover}
    </g>
  )
}
