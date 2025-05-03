import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import GameMap from "./map/GameMap";
import Game, { gamePhaseType } from "../../engine/Game";
import { mapDebugData } from "../../debug/data";
import Map from "../../engine/Map";
import {
  BaseTerrainTypeType,
  Coordinate,
  Direction,
  WeatherTypeType,
  WindTypeType,
  baseTerrainType,
  weatherType,
  windType,
} from "../../utilities/commonTypes";
import Feature from "../../engine/Feature";
import Unit from "../../engine/Unit";
import Counter from "../../engine/Counter";
import { normalDir } from "../../utilities/utilities";

export default function DebugMap() {
  const id: number = Number(useParams().id)

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

  useEffect(() => {
    const game = new Game({
      id: 1, name: "test", owner: "one", player_one: "one", player_two: "two",
      current_player: "one", metadata: { turn: 0 },
      scenario: {
        id: "999", name: "test", allies: ["ussr"], axis: ["ger"],
        metadata: {
          turns: 8,
          first_move: 1,
          allied_units: { 0: { list: [] }},
          axis_units: { 0: { list: [] }},
          map_data: {
            layout: [mapDebugData[id].x, mapDebugData[id].y, "x"],
            base_terrain: "g",
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
    setInitiativePlayer(game.initiativePlayer ? "axis" : "allies")
  }, [])

  useEffect(() => {
    if (!map) { return }
    mapDebugData[id].features.forEach(data => {
      const unit = new Feature(data.u)
      if (data.f) { unit.facing = data.f }
      map.addUnit(new Coordinate(data.x, data.y), unit)
    })
    mapDebugData[id].units.forEach(data => {
      const unit = new Unit(data.u)
      if (data.f) { unit.facing = data.f }
      if (data.tf) { unit.turretFacing = data.tf }
      if (data.v) { unit.eliteCrew = data.v }
      if (data.st) { unit.status = data.st }
      if (data.imm) { unit.immobilized = true }
      if (data.brk) { unit.jammed = true }
      if (data.trt) { unit.turretJammed = true }
      map.addUnit(new Coordinate(data.x, data.y), unit)
    })
    setHideCounters(false)
  }, [map])

  const hexSelection = (x: number, y: number) => {
    const key = `${x}-${y}`
    console.log(key)
  }

  const unitSelection = (x: number, y: number, counter: Counter) => {
    const key = `x ${x}-${y}-${counter.trueIndex}`
    console.log(key)
  }

  const baseTerrainName = () => {
    return map?.baseTerrainName
  }

  const nextTerrain = (t: BaseTerrainTypeType): BaseTerrainTypeType => {
    return {
      g: baseTerrainType.Desert,
      d: baseTerrainType.Snow,
      s: baseTerrainType.Mud,
      m: baseTerrainType.Urban,
      u: baseTerrainType.Grass,
    }[t]
  }

  const nextWeather = (w: WeatherTypeType, precip = false): WeatherTypeType => {
    let type = w + 1
    if (precip) {
      if (type > 3) { type = 2 }
    } else {
      if (type > 5) { type = 0 }
    }
    return type as WeatherTypeType
  }

  const nextChance = (c: number): number => {
    let chance = c + 1
    if (chance > 9) { chance = 0 }
    return chance
  }

  const nextWind = (w: WindTypeType): WindTypeType => {
    let wind = w + 1
    if (wind > 3) { wind = 0 }
    return wind as WindTypeType
  }

  const nextDirection = (d: Direction): Direction => {
    return normalDir(d + 1)
  }

  return (
    <div className="map-container">
      <div className="flex mb05em">
        <div className="custom-button" onClick={() => setScale(s => Math.max(s/1.25, 0.4))}>
          size -
        </div>
        <div className="custom-button" onClick={() => setScale(1)}>
          0
        </div>
        <div className="custom-button" onClick={() => setScale(s => Math.min(s*1.25, 2.5))}>
          + size
        </div>
        <div className="custom-button" onClick={() => setCoords(c => !c)}>
          coords { coords ? "on" : "off" }
        </div>
        <div className="custom-button" onClick={() => setShowStatusCounters(ssc => !ssc)}>
          { showStatusCounters ? "counters" : "badges" }
        </div>
        <div className="custom-button" onClick={() => setShowLos(sl => !sl)}>
          { showLos ? "show LOS" : "show stacks" }
        </div>
        {
          showLos ? 
          <div className="custom-button" onClick={() => {
            setDebugLos(sl => !sl)
            map && (map.debug = !map.debug)
          }}>
            { debugLos ? "debug LOS on" : "debug LOS off" }
          </div> : ""
        }
        <div className="custom-button" onClick={() => setHideCounters(sc => !sc)}>
          { hideCounters ? "hide counters" : "show counters" }
        </div>
        <div className="custom-button" onClick={() => setShowTerrain(sc => !sc)}>
          { showTerrain ? "terrain on" : "terrain off" }
        </div>
        <div className="custom-button" onClick={() => {
          const nt = nextTerrain(baseTerrain)
          map && (map.baseTerrain = nt)
          setBaseTerrain(nt)
        }}>
          { baseTerrainName() }
        </div>
        <div className="custom-button" onClick={() => {
          map && (map.night = !map.night)
          setNight(nt => !nt)
        }}>
          { night ? "night" : "day" }
        </div>
        <div className="custom-button" onClick={() => {
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
        <div className="custom-button" onClick={() => {
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
        <div className="custom-button" onClick={() => {
          if (map) {
            map.precipChance = nextChance(precipChance)
            setPrecipChance(() => map.precipChance)
          }
        }}>
          { `${precipChance}${precipChance > 0 ? "0" : ""}%` }
        </div>
        <div className="custom-button" onClick={() => {
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
        <div className="custom-button" onClick={() => {
          if (map) {
            map.windSpeed = nextWind(wind)
            setWind(() => map.windSpeed)
          }
        }}>
          { map?.windName }
        </div>
        <div className="custom-button" onClick={() => {
          if (map) {
            map.windDirection = nextDirection(map.windDirection)
            setWindDir(() => map.windDirection)
          }
        }}>
          { windDir }
        </div>
        <div className="custom-button" onClick={() => {
          if (map) {
            map.windVariable = !map.windVariable
            setWindVariable(map.windVariable)
          }
        }}>
          { windVariable ? "variable" : "steady" }
        </div>
        <div className="custom-button" onClick={() => {
          if (map && map.game) {
            map.game.initiativePlayer = map.game.initiativePlayer == 1 ? 2 : 1
            setInitiativePlayer(map.game.initiativePlayer ? "axis" : "allies")
          }
        }}>
          i: {initiativePlayer} {initiative}
        </div>
        <div className="custom-button" onClick={() => {
          if (map && map.game) {
            if (map.game.initiative < 7) { map.game.initiative += 1 }
            setInitiative(map.game.initiative)
          }
        }}>
          +1
        </div>
        <div className="custom-button" onClick={() => {
          if (map && map.game) {
            if (map.game.initiative > -7) { map.game.initiative -= 1 }
            setInitiative(map.game.initiative)
          }
        }}>
          -1
        </div>
      </div>
      <GameMap map={map as Map} scale={scale} showCoords={coords} showStatusCounters={showStatusCounters}
               showLos={showLos} hideCounters={hideCounters} showTerrain={showTerrain}
               hexCallback={hexSelection} counterCallback={unitSelection} />
    </div>
  )
}