import React, { useEffect, useState } from "react";
import { Map } from "../../engine/map";
import { Unit } from "../../engine/unit";
import { Feature } from "../../engine/feature";
import GameMap from "./GameMap";

export default function DebugMapLos() {
  const [map, setMap] = useState(null)
  const [scale, setScale] = useState(1)
  const [coords, setCoords] = useState(true)
  const [showStatusCounters, setShowStatusCounters] = useState(false)
  const [hideCounters, setHideCounters] = useState(true)
  const [showLos, setShowLos] = useState(false)
  const [debugLos, setDebugLos] = useState(false)
  const [baseTerrain, setBaseTerrain] = useState("g")
  const [night, setNight] = useState(false)

  const testUnitData = {
    ginf: {
      c: "ger", f: 7, i: "squad", m: 3, n: "Rifle", o: {s: 1}, r: 5, s: 6, t: "sqd", v: 4, y: 0
    },
  }

  const testFeatureData = {
    smoke: { ft: 1, n: "Smoke", t: "smoke", i: "smoke", h: 2 },
    fire: { ft: 1, n: "Blaze", t: "fire", i: "fire", o: { los: 1 } },
  }

  const testFeatures = [
    { u: testFeatureData.smoke, x: 12, y: 12 },
    { u: testFeatureData.fire, x: 13, y: 13 },
  ]

  const testUnits = [
    { u: testUnitData.ginf, x: 0, y: 0 },
    { u: testUnitData.ginf, x: 0, y: 1 },
    { u: testUnitData.ginf, x: 0, y: 2 },
    { u: testUnitData.ginf, x: 0, y: 3 },
    { u: testUnitData.ginf, x: 0, y: 4 },
    { u: testUnitData.ginf, x: 0, y: 14 },
    { u: testUnitData.ginf, x: 10, y: 0 },
    { u: testUnitData.ginf, x: 10, y: 1 },
    { u: testUnitData.ginf, x: 10, y: 2 },
    { u: testUnitData.ginf, x: 10, y: 3 },
    { u: testUnitData.ginf, x: 10, y: 4 },
    { u: testUnitData.ginf, x: 14, y: 0 },
    { u: testUnitData.ginf, x: 14, y: 1 },
    { u: testUnitData.ginf, x: 14, y: 2 },
    { u: testUnitData.ginf, x: 14, y: 3 },
    { u: testUnitData.ginf, x: 14, y: 4 },
    { u: testUnitData.ginf, x: 14, y: 6 },
    { u: testUnitData.ginf, x: 14, y: 14 },
    { u: testUnitData.ginf, x: 3, y: 3 },
    { u: testUnitData.ginf, x: 8, y: 2 },
    { u: testUnitData.ginf, x: 10, y: 6 },
  ]

  useEffect(() => {
    setMap(
      new Map({
        layout: [15, 15, "x"],
        base_terrain: "g",
        hexes: [
          [
            { t: "o", h: 5 },
            { t: "o", h: 4 },
            { t: "o", h: 3 },
            { t: "o", h: 2 },
            { t: "o", h: 1 },
            { t: "o" },
            { t: "f" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
          ], [
            { t: "o", h: 4 },
            { t: "o", h: 3 },
            { t: "o", h: 2 },
            { t: "o", h: 1 },
            { t: "o" },
            { t: "o" },
            { t: "f" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
          ], [
            { t: "o", h: 3 },
            { t: "o", h: 2 },
            { t: "o", h: 1 },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "f" },
            { t: "o" },
            { t: "o", b: "w", be: [1, 2, 3, 4, 5, 6] },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
          ], [
            { t: "o", h: 2 },
            { t: "o", h: 1 },
            { t: "o" },
            { t: "o", b: "f", be: [1, 2, 3, 4, 5, 6] },
            { t: "o" },
            { t: "o" },
            { t: "f" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
          ], [
            { t: "o", h: 1 },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "f" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
          ], [
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "f", h: 1  },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", d: 1, st: { sh: "l" } },
            { t: "o", d: 1, st: { sh: "l" } },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
          ], [
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", h: 1 },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
          ], [
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", d: 1, st: { sh: "s" } },
            { t: "o", d: 4, st: { sh: "s" } },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
          ], [
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
          ], [
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
          ], [
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
          ], [
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
          ], [
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
          ], [
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
          ], [
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
          ]
        ]
      })
    )
  }, [])

  useEffect(() => {
    if (!map) { return }
    testFeatures.forEach(data => {
      const unit = new Feature(data.u)
      map.addUnit(data.x, data.y, unit)
    })
    testUnits.forEach(data => {
      const unit = new Unit(data.u)
      map.addUnit(data.x, data.y, unit)
    })
    setHideCounters(false)
  }, [map])

  const hexSelection = (x, y) => {
    const key = `${x}-${y}`
    console.log(key)
  }

  const unitSelection = (x, y, counter) => {
    const key = `x ${x}-${y}-${counter.trueIndex}`
    console.log(key)
  }

  const baseTerrainName = (t) => {
    return {
      g: "grass",
      d: "desert",
      s: "snow",
      m: "mud",
      u: "urban",
    }[t]
  }

  const nextTerrain = (t) => {
    return {
      g: "d",
      d: "s",
      s: "m",
      m: "u",
      u: "g",
    }[t]
  }

  return (
    <div className="map-container">
      <div className="flex mb05em">
        <div className="custom-button" onClick={() => setScale(s => Math.max(s/1.25, 0.4))}>
          size -
        </div>
        <div className="custom-button" onClick={() => setScale(1)}>
          0
        </div>
        <div className="custom-button" onClick={() => setScale(s => Math.min(s*1.25, 2.5))}>
          + size
        </div>
        <div className="custom-button" onClick={() => setCoords(c => !c)}>
          coordinates { coords ? "on" : "off" }
        </div>
        <div className="custom-button"onClick={() => setShowStatusCounters(ssc => !ssc)}>
          { showStatusCounters ? "status counters" : "status badges" }
        </div>
        <div className="custom-button"onClick={() => setShowLos(sl => !sl)}>
          { showLos ? "show LOS" : "show stacks" }
        </div>
        {
          showLos ? 
          <div className="custom-button"onClick={() => {
            setDebugLos(sl => !sl)
            map.debug = !map.debug
          }}>
            { debugLos ? "debug LOS on" : "debug LOS off" }
          </div> : ""
        }
        <div className="custom-button"onClick={() => setHideCounters(sc => !sc)}>
          { hideCounters ? "hide counters" : "show counters" }
        </div>
        <div className="custom-button"onClick={() => {
          const nt = nextTerrain(baseTerrain)
          map.baseTerrain = nt
          setBaseTerrain(nt)
        }}>
          { `base ${baseTerrainName(baseTerrain)}` }
        </div>
        <div className="custom-button"onClick={() => {
          map.night = !map.night
          setNight(nt => !nt)
        }}>
          { night ? "nighttime" : "daytime" }
        </div>
      </div>
      <GameMap map={map} scale={scale} showCoords={coords} showStatusCounters={showStatusCounters}
               showLos={showLos} hideCounters={hideCounters}
               hexCallback={hexSelection} counterCallback={unitSelection} />
    </div>
  )
}