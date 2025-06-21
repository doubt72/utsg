import React from "react";
import IntroSection from "./IntroSection";

export type HelpSection = { name: string, section?: JSX.Element, children?: HelpSection[] }

export const helpIndex: HelpSection[] = [
  { name: "Introduction", section: <IntroSection /> },
  { name: "Counters", section: undefined },
  { name: "Terrain", section: undefined },
  { name: "Game Play", section: undefined, children: [
    { name: "Setup", section: undefined, children: [
      { name: "Deployment", section: undefined },
      { name: "Counter Stacking", section: undefined },
    ]},
    { name: "Game Turn", section: undefined, children: [
      { name: "Deployment Phase", section: undefined },
      { name: "Prep Phase", section: undefined },
      { name: "Main Phase", section: undefined },
      { name: "Cleanup Phase", section: undefined },
    ]},
  ]},
]