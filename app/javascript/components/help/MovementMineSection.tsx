import React from "react";
import { helpLink } from "./helpData";

export default function MovementMineSection() {
  return (
    <div>
      <p>
        If moving into a minefield, all movement must stop, and an attack occurs (the attack is
        skipped if infantry are moving into an antitank minefield, or if armored vehicles move into
        an anitpersonnel minefield. Other minefields attack both). Roll two ten-sided dice, adding
        the total together (2d10): if attacking infantry and the roll is above the base to-hit value
        for the firepower in the fire table (see the {helpLink("Fire", "fire")}) section of the
        docs, morale checks are required (with no cover modifiers, also see the morale section for
        those). If attacking vehicles, take the lowest hull armor (or zero if not completely
        armored), add it to the base to-hit value, and if the roll was above that number, the
        vehicle is destroyed.
      </p>
      <p>
        All unarmored vehicles are automatically destroyed when they move into a minefield.
        Anti-tank mines have no effect on bicycles or horses, but do affect motorcycles, which are
        automatically destroyed. Note that horse cavalry requires a hit roll as above, which
        triggers a morale check for both the horse and any carried infantry.
      </p>
      <p>Note that minefields alos never get critical hits, just normal ones.</p>
    </div>
  );
}
