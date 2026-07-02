import React, { Dispatch, SetStateAction } from "react";
import { SelectionType, showHex } from "./ScenarioDesigner";
import { BorderType, BuildingShape, BuildingStyle, RoadCenterType, RoadType, StreamType, TerrainType } from "../utilities/commonTypes";
import { normalDir } from "../utilities/utilities";

interface DesignerMapTabProps {
  selectionType: SelectionType;
  setSelectionType: Dispatch<SetStateAction<SelectionType>>;
}

export default function DesignerMapTab({ selectionType, setSelectionType }: DesignerMapTabProps) {
  return (
    <form>
      <div className="flex mb05em">
        <input type="radio" className="mr1em"
               name="select"
               value="vp"
               checked={ selectionType.set === "vp" }
               onChange={() => setSelectionType(s =>
                 { return { ...s, set: "vp" }}
               )} />
        <label className="design-label flex-fill">vps</label>
      </div>
      <div className="flex pt05em" style={{ borderTop: "1px solid black" }}>
        <input type="radio" className="mr1em"
               name="select"
               value="terrain"
               checked={ selectionType.set === "terrain" }
               onChange={() => setSelectionType(s =>
                 { return { ...s, set: "terrain" }}
               )} />
        <label className="design-label flex-fill">terrain:</label>
      </div>
      <div className="flex mb1em">
        <div style={{width: "150px"}}>
          <label className="design-label">type</label>
          <select name="terrain" value={selectionType.terrain} className="form-input"
                  onChange={({ target }) => {
                    setSelectionType(s => {
                      return { ...s, terrain: target.value as TerrainType }
                    })
                  }} >
            <option key={"o"} value={"o"}>open</option>
            <option key={"f"} value={"f"}>forest</option>
            <option key={"b"} value={"b"}>brush</option>
            <option key={"d"} value={"d"}>orchard</option>
            <option key={"g"} value={"g"}>field</option>
            <option key={"s"} value={"s"}>sand</option>
            <option key={"m"} value={"m"}>marsh</option>
            <option key={"j"} value={"j"}>jungle</option>
            <option key={"p"} value={"p"}>palm trees</option>
            <option key={"r"} value={"r"}>rough</option>
            <option key={"t"} value={"t"}>soft ground</option>
            <option key={"x"} value={"x"}>debris</option>
            <option key={"w"} value={"w"}>water</option>
            <option key={"y"} value={"y"}>shallow water</option>
          </select>
        </div>
        <div className="ml1em unselectable" style={{width: "70px"}}>
          <label className="design-label">dir</label>
          <br />
          { showHex(selectionType.dir, () => {
            setSelectionType(s => {
              return { ...s, dir: normalDir(selectionType.dir + 0.5) }
            })
          }) }
          : { selectionType.dir }
        </div>
        <div style={{width: "120px"}}>
          <label className="design-label">elev</label>
          <select name="tdir" value={selectionType.elevation} className="form-input"
                  onChange={({ target }) => {
                    setSelectionType(s => {
                      return { ...s, elevation: Number(target.value) }
                    })
                  }} >
            {
              [-1, 0, 1, 2, 3, 4, 5].map(n => {
                return <option key={`e${n+1}`} value={n}>height {n}</option>
              })
            }
          </select>
        </div>
      </div>
      <div className="flex pt05em" style={{ borderTop: "1px solid black" }}>
        <input type="radio" className="mr1em"
               name="select"
               value="building"
               checked={ selectionType.set === "building" }
               onChange={() => setSelectionType(s =>
                 { return { ...s, set: "building" }}
               )} />
        <label className="design-label flex-fill">buldings:</label>
      </div>
      <div className="flex mb1em">
        <div style={{width: "200px"}}>
          <label className="design-label">type</label>
          <select name="buildings" value={selectionType.building} className="form-input"
                  onChange={({ target }) => {
                    setSelectionType(s => {
                      return { ...s, building: target.value as BuildingShape }
                    })
                  }} >
            <option key={"l"} value={"l"}>lone with eaves</option>
            <option key={"s"} value={"s"}>side with eaves</option>
            <option key={"m"} value={"m"}>middle with eaves</option>
            <option key={"x"} value={"x"}>crosss</option>
            <option key={"l2"} value={"l2"}>lone no eaves</option>
            <option key={"s2"} value={"s2"}>side no eaves</option>
            <option key={"m2"} value={"m2"}>middle no eaves</option>
            <option key={"c"} value={"c"}>silo</option>
            <option key={"t"} value={"t"}>tank</option>
            <option key={"h"} value={"h"}>huts</option>
            <option key={"bs1"} value={"bs1"}>big side</option>
            <option key={"bs2"} value={"bs2"}>big side 2</option>
            <option key={"bs3"} value={"bs3"}>big side 3</option>
            <option key={"bs4"} value={"bs4"}>big side 4</option>
            <option key={"bm"} value={"bm"}>big corner</option>
            <option key={"bc1"} value={"bc1"}>big corner 2</option>
            <option key={"bc2"} value={"bc2"}>big corner 3</option>
            <option key={"bc3"} value={"bc3"}>big corner 4</option>
            <option key={"bc4"} value={"bc4"}>big middle</option>
          </select>
        </div>
        <div className="ml1em unselectable" style={{width: "75px"}}>
          <label className="design-label">dir</label>
          <br />
          { showHex(selectionType.dir, () => {
            setSelectionType(s => {
              return { ...s, dir: normalDir(selectionType.dir + 0.5) }
            })
          }) }
          : { selectionType.dir }
        </div>
        <div style={{width: "100px"}}>
          <label className="design-label">style</label>
          <select name="bstyle" value={selectionType.buildStyle} className="form-input"
                  onChange={({ target }) => {
                    setSelectionType(s => {
                      return { ...s, buildStyle: target.value as BuildingStyle }
                    })
                  }} >
            <option key={"f"} value={"f"}>rural</option>
            <option key={"u"} value={"u"}>urban</option>
          </select>
        </div>
      </div>
      <div className="flex pt05em" style={{ borderTop: "1px solid black" }}>
        <input type="radio" className="mr1em"
               name="select"
               value="border"
               checked={ selectionType.set === "border" }
               onChange={() => setSelectionType(s =>
                 { return { ...s, set: "border" }}
               )} />
        <label className="design-label flex-fill">borders:</label>
      </div>
      <div className="flex mb1em">
        <div style={{width: "150px"}}>
          <label className="design-label">type</label>
          <select name="border" value={selectionType.border} className="form-input"
                  onChange={({ target }) => {
                    setSelectionType(s => {
                      return { ...s, border: target.value as BorderType }
                    })
                  }} >
            <option key={"f"} value={"f"}>fence</option>
            <option key={"w"} value={"w"}>wall</option>
            <option key={"b"} value={"b"}>bocage</option>
            <option key={"c"} value={"c"}>cliff</option>
          </select>
        </div>
        {
          [1, 2, 3, 4, 5, 6].map(n => {
            return (
              <div key={`d${n}`} className="ml1em" style={{width: "20px"}}>
                <label className="design-label">{n}</label>
                <input type="checkbox" className="mr1em"
                       name={`b${n}`}
                       value="true"
                       onChange={() => setSelectionType(s => {
                         let edges = s.borderEdges
                         if (edges.includes(n)) {
                           edges = edges.filter(i => i !== n)
                         } else {
                           edges.push(n)
                           edges.sort()
                         }
                         return { ...s, borderEdges: edges }
                       })} />
              </div>
            )
          })
        }
      </div>
      <div className="flex pt05em" style={{ borderTop: "1px solid black" }}>
        <input type="radio" className="mr1em"
               name="select"
               value="road"
               checked={ selectionType.set === "road" }
               onChange={() => setSelectionType(s =>
                 { return { ...s, set: "road" }}
               )} />
        <label className="design-label flex-fill">roads:</label>
      </div>
      <div className="flex">
        <div style={{width: "150px"}}>
          <label className="design-label">type</label>
          <select name="road" value={selectionType.road} className="form-input"
                  onChange={({ target }) => {
                    setSelectionType(s => {
                      return { ...s, road: target.value as RoadType }
                    })
                  }} >
            <option key={"t"} value={"t"}>tarmac</option>
            <option key={"d"} value={"d"}>dirt</option>
            <option key={"p"} value={"p"}>path</option>
            <option key={"a"} value={"a"}>airfield</option>
          </select>
        </div>
        {
          [1, 2, 3, 4, 5, 6].map(n => {
            return (
              <div key={`d${n}`} className="ml1em" style={{width: "20px"}}>
                <label className="design-label">{n}</label>
                <input type="checkbox" className="mr1em"
                       name={`r${n}`}
                       value="true"
                       onChange={() => setSelectionType(s => {
                         let edges = s.roadDirs
                         if (edges.includes(n)) {
                           edges = edges.filter(i => i !== n)
                         } else {
                           edges.push(n)
                           edges.sort()
                         }
                         return { ...s, roadDirs: edges }
                       })} />
              </div>
            )
          })
        }
      </div>
      <div className="flex mb1em">
        <div style={{width: "150px"}}>
          <label className="design-label">center offset</label>
          <select name="rcenter" value={selectionType.roadCenter} className="form-input"
                  onChange={({ target }) => {
                    setSelectionType(s => {
                      let rc: RoadCenterType | undefined | "u" = target.value as RoadCenterType | "u"
                      if (rc === "u") { rc = undefined }
                      return { ...s, roadCenter: rc as RoadCenterType | undefined }
                    })
                  }} >
            <option key={"u"} value={"u"}>none</option>
            <option key={"l"} value={"l"}>left</option>
            <option key={"r"} value={"r"}>right</option>
          </select>
        </div>
        <div className="ml1em unselectable" style={{width: "70px"}}>
          <label className="design-label">dir</label>
          <br />
          { showHex(selectionType.roadTurn, () => {
            setSelectionType(s => {
              return { ...s, roadTurn: normalDir(selectionType.roadTurn + 1) }
            })
          }) }
          : { selectionType.roadTurn }
        </div>
      </div>
      <div className="flex pt05em" style={{ borderTop: "1px solid black" }}>
        <input type="radio" className="mr1em"
               name="select"
               value="stream"
               checked={ selectionType.set === "stream" }
               onChange={() => setSelectionType(s =>
                 { return { ...s, set: "stream" }}
               )} />
        <label className="design-label flex-fill">streams:</label>
      </div>
      <div className="flex mb1em">
        <div style={{width: "150px"}}>
          <label className="design-label">type</label>
          <select name="stream" value={selectionType.stream} className="form-input"
                  onChange={({ target }) => {
                    setSelectionType(s => {
                      return { ...s, stream: target.value as StreamType }
                    })
                  }} >
            <option key={"s"} value={"s"}>stream</option>
            <option key={"g"} value={"g"}>gully</option>
            <option key={"t"} value={"t"}>trench</option>
          </select>
        </div>
        {
          [1, 2, 3, 4, 5, 6].map(n => {
            return (
              <div key={`d${n}`} className="ml1em" style={{width: "20px"}}>
                <label className="design-label">{n}</label>
                <input type="checkbox" className="mr1em"
                       name={`s${n}`}
                       value="true"
                       onChange={() => setSelectionType(s => {
                         let edges = s.streamDirs
                         if (edges.includes(n)) {
                           edges = edges.filter(i => i !== n)
                         } else {
                           edges.push(n)
                           edges.sort()
                         }
                         return { ...s, streamDirs: edges }
                       })} />
              </div>
            )
          })
        }
      </div>
      <div className="flex pt05em" style={{ borderTop: "1px solid black" }}>
        <input type="radio" className="mr1em"
               name="select"
               value="railroad"
               checked={ selectionType.set === "railroad" }
               onChange={() => setSelectionType(s =>
                 { return { ...s, set: "railroad" }}
               )} />
        <label className="design-label flex-fill">railroads:</label>
      </div>
      <div className="flex mb1em">
        <div className="mr1em" style={{width: "100px"}}>
          <label className="design-label">toggle</label>
          <select name="railroad" value={selectionType.railroad} className="form-input"
                  onChange={({ target }) => {
                    setSelectionType(s => {
                      return { ...s, railroad: target.value as "+" | "-" }
                    })
                  }} >
            <option key={"+"} value={"+"}>add</option>
            <option key={"-"} value={"-"}>remove</option>
          </select>
        </div>
        <div className="mr1em" style={{width: "70px"}}>
          <label className="design-label">start</label>
          <select name="rrstart" value={selectionType.rrStart} className="form-input"
                  onChange={({ target }) => {
                    setSelectionType(s => {
                      let rre = selectionType.rrEnd
                      if (Number(target.value) === rre) {
                        rre = normalDir(rre + 1)
                      }
                      return { ...s, rrStart: normalDir(Number(target.value)), rrEnd: rre }
                    })
                  }} >
            {
              [1, 2, 3, 4, 5, 6].map(n => {
                return <option key={`rs${n+1}`} value={n}>{n}</option>
              })
            }
          </select>
        </div>
        <div className="mr1em" style={{width: "70px"}}>
          <label className="design-label">end</label>
          <select name="rrend" value={selectionType.rrEnd} className="form-input"
                  onChange={({ target }) => {
                    setSelectionType(s => {
                      let rrs = selectionType.rrStart
                      if (Number(target.value) === rrs) {
                        rrs = normalDir(rrs - 1)
                      }
                      return { ...s, rrEnd: normalDir(Number(target.value)), rrStart: rrs }
                    })
                  }} >
            {
              [1, 2, 3, 4, 5, 6].map(n => {
                return <option key={`re${n+1}`} value={n}>{n}</option>
              })
            }
          </select>
        </div>
      </div>
    </form>
  )
}
