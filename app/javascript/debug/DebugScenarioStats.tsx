import React, { useEffect, useState } from "react";
import { getAPI } from "../utilities/network";
import Scenario from "../engine/Scenario";
import { useParams } from "react-router-dom";
import { alliedCodeToName, axisCodeToName } from "../utilities/utilities";
import { hexBuildingNames } from "../utilities/hexBuilding";

// Yes, I could have put all this on the backend, but (1) the backend is largely
// a big dumb JSON blob store WRT to any game logic, and (2) while this is super
// heavy on the network traffic, it's at least straightforward instead of adding
// a whole new API for it.  And I wanted it on the web side, to make "casual
// analysis" easier, not as some sort of text report (plus it uses the same
// code/text conversions as the engine uses for help/etc).

type Lookup = { [index: string]: number }

export default function DebugScenarioStats() {
  const nation: string | undefined = useParams().nation
  const [scenarios, setScenarios] = useState<Scenario[]>([])

  const [countStatus, setCountStatus] = useState<Lookup>({})
  const [countAllies, setCountAllies] = useState<Lookup>({})
  const [countAxis, setCountAxis] = useState<Lookup>({})
  const [countYears, setCountYears] = useState<Lookup>({})
  const [countMonths, setCountMonths] = useState<Lookup>({})
  const [countTurns, setCountTurns] = useState<Lookup>({})
  const [countLayout, setCountLayout] = useState<Lookup>({})
  const [countVictoryCount, setCountVictoryCount] = useState<Lookup>({})
  const [countAlliedUnitCount, setCountAlliedUnitCount] = useState<Lookup>({})
  const [countAxisUnitCount, setCountAxisUnitCount] = useState<Lookup>({})
  const [countSpecialRules, setCountSpecialRules] = useState<Lookup>({})
  const [countBaseTerrain, setCountBaseTerrain] = useState<Lookup>({})
  const [countNight, setCountNight] = useState<Lookup>({})

  const [countStartWeather, setCountStartWeather] = useState<Lookup>({})
  const [countBaseWeather, setCountBaseWeather] = useState<Lookup>({})
  const [countPrecip, setCountPrecip] = useState<Lookup>({})
  const [countPrecipPercent, setCountPrecipPercent] = useState<Lookup>({})
  const [countWindType, setCountWindType] = useState<Lookup>({})
  const [countWindDirection, setCountWindDirection] = useState<Lookup>({})
  const [countWindVariable, setCountWindVariable] = useState<Lookup>({})

  const [countTerrain, setCountTerrain] = useState<Lookup>({})
  const [countTerrainPresent, setCountTerrainPresent] = useState<Lookup>({})
  const [countElevation, setCountElevation] = useState<Lookup>({})
  const [countElevationPresent, setCountElevationPresent] = useState<Lookup>({})
  const [countRoad, setCountRoad] = useState<Lookup>({})
  const [countRoadPresent, setCountRoadPresent] = useState<Lookup>({})
  const [countRailroad, setCountRailroad] = useState<Lookup>({})
  const [countRailroadPresent, setCountRailroadPresent] = useState<Lookup>({})
  const [countBuilding, setCountBuilding] = useState<Lookup>({})
  const [countBuildingPresent, setCountBuildingPresent] = useState<Lookup>({})
  const [countBorder, setCountBorder] = useState<Lookup>({})
  const [countBorderPresent, setCountBorderPresent] = useState<Lookup>({})
  const [countStream, setCountStream] = useState<Lookup>({})
  const [countStreamPresent, setCountStreamPresent] = useState<Lookup>({})

  useEffect(() => {
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

  const incrementAllOne = (arrays: Lookup[]) => {
    for (const a of arrays) {
      a["all"]++
    }
  }

  const addOne = (array: Lookup, key: string) => {
    array[key] !== undefined ? array[key]++ : array[key] = 1
  }

  const addMany = (array: Lookup, key: string, count: number) => {
    array[key] !== undefined ? array[key] += count : array[key] = count
  }

  useEffect(() => {
    const cst: Lookup = { all: 0 }
    const cal: Lookup = { all: 0 }
    const cax: Lookup = { all: 0 }
    const cy: Lookup = { all: 0 }
    const cm: Lookup = { all: 0 }
    const ctn: Lookup = { all: 0 }
    const cl: Lookup = { all: 0 }
    const cv: Lookup = { all: 0 }
    const calu: Lookup = { all: 0 }
    const caxu: Lookup = { all: 0 }
    const csr: Lookup = { all: 0 }
    const cbt: Lookup = { all: 0 }
    const cn: Lookup = { all: 0 }
    const csw: Lookup = { all: 0 }
    const cbw: Lookup = { all: 0 }
    const cp: Lookup = { all: 0 }
    const cpp: Lookup = { all: 0 }
    const cwt: Lookup = { all: 0 }
    const cwd: Lookup = { all: 0 }
    const cwv: Lookup = { all: 0 }

    const ct: Lookup = { all: 0 }
    const ctp: Lookup = { all: 0 }
    const ce: Lookup = { all: 0 }
    const cep: Lookup = { all: 0 }
    const cr: Lookup = { all: 0 }
    const crp: Lookup = { all: 0 }
    const crr: Lookup = { all: 0 }
    const crrp: Lookup = { all: 0 }
    const cb: Lookup = { all: 0 }
    const cbp: Lookup = { all: 0 }
    const cbd: Lookup = { all: 0 }
    const cbdp: Lookup = { all: 0 }
    const cs: Lookup = { all: 0 }
    const csp: Lookup = { all: 0 }
    for (const s of scenarios) {
      if (nation && !s.axisFactions.includes(nation) && !s.alliedFactions.includes(nation)) { continue }
      incrementAllOne([
        cst, cal, cax, cy, cm, ctn, cl, cv, calu, caxu, csr, cbt, cn, csw, cbw, cp, cpp, cwt, cwd, cwv,
        ctp, cep, crp, crrp, cbp, cbdp, csp
      ])
      addOne(cst, s.status)
      for (const a of s.alliedFactions) {
        addOne(cal, a)
      }
      for (const a of s.axisFactions) {
        addOne(cax, a)
      }
      addOne(cy, String(s.date[0]))
      addOne(cm, `${s.date[0]}/${s.date[1] > 9 ? s.date[1] : `0${s.date[1]}`}`)
      addOne(ctn, String(s.turns))
      addOne(cl, `${s.map.width}x${s.map.height}`)
      addOne(cv, String(s.map.victoryHexes.length))
      addOne(calu, String(s.alliedUnitList.reduce((sum, u) => sum + u.x, 0)))
      addOne(caxu, String(s.axisUnitList.reduce((sum, u) => sum + u.x, 0)))
      for (const r of s.specialRules) {
        addOne(csr, r)
      }
      addOne(cbt, s.map.baseTerrain)
      addOne(cn, s.map.night ? "Night" : "Day")
      addOne(csw, String(s.map.currentWeather))
      addOne(cbw, String(s.map.baseWeather))
      addOne(cp, String(s.map.precipChance > 0 ? s.map.precip : "None"))
      addOne(cpp, String(s.map.precipChance))
      addOne(cwt, String(s.map.windSpeed))
      addOne(cwd, String(s.map.windDirection))
      addOne(cwv, s.map.windVariable ? "Variable" : "Steady")

      const terrains: Lookup = {}
      const elevations: Lookup = {}
      const roads: Lookup = {}
      let railroads = 0
      const buildings: Lookup = {}
      const borders: Lookup = {}
      const rivers: Lookup = {}
      for (const row of s.map.mapHexes) {
        for (const hex of row) {
          addOne(terrains, hex.terrain.name)
          addOne(elevations, String(hex.elevation))
          if (hex.road) { addOne(roads, hex.terrain.roadAttr?.name ?? "whoops") }
          if (hex.railroad) { railroads++ }
          if (hex.building) { addOne(buildings, hexBuildingNames(hex.buildingShape)) }
          if (hex.border !== undefined) {
            addMany(borders, hex.terrain.borderAttr?.name ?? "whoops", hex.borderEdges?.length ?? 1)
          }
          if (hex.river) { addOne(rivers, hex.terrain.streamAttr?.name ?? "whoops") }
        }
      }
      Object.keys(terrains).forEach(k => {
        addOne(ctp, k)
        addMany(ct, k, terrains[k])
        addMany(ct, "all", terrains[k])
      })
      Object.keys(elevations).forEach(k => {
        addOne(cep, k)
        addMany(ce, k, elevations[k])
        addMany(ce, "all", elevations[k])
      })
      Object.keys(roads).forEach(k => {
        addOne(crp, k)
        addMany(cr, k, roads[k])
        addMany(cr, "all", roads[k])
      })
      if (railroads > 0) {
        addOne(crrp, "railroad")
        addMany(crr, "railroad", railroads)
        addMany(crr, "all", railroads)
      }
      Object.keys(buildings).forEach(k => {
        addOne(cbp, k)
        addMany(cb, k, buildings[k])
        addMany(cb, "all", buildings[k])
      })
      Object.keys(borders).forEach(k => {
        addOne(cbdp, k)
        addMany(cbd, k, borders[k])
        addMany(cbd, "all", borders[k])
      })
      Object.keys(rivers).forEach(k => {
        addOne(csp, k)
        addMany(cs, k, rivers[k])
        addMany(cs, "all", rivers[k])
      })
    }
    setCountStatus(() => cst)
    setCountAllies(() => cal)
    setCountAxis(() => cax)
    setCountYears(() => cy)
    setCountMonths(() => cm)
    setCountTurns(() => ctn)
    setCountLayout(() => cl)
    setCountVictoryCount(() => cv)
    setCountAlliedUnitCount(() => calu)
    setCountAxisUnitCount(() => caxu)
    setCountSpecialRules(() => csr)
    setCountBaseTerrain(() => cbt)
    setCountNight(() => cn)
    setCountStartWeather(() => csw)
    setCountBaseWeather(() => cbw)
    setCountPrecip(() => cp)
    setCountPrecipPercent(() => cpp)
    setCountWindType(() => cwt)
    setCountWindDirection(() => cwd)
    setCountWindVariable(() => cwv)

    setCountTerrain(() => ct)
    setCountTerrainPresent(() => ctp)
    setCountElevation(() => ce)
    setCountElevationPresent(() => cep)
    setCountRoad(() => cr)
    setCountRoadPresent(() => crp)
    setCountRailroad(() => crr)
    setCountRailroadPresent(() => crrp)
    setCountBuilding(() => cb)
    setCountBuildingPresent(() => cbp)
    setCountBorder(() => cbd)
    setCountBorderPresent(() => cbdp)
    setCountStream(() => cs)
    setCountStreamPresent(() => csp)
  }, [scenarios])

  const displayStat = (
    data: Lookup, key: { [ index: string]: string }, sort: string = "value"
  ) => {
    let width = 2.5
    Object.values(data).forEach(v => {
      if (v > 99 && width < 3) { width = 3 }
      if (v > 999 && width < 3.5) { width = 3.5 }
      if (v > 9999 && width < 4) { width = 4 }
    })
    const items: JSX.Element[] = []
    for (const k of Object.keys(data).sort((a, b) => {
        if (sort === "value") { return data[b] - data[a] }
        if (sort === "key") { return a.localeCompare(b) }
        if (sort === "num") { return Number(a) - Number(b) }
        return 0
      }
    )) {
      if (k === "all") { continue }
      items.push(
        <div className="flex" key={k}>
          <div style={{
            background: "#F00", width: `${data[k]/data["all"] * 80}px`, height: "16px",
            marginTop: "4px"
          }}></div>
          <div style={{
            background: "#DDD", width: `${(1 - data[k]/data["all"]) * 80}px`, height: "16px",
            marginTop: "4px"
          }}></div>
          <div style={{ marginLeft: "0.5em", width: "2.5em" }}>
            {Math.round(data[k] / data["all"] * 100)}%
          </div>
          <div style={{ marginLeft: "0.5em", width: `${width}em` }}>
            ({data[k]})
          </div>
          <div>{key[k] ?? k}</div>
        </div>
      )
    }
    return (
      <div>
        {items}
      </div>
    )
  }

  return (
    <div className="flex flex-wrap">
      <div className="p1em">
        Dev Status:
        {displayStat(countStatus, { a: "Alpha", b: "Beta", p: "Prototype", r: "Ready" })}
        Allied Faction:
        {displayStat(
          countAllies,
          Object.keys(countAllies).filter(k => k !== "all").
            reduce((o, k) => { return {...o, [k]: alliedCodeToName(k)} }, {})
        )}
        Axis Faction:
        {displayStat(
          countAxis,
          Object.keys(countAxis).filter(k => k !== "all").
            reduce((o, k) => { return {...o, [k]: axisCodeToName(k)} }, {})
        )}
        Turns:
        {displayStat(countTurns, {}, "num")}
        Victory Points:
        {displayStat(countVictoryCount, {}, "num")}
        Special Rules:
        {displayStat(countSpecialRules, {})}
      </div>
      <div className="p1em">
        Years:
        {displayStat(countYears, {}, "key")}
        Months:
        {displayStat(countMonths, {}, "key")}
      </div>
      <div className="p1em">
        Allied Unit Counts:
        {displayStat(countAlliedUnitCount, {}, "num")}
        Axis Unit Counts:
        {displayStat(countAxisUnitCount, {}, "num")}
      </div>
      <div className="p1em">
        Layout:
        {displayStat(countLayout, {})}
        Base Terrain:
        {displayStat(countBaseTerrain, {
          g: "Grass", d: "Sand", s: "Snow", m: "Mud", u: "Urban",
        })}
        Day/Night:
        {displayStat(countNight, {})}
        Start Weather:
        {displayStat(countStartWeather, { 0: "Dry", 1: "Fog", 2: "Rain", 3: "Snow", 4: "Sand", 5: "Dust" })}
        Base Weather:
        {displayStat(countBaseWeather, { 0: "Dry", 1: "Fog", 2: "Rain", 3: "Snow", 4: "Sand", 5: "Dust" })}
        Precip Type:
        {displayStat(countPrecip, { 2: "Rain", 3: "Snow" })}
        Precip Chance:
        {displayStat(countPrecipPercent, { 0: "None", 1: "10%", 2: "20%", 3: "30%" })}
        Wind Strength:
        {displayStat(countWindType, { 0: "Calm", 1: "Breeze", 2: "Moderate", 3: "Strong" })}
        Wind Direction:
        {displayStat(countWindDirection, {})}
        Variable:
        {displayStat(countWindVariable, {})}
      </div>
      <div className="p1em">
        Terrain Count:
        {displayStat(countTerrain, {})}
        Terrain Present:
        {displayStat(countTerrainPresent, {})}
        Road Count:
        {displayStat(countRoad, {})}
        Road Present:
        {displayStat(countRoadPresent, {})}
        Railroad Count:
        {displayStat(countRailroad, {})}
        Railroad Present:
        {displayStat(countRailroadPresent, {})}
      </div>
      <div className="p1em">
        Stream Count:
        {displayStat(countStream, {})}
        Stream Present:
        {displayStat(countStreamPresent, {})}
        Border Count:
        {displayStat(countBorder, {})}
        Border Present:
        {displayStat(countBorderPresent, {})}
        Elevation:
        {displayStat(countElevation, {})}
        Elevation Present:
        {displayStat(countElevationPresent, {})}
      </div>
      <div className="p1em">
        Building Count:
        {displayStat(countBuilding, {})}
        Building Present:
        {displayStat(countBuildingPresent, {})}
      </div>
    </div>
  )
}
