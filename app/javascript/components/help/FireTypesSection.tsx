import React from "react";
import { SectionProps } from "../game/HelpDisplay";

export default function FireTypesSection({ section }: SectionProps) {

  return (
    <div>
      <p>There are several types of fire actions and firepower in the game.</p>
      <h3>{section}.1. Types of Fire Actions</h3>
      <p>There are five types of fire actions:</p>
      <div className="ml1em">
        <h4>{section}.1.1. Infantry Fire</h4>
        <p>
          Infantry firing singly or in a fire group target all the units in a hex, except for
          weapons or armored vehicles (which can only be targeted by anit-armor capable weapons
          unless firing from a direction that would hit an unarmored side). This type of attack is
          indicated by unboxed, un-circled range.
        </p>
        <h4>{section}.1.2. Rapid Fire</h4>
        <p>
          Units with boxed range can perform rapid fire, either in a fire group (e.g., infantry
          carried machine guns) or singly (any unit with boxed range including vehicles). Rapid fire
          units may target any (non-armored) units in contiguous hexes; the targeted units must be
          contiguous, they can&apos;t be connected through other units. All the non-weapon,
          non-armored units in all of those hexes will be attacked. When the rapid fire attack is
          made, separate die rolls are made for each targeted hex, each with their own hindrance
          (so note that the chance of a weapon breaking increases by the number of targets).
        </p>
        <h4>{section}.1.3. Targeted Fire</h4>
        <p>
          The above two type of fire don&apos;t require a separate targeting roll, all other types
          of fire do, and have circled fire (or hexed in the case of offboard fire). All
          non-infantry, non-rapid fire first requires a targeting roll to see if the round hits, and
          then (possibly) a second roll for effect if targeting infantry or armored units (any hit
          of an unarmored vehicle destroys it without needing the second roll). When targeted fire
          (not of the last two types below) is used, the target must either be a single vehicle or
          will be all the infantry in a hex. (Note that this is different than infantry fire:
          infantry fire targets all the units in a hex that it can hit, vehicles or not).
        </p>
        <h4>{section}.1.4. Area Fire</h4>
        <p>
          Area fire is another sort of targeted fire performed by mortars or a few other weapons,
          indicated by a line below the firepower number, and it affects all units in a hex. Units
          that are not fully armored are treated as non-armored units for the purposes of area fire,
          and otherwise armor penetration checks are required.
        </p>
        <h4>{section}.1.5. Offboard Artillery</h4>
        <p>
          Another sort of area fire called in from offboard by units carrying a radio, and is
          indicated with a hexagon around the unit&apos;s firepower. Unlike all other targeted fire,
          misses will drift and may hit other hexes, including hexes with friendly units. This type
          of weapon cannot be operated by an opponent.
        </p>
      </div>
      <h3>{section}.2. Mixed Units</h3>
      <p>
        If firing affects all units in a hex or all units of a certain type, it does not
        distinguish between players; if units from both players occupy a targeted hex, all units
        will be affected by the fire action.
      </p>
      <h3>{section}.3. Types of Firepower</h3>
      <p>There are five types fire types of firepower:</p>
      <div className="ml1em">
        <h4>{section}.2.1. Light Weapons</h4>
        <p>
          Indicated by either squared firepower or firepower with no circle, square, or hexagon
          around it. Completely ineffective at any range against armored vehicles and may not target
          them.
        </p>
        <h4>{section}.2.2. Anti-Tank</h4>
        <p>
          Gets full firepower effect against armored vehicles, gets half effect against infantry.
          Indicated with a white-filled firepower circle.
        </p>
        <h4>{section}.2.3. High-Explosive</h4>
        <p>
          Anti-infantry but anti-armor capable: gets full firepower effect against infantry, gets
          half effect against armored vehicles. Indicated with a non-filled firepower circle. Also
          offboard artillery&apos;s unfilled hexagon.
        </p>
        <h4>{section}.2.4. incendiary</h4>
        <p>
          Indicated with yellow (or red) square; negates cover for infantry and may target armored
          vehicles (and ignores armor on hit).
        </p>
        <h4>{section}.2.5. Single-Shot</h4>
        <p>
          Indicated with black square or circle; weapon is removed after use (whether it hits or
          not). Red square indicates both this and incendiary weapons that ignore terrain.
        </p>
      </div>
      <h3>{section}.4. Jammed Turrets and Immobilized Units</h3>
      <p>
        Firepower is also halved if using a turreted weapon and the turret is jammed, or using a
        hull-mounted weapon and the unit is immobilized.
      </p>
    </div>
  );
}
