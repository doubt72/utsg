import React, { useState } from "react";
import Map from "../../../engine/Map";
import { Coordinate } from "../../../utilities/commonTypes";
import Hex from "../../../engine/Hex";
import { circlePath, roundedRectangle, yMapOffset } from "../../../utilities/graphics";
import { stateType } from "../../../engine/control/state/BaseState";
import { moveActions, routActions } from "../../../engine/actions/BaseAction";
import { executeContextAction, translateAction } from "../../utilities/context";
import actionsAvailable from "../../../engine/control/actionsAvailable";
import Game from "../../../engine/Game";

interface MoveTrackOverlayProps {
  map: Map;
  updateCallback: () => void;
  scale: number;
  mapScale: number;
  svgRef: React.MutableRefObject<HTMLElement>;
}

export default function MoveTrackOverlay({
  map, updateCallback, scale, mapScale, svgRef }: MoveTrackOverlayProps
) {
  const [contextMenu, setContextMenu] = useState<JSX.Element | undefined>()

  const contextAction = (type: string) => {
    if (!map.game) { return }
    executeContextAction(map.game, undefined, type, updateCallback)
    setContextMenu(undefined)
    updateCallback()
  }

  const rightClick = (event: React.MouseEvent) => {
    event.preventDefault()
    if (!map.game) { return }
    const options = actionsAvailable(map.game, map.game.currentUser, false)
    const x = (event.clientX - svgRef.current.getBoundingClientRect().x)/scale/mapScale - 24
    const y = (event.clientY - svgRef.current.getBoundingClientRect().y)/scale/mapScale -
      yMapOffset/mapScale - 24 + (50 - 50/scale)/mapScale
    const filtered = options.filter(a => {
      return ![
        "sync", "wait", "none", "undo", "join", "leave", "start", "kick", "deploy", "help",
        "rally_pass", "unselect", "pass", "pass_cancel", "precip_check", "reaction_pass",
        "initiative", "weather_check", "fire_start_check",
      ].includes(a.type)
    }).map(a => a.type)
    const width = filtered.reduce((max, o) => {
      const length = translateAction(map.game as Game, undefined, o).length
      return max > length ? max : length
    }, 0) * 14.4 + 40
    const buttons = filtered.map((o, i) => {
      const text = translateAction(map.game as Game, undefined, o)
      return (
        <g key={`context-${i}`} >
          <path d={roundedRectangle(x + 8, y + 8 + i*36, width, 32, 5)} style={{ fill: "#EEE" }}
                onClick={() => contextAction(o)}
                onContextMenu={e => e.preventDefault()} />
          <text textAnchor="start" x={x + 35} y={y + 30 + i*36} fontSize={24}
                fontFamily="'Courier Prime', monospace"
                style={{ fill: "000"}}
                onClick={() => contextAction(o)}
                onContextMenu={e => e.preventDefault()} >
            {text}
          </text>
        </g>
      )
    })
    const height = filtered.length * 36 + 12
    setContextMenu(
      <g onMouseLeave={() => setContextMenu(undefined)} >
        <path d={roundedRectangle(x, y, width + 16, height)} style={{ fill: "rgba(0,0,0,0.2)" }} />
        { buttons }
      </g>
    )
    updateCallback()
  }

  const hexes = (): Hex[] => {
    if (map.game?.gameState?.type === stateType.Move) {
      return map.game.moveState.path.map(p => map.hexAt(new Coordinate(p.x, p.y)) as Hex)
    } else if (map.game?.gameState?.type === stateType.Assault) {
      return map.game.assaultState.path.map(p => map.hexAt(new Coordinate(p.x, p.y)) as Hex)
    } else if (map.game?.gameState?.type === stateType.FireDisplace) {
      return map.game.assaultState.path.map(p => map.hexAt(new Coordinate(p.x, p.y)) as Hex)
    }
    const lastSigAction = map.game?.lastSignificantAction
    if (lastSigAction && moveActions.
          includes(lastSigAction.data.action) && lastSigAction.data.path) {
      return lastSigAction.data.path.map(p => map.hexAt(new Coordinate(p.x, p.y)) as Hex)
    }
    // TODO: if last sig action was fire, check for displace
    return []
  }

  const hexCenters = () => {
    const action = map.game?.lastSignificantAction?.data.action ?? ""
    // TODO: if last sig action was fire, check for displace here
    const routing = routActions.includes(action)
    let first = true
    return hexes().map((h, i) => {
      const offset = Math.max(map.counterDataAt(h.coord).length * 5 - 5, 0)
      const x = h.xOffset + offset
      const y = h.yOffset - offset
      const fill = first ? "#AAA" : "#DDD"
      if (!routing) { first = false }
      if (routing) {
        return <path key={`${i}-c`} d={circlePath(new Coordinate(x, y), 12)}
                    style={{ fill, stroke: "#777", strokeWidth: 4 }} />
      } else {
        return <path key={`${i}-c`} d={circlePath(new Coordinate(x, y), 12)}
                    style={{ fill, stroke: "#777", strokeWidth: 4 }}
                    onContextMenu={e => rightClick(e)}/>
      }
    })
  }

  const hexTracks = () => {
    const rc: JSX.Element[] = []
    const hx = hexes()
    for (let i = 1; i < hx.length; i++) {
      const offset1 = Math.max(map.counterDataAt(hx[i-1].coord).length * 5 - 5, 0)
      const x1 = hx[i-1].xOffset + offset1
      const y1 = hx[i-1].yOffset - offset1
      const offset2 = Math.max(map.counterDataAt(hx[i].coord).length * 5 - 5, 0)
      const x2 = hx[i].xOffset + offset2
      const y2 = hx[i].yOffset - offset2
      rc.push(
        <g key={`${i}-g`}>
          <line key={`${i}-la`} x1={x1} y1={y1} x2={x2} y2={y2}
                style={{ stroke: "#DDD", strokeWidth: 4 }} />
          <line key={`${i}-lb`} x1={x1} y1={y1} x2={x2} y2={y2}
                style={{ stroke: "#333", strokeWidth: 4, strokeDasharray: "5, 5" }} />
        </g>
      )
    }
    return rc
  }

  const track = () => {
    if (hexes().length < 2) { return }
    return (
      <g>
        { hexTracks() }
        { hexCenters() }
        { contextMenu }
      </g>
    )
  }

  return track()
}