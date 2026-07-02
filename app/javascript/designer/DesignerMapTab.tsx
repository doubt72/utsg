import React, { Dispatch, SetStateAction } from "react";
import { SelectionType } from "./ScenarioDesigner";

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
               checked={ selectionType.setting === "vp" }
               onChange={() => setSelectionType(s =>
                 { return { ...s, setting: "vp" }}
               )} />
        <label className="design-label flex-fill">VPs</label>
      </div>
      <div className="flex mb05em">
        <input type="radio" className="mr1em"
               name="select"
               value="terrain"
               checked={ selectionType.setting === "terrain" }
               onChange={() => setSelectionType(s =>
                 { return { ...s, setting: "terrain" }}
               )} />
        <label className="design-label flex-fill">Terrain</label>
      </div>
      <div className="flex mb05em">
        <input type="radio" className="mr1em"
               name="select"
               value="building"
               checked={ selectionType.setting === "building" }
               onChange={() => setSelectionType(s =>
                 { return { ...s, setting: "building" }}
               )} />
        <label className="design-label flex-fill">Buildings</label>
      </div>
      <div className="flex mb05em">
        <input type="radio" className="mr1em"
               name="select"
               value="border"
               checked={ selectionType.setting === "border" }
               onChange={() => setSelectionType(s =>
                 { return { ...s, setting: "border" }}
               )} />
        <label className="design-label flex-fill">Borders</label>
      </div>
      <div className="flex mb05em">
        <input type="radio" className="mr1em"
               name="select"
               value="road"
               checked={ selectionType.setting === "road" }
               onChange={() => setSelectionType(s =>
                 { return { ...s, setting: "road" }}
               )} />
        <label className="design-label flex-fill">Roads</label>
      </div>
      <div className="flex mb05em">
        <input type="radio" className="mr1em"
               name="select"
               value="stream"
               checked={ selectionType.setting === "stream" }
               onChange={() => setSelectionType(s =>
                 { return { ...s, setting: "stream" }}
               )} />
        <label className="design-label flex-fill">Streams</label>
      </div>
      <div className="flex mb05em">
        <input type="radio" className="mr1em"
               name="select"
               value="railroad"
               checked={ selectionType.setting === "railroad" }
               onChange={() => setSelectionType(s =>
                 { return { ...s, setting: "railroad" }}
               )} />
        <label className="design-label flex-fill">Railroads</label>
      </div>
    </form>
  )
}
