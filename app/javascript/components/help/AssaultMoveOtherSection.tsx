import React from "react";
import { ShieldFill, XLg } from "react-bootstrap-icons";
import { SectionProps } from "../game/HelpDisplay";

export default function AssaultMoveOtherSection({ section }: SectionProps) {
  return (
    <div>
      <p>
        The following actions may be made as an assault action; only one unit should be selected
        when clearing obstacles or entrenching (only one unit is needed to perform the action).
      </p>
      <h3>{section}.1. Clearing Obstacles</h3>
      <p>
        Engineering units (marked with a dot over their movement) may clear obstacles such as mines
        or wire if they start in the same turn with them. No dice roll is required, success is
        automatic.
      </p>
      <div className="flex mb1em">
        <div className="ml1em"></div>
        <div className="custom-button normal-button">
          <XLg />
          <span> clear obstacles</span>
        </div>
      </div>
      <h3>{section}.2. Entrenchment</h3>
      <p>
        Infantry squads or teams may entrench in most open terrain. The valid terrains are: open,
        brush, orchards, fields, or palm trees. Entrenchment is not possible in any other terrain,
        or if the base terrain is snow or mud. Entrenchment is also not possible if other features
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
    </div>
  );
}
