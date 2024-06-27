import React, { useEffect, useState } from "react";
import MapCounter from "./MapCounter";
import MapCounterOverlayHelp from "./MapCounterOverlayHelp";
import Counter from "../../../engine/Counter";
import { Coordinate } from "../../../utilities/commonTypes";
import Map, { MapCounterData } from "../../../engine/Map";

interface MapCounterOverlayProps {
  map: Map;
  // eslint-disable-next-line @typescript-eslint/ban-types
  setOverlay: Function;
  // eslint-disable-next-line @typescript-eslint/ban-types
  selectionCallback: Function;
  xx?: number;
  yy?: number;
  counters?: Counter[];
}

export default function MapCounterOverlay({
  map, setOverlay, selectionCallback, xx, yy, counters
}: MapCounterOverlayProps) {
  const [overlayDisplay, setOverlayDisplay] = useState<JSX.Element | undefined>()
  const [helpDisplay, setHelpDisplay] = useState<JSX.Element | undefined>()
  const [update, setUpdate] = useState(0)

  useEffect(() => {
    // Either counters or a number makes for iffy typing
    const displayCounters = counters ? counters :
      map.counterDataAt(new Coordinate(xx as number, yy as number))
    const coord = counters ? counters[0].base as Coordinate : new Coordinate(xx as number, yy as number)
    const layout = map.overlayLayout(coord, displayCounters.length, !!counters)
    const helpOverlays: JSX.Element[] = []
    const selectionOverlays: JSX.Element[] = []
    let trueIndex = 0
    setOverlayDisplay(
      <g>
        <path d={layout.path} style={layout.style as object} />
        { displayCounters.map((data, i) => {
          const counter = data as Counter
          const counterData = data as MapCounterData
          const cd = counters ? new Counter(undefined, counter.target, map) :
            new Counter(undefined, counterData.u, map)
          cd.showAllCounters = true
          if (!cd.target.isMarker) {
            cd.trueIndex = trueIndex++
          } else if (cd.target.isHull) {
            cd.trueIndex = trueIndex
          }
          const badges = map.counterInfoBadges(
            layout.x+i*170 + 30, layout.y2 + 8, cd
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
            <MapCounterOverlayHelp key={i} xx={layout.x + i*170+160} yy={layout.y+8}
                                   map={map} counter={cd} setHelpDisplay={setHelpDisplay} />
          )
          selectionOverlays.push(
            <g key={i} transform={`scale(2) translate(${layout.x/2 + i*85} ${layout.y/2})`}>
              <path d={cd.counterPath()} style={{ fill: "rgba(0,0,0,0)" }}
                    onClick={() => {
                      setUpdate(s => s + 1)
                      selectionCallback(xx, yy, cd)
                    }} />
            </g>
          )
          return (
            <g key={i} >
              <g transform={`scale(2) translate(${layout.x/2 + i*85} ${layout.y/2})`}>
                <MapCounter counter={cd} ovCallback={() => {}} />
              </g>
              {badges}
            </g>
          )
        })}
        <g onMouseLeave={() => setOverlay({ show: false, x: 0, y: 0 })} >
          <path d={layout.path} style={{ fill: "rgba(0,0,0,0)"}} />
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
    </g>
  )
}
