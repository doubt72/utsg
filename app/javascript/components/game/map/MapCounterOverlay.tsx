import React, { useEffect, useState } from "react";
import MapCounter from "./MapCounter";
import MapCounterOverlayHelp from "./MapCounterOverlayHelp";
import Counter from "../../../engine/Counter";
import { Coordinate, CounterSelectionTarget, markerType, unitType } from "../../../utilities/commonTypes";
import Map from "../../../engine/Map";
import { clearColor, counterOutline, roundedRectangle } from "../../../utilities/graphics";
import { counterActionButtons, counterInfoBadges, counterPath } from "../../../engine/support/counterLayout";
import { HelpOverlay } from "./Help";
import {
  actionButtonHelpLayout,
  counterCloseCombatHelpLayout, counterFireHelpLayout, counterMoraleHelpLayout, counterRallyHelpLayout,
  counterRoutHelpLayout } from "../../../engine/support/help";
import Unit from "../../../engine/Unit";
import { gamePhaseType } from "../../../engine/support/gamePhase";
import Game, { closeProgress } from "../../../engine/Game";
import { stateType } from "../../../engine/control/state/BaseState";
import { selectable } from "../../../engine/control/select";
import actionsAvailable from "../../../engine/control/actionsAvailable";
import { executeContextAction, translateAction } from "../../utilities/context";

interface MapCounterOverlayProps {
  map: Map;
  setOverlay: (target: { show: boolean, x: number, y: number }) => void;
  selectionCallback: (target: CounterSelectionTarget) => void;
  updateCallback: () => void;
  xx?: number;
  yy?: number;
  mapScale: number;
  scale: number;
  shiftX: number;
  shiftY: number;
  maxX: number;
  maxY: number;
  counters?: Counter[];
  svgRef: React.MutableRefObject<HTMLElement>;
}

export default function MapCounterOverlay({
  map, setOverlay, selectionCallback, updateCallback, xx, yy, mapScale, scale, shiftX, shiftY, maxX, maxY,
  counters, svgRef
}: MapCounterOverlayProps) {
  const [overlayDisplay, setOverlayDisplay] = useState<JSX.Element | undefined>()
  const [helpDisplay, setHelpDisplay] = useState<JSX.Element | undefined>()
  const [actionHelpDisplay, setActionHelpDisplay] = useState<JSX.Element | undefined>()
  const [contextMenu, setContextMenu] = useState<JSX.Element | undefined>()
  const [update, setUpdate] = useState(0)

  const [actionControls, setActionControls] = useState<JSX.Element[]>([])

  const contextAction = (type: string, target: CounterSelectionTarget) => {
    if (!map.game) { return }
    executeContextAction(map.game, target, type, updateCallback)
    setContextMenu(undefined)
    updateCallback()
  }

  const buttonAction = (type: string, target: CounterSelectionTarget) => {
    if (!map.game) { return }
    executeContextAction(map.game, target, type, updateCallback)
    setActionControls([])
    setUpdate(s => s + 1)
    updateCallback()
  }

  const rightClick = (event: React.MouseEvent, target?: CounterSelectionTarget) => {
    event.preventDefault()
    if (!map.game || !target) { return }
    if (target.target.type == "reinforcement") { return }
    const unit = target.counter.unit
    const sel = selectable(map, target)
    if (!sel) {
      map.game.addMessage("can't select counter")
    } else {
      const options = unit.selected || unit.targetSelected ?
        actionsAvailable(map.game, map.game.currentUser, false) : []
      if (!unit.selected || sel) { options.unshift({ type: "select" }) }
      const x = (event.clientX - svgRef.current.getBoundingClientRect().x + 10) / scale - 36
      const y = (event.clientY - svgRef.current.getBoundingClientRect().y + 10) / scale - 36
      const filtered = options.filter(a => {
        return ![
          "sync", "wait", "none", "undo", "join", "leave", "start", "kick", "deploy", "help",
          "rally_pass", "unselect", "pass", "pass_cancel", "precip_check", "reaction_pass",
          "initiative", "weather_check", "fire_start_check",
        ].includes(a.type)
      }).map(a => a.type)
      if (filtered.length < 1) { return }
      const width = filtered.reduce((max, o) => {
        const length = translateAction(map.game as Game, target, o).length
        return max > length ? max : length
      }, 0) * 14.4 + 40
      const buttons = filtered.map((o, i) => {
        const text = translateAction(map.game as Game, target, o)
        return (
          <g key={`context-${i}`} >
            <path d={roundedRectangle(x + 8, y + 8 + i*36, width, 32, 5)} style={{ fill: "#EEE" }}
                  onClick={() => contextAction(o, target)}
                  onContextMenu={e => e.preventDefault()} />
            <text textAnchor="start" x={x + 35} y={y + 30 + i*36} fontSize={24}
                  fontFamily="'Courier Prime', monospace"
                  style={{ fill: "000"}}
                  onClick={() => contextAction(o, target)}
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
    }
    setUpdate(s => s + 1)
    updateCallback()
  }

  const showButtonHelp = (event: React.MouseEvent, type: string) => {
    if (!map.game) { return }
    const x = (event.clientX - svgRef.current.getBoundingClientRect().x + 10) / scale
    const y = (event.clientY - svgRef.current.getBoundingClientRect().y + 10) / scale
    const loc = new Coordinate(x, y)
    const max = new Coordinate(maxX, maxY)
    setActionHelpDisplay(HelpOverlay(actionButtonHelpLayout(loc, max, scale, type)))
  }

  const showActionHelp = (event: React.MouseEvent, counter: Counter) => {
    if (event.shiftKey) {
      setActionHelpDisplay(undefined)
      return
    }
    if (!map.game) { return }
    const x = (event.clientX - svgRef.current.getBoundingClientRect().x + 10) / scale
    const y = (event.clientY - svgRef.current.getBoundingClientRect().y + 10) / scale
    const loc = new Coordinate(x, y)

    const rallyCheck = map.game.phase === gamePhaseType.PrepRally && counter.hasUnit && counter.unit.selected
    const fireCheck = counter.hasUnit && counter.unit.targetSelected
    const routCheck = (map.game.routCheckNeeded.length > 0 && counter.hasUnit && counter.unit.selected) ||
      (map.game.gameState?.type === stateType.RoutAll && counter.hasUnit && counter.unit.isBroken &&
       counter.unit.playerNation !== map.game.currentPlayerNation)
    const moraleCheck = map.game.moraleChecksNeeded.length > 0 && counter.hasUnit && counter.unit.selected
    const hex = new Coordinate(xx ?? -1, yy ?? -1)
    const cCCheck = counter.hasUnit && map.contactAt(hex) &&
      !(map.game.closeNeeded[0]?.state === closeProgress.NeedsCasualties)
    const max = new Coordinate(maxX, maxY)
    if (rallyCheck) {
      setActionHelpDisplay(HelpOverlay(counterRallyHelpLayout(map.game, counter, loc, max, scale, hex)))
    } else if (fireCheck) {
      setActionHelpDisplay(HelpOverlay(
        counterFireHelpLayout(map.game, counter, loc, max, scale, hex, map.game.fireState.reaction))
      )
    } else if (routCheck) {
      setActionHelpDisplay(HelpOverlay(counterRoutHelpLayout(map.game, counter, loc, max, scale, hex)))
    } else if (moraleCheck) {
      setActionHelpDisplay(HelpOverlay(counterMoraleHelpLayout(map.game, counter, loc, max, scale, hex)))
    } else if (cCCheck) {
      setActionHelpDisplay(HelpOverlay(counterCloseCombatHelpLayout(map.game, counter, loc, max, scale, hex)))
    } else {
      setActionHelpDisplay(undefined)
    }
  }

  const getLength = (unit: Unit, outer: boolean): number => {
    let rc = 1
    if (outer || !unit.isVehicle) {
      if (unit.children) {
        for (const c of unit.children) { rc += getLength(c, false) }
      }
    } else {
      if (unit.children && unit.children.length > 0 && unit.children[0].crewed) {
        rc += getLength(unit.children[0], false)
      }
    }
    if (unit.turreted) { rc += 1 }
    if (map.showAllCounters) {
      if (unit.isVehicle) {
        if (unit.immobilized) { rc += 1 }
        if (unit.weaponDestroyed || unit.jammed ) { rc += 1 }
        if (unit.sponsonDestroyed || unit.sponsonJammed ) { rc += 1 }
        if (unit.turretJammed) { rc += 1 }
        if (!unit.isNormal ) { rc += 1 }
        if (unit.eliteCrew !== 0) { rc += 1 }
      } else {
        if (!unit.isNormal && !unit.isBroken ) { rc += 1 }
        if (unit.pinned) { rc += 1 }
      }
    }
    return rc
  }

  useEffect(() => {
    if (map.selection === undefined) { setActionControls([]) }
    setActionHelpDisplay(undefined)
    setUpdate(s => s + 1)
  }, [
    map.selection?.target.id, xx, yy, map.game?.gameState, map.targetSelection?.target.id
  ])

  useEffect(() => {
    // Either counters or a number makes for iffy typing
    const displayCounters = counters ? counters :
      map.countersAt(new Coordinate(xx as number, yy as number))
    const coord = counters ? counters[0].base as Coordinate : new Coordinate(xx as number, yy as number)
    const layout = map.overlayLayout(
      coord, displayCounters.length, new Coordinate(maxX, maxY),
      new Coordinate(shiftX, shiftY), mapScale, !!counters
    )
    const helpOverlays: JSX.Element[] = []
    const selectionOverlays: JSX.Element[] = []
    const buttons: JSX.Element[] = []
    setOverlayDisplay(
      <g>
        <path d={layout.path} style={layout.style as object} />
        { displayCounters.map((counter, i) => {
          const cd = new Counter(undefined, counter.target, map)
          if (counters) {
            cd.showDisabled = counter.showDisabled
            cd.reinforcement = counter.reinforcement
          }
          cd.hideShadow = true
          cd.showAllCounters = true
          cd.unitIndex = counter.unitIndex
          const transport = counter.unit.transport && (counter.children.length > 1 ||
            (counter.children.length === 1 && !counter.children[0].unit.crewed)) ?
            getLength(counter.unit, true) : undefined
          const outwidth = 6
          const dblwidth = outwidth*2
          const x = layout.x + i*(160+dblwidth) + dblwidth*2
          let thisButtons = false
          if ((counter.hasUnit || (counter.hasFeature && map.game?.phase === gamePhaseType.Deploy)) &&
              (counter.targetUF.selected || counter.targetUF.targetSelected) && yy !== undefined) {
            const controls = counterActionButtons(map, x, layout.y2 - outwidth + 2, maxY, counter)
            for (const c of controls) {
              thisButtons = true
              buttons.push(
                <g key={`${c.text}-${counter.unit.id}`}
                    onClick={() => buttonAction(c.action, {
                      target: { type: "map", xy: counter.hex as Coordinate }, counter
                    })}
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
          }
          const shiftBadges = transport || counter.parent?.unit.transport
          const badges = counterInfoBadges(
            map, x, layout.y2 + 20 - dblwidth + (shiftBadges ? 6 : 0), maxY, cd, (shiftBadges ? 6 : 3)
          ).map((b, i) => {
            const arrow = b.arrow ?
              <g opacity={thisButtons ? 0.33 : 1}>
                <path d={b.dirpath} style={{ fill: b.color, stroke: b.tColor, strokeWidth: 2 }} />
                <text x={b.dx} y={b.y as number+1} fontSize={b.size} textAnchor="middle"
                      style={{ fill: b.tColor }}
                      transform={`rotate(${b.arrow*60-60} ${b.dx} ${b.dy})`}>←</text>
              </g> : "" 
            return (
              <g key={i} opacity={thisButtons ? 0.33 : 1} >
                <path d={b.path} style={{ fill: b.color, stroke: b.tColor, strokeWidth: 2 }} />
                <text x={b.x} y={b.y} fontSize={b.size} textAnchor="start" fontFamily="'Courier Prime', monospace"
                      style={{ fill: b.tColor }}>{b.text}</text>
                {arrow}
              </g>
            )
          })
          helpOverlays.push(
            <MapCounterOverlayHelp key={i} xx={x + 167 - dblwidth*2} yy={layout.y - 20 + dblwidth*2}
                                   maxX={maxX} maxY={maxY} map={map} scale={scale} counter={cd}
                                   setHelpDisplay={setHelpDisplay} />
          )
          let target: CounterSelectionTarget | undefined = undefined
          if (xx !== undefined && yy !== undefined) {
            target = { target: { type: "map", xy: new Coordinate(xx, yy) }, counter: cd, }
          } else if (counter.reinforcement) {
            target = {
              target: {
                type: "reinforcement",
                player: counter.reinforcement.player,
                turn: counter.reinforcement.turn,
                key: counter.reinforcement.key,
              }, counter: cd,
            }
          }
          const ox = layout.x/2 + i*(80 + outwidth) - 5.5 + outwidth
          const oy = layout.y/2 - 5 + outwidth
          selectionOverlays.push(
            <g key={i} transform={`scale(2) translate(${ox} ${oy})`}>
              <path d={counterPath(cd)} style={{ fill: clearColor }}
                    onClick={(e: React.MouseEvent) => {
                      if (xx !== undefined && yy !== undefined) {
                        selectionCallback(target as CounterSelectionTarget)
                        showActionHelp(e, cd)
                      } else if (counter.reinforcement) {
                        selectionCallback(target as CounterSelectionTarget)
                      }
                      setUpdate(s => s + 1)
                    }}
                    onMouseMove={(e: React.MouseEvent) => { showActionHelp(e, cd) }}
                    onMouseLeave={() => { setActionHelpDisplay(undefined) }}
                    onContextMenu={e => { rightClick(e, target) }} />
            </g>
          )
          let unit: Unit | undefined = undefined
          if ([markerType.TrackedHull, markerType.WheeledHull].includes(counter.marker.type)) {
            unit = counter.marker.turret
          }
          if ((counter.children.length > 0 && [
              unitType.SupportWeapon, unitType.Gun
            ].includes(counter.children[0].unit.type))) {
            unit = counter.unit
          }
          const outerLine = transport ?
            <path d={counterOutline(cd, transport, 4)}
                  style={{ fill: clearColor, stroke: "#FFF", strokeWidth: 1.5, strokeDasharray: "5 4" }} />  : ""
          return (
            <g key={i} >
              <g transform={`scale(2) translate(${ox} ${oy})`}>
                { unit ? <path d={counterOutline(cd, getLength(unit, false), 1)}
                                style={{ fill: "#FFF", stroke: "#FFF", strokeWidth: 1.5 }} /> : "" }
                { outerLine }
                <MapCounter counter={cd} ovCallback={() => {}} />
              </g>
              {badges}
            </g>
          )
        })}
        <g onMouseLeave={() => setOverlay({ show: false, x: 0, y: 0 })} >
          <path d={layout.path} style={{ fill: clearColor}} />
          {selectionOverlays}
          {helpOverlays.reverse()}
          {actionControls}
          {helpDisplay}
          {actionHelpDisplay}
          {contextMenu}
        </g>
      </g>
    )
    setActionControls(buttons)
  }, [
    xx, yy, counters, update, contextMenu, helpDisplay, actionHelpDisplay,
  ])

  const listener = (e: KeyboardEvent) => {
    if (e.key === "Shift") { setActionHelpDisplay(undefined) }
  }

  useEffect(() => {
    if (!actionHelpDisplay) {
      document.removeEventListener("keydown", listener)
      return
    }
    document.addEventListener("keydown", listener)
  }, [actionHelpDisplay])

  return (
    <g>
      {overlayDisplay}
    </g>
  )
}
