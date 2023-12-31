import React from "react";
import PropTypes from "prop-types"
import { alliedCodeToPill, axisCodeToPill } from "../utilities/pills";

export default function ScenarioRow(props) {
  const allies = props.data.allies.map(a => alliedCodeToPill(a))
  const axis = props.data.axis.map(a => axisCodeToPill(a))

  const statusCode = () => {
    if (!props.data.status) { return "" }
    let code = "!!!"
    if (props.data.status === "a") { code = "⍺" }
    if (props.data.status === "b") { code = "β" }
    return (
      <span className="red">[{code}]</span>
    )
  }

  return (
    <div className={ props.selected ? "scenario-row scenario-row-selected" : "scenario-row" }
      onClick={() => props.onClick(props.data.id)}>
      <div className="scenario-row-code">{props.data.id}:</div>
      <div className="green flex-fill">{props.data.name} {statusCode()}</div>
      <div className="ml05em nowrap">{allies}</div>
      <div className="ml05em nowrap">{axis}</div>
    </div>
  )
}

ScenarioRow.propTypes = {
  onClick: PropTypes.func.isRequired,
  selected: PropTypes.bool.isRequired,
  data: PropTypes.object.isRequired,
}
