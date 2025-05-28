import React, { useEffect, useState } from "react";
import { getAPI } from "../utilities/network";
import CounterDisplay from "../components/game/CounterDisplay";
import Feature, { FeatureData } from "../engine/Feature";
import Marker, { MarkerData } from "../engine/Marker";
import { UnitData } from "../engine/Unit";


export default function DebugMarkers() {
  const [markers, setMarkers] = useState<{ [index: string]: FeatureData | MarkerData | UnitData }>({})

  useEffect(() => {
    getAPI("/api/v1/scenarios/all_units", {
      ok: respons => respons.json().then(json => { setMarkers(json) })
    })
  }, [])

  const svgContainer = (marker: Feature | Marker | undefined, key: number) => {
    if (!marker) { return <></> }
    return <CounterDisplay key={key} unit={marker} />
  }

  const makeUnit = (data: FeatureData | MarkerData | UnitData): Feature | Marker | undefined => {
    if (data.ft) {
      return new Feature(data)
    } else if (data.mk) {
      return new Marker(data)
    } else {
      return undefined
    }
  }

  return (
    <div className="p1em flex flex-wrap">
      { Object.values(markers).map((m, i) => svgContainer(makeUnit(m), i)) }
    </div>
  )
}
