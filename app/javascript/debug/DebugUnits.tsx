import React, { useEffect, useState } from "react";
import { getAPI } from "../utilities/network";
import CounterDisplay from "../components/game/CounterDisplay";
import Unit, { UnitData } from "../engine/Unit";
import { unitStatus } from "../utilities/commonTypes";
import { useParams } from "react-router-dom";
import { FeatureData } from "../engine/Feature";
import { MarkerData } from "../engine/Marker";

interface DebugUnitsProps {
  suppressMarkers?: boolean;
}

export default function DebugUnits({ suppressMarkers }: DebugUnitsProps) {
  const nation: string | undefined = useParams().nation
  const [units, setUnits] = useState<{ [index: string]: UnitData }>({})

  useEffect(() => {
    getAPI("/api/v1/scenarios/all_units", {
      ok: respons => respons.json().then(json => { setUnits(json) })
    })
  }, [])

  const guns = () => {
    return Object.values(units).filter(u => ["sw", "gun"].includes(u.t) && u.o.j && u.c === nation)
  }

  const infantry = () => {
    return Object.values(units).filter(u => ["ldr", "sqd", "tm"].includes(u.t) && u.c === nation)
  }

  const vehicles = () => {
    return Object.values(units).filter(u => ["tank", "spg", "ac", "ht"].includes(u.t) && u.c === nation)
  }

  const tanks = () => {
    return vehicles().filter(v => v.o.ta)
  }

  const spg = () => {
    return vehicles().filter(v => !v.o.ta)
  }

  const svgContainer = (unit: Unit | undefined, key: number) => {
    if (!unit) { return <></> }
    const fullKey = `${unit.name}-${key}`
    return <CounterDisplay key={fullKey} unit={unit} />
  }

  const usedGuns = () => {
    return guns().map((data, i) => {
      const unit = new Unit(data)
      unit.jammed = true
      const versions = [svgContainer(unit, i+10000)]
      return versions
    })
  }

  const usedInfantry = () => {
    return infantry().map((data, i) => {
      const key = i + 20000
      const unit = new Unit(data)
      unit.status = unitStatus.Activated
      const versions = [svgContainer(unit, key*5)]

      const unit2 = new Unit(data)
      unit2.status = unitStatus.Exhausted
      versions.push(svgContainer(unit2, key*5+1))

      const unit3 = new Unit(data)
      unit3.status = unitStatus.Tired
      versions.push(svgContainer(unit3, key*5+2))

      const unit4 = new Unit(data)
      unit4.pinned = true
      versions.push(svgContainer(unit4, key*5+3))

      const unit5 = new Unit(data)
      unit5.status = unitStatus.Broken
      versions.push(svgContainer(unit5, key*5+4))
      return versions
    })
  }

  const usedTanks = () => {
    return tanks().map((data, i) => {
      const key = i + 30000
      const unit = new Unit(data)
      unit.eliteCrew = -1
      const versions = [svgContainer(unit, key*13)]

      const unit2 = new Unit(data)
      unit2.eliteCrew = 1
      versions.push(svgContainer(unit2, key*13+1))

      const unit3 = new Unit(data)
      unit3.status = unitStatus.Activated
      versions.push(svgContainer(unit3, key*13+2))

      const unit4 = new Unit(data)
      unit4.status = unitStatus.Exhausted
      versions.push(svgContainer(unit4, key*13+3))

      const unit5 = new Unit(data)
      unit5.jammed = true
      versions.push(svgContainer(unit5, key*13+4))

      const unit6 = new Unit(data)
      unit6.immobilized = true
      versions.push(svgContainer(unit6, key*13+5))

      const unit7 = new Unit(data)
      unit7.turretJammed = true
      versions.push(svgContainer(unit7, key*13+6))

      const unit8 = new Unit(data)
      unit8.status = unitStatus.Activated
      unit8.immobilized = true
      versions.push(svgContainer(unit8, key*13+7))

      const unit9 = new Unit(data)
      unit9.status = unitStatus.Exhausted
      unit9.immobilized = true
      unit9.turretJammed = true
      versions.push(svgContainer(unit9, key*13+8))

      const unit10 = new Unit(data)
      unit10.status = unitStatus.Exhausted
      unit10.jammed = true
      unit10.immobilized = true
      unit10.turretJammed = true
      versions.push(svgContainer(unit10, key*13+9))

      const unit11 = new Unit(data)
      unit11.status = unitStatus.Exhausted
      unit11.jammed = true
      unit11.immobilized = true
      unit11.turretJammed = true
      unit11.eliteCrew = -1
      versions.push(svgContainer(unit11, key*13+10))

      const unit12 = new Unit(data)
      unit12.status = unitStatus.Exhausted
      unit12.jammed = true
      unit12.immobilized = true
      unit12.turretJammed = true
      unit12.eliteCrew = 1
      versions.push(svgContainer(unit12, key*13+11))

      const unit13 = new Unit(data)
      unit13.status = unitStatus.Wreck
      versions.push(svgContainer(unit13, key*13+12))
      return versions
    })
  }

  const usedSPG = () => {
    return spg().map((data, i) => {
      const key = i + 40000
      const unit = new Unit(data)
      unit.status = unitStatus.Activated
      const versions = [svgContainer(unit, key*11)]

      const unit2 = new Unit(data)
      unit2.eliteCrew = -1
      versions.push(svgContainer(unit2, key*11+1))

      const unit3 = new Unit(data)
      unit3.eliteCrew = 1
      versions.push(svgContainer(unit3, key*11+2))

      const unit4 = new Unit(data)
      unit4.status = unitStatus.Exhausted
      versions.push(svgContainer(unit4, key*11+3))

      const unit5 = new Unit(data)
      unit5.weaponDestroyed = true
      versions.push(svgContainer(unit5, key*11+4))

      const unit6 = new Unit(data)
      unit6.immobilized = true
      versions.push(svgContainer(unit6, key*11+5))

      const unit7 = new Unit(data)
      unit7.status = unitStatus.Activated
      unit7.immobilized = true
      versions.push(svgContainer(unit7, key*11+6))

      const unit8 = new Unit(data)
      unit8.status = unitStatus.Exhausted
      unit8.weaponDestroyed = true
      unit8.immobilized = true
      versions.push(svgContainer(unit8, key*11+7))

      const unit9 = new Unit(data)
      unit9.status = unitStatus.Exhausted
      unit9.weaponDestroyed = true
      unit9.immobilized = true
      unit9.eliteCrew = -1
      versions.push(svgContainer(unit9, key*11+8))

      const unit10 = new Unit(data)
      unit10.status = unitStatus.Exhausted
      unit10.weaponDestroyed = true
      unit10.immobilized = true
      unit10.eliteCrew = 1
      versions.push(svgContainer(unit10, key*11+9))

      const unit11 = new Unit(data)
      unit11.status = unitStatus.Wreck
      versions.push(svgContainer(unit11, key*11+10))
      return versions
    })
  }

  const makeUnit = (data: UnitData | FeatureData | MarkerData): Unit | undefined => {
    if (data.ft) {
      return undefined
    } else if (data.mk) {
      return undefined
    } else if (nation && data.c !== nation) {
      return undefined
    } else {
      return new Unit(data)
    }
  }

  return (
    <div className="p1em flex flex-wrap">
      { Object.values(units).map((unit, i) => svgContainer(makeUnit(unit), i)) }
      { suppressMarkers ? "" : usedGuns() }
      { suppressMarkers ? "" : usedInfantry() }
      { suppressMarkers ? "" : usedTanks() }
      { suppressMarkers ? "" : usedSPG() }
    </div>
  )
}
