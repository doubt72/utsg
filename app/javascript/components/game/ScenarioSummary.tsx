import React from "react";
import CounterDisplay from "./CounterDisplay";
import MapDisplay from "./map/MapDisplay";
import WeatherDisplay from "./map/WeatherDisplay";
import { alliedCodeToPill, axisCodeToPill } from "../utilities/pills";
import Scenario, { ScenarioData } from "../../engine/Scenario";
import { starPath } from "../../utilities/graphics";
import { Coordinate } from "../../utilities/commonTypes";

export function ratingStars(rating: number) {
  const stars: number[] = []
  for (let i = 0; i < 5; i++) {
    stars.push(i+1 < rating ? 1 : (i < rating ? rating - i : 0))
  }
  return (
    <svg className="scenario-row-rating" width={80} height={16} viewBox="0 0 500 100">
      { stars.map((s, i) => <g key={i}>
        <mask id={`star-mask-${i}`}>
          <path d={starPath(new Coordinate(50 + 100*i, 55), 50)} style={{ fill: "#FFF" }}/>
        </mask>
        <path d={starPath(new Coordinate(50 + 100*i, 55), 50)}
              style={({ stroke: "#450", strokeWidth: 5, fill: "#450", strokeLinejoin: "round" })} />
        <rect x={10 + 100*i} y={0} width={s*80} height={100} mask={`url(#star-mask-${i})`}
              style={{ fill: "#CE7" }} />
        <path d={starPath(new Coordinate(50 + 100*i, 55), 50)}
              style={({ stroke: "#000", strokeWidth: 5, fill: "rgba(0,0,0,0)", strokeLinejoin: "round" })} />
      </g>)}
    </svg>
  )
}

export function myRatingStars(rating: number) {
  return (
    <svg className="scenario-row-rating" width={80} height={16} viewBox="0 0 500 100">
      { [0, 1, 2, 3, 4].map(s => <g key={s}>
        <mask id={`star-mask-${s}`}>
          <path d={starPath(new Coordinate(50 + 100*s, 55), 50)} style={{ fill: "#FFF" }}/>
        </mask>
        <path d={starPath(new Coordinate(50 + 100*s, 55), 50)}
              style={({ stroke: "#540", strokeWidth: 5, fill: "#540", strokeLinejoin: "round" })} />
        { rating >= s+1 ? <rect x={10 + 100*s} y={0} width={80} height={100} mask={`url(#star-mask-${s})`}
                              style={{ fill: "#EB0" }} /> : "" }
        <path d={starPath(new Coordinate(50 + 100*s, 55), 50)}
              style={({ stroke: "#000", strokeWidth: 5, fill: "rgba(0,0,0,0)", strokeLinejoin: "round" })} />
      </g>)}
    </svg>
  )
}

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

  const specialRules = () => {
    if (scenario.specialRules.length === 0) { return "" }
    return (
      <>
        <b>SPECIAL RULES:</b>
        <ul>
          {
            scenario.specialRulesList.map((r,i) => {
              return (
                <li key={i}>{r}</li>
              )
            })
          }
        </ul>
      </>
    )
  }

  const scenarioNote = () => {
    if (!scenario.status) { return "" }
    let note = "this scenario is an unfinished prototype.  It is still in initial design \
      and is not yet ready to be played."
    if (scenario.status === "b") {
      note = "this scenario is a beta scenario currently in development.  It is still undergoing \
        testing."
    }
    if (scenario.status === "a") {
      note = "this scenario is an alpha scenario currently in development.  It is still undergoing \
        early testing."
    }
    return (
      <p>
        <b>NOTE</b>: {note}  Games using this scenario may be deleted at any time; play at your own
        risk.
      </p>
    )
  }

  const scale = () => {
    return 6 / (map.width + map.height)
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
          Sets up first: {scenario.firstDeploy == 1 ? player1Pills : player2Pills}
        </div>
        <div className="mr1em nowrap">
          Initiative: {scenario.firstAction == 1 ? player1Pills : player2Pills}
        </div>
        <div className="flex-fill align-end">Author: <span className="green">{scenario.author}</span></div>
      </div>
      <div className="flex mt1em">
        <div className="p1em mr1em background-gray flex-fill corner-round">
          {scenario.description?.map((p, i) => {
            return <p key={i}>{p}</p>
          })}
          {specialRules()}
          {scenarioNote()}
        </div>
        <div>
          <div className="p05em corner-round edge-line">
            <MapDisplay map={map} scale={scale()} preview={true} forceUpdate={0} />
          </div>
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
          <div className="flex flex-wrap">
            {scenario.alliedUnitList.map((unit, i) => {
              if (unit.x !== undefined) {
                return (
                  <div key={i} className="flex nowrap">
                    <div className="unit-list-multiplier">{unit.x > 1 ? `${unit.x}x` : ""}</div>
                    <CounterDisplay unit={unit.counter} />
                  </div>
                )
              } else {
                return <CounterDisplay key={i} unit={unit.counter} />
              }
            })}
          </div>
          <div className="flex flex-wrap">
            {scenario.axisUnitList.map((unit, i) => {
              if (unit.x !== undefined) {
                return (
                  <div key={i} className="flex nowrap">
                    <div className="unit-list-multiplier">{unit.x > 1 ? `${unit.x}x` : ""}</div>
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
      <div className="scenario-description-row background-gray corner-round mt1em">
        <div className="mr05em">Wins: {player1Pills} 105</div>
        <div className="mr05em">{player2Pills} 78</div>
        <div className="ml1em">
          <span className="red">{Math.round(105 / (105 + 78) * 100)}%</span> player one
        </div>
        <div className="flex-fill"></div>
        <div className="ml1em nowrap green">
          my rating: {myRatingStars(4)}
        </div>
        <div className="ml1em nowrap red">
          avg rating: {ratingStars(3.5)} <span className="scenario-row-rating-number red">{3.5}</span>
        </div>
        <div className="ml025em nowrap">
          - <span className="scenario-row-rating-number">{151}</span> ratings
        </div>
      </div>
    </div>
  )
}
