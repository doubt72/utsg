import React, { useEffect, useRef, useState } from "react";
import Header from "../components/Header";
import Scenario, { ScenarioData } from "../engine/Scenario";
import { hexPath, roundedRectangle } from "../utilities/graphics";
import MapHex from "../components/game/map/MapHex";
import MapHexDetail from "../components/game/map/MapHexDetail";
import MapHexPatterns from "../components/game/map/MapHexPatterns";
import DesignerDataTab from "./DesignerDataTab";
import DesignerFileTab from "./DesignerFileTab";
import DesignerMapTab from "./DesignerMapTab";
import {
  BorderType, BuildingShape, BuildingStyle, Coordinate, Direction, Elevation, ExtendedDirection,
  hexOpenType, RoadCenterType, RoadType, StreamType, TerrainType
} from "../utilities/commonTypes";
import { HexData } from "../engine/Hex";
import { normalDir } from "../utilities/utilities";
import DesignerOrderOfBattleTab from "./DesignerOrderOfBattleTab";
import { getAPI } from "../utilities/network";
import { UnitData } from "../engine/Unit";
import { deployHex, toggleHex } from "../engine/control/deploy";
import MapHexOverlay from "../components/game/map/MapHexOverlay";

export function defaultScenario(): ScenarioData {
  return structuredClone({
    id: "000", name: "blank scenario", status: "p", version: "0.1",
    allies: ["ussr"], axis: ["ger"], metadata: {
      author: "nobody", date: [1939, 1, 1], location: "nowhere", turns: 5,
      first_action: 1, first_deploy: 2,
      allied_units: { 0: { list: [] } }, axis_units: { 0: { list: [] } },
      description: ["no description yet"], special_rules: [], map_data: {
        layout: [15, 11, "x"], allied_dir: 1, axis_dir: 1, victory_hexes: [],
        allied_setup: { 0: [] }, axis_setup: { 0: [] },
        base_terrain: "g", night: false,
        start_weather: "dry", base_weather: "dry", precip: [0, "rain"], wind: [1, 1, false],
        hexes: [...Array(11)].map(() => [...Array(15)].map(() => { return { t: "o" } })),
      }
    }
  })
}

export function showHex(dir: ExtendedDirection, click: () => void): JSX.Element {
  return (
    <svg className="" width={32} height={32}
          viewBox="0 0 32 32" onClick={click}>
      <path d={ hexPath(new Coordinate(16, 16), 15, true) }
            style={{ fill: "#FFF", stroke: "#AAA", strokeWidth: 2 }}/>
      <g transform={`rotate(${(dir-1)*60} 16 16)`}>
        <path d="M 4 16 L 18 10 L 18 22 Z"
              style={{ strokeWidth: 0, fill: "#666" }} />
      </g>
    </svg>
  )
}

export type SelectionType = {
  set: "vp" | "terrain" | "elevation" | "building" | "border" | "road" | "stream" | "railroad",
  terrain: TerrainType,
  elevation: Elevation,
  building: BuildingShape,
  buildStyle: BuildingStyle,
  border: BorderType,
  borderEdges: Direction[],
  road: RoadType,
  roadDirs: Direction[],
  roadCenter?: RoadCenterType,
  roadTurn: Direction,
  stream: StreamType,
  streamDirs: Direction[],
  railroad: "+" | "-",
  rrStart: Direction,
  rrEnd: Direction,
  dir: Direction,
  mapSize: string,
}

export default function ScenarioDesigner() {
  const [scenarioData, setScenarioData] = useState<ScenarioData>(defaultScenario())
  const [scenario, setScenario] = useState<Scenario>(new Scenario(defaultScenario()))
  const [hexCache, setHexCache] = useState<HexData[][]>([])
  const [vpCache, setVpCache] = useState<[number, number, 1 | 2][]>([])

  const [selectionType, setSelectionType] = useState<SelectionType>({
    set: "vp", terrain: "o", elevation: 0, dir: 1, building: "l", buildStyle: "f", border: "f", borderEdges: [],
    road: "t", roadDirs: [], roadTurn: 1, stream: "s", streamDirs: [], railroad: "+", rrStart: 1, rrEnd: 4,
    mapSize: "15x11",
  })
  const [selectionHex, setSelectionHex] = useState<{ x: number, y: number, n: number }>({ x: 0, y: 0, n: -1 })
  const [deploySelected, setDeploySelected] = useState<string>("t0-1")

  const [tab, setTab] = useState<number>(1)

  const [hexDisplay, setHexDisplay] = useState<JSX.Element[]>([])
  const [hexDisplayDetail, setHexDisplayDetail] = useState<JSX.Element[]>([])
  const [victoryDisplay, setVictoryDisplay] = useState<JSX.Element[]>([])
  const [overlayDisplay, setOverlayDisplay] = useState<JSX.Element[]>([])

  const [availableAlliedUnits, setAvailableAlliedUnits] = useState<[string, string, UnitData][]>([])
  const [availableAxisUnits, setAvailableAxisUnits] = useState<[string, string, UnitData][]>([])

  const [scale, setScale] = useState<number>(0.45)
  const [width, setWidth] = useState<number>(1)
  const [height, setHeight] = useState<number>(1)

  const svgRef = useRef<HTMLElement | SVGSVGElement>()

  const selectHex = (x: number, y: number) => {
    setSelectionHex(s => {
      return { x, y, n: s.n + 1}
    })
  }

  const resetCache = () => {
    setHexCache([])
    setVpCache([])
  }

  const resizeMap = (x: number, y: number) => {
    setScenarioData(s => {
      const oldData = s.metadata.map_data
      const cache: HexData[][] = []
      const my = Math.max(y, oldData.layout[1], hexCache.length)
      for (let yy = 0; yy < my; yy++) {
        cache.push([])
        const hcl = hexCache.length > yy ? hexCache[yy].length : 0
        const mx = Math.max(x, oldData.layout[0], hcl)
        for (let xx = 0; xx < mx; xx++) {
          if (xx < oldData.layout[0] && yy < oldData.layout[1]) {
            cache[yy][xx] = oldData.hexes[yy][xx]
          } else if (yy < hexCache.length && xx < hexCache[yy].length) {
            cache[yy][xx] = hexCache[yy][xx]
          } else {
            cache[yy][xx] = { t: "o" }
          }
        }
      }
      const data: HexData[][] = []
      for (let yy = 0; yy < y; yy++) {
        data.push([])
        for (let xx = 0; xx < x; xx++) { data[yy].push(cache[yy][xx]) }
      }
      setHexCache(cache)
      const vps: [number, number, 1 | 2][] = []
      for (const vp of vpCache) { vps.push(vp) }
      for (const vp of s.metadata.map_data.victory_hexes ?? []) {
        let found = false
        for (const ovp of vpCache) {
          if (vp[0] === ovp[0] && vp[1] === ovp[1]) { found = true; break }
        }
        if (!found) { vps.push(vp) }
      }
      setVpCache(vps)
      return {
        ...s, metadata: { ...s.metadata, map_data:  {
          ...s.metadata.map_data, layout: [x, y, "x"], hexes: data,
          victory_hexes: vps.filter(vp => vp[0] < x && vp[1] < y),
        }}
      }
    })
  }

  useEffect(() => {
    if (selectionHex.n < 0) { return }
    if (tab === 2) {
      if (selectionType.set === "vp") {
        resetCache()
        setScenarioData(s => {
          const vps: [number, number, 1 | 2][] = []
          let found = false;
          for (const vp of s.metadata.map_data.victory_hexes as [number, number, 1 | 2][]) {
            if (vp[0] === selectionHex.x && vp[1] === selectionHex.y) {
              found = true
              if (vp[2] === 1) { vps.push([vp[0], vp[1], 2]) }
            } else {
              vps.push(vp)
            }
          }
          if (!found) { vps.push([selectionHex.x, selectionHex.y, 1])}
          return { ...s, metadata: { ...s.metadata, map_data: { ...s.metadata.map_data, victory_hexes: vps }}}
        })
      } else if (selectionType.set === "terrain") {
        setScenarioData(s => {
          const hexes = s.metadata.map_data.hexes
          const hex = hexes[selectionHex.y][selectionHex.x]
          delete hex.st
          hex.t = selectionType.terrain
          if (hex.t === "d") { hex.d = selectionType.dir } else { delete hex.d }
          return { ...s, metadata: { ...s.metadata, map_data: { ...s.metadata.map_data, hexes }}}
        })
      } else if (selectionType.set === "elevation") {
        setScenarioData(s => {
          const hexes = s.metadata.map_data.hexes
          const hex = hexes[selectionHex.y][selectionHex.x]
          if ((hex.h ?? 0) !== selectionType.elevation) {
            if (selectionType.elevation !== 0) {
              hex.h = selectionType.elevation
            } else {
              delete hex.h
            }
          }
          return { ...s, metadata: { ...s.metadata, map_data: { ...s.metadata.map_data, hexes }}}
        })
      } else if (selectionType.set === "building") {
        setScenarioData(s => {
          const hexes = s.metadata.map_data.hexes
          const hex = hexes[selectionHex.y][selectionHex.x]
          hex.t = "o"
          hex.st = { sh: selectionType.building, s: selectionType.buildStyle }
          hex.d = selectionType.dir
          return { ...s, metadata: { ...s.metadata, map_data: { ...s.metadata.map_data, hexes }}}
        })
      } else if (selectionType.set === "border") {
        setScenarioData(s => {
          const hexes = s.metadata.map_data.hexes
          const hex = hexes[selectionHex.y][selectionHex.x]
          const start = [...selectionType.borderEdges]
          const final: Direction[] = []
          for (const b of start) {
            const loc = new Coordinate(selectionHex.x, selectionHex.y)
            const neighbor = scenario.map.neighborAt(loc, b)
            if (neighbor) {
              final.push(b)
              const other = hexes[neighbor.coord.y][neighbor.coord.x]
              if (other.be?.includes(normalDir(b+3))) {
                other.be = other.be.filter(d => d != normalDir(b+3))
                if (other.be.length < 1) {
                  delete other.b
                  delete other.be
                }
              }
            }
          }
          if (final.length < 1) {
            delete hex.b
            delete hex.be
          } else {
            hex.b = selectionType.border
            hex.be = final
          }
          return { ...s, metadata: { ...s.metadata, map_data: { ...s.metadata.map_data, hexes }}}
        })
      } else if (selectionType.set === "road") {
        setScenarioData(s => {
          const hexes = s.metadata.map_data.hexes
          const hex = hexes[selectionHex.y][selectionHex.x]
          if (selectionType.roadDirs.length > 1) {
            if (selectionType.roadCenter !== undefined) {
              if (selectionType.roadTurn !== 1) {
                hex.r = {
                  t: selectionType.road, d: [...selectionType.roadDirs], c: selectionType.roadCenter,
                  r: normalDir(selectionType.roadTurn - 1)
                }
              } else {
                hex.r = {
                  t: selectionType.road, d: [...selectionType.roadDirs], c: selectionType.roadCenter
                }
              }
            } else {
              hex.r = { t: selectionType.road, d: [...selectionType.roadDirs] }
            }
          } else {
            delete hex.r
          }
          return { ...s, metadata: { ...s.metadata, map_data: { ...s.metadata.map_data, hexes }}}
        })
      } else if (selectionType.set === "stream") {
        setScenarioData(s => {
          const hexes = s.metadata.map_data.hexes
          const hex = hexes[selectionHex.y][selectionHex.x]
          if (selectionType.streamDirs.length > 1) {
            hex.s = { t: selectionType.stream, d: [...selectionType.streamDirs] }
          } else {
            delete hex.s
          }
          return { ...s, metadata: { ...s.metadata, map_data: { ...s.metadata.map_data, hexes }}}
        })
      } else if (selectionType.set === "railroad") {
        setScenarioData(s => {
          const hexes = s.metadata.map_data.hexes
          const hex = hexes[selectionHex.y][selectionHex.x]
          const dirs: Direction[][] = []
          let found = false
          if (hex.rr) {
            for (const d of hex.rr.d) {
              if ((d[0] === selectionType.rrStart && d[1] === selectionType.rrEnd) ||
                  (d[1] === selectionType.rrStart && d[0] === selectionType.rrEnd)) {
                found = true
                if (selectionType.railroad !== "-") { dirs.push(d) }
              } else {
                dirs.push(d)
              }
            }
          }
          if (selectionType.railroad === "+" && !found) {
            dirs.push([selectionType.rrStart, selectionType.rrEnd])
          }
          if (dirs.length < 1) {
            delete hex.rr
          } else {
            hex.rr = { d: dirs }
          }
          return { ...s, metadata: { ...s.metadata, map_data: { ...s.metadata.map_data, hexes }}}
        })
      }
    } else if (tab === 3) {
      const player = Number(deploySelected[deploySelected.length - 1])
      const turn = Number(deploySelected.substring(1, deploySelected.length - 2))
      const mapData = scenarioData.metadata.map_data
      const hexes = player === 1 ? mapData.allied_setup :
        mapData.allied_setup
      if (hexes && hexes[turn]) {
        const newHexes = toggleHex(
          hexes[turn], selectionHex.x, selectionHex.y,
          mapData.layout[0] - 1, mapData.layout[1] - 1
        )
        setScenarioData(s => {
          return player === 1 ? {
            ...s, metadata: {
              ...s.metadata, map_data: {
                ...s.metadata.map_data, allied_setup: {
                  ...s.metadata.map_data.allied_setup, [turn]: newHexes,
                },
              }
            }
          } : {
            ...s, metadata: {
              ...s.metadata, map_data: {
                ...s.metadata.map_data, axis_setup: {
                  ...s.metadata.map_data.axis_setup, [turn]: newHexes,
                },
              }
            }
          }
        })
      }
    }
  }, [selectionHex])

  useEffect(() => {
    const s = new Scenario(scenarioData)
    getAPI("/api/v1/scenarios/all_units", {
      ok: response => response.json().then(json => {
        const allies: [string, string, UnitData][] = []
        const axis: [string, string, UnitData][] = []
        for (const id of Object.keys(json)) {
          const data = json[id]
          if (scenarioData.allies[0] === data.c) {
            allies.push([id, data.n, data])
          } else if (scenarioData.axis[0] === data.c) {
            axis.push([id, data.n, data])
          } else if (data.ft === 1 && !["smoke", "fire", "rubble"].includes(data.t)) {
            allies.push([id, data.n, data])
            axis.push([id, data.n, data])
          }
        }
        setAvailableAlliedUnits(allies)
        setAvailableAxisUnits(axis)
      })
    })
    setScenario(s)
    setSelectionType(s => {
      const layout = scenarioData.metadata.map_data.layout
      return { ...s, mapSize: `${layout[0]}x${layout[1]}` }
    })
    setDeploySelected("t0-1")
    setWidth(s.map.previewXSize * scale)
    setHeight(s.map.ySize * scale)
  }, [scenarioData])

  useEffect(() => {
    if (!scenario) { return }
    const hexLoader: JSX.Element[] = []
    const detailLoader: JSX.Element[] = []
    const victoryLoader: JSX.Element[] = []
    const overlayLoader: JSX.Element[] = []
    const map = scenario.map
    map.showCoords = false
    map.mapHexes.forEach((row, y) => {
      row.forEach((hex, x) => {
        hexLoader.push(<MapHex key={`${x}-${y}`} hex={hex} />)
        detailLoader.push(<MapHexDetail key={`${x}-${y}-d`} hex={hex} maxX={width / scale} maxY={height / scale}
                                        selectCallback={selectHex} showTerrain={false} terrainCallback={() => {}}
                                        svgRef={svgRef as React.MutableRefObject<HTMLElement>}
                                        scale={scale} />)
        const player = Number(deploySelected[deploySelected.length - 1])
        const turn = Number(deploySelected.substring(1, deploySelected.length - 2))
        const hexes = player === 1 ? map.alliedSetupHexes : map.axisSetupHexes
        const shaded = !!hexes && !!hexes[turn] && deployHex(hexes[turn], x, y)
        overlayLoader.push(<MapHexOverlay key={`${x}-${y}-o`} hex={hex} selectCallback={selectHex}
                                          shaded={shaded ? hexOpenType.Open : hexOpenType.FalseClosed } />)
        const vp = scenarioData.metadata.map_data.victory_hexes as [number, number, 1|2][]
        for (const v of vp) {
          if (v[0] === x && v[1] === y) {
            const xx = hex.xCorner(5, 20)
            const yy = hex.yCorner(5, 20)
            const victory = v[2] === 1 ? scenarioData.allies[0] : scenarioData.axis[0]
            const style = {
              fill: `url(#nation-${victory}-12)`, strokeWidth: 1, stroke: "#000"
            }
            victoryLoader.push(
              <circle key={`vp-${x}-${y}`} cx={xx} cy={yy} r={12} style={style}/>
            )
          }
        }
      })
    })
    setHexDisplay(hexLoader)
    setHexDisplayDetail(detailLoader)
    setVictoryDisplay(victoryLoader)
    setOverlayDisplay(overlayLoader)
  }, [scenario])

  useEffect(() => {
    if (!scenario) { return }
    const overlayLoader: JSX.Element[] = []
    const map = scenario.map
    map.showCoords = false
    map.mapHexes.forEach((row, y) => {
      row.forEach((hex, x) => {
        const player = Number(deploySelected[deploySelected.length - 1])
        const turn = Number(deploySelected.substring(1, deploySelected.length - 2))
        const hexes = player === 1 ? map.alliedSetupHexes : map.axisSetupHexes
        const shaded = !!hexes && !!hexes[turn] && deployHex(hexes[turn], x, y)
        overlayLoader.push(<MapHexOverlay key={`${x}-${y}-o`} hex={hex} selectCallback={selectHex}
                                          shaded={shaded} />)
      })
    })
    setOverlayDisplay(overlayLoader)
  }, [deploySelected])

  const mapDisplay = () => {
    if (!scenario) { return <></> }
    return (
      <svg ref={svgRef as React.LegacyRef<SVGSVGElement>}
           className="map-svg ml05em mr05em" width={width} height={height}
           viewBox={`0 0 ${width / scale} ${height / scale}`}>
        <path d={roundedRectangle(0, 0, width / scale, height / scale, 10 / scale)}
              style={{fill: "#BBB"}} />
        <MapHexPatterns map={scenario.map} />
        {hexDisplay}
        {hexDisplayDetail}
        {victoryDisplay}
        {tab === 3 ? overlayDisplay : ""}
      </svg>
    )
  }

  return (
    <div className="main-page">
      <Header />
      <div className="game-control ml05em mt05em mr05em">
        <div className="red monospace ml05em mr05em">
          {scenario.code}:
        </div>
        <div className="green nowrap">
          {scenario.name}
        </div>
        <div className="flex-fill"></div>
      </div>
      <div className="flex ml05em mt05em">
        <div>
          <div className="main-page-list-tabs">
            <div onClick={() => setTab(1)} className={
                   `bold main-page-list-tab ` +
                   `main-page-list-tab-${tab === 1 ? "" : "un" }selected`
                 }>
              Data
            </div>
            <div onClick={() => setTab(2)} className={
                   `bold main-page-list-tab ` +
                   `main-page-list-tab-${tab === 2 ? "" : "un" }selected`
                 }>
              Map
            </div>
            <div onClick={() => setTab(3)} className={
                   `bold main-page-list-tab ` +
                   `main-page-list-tab-${tab === 3 ? "" : "un" }selected`
                 }>
              OOB
            </div>
            <div onClick={() => setTab(4)} className={
                   `bold main-page-list-tab ` +
                   `main-page-list-tab-${tab === 4 ? "" : "un" }selected`
                 }>
              File
            </div>
          </div>
          <div className="designer-section" style={{ minHeight: window.innerHeight - 182 }}>
            { tab === 1 ? <DesignerDataTab scenarioData={scenarioData} setScenarioData={setScenarioData} /> : "" }
            { tab === 2 ? <DesignerMapTab scenarioData={scenarioData} resizeMapCallback={resizeMap}
                                          selectionType={selectionType}
                                          setSelectionType={setSelectionType} /> : ""}
            { tab === 3 ? <DesignerOrderOfBattleTab scenarioData={scenarioData}
                                                    setScenarioData={setScenarioData}
                                                    deploySelected={deploySelected}
                                                    setDeploySelected={setDeploySelected}
                                                    availableAlliedUnits={availableAlliedUnits}
                                                    availableAxisUnits={availableAxisUnits} /> : ""}
            { tab === 4 ? <DesignerFileTab resetCacheCallback={resetCache} scenarioData={scenarioData}
                                           setScenarioData={setScenarioData}
                                           setScale={setScale} setTab={setTab}/> : "" }
          </div>
        </div>
        <div className="flex-vertical">
          { mapDisplay() }
        </div>
      </div>
    </div>
  )
}
