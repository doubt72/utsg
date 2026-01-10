import React from "react";

export const sequenceOfTurn = (
  <ol>
    <li>
      <strong>Deployment Phase</strong>
      <ol>
        <li>
          <strong>Initiative Player</strong>: place reinforcements
        </li>
        <li>
          <strong>Non-Initiative Player</strong>: place reinforcements
        </li>
      </ol>
    </li>
    <li>
      <strong>Prep Phase</strong>
      <ol>
        <li>
          <strong>Rally/Repair Units</strong>: initiative player first
        </li>
        <li>
          <strong>Weather</strong>: precipitation check
        </li>
      </ol>
    </li>
    <li>
      <strong>Main Phase</strong>
      <ol>
        <li>
          <strong>Actions</strong>: initiative player first until both pass
        </li>
      </ol>
    </li>
    <li>
      <strong>Cleanup Phase</strong>
      <ol>
        <li>
          <strong>Close Combat</strong>: resolve all close combats, initiative player chooses order
        </li>
        <li>
          <strong>Housekeeping</strong>:
            <ol>
              <li><strong>Check Stacking</strong>: remove overstacked units</li>
              <li><strong>Unit Status</strong>: update status markers</li>
              <li><strong>Smoke Check</strong>: check smoke dispersion</li>
              <li><strong>Fire Check</strong>: check if fire spreads or is extinguished</li>
              <li><strong>Weather</strong>: check variable weather</li>
            </ol>
        </li>
      </ol>
    </li>
  </ol>
);

export default function GameTurnSection() {
  const section = "5.2.0"
  return (
    <div>
      <p>
        Each game has a fixed number of turns, mostly in the main phase as initiative goes back and
        forth between the players. When all of the turns have been completed, the winner is
        determined based on objective victory points as well as points for units eliminated.
      </p>
      <p>
        The following sections of the documentation go into the details of the rules for how to play
        each turn and phase.
      </p>
      <h3>{section}.1. Turn Sequence</h3>
      <p>
        The turn sequence is as follows:
      </p>
      {sequenceOfTurn}
    </div>
  );
}
