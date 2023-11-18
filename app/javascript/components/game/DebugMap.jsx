import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Unit } from "../../engine/unit";
import { Feature } from "../../engine/feature";
import { Game, weatherType, windType } from "../../engine/game";
import { mapDebugData } from "../../utilities/debugData";
import GameMap from "./GameMap";

export default function DebugMap() {
  const { id } = useParams()

  const [map, setMap] = useState(null)
  const [scale, setScale] = useState(1)
  const [coords, setCoords] = useState(true)
  const [showStatusCounters, setShowStatusCounters] = useState(false)
  const [hideCounters, setHideCounters] = useState(true)
  const [showTerrain, setShowTerrain] = useState(false)
  const [showLos, setShowLos] = useState(false)
  const [debugLos, setDebugLos] = useState(false)
  const [baseTerrain, setBaseTerrain] = useState("g")
  const [night, setNight] = useState(false)
  const [currentWeather, setCurrentWeather] = useState(0)
  const [baseWeather, setBaseWeather] = useState(0)
  const [precipType, setPrecipType] = useState(2)
  const [precipChance, setPrecipChance] = useState(0)
  const [wind, setWind] = useState(0)
  const [windDir, setWindDir] = useState(1)
  const [windVariable, setWindVariable] = useState(false)

  useEffect(() => {
    const game = new Game({
      id: 1, name: "test", owner: "one", player_one: "one", player_two: "two",
      current_player: "one", metadata: { turn: 1 },
      scenario: {
        id: "999", name: "test", allies: ["ussr"], axis: ["ger"],
        metadata: {
          start_weather: weatherType.Clear,
          base_weather: weatherType.Clear,
          precip: [0, weatherType.Rain],
          wind: [windType.Calm, 1, false],
          map_data: {
            layout: [mapDebugData[id].x, mapDebugData[id].y, "x"],
            base_terrain: "g",
            hexes: mapDebugData[id].hexes,
          }
        }
      }
    })
    setMap(game.scenario.map)
  }, [])

  useEffect(() => {
    if (!map) { return }
    mapDebugData[id].features.forEach(data => {
      const unit = new Feature(data.u)
      if (data.f) { unit.facing = data.f }
      map.addUnit(data.x, data.y, unit)
    })
    mapDebugData[id].units.forEach(data => {
      const unit = new Unit(data.u)
      if (data.f) { unit.facing = data.f }
      if (data.tf) { unit.turretFacing = data.tf }
      if (data.st) { unit.status = data.st }
      if (data.imm) { unit.immobilized = true }
      if (data.brk) { unit.jammed = true }
      if (data.trt) { unit.turretJammed = true }
      map.addUnit(data.x, data.y, unit)
    })
    setHideCounters(false)
  }, [map])

  const hexSelection = (x, y) => {
    const key = `${x}-${y}`
    console.log(key)
  }

  const unitSelection = (x, y, counter) => {
    const key = `x ${x}-${y}-${counter.trueIndex}`
    console.log(key)
  }

  const baseTerrainName = () => {
    return map?.baseTerrainName
  }

  const nextTerrain = (t) => {
    return {
      g: "d",
      d: "s",
      s: "m",
      m: "u",
      u: "g",
    }[t]
  }

  const nextWeather = (w, precip = false) => {
    let type = w + 1
    if (precip) {
      if (type > 3) { type = 2 }
    } else {
      if (type > 5) { type = 0 }
    }
    return type
  }

  const nextChance = (c) => {
    let chance = c + 1
    if (chance > 10) { chance = 0 }
    return chance
  }

  const nextWind = (w) => {
    let wind = w + 1
    if (wind > 3) { wind = 0 }
    return wind
  }

  const nextDirection = (d) => {
    let dir = d + 1
    if (dir > 6) { dir = 1 }
    return dir
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
          coordinates { coords ? "on" : "off" }
        </div>
        <div className="custom-button" onClick={() => setShowStatusCounters(ssc => !ssc)}>
          { showStatusCounters ? "status counters" : "status badges" }
        </div>
        <div className="custom-button" onClick={() => setShowLos(sl => !sl)}>
          { showLos ? "show LOS" : "show stacks" }
        </div>
        {
          showLos ? 
          <div className="custom-button" onClick={() => {
            setDebugLos(sl => !sl)
            map.debug = !map.debug
          }}>
            { debugLos ? "debug LOS on" : "debug LOS off" }
          </div> : ""
        }
        <div className="custom-button" onClick={() => setHideCounters(sc => !sc)}>
          { hideCounters ? "hide counters" : "show counters" }
        </div>
        <div className="custom-button" onClick={() => setShowTerrain(sc => !sc)}>
          { showTerrain ? "terrain info on" : "terrain info off" }
        </div>
        <div className="custom-button" onClick={() => {
          const nt = nextTerrain(baseTerrain)
          map.baseTerrain = nt
          setBaseTerrain(nt)
        }}>
          { `base ${baseTerrainName(baseTerrain)}` }
        </div>
        <div className="custom-button" onClick={() => {
          map.night = !map.night
          setNight(nt => !nt)
        }}>
          { night ? "nighttime" : "daytime" }
        </div>
        <div className="custom-button" onClick={() => {
          if (!map.game) { return }
          map.game.currentWeather = nextWeather(map.game.currentWeather)
          setCurrentWeather(() => map.game.currentWeather)
          if (map.game.currentWeather === weatherType.Rain || map.game.currentWeather === weatherType.Snow) {
            map.game.precip = map.game.currentWeather
            setPrecipType(() => map.game.precip)
          } else {
            map.game.baseWeather = map.game.currentWeather
            setBaseWeather(() => map.game.baseWeather)
          }
        }}>
          c: { map?.game?.weatherName(currentWeather) }
        </div>
        <div className="custom-button" onClick={() => {
          if (!map.game) { return }
          map.game.baseWeather = nextWeather(map.game.baseWeather)
          setBaseWeather(() => map.game.baseWeather)
          if (map.game.baseWeather === weatherType.Rain || map.game.baseWeather === weatherType.Snow) {
            map.game.precip = map.game.baseWeather
            setPrecipType(() => map.game.precip)
            if (map.game.currentWeather === weatherType.Rain || map.game.currentWeather === weatherType.Snow) {
              map.game.currentWeather = map.game.baseWeather
              setCurrentWeather(() => map.game.currentWeather)
            }
          } else {
            map.game.currentWeather = map.game.baseWeather
            setCurrentWeather(() => map.game.currentWeather)
          }
        }}>
          b: { map?.game?.weatherName(baseWeather) }
        </div>
        <div className="custom-button" onClick={() => {
          if (!map.game) { return }
          map.game.precip = nextWeather(precipType, true)
          setPrecipType(() => map.game.precip)
          if (map.game.precipChance === 10) {
            map.game.currentWeather = map.game.precip
            setCurrentWeather(() => map.game.currentWeather)
          } else if (map.game.precipChance === 0) {
            map.game.currentWeather = map.game.baseWeather
            setCurrentWeather(() => map.game.currentWeather)
          }
        }}>
          p: { map?.game?.weatherName(precipType) }
        </div>
        <div className="custom-button" onClick={() => {
          if (!map.game) { return }
          map.game.precipChance = nextChance(precipChance)
          setPrecipChance(() => map.game.precipChance)
          if (map.game.precipChance === 10) {
            map.game.currentWeather = map.game.precip
            setCurrentWeather(() => map.game.currentWeather)
          } else if (map.game.precipChance === 0) {
            map.game.currentWeather = map.game.baseWeather
            setCurrentWeather(() => map.game.currentWeather)
          }
        }}>
          { `${precipChance}${precipChance > 0 ? "0" : ""}%` }
        </div>
        <div className="custom-button" onClick={() => {
          if (!map.game) { return }
          map.game.windSpeed = nextWind(wind, true)
          setWind(() => map.game.windSpeed)
        }}>
          { map?.game?.windName }
        </div>
        <div className="custom-button" onClick={() => {
          if (!map.game) { return }
          map.game.windDirection = nextDirection(map.game.windDirection, true)
          setWindDir(() => map.game.windDirection)
        }}>
          { windDir }
        </div>
        <div className="custom-button" onClick={() => {
          if (!map.game) { return }
          map.game.windVariable = !map.game.windVariable
          setWindVariable(map.game.windVariable)
        }}>
          { windVariable ? "variable" : "steady" }
        </div>
      </div>
      <GameMap map={map} scale={scale} showCoords={coords} showStatusCounters={showStatusCounters}
               showLos={showLos} hideCounters={hideCounters} showTerrain={showTerrain}
               hexCallback={hexSelection} counterCallback={unitSelection} />
    </div>
  )
}