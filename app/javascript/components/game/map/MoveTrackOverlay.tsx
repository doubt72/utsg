import React, { useEffect, useState } from "react";
import Map from "../../../engine/Map";
import { Coordinate } from "../../../utilities/commonTypes";
import Hex from "../../../engine/Hex";
import { circlePath, roundedRectangle, yMapOffset } from "../../../utilities/graphics";
import { stateType } from "../../../engine/control/state/BaseState";
import { moveActions, routActions } from "../../../engine/actions/BaseAction";
import { executeContextAction, translateAction } from "../../utilities/context";
import actionsAvailable from "../../../engine/control/actionsAvailable";
import Game from "../../../engine/Game";
import { mapActionButtons } from "../../../engine/support/hexLayout";
import { actionButtonHelpLayout } from "../../../engine/support/help";
import { HelpOverlay } from "./Help";

interface MoveTrackOverlayProps {
  map: Map;
  updateCallback: () => void;
  selectCallback: (x: number, y: number) => void;
  scale: number;
  mapScale: number;
  maxX: number;
  maxY: number;
  xOffset: number;
  yOffset: number;
  svgRef: React.MutableRefObject<HTMLElement>;
}

export default function MoveTrackOverlay({
  map, updateCallback, selectCallback, scale, mapScale, maxX, maxY, xOffset, yOffset, svgRef }: MoveTrackOverlayProps
) {
  const [hexTrack, setHexTrack] = useState<JSX.Element[]>([])
  const [hexCenters, setHexCenters] = useState<JSX.Element[]>([])
  const [contextMenu, setContextMenu] = useState<JSX.Element | undefined>()

  const [actionHelpDisplay, setActionHelpDisplay] = useState<JSX.Element | undefined>()
  const [actionControls, setActionControls] = useState<JSX.Element[]>([])

  const contextAction = (type: string) => {
    if (!map.game) { return }
    executeContextAction(map.game, undefined, type, updateCallback)
    setContextMenu(undefined)
    updateCallback()
  }

  const buttonAction = (type: string) => {
    if (!map.game) { return }
    executeContextAction(map.game, undefined, type, updateCallback)
    setActionControls([])
    updateCallback()
  }

  const rightClick = (e: React.MouseEvent) => {
    e.preventDefault()
    if (!map.game) { return }
    const options = actionsAvailable(map.game, map.game.currentUser, false)
    const x = ((e.clientX - svgRef.current.getBoundingClientRect().x) / scale +
      map.previewXSize * xOffset)/mapScale - 24
    const y = ((e.clientY - svgRef.current.getBoundingClientRect().y - yMapOffset + 100) / scale -
      100 + map.ySize * yOffset)/mapScale - 24
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

  const showButtonHelp = (e: React.MouseEvent, type: string) => {
    if (!map.game) { return }
    const x = ((e.clientX - svgRef.current.getBoundingClientRect().x + 10) / scale +
      map.previewXSize * xOffset)/mapScale
    const y = ((e.clientY - svgRef.current.getBoundingClientRect().y + 10 - yMapOffset + 100) / scale -
      100 + map.ySize * yOffset)/mapScale
    const loc = new Coordinate(x, y)
    const max = new Coordinate(maxX, maxY)
    setActionHelpDisplay(HelpOverlay(actionButtonHelpLayout(loc, max, scale, type)))
  }

  const hexes = (): Hex[] => {
    if (map.game?.gameState?.type === stateType.Move) {
      return map.game.moveState.path.map(p => map.hexAt(new Coordinate(p.x, p.y)) as Hex)
    } else if (map.game?.gameState?.type === stateType.Assault) {
      return map.game.assaultState.path.map(p => map.hexAt(new Coordinate(p.x, p.y)) as Hex)
    } else if (map.game?.gameState?.type === stateType.FireDisplace) {
      return map.game.fireDisplaceState.path.map(p => map.hexAt(new Coordinate(p.x, p.y)) as Hex)
    }
    const lastSigAction = map.game?.lastSignificantAction
    if (lastSigAction && moveActions.
          includes(lastSigAction.data.action) && lastSigAction.data.path) {
      return lastSigAction.data.path.map(p => map.hexAt(new Coordinate(p.x, p.y)) as Hex)
    }
    // TODO: if last sig action was fire, check for displace
    return []
  }

  useEffect(() => {
    const track: JSX.Element[] = []
    const hx = hexes()
    for (let i = 1; i < hx.length; i++) {
      const offset1 = Math.max(map.counterDataAt(hx[i-1].coord).length * 5 - 5, 0)
      const x1 = hx[i-1].xOffset + offset1
      const y1 = hx[i-1].yOffset - offset1
      const offset2 = Math.max(map.counterDataAt(hx[i].coord).length * 5 - 5, 0)
      const x2 = hx[i].xOffset + offset2
      const y2 = hx[i].yOffset - offset2
      track.push(
        <g key={`${i}-g`}>
          <line key={`${i}-la`} x1={x1} y1={y1} x2={x2} y2={y2}
                style={{ stroke: "#DDD", strokeWidth: 4 }} />
          <line key={`${i}-lb`} x1={x1} y1={y1} x2={x2} y2={y2}
                style={{ stroke: "#333", strokeWidth: 4, strokeDasharray: "5, 5" }} />
        </g>
      )
    }
    setHexTrack(track)
  }, [map.game?.actionPathLength, map.game?.actionPathDir, map.game?.actionTurretDir])

  useEffect(() => {
    const action = map.game?.lastSignificantAction?.data.action ?? ""
    // TODO: if last sig action was fire, check for displace here
    const routing = routActions.includes(action)
    let first = true
    const allHexes = hexes()
    const lastIndex = allHexes.length > 1 ? allHexes.length - 1 : -1
    if (lastIndex < 0) { setActionControls([]) }
    setHexCenters(allHexes.map((h, i) => {
      const loc = h.coord
      const offset = Math.max(map.counterDataAt(h.coord).length * 5 - 5, 0)
      const x = h.xOffset + offset
      const y = h.yOffset - offset
      const fill = first ? "#AAA" : "#DDD"
      if (!routing) { first = false }
      const buttons: JSX.Element[] = []
      if (i === lastIndex) {
        const controls = mapActionButtons(map, x, y + 10, loc)
        for (const c of controls) {
          buttons.push(
            <g key={`${c.text}`}
                onClick={() => buttonAction(c.action)}
                onMouseMove={(e: React.MouseEvent) => { showButtonHelp(e, c.action) }}
                onMouseLeave={() => { setActionHelpDisplay(undefined) }}
                onContextMenu={e => e.preventDefault()} >
              <path d={c.path} style={{ fill: c.color, strokeWidth: 2, stroke: "#000" }} />
              <text textAnchor="middle" fontFamily="'Courier Prime', monospace" x={c.tX} y={c.tY}
                    fontSize={c.size} style={{ fill: c.tColor }}>
                {c.text}
              </text>
            </g>
          )
        }
        setActionControls(buttons)
        setActionHelpDisplay(undefined)
      }
      if (routing) {
        return <path key={`${i}-c`} d={circlePath(new Coordinate(x, y), 12)}
                     style={{ fill, stroke: "#777", strokeWidth: 4 }} />
      } else if (map.game?.gameState?.type === stateType.Move) {
        return (
          <g key={`${i}-c`} >
            <path d={circlePath(new Coordinate(x, y), 12)}
                  style={{ fill, stroke: "#777", strokeWidth: 4 }}
                  onClick={() => selectCallback(loc.x, loc.y)}
                  onContextMenu={e => rightClick(e)}/>
          </g>
        )
      } else {
        return (
          <g key={`${i}-c`} >
            <path d={circlePath(new Coordinate(x, y), 12)}
                  style={{ fill, stroke: "#777", strokeWidth: 4 }}
                  onContextMenu={e => rightClick(e)}/>
          </g>
        )
      }
    }))
  }, [
    map.game?.actionPathLength, map.game?.actionPathDir, map.game?.actionTurretDir, yOffset, xOffset, scale, mapScale
  ])

  const track = () => {
    if (hexes().length < 2) { return }
    return (
      <g>
        { hexTrack }
        { hexCenters }
        { actionControls }
        { contextMenu }
        { actionHelpDisplay }
      </g>
    )
  }

  return track()
}