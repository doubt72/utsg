import React from "react";
import { helpLink } from "./helpData";
import { SectionProps } from "../game/HelpDisplay";

export default function AssaultMoveSection({ section }: SectionProps) {
  return (
    <div>
      <p>
        Assault movement is a special form of {helpLink("Movement", "movement")}, i.e., an action
        that allows units to move from one hex to another or perform other actions. It has very
        different rules than ordinary movement, however.
      </p>
      <p>
        Infantry units and vehicles may perform assault movement. Infantry manning crewed weapons
        may not assault move, nor may unmanned crewed weapons or infantry weapons that are not being
        carried by an infantry unit.
      </p>
      <p>
        Assault movement is a movement of one hex, regardless of terrain costs or unit movement
        points. Impassable terrain may not be entered unless following a road (or a path if an
        infantry unit). Units may not move in such a way that would result in the stacking limit
        being exceeded unless entering an enemy occupied hex (in which case both players can exceed
        their own stacking limits).
      </p>
      <p>Unlike regular movement, infantry units (not vehicles) may enter enemy occupied hexes.</p>
      <h3>{section}.1. Group Assault Movement</h3>
      <p>
        Infantry units may assault move individually or in a stack with other infantry units.
        Leaders have no special effects on assault movement. Vehicles can only assault move
        individually.
      </p>
      <h3>{section}.2. Vehicles</h3>
      <p>
        Unlike movement, vehicles are not limited by their current facing and may assault move in
        any otherwise legal direction, and the vehicle will finish the assault movement facing along
        the direction of the move. If the unit has an armored turret, it may be rotated freely
        during an assault move.
      </p>
      <h3>{section}.3. Breakdowns</h3>
      <p>
        After any assault action, if a vehicle has a breakdown number, it makes a breakdown check.
        Breakdown checks are made immediately after moves but before the initiative check. To make a
        check, roll two ten-sided dice, adding the total together (2d10), and if the dice roll is
        equal or below that number, the vehicle is immobilized for the rest of the scenario.
      </p>
      <h3>{section}.4. Reaction Fire</h3>
      <p>There is no reaction fire after an assault move, only a regular initiative check.</p>
      <h3>{section}.5. Minefields</h3>
      <p>Infantry units (not vehicles) performing assault moves are unaffected by minefields.</p>
      <h3>{section}.6. Victory Point Hexes</h3>
      <p>
        Leaders cannot capture victory point hexes by themselves, only infantry or vehicles can
        (crewed and infantry weapons also can&apos;t capture victory hexes, nor can broken units, but
        none of those can move by themselves in the first place). However, leaders and broken units
        can hold victory hexes that opponents assault move into; VPs don&apos;t change ownership
        until those units are eliminated.
      </p>
      <h3>{section}.7. Status</h3>
      <p>
        Activated, exhausted, or broken units may not assault move. Pinned or immobilized units or
        units that otherwise have no movement points (i.e., tired and encumbered units with a
        resulting combined movement of zero) may not assault move. Mark units as exhausted after an
        assault move.
      </p>
    </div>
  );
}
