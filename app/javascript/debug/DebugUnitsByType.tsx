import React, { useEffect, useState } from "react";
import { getAPI } from "../utilities/network";
import CounterDisplay from "../components/game/CounterDisplay";
import Unit, { UnitData } from "../engine/Unit";
import { MarkerData } from "../engine/Marker";
import { FeatureData } from "../engine/Feature";
import { useParams } from "react-router-dom";


export default function DebugUnitsByType() {
  const type: string | undefined = useParams().type
  const ability: string | undefined = useParams().ability
  const [units, setUnits] = useState<{ [index: string]: UnitData }>({})

  useEffect(() => {
    getAPI("/api/v1/scenarios/all_units", {
      ok: respons => respons.json().then(json => { setUnits(json) })
    })
  }, [])

  const types = () => {
    const t: { [index: string]: boolean } = {}
    for (const u of Object.values(units)) {
      if (!u.mk && !u.ft) {
        if (!type || u.t === type) {
          t[u.t] = true
        }
      }
    }
    const keys = Object.keys(t)
    return keys.sort((a, b) => a.localeCompare(b))
  }

  const cells = () => {
    const cells: JSX.Element[] = []
    if (ability) {
      cells.push(<div key="match" className="debug-unit-counter-type">YES</div>)
      Object.values(units).filter(u => {
        if (ability === "assault" && u.o?.a === 1) { return true }
        if (ability === "smoke" && u.o?.s === 1) { return true }
        if (ability === "eng" && u.o?.eng !== undefined) { return true }
        if (ability === "tow" && u.o?.tow !== undefined) { return true }
        if (ability === "amp" && u.o?.amp === 1) { return true }
        if (ability === "spon" && u.o?.sg !== undefined) { return true }
        if (ability === "trans" && u.o?.tr !== undefined) { return true }
        return false
      }).map(
        (c, j) => cells.push(svgContainer(makeUnit(c), j))
      )
      cells.push(<div key="no-match" className="debug-unit-counter-type">NO</div>)
      Object.values(units).filter(u => {
        if (ability === "assault" && u.o?.a !== 1 && u.t === "sqd") { return true }
        if (ability === "smoke" && u.o?.s !== 1 &&
          (u.t === "sqd" || u.t === "gun" || u.i === "radio" || u.i === "mortar")
        ) { return true }
        if (ability === "eng" && u.o?.eng === undefined && u.t === "sqd" ) { return true }
        if (ability === "tow" && u.o?.tow === undefined &&
          (u.t === "gun" || u.i === "mortar")
        ) { return true }
        if (ability === "amp" && u.o?.amp === undefined && (u.o?.w || u.o?.k)) { return true }
        if (ability === "spon" && u.o?.sg === undefined && u.t === "tank") { return true }
        if (ability === "trans" && u.o?.tr === undefined &&
          (u.t === "ht" || u.t === "truck" || u.t === "cav" || u.t === "ac")
        ) { return true }
        return false
      }).map(
        (c, j) => cells.push(svgContainer(makeUnit(c), j))
      )
    } else {
      types().forEach(t => {
        cells.push(<div key={t} className="debug-unit-counter-type">{t}</div>)
        Object.values(units).filter(u => u.t === t).map(
          (c, j) => cells.push(svgContainer(makeUnit(c), j))
        )
      })
    }
    return cells
  }

  const svgContainer = (unit: Unit | undefined, key: number) => {
    if (!unit) { return <></> }
    const fullKey = `${unit.name}-${unit.year}-${key}`
    return <CounterDisplay key={fullKey} unit={unit} />
  }

  const makeUnit = (data: UnitData | FeatureData | MarkerData): Unit | undefined => {
    if (data.ft) {
      return undefined
    } else if (data.mk) {
      return undefined
    } else if (type && data.t !== type) {
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
