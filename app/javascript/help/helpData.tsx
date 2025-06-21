import React from "react";
import IntroSection from "./IntroSection";

type HelpType = {
  [index: string]:
    { name: string, section?: JSX.Element, children?: HelpType }
}

export const helpIndex: HelpType = {
  intro: { name: "Introduction", section: <IntroSection /> },
  counter: { name: "Counters", section: undefined },
  terrain: { name: "Terrain", section: undefined },
  play: { name: "Game Play", section: undefined, children: {
    setup: { name: "Setup", section: undefined, children: {
      deployment: { name: "Deployment", section: undefined },
      stacking: { name: "Counter Stacking", section: undefined },
    }},
    turn: { name: "Game Turn", section: undefined, children: {
      deployment: { name: "Deployment Phase", section: undefined },
      prep: { name: "Prep Phase", section: undefined },
      main: { name: "Main Phase", section: undefined },
      cleanup: { name: "Cleanup Phase", section: undefined },
    }}
  }}
}
