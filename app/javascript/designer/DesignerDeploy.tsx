import React, { Dispatch, SetStateAction } from "react";
import { ScenarioData } from "../engine/Scenario";

interface DesignerDeployProps {
  scenarioData: ScenarioData;
  setScenarioData: Dispatch<SetStateAction<ScenarioData>>;
  turn: number;
  player: number;
}

export default function DesignerDeploy({
  // scenarioData, setScenarioData,
  turn, player
}: DesignerDeployProps) {
  return (
    <div>
      turn {turn}: player {player}
    </div>
  )
}
