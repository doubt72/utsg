import React from "react";

export default function PrecipCheckSection() {
  return (
    <div>
      <p>
        Precipitation checks are simple: if there is a marker for precipitation
        with a percentage, the player rolls a single d10, and if the number times
        ten is equal or lower than the percentage chance, the marker is placed
        over the current weather marker and the current weather is considered to
        be whatever type of precipitation the marker designates, else the mrker
        is removed and/or placed in the precipitation space and the current weather
        is the base weather for the scenario.
      </p>
    </div>
  );
}
