import React from "react";
import { deploymentRulesSection } from "./DeploymentPhaseSection";
import { SectionProps } from "../game/HelpDisplay";

export default function SetupSection({ section }: SectionProps) {
  return (
    <div>
      <p>
        During game setup, each player deploys their units, first setup player first.
      </p>
      {deploymentRulesSection("setup", section ?? "")}
    </div>
  );
}
