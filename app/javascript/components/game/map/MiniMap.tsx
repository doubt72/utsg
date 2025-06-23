import React, { useEffect, useState } from "react";
import Map from "../../../engine/Map";
import { counterRed, roundedRectangle, roundedRectangleHole } from "../../../utilities/graphics";
import MapDisplay from "./MapDisplay";
import { Coordinate } from "../../../utilities/commonTypes";
import { mapHelpLayout } from "../../../engine/support/help";
import { HelpOverlay } from "./Help";

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
  maxX: number;
  maxY: number;
  svgRef: React.MutableRefObject<HTMLElement>;
  callback: (event: React.MouseEvent, calculated: {
    mapSize: Coordinate,
    scale: number
  }) => void;
  widthCallback: (x: number) => void
}

export default function MiniMap(
  {
    map, xx, yy, maxX, maxY, scale, mapScale, xScale, yScale, xOffset, yOffset, svgRef, callback, widthCallback
  }: MiniMapProps
) {
  const [minimap, setMinimap] = useState<JSX.Element | undefined>()
  const [helpDisplay, setHelpDisplay] = useState<JSX.Element | undefined>()
  const [width, setWidth] = useState<number>(0)

  const updateHelpOverlay = (e: React.MouseEvent) => {
    const text = [
      "map overview:",
      "click to recenter map",
    ]
    if (svgRef.current) {
      const x = e.clientX / scale - svgRef.current.getBoundingClientRect().x + 10
      const y = e.clientY / scale - svgRef.current.getBoundingClientRect().y + 10 - 200 / scale + 200
      const layout = mapHelpLayout(new Coordinate(x, y), new Coordinate(maxX, maxY), text, scale)
      if (!layout.texts) { return }
      setHelpDisplay(HelpOverlay(layout))
    }
  }

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
          <MapDisplay map={map} scale={miniScale} preview={true} forceUpdate={0} />
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
              )}
              onMouseLeave={() => setHelpDisplay(undefined)}
              onMouseMove={e => updateHelpOverlay(e)} />
      </g>
    )
  }, [scale, mapScale, xScale, yScale, xOffset, yOffset, map.game?.lastAction])

  useEffect(() => {
    widthCallback(width + xx + 16)
  }, [width])

  return (
    <g>
     { minimap }
     { helpDisplay }
    </g>
  )
}
