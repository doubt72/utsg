import React from "react";
import IntroSection from "./IntroSection";
import CounterSection from "./CounterSection";
import TerrainSection from "./TerrainSection";
import GamePlaySection from "./GamePlaySection";
import SetupSection from "./SetupSection";
import CounterStackingSection from "./CounterStackingSection";
import GameTurnSection from "./GameTurnSection";
import DeploymentPhaseSection from "./DeploymentPhaseSection";
import PrepPhaseSection from "./PrepPhaseSection";
import MainPhaseSection from "./MainPhaseSection";
import MovementSection from "./MovementSection";
import CleanupPhaseSection from "./CleanupPhaseSection";
import GlossarySection from "./GlossarySection";
import CounterFacingSection from "./CounterFacingSection";
import LineOfSightSection from "./LineOfSightSection";
import ElevationSection from "./ElevationSection";
import InterfaceSection from "./InterfaceSection";
import RushSection from "./RushSection";
import AssaultMoveSection from "./AssaultMoveSection";
import FireSection from "./FireSection";
import IntensiveFireSection from "./IntensiveFireSection";
import ReactionFireSection from "./ReactionFireSection";
import RallySection from "./RallySection";
import RoutSection from "./RoutSection";
import CloseCombatSection from "./CloseCombatSection";
import HousekeepingSection from "./HousekeepingSection";
import DevNotesSection from "./DevNotesSection";

export type HelpSection = {
  name: string,
  fullName: string,
  section?: JSX.Element,
  children?: HelpSection[]
}

export const helpIndex: HelpSection[] = [
  { name: "Introduction", fullName: "Introduction", section: <IntroSection /> },
  { name: "Game Interface", fullName: "Game Interface", section: <InterfaceSection /> },
  { name: "Counters", fullName: "Game Counters", section: <CounterSection />, children: [
    { name: "Stacking", fullName: "Stacking Counters", section: <CounterStackingSection /> },
    { name: "Facing", fullName: "Counter Facing", section: <CounterFacingSection /> },
  ] },
  { name: "Terrain", fullName: "Map Terrain", section: <TerrainSection />, children: [
    { name: "Line of Sight", fullName: "Line of Sight and Hindrance", section: <LineOfSightSection /> },
    { name: "Elevation", fullName: "Elevation", section: <ElevationSection /> },
  ] },
  { name: "Game Play", fullName: "Game Play", section: <GamePlaySection />, children: [
    { name: "Setup", fullName: "Game Setup", section: <SetupSection /> },
    { name: "Game Turn", fullName: "Game Turn", section: <GameTurnSection />, children: [
      { name: "Deployment Phase", fullName: "Deployment Phase", section: <DeploymentPhaseSection /> },
      { name: "Prep Phase", fullName: "Prep Phase", section: <PrepPhaseSection />, children: [
        { name: "Rallying", fullName: "Rallying", section: <RallySection /> },
      ]},
      { name: "Main Phase", fullName: "Main Phase", section: <MainPhaseSection />, children: [
        { name: "Fire", fullName: "Fire", section: <FireSection /> },
        { name: "Intensive Fire", fullName: "Intensive Fire", section: <IntensiveFireSection /> },
        { name: "Movement", fullName: "Movement", section: <MovementSection /> },
        { name: "Rush Move", fullName: "Rush Movement", section: <RushSection /> },
        { name: "Assault Move", fullName: "Assault Movement", section: <AssaultMoveSection /> },
        { name: "Routing", fullName: "Routing Units", section: <RoutSection /> },
        { name: "Reaction Fire", fullName: "Reaction Fire", section: <ReactionFireSection /> },
      ]},
      { name: "Cleanup Phase", fullName: "Cleanup Phase", section: <CleanupPhaseSection />, children: [
        { name: "Close Combat", fullName: "Close Combat", section: <CloseCombatSection /> },
        { name: "Housekeeping", fullName: "Housekeeping", section: <HousekeepingSection /> },
      ]},
    ]},
  ]},
  { name: "Glossary", fullName: "Glossary", section: <GlossarySection /> },
  { name: "Dev Notes", fullName: "Developer Notes", section: <DevNotesSection /> },
]

export function redNumber(n: number): JSX.Element {
  return (
    <svg width={20} height={20} viewBox="0 0 26 26" className="mr025em" style={{ verticalAlign: "-4px" }}>
      <circle cx={13} cy={13} r={12} style={{ fill: "#E00", stroke: "white", strokeWidth: 2 }} />
      <text x={13} y={19} textAnchor="middle" fontSize={16} style={{ fill: "white" }}>{n}</text>
    </svg>
  )
}

export function findHelpSection(curr: number[]): HelpSection | undefined {
  let part = helpIndex[curr[0]]
  for (let i = 1; i < curr.length; i++) {
    if (!part.children) {
      return
    }
    part = part.children[curr[i]]
  }
  return part
}

export function helpIndexByName(name: string): number[] {
  return subSectionByIndex(helpIndex, [], name).map(n => n+1)
}

function subSectionByIndex(sections: HelpSection[], base: number[], name: string): number[] {
  for (let i = 0; i < sections.length; i++) {
    const key = base.concat(i)
    if (sections[i].name === name) { return key }
    if (sections[i].children) {
      const sub = subSectionByIndex(sections[i].children as HelpSection[], key, name)
      if (sub.length > 0) { return sub }
    }
  }
  return []
}