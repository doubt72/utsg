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
import { BorderType, BuildingShape, BuildingStyle, Coordinate, Direction, ExtendedDirection, RoadCenterType, RoadType, StreamType, TerrainType } from "../utilities/commonTypes";

export function defaultScenario(): ScenarioData {
  return structuredClone({
    id: "000", name: "blank scenario", status: "p", version: "0.1",
    allies: ["ussr"], axis: ["ger"], metadata: {
      author: "nobody", date: [1939, 1, 1], location: "nowhere", turns: 5,
      first_action: 1, first_deploy: 2, allied_units: [], axis_units: [],
      description: ["no description yet"], special_rules: [], map_data: {
        layout: [15, 11, "x"], allied_dir: 1, axis_dir: 1, victory_hexes: [],
        allied_setup: {}, axis_setup: {}, base_terrain: "g", night: false,
        start_weather: "dry", base_weather: "dry", precip: [0, "rain"], wind: [1, 1, false],
        hexes: Array(11).fill(Array(15).fill({ t: "o" }))
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
  set: "vp" | "terrain" | "building" | "border" | "road" | "stream" | "railroad",
  terrain: TerrainType,
  elevation: number,
  building: BuildingShape,
  buildStyle: BuildingStyle,
  border: BorderType,
  borderEdges: number[],
  road: RoadType,
  roadDirs: number[],
  roadCenter?: RoadCenterType,
  roadTurn: Direction,
  stream: StreamType,
  streamDirs: number[],
  railroad: "+" | "-",
  rrStart: Direction,
  rrEnd: Direction,
  dir: Direction,
}

export default function ScenarioDesigner() {
  const [scenarioData, setScenarioData] = useState<ScenarioData>(defaultScenario())
  const [scenario, setScenario] = useState<Scenario>(new Scenario(defaultScenario()))

  const [selectionType, setSelectionType] = useState<SelectionType>({
    set: "vp", terrain: "o", elevation: 0, dir: 1, building: "l", buildStyle: "f", border: "f", borderEdges: [],
    road: "t", roadDirs: [], roadTurn: 1, stream: "s", streamDirs: [], railroad: "+", rrStart: 1, rrEnd: 4,
  })
  const [selectionHex, setSelectionHex] = useState<{ x: number, y: number, n: number }>({ x: 0, y: 0, n: -1 })

  const [tab, setTab] = useState<number>(1)

  const [hexDisplay, setHexDisplay] = useState<JSX.Element[]>([])
  const [hexDisplayDetail, setHexDisplayDetail] = useState<JSX.Element[]>([])
  const [victoryDisplay, setVictoryDisplay] = useState<JSX.Element[]>([])

  const [scale, setScale] = useState<number>(0.45)
  const [width, setWidth] = useState<number>(1)
  const [height, setHeight] = useState<number>(1)

  const svgRef = useRef<HTMLElement | SVGSVGElement>()

  const selectHex = (x: number, y: number) => {
    setSelectionHex(s => {
      return { x, y, n: s.n + 1}
    })
  }

  useEffect(() => {
    if (selectionHex.n < 0) { return }
    console.log(`selected ${selectionHex.x},${selectionHex.y}`)
    if (tab === 2) {
      console.log(selectionType)
    }
  }, [selectionHex])

  useEffect(() => {
    const s = new Scenario(scenarioData)
    setScenario(s)
    setWidth(s.map.previewXSize * scale)
    setHeight(s.map.ySize * scale)
  }, [scenarioData])

  useEffect(() => {
    if (!scenario) { return }
    const hexLoader: JSX.Element[] = []
    const detailLoader: JSX.Element[] = []
    const victoryLoader: JSX.Element[] = []
    const map = scenario.map
    map.showCoords = false
    map.mapHexes.forEach((row, y) => {
      row.forEach((hex, x) => {
        hexLoader.push(<MapHex key={`${x}-${y}`} hex={hex} />)
        detailLoader.push(<MapHexDetail key={`${x}-${y}-d`} hex={hex} maxX={width / scale} maxY={height / scale}
                                        selectCallback={selectHex} showTerrain={false} terrainCallback={() => {}}
                                        svgRef={svgRef as React.MutableRefObject<HTMLElement>}
                                        scale={scale} />)
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
  }, [scenario])

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
            { tab === 2 ? <DesignerMapTab selectionType={selectionType} setSelectionType={setSelectionType} /> : ""}
            { tab === 3 ?
              <div>
              </div> : ""}
            { tab === 4 ? <DesignerFileTab scenarioData={scenarioData} setScenarioData={setScenarioData}
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

// layout
// paint hexes
//   max-sized cache
// victory hexes

// allied units
//   allied setup
//   turn cache
// axis units
//   axis setup
//   turn cache
