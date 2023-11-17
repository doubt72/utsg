import React from "react";
import PropTypes from "prop-types"
import MapCounter from "./MapCounter";
import { Counter } from "../../engine/counter";
import { Unit } from "../../engine/unit";
import { Feature } from "../../engine/feature";
import { Marker } from "../../engine/marker";

export default function CounterDisplay(props) {

  return (
    <div style={{padding: "0.1rem"}} >
      <svg height="84" width="84" viewBox="0 0 84 84">
        <MapCounter counter={new Counter(-1, -1, props.unit)} ovCallback={() => {}} />
      </svg>
    </div>
  )
}

CounterDisplay.propTypes = {
  unit: PropTypes.oneOfType([
    PropTypes.instanceOf(Unit),
    PropTypes.instanceOf(Feature),
    PropTypes.instanceOf(Marker),
  ])
}
