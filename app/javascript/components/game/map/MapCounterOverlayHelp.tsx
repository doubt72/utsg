import React, { useEffect, useState } from "react";
import Map from "../../../engine/Map";
import Counter from "../../../engine/Counter";
import { Coordinate } from "../../../utilities/commonTypes";
import { HelpButtonLayout } from "../../../utilities/graphics";
import { counterHelpLayout } from "../../../engine/support/help";

interface MapCounterOverlayHelpProps {
  map: Map;
  counter: Counter;
  xx: number;
  yy: number;
  maxX: number;
  maxY: number;
  setHelpDisplay: (a: JSX.Element | undefined) => void;
}

export default function MapCounterOverlayHelp({
  map, counter, xx, yy, maxX, maxY, setHelpDisplay
}: MapCounterOverlayHelpProps) {
  const [helpButton, setHelpButton] = useState<JSX.Element | undefined>()

  useEffect(() => {
    const bl = map.counterHelpButtonLayout(new Coordinate(xx, yy), counter) as HelpButtonLayout
    setHelpButton(
      <g onMouseOver={() => showHelp()} onMouseLeave={() => hideHelp()} >
        <path d={bl.path} style={{ fill: "black", stroke: "white", strokeWidth: 2 }} />
        <text x={bl.x} y={bl.y} fontSize={bl.size} textAnchor="middle" fontFamily="'Courier Prime', monospace"
              style={{ fill: "white" }} cursor="default">?</text>
      </g>
    )
  }, [xx, yy])

  const showHelp = () => {
    const layout = counterHelpLayout(counter, new Coordinate(xx + 20, yy - 10), new Coordinate(maxX, maxY))
    setHelpDisplay(
      <g>
        <path d={layout.path} style={layout.style as object} />
        {
          layout.texts?.map((t, i) => 
            <text key={i} x={t.x} y={t.y} fontSize={layout.size} fontFamily="'Courier Prime', monospace"
                  textAnchor="start" style={{ fill: "white" }}>{t.value}</text>
          )
        }
      </g>
    )
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
