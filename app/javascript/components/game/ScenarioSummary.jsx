import React from "react";
import PropTypes from "prop-types"
import { alliedCodeToPill, axisCodeToPill } from "../utilities/pills";
import { Unit } from "../../engine/unit";
import { Scenario } from "../../engine/scenario";
import GameMap from "./GameMap";
import CounterDisplay from "./CounterDisplay";

export default function ScenarioSummary(props) {
  const scenario = new Scenario(props.data)
  const map = scenario.map

  const player1Pills = (
    <span>
      { scenario.alliedFactions.map(f => alliedCodeToPill(f)) }
    </span>
  )

  const player2Pills = (
    <span>
      { scenario.axisFactions.map(f => axisCodeToPill(f)) }
    </span>
  )

  return (
    <div className="scenario-description">
      <div className="scenario-description-row background-gray">
        <div className="red mr05em monospace">{scenario.code}:</div>
        <div className="green flex-fill">{scenario.name}</div>
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
        <div className="p1em mr1em background-gray flex-fill">
          {scenario.description.map((p, i) => {
            return <p key={i}>{p}</p>
          })}
        </div>
        <div>
          <GameMap map={map} scale={0.25} />
        </div>
      </div>
      <div className="flex mt1em">
        <div>
          <div className="flex nowrap">
            {scenario.alliedUnitList.map((unit, i) => {
              if (unit.x !== undefined) {
                return (
                  <div key={i} className="flex nowrap">
                    <div className="unit-list-multiplier">{`${unit.x}x`}</div>
                    <CounterDisplay unit={new Unit(unit)} />
                  </div>
                )
              } else {
                return <CounterDisplay key={i} unit={new Unit(unit)} />
              }
            })}
          </div>
          <div className="flex nowrap">
            {scenario.axisUnitList.map((unit, i) => {
              if (unit.x !== undefined) {
                return (
                  <div key={i} className="flex nowrap">
                    <div className="unit-list-multiplier">{`${unit.x}x`}</div>
                    <CounterDisplay unit={new Unit(unit)} />
                  </div>
                )
              } else {
                return <CounterDisplay key={i} unit={new Unit(unit)} />
              }
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

ScenarioSummary.propTypes = {
  data: PropTypes.object.isRequired,
}
