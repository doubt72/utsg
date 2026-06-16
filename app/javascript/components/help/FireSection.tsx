import React from "react";
import { helpLink } from "./helpData";
import { SectionProps } from "../game/HelpDisplay";

export default function FireSection({ section }: SectionProps) {

  return (
    <div>
      <p>
        Firing is the act of one (or more) units attacking one (or more) opponent units, possibly
        breaking, reducing, or eliminating them. The rules for firing,{" "}
        {helpLink("Intensive Fire", "intensive fire")}, and{" "}
        {helpLink("Reaction Fire", "reaction fire")} are the same, except a few different
        modifiers apply.
      </p>
      <h3>{section}.1. Firing</h3>
      <p>
        Any non-activated, non-exhausted, or non-broken unit with firepower above zero may fire.
        Pinned and tired units may fire, albeit at a penalty. Weapons operated by pinned or broken
        or exhausted units may not fire — if you plan to use intensive fire separately with a
        machine gun and the unit carrying it, fire the machine gun first. Crewed weapons may not
        fire if the operator is activated. Crews manning crewed weapons may not fire (the crewed weapon
        must be fired instead, until and unless the crew unmans the weapon). Crews will be activated
        when the weapon is fired.
      </p>
      <h3>{section}.2. Targeting Infantry Weapons and Crewed Weapons</h3>
      <p>
        Neither crewed weapons or infantry weapons may be targeted (or directly destroyed) by fire,
        only the infantry units or leaders carrying or manning them.
      </p>
      <h3>{section}.3. Fire Groups</h3>
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
        unit in the same hex as the leader (it shouldn&apos;t be the leader, but the leader
        must be the next unit selected to add additional units).
      </p>
      <p>
        The only exception to units firing individually is that a carried weapon (that doesn&apos;t
        require a targeting roll or ignores terrain) may be combine its attack with the unit
        carrying it, e.g., an infantry squad could combine its attack with a machine gun it carries.
      </p>
      <h3>{section}.6. After Firing</h3>
      <p>When fire is complete, mark all firing units as activated.</p>
    </div>
  );
}
