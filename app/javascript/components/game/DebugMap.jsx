import React, { useEffect, useState } from "react";
import { Map } from "../../engine/map";
import MapHex from "./MapHex";

export default function GameMap() {
  const [hexes, setHexes] = useState([])

  const map = new Map({
    layout: [15, 13, "x"],
    hexes: [
      [
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
        { t: "o", h: 1 },
        { t: "o", h: 1 },
        { t: "o", h: 1 },
      ], [
        { t: "o" },
        { t: "o" },
        { t: "o" },
        { t: "o" },
        { t: "o" },
        { t: "o" },
        { t: "o", h: 1 },
        { t: "o", h: 1 },
        { t: "o", h: 1 },
        { t: "o", h: 1 },
        { t: "o", h: 1 },
        { t: "o", h: 1 },
        { t: "o", h: 1 },
        { t: "o", h: 1 },
        { t: "o", h: 2 },
      ], [
        { t: "o", h: 1 },
        { t: "o", h: 1 },
        { t: "o", h: 1 },
        { t: "o", h: 1 },
        { t: "o" },
        { t: "o", h: 1 },
        { t: "o", h: 1 },
        { t: "o", h: 1 },
        { t: "o", h: 1 },
        { t: "o", h: 2 },
        { t: "o", h: 2 },
        { t: "o", h: 1 },
        { t: "o", h: 2 },
        { t: "o", h: 2 },
        { t: "o", h: 2 },
      ], [
        { t: "o", h: 1 },
        { t: "o", h: 1 },
        { t: "o", h: 1 },
        { t: "o", h: 2 },
        { t: "o" },
        { t: "o", h: 2 },
        { t: "o", h: 2 },
        { t: "o", h: 2 },
        { t: "o", h: 2 },
        { t: "o", h: 2 },
        { t: "o", h: 2 },
        { t: "o", h: 2 },
        { t: "o", h: 2 },
        { t: "o", h: 3 },
        { t: "o", h: 3 },
      ], [
        { t: "o", h: 1 },
        { t: "o", h: 1 },
        { t: "o", h: 2 },
        { t: "o", h: 2 },
        { t: "o", h: 2 },
        { t: "o" },
        { t: "o", h: 2 },
        { t: "o", h: 3 },
        { t: "o", h: 3 },
        { t: "o", h: 3 },
        { t: "o", h: 3 },
        { t: "o", h: 3 },
        { t: "o", h: 3 },
        { t: "o", h: 3 },
        { t: "o", h: 3 },
      ], [
        { t: "o", h: 2 },
        { t: "o", h: 2 },
        { t: "o", h: 2 },
        { t: "o", h: 3 },
        { t: "o" },
        { t: "o", h: 3 },
        { t: "o", h: 3 },
        { t: "o", h: 3 },
        { t: "o", h: 3 },
        { t: "o", h: 3 },
        { t: "o", h: 3 },
        { t: "o", h: 4 },
        { t: "o", h: 4 },
        { t: "o", h: 4 },
        { t: "o", h: 4 },
      ], [
        { t: "o", h: 2 },
        { t: "o", h: 2 },
        { t: "o", h: 2 },
        { t: "o", h: 3 },
        { t: "o" },
        { t: "o", h: 3 },
        { t: "o", h: 3 },
        { t: "o", h: 4 },
        { t: "o", h: 3 },
        { t: "o", h: 4 },
        { t: "o", h: 4 },
        { t: "o", h: 4 },
        { t: "o", h: 4 },
        { t: "o", h: 5 },
        { t: "o", h: 5 },
      ]
    ]
  })

  useEffect(() => {
    const hexLoader = []
    map.mapHexes.forEach((row, y) => {
      row.forEach((hex, x) => {
        hexLoader.push(<MapHex key={`${x}-${y}`} hex={hex}/>)
      })
    })
    setHexes(hexLoader)
  }, [])

  const hexNarrow = 96
  const hexWide = hexNarrow / 2 / Math.sin(1/3 * Math.PI) * 1.5
  const width = hexNarrow * ((map.width || 0) + 0.5) + 2
  const height = hexWide * ((map.height || 0) + 0.3333) + 2

  return (
    <div className="map-container">
      <svg className="map-svg" width={width} height={height}
           viewBox={`0 0 ${width} ${height}`}>
        {hexes}
      </svg>
    </div>
  )
}