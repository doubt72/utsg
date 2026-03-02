import React from "react";
import CounterDisplay from "../game/CounterDisplay";
import Marker from "../../engine/Marker";

export default function PrecipCheckSection() {
  const clear = new Marker({ mk: 1, type: 10, subtype: 0 })
  const rain = new Marker({ mk: 1, type: 10, subtype: 2, v: 1 })

  return (
    <div>
      <p>
        Precipitation checks are simple: if there is a marker for precipitation with a percentage,
        the player rolls a single d10, and if the number times ten is equal or lower than the
        percentage chance, the marker is placed over the current weather marker and the current
        weather is considered to be whatever type of precipitation the marker designates, else the
        mrker is removed and/or placed in the precipitation space and the current weather is the
        base weather for the scenario.
      </p>
      <div className={"flex mb1em"}>
        <div>
          <CounterDisplay unit={clear} />
        </div>
        <div>&nbsp;</div>
        <div>
          <CounterDisplay unit={rain} />
        </div>
      </div>
      <p>
        For example, if the base weather is dry and there&apos;s a 10% chance of rain, a roll of 1
        means it will be raining during that turn. Any other roll results in dry weather.
      </p>
    </div>
  );
}
