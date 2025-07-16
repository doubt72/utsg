import React, { useEffect, useState } from "react";
import { getAPI } from "../utilities/network";
import CounterDisplay from "../components/game/CounterDisplay";
import Unit, { UnitData } from "../engine/Unit";
import { MarkerData } from "../engine/Marker";
import Feature, { FeatureData } from "../engine/Feature";
import Scenario from "../engine/Scenario";
import { useParams } from "react-router-dom";
import { counterKey } from "../utilities/utilities";

// Yes, I could have put all this on the backend, but (1) the backend is largely
// a big dumb JSON blob store WRT to any game logic, and (2) while this is super
// heavy on the network traffic, it's at least straightforward instead of adding
// a whole new API for it.  And I wanted it on the web side, to make "casual
// analysis" easier, not as some sort of text report (being able to see the
// counters adds context).

export default function DebugUnitStats() {
  const nation: string | undefined = useParams().nation
  const [units, setUnits] = useState<{ [index: string]: UnitData }>({})
  const [scenarios, setScenarios] = useState<Scenario[]>([])
  const [countUnits, setCountUnits] = useState<{ [index: string]: number }>({})
  const [countScenarios, setCountScenarios] = useState<{ [index: string]: number }>({})

  useEffect(() => {
    getAPI("/api/v1/scenarios/all_units", {
      ok: respons => respons.json().then(json => { setUnits(json) })
    })
    const url = "/api/v1/scenarios?page=0&page_size=999&status=*"
    getAPI(url, {
      ok: response => {
        response.json().then(json => {
          json.data.map((a: { id: string }) => {
            const url = `/api/v1/scenarios/${a.id}`
            getAPI(url, {
              ok: response => {
                response.json().then(json => {
                  setScenarios(s => [new Scenario(json), ...s])
                })
              }
            })
          })
        })
      }
    })
  }, [])

  useEffect(() => {
    const cu: { [index: string]: number } = {}
    const cs: { [index: string]: number } = {}
    for (const s of scenarios) {
      for (const ri of s.alliedUnitList) {
        console.log(s.code)
        const key = counterKey(ri.counter)
        cu[key] === undefined ? cu[key] = ri.x : cu[key] += ri.x
        cs[key] === undefined ? cs[key] = 1 : cs[key]++
      }
      for (const ri of s.axisUnitList) {
        const key = counterKey(ri.counter)
        cu[key] === undefined ? cu[key] = ri.x : cu[key] += ri.x
        cs[key] === undefined ? cs[key] = 1 : cs[key]++
      }
    }
    setCountUnits(() => cu)
    setCountScenarios(() => cs)
  }, [scenarios])

  const cells = () => {
    return Object.values(units).filter(u => {
      if (nation && nation != u.c) { return false }
      return true
    }).map(u => {
      const counter = makeUnit(u)
      if (!counter) { return <></> }

      const key = counterKey(counter)
      return svgContainer(counter, `${countScenarios[key] ?? "-"} / ${countUnits[key] ?? "-"}`, key)
    })
  }

  const svgContainer = (unit: Unit | Feature, count: string, key: string) => {
    return (
      <div className="debug-unit-counter-stat">
        <CounterDisplay key={key} unit={unit} />{count}
      </div>
    )
  }

  const makeUnit = (data: UnitData | FeatureData | MarkerData): Unit | Feature | undefined => {
    if (data.ft) {
      return new Feature(data)
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
