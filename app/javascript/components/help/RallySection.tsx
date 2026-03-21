import React from "react";
import CounterDisplay from "../game/CounterDisplay";
import Unit from "../../engine/Unit";
import { unitStatus } from "../../utilities/commonTypes";
import { helpLink } from "./helpData";
import { baseRally } from "../../utilities/utilities";

export default function RallySection() {
  const infantry = new Unit({
    t: "sqd", i: "squad", s: 6, c: "uk", n: "Gurkha", y: 0, m: 4, f: 7, r: 5, v: 5,
    o: { a: 1 },
  });
  const weapon = new Unit({
    t: "sw", i: "mg", c: "uk", n: "Vickers MG", y: 12,
    o: { r: 1, j: 2, f: 15 }, f: 6, r: 12, v: -1, s: 1,
  });
  infantry.status = unitStatus.Broken
  weapon.jammed = true

  return (
    <div>
      <p>
        During the rally phase, players may attempt to recover broken infrantry units or leaders or
        fix broken weapons. Rally checks on units are free (i.e., any number of units can make rally
        checks) in a hex with an unbroken leader, or else one check may be made per player per turn
        of a unit not stacked with a leader. If the single check is used on a broken leader and
        succeeds, other broken units in the hex may subsequently make &quot;free&quot; rally checks.
      </p>
      <div className={"flex mb1em"}>
        <div>
          <CounterDisplay unit={infantry} />
        </div>
        <div>&nbsp;</div>
        <div>
          <CounterDisplay unit={weapon} />
        </div>
      </div>
      <p>Rally checks for broken infantry units and leaders are calculated as so (see the
        ({ helpLink("Counters", "counters") } and { helpLink("Terrain", "terrain") } sections for more on finding these values):</p>
      <ol>
        <li>start with a base of { baseRally }</li>
        <li>subtract the unit&apos;s morale</li>
        <li>subtract the highest leadership of any leaders in the hex in the hex</li>
        <li>subtract the cover of the terrain in the hex</li>
        <li>add one if there is an unbroken enemy unit adjacent</li>
        <li>
          Roll 2d10 (add them together). If the total of the dice is above the number calculated
          above, the unit rallies, otherwise the rally fails. A roll of 2 always fails, and a roll
          of 20 always succeeds. Units may not attempt to rally more than once per turn.
        </li>
      </ol>
      <p>
        Repair checks for jammed/broken weapons are slightly simpler: the player rolls two d10 and
        adds them together. If the roll is greater than the fix number on counter, the weapon is
        repaired. If the roll is less than the break number on the counter, the weapon is removed
        from the game.
      </p>
    </div>
  );
}
