import React from "react";
import { titleName } from "../utilities/utilities";

export default function GamePlaySection() {
  const sequenceOfPlay = (
    <ol>
      <li>
        Setup
        <ol>
          <li>First setup player deploys units</li>
          <li>Second setup player deploys units</li>
        </ol>
      </li>
      <li>
        Game Turn
        <ol>
          <li>Deployment: place reinforcements (initiative player first)</li>
          <li>Prep Phase: rally/repair units, housekeeping</li>
          <li>Main Phase: initiative player starts first action</li>
          <li>Cleanup Phase: close combat, housekeeping</li>
        </ol>
      </li>
      <li>Game ends: calculate victory points</li>
    </ol>
  )

  return (
    <div>
      <h1>Game Play</h1>
      <p>
        <strong>{titleName}</strong> games are played between two players, generally an Allied
        player (player one) and an Axis player (player two). At a high level, each game has a setup
        (deployment) phase, then a fixed number of turns that are played out, mostly in the main
        phase as initiative goes back and forth between the players. When all of the turns have been
        completed, the winner is determined based on objective victory points as well as points for
        units eliminated.
      </p>
      <p>
        The following sections of the documentation go into the details of the rules for how to play
        each turn and phase.
      </p>
      <h2>Sequence of Play</h2>
      { sequenceOfPlay }
    </div>
  );
}
