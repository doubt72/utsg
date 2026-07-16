import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
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
import { minorToMajor, normalDir } from "../utilities/utilities";
import DesignerOrderOfBattleTab from "./DesignerOrderOfBattleTab";
import { getAPI } from "../utilities/network";
import { UnitData } from "../engine/Unit";
import { deployHex, toggleHex } from "../engine/control/deploy";
import MapHexOverlay from "../components/game/map/MapHexOverlay";
import { DeployHexes } from "../engine/Map";
import { FeatureData } from "../engine/Feature";

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

export function pushDesignStack(
  data: ScenarioData, setData: Dispatch<SetStateAction<DesignStack>>
): void {
  setData(s => {
    const oldData = s.data.slice(0, s.index + 1)
    if (oldData.length > 20) { oldData.shift() }
    return { data: [...oldData, data], index: oldData.length }
  })
}

export type DesignStack = {
  data: ScenarioData[],
  index: number,
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
  const [designStack, setDesignStack] = useState<DesignStack>({
    data: [defaultScenario()], index: 0
  })
  const [scenario, setScenario] = useState<Scenario>(new Scenario(defaultScenario()))
  const [hexCache, setHexCache] = useState<HexData[][]>([])
  const [vpCache, setVpCache] = useState<[number, number, 1 | 2][]>([])

  const [allUnits, setAllUnits] = useState<{ [index: string]: UnitData | FeatureData }>({})

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

  const [availableAlliedUnits, setAvailableAlliedUnits] = useState<[string, string, UnitData | FeatureData][]>([])
  const [availableAxisUnits, setAvailableAxisUnits] = useState<[string, string, UnitData | FeatureData][]>([])

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
    setDeploySelected("t0-1")
    setHexCache([])
    setVpCache([])
  }

  const resizeMap = (x: number, y: number) => {
    const data = designStack.data[designStack.index]
    const metadata = data.metadata
    const oldData = metadata.map_data
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
    const hexData: HexData[][] = []
    for (let yy = 0; yy < y; yy++) {
      hexData.push([])
      for (let xx = 0; xx < x; xx++) { hexData[yy].push(cache[yy][xx]) }
    }
    setHexCache(cache)
    const vps: [number, number, 1 | 2][] = []
    for (const vp of vpCache) { vps.push(vp) }
    for (const vp of metadata.map_data.victory_hexes ?? []) {
      let found = false
      for (const ovp of vpCache) {
        if (vp[0] === ovp[0] && vp[1] === ovp[1]) { found = true; break }
      }
      if (!found) { vps.push(vp) }
    }
    setVpCache(vps)
    pushDesignStack(
      {
        ...data, metadata: { ...metadata, map_data:  {
          ...metadata.map_data, layout: [x, y, "x"], hexes: hexData,
          victory_hexes: vps.filter(vp => vp[0] < x && vp[1] < y),
        }}
      }, setDesignStack
    )
  }

  useEffect(() => {
    getAPI("/api/v1/scenarios/all_units", {
      ok: response => response.json().then(json => {
        setAllUnits(json)
      })
    })
  }, [])

  useEffect(() => {
    const data = designStack.data[designStack.index]
    const metadata = data.metadata
    if (selectionHex.n < 0) { return }
    if (tab === 2) {
      const hexes = structuredClone(metadata.map_data.hexes)
      const hex = hexes[selectionHex.y][selectionHex.x]
      if (selectionType.set === "vp") {
        resetCache()
        const vps: [number, number, 1 | 2][] = []
        let found = false;
        for (const vp of metadata.map_data.victory_hexes as [number, number, 1 | 2][]) {
          if (vp[0] === selectionHex.x && vp[1] === selectionHex.y) {
            found = true
            if (vp[2] === 1) { vps.push([vp[0], vp[1], 2]) }
          } else {
            vps.push(vp)
          }
        }
        if (!found) { vps.push([selectionHex.x, selectionHex.y, 1])}
        pushDesignStack(
          { ...data, metadata: { ...metadata, map_data: { ...metadata.map_data, victory_hexes: vps }}},
          setDesignStack
        )
      } else if (selectionType.set === "terrain") {
        delete hex.st
        hex.t = selectionType.terrain
        if (hex.t === "d") { hex.d = selectionType.dir } else { delete hex.d }
        pushDesignStack(
          { ...data, metadata: { ...metadata, map_data: { ...metadata.map_data, hexes }}},
          setDesignStack
        )
      } else if (selectionType.set === "elevation") {
        if ((hex.h ?? 0) !== selectionType.elevation) {
          if (selectionType.elevation !== 0) {
            hex.h = selectionType.elevation
          } else {
            delete hex.h
          }
        }
        pushDesignStack(
          { ...data, metadata: { ...metadata, map_data: { ...metadata.map_data, hexes }}},
          setDesignStack
        )
      } else if (selectionType.set === "building") {
        hex.t = "o"
        hex.st = { sh: selectionType.building, s: selectionType.buildStyle }
        hex.d = selectionType.dir
        pushDesignStack(
          { ...data, metadata: { ...metadata, map_data: { ...metadata.map_data, hexes }}},
          setDesignStack
        )
      } else if (selectionType.set === "border") {
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
        pushDesignStack(
          { ...data, metadata: { ...metadata, map_data: { ...metadata.map_data, hexes }}},
          setDesignStack
        )
      } else if (selectionType.set === "road") {
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
        pushDesignStack(
          { ...data, metadata: { ...metadata, map_data: { ...metadata.map_data, hexes }}},
          setDesignStack
        )
      } else if (selectionType.set === "stream") {
        if (selectionType.streamDirs.length > 1) {
          hex.s = { t: selectionType.stream, d: [...selectionType.streamDirs] }
        } else {
          delete hex.s
        }
        pushDesignStack(
          { ...data, metadata: { ...metadata, map_data: { ...metadata.map_data, hexes }}},
          setDesignStack
        )
      } else if (selectionType.set === "railroad") {
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
        pushDesignStack(
          { ...data, metadata: { ...metadata, map_data: { ...metadata.map_data, hexes }}},
          setDesignStack
        )
      }
    } else if (tab === 3) {
      const player = Number(deploySelected[deploySelected.length - 1])
      const turn = Number(deploySelected.substring(1, deploySelected.length - 2))
      const mapData = data.metadata.map_data
      const hexes = player === 1 ? mapData.allied_setup :
        mapData.axis_setup
      let turnHexes: DeployHexes = []
      if (hexes && hexes[turn]) {
        turnHexes = hexes[turn]
      }
      const newHexes = toggleHex(
        turnHexes, selectionHex.x, selectionHex.y,
        mapData.layout[0] - 1, mapData.layout[1] - 1
      )
      pushDesignStack(
        player === 1 ? {
          ...data, metadata: {
            ...metadata, map_data: {
              ...metadata.map_data, allied_setup: {
                ...metadata.map_data.allied_setup, [turn]: newHexes,
              },
            }
          }
        } : {
          ...data, metadata: {
            ...metadata, map_data: {
              ...metadata.map_data, axis_setup: {
                ...metadata.map_data.axis_setup, [turn]: newHexes,
              },
            }
          }
        }, setDesignStack
      )
    }
  }, [selectionHex])

  useEffect(() => {
    const data = designStack.data[designStack.index]
    const s = new Scenario(data)
    const allies: [string, string, UnitData | FeatureData][] = []
    const axis: [string, string, UnitData | FeatureData][] = []
    for (const id of Object.keys(allUnits)) {
      const unit = allUnits[id] as UnitData
      const feature = allUnits[id] as FeatureData
      if (minorToMajor(data.allies[0]) === unit.c) {
        allies.push([id, unit.n, unit])
      } else if (minorToMajor(data.axis[0]) === unit.c) {
        axis.push([id, unit.n, unit])
      } else if (feature.ft === 1 && !["smoke", "fire", "rubble"].includes(feature.t)) {
        allies.push([id, feature.n, feature])
        axis.push([id, feature.n, feature])
      }
    }
    setAvailableAlliedUnits(allies)
    setAvailableAxisUnits(axis)
    setScenario(s)
    setSelectionType(s => {
      const layout = data.metadata.map_data.layout
      return { ...s, mapSize: `${layout[0]}x${layout[1]}` }
    })
    setWidth(s.map.previewXSize)
    setHeight(s.map.ySize)
  }, [designStack.index, designStack.data[0], allUnits])

  useEffect(() => {
    if (!scenario) { return }
    const data = designStack.data[designStack.index]
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
        const vp = data.metadata.map_data.victory_hexes as [number, number, 1|2][]
        for (const v of vp) {
          if (v[0] === x && v[1] === y) {
            const xx = hex.xCorner(5, 20)
            const yy = hex.yCorner(5, 20)
            const victory = v[2] === 1 ? data.allies[0] : data.axis[0]
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
  }, [scenario, scale])

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
                                          shaded={shaded ? hexOpenType.Open : hexOpenType.FalseClosed } />)
      })
    })
    setOverlayDisplay(overlayLoader)
  }, [deploySelected])

  const mapDisplay = () => {
    if (!scenario) { return <></> }
    return (
      <svg ref={svgRef as React.LegacyRef<SVGSVGElement>}
           className="map-svg ml05em mr05em" width={width * scale} height={height * scale}
           viewBox={`0 0 ${width} ${height}`}>
        <path d={roundedRectangle(0, 0, width, height, 10)}
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
      <div className="flex">
        <div className="design-button ml05em mt05em" onClick={() => {
               if (designStack.index > 0) {
                 setDesignStack(s => { return { data: s.data, index: s.index - 1 } } )
               }
             }} style={{ padding: "0.15em 0.5em 0.25em" }}>
          undo ({designStack.index})
        </div>
        <div className="design-button ml05em mt05em" onClick={() => {
               if (designStack.index < designStack.data.length - 1) {
                 setDesignStack(s => { return { data: s.data, index: s.index + 1 } } )
               }
             }} style={{ padding: "0.15em 0.5em 0.25em" }}>
          redo ({designStack.data.length - designStack.index - 1})
        </div>
        <div className="game-control ml05em mt05em mr05em flex-fill">
          <div className="red monospace ml05em mr05em">
            {scenario.code}:
          </div>
          <div className="green nowrap">
            {scenario.name}
          </div>
          <div className="flex-fill"></div>
        </div>
        <div className="design-button mr05em mt05em" onClick={() => {
               setScale(s => Math.min(s*1.305, 1))
             }} style={{ padding: "0.15em 0.5em 0.25em" }}>
          map +
        </div>
        <div className="design-button mr05em mt05em" onClick={() => {
               setScale(s => Math.max(s/1.305, 0.264))
             }} style={{ padding: "0.15em 0.5em 0.25em" }}>
          map -
        </div>
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
            { tab === 1 ? <DesignerDataTab designStack={designStack} setDesignStack={setDesignStack} /> : "" }
            { tab === 2 ? <DesignerMapTab designStack={designStack} resizeMapCallback={resizeMap}
                                          selectionType={selectionType}
                                          setSelectionType={setSelectionType} /> : ""}
            { tab === 3 ? <DesignerOrderOfBattleTab designStack={designStack}
                                                    setDesignStack={setDesignStack}
                                                    deploySelected={deploySelected}
                                                    setDeploySelected={setDeploySelected}
                                                    availableAlliedUnits={availableAlliedUnits}
                                                    availableAxisUnits={availableAxisUnits} /> : ""}
            { tab === 4 ? <DesignerFileTab resetCacheCallback={resetCache} designStack={designStack}
                                           setDesignStack={setDesignStack}
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
