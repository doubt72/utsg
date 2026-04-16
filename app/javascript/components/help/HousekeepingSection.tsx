import React from "react";
import { stackLimit } from "../../utilities/utilities";
import CounterDisplay from "../game/CounterDisplay";
import Marker from "../../engine/Marker";
import { featureType, markerType, weatherType, windType } from "../../utilities/commonTypes";
import Feature from "../../engine/Feature";

export default function HousekeepingSection() {
  const section = "5.2.4.2"

  const wind1 = new Marker({ mk: 1, type: markerType.Wind, subtype: windType.Calm })
  const wind2 = new Marker({ mk: 1, type: markerType.Wind, subtype: windType.Breeze })
  const wind3 = new Marker({ mk: 1, type: markerType.Wind, subtype: windType.Moderate })
  const wind4 = new Marker({ mk: 1, type: markerType.Wind, subtype: windType.Strong })

  const smoke1 = new Feature({ ft: 1, t: featureType.Smoke, n: "Smoke", i: "smoke", h: 4, id: "smoke1" })

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
      <p>
        Infantry support and crewed weapons may not be selected to be removed if assigned to an infantry
        unit.  Dropped support weapons and uncrewed weapons may be selected (in other words, infantry
        unit operating the weapon must be removed first, or if capturing a hex that had opponent weapons,
        those may be removed to bring the stack under the stacking limit if the player&apos;s stack
        would have otherwise been legal).  Unbroken, unpinned squads may
        be split at this time.  Wrecks may not be removed.
      </p>
      <p>
        The game ends on the last turn after this phase; there&apos;s no reason to update status,
        check smoke, or check variable weather as it can no longer have any effect on the game, and
        the chance that blazes spreading could is infinitessimal even if it wasn&apos;t skipped.
      </p>
      <h3>{section}.2. Updating Unit Status and Initiative</h3>
      <p>
        At this point, all activated, pinned, tired, and routed markers are removed, and any exhausted
        markers are replaced with tired markers.
      </p>
      <p>
        Also, if initiative value is greater than 16, it is reduced to 16 on the same side.
      </p>
      <h3>{section}.3. Checking for Smoke Dispersion</h3>
      <p>
        If any hexes contain a smoke marker, the smoke will disperse at least a little every turn.
        The amount of dispersion depends on the wind speed along with a small random factor.
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
        The <strong>sd</strong> numbers on the current wind marker are the total hindrance of smoke in a hex that
        may disperse. Each hex containing smoke is checked separately: a single d10 is rolled, and the
        following table is checked:
      </p>
      <table>
        <tbody>
          <tr>
            <th>roll</th>
            <th>result</th>
          </tr>
          <tr>
            <td>
              <strong>1-2</strong>
            </td>
            <td>low number</td>
          </tr>
          <tr>
            <td>
              <strong>3-8</strong>
            </td>
            <td>middle number</td>
          </tr>
          <tr>
            <td className="pr05em">
              <strong>9-10</strong>
            </td>
            <td>high number</td>
          </tr>
        </tbody>
      </table>
      <div className={"flex mb1em"}>
        <div>
          <CounterDisplay unit={smoke1} />
        </div>
      </div>
      <p>
        For example, if the wind was moderate and a 2 was rolled smoke in a given hex, the a smoke marker
        would be reduced by 3.  If the current hindrance of the smoke marker was 4, it would be reduced to 1;
        any smoke with a hindrance lower than that would be removed from the board completely.
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
        Weaken results in the wind being changed to the next weaker of calm, breeze, moderate,
        or strong.  Strengthen results in the wind being changed in the opposite order.
        If the wind is already calm, it cannot weaken further so that result has no effect.
        Similarly the wind cannot strengthen if it is already strong.
      </p>
    </div>
  );
}
