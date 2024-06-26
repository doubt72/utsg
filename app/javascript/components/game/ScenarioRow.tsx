import React from "react";
import { alliedCodeToPill, axisCodeToPill } from "../utilities/pills";
import { ScenarioData } from "../../engine/Scenario";

interface ScenarioRowProps {
  onClick: (a: string) => void;
  selected: boolean;
  data: ScenarioData;
}

export default function ScenarioRow({ onClick, selected, data }: ScenarioRowProps) {
  const allies = data.allies.map(a => alliedCodeToPill(a))
  const axis = data.axis.map(a => axisCodeToPill(a))

  const statusCode = () => {
    if (!data.status) { return "" }
    let code = "!!!"
    if (data.status === "a") { code = "⍺" }
    if (data.status === "b") { code = "β" }
    return (
      <span className="red">[{code}]</span>
    )
  }

  return (
    <div className={ selected ? "scenario-row scenario-row-selected" : "scenario-row" }
      onClick={() => onClick(data.id)}>
      <div className="scenario-row-code">{data.id}:</div>
      <div className="green flex-fill">{data.name} {statusCode()}</div>
      <div className="ml05em nowrap">{allies}</div>
      <div className="ml05em nowrap">{axis}</div>
    </div>
  )
}
