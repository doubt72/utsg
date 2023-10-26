import React from "react";
import PropTypes from "prop-types"
import { Counter } from "../../engine/counter";
import { Unit } from "../../engine/unit";
import MapCounter from "./MapCounter";

export default function CounterDisplay(props) {

  return (
    <div style={{padding: "0.1rem"}} >
      <svg height="84" width="84" viewBox="0 0 84 84">
        <MapCounter counter={new Counter(0, 0, props.unit, null)} />
      </svg>
    </div>
  )
}

CounterDisplay.propTypes = {
  unit: PropTypes.instanceOf(Unit),
}
