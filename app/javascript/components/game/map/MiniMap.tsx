import React, { useEffect, useState } from "react";
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
    mapSize: Coordinate,
    scale: number
  }) => void;
  widthCallback: (x: number) => void
}

export default function MiniMap(
  {map, xx, yy, xScale, yScale, xOffset, yOffset, callback, widthCallback }: MiniMapProps
) {
  const [minimap, setMinimap] = useState<JSX.Element | undefined>()
  const [width, setWidth] = useState<number>(0)

  useEffect(() => {
    const maxXSize = 245 // inner sizes
    const maxYSize = 180 // outer size is +10
    const x = map.previewXSize
    const y = map.ySize
    const scale = maxXSize / x < maxYSize / y ? maxXSize / x : maxYSize / y
    const xSize = x * scale + 6
    const ySize = y * scale + 6
    const xShift = (xSize + 10 - x * scale)/2
    const yShift = (ySize + 20 - y * scale)/2
    const xMap = x * scale
    const yMap = y * scale
    const extraShift = ySize < 137 ? 137 - ySize : 0
    setWidth(() => xSize)
    setMinimap(
      <g>
        <path d={roundedRectangle(xx, yy + extraShift, xSize + 6, ySize + 6)}
              style={{ fill: "#BBB", strokeWidth: 4, stroke: "#670" }} />
        <g transform={`translate(${xShift} ${yShift + extraShift})`}>
          <GameMap map={map} scale={scale} preview={true} />
        </g>
        <path d={roundedRectangle(
          xShift + xOffset * xMap, yShift + yOffset * yMap + extraShift, xScale * xMap, yScale * yMap, 2 )}
              style={{ fill: "rgb(0,0,0,0)", strokeWidth: 1, stroke: counterRed }} />
        <path d={roundedRectangle(xx, yy + extraShift, xSize + 6, ySize + 6)}
              style={{ fill: "rgb(0,0,0,0)", strokeWidth: 1, stroke: "#rgb(0,0,0,0)" }}
              onClick={event => callback(
                event, {
                  mapSize: new Coordinate(xMap, yMap),
                  scale
                }
              )} />
      </g>
    )
  }, [xScale, xOffset, yOffset, map.game?.lastMove])

  useEffect(() => {
    widthCallback(width + xx + 16)
  }, [width])

  return minimap
}