import React from "react";
import CounterDisplay from "./CounterDisplay";
import GameMap from "./map/GameMap";
import WeatherDisplay from "./map/WeatherDisplay";
import { alliedCodeToPill, axisCodeToPill } from "../utilities/pills";
import Scenario, { ScenarioData } from "../../engine/Scenario";

interface ScenarioSummaryProps {
  data: ScenarioData
}

export default function ScenarioSummary({ data }: ScenarioSummaryProps) {
  const scenario = new Scenario(data)
  const map = scenario.map
  map.preview = true

  const player1Pills = (
    <span>
      { scenario.alliedFactions?.map(f => alliedCodeToPill(f)) }
    </span>
  )

  const player2Pills = (
    <span>
      { scenario.axisFactions?.map(f => axisCodeToPill(f)) }
    </span>
  )

  const scenarioNote = () => {
    if (!scenario.status) { return "" }
    let note = "this scenario is an unfinished prototype.  It is still in initial design \
      and is not yet ready to be played."
    if (scenario.status === "b") {
      note = "this scenario is a beta scenario currently in development.  It is still undergoing \
        testing."
    }
    if (scenario.status === "a") {
      note = "this scenario is a beta scenario currently in development.  It is still undergoing \
        early testing."
    }
    return (
      <p>
        <b>NOTE</b>: {note}  Games using this scenario may be deleted at any time; play at your own
        risk.
      </p>
    )
  }

  return (
    <div className="scenario-description">
      <div className="scenario-description-row background-gray corner-round">
        <div className="red mr05em monospace">{scenario.code}:</div>
        <div className="green flex-fill">
          {scenario.name} {scenario.status ?
            <span className="red">{`[${scenario.statusName}]`}</span>  : ""}
        </div>
        <div className="red ml1em">{scenario.displayDate}</div>
        <div className="green ml1em"> {scenario.location}</div>
      </div>
      <div className="scenario-description-row">
        <div className="mr1em">Turns: <span className="red">{scenario.turns}</span></div>
        <div className="mr1em nowrap">
          Sets up first: {scenario.firstSetup == 1 ? player1Pills : player2Pills}
        </div>
        <div className="mr1em nowrap">
          Initiative: {scenario.firstMove == 1 ? player1Pills : player2Pills}
        </div>
        <div className="flex-fill align-end">Author: <span className="green">{scenario.author}</span></div>
      </div>
      <div className="flex mt1em">
        <div className="p1em mr1em background-gray flex-fill corner-round">
          {scenario.description?.map((p, i) => {
            return <p key={i}>{p}</p>
          })}
          {scenarioNote()}
        </div>
        <div className="p05em corner-round edge-line">
          <GameMap map={map} scale={0.25} />
        </div>
      </div>
      <div className="flex mt1em">
        <div className="mr1em">
          <svg className="map-svg" width={446} height={172} viewBox={"0 0 446 172"}>
            <WeatherDisplay preview={true} map={map} hideCounters={false}
                            xx={2} yy={2} ovCallback={() => {}} />
          </svg>
        </div>
        <div className="flex-fill">
          <div className="flex nowrap">
            {scenario.alliedUnitList.map((unit, i) => {
              if (unit.x !== undefined) {
                return (
                  <div key={i} className="flex nowrap">
                    <div className="unit-list-multiplier">{`${unit.x}x`}</div>
                    <CounterDisplay unit={unit.counter} />
                  </div>
                )
              } else {
                return <CounterDisplay key={i} unit={unit.counter} />
              }
            })}
          </div>
          <div className="flex nowrap">
            {scenario.axisUnitList.map((unit, i) => {
              if (unit.x !== undefined) {
                return (
                  <div key={i} className="flex nowrap">
                    <div className="unit-list-multiplier">{`${unit.x}x`}</div>
                    <CounterDisplay unit={unit.counter} />
                  </div>
                )
              } else {
                return <CounterDisplay key={i} unit={unit.counter} />
              }
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
