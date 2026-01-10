import React from "react";
import { deploymentRulesSection } from "./DeploymentPhaseSection";

export default function SetupSection() {
  return (
    <div>
      <p>
        During game setup, each player deploys their units, first setup player first (this is
        usually not the same player as the player that moves first, though there&apos;s no actual
        rule that it can&apos;t be).
      </p>
      {deploymentRulesSection("setup")}
    </div>
  );
}
