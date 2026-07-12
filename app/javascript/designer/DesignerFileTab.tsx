import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { ScenarioData } from "../engine/Scenario";
import { getAPI } from "../utilities/network";
import { defaultScenario } from "./ScenarioDesigner";

interface DesignerFileTabProps {
  resetCacheCallback: () => void;
  scenarioData: ScenarioData;
  setScenarioData: Dispatch<SetStateAction<ScenarioData>>;
  setScale: Dispatch<SetStateAction<number>>;
  setTab: Dispatch<SetStateAction<number>>;
}

export default function DesignerFileTab({
  resetCacheCallback, scenarioData, setScenarioData, setScale, setTab
}: DesignerFileTabProps) {
  const [scenarioList, setScenarioList] = useState<string[]>([])

  const proto = localStorage.getItem("proto") === "true"
  
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
      resetCacheCallback()
      return
    }
    const url = `/api/v1/scenarios/${id}`
    getAPI(url, {
      ok: response => {
        response.json().then(json => {
          setScenarioData(json)
          resetCacheCallback()
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

  return (
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
                  resetCacheCallback()
                } catch (err) {
                  console.error('Invalid JSON:', err);
                }
              };
              reader.readAsText(file);
              setTab(1)
            }} />
        </form>
      </div>
      <div className="mt1em">
        save to file:
      </div>
      <div className="flex">
        <div className="design-button" onClick={() => download()}
              style={{ padding: "0.15em 0.5em 0.25em" }}>
          save
        </div>
        <div className="flex-fill"></div>
      </div>
    </div>
  )
}
