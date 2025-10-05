import React, { useEffect, useState } from "react";
import MapCounter from "./MapCounter";
import MapCounterOverlayHelp from "./MapCounterOverlayHelp";
import Counter from "../../../engine/Counter";
import { Coordinate, markerType, unitType } from "../../../utilities/commonTypes";
import Map from "../../../engine/Map";
import { clearColor, counterOutline } from "../../../utilities/graphics";
import { counterInfoBadges, counterPath } from "../../../engine/support/counterLayout";
import { HelpOverlay } from "./Help";
import { counterFireHelpLayout } from "../../../engine/support/help";

interface MapCounterOverlayProps {
  map: Map;
  // eslint-disable-next-line @typescript-eslint/ban-types
  setOverlay: Function;
  // eslint-disable-next-line @typescript-eslint/ban-types
  selectionCallback: Function;
  xx?: number;
  yy?: number;
  mapScale: number;
  scale: number;
  shiftX: number;
  shiftY: number;
  maxX: number;
  maxY: number;
  svgRef: React.MutableRefObject<HTMLElement>;
  counters?: Counter[];
}

export default function MapCounterOverlay({
  map, setOverlay, selectionCallback, xx, yy, mapScale, scale, shiftX, shiftY, maxX, maxY, counters, svgRef
}: MapCounterOverlayProps) {
  const [overlayDisplay, setOverlayDisplay] = useState<JSX.Element | undefined>()
  const [helpDisplay, setHelpDisplay] = useState<JSX.Element | undefined>()
  const [fireHelpDisplay, setFireHelpDisplay] = useState<JSX.Element | undefined>()
  const [update, setUpdate] = useState(0)

  const showFireHelp = (e: React.MouseEvent, counter: Counter) => {
    if (counter.hasUnit && counter.unit.targetSelected) {
      if (!map.game) { return }
      const x = (e.clientX - svgRef.current.getBoundingClientRect().x + 10) / scale
      const y = (e.clientY - svgRef.current.getBoundingClientRect().y + 10) / scale
      const loc = new Coordinate(x, y)
      setFireHelpDisplay(HelpOverlay(counterFireHelpLayout(
          map.game, counter, loc, new Coordinate(maxX, maxY), scale, new Coordinate(xx ?? -1, yy ?? -1)
      )))
    } else {
      setFireHelpDisplay(undefined)
    }
  }

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
            counter.children.reduce((sum, c) => sum + 1 + c.children.length, 0) : undefined
          const shiftBadges = transport || counter.parent?.unit.transport
          const badges = counterInfoBadges(
            map, layout.x+i*176 + 32, layout.y2 + 4 + (shiftBadges ? 6 : 0), maxY, cd, (shiftBadges ? 6 : 0)
          ).map((b, i) => {
            const arrow = b.arrow ?
              <g>
                <path d={b.dirpath} style={{ fill: b.color, stroke: b.tColor, strokeWidth: 2 }} />
                <text x={b.dx} y={b.y as number+1} fontSize={b.size} textAnchor="middle"
                      style={{ fill: b.tColor }}
                      transform={`rotate(${b.arrow*60-60} ${b.dx} ${b.dy})`}>←</text>
              </g> : "" 
            return (
              <g key={i} >
                <path d={b.path} style={{ fill: b.color, stroke: b.tColor, strokeWidth: 2 }} />
                <text x={b.x} y={b.y} fontSize={b.size} textAnchor="start" fontFamily="'Courier Prime', monospace"
                      style={{ fill: b.tColor }}>{b.text}</text>
                {arrow}
              </g>
            )
          })
          helpOverlays.push(
            <MapCounterOverlayHelp key={i} xx={layout.x + i*176+170} yy={layout.y+10} maxX={maxX} maxY={maxY}
                                   map={map} scale={scale} counter={cd} setHelpDisplay={setHelpDisplay} />
          )
          selectionOverlays.push(
            <g key={i} transform={`scale(2) translate(${layout.x/2 + i*88 + 2.5} ${layout.y/2 + 3})`}>
              <path d={counterPath(cd)} style={{ fill: clearColor }}
                    onClick={(e: React.MouseEvent) => {
                      if (xx !== undefined && yy !== undefined) {
                        selectionCallback({
                          target: { type: "map", xy: new Coordinate(xx, yy) },
                          counter: cd,
                        })
                        showFireHelp(e, cd)
                      } else if (counter.reinforcement) {
                        selectionCallback({
                          target: {
                            type: "reinforcement",
                            player: counter.reinforcement.player,
                            turn: counter.reinforcement.turn,
                            index: counter.reinforcement.index,
                          },
                          counter: cd,
                        })
                      }
                      setUpdate(s => s + 1)
                    }}
                    onMouseMove={(e: React.MouseEvent) => { showFireHelp(e, cd) }}
                    onMouseLeave={() => { setFireHelpDisplay(undefined) }}/>
            </g>
          )
          return (
            <g key={i} >
              <g transform={`scale(2) translate(${layout.x/2 + i*88 + 2.5} ${layout.y/2 + 3})`}>
                {
                  [markerType.TrackedHull, markerType.WheeledHull].includes(counter.marker.type) ||
                    (counter.children.length > 0 && [unitType.SupportWeapon, unitType.Gun].includes(
                      counter.children[0].unit.type
                    )) ?
                    <path d={counterOutline(cd, 2, 1)}
                          style={{ fill: "#FFF", stroke: "#FFF", strokeWidth: 1.5 }} />  : ""
                }
                {
                  transport ?
                    <path d={counterOutline(cd, transport + 1, 4)}
                          style={{ fill: clearColor, stroke: "#FFF", strokeWidth: 1.5, strokeDasharray: "5 4" }} />  : ""
                }
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
        </g>
      </g>
    )
  }, [xx, yy, counters, update])

  return (
    <g>
      {overlayDisplay}
      {helpDisplay}
      {fireHelpDisplay}
    </g>
  )
}
