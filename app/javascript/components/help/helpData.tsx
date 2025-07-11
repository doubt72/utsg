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

export type HelpSection = { name: string, section?: JSX.Element, children?: HelpSection[] }

export const helpIndex: HelpSection[] = [
  { name: "Introduction", section: <IntroSection /> },
  { name: "Game Interface", section: <InterfaceSection /> },
  { name: "Counters", section: <CounterSection />, children: [
    { name: "Stacking", section: <CounterStackingSection /> },
    { name: "Facing", section: <CounterFacingSection /> },
  ] },
  { name: "Terrain", section: <TerrainSection />, children: [
    { name: "Line of Sight", section: <LineOfSightSection /> },
    { name: "Elevation", section: <ElevationSection /> },
  ] },
  { name: "Game Play", section: <GamePlaySection />, children: [
    { name: "Setup", section: <SetupSection /> },
    { name: "Game Turn", section: <GameTurnSection />, children: [
      { name: "Deployment Phase", section: <DeploymentPhaseSection /> },
      { name: "Prep Phase", section: <PrepPhaseSection />, children: [
        { name: "Rallying", section: undefined },
      ]},
      { name: "Main Phase", section: <MainPhaseSection />, children: [
        { name: "Fire", section: <FireSection /> },
        { name: "Intensive Fire", section: undefined },
        { name: "Move", section: <MovementSection /> },
        { name: "Rush", section: <RushSection /> },
        { name: "Assault Move", section: <AssaultMoveSection /> },
        { name: "Rout", section: undefined },
        { name: "Opportunity Fire", section: undefined },
      ]},
      { name: "Cleanup Phase", section: <CleanupPhaseSection />, children: [
        { name: "Close Combat", section: undefined },
        { name: "Housekeeping", section: undefined },
      ]},
    ]},
  ]},
  { name: "Glossary", section: <GlossarySection /> },
  { name: "Dev Notes", section: undefined },
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

export function flatHelpIndexes(): number[][] {
  return flatSubSections(helpIndex, [])
}

export function helpIndexByName(name: string): number[] {
  return subSectionByIndex(helpIndex, [], name).map(n => n+1)
}

function flatSubSections(sections: HelpSection[], base: number[]) {
  let keys: number[][] = []
  for (let i = 0; i < sections.length; i++) {
    const key = base.concat(i)
    keys.push(key)
    if (findHelpSection(key)?.children) {
      keys = keys.concat(flatSubSections(sections[i].children as HelpSection[], key))
    }
  }
  return keys
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