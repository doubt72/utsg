import React from "react";
import PropTypes from "prop-types"
import { alliedCodeToPill, axisCodeToPill } from "../utilities/pills";

export default function ScenarioRow(props) {
  const allies = props.allies.map(a => alliedCodeToPill(a))
  const axis = props.axis.map(a => axisCodeToPill(a))

  return (
    <div>
      <div className={ props.selected ? "scenario-row scenario-row-selected" : "scenario-row" }
        onClick={() => props.onClick(props.code)}>
        <div className="scenario-row-code">{props.code}:</div>
        <div className="green flex-fill">{props.name}</div>
        <div className="ml05em nowrap">{allies}</div>
        <div className="ml05em nowrap">{axis}</div>
      </div>
    </div>
  )
}

ScenarioRow.propTypes = {
  onClick: PropTypes.func.isRequired,
  selected: PropTypes.bool.isRequired,
  code: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  allies: PropTypes.array.isRequired,
  axis: PropTypes.array.isRequired,
}
