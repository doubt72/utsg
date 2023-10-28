import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Map } from "../../engine/map";
import { Counter } from "../../engine/counter";
import MapHexPatterns from "./MapHexPatterns";
import MapHex from "./MapHex";
import MapHexOverlay from "./MapHexOverlay";
import MapCounter from "./MapCounter";

export default function GameMap(props) {
  const [hexDisplay, setHexDisplay] = useState([])
  const [hexDisplayOverlays, setHexDisplayOverlays] = useState([])
  const [counterDisplay, setCounterDisplay] = useState([])
  const [overlay, setOverlay] = useState({ show: false, x: -1, y: -1 })
  const [overlayDisplay, setOverlayDisplay] = useState("")

  useEffect(() => {
    console.log(`basic check ${props.map?.width} ${props.map?.height}`)
    if (!props.map) { return }
    const hexLoader = []
    const overlayLoader = []
    props.map.showCoords = props.showCoords
    props.map.showAllCounters = props.showStatusCounters
    props.map.hideCounters = props.hideCounters
    props.map.mapHexes.forEach((row, y) => {
      row.forEach((hex, x) => {
        hexLoader.push(<MapHex key={`${x}-${y}`} hex={hex} />)
        overlayLoader.push(<MapHexOverlay key={`${x}-${y}-o`} hex={hex} selected={false}
                                          selectCallback={hexSelection}/>)
      })
    })
    setHexDisplay(hexLoader)
    setHexDisplayOverlays(overlayLoader)
    setCounterDisplay(props.map.counters.map((counter, i) => 
      <MapCounter key={i} counter={counter} ovCallback={setOverlay} />
    ))
  }, [props.showCoords, props.showStatusCounters, props.hideCounters])

  useEffect(() => {
    console.log(`basic overlay ${overlay.x} ${overlay.y}`)
    if (overlay.x < 0) { return }
    if (!overlay.show) { setOverlayDisplay(""); return }
    const counters = props.map.countersAt(overlay.x, overlay.y)
    const layout = props.map.overlayLayout(overlay.x, overlay.y, counters.length)
    setOverlayDisplay(
      <g>
        <path d={layout.path} style={layout.style} />
        { counters.map((data, i) => {
          const cd = new Counter(-1, -1, data.u)
          cd.showAllCounters = true
          const badges = props.map.counterInfoBadges(layout.x+i*170 + 30, layout.y2 + 8, cd).map((b, i) => {
            const arrow = b.arrow ?
              <g>
                <path d={b.dirpath} style={{ fill: b.color, stroke: b.tColor, strokeWidth: 2 }} />
                <text x={b.dx} y={b.y+1.5} fontSize={b.size} textAnchor="middle"
                      style={{ fill: b.tColor }}
                      transform={`rotate(${b.arrow*60-60} ${b.dx} ${b.dy})`}>←</text>
              </g> : "" 
            return (
              <g key={i} >
                <path d={b.path} style={{ fill: b.color, stroke: b.tColor, strokeWidth: 2 }} />
                <text x={b.x} y={b.y} fontSize={b.size} textAnchor="left" fontFamily="monospace"
                      style={{ fill: b.tColor }}>{b.text}</text>
                {arrow}
              </g>
            )
          })
          return (
            <g key={i} >
              <g transform={`scale(2) translate(${layout.x/2 + i*85} ${layout.y/2})`}>
                <MapCounter counter={cd} ovCallback={() => {}} />
              </g>
              {badges}
            </g>
          )
        })}
        <path d={layout.path} style={{ fill: "rgba(0,0,0,0)"}}
              onMouseLeave={() => setOverlay({ on: false, x: 0, y: 0 }) } />
      </g>
    )
  }, [overlay.show, overlay.x, overlay.y])

  const hexSelection = (x, y) => {
    const key = `${x}-${y}`
    setHexDisplayOverlays(overlays =>
      overlays.map(h => {
        if (h.key === `${key}-o`) {
          if (props.hexCallback) {
            props.hexCallback(x, y, !h.props.selected)
          }
          return <MapHexOverlay key={`${x}-${y}-o`} hex={h.props.hex} selected={!h.props.selected}
                                selectCallback={hexSelection}/>
        } else {
          return h
        }
      })
    )
  }

  return (
    <svg className="map-svg" width={(props.map?.xSize || 1) * (props.scale || 1)}
         height={(props.map?.ySize || 1) * (props.scale || 1)}
         viewBox={`0 0 ${props.map?.xSize || 1} ${props.map?.ySize || 1}`}>
      <MapHexPatterns />
      {hexDisplay}
      {hexDisplayOverlays}
      {counterDisplay}
      {overlayDisplay}
    </svg>
  )
}

GameMap.propTypes = {
  map: PropTypes.instanceOf(Map),
  scale: PropTypes.number,
  showCoords: PropTypes.bool,
  showStatusCounters: PropTypes.bool,
  hideCounters: PropTypes.bool,
  hexCallback: PropTypes.func,
  counterCallback: PropTypes.func,
}
