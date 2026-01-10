import React from "react";
import { sequenceOfTurn } from "./GameTurnSection";
import { titleNameStyle } from "../Utilities";

export const sequenceOfPlay = (
  <ol>
    <li>
      <strong>Setup</strong>
      <ol>
        <li><strong>First Setup Player</strong>: deploys units</li>
        <li><strong>Second Setup Player</strong>: deploys units</li>
      </ol>
    </li>
    <li>
      <strong>Game Turn</strong>
      { sequenceOfTurn }
    </li>
    <li>
      <strong>Game Ends</strong>: calculate victory points, bury the dead
    </li>
  </ol>
)

export default function GamePlaySection() {
  const section = "5.0"
  return (
    <div>
      <p>
        <strong>{titleNameStyle}</strong> games are played between two players, generally an Allied
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
      <h3>{section}.1. Sequence of Play</h3>
      <p>
        The sequence of play is as follows:
      </p>
      { sequenceOfPlay }
    </div>
  );
}
