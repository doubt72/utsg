import React from "react";
import CounterDisplay from "../game/CounterDisplay";
import Unit from "../../engine/Unit";

export default function CloseCombatSection() {
  const one1 = new Unit({
    id: "us_marine_rifle_s", t: "sqd", i: "squad", s: 6, c: "usa", n: "Marine Rifle", y: 0, m: 4, f: 7, r: 6, v: 5,
    o: { a: 1 },
  });
  const one2 = new Unit({
    id: "us_m1918_bar", t: "sw", i: "mg", c: "usa", n: "M1918 BAR", y: 18,
    o: { a: 1, r: 1, j: 3, f: 16 }, f: 5, r: 8, v: 0, s: 1,
  });
  const one3 = new Unit({
    id: "us_leader_5_1", c: "usa", t: "ldr", n: "Leader", i: "leader", y: 0, m: 5, s: 1, f: 1, r: 1, v: 6,
    o: { l: 1 },
  });
  const two = new Unit({
    id: "jap_snlf_s", t: "sqd", i: "squad", s: 6, c: "jap", n: "SNLF", y: 0, m: 3, f: 6, r: 4, v: 4,
    o: { a: 1 },
  });

  return (
    <div>
      <p>
        Any time enemy units end up in the same hex at the end of the main phase, a close combat
        occurs.
      </p>
      <p>
        If there are more than one close combats, the initiative player chooses the order of
        combats.
      </p>
      <p>
        Each player adds up their combat power, which is the cumulative total of the firepower of
        any infantry unit (squad, team, or leader) plus 2 for any infantry units with an assault
        bonus, plus the highest leadership of any leader in the stack for that player added to each
        non-leader infantry unit. Vehicles count as 2. Infantry support weapons add 2 if they have
        an assault bonus, otherwise 0.
      </p>
      <p>
        Each player multiplies their FP by two, then adds the result of 1d10, then multiplies that
        total by 1d10. For every multiple of 80 in the result, their opponent takes one hit (reduces
        one unit). A reduction either breaks an unbroken infantry unit (or eliminates a vehicle), or
        eliminates a broken infantry unit. Carried infantry weapons or manned weapons cannot take a
        hit (those weapons are simply dropped/unmanned if the carrying/manning unit is eliminated,
        and can be picked up/manned by either side later).
      </p>
      <p>
        If only one player remains after close combat, their units are exhausted. Otherwise, the
        close combat may occur again next turn (unless one of the sides assault moves out of contact
        or are destroyed before the next close combat phase by some other means).
      </p>
      <div className={"flex mb1em"}>
        <div>
          <CounterDisplay unit={one1} />
        </div>
        <div>&nbsp;</div>
        <div>
          <CounterDisplay unit={one2} />
        </div>
        <div>&nbsp;</div>
        <div>
          <CounterDisplay unit={one3} />
        </div>
        <div>&nbsp;</div>
        <div>
          <CounterDisplay unit={two} />
        </div>
      </div>
      <p>
        For instance, if player one has a total combat power of 13 and rolls a 6 and a 4, and player two has
        a total combat power of 8 and rolls a 4 and a 3, the total result for player one is
        128 <span className="inline-monospace">[(2x13 + 6)x4]</span>, and the total result for player
        two is 60 <span className="inline-monospace">[(2x8 + 4)x3]</span>.  Player two must take one hit (reduce
        one unit &mdash; player one&apos;s total result is between 80 and 159), and because player two&apos;s total result is
        below 80, player takes no hits.  Since player two only has one unit and must perform a reduction, the unit
        breaks and the combat is over; a second hit would have eliminated the unit.
      </p>
    </div>
  );
}
