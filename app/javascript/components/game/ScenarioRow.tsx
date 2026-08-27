import React from "react";
import { alliedCodeToPill, axisCodeToPill } from "../utilities/pills";
import { ScenarioListData } from "../../engine/Scenario";
import { ratingStars } from "./ScenarioSummary";

interface ScenarioRowProps {
  onClick: (a: string) => void,
  selected: boolean,
  data: ScenarioListData,
  small?: boolean,
}

export default function ScenarioRow({ onClick, selected, data, small }: ScenarioRowProps) {
  const allies = data.allies.map(a => alliedCodeToPill(a))
  const axis = data.axis.map(a => axisCodeToPill(a))

  const statusCode = () => {
    if (!data.status) { return "" }
    let code = "!"
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
      { small ? "" : <div className="ml05em nowrap">{allies}</div> }
      { small ? "" : <div className="ml05em nowrap">{axis}</div> }
      { small ? "" : <div className="ml05em nowrap scenario-row-percentage">
        {Math.round(data.wins.one / (data.wins.one + data.wins.two) * 100)}%
      </div> }
      { small ? "" : <div className="ml05em nowrap">{ratingStars(data.rating.average)}</div> }
    </div>
  )
}
