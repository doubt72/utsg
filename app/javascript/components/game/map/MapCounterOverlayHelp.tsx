import React, { useEffect, useState } from "react";
import Map from "../../../engine/Map";
import Counter from "../../../engine/Counter";
import { Coordinate } from "../../../utilities/commonTypes";
import { HelpButtonLayout } from "../../../utilities/graphics";
import { counterHelpLayout } from "../../../engine/support/help";
import { HelpOverlay } from "./Help";

interface MapCounterOverlayHelpProps {
  map: Map;
  counter: Counter;
  xx: number;
  yy: number;
  maxX: number;
  maxY: number;
  scale: number;
  setHelpDisplay: (a: JSX.Element | undefined) => void;
}

export default function MapCounterOverlayHelp({
  map, counter, xx, yy, maxX, maxY, scale, setHelpDisplay
}: MapCounterOverlayHelpProps) {
  const [helpButton, setHelpButton] = useState<JSX.Element | undefined>()

  useEffect(() => {
    const bl = map.counterHelpButtonLayout(new Coordinate(xx, yy), counter) as HelpButtonLayout
    setHelpButton(
      <g onMouseOver={() => showHelp()} onMouseLeave={() => hideHelp()} >
        <path d={bl.path} style={{ fill: "#450", stroke: "#CE7", strokeWidth: 2 }} />
        <text x={bl.x} y={bl.y} fontSize={bl.size} textAnchor="middle" fontFamily="'Courier Prime', monospace"
              style={{ fill: "#CE7" }} cursor="default">?</text>
      </g>
    )
  }, [xx, yy])

  const showHelp = () => {
    const layout = counterHelpLayout(counter, new Coordinate(xx + 10, yy + 5), new Coordinate(maxX, maxY), scale)
    setHelpDisplay(HelpOverlay(layout))
  }

  const hideHelp = () => {
    setHelpDisplay(undefined)
  }

  return (
    <g>
      {helpButton}
    </g>
  )
}
