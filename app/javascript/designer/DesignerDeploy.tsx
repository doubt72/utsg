import React, { Dispatch, SetStateAction, useState } from "react";
import { ScenarioData } from "../engine/Scenario";
import { UnitData } from "../engine/Unit";

interface DesignerDeployProps {
  scenarioData: ScenarioData;
  setScenarioData: Dispatch<SetStateAction<ScenarioData>>;
  turn: number;
  player: number;
  available: [string, string, UnitData][];
}

export default function DesignerDeploy({
  scenarioData, setScenarioData, turn, player, available,
}: DesignerDeployProps) {
  const raw = player === 1 ? scenarioData.metadata.allied_units[turn].list :
    scenarioData.metadata.axis_units[turn].list
  const ids = raw.map(u => u.id)
  const names = raw.map(u => u.n)
  const counts = raw.map(u => u.x ?? 1)
  const availableUnits = available.filter(n => !ids.includes(n[0]) && !n[2].ft )
  const availableFeatures = available.filter(n => !ids.includes(n[0]) && n[2].ft )

  const [currentUnit, setCurrentUnit] = useState<string>(availableUnits[0][0])
  const [currentFeature, setCurrentFeature] = useState<string>(availableUnits[0][0])

  return (
    <div>
      { ids.map((n, i) => {
        return (
          <div key={`name-${i}`} className="ml1em flex mt05em">
            <div className="design-button" style={{minWidth: "20px", textAlign: "center"}} onClick={() => {
              setScenarioData(s => {
                return player === 1 ? {
                  ...s, metadata: {
                    ...s.metadata,
                    allied_units: { ...s.metadata.allied_units, [turn]: {
                      list: s.metadata.allied_units[turn].list.map((u, j) => {
                        return i === j ? { ...u, x: (u.x ?? 1) + 1 } : u
                      })
                    }}
                  }
                } : {
                  ...s, metadata: {
                    ...s.metadata,
                    axis_units: { ...s.metadata.axis_units, [turn]: {
                      list: s.metadata.axis_units[turn].list.map((u, j) => {
                        return i === j ? { ...u, x: (u.x ?? 1) + 1 } : u
                      })
                    }}
                  }
                }
              })
            }}>+</div>
            <div style={{minWidth: "32px", textAlign: "center"}}>{ counts[i] }</div>
            <div className="design-button" style={{minWidth: "20px", textAlign: "center"}} onClick={() => {
              setScenarioData(s => {
                if (counts[i] > 1) {
                  return player === 1 ? {
                    ...s, metadata: {
                      ...s.metadata,
                      allied_units: { ...s.metadata.allied_units, [turn]: {
                        list: s.metadata.allied_units[turn].list.map((u, j) => {
                          return i === j ? { ...u, x: (u.x ?? 1) - 1 } : u
                        })
                      }}
                    }
                  } : {
                    ...s, metadata: {
                      ...s.metadata,
                      axis_units: { ...s.metadata.axis_units, [turn]: {
                        list: s.metadata.axis_units[turn].list.map((u, j) => {
                          return i === j ? { ...u, x: (u.x ?? 1) - 1 } : u
                        })
                      }}
                    }
                  }
                } else {
                  return player === 1 ? {
                    ...s, metadata: {
                      ...s.metadata,
                      allied_units: { ...s.metadata.allied_units, [turn]: {
                        list: s.metadata.allied_units[turn].list.filter((u, j) => { return i !== j })
                      }}
                    }
                  } : {
                    ...s, metadata: {
                      ...s.metadata,
                      axis_units: { ...s.metadata.axis_units, [turn]: {
                        list: s.metadata.axis_units[turn].list.filter((u, j) => { return i !== j })
                      }}
                    }
                  }
                }
              })
            }}>-</div>
            <div className="flex-fill ml05em">
              { names[i] } <span style={{color: "#777"}}>[{n}]</span>
            </div>
          </div>
        )
      })}
      <div className="flex mt05em">
        <div style={{width: "250px"}} className="mr05em">
          <label className="design-label">unit</label>
          <select name="allies" value={currentUnit} className="form-input"
                  onChange={({ target }) => { setCurrentUnit(target.value) }} >
            { availableUnits.map(n => <option key={n[0]} value={n[0]}>{n[1]} [{n[0]}]</option>) }
          </select>
        </div>
        <div className="design-button" style={{marginTop: "28px", marginBottom: "4px"}} onClick={() => {
          setScenarioData(s => {
            const selection = availableUnits.find(u => u[0] === currentUnit)
            if (!selection) { return s }
            setCurrentUnit(availableUnits.filter(u => u[0] !== currentUnit)[0][0])
            selection[2].x = 1
            selection[2].id = selection[0]
            return player === 1 ? {
              ...s, metadata: {
                ...s.metadata,
                allied_units: { ...s.metadata.allied_units, [turn]: {
                  list: [...s.metadata.allied_units[turn].list, selection[2]]
                }}
              }
            } : {
              ...s, metadata: {
                ...s.metadata,
                axis_units: { ...s.metadata.axis_units, [turn]: {
                  list: [...s.metadata.axis_units[turn].list, selection[2]]
                }}
              }
            }
          })}}>
          add
        </div>
      </div>
      <div className="flex mt05em">
        <div style={{width: "250px"}} className="mr05em">
          <label className="design-label">feature</label>
          <select name="allies" value={currentFeature} className="form-input"
                  onChange={({ target }) => { setCurrentFeature(target.value) }} >
            { availableFeatures.map(n => <option key={n[0]} value={n[0]}>{n[1]} [{n[0]}]</option>) }
          </select>
        </div>
        <div className="design-button" style={{marginTop: "28px", marginBottom: "4px"}} onClick={() => {
          setScenarioData(s => {
            const selection = availableFeatures.find(u => u[0] === currentFeature)
            if (!selection) { return s }
            setCurrentFeature(availableFeatures.filter(u => u[0] !== currentUnit)[0][0])
            selection[2].x = 1
            selection[2].id = selection[0]
            return player === 1 ? {
              ...s, metadata: {
                ...s.metadata,
                allied_units: { ...s.metadata.allied_units, [turn]: {
                  list: [...s.metadata.allied_units[turn].list, selection[2]]
                }}
              }
            } : {
              ...s, metadata: {
                ...s.metadata,
                axis_units: { ...s.metadata.axis_units, [turn]: {
                  list: [...s.metadata.axis_units[turn].list, selection[2]]
                }}
              }
            }
          })}}>
          add
        </div>
      </div>
    </div>
  )
}
