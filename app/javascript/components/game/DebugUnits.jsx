import React, { useEffect, useState } from "react";
import { getAPI } from "../../utilities/network";
import { Unit, unitStatus } from "../../engine/unit";
import CounterDisplay from "./CounterDisplay";
import { Feature } from "../../engine/feature";


export default function DebugUnits() {
  const [units, setUnits] = useState({})

  useEffect(() => {
    getAPI("/api/v1/scenarios/all_units", {
      ok: respons => respons.json().then(json => { setUnits(json) })
    })
  }, [])

  // const years = () => {
  //   const y = {}
  //   for (const u of Object.values(units)) {
  //     y[u.y] = true
  //   }
  //   return Object.keys(y).sort((a,b) => a-b)
  // }

  // const cells = () => {
  //   const cells = []
  //   years().forEach(y => {
  //     if (Number(y) < 10) {
  //       cells.push(<div key={y} className="unit-counter-year">0{y}</div>)
  //     } else {
  //       cells.push(<div key={y} className="unit-counter-year">{y}</div>)
  //     }
  //     Object.values(units).filter(u => Number(u.y) === Number(y)).map(
  //       (c, j) => cells.push(<div key={`${y}-${j}`}>{unitCounter(new Unit(c))}</div>)
  //     )
  //   })
  //   return cells
  // }

  // return (
  //   <div className="p1em flex flex-wrap">
  //     {cells()}
  //   </div>
  // )

  const guns = () => {
    return Object.values(units).filter(u => ["sw", "gun"].includes(u.t) && u.o.j)
  }

  const infantry = () => {
    return Object.values(units).filter(u => ["ldr", "sqd", "tm"].includes(u.t))
  }

  const vehicles = () => {
    return Object.values(units).filter(u => ["tank", "spg", "ac", "ht"].includes(u.t))
  }

  const tanks = () => {
    return vehicles().filter(v => v.o.ta)
  }

  const spg = () => {
    return vehicles().filter(v => !v.o.ta)
  }

  const svgContainer = (unit, key) => {
    return <CounterDisplay key={key} unit={unit} />
  }

  const usedGuns = () => {
    return guns().map((data, i) => {
      const unit = new Unit(data)
      unit.jammed = true
      const versions = [svgContainer(unit, i)]
      return versions
    })
  }

  const usedInfantry = () => {
    return infantry().map((data, i) => {
      const unit = new Unit(data)
      unit.status = unitStatus.Activated
      const versions = [svgContainer(unit, i*5)]

      const unit2 = new Unit(data)
      unit2.status = unitStatus.Exhausted
      versions.push(svgContainer(unit2, i*5+1))

      const unit3 = new Unit(data)
      unit3.status = unitStatus.Tired
      versions.push(svgContainer(unit3, i*5+2))

      const unit4 = new Unit(data)
      unit4.status = unitStatus.Pinned
      versions.push(svgContainer(unit4, i*5+3))

      const unit5 = new Unit(data)
      unit5.status = unitStatus.Broken
      versions.push(svgContainer(unit5, i*5+4))
      return versions
    })
  }

  const usedTanks = () => {
    return tanks().map((data, i) => {
      const unit = new Unit(data)
      unit.status = unitStatus.Activated
      const versions = [svgContainer(unit, i*9)]

      const unit2 = new Unit(data)
      unit2.status = unitStatus.Exhausted
      versions.push(svgContainer(unit2, i*9+1))

      const unit3 = new Unit(data)
      unit3.jammed = true
      versions.push(svgContainer(unit3, i*9+2))

      const unit4 = new Unit(data)
      unit4.immobilized = true
      versions.push(svgContainer(unit4, i*9+3))

      const unit5 = new Unit(data)
      unit5.turretJammed = true
      versions.push(svgContainer(unit5, i*9+4))

      const unit6 = new Unit(data)
      unit6.status = unitStatus.Activated
      unit6.immobilized = true
      versions.push(svgContainer(unit6, i*9+5))

      const unit7 = new Unit(data)
      unit7.status = unitStatus.Exhausted
      unit7.immobilized = true
      unit7.turretJammed = true
      versions.push(svgContainer(unit7, i*9+6))

      const unit8 = new Unit(data)
      unit8.status = unitStatus.Exhausted
      unit8.jammed = true
      unit8.immobilized = true
      unit8.turretJammed = true
      versions.push(svgContainer(unit8, i*9+7))

      const unit9 = new Unit(data)
      unit9.status = unitStatus.Wreck
      versions.push(svgContainer(unit9, i*9+8))
      return versions
    })
  }

  const usedSPG = () => {
    return spg().map((data, i) => {
      const unit = new Unit(data)
      unit.status = unitStatus.Activated
      const versions = [svgContainer(unit, i*7)]

      const unit2 = new Unit(data)
      unit2.status = unitStatus.Exhausted
      versions.push(svgContainer(unit2, i*7+1))

      const unit3 = new Unit(data)
      unit3.jammed = true
      versions.push(svgContainer(unit3, i*7+2))

      const unit4 = new Unit(data)
      unit4.immobilized = true
      versions.push(svgContainer(unit4, i*7+3))

      const unit5 = new Unit(data)
      unit5.status = unitStatus.Activated
      unit5.immobilized = true
      versions.push(svgContainer(unit5, i*7+4))

      const unit6 = new Unit(data)
      unit6.status = unitStatus.Exhausted
      unit6.jammed = true
      unit6.immobilized = true
      versions.push(svgContainer(unit6, i*7+5))

      const unit7 = new Unit(data)
      unit7.status = unitStatus.Wreck
      versions.push(svgContainer(unit7, i*7+6))
      return versions
    })
  }

  const makeUnit = (data) => {
    if (data.ft) {
      return new Feature(data)
    } else {
      return new Unit(data)
    }
  }

  return (
    <div className="p1em flex flex-wrap">
      { Object.values(units).map((unit, i) => svgContainer(makeUnit(unit), i)) }
      { usedGuns() }
      { usedInfantry() }
      { usedTanks() } { usedSPG() }
    </div>
  )
}
