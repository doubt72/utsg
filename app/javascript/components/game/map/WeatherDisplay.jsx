import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import MapCounter from "./MapCounter";
import { baseCounterPath, baseHexCoords, roundedRectangle } from "../../../utilities/graphics";
import { Counter } from "../../../engine/counter";
import { Marker, markerType } from "../../../engine/marker";
import { Map } from "../../../engine/map";

export default function WeatherDisplay(props) {
  const [base, setBase] = useState("")
  const [currentWeather, setCurrentWeather] = useState("")
  const [baseWeather, setBaseWeather] = useState("")
  const [precipitation, setPrecipitation] = useState("")
  const [wind, setWind] = useState("")

  const [x, setX] = useState({ current: 0, base: 0, precip: 0, hex: 0 })
  const [y, setY] = useState({ current: 0, base: 0, precip: 0, hex: 0 })

  useEffect(() => {
    const prev = props.preview
    setX({
      current: props.x + 10,
      base: props.x + 100,
      precip: props.x + (prev ? 190 : 100),
      hex: props.x + (prev ? 356 : 95),
    })
    setY({
      current: props.y + (prev ? 60 : 10),
      base: props.y + 60,
      precip: props.y + (prev ? 60 : 10),
      hex: props.y + (prev ? 80 : 170),
    })
  }, [props.x, props.y, props.preview])

  useEffect(() => {
    const prev = props.preview
    const hex = <g>
      <polygon points={baseHexCoords(props.map || { radius: 0 }, x.hex, y.hex)}
              style={{ fill: "white", stroke: "black", strokeWidth: 1.5 }} />
      {[1, 2, 3, 4, 5, 6].map(d => {
        if (!props.map) { return }
        const x0 = x.hex - (props.map.radius-4) * Math.cos((d-1)/3 * Math.PI)
        const y0 = y.hex - (props.map.radius-4) * Math.sin((d-1)/3 * Math.PI)
        return (
          <text key={d} fontSize={24} textAnchor="middle"
                fontFamily="'Courier Prime', monospace" style={{ fill: "black" }}
                transform={`translate(${x0},${y0}) rotate(${d*60 - 150})`}>
            {d}
          </text>
        )
      })}
      <text x={x.hex} y={y.hex - 32} fontSize={16} textAnchor="middle"
              fontFamily="'Courier Prime', monospace" style={{ fill: "black" }}>
        wind
      </text>
      <text x={x.hex} y={y.hex - 16} fontSize={16} textAnchor="middle"
              fontFamily="'Courier Prime', monospace" style={{ fill: "black" }}>
        direction
      </text>
    </g>

    const xTextOffset = prev ? 4 : 5
    const yTextOffset = prev ? -6 : 15
    const current = <g>
      <path d={baseCounterPath(x.current, y.current)}
            style={{ fill: "white", stroke: "black", strokeWidth: 1.5 }} />
      <text x={x.current + xTextOffset} y={y.current + yTextOffset} fontSize={16} textAnchor="start"
            fontFamily="'Courier Prime', monospace" style={{ fill: "black" }}>
        { prev ? "start" : "current" }
      </text>
    </g>

    const precip = <g>
      <path d={baseCounterPath(x.precip, y.precip)}
            style={{ fill: "white", stroke: "black", strokeWidth: 1.5 }} />
      <text x={x.precip + xTextOffset} y={y.precip + yTextOffset} fontSize={16} textAnchor="start"
            fontFamily="'Courier Prime', monospace" style={{ fill: "black" }}>
        precip
      </text>
    </g>

    if (prev) {
      const base = <g>
        <path d={baseCounterPath(x.base, y.base)}
              style={{ fill: "white", stroke: "black", strokeWidth: 1.5 }} />
        <text x={x.base + xTextOffset} y={y.base + yTextOffset} fontSize={16} textAnchor="start"
              fontFamily="'Courier Prime', monospace" style={{ fill: "black" }}>
          base
        </text>
      </g>
      setBase(
        <g>
          <path d={roundedRectangle(props.x, props.y, 442, 169)}
                style={{ fill: props.map?.baseTerrainColor, stroke: "#CCC", strokeWidth: 2 }} />
          <text x={props.x + 14} y={props.y + 160} fontSize={16} textAnchor="start"
                  fontFamily="'Courier Prime', monospace" style={{ fill: "black" }}>
            terrain: {props.map?.baseTerrainName} ({props.map?.night ? "night" : "daytime"})
          </text>
          <text x={props.x + 10} y={props.y + 20} fontSize={16} textAnchor="start"
                  fontFamily="'Courier Prime', monospace" style={{ fill: "black" }}>
            environmental conditions
          </text>
          {current}
          {base}
          {precip}
          {hex}
        </g>
      )
    } else {
      setBase(
        <g>
          <path d={roundedRectangle(props.x, props.y, 190, 268)}
                style={{ fill: props.map?.baseTerrainColor, stroke: "#D5D5D5", strokeWidth: 1 }} />
          {
            props.map?.night ? 
              <path d={roundedRectangle(props.x, props.y, 190, 268)}
                    style={{ fill: "rgba(0,0,0,0.16)", strokeWidth: 0 }} /> : ""
          }
          <text x={props.x + 10} y={props.y + 260} fontSize={16} textAnchor="start"
                  fontFamily="'Courier Prime', monospace" style={{ fill: "black" }}>
            {props.map?.baseTerrainName} ({props.map?.night ? "night" : "daytime"})
          </text>
          {current}
          {precip}
          {hex}
        </g>
      )
    }
  }, [
    x, y,
    props.map.baseTerrain, props.map.night // For debugging
  ])

  useEffect(() => {
    if (!props.map) { return }
    if (props.hideCounters) {
      setCurrentWeather("")
      setBaseWeather("")
      setPrecipitation("")
      setWind("")
    } else {
      if (props.preview) {
        const cc = new Counter(x.current, y.current, new Marker({
          type: markerType.Weather, subtype: props.map.currentWeather,
        }), props.map, true)
        setCurrentWeather(<MapCounter counter={cc} ovCallback={() => {}} x={x.current} y={y.current} />)
        if (props.map.currentWeather !== props.map.baseWeather) {
          const bc = new Counter(x.base, y.base, new Marker({
            type: markerType.Weather, subtype: props.map.currentWeather,
          }), props.map, true)
          setBaseWeather(<MapCounter counter={bc} ovCallback={() => {}} x={x.base} y={y.base} />)
        } else {
          setBaseWeather("")
        }
        if (props.map.precipChance > 0 && props.map.precipChance < 10) {
          const pcc = new Counter(x.precip, y.precip, new Marker({
            type: markerType.Weather, subtype: props.map.precip, v: props.map.precipChance,
          }), props.map, true)
          setPrecipitation(<MapCounter counter={pcc} ovCallback={() => {}} x={x.precip} y={y.precip} />)
        } else {
          setPrecipitation("")
        }
      } else {
        const counters = []
        counters.push(new Counter(x.current, y.current, new Marker({
          type: markerType.Weather, subtype: props.map.baseWeather,
        }), props.map, true))
        if (props.map.precipChance > 0 && props.map.precipChance < 10 &&
          props.map.baseWeather !== props.map.precip) {
          counters.push(new Counter(x.precip, y.precip, new Marker({
            type: markerType.Weather, subtype: props.map.precip, v: props.map.precipChance
          }), props.map, true))
        }
        if (counters.length === 1) {
          const cb = () => { props.ovCallback({ show: true, counters: counters, x: 0 }) }
          setCurrentWeather(
            <MapCounter counter={counters[0]} ovCallback={cb} x={x.current} y={y.current} />
          )
          setPrecipitation("")
        } else if (props.map.baseWeather === props.map.currentWeather) {
          const cb1 = () => { props.ovCallback({ show: true, counters: [counters[0]], x: 1 }) }
          setCurrentWeather(
            <MapCounter counter={counters[0]} ovCallback={cb1} x={x.current} y={y.current} />
          )
          const cb2 = () => { props.ovCallback({ show: true, counters: [counters[1]], x: 2 }) }
          setPrecipitation(
            <MapCounter counter={counters[1]} ovCallback={cb2} x={x.precip} y={y.precip} />
          )
        } else {
          const cb = () => { props.ovCallback({ show: true, counters: counters, x: 3 }) }
          setCurrentWeather(
            <MapCounter counter={counters[0]} ovCallback={cb} x={x.current} y={y.current} />
          )
          counters[1].xBase = x.current + 5
          counters[1].yBase = y.current - 5
          setPrecipitation(
            <MapCounter counter={counters[1]} ovCallback={cb} x={x.current + 5} y={y.current - 5} />
          )
        }
      }

      const wc = new Counter(x.hex - 40, y.hex - 40, new Marker({
        type: markerType.Wind, subtype: props.map.windSpeed, v: props.map.windVariable,
        facing: props.map.windDirection, rotates: true,
      }), props.map, true)
      const wcb = () => { props.ovCallback({ show: true, counters: [wc] }) }
      setWind(<MapCounter counter={wc} ovCallback={wcb} x={x.hex - 40} y={y.hex - 40} />)
    }
  }, [
    x, y, props.hideCounters,
    props.map.currentWeather, props.map.baseWeather, props.map.precip, props.map.precipChance,
    props.map.windSpeed, props.map.windDirection, props.map.windVariable,
  ])

  return (
    <g>
      {base}
      {currentWeather}
      {baseWeather}
      {precipitation}
      {wind}
    </g>
  )
}

WeatherDisplay.propTypes = {
  map: PropTypes.instanceOf(Map),
  preview: PropTypes.bool,
  x: PropTypes.number,
  y: PropTypes.number,
  hideCounters: PropTypes.bool,
  ovCallback: PropTypes.func,
}
