import React, { Dispatch, SetStateAction, useState } from "react";
import { UnitData } from "../engine/Unit";
import { DesignStack, pushDesignStack } from "./ScenarioDesigner";
import { FeatureData } from "../engine/Feature";

interface DesignerDeployProps {
  designStack: DesignStack;
  setDesignStack: Dispatch<SetStateAction<DesignStack>>;
  turn: number;
  player: number;
  available: [string, string, UnitData | FeatureData][];
}

export default function DesignerDeploy({
  designStack, setDesignStack, turn, player, available,
}: DesignerDeployProps) {
  const data = designStack.data[designStack.index]
  const metadata = data.metadata

  const raw = player === 1 ? (metadata.allied_units[turn]?.list ?? []) :
    (metadata.axis_units[turn]?.list ?? [])
  const ids = raw.map(u => u.id)
  const names = raw.map(u => u.n)
  const counts = raw.map(u => u.x ?? 1)
  const availableUnits = available.filter(n => !ids.includes(n[0]) && !n[2].ft )
  const availableFeatures = available.filter(n => !ids.includes(n[0]) && n[2].ft )

  const [currentUnit, setCurrentUnit] = useState<string>(availableUnits[0][0])
  const [currentFeature, setCurrentFeature] = useState<string>(availableFeatures[0][0])

  return (
    <div>
      { ids.map((n, i) => {
        return (
          <div key={`name-${i}`} className="ml1em flex mt05em">
            <div className="design-button" style={{minWidth: "20px", textAlign: "center"}} onClick={() => {
              pushDesignStack(
                player === 1 ? {
                  ...data, metadata: {
                    ...metadata,
                    allied_units: { ...metadata.allied_units, [turn]: {
                      list: metadata.allied_units[turn].list.map((u, j) => {
                        return i === j ? { ...u, x: (u.x ?? 1) + 1 } : u
                      })
                    }}
                  }
                } : {
                  ...data, metadata: {
                    ...metadata,
                    axis_units: { ...metadata.axis_units, [turn]: {
                      list: metadata.axis_units[turn].list.map((u, j) => {
                        return i === j ? { ...u, x: (u.x ?? 1) + 1 } : u
                      })
                    }}
                  }
                }, setDesignStack
              )
            }}>+</div>
            <div style={{minWidth: "32px", textAlign: "center"}}>{ counts[i] }</div>
            <div className="design-button" style={{minWidth: "20px", textAlign: "center"}} onClick={() => {
                   const newData = counts[i] > 0 ?
                     (player === 1 ? {
                        ...data, metadata: {
                          ...metadata,
                          allied_units: { ...metadata.allied_units, [turn]: {
                            list: metadata.allied_units[turn].list.map((u, j) => {
                              return i === j ? { ...u, x: (u.x ?? 1) - 1 } : u
                            })
                          }}
                        }
                      } : {
                        ...data, metadata: {
                          ...metadata,
                          axis_units: { ...metadata.axis_units, [turn]: {
                            list: metadata.axis_units[turn].list.map((u, j) => {
                              return i === j ? { ...u, x: (u.x ?? 1) - 1 } : u
                            })
                          }}
                        }
                      }) :
                     (player === 1 ? {
                        ...data, metadata: {
                          ...metadata,
                          allied_units: { ...metadata.allied_units, [turn]: {
                            list: metadata.allied_units[turn].list.filter((u, j) => { return i !== j })
                          }}
                        }
                      } : {
                        ...data, metadata: {
                          ...metadata,
                          axis_units: { ...metadata.axis_units, [turn]: {
                            list: metadata.axis_units[turn].list.filter((u, j) => { return i !== j })
                          }}
                        }
                      })
                   pushDesignStack(newData, setDesignStack)
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
        <div className="design-button" style={{
               marginTop: "28px", marginBottom: "4px", width: "24px", textAlign: "center",
             }}
             onClick={() => {
               const selection = availableUnits.find(u => u[0] === currentUnit)
               if (!selection) { return }
               setCurrentUnit(availableUnits.filter(u => u[0] !== currentUnit)[0][0])
               selection[2].x = 1
               selection[2].id = selection[0]
               const list = player === 1 ? (metadata.allied_units[turn]?.list ?? []) :
                 (metadata.axis_units[turn]?.list ?? [])
               pushDesignStack(
                 player === 1 ? {
                   ...data, metadata: {
                     ...metadata,
                     allied_units: { ...metadata.allied_units, [turn]: {
                       list: [...list, selection[2]]
                     }}
                   }
                 } : {
                   ...data, metadata: {
                     ...metadata,
                     axis_units: { ...metadata.axis_units, [turn]: {
                       list: [...list, selection[2]]
                     }}
                   }
                 }, setDesignStack
               )}}>
          +
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
        <div className="design-button" style={{
               marginTop: "28px", marginBottom: "4px", width: "24px", textAlign: "center",
             }}
             onClick={() => {
               const selection = availableFeatures.find(u => u[0] === currentFeature)
               if (!selection) { return }
               setCurrentFeature(availableFeatures.filter(u => u[0] !== currentFeature)[0][0])
               selection[2].x = 1
               selection[2].id = selection[0]
               const list = player === 1 ? (metadata.allied_units[turn]?.list ?? []) :
                 (metadata.axis_units[turn]?.list ?? [])
               pushDesignStack(
                 player === 1 ? {
                   ...data, metadata: {
                     ...metadata,
                     allied_units: { ...metadata.allied_units, [turn]: {
                       list: [...list, selection[2]]
                     }}
                   }
                 } : {
                   ...data, metadata: {
                     ...metadata,
                     axis_units: { ...metadata.axis_units, [turn]: {
                       list: [...list, selection[2]]
                     }}
                   }
                 }, setDesignStack
               )}}>
          +
        </div>
      </div>
    </div>
  )
}
