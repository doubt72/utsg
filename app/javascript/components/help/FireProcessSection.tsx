import React from "react";
import { helpLink } from "./helpData";
import { critHitDiff } from "../../utilities/utilities";
import { SectionProps } from "../game/HelpDisplay";

export default function FireProcessSection({ section }: SectionProps) {

  const fp = [1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 128]
  const hits = [...Array(19).keys()].reverse()

  return (
    <div>
      <p>
        Targets must be in range and if the weapon has a facing (i.e., guns and weapons mounted on
        vehicles or turrets), the target must be in the firing arc. If the unit is turreted, the
        turret may be turned as part of the firing process. See {helpLink("Facing", "facing")} for
        more.
      </p>
      <p>
        Before anything else, first determine if a targeting roll is required (i.e., if the
        firepower is circled).
      </p>
      <h3>{section}.1. Targeting Roll Process</h3>
      <p>A targeting roll is performed in the following manner:</p>
      <ol>
        <li>
          Determine the range modifier.
          <ol className="mt05em mb05em">
            <li>
              The base range modifier for all ranged weapons is 4, except weapons with black-filled
              range have a base modifier of 3.
            </li>
            <li>
              Subtract crew gun handling skill when operating a crewed weapon (unless firepower is
              filled black).
            </li>
            <li>Subtract leadership of unit carrying it whan using a radio.</li>
            <li>
              Add one if firing uphill, subtract one if firing downhill, unless a mortar (area
              effect weapon), then add one when firing downhill. Elevation has no effect on offboard
              artillery.
            </li>
            <li>Add one if vehicle has a green crew, subtract one if vehicle crew is elite.</li>
            <li>Add one if firing from a turret that was moved before firing.</li>
            <li>
              Add one if firing from a jammed turret, or firing a hull-mounted weapon on an
              immobilized vehicle.
            </li>
            <li>Add one if intensive fire.</li>
            <li>Add one if tired.</li>
            <li>Subtract one if reaction fire.</li>
            <li>Add one if raining, sand or dust, two if snowing or fog.</li>
            <li>Add one if night.</li>
          </ol>
        </li>
        <li>The adjusted range modifier can never be less than 1.</li>
        <li>Determine the distance from the firing unit to the target(s).</li>
        <li>Add any hindrance between the firing unit and the target to the above distance.</li>
        <li>Multiply the modifier by the result: this is the range check.</li>
        <li>
          Roll two d10 and multiply them together. If result is greater than the range check, the
          result is success, and the fire hits the target.
        </li>
      </ol>
      <h3>{section}.2. Weapons Breaking (Targeted Fire)</h3>
      <p>
        Regardless of whether the result is a hit, if the result is less than or equal to the break
        check number (circled red or yellow number on the left, or top circled red or yellow number
        if there are two), the weapon breaks. If red, the weapon is destroyed and removed from play
        (or marked as permanently broken if on a vehicle). If yellow, the marker is flipped and the
        weapon is broken (or the weapon is marked as broken on a vehicle). When checking for a
        break, the following may apply:
      </p>
      <ol className="mt05em mb1em">
        <li>Add one to the break check number if intensive fire.</li>
        <li>Add one to the break check number if firing an opponent&apos;s weapon.</li>
      </ol>
      <h3>{section}.3. Infantry and Rapid Fire</h3>
      <p>
        When using infantry fire or rapid firing, no targeting roll is required, instead hits are
        determined with the following table:
      </p>
      <table>
        <tbody>
          <tr>
            <th>Total FP</th>
            {fp.map((x) => (
              <th key={x}>{x}</th>
            ))}
          </tr>
          <tr>
            <td>Base To-Hit</td>
            {hits.map((x) => (
              <td key={x}>{x}</td>
            ))}
          </tr>
          <tr>
            <td>Critical Hit</td>
            {hits.map((x) => {
              const n = x + critHitDiff < 13 ? 13 : x + critHitDiff;
              return <td key={x}>{n < 21 ? n : "N/A"}</td>;
            })}
          </tr>
        </tbody>
      </table>
      <ol>
        <li>
          To determine a hit on units in a hex (this process is repeated for each hex targeted by
          rapid fire), first add up all firepower of the firing units (or if only one unit is
          firing, just that unit&apos;s firepower). Pinned units only get half firepower, rounded
          down. If there is a leader in the same hex, increase the firepower of each unit in the hex
          by the leader&apos;s leadership, or the highest leadership if more than one. This applies
          to either single or group fire, whether or not leader is involved in the fire action.
          Leaders out of range do not add their own firepower to the total (their only purpose in
          that case is to coordinate other units). Find the base to-hit for the first total FP equal
          to or below the combined firepower. E.g., if the firepower adds up to 9, use the base
          below 8, i.e., the base to-hit is 12.
          <ol className="mt05em mb05em">
            <li>
              Add the maximum hindrance between any of the firing units and the target hex to the
              base to-hit.
            </li>
            <li>Add one if any of the firing units are tired.</li>
            <li>
              Add one if rapid fire (rapid fire <b>must</b> target multiple hexes, otherwise
              consider the action to be infantry fire).
            </li>
            <li>Add one if firing from a turret and the turret has moved.</li>
            <li>Add two if intensive fire.</li>
            <li>Subtract one if all firing units are at a higher elevation than the target.</li>
            <li>Add one if any firing units are at a lower elevation than the target.</li>
            <li>
              Subtract one if the distance is half or less of the range of all of the firing units
              (rounded down, i.e., a unit with a range of 5 firing at a target 3 hexes away would
              not get this modifier).
            </li>
            <li>Subtract three if all units are adjacent to the target.</li>
            <li>Subtract one if reaction fire.</li>
            <li>Add one if raining, sand or dust, two if snowing or fog.</li>
            <li>Add one if night.</li>
          </ol>
        </li>
        <li>
          Roll 2d10 (add the two dice together). If the roll is higher than the adjusted to-hit, the
          result is a hit, otherwise no effect. A roll of 2 always misses (but 20 does not guarantee
          a hit).
        </li>
        <li>
          Rolling {critHitDiff} or more above the to-hit threshold (and also above 12) results in a{" "}
          <strong>critical</strong> hit, which results in a negative modifier to morale checks (see
          below). Critical hits have no other effect.
        </li>
      </ol>
      <h3>{section}.4. Weapons Breaking (Infantry and Rapid Fire)</h3>
      <p>
        Regardless of whether the result is a hit, if the result is less than or equal to the break
        check number (circled red or yellow number on the left, or top circled red or yellow number
        if there are two), the weapon breaks. If red, the weapon is destroyed and removed from play
        (or marked as permanently broken if on a vehicle). If yellow, the marker is flipped and the
        weapon is broken (or the weapon is marked as broken on a vehicle). When checking for a
        break, the following may apply:
      </p>
      <ol className="mt05em mb05em">
        <li>Add one to the break check number if intensive fire.</li>
        <li>
          Add one to the break check number if firing an opponent&apos;s weapon; breaking an
          opponent&apos;s weapon destroys it and it is removed from play.
        </li>
      </ol>
      <p>
        If the weapon is incendiary and breaks, the unit carrying it must pass a morale check to
        avoid breaking.
      </p>
      <h3>{section}.5. Offboard Artillery</h3>
      <p>
        Unlike other weapons, offboard artillery (radios) can be targeted at any hex, regardless of
        whether or not it contains units.
      </p>
      <p>
        Artillery (radios) are require the same targeting checks as other targeted fire. Treat
        artillery hits as a regular area hit. However, on a miss, use the following procedure:
      </p>
      <ol>
        <li>
          Roll d6 to determine direction: the directions are the same as wind directions, with 1
          being to the left and then rotating clockwise.
        </li>
        <li>Roll d10 to determine the drift, and use the following table to determine range:</li>
      </ol>
      <table>
        <tbody>
          <tr>
            <th>roll</th>
            <th>1-4</th>
            <th>5-7</th>
            <th>8-9</th>
            <th>10</th>
          </tr>
          <tr>
            <td>drift</td>
            <td>1</td>
            <td>2</td>
            <td>3</td>
            <td>4</td>
          </tr>
        </tbody>
      </table>
      <p>Wherever the drift lands, treat that hex as being hit by regular area fire.</p>
    </div>
  );
}
