import React from "react";
import { baseMorale, critMorale } from "../../utilities/utilities";
import { SectionProps } from "../game/HelpDisplay";

export default function FireEffectsSection({ section }: SectionProps) {

  return (
    <div>
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
          If firing on infantry with targeted fire and the targeting rolls succeeds, follow the
          infantry fire process above, except with no modifiers and no weapon break check. Critical
          hits apply. If successful, perform morale checks on the infantry units.
        </li>
        <li>
          If firing on an armored vehicle with targeted fire, use the following process to determine
          hits:
          <ol className="mt05em mb05em">
            <li>
              Find the base to-hit for the weapon&apos;s firepower (use the same table as with
              infantry fire). Remember to halve the amount if using non-anti-armor weapons.
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
            <li>Subtract two if target is immobilized.</li>
            <li>Subtract two if targeting the side of the hull.</li>
            <li>Subtract three if point-blank range (i.e., firing from an adjacent hex).</li>
            <li>
              Subtract one if range is less than half weapon range, but not point blank (rounded
              down, i.e., a weapon range of 5 firing at a range of 3 does not subtract one).
            </li>
            <li>
              Roll 2d10 (add the two dice together). If the roll is higher than the adjusted to-hit,
              the vehicle is destroyed. A roll of 2 always fails to penetrate (but 20 does not
              guarantee a kill). If roll is equal to adjusted to-hit, the vehicle is immobilized (if
              targeting hull) or the turret is jammed (if targeting turret).
            </li>
          </ol>
        </li>
        <li>
          If firing area weapons (mortars, offboard artillery or satchel charges), infantry are
          targeted separately from vehicles. For all of the infantry, use a single check for effect
          (i.e., use the firepower chart as if it was an infantry attack but no modifiers. Critical
          hits do apply). Then for each fully-armored units, fire as targeted fire above (don&apos;t
          forget to halve firepower), but don&apos;t check for turret or hull hit, use lowest armor
          value (whether turret or hull) and no other modifiers. Ties immobilize vehicle. Unarmored
          or partially armored vehicles are destroyed.
        </li>
        <li>
          If firing incendiary weapons, perform a normal infantry fire roll, but cover doesn&apos;t
          apply to morale checks, vehicles are handled separately like other area attacks, all armor
          is considered zero, and unarmored or partially armored vehicles are destroyed.
        </li>
      </ul>
      <h3>{section}.1. Destroyed Vehicles</h3>
      <p>
        If a vehicle carrying infantry is destroyed, all of the infantry units are broken (weapons
        are unaffected). Vehicles are replaced with wrecks with the same size (flip the counter).
        Wrecks affect stacking (for both sides) but otherwise have no other effects.
      </p>
      <h3>{section}.2. Morale Checks</h3>
      <p>
        If any infantry units are hit (or is carrying an incendiary weapon that breaks during the
        firing action), they must perform morale checks. To perform a morale check, use the
        following process:
      </p>
      <ol>
        <li>The base check is {baseMorale}.</li>
        <li>Subtract the unit&apos;s morale.</li>
        <li>
          If there are any (unbroken) leaders in the same hex, subtract the highest leadership.
        </li>
        <li>Subtract cover (unless the attack was from an incendiary weapon).</li>
        <li>Add one if pinned.</li>
        <li>Add {critMorale} if a critical hit.</li>
        <li>
          Roll 2d10 (add them together). If the result is equal to the modified check, pin the unit.
          If the result is less than the modified check, break it, or if the unit was already
          broken, eliminate it. A roll of 2 always fails. A roll of 20 always succeeds.
        </li>
      </ol>
      <h3>{section}.3. Weapons Carried by Eliminated Units</h3>
      <p>
        Infantry and crewed weapons are not damaged or eliminated when units carrying them or
        crewing them are eliminated (except incendiary weapons which are removed with their carrying
        unit). Weapons are left on the map and can be picked up by other units (of either side, except
        radios, which can only be used by the original side).
      </p>
    </div>
  );
}
