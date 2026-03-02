import React from "react";

export default function RallySection() {
  return (
    <div>
      <p>
        During the rally phase, players may attempt to recover broken infrantry
        units or leaders or fix broken weapons. Rally checks on units are free
        (i.e., any number of units can make rally checks) in a hex with an
        unbroken leader, or else one check may be made per player per turn of a
        unit not stacked with a leader. If the single check is used on a broken
        leader and succeeds, other broken units in the hex may subsequently make
        &quot;free&quot; rally checks.
      </p>
      <p>
        Rally checks for broken infantry units and leaders are calculated as so:
      </p>
      <p>
        <ol>
          <li>start with a base of 15</li>
          <li>subtract the unit&apos;s morale</li>
          <li>
            subtract the highest leadership of any leaders in the hex in the hex
          </li>
          <li>subtract the cover of the terrain in the hex</li>
          <li>addi one if there is an unbroken enemy unit adjacent</li>
        </ol>
      </p>
      <p>
        The player then rolls two d10 (dice with 1-10 are used by the game) and
        adds them together. If the total is greater than the number calculated
        above, the unit rallies, otherwise the unit fails to rally. Units may
        not attempt to rally more than once per turn.
      </p>
      <p>
        Repair checks for jammed/broken weapons are slightly simpler: the player
        rolls two d10 and add them together. If the roll is greater than the fix
        number on counter, the weapon is repaired. If the roll is less than the
        break number on the counter, the weapon is removed from the game.
      </p>
    </div>
  );
}
