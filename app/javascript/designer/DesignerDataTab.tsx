import React, { Dispatch, SetStateAction } from "react";
import { ScenarioData } from "../engine/Scenario";
import { BaseTerrainType, Coordinate, ExtendedDirection, Player, WeatherType, WindType } from "../utilities/commonTypes";
import { hexPath, iconSymbols } from "../utilities/graphics";
import { alliedCodeToName, axisCodeToName, normalDir } from "../utilities/utilities";

interface DesignerDataTabProps {
  scenarioData: ScenarioData;
  setScenarioData: Dispatch<SetStateAction<ScenarioData>>;
}

export default function DesignerDataTab({ scenarioData, setScenarioData }: DesignerDataTabProps) {

  const showHex = (dir: ExtendedDirection, click: () => void): JSX.Element => {
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

  return (
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
          <div className="flex-vertical mt05em">
            { i === 0 ?
              <span className="slim-button-disable">{iconSymbols("no")}</span> :
              <span className="slim-button"
                    onClick={() => {
                      setScenarioData(s => {
                        const d = ([] as string[]).concat(s.metadata.description)
                        d.splice(i, 1)
                        return { ...s, metadata: { ...s.metadata, description: d }}
                      })
                    }} >
                {iconSymbols("no")}
              </span> }
            <div className="flex-fill"></div>
          </div>
          <textarea className="form-input-text"
            name={`description-${i}`}
            value={scenarioData.metadata.description[i].replace(/[\n\r\t]/gm, "").replace(/\s+/gm, " ")}
            onChange={({ target }) => {
              setScenarioData(s => {
                const d = ([] as string[]).concat(s.metadata.description)
                d[i] = target.value
                return { ...s, metadata: { ...s.metadata, description: d }}
              })
            }} />
        </div>
      )}
      <div className="flex mb05em" style={{width: 480, height: "1.8em"}}>
        <div className="flex-fill"></div>
        <span className="slim-button"
              onClick={() => {
                setScenarioData(s => {
                  const d = ([] as string[]).concat(s.metadata.description)
                  d.push("")
                  return { ...s, metadata: { ...s.metadata, description: d }}
                })
              }}>+</span>
      </div>
      <div className="flex mb05em">
        <div style={{width: "150px"}}>
          <label className="design-label">player one</label>
          <select name="allies" value={scenarioData.allies[0]} className="form-input"
                  onChange={({ target }) => {
                    setScenarioData(s => {
                      return { ...s, allies: [target.value] }
                    })
                  }} >
            { [
                "ussr", "usa", "bra", "uk", "can", "aus", "nz", "ind", "sa", "fra", "frf", "chi",
                "pol", "gre", "nor", "bel", "dut", "yug",
              ].map(n => <option key={n} value={n}>{alliedCodeToName(n)}</option>) }
          </select>
        </div>
        <div className="ml1em unselectable" style={{width: "70px"}}>
          <label className="design-label">adv</label>
          <br />
          { showHex(scenarioData.metadata.map_data.allied_dir, () => {
            setScenarioData(s => {
              return { ...s, metadata: { ...s.metadata, map_data: {
                ...s.metadata.map_data, allied_dir: normalDir(s.metadata.map_data.allied_dir + 0.5)
              }} }
            })
          }) }
          : { scenarioData.metadata.map_data.allied_dir }
        </div>
        <div className="ml1em" style={{width: "150px"}}>
          <label className="design-label">player two</label>
          <select name="axis" value={scenarioData.axis[0]} className="form-input"
                  onChange={({ target }) => {
                    setScenarioData(s => {
                      return { ...s, axis: [target.value] }
                    })
                  }} >
            { [
                "ger", "ita", "jap", "fin", "hun", "bul", "rom", "slo", "cro",
              ].map(n => <option key={n} value={n}>{axisCodeToName(n)}</option>) }
          </select>
        </div>
        <div className="ml1em unselectable" style={{width: "70px"}}>
          <label className="design-label">adv</label>
          <br />
          { showHex(scenarioData.metadata.map_data.axis_dir, () => {
            setScenarioData(s => {
              return { ...s, metadata: { ...s.metadata, map_data: {
                ...s.metadata.map_data, axis_dir: normalDir(s.metadata.map_data.axis_dir + 0.5)
              }} }
            })
          }) }
          : { scenarioData.metadata.map_data.axis_dir }
        </div>
      </div>
      <div className="flex mb05em">
        <div style={{width: "130px"}}>
          <label className="design-label">first deploy</label>
          <select name="allies" value={scenarioData.metadata.first_deploy} className="form-input"
            onChange={({ target }) => setScenarioData(s =>
              { return { ...s, metadata: { ...s.metadata, first_deploy: Number(target.value) as Player }} }
            )} >
            <option value={1}>player one</option>
            <option value={2}>player two</option>
          </select>
        </div>
        <div className="ml1em" style={{width: "130px"}}>
          <label className="design-label">initiative</label>
          <select name="axis" value={scenarioData.metadata.first_action} className="form-input"
            onChange={({ target }) => setScenarioData(s =>
              { return { ...s, metadata: { ...s.metadata, first_action: Number(target.value) as Player }} }
            )} >
            <option value={1}>player one</option>
            <option value={2}>player two</option>
          </select>
        </div>
        <div className="ml1em" style={{width: "60px"}}>
          <label className="design-label">turns</label>
          <select name="turns" value={scenarioData.metadata.turns} className="form-input"
            onChange={({ target }) => setScenarioData(s =>
              { return { ...s, metadata: { ...s.metadata, turns: Number(target.value) }} }
            )} >
            { Array.from(Array(30).keys()).map(i => <option key={i} value={i+1}>{i+1}</option>) }
          </select>
        </div>
      </div>
      <div className="flex">
        <div style={{width: "480px"}}>
          <label className="design-label">special rules</label>
          <select name="special" value={scenarioData.metadata.special_rules ?? []} className="form-input"
                  onChange={({ target }) => {
                    setScenarioData(s => {
                      const sr = ([] as string[]).concat(scenarioData.metadata.special_rules ?? [])
                      const index =  sr.indexOf(target.value)
                      if (index < 0) {
                        sr.push(target.value)
                      } else {
                        sr.splice(index, 1)
                      }
                      return { ...s, metadata: { ...s.metadata, special_rules: sr } }
                    })
                  }} multiple data-dropdown="true" >
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
      <div className="flex mb1em">
        <span className="green">{ scenarioData.metadata.special_rules?.join(", ") }</span>
      </div>
      <div className="flex mb05em">
        <div style={{width: "90px"}}>
          <label className="design-label">base</label>
          <select name="allies" value={scenarioData.metadata.map_data.base_terrain} className="form-input"
                  onChange={({ target }) => setScenarioData(s => {
                    return { ...s, metadata: { ...s.metadata, map_data: {
                      ...s.metadata.map_data, base_terrain: target.value as BaseTerrainType
                    }}}}) } >
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
                  onChange={({ target }) => setScenarioData(s => {
                    return { ...s, metadata: { ...s.metadata, map_data: {
                      ...s.metadata.map_data, night: target.value === "true"
                    }}}}) } >
            <option value={"false"}>day</option>
            <option value={"true"}>night</option>
          </select>
        </div>
        <div className="ml1em" style={{width: "100px"}}>
          <label className="design-label">wind</label>
          <select name="axis" value={scenarioData.metadata.map_data.wind[0]} className="form-input"
                  onChange={({ target }) => setScenarioData(s => {
                    const wind = s.metadata.map_data.wind
                    return { ...s, metadata: { ...s.metadata, map_data: {
                      ...s.metadata.map_data, wind: [Number(target.value) as WindType, wind[1], wind[2]]
                    }}}}) } >
            <option value={1}>calm</option>
            <option value={2}>breeze</option>
            <option value={3}>moderate</option>
            <option value={4}>strong</option>
          </select>
        </div>
        <div className="ml1em" style={{width: "70px"}}>
          <label className="design-label">var</label>
          <select name="axis" value={String(scenarioData.metadata.map_data.wind[2])} className="form-input"
                  onChange={({ target }) => setScenarioData(s => {
                    const wind = s.metadata.map_data.wind
                    return { ...s, metadata: { ...s.metadata, map_data: {
                      ...s.metadata.map_data, wind: [wind[0], wind[1], target.value === "true"]
                    }}}}) } >
            <option value={"false"}>no</option>
            <option value={"true"}>yes</option>
          </select>
        </div>
        <div className="ml1em unselectable" style={{width: "70px"}}>
          <label className="design-label">dir</label>
          <br />
          { showHex(scenarioData.metadata.map_data.wind[1], () => {
              setScenarioData(s => {
                const wind = s.metadata.map_data.wind
                return { ...s, metadata: { ...s.metadata, map_data: {
                  ...s.metadata.map_data, wind: [wind[0], normalDir(wind[1] + 1), wind[2]]
                }}}})
            }) }
          : { scenarioData.metadata.map_data.wind[1] }
        </div>
      </div>
      <div className="flex mb05em">
        <div  style={{width: "80px"}}>
          <label className="design-label">weather</label>
          <select name="axis" value={scenarioData.metadata.map_data.base_weather} className="form-input"
                  onChange={({ target }) => setScenarioData(s => {
                    return { ...s, metadata: { ...s.metadata, map_data: {
                      ...s.metadata.map_data, base_weather: target.value as WeatherType
                    }}}}) } >
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
                  onChange={({ target }) => setScenarioData(s => {
                    const precip = s.metadata.map_data.precip
                    return { ...s, metadata: { ...s.metadata, map_data: {
                      ...s.metadata.map_data, precip: [precip[0], target.value as WeatherType]
                    }}}}) } >
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
                  onChange={({ target }) => setScenarioData(s => {
                    const precip = s.metadata.map_data.precip
                    return { ...s, metadata: { ...s.metadata, map_data: {
                      ...s.metadata.map_data, precip: [Number(target.value), precip[1]]
                    }}}}) } >
            { Array.from(Array(10).keys()).map(i => <option key={i} value={i}>{i*10}</option>) }
          </select>
        </div>
        <div className="ml1em" style={{width: "80px"}}>
          <label className="design-label">current</label>
          <select name="axis" value={scenarioData.metadata.map_data.start_weather} className="form-input"
                  onChange={({ target }) => setScenarioData(s => {
                    return { ...s, metadata: { ...s.metadata, map_data: {
                      ...s.metadata.map_data, start_weather: target.value as WeatherType
                    }}}}) } >
            <option value={"dry"}>dry</option>
            <option value={"fog"}>fog</option>
            <option value={"rain"}>rain</option>
            <option value={"snow"}>snow</option>
            <option value={"dust"}>dust</option>
            <option value={"sand"}>sand</option>
          </select>
        </div>
      </div>
    </form>
  )
}