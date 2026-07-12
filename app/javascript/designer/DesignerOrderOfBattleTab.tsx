import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { ScenarioData } from "../engine/Scenario";
import DesignerDeploy from "./DesignerDeploy";
import { UnitData } from "../engine/Unit";
import { toggleHex } from "../engine/control/deploy";

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

  const [left, setLeft] = useState<number>(1)
  const [right, setRight] = useState<number>(1)
  const [top, setTop] = useState<number>(1)
  const [bottom, setBottom] = useState<number>(1)

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
        <div className="flex mb1em">
          <div style={{width: "50px"}} className="mr05em">
            <label className="design-label">left</label>
            <select name="allies" value={left} className="form-input"
                    onChange={({ target }) => { setLeft(Number(target.value)) }} >
              { Array(scenarioData.metadata.map_data.layout[0]-1).fill(1).map((n, i) => {
                return (
                  <option key={`l${i}`} value={i+n}>{i+n}</option>
                )
              }) }
            </select>
          </div>
          <div className="design-button mr1em" style={{marginTop: "28px", marginBottom: "4px"}} onClick={() => {
            setScenarioData(s => {
              const player = Number(deploySelected[deploySelected.length - 1])
              const turn = Number(deploySelected.substring(1, deploySelected.length - 2))
              const mapData = scenarioData.metadata.map_data
              const hexes = player === 1 ? mapData.allied_setup : mapData.allied_setup
              if (!hexes || !hexes[turn]) { return s }
              const newHexes = toggleHex(
                [...hexes[turn], [`0-${left-1}`, "*"]], -1, -1,
                mapData.layout[0] - 1, mapData.layout[1] - 1
              )
              return player === 1 ?
                {
                  ...s,
                  metadata: {
                    ...s.metadata,
                    map_data: {
                      ...s.metadata.map_data,
                      allied_setup: { ...s.metadata.map_data.allied_setup, [turn]: newHexes },
                    },
                  },
                } :
                {
                  ...s,
                  metadata: {
                    ...s.metadata,
                    map_data: {
                      ...s.metadata.map_data,
                      allied_setup: { ...s.metadata.map_data.allied_setup, [turn]: newHexes },
                    },
                  },
                }
            })
          }}>add</div>
          <div style={{width: "50px"}} className="mr05em">
            <label className="design-label">right</label>
            <select name="allies" value={right} className="form-input"
                    onChange={({ target }) => { setRight(Number(target.value)) }} >
              { Array(scenarioData.metadata.map_data.layout[0]-1).fill(1).map((n, i) => {
                return (
                  <option key={`l${i}`} value={i+n}>{i+n}</option>
                )
              }) }
            </select>
          </div>
          <div className="design-button mr1em" style={{marginTop: "28px", marginBottom: "4px"}} onClick={() => {
            setScenarioData(s => {
              const player = Number(deploySelected[deploySelected.length - 1])
              const turn = Number(deploySelected.substring(1, deploySelected.length - 2))
              const mapData = scenarioData.metadata.map_data
              const hexes = player === 1 ? mapData.allied_setup : mapData.allied_setup
              if (!hexes || !hexes[turn]) { return s }
              const xMax = mapData.layout[0] - 1
              const newHexes = toggleHex(
                [...hexes[turn], [`${xMax - right + 1}-${xMax}`, "*"]], -1, -1,
                xMax, mapData.layout[1] - 1
              )
              return player === 1 ?
                {
                  ...s,
                  metadata: {
                    ...s.metadata,
                    map_data: {
                      ...s.metadata.map_data,
                      allied_setup: { ...s.metadata.map_data.allied_setup, [turn]: newHexes },
                    },
                  },
                } :
                {
                  ...s,
                  metadata: {
                    ...s.metadata,
                    map_data: {
                      ...s.metadata.map_data,
                      allied_setup: { ...s.metadata.map_data.allied_setup, [turn]: newHexes },
                    },
                  },
                }
            })
          }}>add</div>
          <div style={{width: "50px"}} className="mr05em">
            <label className="design-label">top</label>
            <select name="allies" value={top} className="form-input"
                    onChange={({ target }) => { setTop(Number(target.value)) }} >
              { Array(scenarioData.metadata.map_data.layout[1]-1).fill(1).map((n, i) => {
                return (
                  <option key={`l${i}`} value={i+n}>{i+n}</option>
                )
              }) }
            </select>
          </div>
          <div className="design-button mr1em" style={{marginTop: "28px", marginBottom: "4px"}} onClick={() => {
            setScenarioData(s => {
              const player = Number(deploySelected[deploySelected.length - 1])
              const turn = Number(deploySelected.substring(1, deploySelected.length - 2))
              const mapData = scenarioData.metadata.map_data
              const hexes = player === 1 ? mapData.allied_setup : mapData.allied_setup
              if (!hexes || !hexes[turn]) { return s }
              const newHexes = toggleHex(
                [...hexes[turn], ["*", `0-${top-1}`]], -1, -1,
                mapData.layout[0] - 1, mapData.layout[1] - 1
              )
              return player === 1 ?
                {
                  ...s,
                  metadata: {
                    ...s.metadata,
                    map_data: {
                      ...s.metadata.map_data,
                      allied_setup: { ...s.metadata.map_data.allied_setup, [turn]: newHexes },
                    },
                  },
                } :
                {
                  ...s,
                  metadata: {
                    ...s.metadata,
                    map_data: {
                      ...s.metadata.map_data,
                      allied_setup: { ...s.metadata.map_data.allied_setup, [turn]: newHexes },
                    },
                  },
                }
            })
          }}>add</div>
          <div style={{width: "50px"}} className="mr05em">
            <label className="design-label">bottom</label>
            <select name="allies" value={bottom} className="form-input"
                    onChange={({ target }) => { setBottom(Number(target.value)) }} >
              { Array(scenarioData.metadata.map_data.layout[1]-1).fill(1).map((n, i) => {
                return (
                  <option key={`l${i}`} value={i+n}>{i+n}</option>
                )
              }) }
            </select>
          </div>
          <div className="design-button mr1em" style={{marginTop: "28px", marginBottom: "4px"}} onClick={() => {
            setScenarioData(s => {
              const player = Number(deploySelected[deploySelected.length - 1])
              const turn = Number(deploySelected.substring(1, deploySelected.length - 2))
              const mapData = scenarioData.metadata.map_data
              const hexes = player === 1 ? mapData.allied_setup : mapData.allied_setup
              if (!hexes || !hexes[turn]) { return s }
              const yMax = mapData.layout[1] - 1
              const newHexes = toggleHex(
                [...hexes[turn], ["*", `${yMax - bottom + 1}-${yMax}`]], -1, -1,
                mapData.layout[0] - 1, yMax
              )
              return player === 1 ?
                {
                  ...s,
                  metadata: {
                    ...s.metadata,
                    map_data: {
                      ...s.metadata.map_data,
                      allied_setup: { ...s.metadata.map_data.allied_setup, [turn]: newHexes },
                    },
                  },
                } :
                {
                  ...s,
                  metadata: {
                    ...s.metadata,
                    map_data: {
                      ...s.metadata.map_data,
                      allied_setup: { ...s.metadata.map_data.allied_setup, [turn]: newHexes },
                    },
                  },
                }
            })
          }}>add</div>
        </div>
        {deploys}
      </form>
    </div>
  )
}
