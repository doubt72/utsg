import React from "react";
import { HelpLayout } from "../../../utilities/graphics";

export interface HelpSectionProps {
  section: string[];
}

export function HelpOverlay(layout: HelpLayout): JSX.Element | undefined {
  return (
    <g>
      <path d={layout.path} style={layout.style as object} opacity={layout.opacity} />
      {
        layout.texts.map((t, i) => 
          <text key={i} x={t.x} y={t.y} fontSize={layout.size} fontFamily="'Courier Prime', monospace"
                textAnchor="start" style={layout.tStyle as object}>{t.value}</text>
        )
      }
    </g>
  )
}
