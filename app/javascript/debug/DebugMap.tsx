import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MapDisplay from "../components/game/map/MapDisplay";
import Game, { gamePhaseType } from "../engine/Game";
import { mapDebugData } from "./data";
import Map from "../engine/Map";
import {
  BaseTerrainType,
  Coordinate,
  Direction,
  WeatherType,
  WindType,
  baseTerrainType,
  weatherType,
  windType,
} from "../utilities/commonTypes";
import Feature, { FeatureData } from "../engine/Feature";
import Unit, { UnitData } from "../engine/Unit";
import { normalDir } from "../utilities/utilities";
import { getAPI } from "../utilities/network";
import organizeStacks from "../engine/support/organizeStacks";

export default function DebugMap() {
  const id: number = Number(useParams().id)

  const [units, setUnits] = useState<{ [index: string]: Unit | Feature }>({})

  const [map, setMap] = useState<Map | undefined>(undefined)
  const [scale, setScale] = useState(1)
  const [coords, setCoords] = useState(true)
  const [showStatusCounters, setShowStatusCounters] = useState(false)
  const [hideCounters, setHideCounters] = useState(true)
  const [showTerrain, setShowTerrain] = useState(false)
  const [showLos, setShowLos] = useState(false)
  const [debugLos, setDebugLos] = useState(false)
  const [baseTerrain, setBaseTerrain] = useState(baseTerrainType.Grass)
  const [night, setNight] = useState(false)
  const [currentWeather, setCurrentWeather] = useState(0)
  const [baseWeather, setBaseWeather] = useState(0)
  const [precipType, setPrecipType] = useState(weatherType.Rain)
  const [precipChance, setPrecipChance] = useState(0)
  const [wind, setWind] = useState(windType.Calm)
  const [windDir, setWindDir] = useState(1)
  const [windVariable, setWindVariable] = useState(false)
  const [initiative, setInitiative] = useState(0)
  const [initiativePlayer, setInitiativePlayer] = useState("")

  const makeIndex = (uf: Unit | Feature) => {
    if (uf.isFeature) {
      if (uf.name === "Smoke") { return `f_Smoke_${uf.hindrance}`}
      return `f_${uf.name}`
    } else {
      const unit = uf as Unit
      if (unit.name === "Leader") {
        return `${unit.nation}_Leader_ldr_${unit.baseMorale}_${unit.currentLeadership}`
      }
      if (unit.name === "Crew") {
        return `${unit.nation}_Crew_tm_${unit.currentGunHandling}`
      }
      return `${unit.nation}_${unit.name}_${unit.type}`
    }
  }

  useEffect(() => {
    getAPI("/api/v1/scenarios/all_units", {
      ok: response => response.json().then(json => {
        const data: { [index: string]: Unit | Feature } = {}
        Object.values(json).filter(u => !(u as UnitData).mk).forEach(
          u => {
            const unit = (u as UnitData).ft ? new Feature(u as FeatureData) : new Unit(u as UnitData)
            data[makeIndex(unit)] = unit
          }
        )
        setUnits(data)
      })
    })
  }, [])

  useEffect(() => {
    if (Object.keys(units).length === 0) { return }
    const game = new Game({
      id: 0, name: "test", owner: "one", player_one: "one", player_two: "two",
      current_player: "one", metadata: { turn: 0 },
      scenario: {
        id: "999", name: "test", allies: ["ussr"], axis: ["ger"], status: "p",
        metadata: {
          author: "", description: [""], first_deploy: 1, date: [1940, 1, 1], location: "here",
          turns: 8,
          first_action: 1,
          allied_units: { 0: { list: [] }},
          axis_units: { 0: { list: [] }},
          map_data: {
            layout: [mapDebugData[id].x, mapDebugData[id].y, "x"],
            base_terrain: "g", axis_dir: 4, allied_dir: 1,
            start_weather: weatherType.Dry,
            base_weather: weatherType.Dry,
            precip: [0, weatherType.Rain],
            wind: [windType.Calm, 1, false],
            hexes: mapDebugData[id].hexes,
          }
        }
      }
    })
    game.phase = gamePhaseType.Main
    setMap(game.scenario.map)
    game.scenario.map.debug = true
    setInitiativePlayer(game.currentPlayer === 1 ? "axis" : "allies")
  }, [units])

  useEffect(() => {
    if (!map) { return }
    mapDebugData[id].features.forEach(data => {
      const unit = (units[data.u] as Feature).clone()
      if (data.f) { unit.facing = data.f }
      map.addCounter(new Coordinate(data.x, data.y), unit)
    })
    mapDebugData[id].units.forEach(data => {
      const unit = (units[data.u] as Unit).clone()
      if (data.f) { unit.facing = data.f }
      if (data.tf) { unit.turretFacing = data.tf }
      if (data.v) { unit.eliteCrew = data.v }
      if (data.st) { unit.status = data.st }
      if (data.imm) { unit.immobilized = true }
      if (data.brk) { unit.jammed = true }
      if (data.wpn) { unit.weaponBroken = true }
      if (data.trt) { unit.turretJammed = true }
      map.addCounter(new Coordinate(data.x, data.y), unit)
    })
    organizeStacks(map)
    setHideCounters(false)
  }, [map])

  const hexSelection = (x: number, y: number) => {
    const key = `${x}-${y}`
    console.log(key)
  }

  const unitSelection = () => {
  }

  const baseTerrainName = () => {
    return map?.baseTerrainName
  }

  const nextTerrain = (t: BaseTerrainType): BaseTerrainType => {
    return {
      g: baseTerrainType.Sand,
      d: baseTerrainType.Snow,
      s: baseTerrainType.Mud,
      m: baseTerrainType.Urban,
      u: baseTerrainType.Grass,
    }[t]
  }

  const nextWeather = (w: WeatherType, precip = false): WeatherType => {
    let type = w + 1
    if (precip) {
      if (type > 3) { type = 2 }
    } else {
      if (type > 5) { type = 0 }
    }
    return type as WeatherType
  }

  const nextChance = (c: number): number => {
    let chance = c + 1
    if (chance > 9) { chance = 0 }
    return chance
  }

  const nextWind = (w: WindType): WindType => {
    let wind = w + 1
    if (wind > 3) { wind = 0 }
    return wind as WindType
  }

  const nextDirection = (d: Direction): Direction => {
    return normalDir(d + 1)
  }

  return (
    <div className="map-container">
      <div className="flex map-control">
        <div className="custom-button normal-button" onClick={() => setScale(s => Math.max(s/1.25, 0.4))}>
          size -
        </div>
        <div className="custom-button normal-button" onClick={() => setScale(1)}>
          0
        </div>
        <div className="custom-button normal-button" onClick={() => setScale(s => Math.min(s*1.25, 2.5))}>
          + size
        </div>
        <div className="custom-button normal-button" onClick={() => setCoords(c => !c)}>
          coords { coords ? "on" : "off" }
        </div>
        <div className="custom-button normal-button" onClick={() => setShowStatusCounters(ssc => !ssc)}>
          { showStatusCounters ? "counters" : "badges" }
        </div>
        <div className="custom-button normal-button" onClick={() => setShowLos(sl => !sl)}>
          { showLos ? "show LOS" : "show stacks" }
        </div>
        {
          showLos ? 
          <div className="custom-button normal-button" onClick={() => {
            setDebugLos(sl => !sl)
            map && (map.debugLos = !map.debugLos)
          }}>
            { debugLos ? "debug LOS on" : "debug LOS off" }
          </div> : ""
        }
        <div className="custom-button normal-button" onClick={() => setHideCounters(sc => !sc)}>
          { hideCounters ? "hide counters" : "show counters" }
        </div>
        <div className="custom-button normal-button" onClick={() => setShowTerrain(sc => !sc)}>
          { showTerrain ? "terrain on" : "terrain off" }
        </div>
        <div className="custom-button normal-button" onClick={() => {
          const nt = nextTerrain(baseTerrain)
          map && (map.baseTerrain = nt)
          setBaseTerrain(nt)
        }}>
          { baseTerrainName() }
        </div>
        <div className="custom-button normal-button" onClick={() => {
          map && (map.night = !map.night)
          setNight(nt => !nt)
        }}>
          { night ? "night" : "day" }
        </div>
        <div className="custom-button normal-button" onClick={() => {
          if (map) {
            map.baseWeather = nextWeather(map.baseWeather)
            setBaseWeather(() => map.baseWeather)
            if (map.baseWeather === weatherType.Rain || map.baseWeather === weatherType.Snow) {
              map.precip = map.baseWeather
              setPrecipType(() => map.precip)
              if (map.currentWeather === weatherType.Rain || map.currentWeather === weatherType.Snow) {
                map.currentWeather = map.baseWeather
                setCurrentWeather(() => map.currentWeather)
              }
            } else {
              if (map.currentWeather !== weatherType.Rain && map.currentWeather !== weatherType.Snow) {
                map.currentWeather = map.baseWeather
                setCurrentWeather(() => map.currentWeather)
              }
            }
          }
        }}>
          b: { map?.weatherName(baseWeather) }
        </div>
        <div className="custom-button normal-button" onClick={() => {
          if (map) {
            map.precip = nextWeather(precipType, true)
            setPrecipType(() => map.precip)
            if (map.currentWeather === weatherType.Rain || map.currentWeather === weatherType.Snow) {
              map.currentWeather = map.precip
              setCurrentWeather(() => map.currentWeather)
            }
            if (map.baseWeather === weatherType.Rain || map.baseWeather === weatherType.Snow) {
              map.baseWeather = map.precip
              setBaseWeather(() => map.baseWeather)
            }
          }
        }}>
          p: { map?.weatherName(precipType) }
        </div>
        <div className="custom-button normal-button" onClick={() => {
          if (map) {
            map.precipChance = nextChance(precipChance)
            setPrecipChance(() => map.precipChance)
          }
        }}>
          { `${precipChance}${precipChance > 0 ? "0" : ""}%` }
        </div>
        <div className="custom-button normal-button" onClick={() => {
          if (map) {
            if (map.currentWeather === map.baseWeather) {
              map.currentWeather = map.precip
            } else {
              map.currentWeather = map.baseWeather
            }
            setCurrentWeather(() => map.currentWeather)
          }
        }}>
          c: { map?.weatherName(currentWeather) }
        </div>
        <div className="custom-button normal-button" onClick={() => {
          if (map) {
            map.windSpeed = nextWind(wind)
            setWind(() => map.windSpeed)
          }
        }}>
          { map?.windName }
        </div>
        <div className="custom-button normal-button" onClick={() => {
          if (map) {
            map.windDirection = nextDirection(map.windDirection)
            setWindDir(() => map.windDirection)
          }
        }}>
          { windDir }
        </div>
        <div className="custom-button normal-button" onClick={() => {
          if (map) {
            map.windVariable = !map.windVariable
            setWindVariable(map.windVariable)
          }
        }}>
          { windVariable ? "variable" : "steady" }
        </div>
        <div className="custom-button normal-button" onClick={() => {
          if (map && map.game) {
            map.game.togglePlayer()
            setInitiativePlayer(map.game.currentPlayer === 1 ? "axis" : "allies")
          }
        }}>
          i: {initiativePlayer} {initiative}
        </div>
        <div className="custom-button normal-button" onClick={() => {
          if (map && map.game) {
            if (map.game.initiative < 7) { map.game.initiative += 1 }
            setInitiative(map.game.initiative)
          }
        }}>
          +1
        </div>
        <div className="custom-button normal-button" onClick={() => {
          if (map && map.game) {
            if (map.game.initiative > -7) { map.game.initiative -= 1 }
            setInitiative(map.game.initiative)
          }
        }}>
          -1
        </div>
      </div>
      <MapDisplay map={map as Map} scale={scale} showCoords={coords} showStatusCounters={showStatusCounters}
               showLos={showLos} hideCounters={hideCounters} showTerrain={showTerrain} preview={false}
               hexCallback={hexSelection} counterCallback={unitSelection} forceUpdate={0} />
    </div>
  )
}