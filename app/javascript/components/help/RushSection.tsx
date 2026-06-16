import React from "react";
import { helpLink } from "./helpData";
import { SectionProps } from "../game/HelpDisplay";

export default function RushSection({ section }: SectionProps) {
  return (
    <div>
      <p>
        Rush movement follows all the same rules as {helpLink("Move", "movement")}, with the
        following differences:
      </p>
      <p>
        Only infantry units may rush. Units manning crewed weapons may not rush. Crewed weapons also
        may not be manned during a rush.
      </p>
      <p>
        Units may pick up weapons or drop them during a rush if they have sufficient movement points
        to do so. Units capable of laying smoke may lay it at the same movement costs as normal
        movement.
      </p>
      <p>
        Only units that have already been activated may rush (unactivated units perform regular
        movement). However, a mix of activated units and unactivated units may rush together (all of
        them will be exhausted, however, see below).
      </p>
      <h3>{section}.1. Rush Movement Points</h3>
      <p>
        Movement points during a rush movement are halved, rounded down. Road and leader bonuses
        still apply, however (and are added after the reduction). Encumbrances from infantry weapons
        are applied in full. If the resulting movement is zero or less (before applying road or
        leader bonuses), the unit may not rush.
      </p>
      <h3>{section}.2. Finishing</h3>
      <p>
        Upon completion of a rush, units are marked as exhausted and will become tired next turn and
        only get half of their movement points (rounded down), as well as penalties to fire actions.
      </p>
    </div>
  );
}
