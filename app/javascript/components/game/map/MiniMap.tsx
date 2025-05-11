import React from "react";
import Map from "../../../engine/Map";
import { counterRed, roundedRectangle } from "../../../utilities/graphics";
import GameMap from "./GameMap";
import { Coordinate } from "../../../utilities/commonTypes";

interface MiniMapProps {
  map: Map;
  xx: number;
  yy: number;
  xScale: number;
  yScale: number;
  xOffset: number;
  yOffset: number;
  callback: (event: React.MouseEvent, calculated: {
    size: Coordinate,
    mapSize: Coordinate,
    scale: number
  }) => void;
}

export default function MiniMap({map, xx, yy, xScale, yScale, xOffset, yOffset, callback}: MiniMapProps) {
  const xSize = 250 // inner sizes
  const ySize = 160 // outer size is +10
  const x = map.previewXSize
  const y = map.ySize
  const scale = xSize / x < ySize / y ? xSize / x : ySize / y
  const xShift = (xSize + 14 - x * scale)/2
  const yShift = (ySize + 14 - y * scale)/2
  const xMap = x * scale
  const yMap = y * scale
  console.log(`${xShift},${yShift} + ${xOffset},${yOffset} -> ${xScale},${yScale}`)

  return (
    <g>
      <path d={roundedRectangle(xx, yy, xSize + 10, ySize + 10)}
            style={{ fill: "#EEE", strokeWidth: 1, stroke: "#D5D5D5" }} />
      <g transform={`translate(${xShift} ${yShift})`}>
        <GameMap map={map} scale={scale} preview={true} />
      </g>
      <path d={roundedRectangle(
        xShift + xOffset * xMap, yShift + yOffset * yMap, xScale * xMap, yScale * yMap, 2 )}
            style={{ fill: "rgb(0,0,0,0)", strokeWidth: 1, stroke: counterRed }} />
      <path d={roundedRectangle(xx, yy, xSize + 10, ySize + 10)}
            style={{ fill: "rgb(0,0,0,0)", strokeWidth: 1, stroke: "#rgb(0,0,0,0)" }}
            onClick={event => callback(
              event, {
                size: new Coordinate(xSize, ySize),
                mapSize: new Coordinate(xMap, yMap),
                scale
              }
            )} />
    </g>
  )
}