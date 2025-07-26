import React from "react";
import { helpIndexByName } from "./helpData";
import { Link } from "react-router-dom";

export default function FireSection() {
  return (
    <div>
      <h1>Fire</h1>
      <p>
        Firing is the act of one (or more) units attacking one (or more) opponent units, possibly
        breaking, reducing, or eliminating them. The rules for firing,{" "}
        <Link to={`/help/${helpIndexByName("Intensive Fire").join(".")}`}>intensive fire</Link>, and{" "}
        <Link to={`/help/${helpIndexByName("Reaction Fire").join(".")}`}>reaction fire</Link> are
        the same, the only difference is a few modifiers and the status of the units or when the
        units may fire.
      </p>
      <p>
        Any non-activated, non-exhausted, or non-broken unit with firepower above zero may fire.
        Pinned and tired units may fire, albeit at a penalty. Weapons operated by pinned or broken
        or exhausted units may not fire — if you plan to use intensive fire separately with a
        machine gun and the unit carrying it, fire the machine gun first. Crewed weapons may not
        fire if operator is activated. Crews manning crewed weapons may not fire (the crewed weapon
        must be fired instead, until and unless the crew unmans the weapon). Crews will be activated
        when the weapon is fired.
      </p>
      <p>
        Both crewed weapons and infantry weapons cannot be targeted (or directly destroyed) by fire.
      </p>
      <p>
        Units (even units in the same hex) fire individually unless a leader is present, in which
        case, a fire group may be formed. Only infantry (not vehicles) and carried weapons that do
        not require a targeting roll (or ignore terrain) may be combined into a fire group. Units do
        not have to be continguous to form a fire group, they just must all be within range of a
        leader. Only units that are in range of all the units in the fire group (except the leader)
        may be targeted, and the firepower of the attack is the combined firepower of all the units
        in the group (minus leaders that are out of range). The worst hindrance from any of the
        firing units is used if they aren&apos;t all in the same hex. If all units in the fire group
        have rapid fire (except the leader), a rapid fire attack may be performed (see below),
        otherwise an infantry attack will be performed. To select a fire group in the game, select a
        unit in the same hex as the leader (it doesn&apos;t need to be the leader, but the leader
        must be the next unit selected to add more units after that).
      </p>
      <p>
        The only exception to units firing individually is that a carried weapon (that doesn&apos;t
        require a targeting roll or ignores terrain) may be combine its attack with the unit
        carrying it, e.g., an infantry squad could combine its attack with a machine gun it carries.
      </p>
      <h2>Types of Fire</h2>
      <p>There are five basic types of fire actions:</p>
      <ul>
        <li>
          <strong>Infantry Fire</strong>: infantry firing singly or in a fire group target all the
          units in a hex, except for weapons or armored vehicles (which can only be targeted by
          anit-armor capable weapons unless firing from a direction that would hit an unarmored
          side). This type of attack is indicated by unboxed, un-circled range.
        </li>
        <li>
          <strong>Rapid Fire</strong>: units with boxed range can perform rapid fire, either in a
          fire group (e.g., infantry carried machine guns) or singly (any unit with boxed range
          including vehicles). Rapid fire units may target any (non-armored) units in contiguous
          hexes; the targeted units must be contiguous, they can&apos;t be connected through other
          units. All the non-weapon, non-armored units in all of those hexes will be attacked. When
          the rapid fire attack is made, separate die rolls are made for each targeted hex, each
          with their own hindrance.
        </li>
        <li>
          <strong>Targeted Fire</strong>: the above two type of fire don&apos;t require a separate
          targeting roll, all other types of fire do, and have circled fire (or hexed in the case of
          offboard fire). All non-infantry, non-rapid fire first requires a targeting roll to see if
          the round hits, and then (possibly) a second roll for effect if targeting infantry or
          armored units (any hit of an unarmored vehicle destroys it without needing the second
          roll). When targeted fire (not of the last two types below) is used, the target must
          either be a single vehicle or will be all the infantry in a hex. (Note that this is
          different than infantry fire: infantry fire targets all the units in a hex that it can
          hit, vehicles or not).
        </li>
        <li>
          <strong>Area Fire</strong>: area fire is another sort of targeted fire performed by
          mortars or a few other weapons, indicated by a line above the firepower number, and it
          affects all units in a hex. Units that are not fully armored are treated as non-armored
          units for the purposes of area fire, and otherwise armor penetration checks are required.
        </li>
        <li>
          <strong>Offboard Artillery</strong>: another sort of area fire called in from offboard by
          units carrying a radio, and is indicated with a hexagon around the unit&apos;s firepower.
          Unlike all other targeted fire, misses will drift and may hit other hexes, including hexes
          with friendly units.
        </li>
      </ul>
      <p>
        Note that if firing affects all units in a hex or all units of a certain type, it does not
        distinguish between players; if units from both players occupy a targeted hex, all units
        will be affected by the fire action.
      </p>
      <p>There are fire types of firepower effects:</p>
      <ul>
        <li>
          <strong>Anti-Tank</strong>: gets full firepower effect against armored vehicles, gets half
          effect against infantry. Indicated with a white-filled firepower circle.
        </li>
        <li>
          <strong>High-Explosive</strong>: anti-infantry but anti-armor capable: gets full firepower
          effect against infantry, gets half effect against armored vehicles. Indicated with a
          non-filled firepower circle. Also offboard artillery&apos;s unfilled hexagon.
        </li>
        <li>
          <strong>Light Weapons</strong>: indicated by either squared firepower or firepower with no
          circle, square, or hexagon around it. Completely ineffective at any range against armored
          vehicles.
        </li>
        <li>
          <strong>incendiary</strong>: indicated with yellow (or red) square; negates cover for
          infantry and may target armored vehicles (and ignores armor on hit).
        </li>
        <li>
          <strong>Single-Shot</strong>: indicated with black square or circle; weapon is removed
          after use (whether it hits or not). Red square indicates both this and incendiary weapons
          that ignore terrain.
        </li>
      </ul>
      <p>
        Firepower is also halved if using a turreted weapon and the turret is jammed, or using a
        sponsoned or hull-mounted weapon and the unit is immobilized.
      </p>
      <h2>Firing Process</h2>
      <p>
        After choosing firing unit(s) and target(s), first determine if a targeting roll is needed
        (i.e., if the firepower is circled). Targets must be in range and if the weapon has a facing
        (i.e., guns and weapons mounted on vehicles or turrets), the target must be in the firing
        arc. See <Link to={`/help/${helpIndexByName("Facing").join(".")}`}>facing</Link> for more. A
        targeting roll is performed in the following manner:
      </p>
      <ol>
        <li>
          Determine the range modifier.
          <ol className="mt05em mb05em">
            <li>
              The base range modifier for crewed weapons (excluding mortars) and offboard artillery
              is 4. All other units have a base modifier of three.
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
              Add one if firing from a jammed turret, or firing a sponsoned or hull-mounted weapon
              on an immobilized vehicle.
            </li>
            <li>Add one if intensive fire.</li>
            <li>Add one if raining, sand or dust, two if snowing or fog.</li>
          </ol>
        </li>
        <li>Determine the distance from the firing unit to the target(s).</li>
        <li>Add any hindrance between the firing unit and the target to the above distance.</li>
        <li>Multiply the modifier by the result: this is the range check.</li>
        <li>
          Roll two d10 (dice with 1-10 are used by the game), multiply them together. If result is
          greater than the range check, the result is success, and the fire hits the target.
        </li>
        <li>
          Regardless of whether the result is a hit, if the result is less than or equal to the
          break check number (circled red or yellow number on the left, or top circled red or yellow
          number if there are two), the weapon breaks. If red, the weapon is destroyed and removed
          from play (or marked as permanently broken if on a vehicle). If yellow, the marker is
          flipped and the weapon is broken (or the weapon is marked as broken on a vehicle). When
          checking for a break, the following may apply:
          <ol className="mt05em mb05em">
            <li>Add one to the break check number if intensive fire.</li>
            <li>Add one to the break check number if firing an opponent&apos;s weapon.</li>
          </ol>
        </li>
      </ol>
      <p>
        When infantry or rapid firing, no targeting roll is required, instead hits are determined
        with the following table:
      </p>
      <table>
        <tbody>
          <tr>
            <th>Total FP</th>
            <th>1</th>
            <th>2</th>
            <th>3</th>
            <th>4</th>
            <th>5</th>
            <th>6</th>
            <th>8</th>
            <th>10</th>
            <th>12</th>
            <th>16</th>
            <th>20</th>
            <th>24</th>
            <th>32</th>
            <th>40</th>
            <th>48</th>
            <th>64</th>
            <th>80</th>
            <th>96</th>
            <th>128</th>
          </tr>
          <tr>
            <td>Base To-Hit</td>
            <td>20</td>
            <td>19</td>
            <td>18</td>
            <td>17</td>
            <td>16</td>
            <td>15</td>
            <td>14</td>
            <td>13</td>
            <td>12</td>
            <td>11</td>
            <td>10</td>
            <td>9</td>
            <td>8</td>
            <td>7</td>
            <td>6</td>
            <td>5</td>
            <td>4</td>
            <td>3</td>
            <td>2</td>
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
          to either single or group fire. Find the base to-hit for the first total FP equal to or
          below the combined firepower. Leaders out of range are not included. E.g., if the
          firepower adds up to 11, use the base below 10, i.e., the base to-hit is 13.
          <ol className="mt05em mb05em">
            <li>
              Add the maximum hindrance between any of the firing units and the target hex to the
              base to-hit.
            </li>
            <li>Add one if the distance is more than half the range of any of the firing units.</li>
            <li>Add one if any of the firing units are tired.</li>
            <li>
              Add one if rapid fire (rapid fire <b>must</b> target multiple hexes, otherwise
              consider the action to be infantry fire).
            </li>
            <li>Add one if firing from a turret and the turret has moved.</li>
            <li>Add two if intensive fire.</li>
            <li>Subtract one if all firing units are at a higher elevation than the target.</li>
            <li>Add one if any firing units are at a lower elevation than the target.</li>
            <li>Subtract one if all units are adjacent to the target.</li>
          </ol>
        </li>
        <li>
          Roll 2d10 (add the two dice together). If the roll is higher than the adjusted to-hit, the
          result is a hit, otherwise no effect. A roll of 2 always misses (but 20 does not guarantee
          a hit).
        </li>
        <li>
          Regardless of whether the result is a hit, if the result is less than or equal to the
          break check number (circled red or yellow number on the left, or top circled red or yellow
          number if there are two), the weapon breaks. If red, the weapon is destroyed and removed
          from play (or marked as permanently broken if on a vehicle). If yellow, the marker is
          flipped and the weapon is broken (or the weapon is marked as broken on a vehicle). When
          checking for a break, the following may apply:
          <ol className="mt05em mb05em">
            <li>Add one to the break check number if intensive fire.</li>
            <li>
              Add one to the break check number if firing an opponent&apos;s weapon; breaking an
              opponent&apos;s weapon destroys it and it is removed from play.
            </li>
          </ol>
          If the weapon is incendiary and breaks, the unit carrying it must pass a morale check to
          avoid breaking.
        </li>
      </ol>
      <p>When fire is complete, mark all firing units as activated.</p>
      <h2>Offboard Artillery</h2>
      <p>
        Unlike other weapons, offboard artillery (radios) can be targeted at hexes with no units.
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
        <li>Roll d10 to determin the drift, and use the following table to determine range:</li>
      </ol>
      <table>
        <tbody>
          <tr>
            <th>roll</th>
            <th>1-2</th>
            <th>3-4</th>
            <th>5-6</th>
            <th>7</th>
            <th>8</th>
            <th>9</th>
            <th>10</th>
          </tr>
          <tr>
            <td>drift</td>
            <td>1</td>
            <td>2</td>
            <td>3</td>
            <td>4</td>
            <td>5</td>
            <td>6</td>
            <td>7</td>
          </tr>
        </tbody>
      </table>
      <p>Wherever the drift lands, treat that hex as being hit by regular area fire.</p>
      <h2>Hit Effects</h2>
      <p>The effect of fire varies by target.</p>
      <ul>
        <li>
          If firing on infantry with infantry or rapid fire, if the target is hit, they must perform
          morale checks (see below).
        </li>
        <li>
          If firing on an unarmored vehicle, if the target is hit by targeted or infantry fire, the
          unit is destroyed.
        </li>
        <li>
          If firing on infantry with targeted fire and the targeting rolls succeeds, perform the
          same attack as used above with infantry fire, except with no modifiers and no weapon break
          check. If successful, perform morale checks on the infantry units.
        </li>
        <li>
          If firing on an armored vehicle with targeted fire, use the following process to determine
          hits:
          <ol className="mt05em mb05em">
            <li>
              Find the base to-hit for the weapon&apos;s firepower. Remember to halve the amount if
              using non-anti-armor weapons or if the turret is jammed, etc.
            </li>
            <li>
              If the vehicle has a turret, determine if a turret or hull hit: roll d10, 1-3 hits the
              turret, 4-10 hits the hull.
            </li>
            <li>
              Determine if fire hits front, side, or rear of the target. If that part of the vehicle
              is unarmored, the vehicle is destroyed. Otherwise add the relevant armor factor to the
              base to-hit.
            </li>
            <li>Subtract one if targeting the side of the hull.</li>
            <li>Subtract one if point-blank range (i.e., firing from an adjacent hex).</li>
            <li>Subtract one if target is immobilized.</li>
            <li>
              Add one if range is greater than half weapon range (rounded up, i.e., unit with range
              of one is never affected by this modifier).
            </li>
            <li>
              Roll 2d10 (add the two dice together). If the roll is higher than the adjusted to-hit,
              the vehicle is destroyed. A roll of 2 always misses (but 20 does not guarantee a hit).
              If roll is equal to adjusted to-hit, the vehicle is immobilized (if targeting hull) or
              the turret is jammed (if targeting turret).
            </li>
          </ol>
        </li>
        <li>
          If firing area weapons (mortars, offboard artillery or satchel charges), infantry are
          targeted separately from vehicles. For all of the infantry, use a single check for effect
          (i.e., use the firepower chart as if it was an infantry attack but no modifiers). Then for
          each fully-armored units, fire as targeted fire above (don&apos;t forget to halve
          firepower), but don&apos;t check for turret or hull hit, use lowest armor value (whether
          turret or hull) and no other modifiers. Ties immobilize vehicle. Unarmored or partially
          armored vehicles are destroyed.
        </li>
        <li>
          If firing incendiary weapons, perform a normal infantry fire roll, but cover doesn&apos;t
          apply to morale checks, vehicles are handled separately like other area attacks, all armor
          is considered zero, and unarmored or partially armored vehicles are automatically
          destroyed.
        </li>
      </ul>
      <p>
        Infantry and crewed weapons are not damaged or eliminated when units carrying them or
        crewing them are eliminated (except incendiary weapons which are removed with their carrying
        unit). Weapons are left on the map and can be picked up by other units (of either side).
      </p>
      <p>
        If a vehicle carrying infantry is destroyed, all of the infantry units are broken (weapons
        are unaffected). Vehicles are replaced with wrecks with the same size (flip the counter).
        Wrecks affect stacking (for both sides) but otherwise have no other effects.
      </p>
      <h2>Morale Checks</h2>
      <p>
        If any infantry units are hit (or is carrying an incendiary weapon that breaks during the
        firing action), they must perform morale checks. To perform a morale check, use the
        following process:
      </p>
      <ol>
        <li>The base check is 15.</li>
        <li>Subtract the unit&apos;s morale.</li>
        <li>
          If there are any (unbroken) leaders in the same hex, subtract the highest leadership.
        </li>
        <li>Subtract cover (unless the attack was from an incendiary weapon).</li>
        <li>Add one if pinned.</li>
        <li>
          Roll 2d10. If the result is equal to the modified check, pin the unit, unless it was
          reaction fire, then break it. If the result is less than the modified check, break it. If
          the unit was already broken, eliminate it. A roll of 2 always fails. A roll of 20 always
          succeeds.
        </li>
      </ol>
      <h2>Smoke</h2>
      <p>
        If a targeted fire weapon can fire smoke (indicated by a dot over the firepower), they may
        choose to do so instead of firing on an enemy unit. Instead of choosing an enemy unit as a
        target, choose a hex (occupied or not) and the target roll proceeds normally. On success,
        roll d10 to determine how heavy the resulting smoke is, and a smoke marker is placed in the
        hex:
      </p>
      <table>
        <tbody>
          <tr>
            <th>roll</th>
            <th>result</th>
          </tr>
          <tr>
            <td>
              <strong>1-4</strong>
            </td>
            <td>smoke hindrance 1</td>
          </tr>
          <tr>
            <td>
              <strong>5-7</strong>
            </td>
            <td>smoke hindrance 2</td>
          </tr>
          <tr>
            <td className="pr05em">
              <strong>8-9</strong>
            </td>
            <td>smoke hindrance 3</td>
          </tr>
          <tr>
            <td>
              <strong>10</strong>
            </td>
            <td>smoke hindrance 4</td>
          </tr>
        </tbody>
      </table>
      <p>
        Offboard artillery firing smoke works the same way, except on a miss, smoke is placed in the
        drift hex.
      </p>
      <h2>Blazes</h2>
      <p>
        If a vehicle is destroyed, or an incendiary or area attack (mortar or offboard artillery or
        satchel charges) occurs in a hex, there is a chance of a fire (blaze) starting. If the base
        terrain is snow or mud, or it&apos;s foggy, raining, or snowing, or if the hex being checked
        is marsh, soft ground, or water, there&apos;s no chance of a fire starting, so skip this
        check. Otherwise, roll d10. For forest, building, brush, field, or orchard terrain, fires
        start on a 1 or 2. For all other terrain, on a 1. Add one to fire check number if incendiary
        attack (i.e., fires start in buildings on a 1, 2, or 3). If the vehicle being destroyed has
        an indendiary attack, add two to the fire check number. If there are any units in the hex,
        the player chooses another (single) hex to move them to (if both players have units, both
        players can choose a hex, initiative player first. They don&apos;t need to be the same hex).
        If the hex contained smoke, it is removed, but all other features remain in the same hex, as
        do wrecks, dropped infantry weapons, or unmanned crewed weapons.
      </p>
    </div>
  );
}
