import React, { useEffect, useState } from "react";
import { Map } from "../../engine/map";
import { Unit, unitStatus } from "../../engine/unit";
import MapHex from "./MapHex";
import MapHexOverlay from "./MapHexOverlay";
import MapHexPatterns from "./MapHexPatterns";
import MapCounter from "./MapCounter";
import { Counter } from "../../engine/counter";

export default function GameMap() {
  const [hexes, setHexes] = useState([])
  const [overlays, setOverlays] = useState([])
  const [counters, setCounters] = useState([])
  const [scale, setScale] = useState(1)
  const [coords, setCoords] = useState(true)
  const [statusCounters, setStatusCounters] = useState(false)
  // const [units, setUnits] = useState([])

  const map = new Map({
    layout: [15, 15, "x"],
    hexes: [
      [
        { t: "s" },
        { t: "s", r: { d: [2, 5], t: "d" } },
        { t: "s" },
        { t: "o", r: { d: [3, 6], t: "d" } },
        { t: "f" },
        { t: "f" },
        { t: "f" },
        { t: "o" },
        { t: "o", b: "b", be: [1] },
        { t: "o" },
        { t: "o", r: { d: [2, 6], t: "t", c: "l" } },
        { t: "o", b: "w", be: [1] },
        { t: "o", d: 3, st: { sh: "s" } },
        { t: "o" },
        { t: "o" },
      ], [
        { t: "s" },
        { t: "s", r: { d: [2, 4], t: "d" } },
        { t: "o", r: { d: [1, 3, 5], t: "d" } },
        { t: "f" },
        { t: "f" },
        { t: "o" },
        { t: "d", d: 3, b: "b", be: [2, 3] },
        { t: "o", b: "b", be: [2, 3], st: { sh: "c" } },
        { t: "o", d: 2, b: "b", be: [1, 2], st: { sh: "s", s: "f" } },
        { t: "o", r: { d: [3, 5], t: "t", c: "r" } },
        { t: "o", b: "w", be: [1, 2] },
        { t: "o", d: 6, st: { sh: "s" } },
        { t: "o", d: 3, st: { sh: "l" } },
        { t: "o", d: 1, st: { sh: "l" } },
        { t: "o" },
      ], [
        { t: "w" },
        { t: "w" },
        { t: "f" },
        { t: "o", r: { d: [2, 5], t: "d" } },
        { t: "b" },
        { t: "b" },
        { t: "o" },
        { t: "d", d: 2 },
        { t: "d", d: 1 },
        { t: "o", d: 5, st: { sh: "s", s: "f" } },
        { t: "o", r: { d: [2, 4, 6], t: "t", c: "l" }, b: "w", be: [3] },
        { t: "o", r: { d: [1, 4], t: "t" }, b: "w", be: [2, 3] },
        { t: "o", r: { d: [1, 4], t: "t" }, b: "w", be: [2, 3] },
        { t: "o", r: { d: [1, 4], t: "t" }, b: "w", be: [2, 3] },
        { t: "o", r: { d: [1, 4], t: "t" }, b: "w", be: [2, 3] },
      ], [
        { t: "w", s: { d: [1, 4] } },
        { t: "o", s: { d: [1, 5] } },
        { t: "o" },
        { t: "o", r: { d: [2, 5], t: "d" } },
        { t: "f" },
        { t: "f", r: { t: "p", d: [4, 6] } },
        { t: "o" },
        { t: "g", b: "f", be: [1, 2, 3] },
        { t: "g", b: "f", be: [2, 3] },
        { t: "o", r: { d: [3, 5], t: "t", c: "r" }, b: "f", be: [1] },
        { t: "o", d: 1, st: { sh: "s" } },
        { t: "o", d: 1, st: { sh: "m" } },
        { t: "o", d: 4, st: { sh: "s" } },
        { t: "o", d: 2, st: { sh: "x", s: "f" } },
        { t: "o" },
      ], [
        { t: "w" },
        { t: "b" },
        { t: "o", s: { d: [2, 6] } },
        { t: "o" },
        { t: "o", r: { d: [2, 5], t: "d" } },
        { t: "f", r: { t: "p", d: [1, 3] } },
        { t: "f" },
        { t: "o", b: "f", be: [3] },
        { t: "g", b: "f", be: [1] },
        { t: "g", b: "f", be: [3] },
        { t: "o", r: { d: [2, 6], t: "t", c: "l" }, b: "f", be: [1] },
        { t: "o", d: 1, st: { sh: "s" } },
        { t: "o", d: 4, st: { sh: "s" } },
        { t: "o", d: 1, st: { sh: "x" } },
        { t: "o", d: 3, st: { sh: "x" } },
      ], [
        { t: "m" },
        { t: "m", s: { d: [3, 4] } },
        { t: "m", s: { d: [1, 5] } },
        { t: "b" },
        { t: "o", r: { d: [2, 5], t: "d" } },
        { t: "f" },
        { t: "o" },
        { t: "o", b: "f", be: [3] },
        { t: "o", r: { d: [4, 6], t: "d" }, b: "f", be: [2, 3] },
        { t: "o", r: { d: [1, 3, 4], t: "t", c: "r" }, b: "f", be: [2] },
        { t: "o", r: { d: [1, 4], t: "t" } },
        { t: "o", r: { d: [1, 4], t: "t" } },
        { t: "o", r: { d: [1, 4], t: "t" } },
        { t: "o", r: { d: [1, 4], t: "t" } },
        { t: "o", r: { d: [1, 4], t: "t" }, s: { d: [3, 5] } },
      ], [
        { t: "o" },
        { t: "w" },
        { t: "m" },
        { t: "o", s: { d: [2, 5] } },
        { t: "b" },
        { t: "o", r: { d: [2, 5], t: "d" } },
        { t: "f" },
        { t: "o" },
        { t: "o", r: { d: [3, 6], t: "d" } },
        { t: "f" },
        { t: "f" },
        { t: "o", d: 2, st: { sh: "l", s: "f" } },
        { t: "o", d: 2.5, st: { sh: "l", s: "f" } },
        { t: "o", d: 3, st: { sh: "s" } },
        { t: "o" },
      ], [
        { t: "o", r: { d: [1, 4], t: "d" } },
        { t: "o", r: { d: [1, 4], t: "d" } },
        { t: "o", r: { d: [1, 4], t: "d" } },
        { t: "o", s: { d: [2, 5] }, r: { d: [1, 4], t: "d" } },
        { t: "o", r: { d: [1, 4], t: "d" } },
        { t: "o", r: { d: [1, 2, 4], t: "d" } },
        { t: "o", r: { d: [1, 4], t: "d" } },
        { t: "o", r: { d: [1, 3, 5], t: "d" } },
        { t: "f" },
        { t: "f" },
        { t: "f" },
        { t: "o" },
        { t: "o", d: 6, st: { sh: "s" } },
        { t: "o" },
        { t: "o" },
      ], [
        { t: "o" },
        { t: "o" },
        { t: "j" },
        { t: "o", h: 1 },
        { t: "o", s: { d: [2, 6] } },
        { t: "j" },
        { t: "j" },
        { t: "o" },
        { t: "o", r: { d: [2, 4], t: "d" } },
        { t: "f", r: { d: [1, 4], t: "d" } },
        { t: "f", r: { d: [1, 5], t: "d" } },
        { t: "f" },
        { t: "o", h: 1 },
        { t: "o", h: 1 },
        { t: "o", h: 1 },
      ], [
        { t: "o" },
        { t: "o", h: 1 },
        { t: "o", h: 1 },
        { t: "o", s: { d: [3, 5] } },
        { t: "o" },
        { t: "j" },
        { t: "j", h: 1 },
        { t: "o", h: 1 },
        { t: "o", h: 1 },
        { t: "f", h: 1 },
        { t: "f", h: 1, r: { d: [2, 5], t: "d" } },
        { t: "o", h: 1 },
        { t: "f", h: 1 },
        { t: "o", h: 1 },
        { t: "o", h: 2 },
      ], [
        { t: "o", h: 1 },
        { t: "o", h: 1 },
        { t: "o", h: 2 },
        { t: "o", h: 1 },
        { t: "o", s: { d: [2, 5] } },
        { t: "o", h: 1 },
        { t: "j", h: 1 },
        { t: "o", h: 1 },
        { t: "o", h: 1 },
        { t: "o", h: 2 },
        { t: "o", h: 2 },
        { t: "o", h: 1, r: { d: [2, 6], t: "d" } },
        { t: "f", h: 2 },
        { t: "o", h: 2 },
        { t: "o", h: 2 },
      ], [
        { t: "o", h: 1 },
        { t: "o", h: 1 },
        { t: "o", h: 1 },
        { t: "o", h: 2, b: "c", be: [3, 4] },
        { t: "o", s: { d: [2, 5] } },
        { t: "o", h: 2, b: "c", be: [1, 6] },
        { t: "o", h: 2 },
        { t: "o", h: 2 },
        { t: "o", h: 2 },
        { t: "o", h: 2 },
        { t: "o", h: 2, r: { d: [3, 6], t: "d" } },
        { t: "f", h: 2 },
        { t: "o", h: 2 },
        { t: "f", h: 3 },
        { t: "o", h: 3 },
      ], [
        { t: "o", h: 1 },
        { t: "o", h: 1 },
        { t: "b", h: 2 },
        { t: "o", h: 2 },
        { t: "o", h: 2, b: "c", be: [3, 4, 5] },
        { t: "o", s: { d: [2, 6] } },
        { t: "o", h: 2, b: "c", be: [1] },
        { t: "o", h: 3 },
        { t: "o", h: 3 },
        { t: "o", h: 3 },
        { t: "o", h: 3, r: { d: [3, 5], t: "d" } },
        { t: "o", h: 3 },
        { t: "o", h: 3 },
        { t: "f", h: 3 },
        { t: "f", h: 3 },
      ], [
        { t: "o", h: 2 },
        { t: "o", h: 2 },
        { t: "b", h: 2 },
        { t: "o", h: 3, b: "c", be: [4, 5] },
        { t: "o", s: { d: [3, 6] } },
        { t: "o", h: 3, b: "c", be: [1, 2] },
        { t: "o", h: 3 },
        { t: "o", h: 3 },
        { t: "o", h: 3 },
        { t: "o", h: 3 },
        { t: "o", h: 3, r: { d: [2, 5], t: "d" } },
        { t: "o", h: 4 },
        { t: "o", h: 4 },
        { t: "o", h: 4 },
        { t: "o", h: 4 },
      ], [
        { t: "o", h: 2 },
        { t: "o", h: 2 },
        { t: "b", h: 2 },
        { t: "o", h: 3, b: "c", be: [4] },
        { t: "o", h: 1, s: { d: [3, 5] } },
        { t: "o", h: 3, b: "c", be: [1, 2] },
        { t: "o", h: 3 },
        { t: "o", h: 4 },
        { t: "o", h: 3 },
        { t: "o", h: 4 },
        { t: "o", h: 4 },
        { t: "o", h: 4, r: { d: [2, 5], t: "d" } },
        { t: "o", h: 4 },
        { t: "o", h: 5 },
        { t: "o", h: 5 },
      ]
    ]
  })

  const testUnitData = {
    ginf: {
      c: "ger", f: 7, i: "squad", m: 3, n: "Rifle", o: {s: 1}, r: 5, s: 6, t: "sqd", v: 4, y: 0
    },
    gldr: {
      c: "ger", f: 1, i: "leader", m: 6, n:  "Leader", o: {l: 1}, r: 1, s: 1, t: "ldr", v: 6, y: 0
    },
    gmg: {
      c: "ger", f: 8, i: "mg", n: "MG 44", o: {a: 1, r: 1, j: 3}, r: 8, t: "sw", v: 0, y: 42
    },
    gtank: {
      c: "ger", f: 40, i: "tank", n: "Panther D", r: 32, s: 6, t: "tank", v: 5, y: 43,
      o: {t: 1, p: 1, ha: {f: 6, s: 3, r: 3}, ta: {f: 7, s: 4, r: 4}, bd: 3, j: 3, u: 1, k: 1}
    },
    gspag: {
      c: "ger", f: 32, i: "spat", n: "StuG III-F/G", r: 24, s: 4, t: "spg", v: 5, y: 42,
      o: {t: 1, p: 1, ha: {f: 6, s: 1, r: 1}, j: 3, k: 1}
    },
    rinf: {
      c: "ussr", f: 8, i: "squad", m: 4, n: "Guards SMG", o: {a: 1}, r: 3, s: 6, t: "sqd", v: 5, y: 41
    },
    rldr: {
      c: "ussr", t: "ldr", n: "Leader", i: "leader", y: 0, m: 6, s: 1, f: 1, r: 1, v: 6, o: {l: 2}
    },
    rmg: {
      t: "sw", i: "mg", c: "ussr", n: "DShK", y: 38, f: 14, r: 15, v: -2, o: {r: 1, j: 3}
    },
    rgun: {
      c: "ussr", f: 16, i: "gun", n: "76mm M1927", o: {t: 1, j: 3, g: 1, s: 1, c: 1}, r: 16,
      t: "gun", v: 1, y: 28
    },
    rcrew: {
      c: "ussr", t: "tm", n: "Crew", i: "crew", y: 0, m: 4, s: 3, f: 1, r: 1, v: 5, o: {cw: 2}
    },
    rat: {
      c: "ussr", f: 24, i: "atgun", n: "57mm ZiS-2", o: {t: 1, j: 3, p: 1, c: 1}, r: 20, s: 3,
      t: "gun", v: 1, y: 41
    },
    rtank: {
      c: "ussr", f: 48, i: "tank", n: "T-34-85", r: 28, s: 5, t: "tank", v: 6, y: 43,
      o: {t: 1, p: 1, ha: {f: 3, s: 3, r: 3}, ta: {f: 6, s: 4, r: 3}, j: 3, u: 1, k: 1}
    }
  }

  const testUnits = [
    { u: testUnitData.rinf, x: 8, y: 1, f: null, tf: null },
    { u: testUnitData.rtank, x: 10, y: 2, f: 1, tf: 6 },
    { u: testUnitData.rinf, x: 9, y: 2, f: null, tf: null },
    { u: testUnitData.rmg, x: 9, y: 2, f: null, tf: null },
    { u: testUnitData.rldr, x: 9, y: 2, f: null, tf: null },
    { u: testUnitData.gtank, x: 3, y: 2, f: 5, tf: 4 },
    { u: testUnitData.rcrew, x: 10, y: 3, f: null, tf: null },
    { u: testUnitData.rgun, x: 10, y: 3, f: 6, tf: null },
    { u: testUnitData.ginf, x: 5, y: 3, f: null, tf: null },
    { u: testUnitData.rinf, x: 11, y: 4, f: null, tf: null },
    { u: testUnitData.ginf, x: 6, y: 4, f: null, tf: null },
    { u: testUnitData.gmg, x: 6, y: 4, f: null, tf: null },
    { u: testUnitData.gldr, x: 6, y: 4, f: null, tf: null },
    { u: testUnitData.rtank, x: 10, y: 5, f: 1, tf: 1, imm: true },
    { u: testUnitData.rinf, x: 11, y: 6, f: null, tf: null, st: unitStatus.Activated },
    { u: testUnitData.ginf, x: 7, y: 6, f: null, tf: null, st: unitStatus.Broken },
    { u: testUnitData.gspag, x: 0, y: 7, f: 4, tf: null },
    { u: testUnitData.ginf, x: 6, y: 7, f: null, tf: null, st: unitStatus.Pinned },
    { u: testUnitData.ginf, x: 6, y: 10, f: null, tf: null, st: unitStatus.Exhausted },
    { u: testUnitData.gtank, x: 5, y: 11, f: 5, tf: 4, st: unitStatus.Wreck },
    { u: testUnitData.rcrew, x: 14, y: 14, f: null, tf: null },
    { u: testUnitData.rat, x: 14, y: 14, f: 1, tf: null },
  ]

  testUnits.forEach(data => {
    const unit = new Unit(data.u)
    if (data.f) { unit.facing = data.f }
    if (data.tf) { unit.turretFacing = data.tf }
    if (data.st) { unit.status = data.st }
    if (data.imm) { unit.immobilized = true }
    map.addUnit(data.x, data.y, unit)
  })

  useEffect(() => {
    const hexLoader = []
    const overlayLoader = []
    map.showCoords = coords
    map.showAllCounters = statusCounters
    map.mapHexes.forEach((row, y) => {
      row.forEach((hex, x) => {
        hexLoader.push(<MapHex key={`${x}-${y}`} hex={hex} />)
        overlayLoader.push(<MapHexOverlay key={`${x}-${y}-o`} hex={hex} selected={false}
                                          selectCallback={makeSelection}/>)
      })
    })
    setHexes(hexLoader)
    setOverlays(overlayLoader)
    setCounters(map.counters.map((data, i) => {
      const counter = new Counter(data.x, data.y, data.u, map)
      counter.stackingIndex = data.s
      return <MapCounter key={i} counter={counter} />
    }))
  }, [coords, statusCounters])

  const makeSelection = (x, y) => {
    const key = `${x}-${y}`
    // Only use the overlays for selection events
    setOverlays(overlays =>
      overlays.map(h => {
        if (h.key === `${key}-o`) {
          return <MapHexOverlay key={`${x}-${y}-o`} hex={h.props.hex} selected={!h.props.selected}
                                selectCallback={makeSelection}/>
        } else {
          return h
        }
      })
    )
  }

  const hexNarrow = 115
  const hexWide = hexNarrow / 2 / Math.sin(1/3 * Math.PI) * 1.5
  const width = hexNarrow * ((map.width || 0) + 0.5) + 2
  const height = hexWide * ((map.height || 0) + 0.3333) + 2

  return (
    <div className="map-container">
      <div className="flex mb05em">
        <div className="custom-button" onClick={() => setScale(s => s/1.1)}>
          size -
        </div>
        <div className="custom-button" onClick={() => setScale(1)}>
          0
        </div>
        <div className="custom-button" onClick={() => setScale(s => s*1.1)}>
          + size
        </div>
        <div className="custom-button" onClick={() => setCoords(c => !c)}>
          coordinates { coords ? "on" : "off" }
        </div>
        <div className="custom-button"onClick={() => setStatusCounters(sc => !sc)}>
          { statusCounters ? "status counters" : "status badges" }
        </div>
      </div>
      <svg className="map-svg" width={width * scale} height={height * scale}
           viewBox={`0 0 ${width} ${height}`}>
        <MapHexPatterns />
        {hexes}
        {overlays}
        {counters}
      </svg>
    </div>
  )
}