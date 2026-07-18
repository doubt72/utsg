import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import DesignerDeploy from "./DesignerDeploy";
import { UnitData } from "../engine/Unit";
import { toggleHex } from "../engine/control/deploy";
import { DeployHexes } from "../engine/Map";
import { DesignStack, pushDesignStack, showHex } from "./ScenarioDesigner";
import { ExtendedDirection, Player } from "../utilities/commonTypes";
import { FeatureData } from "../engine/Feature";
import { normalDir } from "../utilities/utilities";

interface DesignerOrderOfBattleTabProps {
  designStack: DesignStack;
  setDesignStack: Dispatch<SetStateAction<DesignStack>>;
  deploySelected: string;
  setDeploySelected: Dispatch<SetStateAction<string>>;
  initAlliedSelected: string;
  setInitAlliedSelected: Dispatch<SetStateAction<string>>;
  initAxisSelected: string;
  setInitAxisSelected: Dispatch<SetStateAction<string>>;
  initDir: ExtendedDirection;
  setInitDir: Dispatch<SetStateAction<ExtendedDirection>>;
  availableAlliedUnits: [string, string, UnitData | FeatureData][];
  availableAxisUnits: [string, string, UnitData | FeatureData][];
}

export default function DesignerOrderOfBattleTab({
  designStack, setDesignStack, deploySelected, setDeploySelected,
  initAlliedSelected, setInitAlliedSelected, initAxisSelected, setInitAxisSelected,
  initDir, setInitDir, availableAlliedUnits, availableAxisUnits,
}: DesignerOrderOfBattleTabProps) {
  const data = designStack.data[designStack.index]
  const metadata = data.metadata
  const player = Number(deploySelected[deploySelected.length - 1]) as Player
  const turn = Number(deploySelected.substring(1, deploySelected.length - 2))
  const mapData = metadata.map_data

  const hexes = player === 1 ? mapData.allied_setup : mapData.axis_setup
  let turnHexes: DeployHexes = []
  if (hexes && hexes[turn]) { turnHexes = hexes[turn] }

  const [deploys, setDeploys] = useState<JSX.Element[]>([])

  const [left, setLeft] = useState<number>(1)
  const [right, setRight] = useState<number>(1)
  const [top, setTop] = useState<number>(1)
  const [bottom, setBottom] = useState<number>(1)

  const addHexes = (turn: number, player: Player, hexes: DeployHexes) => {
    pushDesignStack(
      player === 1 ?
        {
          ...data,
          metadata: {
            ...metadata,
            map_data: {
              ...metadata.map_data,
              allied_setup: { ...metadata.map_data.allied_setup, [turn]: hexes },
            },
          },
        } :
        {
          ...data,
          metadata: {
            ...metadata,
            map_data: {
              ...metadata.map_data,
              axis_setup: { ...metadata.map_data.axis_setup, [turn]: hexes },
            },
          },
        }, setDesignStack
    )
  }

  const addSelector = (turn: number, player: number, deps: JSX.Element[]) => {
    const index = `t${turn}-${player}`
    const set = turn === 0 || (player === 1 && metadata.allied_units[turn]) ||
      (player === 2 && metadata.axis_units[turn])
    deps.push(set ?
      <div key={index}>
        <div className={`designer-radio${deploySelected === index ? " designer-selected" : ""}`} >
          <input type="radio" className="mr05em"
                 name="select"
                 value={index}
                 checked={deploySelected === index}
                 onChange={() => setDeploySelected(index)} />
          <label className="mr1em">{ turn > 0 ? `turn ${turn}` : "setup" } &mdash; player {player}</label>
          { turn === 0 ? "" :
            <div className="design-button" onClick={() => {
                   const newUnits = player === 1 ? { ...metadata.allied_units } :
                     { ...metadata.axis_units}
                   const newSetup = player === 1 ? { ...metadata.map_data.allied_setup} :
                     { ...metadata.map_data.axis_setup }
                   delete newUnits[turn]
                   delete newSetup[turn]
                   pushDesignStack(
                     player === 1 ?
                       { ...data, metadata: {
                           ...metadata, allied_units: newUnits,
                           map_data: { ...metadata.map_data, allied_setup: newSetup },
                       }} :
                       { ...data, metadata: {
                           ...metadata, axis_units: newUnits,
                           map_data: { ...metadata.map_data, axis_setup: newSetup },
                       }}, setDesignStack
                    )
                  setDeploySelected("0-1")
                }}>remove</div> }
        </div>
        <div className={`designer-details${ deploySelected === index ? " designer-selected" : ""}`} >
          <DesignerDeploy designStack={designStack} setDesignStack={setDesignStack}
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
                 pushDesignStack(
                   player === 1 ?
                     { ...data, metadata: {
                       ...metadata,
                       allied_units: { ...metadata.allied_units, [turn]: { list: [] } },
                       map_data: {
                         ...metadata.map_data,
                         allied_setup: { ...metadata.map_data.allied_setup, [turn]: [] },
                       },
                     }} :
                     { ...data, metadata: {
                       ...metadata,
                       axis_units: { ...metadata.axis_units, [turn]: { list: [] } },
                       map_data: {
                         ...metadata.map_data,
                         axis_setup: { ...metadata.map_data.axis_setup, [turn]: [] },
                       },
                     }}, setDesignStack
                 )
                 setDeploySelected(index)
               }}>activate</div>
        </div>
      </div>
    )
  }

  useEffect(() => {
    const deps: JSX.Element[] = []
    for (let i = 1; i <= 2; i++) {
      const index = `i-${i}`
      deps.push(
        <div key={index} className="mb1em">
          <div className={`designer-radio${deploySelected === index ? " designer-selected" : ""}`} >
            <input type="radio" className="mr05em"
                  name="select"
                  value={index}
                  checked={deploySelected === index}
                  onChange={() => setDeploySelected(index)} />
            <label className="mr1em">init &mdash; player {player}</label>
          </div>
          <div className={`flex pt05em${deploySelected === index ? " designer-selected" : ""}`}>
            <div style={{width: "250px"}} className="mr05em">
              <label className="design-label">unit</label>
              <select name={`init-player${i}`} value={i === 1 ? initAlliedSelected : initAxisSelected} className="form-input"
                      onChange={({ target }) => {
                        if (i === 1) {
                          setInitAlliedSelected(target.value)
                        } else {
                          setInitAxisSelected(target.value)
                        }
                      }} >
                <option key={"---"} value={""}>---</option>
                { (i === 1 ? availableAlliedUnits : availableAxisUnits).map(n =>
                    <option key={n[0]} value={n[0]}>{n[1]} [{n[0]}]</option>) }
              </select>
            </div>
            <div className="design-button" style={{ marginTop: "28px", marginBottom: "4px" }} onClick={() => {
                   const newMtadata = { ...metadata }
                   if (i === 1) {
                     delete newMtadata["init_allied_units"]
                   } else {
                     delete newMtadata["init_axis_units"]
                   }
                   pushDesignStack({ ...data, metadata: newMtadata}, setDesignStack)
                 }}>clear</div>
            <div className="ml05em" style={{ marginTop: "26px" }}>
              { showHex(initDir, () => { setInitDir(normalDir(initDir + 1)) }) }
            </div>
          </div>
        </div>
      )
    }
    for (let i = 0; i <= metadata.turns; i++) {
      addSelector(i, 1, deps)
      addSelector(i, 2, deps)
    }
    setDeploys(deps)
  }, [
    designStack.index, designStack.data[0], deploySelected, initAlliedSelected, initAxisSelected, initDir
  ])

  return (
    <div>
      <form>
        <div className="flex mb1em">
          <div style={{width: "60px"}} className="mr05em">
            <label className="design-label">left</label>
            <select name="allies" value={left} className="form-input"
                    onChange={({ target }) => { setLeft(Number(target.value)) }} >
              { Array(metadata.map_data.layout[0]-1).fill(1).map((n, i) => {
                return (
                  <option key={`l${i}`} value={i+n}>{i+n}</option>
                )
              }) }
            </select>
          </div>
          <div className="design-button mr1em" style={{
                 marginTop: "28px", marginBottom: "4px", width: "24px", textAlign: "center",
               }}
               onClick={() => {
                 const newHexes = toggleHex(
                   [...turnHexes, [`0-${left-1}`, "*"]], -1, -1,
                   mapData.layout[0] - 1, mapData.layout[1] - 1
                 )
                 addHexes(turn, player, newHexes)
               }}>+</div>
          <div style={{width: "60px"}} className="mr05em">
            <label className="design-label">right</label>
            <select name="allies" value={right} className="form-input"
                    onChange={({ target }) => { setRight(Number(target.value)) }} >
              { Array(metadata.map_data.layout[0]-1).fill(1).map((n, i) => {
                return (
                  <option key={`l${i}`} value={i+n}>{i+n}</option>
                )
              }) }
            </select>
          </div>
          <div className="design-button mr1em" style={{
                 marginTop: "28px", marginBottom: "4px", width: "24px", textAlign: "center",
               }}
               onClick={() => {
                 const xMax = mapData.layout[0] - 1
                 const newHexes = toggleHex(
                    [...turnHexes, [`${xMax - right + 1}-${xMax}`, "*"]], -1, -1,
                    xMax, mapData.layout[1] - 1
                 )
                 addHexes(turn, player, newHexes)
               }}>+</div>
          <div style={{width: "60px"}} className="mr05em">
            <label className="design-label">top</label>
            <select name="allies" value={top} className="form-input"
                    onChange={({ target }) => { setTop(Number(target.value)) }} >
              { Array(metadata.map_data.layout[1]-1).fill(1).map((n, i) => {
                return (
                  <option key={`l${i}`} value={i+n}>{i+n}</option>
                )
              }) }
            </select>
          </div>
          <div className="design-button mr1em" style={{
                 marginTop: "28px", marginBottom: "4px", width: "24px", textAlign: "center",
               }}
               onClick={() => {
                 const newHexes = toggleHex(
                   [...turnHexes, ["*", `0-${top-1}`]], -1, -1,
                   mapData.layout[0] - 1, mapData.layout[1] - 1
                 )
                 addHexes(turn, player, newHexes)
               }}>+</div>
          <div style={{width: "60px"}} className="mr05em">
            <label className="design-label">bottom</label>
            <select name="allies" value={bottom} className="form-input"
                    onChange={({ target }) => { setBottom(Number(target.value)) }} >
              { Array(metadata.map_data.layout[1]-1).fill(1).map((n, i) => {
                return (
                  <option key={`l${i}`} value={i+n}>{i+n}</option>
                )
              }) }
            </select>
          </div>
          <div className="design-button mr1em" style={{
                 marginTop: "28px", marginBottom: "4px", width: "24px", textAlign: "center",
               }}
               onClick={() => {
                 const yMax = mapData.layout[1] - 1
                 const newHexes = toggleHex(
                   [...turnHexes, ["*", `${yMax - bottom + 1}-${yMax}`]], -1, -1,
                   mapData.layout[0] - 1, yMax
                 )
                 addHexes(turn, player, newHexes)
               }}>+</div>
        </div>
        {deploys}
      </form>
    </div>
  )
}
