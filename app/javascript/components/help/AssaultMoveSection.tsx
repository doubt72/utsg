import React from "react";
import { helpIndexByName } from "./helpData";
import { Link } from "react-router-dom";
import { ShieldFill, XLg } from "react-bootstrap-icons";

export default function AssaultMoveSection() {
  const section = "5.2.3.5"
  return (
    <div>
      <p>
        Assault movement is a special form of{" "}
        <Link to={`/help/${helpIndexByName("Move").join(".")}`}>movement</Link>, i.e., an action
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
        infantry unit). Unlike movement, vehicles are not limited by their current facing and may
        assault move in any otherwise legal direction, and the vehicle will finish the assault
        movement facing along the direction of the move. If the unit has an armored turret, it may
        be rotated freely during an assault move.
      </p>
      <p>
        Infantry units may assault move individually or in a stack with other infantry units.
        Leaders have no special effects on assault movement. Vehicles can only assault move
        individually. A player may not move in such a way that would result in the stacking limit
        being exceeded unless entering an enemy occupied hex (in which case both players can exceed
        their own stacking limits).
      </p>
      <p>Unlike regular movement, units may enter enemy occupied hexes.</p>
      <p>
        There is no reaction fire after an assault move, only a regular initiative check. If the
        unit has a breakdown roll, perform a breakdown check before the initiative check.
      </p>
      <p>
        Units performing assault moves are unaffected by minefields.
      </p>
      <p>
        Activated, exhausted, or broken units may not assault move. Pinned or immobilized units or
        units that otherwise have no movement points (i.e., tired and encumbered units with a
        resulting combined movement of zero) may not assault move. Mark units as exhausted after an
        assault move.
      </p>
      <h3>{section}.1. Additional Actions</h3>
      <p>
        Engineering units (marked with a dot over their movement) may clear obstacles such as mines
        or wire if they start in the same turn with them. No dice roll is required, success is
        automatic. Remove the obstacle and end the move.
      </p>
      <div className="flex mb1em">
        <div className="ml1em"></div>
        <div className="custom-button normal-button">
          <XLg />
          <span> clear obstacles</span>
        </div>
      </div>
      <p>
        Infantry squads or teams may entrench in most open terrain. The valid terrains are: open,
        brush, orchards, fields, or palm trees. Entrenchment is not possible in any other terrain,
        or if the base terrain is snow. Entrenchment is also not possible if other features
        (including both defensive features and obstacles) are present. Entrenchments are not
        possible in hexes with streams, gullies, trenches, or railroads, but is permitted in hexes
        with roads. No dice roll is required, success is automatic. Place a shell scrape in the hex
        beneath the unit(s) and end the move.
      </p>
      <div className="flex mb1em">
        <div className="ml1em"></div>
        <div className="custom-button normal-button">
          <ShieldFill />
          <span> entrench</span>
        </div>
      </div>
      <p>
        Only one unit should be selected when clearing obstacles or entrenching (only one unit is
        needed to perform the action).
      </p>
    </div>
  );
}
