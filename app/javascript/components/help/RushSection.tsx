import React from "react";
import { helpIndexByName } from "./helpData";
import { Link } from "react-router-dom";

export default function RushSection() {
  return (
    <div>
      <h1>Rushing</h1>
      <p>
        Rushing follows all the same rules as{" "}
        <Link to={`/help/${helpIndexByName("Move").join(".")}`}>movement</Link>, with the following
        differences:
      </p>
      <p>Only infantry units may rush. Units manning crewed weapons may not rush.</p>
      <p>
        Only units that have already been activated may rush (unactivated units perform regular
        movement). However, a mix of activated units and unactivated units may rush together (all of
        them will be exhausted, however, see below).
      </p>
      <p>
        Upon completion of a rush, units are marked as exhausted and will become tired and lose two
        movement points next turn.
      </p>
      <p>
        Units may not pick up weapons during a rush, though they may drop them if they have
        sufficient movement points to do so. Units capable of laying smoke may lay it at the same
        movement costs as normal movement.
      </p>
      <p>
        Movement points during a rush movement are halved, rounded down. Road and leader stacking
        bonuses still apply, however (and are added after the reduction). Encumbrances from infantry
        weapons are applied in full. If the resulting movement is zero or less, the unit may not
        rush.
      </p>
    </div>
  );
}
