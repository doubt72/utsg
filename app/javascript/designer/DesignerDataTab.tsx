import React, { Dispatch, SetStateAction } from "react";
import { BaseTerrainType, Player, WeatherType, WindType } from "../utilities/commonTypes";
import { iconSymbols } from "../utilities/graphics";
import { alliedCodeToName, axisCodeToName, normalDir } from "../utilities/utilities";
import { DesignStack, pushDesignStack, showHex } from "./ScenarioDesigner";

interface DesignerDataTabProps {
  designStack: DesignStack;
  setDesignStack: Dispatch<SetStateAction<DesignStack>>;
}

export default function DesignerDataTab({ designStack, setDesignStack }: DesignerDataTabProps) {
  const data = designStack.data[designStack.index]
  const metadata = data.metadata

  return (
    <form>
      <div className="flex mb05em">
        <div style={{width: "60px"}}>
          <label className="design-label">id</label>
          <input type="text" className="form-input"
            name="id"
            value={data.id}
            onChange={({ target }) => pushDesignStack(
              { ...data, id: target.value }, setDesignStack
            )} />
        </div>
        <div className="ml1em" style={{width: "400px"}}>
          <label className="design-label">name</label>
          <input type="text" className="form-input"
            name="name"
            value={data.name}
            onChange={({ target }) => pushDesignStack(
              { ...data, name: target.value }, setDesignStack
            )} />
        </div>
      </div>
      <div className="flex mb05em">
        <div style={{width: "200px"}}>
          <label className="design-label">author</label>
          <input type="text" className="form-input"
            name="author"
            value={metadata.author}
            onChange={({ target }) => pushDesignStack(
              { ...data, metadata: { ...metadata, author: target.value } }, setDesignStack
            )} />
        </div>
      </div>
      <div className="flex mb05em">
        <div style={{width: "60px"}}>
          <label className="design-label">version</label>
          <input type="text" className="form-input"
            name="version"
            value={data.version}
            onChange={({ target }) => pushDesignStack(
              { ...data, version: target.value }, setDesignStack
            )} />
        </div>
        <div className="ml1em" style={{width: "120px"}}>
          <label className="design-label">status</label>
          <select name="status" value={data.status} className="form-input"
                  onChange={({ target }) => pushDesignStack(
                    { ...data, status: target.value }, setDesignStack
                  )}>
            <option value="">ready</option>
            <option value="b">beta</option>
            <option value="a">alpha</option>
            <option value="p">prototype</option>
          </select>
        </div>
        <div className="ml1em" style={{width: "80px"}}>
          <label className="design-label">year</label>
          <select name="year" value={metadata.date[0]} className="form-input"
                  onChange={({ target }) => pushDesignStack(
                    { ...data, metadata: {
                      ...metadata, date: [Number(target.value), metadata.date[1], metadata.date[2]],
                    } }, setDesignStack
                  )}>
            { Array.from(Array(50).keys()).map(i => <option key={i} value={i+1920}>{i+1920}</option>) }
          </select>
        </div>
        <div className="ml1em" style={{width: "60px"}}>
          <label className="design-label">month</label>
          <select name="month" value={metadata.date[1]} className="form-input"
                  onChange={({ target }) => pushDesignStack(
                    { ...data, metadata: {
                      ...metadata, date: [metadata.date[0], Number(target.value), metadata.date[2]],
                    } }, setDesignStack
                  )}>
            { Array.from(Array(12).keys()).map(i => <option key={i} value={i+1}>{i+1}</option>) }
          </select>
        </div>
        <div className="ml1em" style={{width: "60px"}}>
          <label className="design-label">day</label>
          <select name="day" value={metadata.date[2]} className="form-input"
                  onChange={({ target }) => pushDesignStack(
                    { ...data, metadata: {
                      ...metadata, date: [metadata.date[0], metadata.date[1], Number(target.value)],
                    } }, setDesignStack
                  )}>
            { Array.from(Array(31).keys()).map(i => <option key={i} value={i+1}>{i+1}</option>) }
          </select>
        </div>
      </div>
      <div className="flex mb05em">
        <div style={{width: "400px"}}>
          <label className="design-label">location</label>
          <input type="text" className="form-input"
            name="location"
            value={metadata.location}
            onChange={({ target }) => pushDesignStack(
              { ...data, metadata: { ...metadata, location: target.value } }, setDesignStack
            )} />
        </div>
      </div>
      <div style={{width: "480px"}}>
        <label className="design-label">description</label>
      </div>
      { metadata.description.map((d, i) =>
        <div key={i} className="flex mb05em" style={{width: "480px"}} >
          <div className="flex-vertical mt05em">
            { i === 0 ?
              <div className="design-button-disable mr05em" style={{ width: "32px", textAlign: "center" }}>
                {iconSymbols("no")}
              </div> :
              <div className="design-button mr05em" style={{ width: "32px", textAlign: "center" }}
                   onClick={() => {
                     const d = [...metadata.description]
                     d.splice(i, 1)
                     pushDesignStack(
                       { ...data, metadata: { ...metadata, description: d } }, setDesignStack
                   )}}>
                {iconSymbols("no")}
              </div> }
            <div className="flex-fill"></div>
          </div>
          <textarea className="form-input-text"
            name={`description-${i}`}
            value={metadata.description[i].replace(/[\n\r\t]/gm, "").replace(/\s+/gm, " ")}
            onChange={({target}) => {
              const d = [...metadata.description]
              d[i] = target.value
              pushDesignStack(
                { ...data, metadata: { ...metadata, description: d } }, setDesignStack
            )}}/>
        </div>
      )}
      <div className="flex mb05em" style={{width: 480, height: "1.8em"}}>
        <div className="flex-fill"></div>
        <div className="design-button" style={{ width: "32px", textAlign: "center" }}
             onClick={() => {
               const d = [...metadata.description, ""]
               pushDesignStack(
                 { ...data, metadata: { ...metadata, description: d } }, setDesignStack
             )}}>+</div>
      </div>
      <div className="flex mb05em">
        <div style={{width: "150px"}}>
          <label className="design-label">player one</label>
          <select name="allies" value={data.allies[0]} className="form-input"
                  onChange={({ target }) => pushDesignStack(
                    { ...data, allies: [target.value] }, setDesignStack
                  )} >
            { [
                "ussr", "usa", "bra", "uk", "can", "aus", "nz", "ind", "sa", "fra", "frf", "chi",
                "pol", "gre", "nor", "bel", "dut", "yug",
              ].map(n => <option key={n} value={n}>{alliedCodeToName(n)}</option>) }
          </select>
        </div>
        <div className="ml1em unselectable" style={{width: "70px"}}>
          <label className="design-label">adv</label>
          <br />
          { showHex(metadata.map_data.allied_dir, () => {
              pushDesignStack(
                { ...data,
                  metadata: { ...metadata, map_data: {
                    ...metadata.map_data,
                    allied_dir: normalDir(metadata.map_data.allied_dir + 0.5)
                  }
                }}, setDesignStack
              )
            })
          }
          : { metadata.map_data.allied_dir }
        </div>
        <div className="ml1em" style={{width: "150px"}}>
          <label className="design-label">player two</label>
          <select name="axis" value={data.axis[0]} className="form-input"
                  onChange={({ target }) => pushDesignStack(
                    { ...data, axis: [target.value] }, setDesignStack
                  )} >
            { [
                "ger", "ita", "jap", "fin", "hun", "bul", "rom", "slo", "cro",
              ].map(n => <option key={n} value={n}>{axisCodeToName(n)}</option>) }
          </select>
        </div>
        <div className="ml1em unselectable" style={{width: "70px"}}>
          <label className="design-label">adv</label>
          <br />
          { showHex(metadata.map_data.axis_dir, () => {
              pushDesignStack(
                { ...data,
                  metadata: { ...metadata, map_data: {
                    ...metadata.map_data,
                    axis_dir: normalDir(metadata.map_data.axis_dir + 0.5)
                  }
                }}, setDesignStack
              )
            })
          }
          : { metadata.map_data.axis_dir }
        </div>
      </div>
      <div className="flex mb05em">
        <div style={{width: "130px"}}>
          <label className="design-label">first deploy</label>
          <select name="allies" value={metadata.first_deploy} className="form-input"
                  onChange={({ target }) => pushDesignStack(
                    { ...data, metadata: { ...metadata, first_deploy: Number(target.value) as Player }},
                    setDesignStack
                  )}>
            <option value={1}>player one</option>
            <option value={2}>player two</option>
          </select>
        </div>
        <div className="ml1em" style={{width: "130px"}}>
          <label className="design-label">initiative</label>
          <select name="axis" value={metadata.first_action} className="form-input"
                  onChange={({ target }) => pushDesignStack(
                    { ...data, metadata: { ...metadata, first_action: Number(target.value) as Player }},
                    setDesignStack
                  )}>
            <option value={1}>player one</option>
            <option value={2}>player two</option>
          </select>
        </div>
        <div className="ml1em" style={{width: "60px"}}>
          <label className="design-label">turns</label>
          <select name="turns" value={metadata.turns} className="form-input"
                  onChange={({ target }) => pushDesignStack(
                    { ...data, metadata: { ...metadata, turns: Number(target.value) }},
                    setDesignStack
                  )}>
            { Array.from(Array(30).keys()).map(i => <option key={i} value={i+1}>{i+1}</option>) }
          </select>
        </div>
      </div>
      <div className="flex">
        <div style={{width: "480px"}}>
          <label className="design-label">special rules</label>
          <select name="special" value={metadata.special_rules ?? []} className="form-input"
                  onChange={() => {}} onClick={({ target }) => {
                    const sr = [...(metadata.special_rules ?? [])]
                    // This is stupid
                    const value = (target as HTMLSelectElement).value
                    const index =  sr.indexOf(value)
                    if (index < 0) {
                      sr.push(value)
                    } else {
                      sr.splice(index, 1)
                    }
                    pushDesignStack(
                      { ...data, metadata: { ...metadata, special_rules: sr } }, setDesignStack
                    )
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
        <span className="green">{ metadata.special_rules?.join(", ") }</span>
      </div>
      <div className="flex mb05em">
        <div style={{width: "90px"}}>
          <label className="design-label">base</label>
          <select name="allies" value={metadata.map_data.base_terrain} className="form-input"
                  onChange={({ target }) => pushDesignStack(
                    { ...data, metadata: { ...metadata, map_data: {
                      ...metadata.map_data, base_terrain: target.value as BaseTerrainType
                    }}}, setDesignStack)
                  }>
            <option value={"g"}>grass</option>
            <option value={"u"}>urban</option>
            <option value={"s"}>snow</option>
            <option value={"d"}>sand</option>
            <option value={"m"}>mud</option>
          </select>
        </div>
        <div className="ml1em" style={{width: "80px"}}>
          <label className="design-label">time</label>
          <select name="axis" value={String(metadata.map_data.night)} className="form-input"
                  onChange={({ target }) => pushDesignStack(
                    { ...data, metadata: { ...metadata, map_data: {
                      ...metadata.map_data, night: target.value === "true"
                    }}}, setDesignStack)
                  }>
            <option value={"false"}>day</option>
            <option value={"true"}>night</option>
          </select>
        </div>
        <div className="ml1em" style={{width: "100px"}}>
          <label className="design-label">wind</label>
          <select name="axis" value={metadata.map_data.wind[0]} className="form-input"
                  onChange={({ target }) => {
                    const wind = metadata.map_data.wind
                    pushDesignStack(
                      { ...data, metadata: { ...metadata, map_data: {
                        ...metadata.map_data, wind: [Number(target.value) as WindType, wind[1], wind[2]]
                      }}}, setDesignStack
                    )
                  }}>
            <option value={1}>calm</option>
            <option value={2}>breeze</option>
            <option value={3}>moderate</option>
            <option value={4}>strong</option>
          </select>
        </div>
        <div className="ml1em" style={{width: "70px"}}>
          <label className="design-label">var</label>
          <select name="axis" value={String(metadata.map_data.wind[2])} className="form-input"
                  onChange={({ target }) => {
                    const wind = metadata.map_data.wind
                    pushDesignStack(
                      { ...data, metadata: { ...metadata, map_data: {
                        ...metadata.map_data, wind: [wind[0], wind[1], target.value === "true"]
                      }}}, setDesignStack
                    )
                  }}>
            <option value={"false"}>no</option>
            <option value={"true"}>yes</option>
          </select>
        </div>
        <div className="ml1em unselectable" style={{width: "70px"}}>
          <label className="design-label">dir</label>
          <br />
          { showHex(metadata.map_data.wind[1], () => {
              const wind = metadata.map_data.wind
              pushDesignStack(
                { ...data,
                  metadata: { ...metadata, map_data: {
                    ...metadata.map_data, wind: [wind[0], normalDir(wind[1] + 1), wind[2]]
                  }
                }}, setDesignStack
              )
            })
          }
          : { metadata.map_data.wind[1] }
        </div>
      </div>
      <div className="flex mb05em">
        <div  style={{width: "80px"}}>
          <label className="design-label">weather</label>
          <select name="axis" value={metadata.map_data.base_weather} className="form-input"
                  onChange={({ target }) => {
                    pushDesignStack(
                      { ...data, metadata: { ...metadata, map_data: {
                        ...metadata.map_data, base_weather: target.value as WeatherType
                      }}}, setDesignStack
                    )
                  }}>
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
          <select name="axis" value={metadata.map_data.precip[1]} className="form-input"
                  onChange={({ target }) => {
                    const precip = metadata.map_data.precip
                    pushDesignStack(
                      { ...data, metadata: { ...metadata, map_data: {
                        ...metadata.map_data, precip: [precip[0], target.value as WeatherType]
                      }}}, setDesignStack
                    )
                  }}>
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
          <select name="axis" value={metadata.map_data.precip[0]} className="form-input"
                  onChange={({ target }) => {
                    const precip = metadata.map_data.precip
                    pushDesignStack(
                      { ...data, metadata: { ...metadata, map_data: {
                        ...metadata.map_data, precip: [Number(target.value), precip[1]]
                      }}}, setDesignStack
                    )
                  }}>
            { Array.from(Array(10).keys()).map(i => <option key={i} value={i}>{i*10}</option>) }
          </select>
        </div>
        <div className="ml1em" style={{width: "80px"}}>
          <label className="design-label">current</label>
          <select name="axis" value={metadata.map_data.start_weather} className="form-input"
                  onChange={({ target }) => {
                    pushDesignStack(
                      { ...data, metadata: { ...metadata, map_data: {
                        ...metadata.map_data, start_weather: target.value as WeatherType
                      }}}, setDesignStack
                    )
                  }}>
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