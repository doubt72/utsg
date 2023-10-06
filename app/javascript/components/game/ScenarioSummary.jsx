import React, { useState } from "react";
import { alliedCodeToPill, axisCodeToPill } from "../utilities/pills";

export default function ScenarioSummary(props) {
  const metadata = props.data.metadata

  const player1Pills = (
    <span>
      { props.data.allies.map(faction => alliedCodeToPill(faction)) }
    </span>
  )

  const player2Pills = (
    <span>
      { props.data.axis.map(faction => axisCodeToPill(faction)) }
    </span>
  )

  const displayDate = new Date(metadata.date[0], metadata.date[1], metadata.date[2]).toDateString()

  return (
    <div class="scenario-description">
      <div>
        <span>{props.data.id}</span>
        <span>{props.data.name}</span>
        <span>{displayDate}</span>
        <span>{metadata.location}</span>
      </div>
      <div>
        <span>turns: {metadata.turns}</span>
        <span>
          first setup: {metadata.first_setup == 1 ? player1Pills : player2Pills}
        </span>
        <span>
          irst move: {metadata.first_move == 1 ? player1Pills : player2Pills}
        </span>
      </div>
    </div>
  )
}
