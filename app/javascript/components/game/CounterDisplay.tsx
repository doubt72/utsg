import React from "react";
import MapCounter from "./map/MapCounter";
import Unit from "../../engine/Unit";
import Feature from "../../engine/Feature";
import Marker from "../../engine/Marker";
import Counter from "../../engine/Counter";

interface CounterDisplayProps {
  unit: Unit | Feature | Marker
}

export default function CounterDisplay({ unit }: CounterDisplayProps) {

  return (
    <div style={{padding: "0.1rem"}} >
      <svg height="84" width="84" viewBox="0 0 84 84">
        <MapCounter counter={new Counter(undefined, unit)} ovCallback={() => {}} />
      </svg>
    </div>
  )
}
