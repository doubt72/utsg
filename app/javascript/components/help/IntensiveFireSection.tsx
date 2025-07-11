import React from "react";
import { helpIndexByName } from "./helpData";
import { Link } from "react-router-dom";

export default function IntensiveFireSection() {
  return (
    <div>
      <h1>Intensive Fire</h1>
      <p>
        Intensive fire follows all the same rules as{" "}
        <Link to={`/help/${helpIndexByName("Fire").join(".")}`}>fire</Link>, with the following
        differences:
      </p>
      <p>
        Activated but not exhausted units may perform intensive fire. Units are marked as exhausted
        after firing. Unactivated units may be combined with activated units to perform an intensive
        fire action, but all units so combined are marked as exhausted after firing.
      </p>
      <p>
        Crewed weapons and area effect weapons (mortars and offboard artillery) may not intensive
        fire.
      </p>
      <p>Additionaly penalties apply and are listed in the relevant parts of the fire section.</p>
    </div>
  );
}
