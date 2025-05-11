import React, { useEffect, useState } from "react";
import Map from "../../../engine/Map";
import { counterRed, roundedRectangle, roundedRectangleHole } from "../../../utilities/graphics";
import GameMap from "./GameMap";
import { Coordinate } from "../../../utilities/commonTypes";

interface MiniMapProps {
  map: Map;
  xx: number;
  yy: number;
  scale: number;
  mapScale: number;
  xScale: number;
  yScale: number;
  xOffset: number;
  yOffset: number;
  callback: (event: React.MouseEvent, calculated: {
    mapSize: Coordinate,
    scale: number
  }) => void;
  widthCallback: (x: number) => void
}

export default function MiniMap(
  {
    map, xx, yy, scale, mapScale, xScale, yScale, xOffset, yOffset, callback, widthCallback
  }: MiniMapProps
) {
  const [minimap, setMinimap] = useState<JSX.Element | undefined>()
  const [width, setWidth] = useState<number>(0)

  useEffect(() => {
    const maxXSize = 245 // inner sizes
    const maxYSize = 180 // outer size is +10
    const x = map.previewXSize
    const y = map.ySize
    const miniScale = maxXSize / x < maxYSize / y ? maxXSize / x : maxYSize / y
    const xSize = x * miniScale + 6
    const ySize = y * miniScale + 6
    const xShift = (xSize + 10 - x * miniScale)/2
    const yShift = (ySize + 16 - y * miniScale)/2
    const xMap = x * miniScale
    const yMap = y * miniScale
    const extraShift = ySize < (139 + 50 / scale - 50) ? (139 + 50 / scale - 50) - ySize : 0

    const xI = xShift + xOffset * xMap
    const yI = yShift + yOffset * yMap + extraShift
    const wI = xScale * xMap
    const hI = yScale * yMap
    const xO = xShift
    const yO = yShift + extraShift
    const wO = xSize - 6
    const hO = ySize - 6

    setWidth(() => xSize)
    setMinimap(
      <g>
        <path d={roundedRectangle(xx, yy + extraShift, xSize + 6, ySize + 6)}
              style={{ fill: "#EEE", strokeWidth: 4, stroke: "#670", fillRule: "evenodd" }} />
        <g transform={`translate(${xShift} ${yShift + extraShift})`}>
          <GameMap map={map} scale={miniScale} preview={true} />
        </g>
        <path d={roundedRectangleHole(xO, yO, wO, hO, xI, yI, wI, hI, 5)}
              style={{ fill: "rgb(0,0,0,0.2)", strokeWidth: 0, stroke: "rgb(0,0,0,0)" }} />
        <path d={roundedRectangle(xI, yI, wI, hI, 5)}
              style={{ fill: "rgb(0,0,0,0)", strokeWidth: 1, stroke: counterRed }} />
        <path d={roundedRectangle(xx, yy + extraShift, xSize + 6, ySize + 6)}
              style={{ fill: "rgb(0,0,0,0)", strokeWidth: 1, stroke: "#rgb(0,0,0,0)" }}
              onClick={event => callback(
                event, {
                  mapSize: new Coordinate(xMap, yMap),
                  scale: miniScale
                }
              )} />
      </g>
    )
  }, [scale, mapScale, xScale, yScale, xOffset, yOffset, map.game?.lastMove])

  useEffect(() => {
    widthCallback(width + xx + 16)
  }, [width])

  return minimap
}