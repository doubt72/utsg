import React from "react";
import { SectionProps } from "../game/HelpDisplay";

export default function SpecialRulesSection({ section }: SectionProps) {
  return (
    <div>
      <p>
        Most special rules are either covered in relevant sections (e.g., targeting modifiers from
        elite or green crews) or are simple enough to not need addtional explanation. More involved
        special rules are covered here.
      </p>
      <h3>{section}.1. Unobserved Units and Decoys</h3>
      <p>
        Some scenarios start with one side or both unobserved and include &quot;decoy&quot; units.
        Unobserved leaders, infantry, and infantry weapons look exactly like decoys to their
        opponent, showing only what type of unit they are (or might be), and what their size and
        movement are, allowing the player to try and deceive their opponent as to which of their
        units are real and which aren&apos;t. Unobserved units also display that status to the
        player that controls them so they can see if they&apos;re unobserved or not.
      </p>
      <p>
        Units become &quot;observed&quot; whenever an opponent moves next to them, or fires at them
        and hits them (misses have no effect, but ineffective/non-penetrating hits from ranged
        weapons do), or an unobserved unit fires, moves next to an opponent, captures a victory hex,
        or moves into a minefield. Failing a sniper check (i.e., triggering a sniper morale check)
        will also cause a unit to be observed, as well as a blaze starting or spreading to a hex
        with an unobserved unit. Whenever one unit in a hex is observed, all units in the hex are
        observed with it, even if they wouldn&apos;t otherwise be affected by the event that caused
        a unit to be observed (e.g., fire doesn&apos;t affect infantry weapons, but if the unit
        carrying it is uncovered, so is the weapon). Once observed, normal units display normally to
        both sides, but decoys are removed from play (they do not count for the purposes of score).
      </p>
      <p>
        Decoys behave like normal units in limited ways. They can move or assault move, decoy
        weapons can be carried, decoy squads can be split (but only when being deployed). However,
        decoy weapons can&apos;t be picked up or dropped, special move or assault actions can&apos;t
        be performed by decoys (e.g., entrenching or laying smoke). Decoys cannot move into victory
        hexes or mines (but can assault move into mines, since the attack is not triggered. Assault
        moves into victory hexes is forbidden, however). Decoys also cannot fire, or be split after
        deployment. As is implied above, decoys do trigger sniper checks. Note that doing any action
        a decoy can&apos;t do that does&apos;t explicitly reveal a unit will implicitly reveal that
        a unit is not a decoy to your opponent.
      </p>
      <h3>{section}.1. Random Drop Deployment</h3>
      <p>
        Random drops are used in certain airborne scenarios; in a random drop deployment, instead of
        a the normal deployment process, all squads are split into teams, all teams and leaders are
        randomly placed in random deployment hexes. If the chosen hex is already occupied by an
        enemy unit, is next to an enemy unit, is a victory hex, or would result in overstacking, a
        new hex will be chosen.
      </p>
      <p>
        All teams and leaders so placed must immediately do a morale check (done automatically on
        the sever), so some teams and leaders will start broken. Any infantry weapons will then be
        randomly placed on teams (or leaders in the case of offboard artillery).
      </p>
      <p>
        In scenarios with this special rule, the opponent cannot perform any{" "}
        <strong>rout all</strong> actions during the same turn that the deployment was performed (or
        turn one if deployment was performed in setup).
      </p>
    </div>
  );
}
