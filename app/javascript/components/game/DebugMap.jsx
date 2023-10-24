import React, { useEffect, useState } from "react";
import { Map } from "../../engine/map";
// import { Unit } from "../../engine/unit";
import MapHex from "./MapHex";
import MapHexOverlay from "./MapHexOverlay";
import MapHexPatterns from "./MapHexPatterns";

export default function GameMap() {
  const [hexes, setHexes] = useState([])
  const [overlays, setOverlays] = useState([])
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

  // const testUnits = [
  //   new Unit({
  //     c: "ger", f: 16, i: "tank", n: "PzKpfw IV-F1",
  //     o: {t: 1, g: 1, ha: {f: 4, s: 3, r: 2}, ta: {f: 4, s: 3, r: 3}, j: 3, u: 1, k: 1},
  //     r: 16, s: 4, t: "tank", v: 5, y: 41
  //   }), new Unit({
  //     c: "ger", f: 16, i: "spg", n: "StuG III-B/E",
  //     o: {t: 1, g: 1, ha: {f: 4, s: 1, r: 1}, j: 3, k: 1},
  //     r: 16, s: 4, t: "spg", v: 5, y: 40
  //   }), new Unit({
  //     c: "ger", f: 40, i: "tank", n: "Panther A/G",
  //     o: {t: 1, p: 1, ha: {f: 6, s: 3, r: 3}, ta: {f: 7, s: 4, r: 4}, j: 3, u: 1, k: 1},
  //     r: 32, s: 6, t: "tank", v: 6, y: 43
  //   }), new Unit({
  //     c: "uk", f: 32, i: "ac", n: "Humber AC I",
  //     o: {r: 1, ha: {f: 1, s: 0, r: 0}, ta: {f: 1, s: 1, r: 1}, j: 3, u: 1, w: 1},
  //     r: 15, s: 3, t: "ac", v: 5, y: 40
  //   }), new Unit({
  //     c: "usa", f: 10, i: "mg", n: "M2 Browning", o: {r: 1, j: 3}, r: 15, t: "sw", v: -2, y: 33
  //   }), new Unit({
  //     c: "ussr", f: 48, i: "tank", n: "T-34-85",
  //     o: {t: 1, p: 1, ha: {f: 3, s: 3, r: 3}, ta: {f: 6, s: 4, r: 3}, j: 3, u: 1, k: 1},
  //     r: 28, s: 5, t: "tank", v: 6, y: 43
  //   })
  // ]

  useEffect(() => {
    const hexLoader = []
    const overlayLoader = []
    map.mapHexes.forEach((row, y) => {
      row.forEach((hex, x) => {
        hexLoader.push(<MapHex key={`${x}-${y}`} hex={hex} />)
        overlayLoader.push(<MapHexOverlay key={`${x}-${y}-o`} hex={hex} selected={false}
                                          selectCallback={makeSelection}/>)
      })
    })
    setHexes(hexLoader)
    setOverlays(overlayLoader)
  }, [])

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

  const hexNarrow = 96
  const hexWide = hexNarrow / 2 / Math.sin(1/3 * Math.PI) * 1.5
  const width = hexNarrow * ((map.width || 0) + 0.5) + 2
  const height = hexWide * ((map.height || 0) + 0.3333) + 2

  return (
    <div className="map-container">
      <svg className="map-svg" width={width} height={height}
           viewBox={`0 0 ${width} ${height}`}>
        <MapHexPatterns />
        {hexes}
        {overlays}
      </svg>
    </div>
  )
}