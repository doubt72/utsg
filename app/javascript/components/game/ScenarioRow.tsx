import React from "react";
import { alliedCodeToPill, axisCodeToPill } from "../utilities/pills";
import { ScenarioListData } from "../../engine/Scenario";
import { ratingStars } from "./ScenarioSummary";
import { hexPath } from "../../utilities/graphics";
import { Coordinate } from "../../utilities/commonTypes";

interface ScenarioRowProps {
  onClick: (a: string) => void,
  selected: boolean,
  data: ScenarioListData,
  small?: boolean,
}

export default function ScenarioRow({ onClick, selected, data, small }: ScenarioRowProps) {
  const allies = data.allies.map(a => alliedCodeToPill(a))
  const axis = data.axis.map(a => axisCodeToPill(a))

  const special = () => {
    let char = data.id[0]
    let bg = "#450"
    let fg = "#CE7"
    if (data.id[0] === "9") {
      char = "H"
      bg = "#EEA"
      fg = "#450"
    }
    if (data.id[0] === "8") {
      char = "I"
      bg = "#EEE"
      fg = "#000"
    }
    if (data.id[0] === "7") {
      char = "C"
      bg = "#ACF"
      fg = "#000"
    }
    if (char === "") { return "" }
    return (
      <div className="mr025em" >
        <svg style={{ position: "relative", top: "-1.5px" }} width="20" height="20" viewBox="0 0 20 20">
          <path d={hexPath(new Coordinate(10, 10), 9.5, true)} style={
                  { fill: bg, stroke: "#000", strokeWidth: 1 }
                } />
          <text x="10" y="14.6" fontSize={16} textAnchor="middle" fontFamily="'Courier Prime', monospace"
                style={{ fill: fg }}>
            {char}
          </text>
        </svg>
      </div>
    )
  }

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
      {special()}
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
