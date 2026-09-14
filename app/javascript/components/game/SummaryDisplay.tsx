import React from "react";
import { XCircle } from "react-bootstrap-icons";
import Scenario from "../../engine/Scenario";
import ScenarioSummary from "./ScenarioSummary";

interface SummaryDisplayProps {
  scenario: Scenario;
  close: () => void;
}

export default function SummaryDisplay({ scenario, close }: SummaryDisplayProps ) {
  return (
    <div className="game-summary">
      <div className="summary-window">
        <div className="game-summary-buttons">
          <div className="flex">
            <div className="flex-fill"></div>
            <div className="mb025em">
              <button onClick={close} className="custom-button nowrap">
                <XCircle />close
              </button>
            </div>
          </div>
        </div>
        <div className="summary-window-inner">
          <ScenarioSummary data={scenario.rawData} />
        </div>
      </div>
    </div>
  )
}
