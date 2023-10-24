import React from "react";
import PropTypes from "prop-types"
import { Unit } from "../../engine/unit";

export default function MapCounter(props) {

  return (
    <g>
      {props.x}
    </g>
  )
}

MapCounter.propTypes = {
  unit: PropTypes.instanceOf(Unit),
  x: PropTypes.number,
  y: PropTypes.number,
}
