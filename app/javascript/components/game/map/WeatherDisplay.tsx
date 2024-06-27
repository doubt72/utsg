import React, { useEffect, useState } from "react";
import MapCounter from "./MapCounter";
import {
  baseCounterPath, baseHexCoords, roundedRectangle
} from "../../../utilities/graphics";
import Map from "../../../engine/Map";
import { Coordinate, markerType } from "../../../utilities/commonTypes";
import Marker from "../../../engine/Marker";
import Counter from "../../../engine/Counter";

interface WeatherDisplayProps {
  map: Map;
  preview: boolean;
  xx: number;
  yy: number;
  hideCounters: boolean;
  // eslint-disable-next-line @typescript-eslint/ban-types
  ovCallback: Function;
}

export default function WeatherDisplay({
  map, preview, xx, yy, hideCounters, ovCallback
}: WeatherDisplayProps) {
  const [base, setBase] = useState<JSX.Element | undefined>()
  const [currentWeather, setCurrentWeather] = useState<JSX.Element | undefined>()
  const [baseWeather, setBaseWeather] = useState<JSX.Element | undefined>()
  const [precipitation, setPrecipitation] = useState<JSX.Element | undefined>()
  const [wind, setWind] = useState<JSX.Element | undefined>()

  const [x, setX] = useState({ current: 0, base: 0, precip: 0, hex: 0 })
  const [y, setY] = useState({ current: 0, base: 0, precip: 0, hex: 0 })

  useEffect(() => {
    const prev = preview
    setX({
      current: xx + 10,
      base: xx + 100,
      precip: xx + (prev ? 190 : 100),
      hex: xx + (prev ? 356 : 95),
    })
    setY({
      current: yy + (prev ? 60 : 10),
      base: yy + 60,
      precip: yy + (prev ? 60 : 10),
      hex: yy + (prev ? 80 : 170),
    })
  }, [xx, yy, preview])

  useEffect(() => {
    const prev = preview
    const hex = <g>
      <polygon points={baseHexCoords(map || { radius: 0 }, x.hex, y.hex)}
              style={{ fill: "white", stroke: "black", strokeWidth: 1.5 }} />
      {[1, 2, 3, 4, 5, 6].map(d => {
        if (!map) { return }
        const x0 = x.hex - (map.radius-4) * Math.cos((d-1)/3 * Math.PI)
        const y0 = y.hex - (map.radius-4) * Math.sin((d-1)/3 * Math.PI)
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
          <path d={roundedRectangle(xx, yy, 442, 169)}
                style={{ fill: map?.baseTerrainColor, stroke: "#CCC", strokeWidth: 2 }} />
          <text x={xx + 14} y={yy + 160} fontSize={16} textAnchor="start"
                  fontFamily="'Courier Prime', monospace" style={{ fill: "black" }}>
            terrain: {map?.baseTerrainName} ({map?.night ? "night" : "daytime"})
          </text>
          <text x={xx + 10} y={yy + 20} fontSize={16} textAnchor="start"
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
          <path d={roundedRectangle(xx, yy, 190, 268)}
                style={{ fill: map?.baseTerrainColor, stroke: "#D5D5D5", strokeWidth: 1 }} />
          {
            map?.night ? 
              <path d={roundedRectangle(xx, yy, 190, 268)}
                    style={{ fill: "rgba(0,0,0,0.16)", strokeWidth: 0 }} /> : ""
          }
          <text x={xx + 10} y={yy + 260} fontSize={16} textAnchor="start"
                  fontFamily="'Courier Prime', monospace" style={{ fill: "black" }}>
            {map?.baseTerrainName} ({map?.night ? "night" : "daytime"})
          </text>
          {current}
          {precip}
          {hex}
        </g>
      )
    }
  }, [
    x, y,
    map.baseTerrain, map.night // For debugging
  ])

  useEffect(() => {
    if (!map) { return }
    if (hideCounters) {
      setCurrentWeather(undefined)
      setBaseWeather(undefined)
      setPrecipitation(undefined)
      setWind(undefined)
    } else {
      if (preview) {
        const cc = new Counter(new Coordinate(x.current, y.current), new Marker({
          type: markerType.Weather, subtype: map.currentWeather, mk: 1,
        }), map, true)
        setCurrentWeather(<MapCounter counter={cc} ovCallback={() => {}} />)
        if (map.currentWeather !== map.baseWeather) {
          const bc = new Counter(new Coordinate(x.base, y.base), new Marker({
            type: markerType.Weather, subtype: map.currentWeather, mk: 1
          }), map, true)
          setBaseWeather(<MapCounter counter={bc} ovCallback={() => {}} />)
        } else {
          setBaseWeather(undefined)
        }
        if (map.precipChance > 0 && map.precipChance < 10) {
          const pcc = new Counter(new Coordinate(x.precip, y.precip), new Marker({
            type: markerType.Weather, subtype: map.precip, v: map.precipChance, mk: 1
          }), map, true)
          setPrecipitation(<MapCounter counter={pcc} ovCallback={() => {}} />)
        } else {
          setPrecipitation(undefined)
        }
      } else {
        const counters: Counter[] = []
        counters.push(new Counter(new Coordinate(x.current, y.current), new Marker({
          type: markerType.Weather, subtype: map.baseWeather, mk: 1
        }), map, true))
        if (map.precipChance > 0 && map.precipChance < 10 &&
          map.baseWeather !== map.precip) {
          counters.push(new Counter(new Coordinate(x.precip, y.precip), new Marker({
            type: markerType.Weather, subtype: map.precip, v: map.precipChance, mk: 1
          }), map, true))
        }
        if (counters.length === 1) {
          const cb = () => { ovCallback({ show: true, counters: counters, x: 0 }) }
          setCurrentWeather(
            <MapCounter counter={counters[0]} ovCallback={cb} />
          )
          setPrecipitation(undefined)
        } else if (map.baseWeather === map.currentWeather) {
          const cb1 = () => { ovCallback({ show: true, counters: [counters[0]], x: 1 }) }
          setCurrentWeather(
            <MapCounter counter={counters[0]} ovCallback={cb1} />
          )
          const cb2 = () => { ovCallback({ show: true, counters: [counters[1]], x: 2 }) }
          setPrecipitation(
            <MapCounter counter={counters[1]} ovCallback={cb2} />
          )
        } else {
          const cb = () => { ovCallback({ show: true, counters: counters, x: 3 }) }
          setCurrentWeather(
            <MapCounter counter={counters[0]} ovCallback={cb} />
          )
          if (counters[1].base) {
            counters[1].base.x = x.current + 5
            counters[1].base.y = y.current - 5
          }
          setPrecipitation(
            <MapCounter counter={counters[1]} ovCallback={cb} />
          )
        }
      }

      const wc = new Counter(new Coordinate(x.hex - 40, y.hex - 40), new Marker({
        type: markerType.Wind, subtype: map.windSpeed, v: map.windVariable ? 1 : 0,
        facing: map.windDirection, rotates: 1, mk: 1,
      }), map, true)
      const wcb = () => { ovCallback({ show: true, counters: [wc] }) }
      setWind(<MapCounter counter={wc} ovCallback={wcb} />)
    }
  }, [
    x, y, hideCounters,
    map.currentWeather, map.baseWeather, map.precip, map.precipChance,
    map.windSpeed, map.windDirection, map.windVariable,
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
