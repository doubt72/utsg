import React, { useEffect, useState } from "react";
import Map from "../../../engine/Map";
import Counter from "../../../engine/Counter";
import { Coordinate } from "../../../utilities/commonTypes";
import { HelpButtonLayout } from "../../../utilities/graphics";
import { counterHelpLayout } from "../../../engine/support/help";
import { HelpOverlay } from "./Help";
import { helpIndexByName } from "../../../help/helpData";

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
  const [backgroundColor, setBackgroundColor] = useState("black")

  useEffect(() => {
    const bl = map.counterHelpButtonLayout(new Coordinate(xx, yy), counter) as HelpButtonLayout
    const textColor = "white"
    setHelpButton(
      <g onMouseOver={() => showHelp()} onMouseLeave={() => hideHelp()} onClick = {() => {
          const url = `/help/${helpIndexByName("Counters")}`
          window.open(url)
        }}>
        <path d={bl.path} style={{ fill: backgroundColor, stroke: textColor, strokeWidth: 2 }} />
        <text x={bl.x} y={bl.y} fontSize={bl.size} textAnchor="middle" fontFamily="'Courier Prime', monospace"
              style={{ fill: textColor }} cursor="default">?</text>
      </g>
    )
  }, [xx, yy, backgroundColor])

  const showHelp = () => {
    const layout = counterHelpLayout(counter, new Coordinate(xx + 10, yy + 5), new Coordinate(maxX, maxY), scale)
    setBackgroundColor("#555")
    setHelpDisplay(HelpOverlay(layout))
  }

  const hideHelp = () => {
    setBackgroundColor("black")
    setHelpDisplay(undefined)
  }

  return (
    <g>
      {helpButton}
    </g>
  )
}
