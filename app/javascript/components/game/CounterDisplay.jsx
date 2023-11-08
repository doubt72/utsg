import React from "react";
import PropTypes from "prop-types"
import { Counter } from "../../engine/counter";
import { Unit } from "../../engine/unit";
import MapCounter from "./MapCounter";
import { Feature } from "../../engine/feature";

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
  ])
}
