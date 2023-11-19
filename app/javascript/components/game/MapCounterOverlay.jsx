import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Map } from "../../engine/map";
import { Counter } from "../../engine/counter";
import MapCounter from "./MapCounter";
import MapCounterOverlayHelp from "./MapCounterOverlayHelp";

export default function MapCounterOverlay(props) {
  const [overlayDisplay, setOverlayDisplay] = useState("")
  const [helpDisplay, setHelpDisplay] = useState("")
  const [update, setUpdate] = useState("")

  useEffect(() => {
    const counters = props.counters ? props.counters : props.map.counterDataAt(props.x, props.y)
    const layout = props.map.overlayLayout(
      props.counters ? props.counters[0].xBase : props.x, props.counters ? props.counters[0].yBase : props.y,
      counters.length, !!props.counters
    )
    const helpOverlays = []
    const selectionOverlays = []
    let trueIndex = 0
    setOverlayDisplay(
      <g>
        <path d={layout.path} style={layout.style} />
        { counters.map((data, i) => {
          const cd = props.counters ? new Counter(-1, -1, data.target, props.map) :
            new Counter(-1, -1, data.u, props.map)
          cd.showAllCounters = true
          if (!cd.target.isMarker) {
            cd.trueIndex = trueIndex++
          } else if (cd.target.isHull) {
            cd.trueIndex = trueIndex
          }
          const badges = props.map.counterInfoBadges(layout.x+i*170 + 30, layout.y2 + 8, cd).map((b, i) => {
            const arrow = b.arrow ?
              <g>
                <path d={b.dirpath} style={{ fill: b.color, stroke: b.tColor, strokeWidth: 2 }} />
                <text x={b.dx} y={b.y+1} fontSize={b.size} textAnchor="middle"
                      style={{ fill: b.tColor }}
                      transform={`rotate(${b.arrow*60-60} ${b.dx} ${b.dy})`}>←</text>
              </g> : "" 
            return (
              <g key={i} >
                <path d={b.path} style={{ fill: b.color, stroke: b.tColor, strokeWidth: 2 }} />
                <text x={b.x} y={b.y} fontSize={b.size} textAnchor="left" fontFamily="'Courier Prime', monospace"
                      style={{ fill: b.tColor }}>{b.text}</text>
                {arrow}
              </g>
            )
          })
          helpOverlays.push(
            <MapCounterOverlayHelp key={i} x={layout.x + i*170+160} y={layout.y+8}
                                   map={props.map} counter={cd} setHelpDisplay={setHelpDisplay} />
          )
          selectionOverlays.push(
            <g key={i} transform={`scale(2) translate(${layout.x/2 + i*85} ${layout.y/2})`}>
              <path d={cd.counterPath()} style={{ fill: "rgba(0,0,0,0)" }}
                    onClick={() => {
                      setUpdate(s => s + 1)
                      props.selectionCallback(props.x, props.y, cd)
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
        <g onMouseLeave={() => props.setOverlay({ show: false, x: 0, y: 0 })} >
          <path d={layout.path} style={{ fill: "rgba(0,0,0,0)"}} />
          {selectionOverlays}
          {helpOverlays.reverse()}
        </g>
      </g>
    )
  }, [props.x, props.y, props.counters, update])

  return (
    <g>
      {overlayDisplay}
      {helpDisplay}
    </g>
  )
}

MapCounterOverlay.propTypes = {
  map: PropTypes.instanceOf(Map),
  setOverlay: PropTypes.func,
  selectionCallback: PropTypes.func,
  x: PropTypes.number,
  y: PropTypes.number,
  counters: PropTypes.array,
}
