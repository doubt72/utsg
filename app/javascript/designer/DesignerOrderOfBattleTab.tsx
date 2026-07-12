import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { ScenarioData } from "../engine/Scenario";
import DesignerDeploy from "./DesignerDeploy";
import { UnitData } from "../engine/Unit";

interface DesignerOrderOfBattleTabProps {
  scenarioData: ScenarioData;
  setScenarioData: Dispatch<SetStateAction<ScenarioData>>;
  deploySelected: string;
  setDeploySelected: Dispatch<SetStateAction<string>>;
  availableAlliedUnits: [string, string, UnitData][];
  availableAxisUnits: [string, string, UnitData][];
}

export default function DesignerOrderOfBattleTab({
  scenarioData, setScenarioData, deploySelected, setDeploySelected, availableAlliedUnits, availableAxisUnits
}: DesignerOrderOfBattleTabProps) {
  const [deploys, setDeploys] = useState<JSX.Element[]>([])

  const addSelector = (turn: number, player: number, deps: JSX.Element[]) => {
    const index = `t${turn}-${player}`
    const set = turn === 0 || (player === 1 && scenarioData.metadata.allied_units[turn]) ||
      (player === 2 && scenarioData.metadata.axis_units[turn])
    deps.push(set ?
      <div key={index}>
        <div className={`designer-radio${deploySelected === index ? " designer-selected" : ""}`} >
          <input type="radio" className="mr05em"
                 name="select"
                 value={index}
                 checked={deploySelected === index}
                 onChange={() => setDeploySelected(index)} />
          <label className="mr1em">{ turn > 0 ? `turn ${turn}` : "setup" } &mdash; player {player}</label>
        </div>
        <div className={`designer-details${ deploySelected === index ? " designer-selected" : ""}`} >
          <DesignerDeploy scenarioData={scenarioData} setScenarioData={setScenarioData}
                          turn={turn} player={player}
                          available={player === 1 ? availableAlliedUnits : availableAxisUnits} />
        </div>
      </div> :
      <div key={index}>
        <div className={`designer-radio-all${deploySelected === index ? " designer-selected" : ""}`} >
          <div className="mr1em">
            turn {turn} &mdash; player {player}
          </div>
          <div className="design-button" onClick={() => {
            setScenarioData(s => {
              return player === 1 ?
                { ...s, metadata: {
                  ...s.metadata,
                  allied_units: { ...s.metadata.allied_units, [turn]: { list: [] } } },
                  map_data: {
                    ...s.metadata.map_data,
                    allied_setup: { ...s.metadata.map_data.allied_setup, [turn]: [] },
                  },
                } :
                { ...s, metadata: {
                  ...s.metadata,
                  axis_units: { ...s.metadata.allied_units, [turn]: { list: [] } } },
                  map_data: {
                    ...s.metadata.map_data,
                    axis_setup: { ...s.metadata.map_data.axis_setup, [turn]: [] },
                  },
                }
            })
            setDeploySelected(index)
          }}>activate</div>
        </div>
      </div>
    )
  }

  useEffect(() => {
    const deps: JSX.Element[] = []
    for (let i = 0; i <= scenarioData.metadata.turns; i++) {
      addSelector(i, 1, deps)
      addSelector(i, 2, deps)
    }
    setDeploys(deps)
  }, [scenarioData, deploySelected])

  return (
    <div>
      <form>
        <div>
          Some stuff about selecting hexes from the edge
        </div>
        {deploys}
      </form>
    </div>
  )
}
