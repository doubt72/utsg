import React from "react";
import PropTypes from "prop-types"
import { alliedCodeToPill, axisCodeToPill } from "../utilities/pills";
import { getFormattedDate } from "../../engine/utilities";
import { unitCounter } from "../utilities/units";
import { Unit } from "../../engine/unit";

export default function ScenarioSummary(props) {
  const metadata = props.data.metadata

  const alliedUnits = Object.entries(metadata.allied_units)
    .flatMap(kv => kv[1].list)
  const axisUnits = Object.entries(metadata.axis_units)
    .flatMap(kv => kv[1].list)

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
        <div className="red mr05em monospace">{props.data.id}:</div>
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
      <div className="flex mt1em">
        <div className="p1em mr1em background-gray">
          {metadata.description.map((p, i) => {
            return <p key={i}>{p}</p>
          })}
        </div>
        <div>
          <div className="flex nowrap">
            {alliedUnits.map((unit, i) => {
              if (unit.x !== undefined) {
                return (
                  <div key={i} className="flex nowrap">
                    <div className="unit-list-multiplier">{`${unit.x}x`}</div>
                    <div>{unitCounter(new Unit(unit))}</div>
                  </div>
                )
              } else {
                return <div key={i}>{unitCounter(new Unit(unit))}</div>
              }
            })}
          </div>
          <div className="flex nowrap">
            {axisUnits.map((unit, i) => {
              if (unit.x !== undefined) {
                return (
                  <div key={i} className="flex nowrap">
                    <div className="unit-list-multiplier">{`${unit.x}x`}</div>
                    <div>{unitCounter(new Unit(unit))}</div>
                  </div>
                )
              } else {
                return <div key={i}>{unitCounter(new Unit(unit))}</div>
              }
            })}
          </div>
          <div>
            Map
          </div>
        </div>
      </div>
    </div>
  )
}

ScenarioSummary.propTypes = {
  data: PropTypes.object,
}
