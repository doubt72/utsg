import React from "react";
import IntroSection from "./IntroSection";
import CounterSection from "./CounterSection";
import TerrainSection from "./TerrainSection";
import GamePlaySection from "./GamePlaySection";
import SetupSection from "./SetupSection";
import DeploymentSection from "./DeploymentSection";
import CounterStackingSection from "./CounterStackingSection";
import GameTurnSection from "./GameTurnSection";
import DeploymentPhaseSection from "./DeploymentPhaseSection";
import PrepPhaseSection from "./PrepPhaseSection";
import MainPhaseSection from "./MainPhaseSection";
import InitiativeSection from "./InitiativeSection";
import MovementSection from "./MovementSection";
import CleanupPhaseSection from "./CleanupPhaseSection";
import GlossarySection from "./GlossarySection";

export type HelpSection = { name: string, section?: JSX.Element, children?: HelpSection[] }

export const helpIndex: HelpSection[] = [
  { name: "Introduction", section: <IntroSection /> },
  { name: "Glossary", section: <GlossarySection /> },
  { name: "Counters", section: <CounterSection /> },
  { name: "Terrain", section: <TerrainSection /> },
  { name: "Game Play", section: <GamePlaySection />, children: [
    { name: "Setup", section: <SetupSection />, children: [
      { name: "Deployment", section: <DeploymentSection /> },
      { name: "Counter Stacking", section: <CounterStackingSection /> },
    ]},
    { name: "Game Turn", section: <GameTurnSection />, children: [
      { name: "Deployment Phase", section: <DeploymentPhaseSection /> },
      { name: "Prep Phase", section: <PrepPhaseSection />, children: [
        { name: "Rallying", section: undefined },
        { name: "Precipitation", section: undefined },
      ]},
      { name: "Main Phase", section: <MainPhaseSection />, children: [
        { name: "Initiative", section: <InitiativeSection /> },
        { name: "Fire", section: undefined },
        { name: "Intensive Fire", section: undefined },
        { name: "Move", section: <MovementSection /> },
        { name: "Rush", section: undefined },
        { name: "Assault Move", section: undefined },
        { name: "Rout", section: undefined },
        { name: "Opportunity Fire", section: undefined },
      ]},
      { name: "Cleanup Phase", section: <CleanupPhaseSection />, children: [
        { name: "Close Combat", section: undefined },
        { name: "Smoke and Fires", section: undefined },
        { name: "Variable Weather", section: undefined },
      ]},
    ]},
  ]},
]