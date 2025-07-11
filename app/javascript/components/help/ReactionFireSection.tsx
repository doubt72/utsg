import React from "react";
import { helpIndexByName } from "./helpData";
import { Link } from "react-router-dom";

export default function ReactionFireSection() {
  return (
    <div>
      <h1>Reaction Fire</h1>
      <p>
        Reaction fire follows all the same rules as{" "}
        <Link to={`/help/${helpIndexByName("Fire").join(".")}`}>fire</Link>, but the action is
        performed by the non-initiative player in response to a fire/intensive fire or movment/rush
        action, and has some limitations and penalties.
      </p>
      <p>
        May only be performed immediately after an opponent moves or fires and only if they succeed
        in maintaining initiative. If they fail their initiative check, normal fire may be performed
        instead as the opposing player now has the initiative. If performed after a move, may target
        any hex the player moved through or to, but only the moving units will be targeted (ghost
        units in all the intermediate hexes will be displayed by the game and can be selected as
        targets). If performed after a fire action, only the firing unit(s) from that action may be
        targeted (though all units in that hex may be affected by return fire).
      </p>
      <p>
        If the original moving or firing units cannot be targeted by particular opposing units,
        those units may not perform reaction fire (for instance, if an armored unit performed the
        firing action that reaction fire is responding to, infantry can&apos;t target it, so
        can&apos;t participate in reaction fire, even if there are also unarmored vehicles or
        infantry in the same hex).
      </p>
      <p>
        If moving units are targeted in a hex that was not their final destination and are broken or
        pinned, they are moved back to the hex they were targeted in. If other units were moving in
        a stack, they may also be moved back to that hex at the moving player&apos;s discretion.
      </p>
      <p>
        Reaction fire may be normal or intensive, depending on whether any of the firing units have
        already been activated or not. Any units that can&apos;t ordinarily perform regular or
        intensive fire actions (as appropriate) may not reaction fire (e.g., exhausted units may
        never reaction fire).
      </p>
      <p>
        Area fire weapons (mortars and offboard artillery/radios) may not perform reaction fire.
      </p>
      <p>
        Certain penalties may apply to certain types of reaction fire, those penalties are listed in
        the relevant places in the{" "}
        <Link to={`/help/${helpIndexByName("Fire").join(".")}`}>fire</Link> section.
      </p>
      <p>
        Mark units that performed a reaction fire action as activated or exhausted, as appropriate
        (i.e., depending on if the reaction fire was intensive or not).
      </p>
    </div>
  );
}
