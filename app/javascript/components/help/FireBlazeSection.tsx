import React from "react";
import { SectionProps } from "../game/HelpDisplay";

export default function FireBlazeSection({ section }: SectionProps) {

  return (
    <div>
      <p>
        If a vehicle is destroyed, or an incendiary or area attack (mortar or offboard artillery or
        satchel charges) occurs in a hex, there is a chance of a fire (blaze) starting. Consult the
        following table to determine the base chance of a fire starting:
      </p>
      <table>
        <tbody>
          <tr>
            <th>base</th>
            <th>terrain, etc.</th>
          </tr>
          <tr>
            <td>
              <strong>4</strong>
            </td>
            <td>vehicle destroyed</td>
          </tr>
          <tr>
            <td>
              <strong>3</strong>
            </td>
            <td>forest, building, brush, palm trees, grain, orchard</td>
          </tr>
          <tr>
            <td>
              <strong>2</strong>
            </td>
            <td>any other terrain not listed</td>
          </tr>
          <tr>
            <td>
              <strong>1</strong>
            </td>
            <td>sand or base terrain is desert</td>
          </tr>
          <tr>
            <td>
              <strong>no chance</strong>
            </td>
            <td>marsh, soft ground, water, or base terrain is snow or mud</td>
          </tr>
        </tbody>
      </table>
      <p>
        There&apos;s also no chance when it&apos;s foggy, raining, or snowing, otherwise add two if
        the fire was an incendiary attack, and another two if the vehicle being destroyed had an
        incendiary attack.
      </p>
      <p>
        Roll 2d10. If at or below the chance of starting, a fire starts and place a blaze marker in
        the hex.
      </p>
      <h3>{section}.1. Displacement</h3>
      <p>
        If a fire starts and there are any units in the hex, the player chooses another hex to move
        them to (if both players have units, both players can choose a hex, initiative player first.
        Units don&apos;t need to be all be displaced to the same hex). If the hex contained smoke,
        it is removed, but all other features remain in the same hex, as do wrecks, dropped infantry
        weapons, or unmanned crewed weapons. If a unit is manning a crewed weapon, it is abandoned.
      </p>
      <p>
        Units are eliminated if they have nowhere legal to displace; i.e., they cannot cross or
        enter forbidden terrain, enter hexes with enemy units, or cause the stacking limit to be
        exceeded.
      </p>
    </div>
  );
}
