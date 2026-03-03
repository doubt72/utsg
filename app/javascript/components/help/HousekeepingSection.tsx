import React from "react";
import { stackLimit } from "../../utilities/utilities";
import CounterDisplay from "../game/CounterDisplay";
import Marker from "../../engine/Marker";
import { markerType, weatherType, windType } from "../../utilities/commonTypes";

export default function HousekeepingSection() {
  const section = "5.2.4.2"

  const wind1 = new Marker({ mk: 1, type: markerType.Wind, subtype: windType.Calm })
  const wind2 = new Marker({ mk: 1, type: markerType.Wind, subtype: windType.Breeze })
  const wind3 = new Marker({ mk: 1, type: markerType.Wind, subtype: windType.Moderate })
  const wind4 = new Marker({ mk: 1, type: markerType.Wind, subtype: windType.Strong })

  const vwind1 = new Marker({ mk: 1, type: markerType.Wind, subtype: windType.Calm, v: "true" })
  const vwind2 = new Marker({ mk: 1, type: markerType.Wind, subtype: windType.Breeze, v: "true" })
  const vwind3 = new Marker({ mk: 1, type: markerType.Wind, subtype: windType.Moderate, v: "true" })
  const vwind4 = new Marker({ mk: 1, type: markerType.Wind, subtype: windType.Strong, v: "true" })

  const dry = new Marker({ mk: 1, type: markerType.Weather, subtype: weatherType.Dry })
  const fog = new Marker({ mk: 1, type: markerType.Weather, subtype: weatherType.Fog })
  const rain = new Marker({ mk: 1, type: markerType.Weather, subtype: weatherType.Rain })
  const snow = new Marker({ mk: 1, type: markerType.Weather, subtype: weatherType.Snow })
  const sand = new Marker({ mk: 1, type: markerType.Weather, subtype: weatherType.Sand })
  const dust = new Marker({ mk: 1, type: markerType.Weather, subtype: weatherType.Dust })

  return (
    <div>
      <p>There are several turn-end tasks in the the housekeeping sub-phase.</p>
      <h3>{section}.1. Checking Stacking</h3>
      <p>
        Any units not remaining in close combat must be under the stacking limit of {stackLimit}. If
        this is the case in any hex, then units must be removed until in compliance with the
        stacking limit. The only way this can happen is if more than the stacking limit worth of
        units are fed into a close combat, which is legal, if perhaps unwise. Wrecked vehicles
        (including both friendly and enemy wrecked units) count towards the total stacking size in a
        hex.
      </p>
      <h3>{section}.2. Updating Unit Status and Initiative</h3>
      <p>
        At this point, all activated, pinned, and routed markers are removed, and any exhausted
        markers are replaced with tired markers.
      </p>
      <p>
        Also, if initiative value is greater than 14, it is reduced to 14 on the same side.
      </p>
      <h3>{section}.3. Checking for Smoke Dispersion</h3>
      <p>
        If any hexes contain smoke markers, they may be dispersed. The chance of dispersion depends
        upon the wind speed.
      </p>
      <div className={"flex mb1em"}>
        <div>
          <CounterDisplay unit={wind1} />
        </div>
        <div>&nbsp;</div>
        <div>
          <CounterDisplay unit={wind2} />
        </div>
        <div>&nbsp;</div>
        <div>
          <CounterDisplay unit={wind3} />
        </div>
        <div>&nbsp;</div>
        <div>
          <CounterDisplay unit={wind4} />
        </div>
      </div>
      <p>
        The <strong>sd</strong> percentage is the chance of smoke dispersion. Each hex containing
        smoke is checked separately: a single d10 is rolled, and if ten times the result is less
        than or equal to the <strong>sd</strong> value, the smoke counter is removed from the map.
      </p>
      <p>
        For example, if the wind was moderate and a 7 was rolled, the smoke marker being checked
        would be removed.
      </p>
      <h3>{section}.4. Checking for Blazes Being Extinguished or Spreading</h3>
      <p>
        There are two parts of the fire check, first to see if the fire is extinguished, then to see
        if the fire spreads.
      </p>
      <div className={"flex mb1em"}>
        <div>
          <CounterDisplay unit={dry} />
        </div>
        <div>&nbsp;</div>
        <div>
          <CounterDisplay unit={fog} />
        </div>
        <div>&nbsp;</div>
        <div>
          <CounterDisplay unit={rain} />
        </div>
        <div>&nbsp;</div>
        <div>
          <CounterDisplay unit={snow} />
        </div>
        <div>&nbsp;</div>
        <div>
          <CounterDisplay unit={sand} />
        </div>
        <div>&nbsp;</div>
        <div>
          <CounterDisplay unit={dust} />
        </div>
      </div>
      <p>
        Fire extinguishing depends on the <strong>fe</strong> percentage on the current weather.
        Each hex containing a blaze is checked separately: a single d10 is rolled, and if ten times
        the result is less than or equal to the <strong>fe</strong> value, the blaze counter is
        removed from the map.
      </p>
      <p>
        For example, if it was raining and a 6 was rolled, the blaze marker being checked would be
        removed.
      </p>
      <p>
        After checking to see if the blazes remain, a check is made to see if the blazes spread.
        Fire spread depends on the <strong>fs</strong> percentage on the current wind speed. Each
        hex containing a blaze is checked separately: a single d10 is rolled, and if ten times the
        result is less than or equal to the <strong>fs</strong> value, the blaze spreads in the
        direction of the wind. Note that fires will not spread in calm winds, and dust increases the
        chance of spreading by 10% (even in calm winds).
      </p>
      <p>
        For example, if the wind was moderate, the weather was dry and a 2 was rolled, a new blaze
        marker would be placed in the direction the wind is blowing from the marker being checked.
      </p>
      <h3>{section}.5. Variable Weather</h3>
      <p>If the wind is variable, there is a chance of the wind direction and/or speed changing.</p>
      <div className={"flex mb1em"}>
        <div>
          <CounterDisplay unit={vwind1} />
        </div>
        <div>&nbsp;</div>
        <div>
          <CounterDisplay unit={vwind2} />
        </div>
        <div>&nbsp;</div>
        <div>
          <CounterDisplay unit={vwind3} />
        </div>
        <div>&nbsp;</div>
        <div>
          <CounterDisplay unit={vwind4} />
        </div>
      </div>
      <p>Direction is checked first. Roll a single d10 and consult the following table:</p>
      <table>
        <tbody>
          <tr>
            <th>roll</th>
            <th>1-2</th>
            <th>3-8</th>
            <th>9-10</th>
          </tr>
          <tr>
            <td>effect</td>
            <td>shift counter-clockwise</td>
            <td>no effect</td>
            <td>shift clockwise</td>
          </tr>
        </tbody>
      </table>
      <p>Strength is checked next. Roll a single d10 and consult the following table:</p>
      <table>
        <tbody>
          <tr>
            <th>roll</th>
            <th>1</th>
            <th>2-9</th>
            <th>10</th>
          </tr>
          <tr>
            <td>effect</td>
            <td>weaken</td>
            <td>no effect</td>
            <td>strengthen</td>
          </tr>
        </tbody>
      </table>
      <p>
        Weaken or strengthen results in the wind being changed to the next weaker or stronger of
        calm, breeze, moderate, or strong. If the wind is already calm, it cannot weaken further so
        that result has no effect. Similarly the wind cannot strengthen if already strong.
      </p>
    </div>
  );
}
