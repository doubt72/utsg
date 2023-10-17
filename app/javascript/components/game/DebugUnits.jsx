import React, { useEffect, useState } from "react";
import { getAPI } from "../../utilities/network";
import { unitCounter } from "../utilities/units";
import { Unit } from "../../engine/unit";
// import { Unit, unitStatus } from "../../engine/unit";


export default function DebugUnits() {
  const [units, setUnits] = useState({})

  useEffect(() => {
    getAPI("/api/v1/scenarios/all_units", {
      ok: respons => respons.json().then(json => { setUnits(json) })
    })
  }, [])

  const years = () => {
    const y = {}
    for (const u of Object.values(units)) {
      y[u.y] = true
    }
    return Object.keys(y).sort((a,b) => a-b)
  }

  const cells = () => {
    const cells = []
    years().forEach(y => {
      if (Number(y) < 10) {
        cells.push(<div key={y} className="unit-counter-year">0{y}</div>)
      } else {
        cells.push(<div key={y} className="unit-counter-year">{y}</div>)
      }
      Object.values(units).filter(u => Number(u.y) === Number(y)).map(
        (c, j) => cells.push(<div key={`${y}-${j}`}>{unitCounter(new Unit(c))}</div>)
      )
    })
    return cells
  }

  return (
    <div className="p1em flex flex-wrap">
      {cells()}
    </div>
  )

  // const infantry = () => {
  //   return Object.values(units).filter(u => ["ldr", "sqd", "tm"].includes(u.t))
  // }

  // const vehicles = () => {
  //   return Object.values(units).filter(u => ["tank", "spg", "ac", "ht"].includes(u.t))
  // }

  // const tanks = () => {
  //   return vehicles().filter(v => v.o.ta)
  // }

  // const spg = () => {
  //   return vehicles().filter(v => !v.o.ta)
  // }

  // const usedInfantry = () => {
  //   return infantry().map((data, i) => {
  //     const unit = new Unit(data)
  //     unit.status = unitStatus.Tired
  //     const versions = [<div key={i*3}>{unitCounter(unit)}</div>]
  //     unit.status = unitStatus.Pinned
  //     versions.push(<div key={i*3+1}>{unitCounter(unit)}</div>)
  //     unit.status = unitStatus.Broken
  //     versions.push(<div key={i*3+2}>{unitCounter(unit)}</div>)
  //     return versions
  //   })
  // }

  // const usedTanks = () => {
  //   return tanks().map((data, i) => {
  //     const unit = new Unit(data)
  //     unit.status = unitStatus.Immobilized
  //     const versions = [<div key={i*3}>{unitCounter(unit)}</div>]
  //     unit.status = unitStatus.TurretJammed
  //     versions.push(<div key={i*3+1}>{unitCounter(unit)}</div>)
  //     unit.status = unitStatus.Wreck
  //     versions.push(<div key={i*3+2}>{unitCounter(unit)}</div>)
  //     return versions
  //   })
  // }

  // const usedSPG = () => {
  //   return spg().map((data, i) => {
  //     const unit = new Unit(data)
  //     unit.status = unitStatus.Immobilized
  //     const versions = [<div key={i*3}>{unitCounter(unit)}</div>]
  //     unit.status = unitStatus.Wreck
  //     versions.push(<div key={i*3+2}>{unitCounter(unit)}</div>)
  //     return versions
  //   })
  // }

  // return (
  //   <div className="p1em flex flex-wrap">
  //     { Object.values(units).map((unit, i) => <div key={i}>{unitCounter(new Unit(unit))}</div>) }
  //     { usedTanks() } { usedSPG() }
  //     { usedInfantry() }
  //   </div>
  // )
}
