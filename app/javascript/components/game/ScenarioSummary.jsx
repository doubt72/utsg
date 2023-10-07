import React from "react";
import PropTypes from "prop-types"
import { alliedCodeToPill, axisCodeToPill } from "../utilities/pills";
import { getFormattedDate } from "../../engine/utilities";

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

  const displayDate = getFormattedDate(new Date(metadata.date[0], metadata.date[1], metadata.date[2]))

  return (
    <div className="scenario-description">
      <div className="scenario-description-row background-gray">
        <div className="red mr05em">{props.data.id}:</div>
        <div className="green flex-fill">{props.data.name}</div>
        <div className="red ml1em">{displayDate}</div>
        <div className="green ml1em"> {metadata.location}</div>
      </div>
      <div className="scenario-description-row">
        <div className="mr1em">Turns: <span className="red">{metadata.turns}</span></div>
        <div className="mr1em nowrap">
          Sets up first: {metadata.first_setup == 1 ? player1Pills : player2Pills}
        </div>
        <div className="mr1em nowrap">
          Moves first: {metadata.first_move == 1 ? player1Pills : player2Pills}
        </div>
        <div className="flex-fill align-end">By: {metadata.author}</div>
      </div>
      <div className="scenario-description-description background-gray">
        {metadata.description.map((p, i) => {
          return <p key={i}>{p}</p>
        })}
      </div>
    </div>
  )
}

ScenarioSummary.propTypes = {
  data: PropTypes.object,
}
