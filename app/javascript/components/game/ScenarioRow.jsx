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
        <div className="scenario-row-name">{props.name}</div>
        <div className="scenario-row-allies">{allies}</div>
        <div className="scenario-row-axis">{axis}</div>
      </div>
    </div>
  )
}

ScenarioRow.propTypes = {
  onClick: PropTypes.func,
  selected: PropTypes.bool,
  code: PropTypes.string,
  name: PropTypes.string,
  allies: PropTypes.array,
  axis: PropTypes.array,
}
