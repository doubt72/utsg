import React, { useEffect, useState } from "react";
import { getAPI } from "../utilities/network";
import Scenario from "../engine/Scenario";
import { useParams } from "react-router-dom";
import { alliedCodeToName, axisCodeToName } from "../utilities/utilities";
import { hexBuildingNames } from "../utilities/hexBuilding";
import { nationalTextColor } from "../utilities/graphics";
import { statAddMany, statAddOne, statIncrementAllOne, StatLookup } from "./statHelpers";

// Yes, I could have put all this on the backend, but (1) the backend is largely
// a big dumb JSON blob store WRT to any game logic, and (2) while this is super
// heavy on the network traffic, it's at least straightforward instead of adding
// a whole new API for it.  And I wanted it on the web side, to make "casual
// analysis" easier, not as some sort of text report (plus it uses the same
// code/text conversions as the engine uses for help/etc).

export function displayStat(
  data: StatLookup, key: { [ index: string]: string }, sort: string = "value", country: boolean = false
) {
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
        { country ? <div dangerouslySetInnerHTML={{
          __html: `<span style="color: ${nationalTextColor(k)};">${key[k] ?? k}</span>`
        }}></div> :
        <div>{key[k] ?? k}</div>}
      </div>
    )
  }
  return (
    <div>
      {items}
    </div>
  )
}

interface DebugScenarioStatsProps {
  proto: boolean;
}

export default function DebugScenarioStats({ proto = false }: DebugScenarioStatsProps) {
  const nation: string | undefined = useParams().nation
  const [scenarios, setScenarios] = useState<Scenario[]>([])

  const [countStatus, setCountStatus] = useState<StatLookup>({})
  const [countAllies, setCountAllies] = useState<StatLookup>({})
  const [countAxis, setCountAxis] = useState<StatLookup>({})
  const [countYears, setCountYears] = useState<StatLookup>({})
  const [countMonths, setCountMonths] = useState<StatLookup>({})
  const [countTurns, setCountTurns] = useState<StatLookup>({})
  const [countLayout, setCountLayout] = useState<StatLookup>({})
  const [countVictoryCount, setCountVictoryCount] = useState<StatLookup>({})
  const [countAlliedUnitCount, setCountAlliedUnitCount] = useState<StatLookup>({})
  const [countAxisUnitCount, setCountAxisUnitCount] = useState<StatLookup>({})
  const [countSpecialRules, setCountSpecialRules] = useState<StatLookup>({})
  const [countBaseTerrain, setCountBaseTerrain] = useState<StatLookup>({})
  const [countNight, setCountNight] = useState<StatLookup>({})

  const [countStartWeather, setCountStartWeather] = useState<StatLookup>({})
  const [countBaseWeather, setCountBaseWeather] = useState<StatLookup>({})
  const [countPrecip, setCountPrecip] = useState<StatLookup>({})
  const [countPrecipPercent, setCountPrecipPercent] = useState<StatLookup>({})
  const [countWindType, setCountWindType] = useState<StatLookup>({})
  const [countWindDirection, setCountWindDirection] = useState<StatLookup>({})
  const [countWindVariable, setCountWindVariable] = useState<StatLookup>({})

  const [countTerrain, setCountTerrain] = useState<StatLookup>({})
  const [countTerrainPresent, setCountTerrainPresent] = useState<StatLookup>({})
  const [countElevation, setCountElevation] = useState<StatLookup>({})
  const [countElevationPresent, setCountElevationPresent] = useState<StatLookup>({})
  const [countRoad, setCountRoad] = useState<StatLookup>({})
  const [countRoadPresent, setCountRoadPresent] = useState<StatLookup>({})
  const [countRailroad, setCountRailroad] = useState<StatLookup>({})
  const [countRailroadPresent, setCountRailroadPresent] = useState<StatLookup>({})
  const [countBuilding, setCountBuilding] = useState<StatLookup>({})
  const [countBuildingPresent, setCountBuildingPresent] = useState<StatLookup>({})
  const [countBorder, setCountBorder] = useState<StatLookup>({})
  const [countBorderPresent, setCountBorderPresent] = useState<StatLookup>({})
  const [countStream, setCountStream] = useState<StatLookup>({})
  const [countStreamPresent, setCountStreamPresent] = useState<StatLookup>({})

  const allied = (code: string): boolean => {
    return ["ussr", "uk", "usa", "fra", "chi", "alm"].includes(code)
  }

  useEffect(() => {
    const url = `/api/v1/scenarios?page=0&page_size=999&status=${ proto ? "p*" : "*"}${
      nation ? (allied(nation) ? `&allies=${nation}` : `&axis=${nation}`) : ""
    }`
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
    const cst: StatLookup = { all: 0 }
    const cal: StatLookup = { all: 0 }
    const cax: StatLookup = { all: 0 }
    const cy: StatLookup = { all: 0 }
    const cm: StatLookup = { all: 0 }
    const ctn: StatLookup = { all: 0 }
    const cl: StatLookup = { all: 0 }
    const cv: StatLookup = { all: 0 }
    const calu: StatLookup = { all: 0 }
    const caxu: StatLookup = { all: 0 }
    const csr: StatLookup = { all: 0 }
    const cbt: StatLookup = { all: 0 }
    const cn: StatLookup = { all: 0 }
    const csw: StatLookup = { all: 0 }
    const cbw: StatLookup = { all: 0 }
    const cp: StatLookup = { all: 0 }
    const cpp: StatLookup = { all: 0 }
    const cwt: StatLookup = { all: 0 }
    const cwd: StatLookup = { all: 0 }
    const cwv: StatLookup = { all: 0 }

    const ct: StatLookup = { all: 0 }
    const ctp: StatLookup = { all: 0 }
    const ce: StatLookup = { all: 0 }
    const cep: StatLookup = { all: 0 }
    const cr: StatLookup = { all: 0 }
    const crp: StatLookup = { all: 0 }
    const crr: StatLookup = { all: 0 }
    const crrp: StatLookup = { all: 0 }
    const cb: StatLookup = { all: 0 }
    const cbp: StatLookup = { all: 0 }
    const cbd: StatLookup = { all: 0 }
    const cbdp: StatLookup = { all: 0 }
    const cs: StatLookup = { all: 0 }
    const csp: StatLookup = { all: 0 }
    for (const s of scenarios) {
      statIncrementAllOne([
        cst, cal, cax, cy, cm, ctn, cl, cv, calu, caxu, csr, cbt, cn, csw, cbw, cp, cpp, cwt, cwd, cwv,
        ctp, cep, crp, crrp, cbp, cbdp, csp
      ])
      statAddOne(cst, s.status)
      for (const a of s.alliedFactions) {
        statAddOne(cal, a)
      }
      for (const a of s.axisFactions) {
        statAddOne(cax, a)
      }
      statAddOne(cy, String(s.date[0]))
      statAddOne(cm, `${s.date[0]}/${s.date[1] > 9 ? s.date[1] : `0${s.date[1]}`}`)
      statAddOne(ctn, String(s.turns))
      statAddOne(cl, `${s.map.width}x${s.map.height}`)
      statAddOne(cv, String(s.map.victoryHexes.length))
      statAddOne(calu, String(s.alliedUnitList.reduce((sum, u) => sum + u.x, 0)))
      statAddOne(caxu, String(s.axisUnitList.reduce((sum, u) => sum + u.x, 0)))
      for (const r of s.specialRules) {
        statAddOne(csr, r)
      }
      statAddOne(cbt, s.map.baseTerrain)
      statAddOne(cn, s.map.night ? "night" : "day")
      statAddOne(csw, s.map.currentWeather)
      statAddOne(cbw, s.map.baseWeather)
      statAddOne(cp, s.map.precipChance > 0 ? s.map.precip : "none")
      statAddOne(cpp, String(s.map.precipChance))
      statAddOne(cwt, String(s.map.windSpeed))
      statAddOne(cwd, String(s.map.windDirection))
      statAddOne(cwv, s.map.windVariable ? "variable" : "steady")

      const terrains: StatLookup = {}
      const elevations: StatLookup = {}
      const roads: StatLookup = {}
      let railroads = 0
      const buildings: StatLookup = {}
      const borders: StatLookup = {}
      const rivers: StatLookup = {}
      for (const row of s.map.mapHexes) {
        for (const hex of row) {
          statAddOne(terrains, hex.terrain.name)
          statAddOne(elevations, String(hex.elevation))
          if (hex.road) { statAddOne(roads, hex.terrain.roadAttr?.name ?? "whoops") }
          if (hex.railroad) { railroads++ }
          if (hex.building) { statAddOne(buildings, hexBuildingNames(hex.buildingShape)) }
          if (hex.border !== undefined) {
            statAddMany(borders, hex.terrain.borderAttr?.name ?? "whoops", hex.borderEdges?.length ?? 1)
          }
          if (hex.river) { statAddOne(rivers, hex.terrain.streamAttr?.name ?? "whoops") }
        }
      }
      Object.keys(terrains).forEach(k => {
        statAddOne(ctp, k)
        statAddMany(ct, k, terrains[k])
        statAddMany(ct, "all", terrains[k])
      })
      Object.keys(elevations).forEach(k => {
        statAddOne(cep, k)
        statAddMany(ce, k, elevations[k])
        statAddMany(ce, "all", elevations[k])
      })
      Object.keys(roads).forEach(k => {
        statAddOne(crp, k)
        statAddMany(cr, k, roads[k])
        statAddMany(cr, "all", roads[k])
      })
      if (railroads > 0) {
        statAddOne(crrp, "railroad")
        statAddMany(crr, "railroad", railroads)
        statAddMany(crr, "all", railroads)
      }
      Object.keys(buildings).forEach(k => {
        statAddOne(cbp, k)
        statAddMany(cb, k, buildings[k])
        statAddMany(cb, "all", buildings[k])
      })
      Object.keys(borders).forEach(k => {
        statAddOne(cbdp, k)
        statAddMany(cbd, k, borders[k])
        statAddMany(cbd, "all", borders[k])
      })
      Object.keys(rivers).forEach(k => {
        statAddOne(csp, k)
        statAddMany(cs, k, rivers[k])
        statAddMany(cs, "all", rivers[k])
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

  return (
    <div className="flex flex-wrap">
      <div className="p1em">
        Dev Status:
        {displayStat(countStatus, { a: "Alpha", b: "Beta", p: "Prototype", "": "Ready" })}
        Allied Faction:
        {displayStat(
          countAllies,
          Object.keys(countAllies).filter(k => k !== "all").
            reduce((o, k) => { return {...o, [k]: alliedCodeToName(k)} }, {}),
          "value", true
        )}
        Axis Faction:
        {displayStat(
          countAxis,
          Object.keys(countAxis).filter(k => k !== "all").
            reduce((o, k) => { return {...o, [k]: axisCodeToName(k)} }, {}),
          "value", true
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
          g: "grass", d: "sand", s: "snow", m: "mud", u: "urban",
        })}
        Day/Night:
        {displayStat(countNight, {})}
        Start Weather:
        {displayStat(countStartWeather, {})}
        Base Weather:
        {displayStat(countBaseWeather, {})}
        Precip Type:
        {displayStat(countPrecip, {})}
        Precip Chance:
        {displayStat(countPrecipPercent, { 0: "none", 1: "10%", 2: "20%", 3: "30%" })}
        Wind Strength:
        {displayStat(countWindType, { 1: "calm", 2: "breeze", 3: "moderate", 4: "strong" })}
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
