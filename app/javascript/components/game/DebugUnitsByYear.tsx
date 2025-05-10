import React, { useEffect, useState } from "react";
import { getAPI } from "../../utilities/network";
import CounterDisplay from "./CounterDisplay";
import Unit, { UnitData } from "../../engine/Unit";
import { MarkerData } from "../../engine/Marker";
import { FeatureData } from "../../engine/Feature";


export default function DebugUnitsByYear() {
  const [units, setUnits] = useState<{ [index: string]: UnitData }>({})

  useEffect(() => {
    getAPI("/api/v1/scenarios/all_units", {
      ok: respons => respons.json().then(json => { setUnits(json) })
    })
  }, [])

  const years = () => {
    const y: { [index: number]: boolean } = {}
    for (const u of Object.values(units)) {
      if (!u.mk && !u.ft) {
        y[u.y] = true
      }
    }
    const keys = Object.keys(y).map(n => Number(n))
    return keys.sort((a, b) => a-b)
  }

  const cells = () => {
    const cells: JSX.Element[] = []
    years().forEach(y => {
      if (Number(y) < 10) {
        cells.push(<div key={y} className="debug-unit-counter-year">0{y}</div>)
      } else {
        cells.push(<div key={y} className="debug-unit-counter-year">{y}</div>)
      }
      Object.values(units).filter(u => Number(u.y) === Number(y)).map(
        (c, j) => cells.push(svgContainer(makeUnit(c), j))
      )
    })
    return cells
  }

  const svgContainer = (unit: Unit | undefined, key: number) => {
    if (!unit) { return <></> }
    return <CounterDisplay key={key} unit={unit} />
  }

  const makeUnit = (data: UnitData | FeatureData | MarkerData): Unit | undefined => {
    if (data.ft) {
      return undefined
    } else if (data.mk) {
      return undefined
    } else {
      return new Unit(data)
    }
  }

  return (
    <div className="p1em flex flex-wrap">
      {cells()}
    </div>
  )
}
