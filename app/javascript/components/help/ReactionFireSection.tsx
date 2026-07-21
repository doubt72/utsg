import React from "react";
import { helpLink } from "./helpData";
import { SectionProps } from "../game/HelpDisplay";

export default function ReactionFireSection({ section }: SectionProps) {
  return (
    <div>
      <p>
        Reaction fire follows all the same rules as {helpLink("Fire", "fire")}, but the action is
        performed by the non-initiative player in response to a fire/intensive fire or movment/rush
        action, and has some limitations.
      </p>
      <p>
        May only be performed immediately after an opponent moves or fires. If performed after a
        move, may target any hex the player moved through or to (ghost units in all the intermediate
        hexes will be displayed by the game and can be selected as targets). If performed after a
        fire action, only unit(s) from the firing hex may be targeted.
      </p>
      <h3>{section}.1. Other Units in Hex</h3>
      <p>
        Even if the original moving or firing units cannot be targeted by particular opposing units,
        units may perform reaction fire if any units in the hex can be targeted, whether the target
        hex contains other units that didn&apos;t fire (e.g., a firing machine gun can&apos;t be
        targeted with reaction fire, but the unit that carries it can) or a unit moved through a hex
        containing other units (i.e., both the moving unit and units that were moved through may be
        targeted).
      </p>
      <h3>{section}.2. Effect on Moving Units</h3>
      <p>
        If moving units are targeted in a hex that was not their final destination and are broken or
        pinned, they are moved back to the hex they were targeted in. If other units were moving in
        a stack, they may also be moved back to that hex at the moving player&apos;s discretion.
      </p>
      <h3>{section}.3. Intensive Reaction Fire</h3>
      <p>
        Reaction fire may be normal or intensive, depending on whether any of the firing units have
        already been activated or not. Any units that can&apos;t ordinarily perform regular or
        intensive fire actions (as appropriate) may not reaction fire (e.g., exhausted units may
        never reaction fire).
      </p>
      <h3>{section}.4. Weapons That May Not React</h3>
      <p>
        Area fire weapons (mortars, offboard artillery/radios, etc.) may not perform reaction fire.
        Reaction fire may not be rapid; units capable of rapid fire can only fire as infantry fire.
      </p>
      <h3>{section}.5. Status</h3>
      <p>
        Mark units that performed a reaction fire action as activated or exhausted, as appropriate
        (i.e., depending on if the reaction fire was intensive or not).
      </p>
    </div>
  );
}
