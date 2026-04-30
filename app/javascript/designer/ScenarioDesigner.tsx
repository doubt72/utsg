import React, { useEffect, useRef, useState } from "react";
import Header from "../components/Header";
import { getAPI } from "../utilities/network";
import Scenario, { ScenarioData } from "../engine/Scenario";
import { hexPath, iconSymbols, roundedRectangle } from "../utilities/graphics";
import MapHex from "../components/game/map/MapHex";
import MapHexDetail from "../components/game/map/MapHexDetail";
import MapHexPatterns from "../components/game/map/MapHexPatterns";
import { alliedCodeToName, axisCodeToName } from "../utilities/utilities";
import { Coordinate, ExtendedDirection } from "../utilities/commonTypes";

function defaultScenario(): ScenarioData {
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

export default function ScenarioDesigner() {
  const [scenarioList, setScenarioList] = useState<string[]>([])
  const [scenarioData, setScenarioData] = useState<ScenarioData>(defaultScenario())
  const [scenario, setScenario] = useState<Scenario>(new Scenario(defaultScenario()))

  const [tab, setTab] = useState<number>(1)

  const [hexDisplay, setHexDisplay] = useState<JSX.Element[]>([])
  const [hexDisplayDetail, setHexDisplayDetail] = useState<JSX.Element[]>([])
  const [victoryDisplay, setVictoryDisplay] = useState<JSX.Element[]>([])

  const [scale, setScale] = useState<number>(0.45)
  const [width, setWidth] = useState<number>(1)
  const [height, setHeight] = useState<number>(1)

  const proto = localStorage.getItem("proto") === "true"
  const svgRef = useRef<HTMLElement | SVGSVGElement>()

  useEffect(() => {
    setScale(0.45)
    const url = `/api/v1/scenarios?page=0&page_size=999&status=${ proto ? "p*" : "*"}`
    getAPI(url, {
      ok: response => {
        response.json().then(json => {
          setScenarioList(json.data.map((a: { id: string }) => a.id))
        })
      }
    })
  }, [])

  const loadScenario = (id: string) => {
    if (id === "") {
      setScenarioData(defaultScenario())
      return
    }
    const url = `/api/v1/scenarios/${id}`
    getAPI(url, {
      ok: response => {
        response.json().then(json => {
          setScenarioData(json)
        })
      }
    })
  }

  const download = () => {
    const jsonString = JSON.stringify(scenarioData)
    const blob = new Blob([jsonString], { type: "application/json" })

    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `scenario_${scenarioData.id}.json`

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

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
                                        selectCallback={() => {}} showTerrain={false} terrainCallback={() => {}}
                                        svgRef={svgRef as React.MutableRefObject<HTMLElement>}
                                        scale={scale} />)
        const vp = scenarioData.metadata.map_data.victory_hexes as [number, number, 1|2][]
        const loc = hex.coord as Coordinate
        for (const v of vp) {
          if (v[0] === loc.x && v[1] === loc.y) {
            const x = hex.xCorner(5, 20)
            const y = hex.yCorner(5, 20)
            const victory = v[2] === 1 ? scenarioData.allies[0] : scenarioData.axis[0]
            const style = {
              fill: `url(#nation-${victory}-12)`, strokeWidth: 1, stroke: "#000"
            }
            victoryLoader.push(
              <circle cx={x} cy={y} r={12} style={style}/>
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

  const showHex = (dir: ExtendedDirection): JSX.Element => {
    return (
      <svg className="" width={32} height={32}
           viewBox="0 0 32 32">
        <path d={ hexPath(new Coordinate(16, 16), 15, true) }
              style={{ fill: "#FFF", stroke: "#AAA", strokeWidth: 2 }}/>
        <g transform={`rotate(${(dir-1)*60} 16 16)`}>
          <path d="M 4 16 L 18 10 L 18 22 Z"
                style={{ strokeWidth: 0, fill: "#666" }} />
        </g>
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
              File
            </div>
            <div onClick={() => setTab(2)} className={
                   `bold main-page-list-tab ` +
                   `main-page-list-tab-${tab === 2 ? "" : "un" }selected`
                 }>
              Data
            </div>
            <div onClick={() => setTab(3)} className={
                   `bold main-page-list-tab ` +
                   `main-page-list-tab-${tab === 3 ? "" : "un" }selected`
                 }>
              Map
            </div>
            <div onClick={() => setTab(4)} className={
                   `bold main-page-list-tab ` +
                   `main-page-list-tab-${tab === 4 ? "" : "un" }selected`
                 }>
              OOB
            </div>
          </div>
          <div className="designer-section" style={{ minHeight: window.innerHeight - 182 }}>
            { tab === 1 ?
              <div>
                <div>
                  load from server scenario:
                </div>
                <div className="flex">
                  <form>
                    <select name="scenario" className="designer-input" onChange={({ target }) => loadScenario(target.value)}>
                      <option value="">---</option>
                      { scenarioList.sort().map(sel =>
                          <option key={sel} value={sel}>{sel}</option>
                        )}
                    </select>
                  </form>
                  <div className="flex-fill"></div>
                </div>
                <div className="mt1em">
                  load from file:
                </div>
                <div>
                  <form>
                    <input type="file" className="form-input"
                      name="upload"
                      onChange={({ target }) => {
                        if (!target.files) { return }
                        const file = target.files[0]
                        if (!file) { return }

                        const reader = new FileReader();
                        reader.onload = (e) => {
                          try {
                            const jsonData = JSON.parse(e.target?.result as string);
                            setScenarioData(jsonData)
                          } catch (err) {
                            console.error('Invalid JSON:', err);
                          }
                        };
                        reader.readAsText(file);
                        setTab(2)
                      }} />
                  </form>
                </div>
                <div className="mt1em">
                  save to file:
                </div>
                <div>
                  <span className="slim-button" onClick={() => download()}
                        style={{ padding: "0.15em 0.5em 0.25em" }}>
                    save
                  </span>
                </div>
              </div> : "" }
            { tab === 2 ?
              <form>
                <div className="flex mb05em">
                  <div style={{width: "60px"}}>
                    <label className="design-label">id</label>
                    <input type="text" className="form-input"
                      name="id"
                      value={scenarioData.id}
                      onChange={({ target }) => setScenarioData(s =>
                        { return { ...s, id: target.value } }
                      )} />
                  </div>
                  <div className="ml1em" style={{width: "400px"}}>
                    <label className="design-label">name</label>
                    <input type="text" className="form-input"
                      name="name"
                      value={scenarioData.name}
                      onChange={({ target }) => setScenarioData(s =>
                        { return { ...s, name: target.value } }
                      )} />
                  </div>
                </div>
                <div className="flex mb05em">
                  <div style={{width: "200px"}}>
                    <label className="design-label">author</label>
                    <input type="text" className="form-input"
                      name="author"
                      value={scenarioData.metadata.author}
                      onChange={({ target }) => setScenarioData(s =>
                        { return { ...s, metadata: { ...s.metadata, author: target.value }} }
                      )} />
                  </div>
                </div>
                <div className="flex mb05em">
                  <div style={{width: "60px"}}>
                    <label className="design-label">version</label>
                    <input type="text" className="form-input"
                      name="version"
                      value={scenarioData.version}
                      onChange={({ target }) => setScenarioData(s =>
                        { return { ...s, version: target.value } }
                      )} />
                  </div>
                  <div className="ml1em" style={{width: "120px"}}>
                    <label className="design-label">status</label>
                    <select name="status" value={scenarioData.status} className="form-input"
                            onChange={({ target }) => setScenarioData(s =>
                              { return { ...s, status: target.value } }
                            )} >
                      <option value="">ready</option>
                      <option value="b">beta</option>
                      <option value="a">alpha</option>
                      <option value="p">prototype</option>
                    </select>
                  </div>
                  <div className="ml1em" style={{width: "80px"}}>
                    <label className="design-label">year</label>
                    <select name="year" value={scenarioData.metadata.date[0]} className="form-input"
                            onChange={({ target }) => setScenarioData(s =>
                              { return { ...s, metadata: {
                                ...s.metadata, date: [Number(target.value), s.metadata.date[1], s.metadata.date[2]],
                              }} }
                            )} >
                      { Array.from(Array(50).keys()).map(i => <option key={i} value={i+1920}>{i+1920}</option>) }
                    </select>
                  </div>
                  <div className="ml1em" style={{width: "60px"}}>
                    <label className="design-label">month</label>
                    <select name="month" value={scenarioData.metadata.date[1]} className="form-input"
                            onChange={({ target }) => setScenarioData(s =>
                              { return { ...s, metadata: {
                                ...s.metadata, date: [s.metadata.date[0], Number(target.value), s.metadata.date[2]],
                              }} }
                            )} >
                      { Array.from(Array(12).keys()).map(i => <option key={i} value={i+1}>{i+1}</option>) }
                    </select>
                  </div>
                  <div className="ml1em" style={{width: "60px"}}>
                    <label className="design-label">day</label>
                    <select name="day" value={scenarioData.metadata.date[2]} className="form-input"
                            onChange={({ target }) => setScenarioData(s =>
                              { return { ...s, metadata: {
                                ...s.metadata, date: [s.metadata.date[0], s.metadata.date[1], Number(target.value)],
                              }} }
                            )} >
                      { Array.from(Array(31).keys()).map(i => <option key={i} value={i+1}>{i+1}</option>) }
                    </select>
                  </div>
                </div>
                <div className="flex mb05em">
                  <div style={{width: "400px"}}>
                    <label className="design-label">location</label>
                    <input type="text" className="form-input"
                      name="location"
                      value={scenarioData.metadata.location}
                      onChange={({ target }) => setScenarioData(s =>
                        { return { ...s, metadata: { ...s.metadata, location: target.value }} }
                      )} />
                  </div>
                </div>
                <div style={{width: "480px"}}>
                  <label className="design-label">description</label>
                </div>
                { scenarioData.metadata.description.map((d, i) =>
                  <div key={i} className="flex mb05em" style={{width: "480px"}} >
                    <div className="flex-vertical">
                      <span className="slim-button">{iconSymbols("no")}</span>
                      <div className="flex-fill"></div>
                    </div>
                    <textarea className="form-input-text"
                      name={`description-${i}`}
                      value={scenarioData.metadata.description[i].replace(/[\n\r\t]/gm, "").replace(/\s+/gm, " ")}
                      onChange={({ target }) => target.value} />
                  </div>
                )}
                <div className="flex mb05em" style={{width: 480, height: "1.8em"}}>
                  <div className="flex-fill"></div>
                  <span className="slim-button">+</span>
                </div>
                <div className="flex mb05em">
                  <div style={{width: "150px"}}>
                    <label className="design-label">player one</label>
                    <select name="allies" value={scenarioData.allies[0]} className="form-input"
                            onChange={({ target }) => target.value} >
                      { [
                          "ussr", "usa", "bra", "uk", "can", "aus", "nz", "ind", "sa", "fra", "frf", "chi",
                          "pol", "gre", "nor", "bel", "dut", "yug",
                        ].map(n => <option key={n} value={n}>{alliedCodeToName(n)}</option>) }
                    </select>
                  </div>
                  <div className="ml1em" style={{width: "70px"}}>
                    <label className="design-label">adv</label>
                    <br />
                    { showHex(scenarioData.metadata.map_data.allied_dir) }
                    : { scenarioData.metadata.map_data.allied_dir }
                  </div>
                  <div className="ml1em" style={{width: "150px"}}>
                    <label className="design-label">player two</label>
                    <select name="axis" value={scenarioData.axis[0]} className="form-input"
                            onChange={({ target }) => target.value} >
                      { [
                          "ger", "ita", "jap", "fin", "hun", "bul", "rom", "slo", "cro",
                        ].map(n => <option key={n} value={n}>{axisCodeToName(n)}</option>) }
                    </select>
                  </div>
                  <div className="ml1em" style={{width: "70px"}}>
                    <label className="design-label">adv</label>
                    <br />
                    { showHex(scenarioData.metadata.map_data.axis_dir) }
                    : { scenarioData.metadata.map_data.axis_dir }
                  </div>
                </div>
                <div className="flex mb05em">
                  <div style={{width: "130px"}}>
                    <label className="design-label">first deploy</label>
                    <select name="allies" value={scenarioData.metadata.first_deploy} className="form-input"
                            onChange={({ target }) => target.value} >
                      <option value={1}>player one</option>
                      <option value={2}>player two</option>
                    </select>
                  </div>
                  <div className="ml1em" style={{width: "130px"}}>
                    <label className="design-label">initiative</label>
                    <select name="axis" value={scenarioData.metadata.first_action} className="form-input"
                            onChange={({ target }) => target.value} >
                      <option value={1}>player one</option>
                      <option value={2}>player two</option>
                    </select>
                  </div>
                  <div className="ml1em" style={{width: "60px"}}>
                    <label className="design-label">turns</label>
                    <select name="turns" value={scenarioData.metadata.turns} className="form-input"
                            onChange={({ target }) => target.value} >
                      { Array.from(Array(30).keys()).map(i => <option key={i} value={i+1}>{i+1}</option>) }
                    </select>
                  </div>
                </div>
                <div className="flex mb05em">
                  <div style={{width: "480px"}}>
                    <label className="design-label">special rules</label>
                    <select name="allies" value={scenarioData.metadata.special_rules} className="form-input"
                            onChange={({ target }) => target.value} multiple >
                      <option value={"allied_green_armor"}>green allied armor</option>
                      <option value={"axis_green_armor"}>green axis armor</option>
                      <option value={"allied_elite_armor"}>elite allied armor</option>
                      <option value={"axis_elite_armor"}>elite axis armor</option>
                      <option value={"allied_fragile_vehicles"}>increased allied breakdowns</option>
                      <option value={"axis_fragile_vehicles"}>increased axis breakdowns</option>
                      <option value={"allied_ignore_snow"}>no snow movement penalties for allies</option>
                      <option value={"axis_ignore_snow"}>no snow movement penalties for axis</option>
                      <option value={"winter"}>winter: no digging in, water as open for infantry</option>
                      <option value={"retreat_301"}>allies rout up below 5, otherwise down, reverse for axis</option>
                    </select>
                  </div>
                </div>
                <div className="flex mb05em">
                  <div style={{width: "90px"}}>
                    <label className="design-label">base</label>
                    <select name="allies" value={scenarioData.metadata.map_data.base_terrain} className="form-input"
                            onChange={({ target }) => target.value} >
                      <option value={"g"}>grass</option>
                      <option value={"u"}>urban</option>
                      <option value={"s"}>snow</option>
                      <option value={"d"}>sand</option>
                      <option value={"m"}>mud</option>
                    </select>
                  </div>
                  <div className="ml1em" style={{width: "80px"}}>
                    <label className="design-label">time</label>
                    <select name="axis" value={String(scenarioData.metadata.map_data.night)} className="form-input"
                            onChange={({ target }) => target.value} >
                      <option value={"false"}>day</option>
                      <option value={"true"}>night</option>
                    </select>
                  </div>
                  <div className="ml1em" style={{width: "100px"}}>
                    <label className="design-label">wind</label>
                    <select name="axis" value={scenarioData.metadata.map_data.wind[0]} className="form-input"
                            onChange={({ target }) => target.value} >
                      <option value={1}>calm</option>
                      <option value={2}>breeze</option>
                      <option value={3}>moderate</option>
                      <option value={4}>strong</option>
                    </select>
                  </div>
                  <div className="ml1em" style={{width: "70px"}}>
                    <label className="design-label">var</label>
                    <select name="axis" value={String(scenarioData.metadata.map_data.wind[2])} className="form-input"
                            onChange={({ target }) => target.value} >
                      <option value={"false"}>no</option>
                      <option value={"true"}>yes</option>
                    </select>
                  </div>
                  <div className="ml1em" style={{width: "70px"}}>
                    <label className="design-label">dir</label>
                    <br />
                    { showHex(scenarioData.metadata.map_data.wind[1]) }
                    : { scenarioData.metadata.map_data.wind[1] }
                  </div>
                </div>
                <div className="flex mb05em">
                  <div  style={{width: "80px"}}>
                    <label className="design-label">weather</label>
                    <select name="axis" value={scenarioData.metadata.map_data.base_weather} className="form-input"
                            onChange={({ target }) => target.value} >
                      <option value={"dry"}>dry</option>
                      <option value={"fog"}>fog</option>
                      <option value={"rain"}>rain</option>
                      <option value={"snow"}>snow</option>
                      <option value={"dust"}>dust</option>
                      <option value={"sand"}>sand</option>
                    </select>
                  </div>
                  <div className="ml1em" style={{width: "80px"}}>
                    <label className="design-label">precip</label>
                    <select name="axis" value={scenarioData.metadata.map_data.precip[1]} className="form-input"
                            onChange={({ target }) => target.value} >
                      <option value={"dry"}>dry</option>
                      <option value={"fog"}>fog</option>
                      <option value={"rain"}>rain</option>
                      <option value={"snow"}>snow</option>
                      <option value={"dust"}>dust</option>
                      <option value={"sand"}>sand</option>
                    </select>
                  </div>
                  <div className="ml1em" style={{width: "60px"}}>
                    <label className="design-label">%</label>
                    <select name="axis" value={scenarioData.metadata.map_data.precip[0]} className="form-input"
                            onChange={({ target }) => target.value} >
                      { Array.from(Array(10).keys()).map(i => <option key={i} value={i}>{i*10}</option>) }
                    </select>
                  </div>
                  <div className="ml1em" style={{width: "80px"}}>
                    <label className="design-label">current</label>
                    <select name="axis" value={scenarioData.metadata.map_data.start_weather} className="form-input"
                            onChange={({ target }) => target.value} >
                      <option value={"dry"}>dry</option>
                      <option value={"fog"}>fog</option>
                      <option value={"rain"}>rain</option>
                      <option value={"snow"}>snow</option>
                      <option value={"dust"}>dust</option>
                      <option value={"sand"}>sand</option>
                    </select>
                  </div>
                </div>
              </form> : "" }
          </div>
        </div>
        <div className="flex-vertical">
          { mapDisplay() }
        </div>
      </div>
    </div>
  )
}

// Enable editing
// Functional tabs

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
