import React from "react";
import { BoxArrowDown, BoxArrowInUp, Clouds } from "react-bootstrap-icons";
import { helpLink } from "./helpData";
import { smokeTable } from "./FireSmokeSection";
import { SectionProps } from "../game/HelpDisplay";

export default function MovementOtherSection({ section }: SectionProps) {
  return (
    <div>
      <p>The following actions may be made as part of a move action:</p>
      <h3>{section}.1. Picking Up and Dropping Infantry Weapons</h3>
      <p>
        Infantry units may pick up or drop infantry weapons for one movement point. If the weapon
        has an encumbrance movement, the infantry&apos;s movement is still reduced by that amount
        even after dropping the weapon. The encumbrance applies to units picking up weapons as well.
        If the infantry unit needs to spend more than the reduced amount to move and pick up the
        weapon, it may do so, but it may not make any additional moves.
      </p>
      <h3>{section}.2. Manning or Unmanning Crewed Weapons</h3>
      <p>
        Infantry units (squads or teams, but not leaders) may man or unman a crewed weapon.
        Unmanning costs one point, but the total movement of the infantry is still the reduced
        movement of the crewed weapon for the rest of the movement (if any). Manning costs an
        infantry unit&apos;s entire movement, and both units must start in the same hex.
      </p>
      <h3>{section}.3. Transporting Crewed Weapons</h3>
      <p>
        Transports that are towing crewed weapons can pick them up or drop them off for one movement
        point. Anytime a crewed weapon is carried, it faces in the opposite direction of the vehicle
        transporting it, and maintains that facing when dropped. (So the facing of the crewed weapon
        may change when it is loaded for &quot;free&quot;, i.e. rotating the crewed weapon happens
        automatically at no additional movement cost. Crewed weapons also rotate when the vehicle
        rotates when being towed.)
      </p>
      <h3>{section}.4. Transporting Infantry</h3>
      <p>
        Infantry units (with or without infantry weapons) may be loaded on or unloaded from a
        vehicle that can transport them for one movement point (of the vehicle, the infantry&apos;s
        movement points are irrelevant for this).
      </p>
      <h3>{section}.5. Limitation to Transport</h3>
      <p>
        No unit may be picked up if it has already been activated or is exhausted, nor if it has
        been pinned or broken. Except: broken (jammed) infantry weapons or crewed weapons may be
        picked up or manned (in fact would have to be to be repaired).
      </p>
      <p>
        Units may either be loaded (or manned or towed) or dropped (or unmanned or untowed) in a
        single turn, but not both. Units may not &quot;pass&quot; infantry weapons to another unit,
        the infantry weapon must be dropped by the first unit and picked up by the second in
        separate actions. The following buttons are used for all loading or dropping actions and
        will appear when those actions are allowed:
      </p>
      <div className="flex mb1em">
        <div className="ml1em"></div>
        <div className="custom-button normal-button">
          <BoxArrowInUp />
          <span> pick up a unit</span>
        </div>
        <div className="mt05em">/</div>
        <div className="custom-button normal-button">
          <BoxArrowDown /> <span>drop unit</span>
        </div>
        <div className="flex-fill"></div>
      </div>
      <h3>{section}.6. Laying Smoke</h3>
      <p>
        Units that are capable of laying smoke (i.e., smoke-capable infantry, not smoke-capable
        artillery and such that require a targeting roll) may lay smoke for two movement points in a
        neighboring hex, or one movement point in the current hex. Smoke-capable units are marked
        with a dot over their firepower. The quality of the smoke is determined by a d10 die roll
        (see the table below). On the server, this happens after the move is committed, and the
        entire move may be cancelled up to that point, but may not be undone afterwards (as die
        rolls are involved). The locations that will get smoke counters are indicated by ghost
        counters on the map until then.
      </p>
      {smokeTable}
      <p>Laying additional smoke in the same hex will add to existing smoke in that hex.</p>
      <p>Use the following button to toggle laying smoke on and off:</p>
      <div className="flex mb1em">
        <div className="ml1em"></div>
        <div className="custom-button normal-button">
          <Clouds />
          <span> lay smoke</span>
        </div>
        <div className="mt05em">/</div>
        <div className="custom-button normal-button">
          <Clouds /> <span>stop laying smoke</span>
        </div>
        <div className="flex-fill"></div>
      </div>
      <h3>{section}.7. Non-Movement Actions</h3>
      <p>
        There are two &quot;movement&quot; actions that are not part of a normal movement:
        engineering units clearing obstacles, and digging in. As those require the entire turn
        (i.e., they exhaust units completely), they are part of{" "}
        {helpLink("Assault Move", "assault movement")} instead.
      </p>
    </div>
  );
}
