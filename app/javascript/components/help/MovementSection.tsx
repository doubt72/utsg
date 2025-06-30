import React from "react";
import { helpIndexByName } from "./helpData";

export default function MovementSection() {
  return (
    <div>
      <h1>Movement</h1>
      <p>
        Movement is the action of moving a unit from one hex to another, or (if a unit rotates) the
        action of rotating in a hex, or performing other additional actions, or some combination of
        the above. Most units have inherent movement, but some units such as infantry weapons or
        crewed weapons must be carried, transported, or manhandled. Vehicles (unless transporting
        other units) move individually, but infantry units may move in groups.
      </p>
      <p>
        Certain types of units can be carried by other units. Infantry units can carry infantry
        weapons such as machine guns, small mortars, flamethrowers, or other small weapons. Squads
        and teams can manhandle crewed units such as guns and large mortars. Certain vehicles can
        carry infantry units. Finally certain vehicles (not always the same vehicles) can tow crewed
        weapons. (See the section on{" "}
        <a href={`/help/${helpIndexByName("Stacking").join(".")}`}>stacking</a> for how this is
        indicated in the game.)
      </p>
      <p>
        Each unit (which can be moved on its own) has a movement value, as marked on the bottom
        right of the unit&apos;s counter (see the section on{" "}
        <a href={`/help/${helpIndexByName("Counters").join(".")}`}>counters</a> for more). Infantry
        units such as squads, crews, and leaders that can carry infantry weapons may have their
        movement reduced by the &quot;movement&quot; of those weapons, i.e., by their encumbrance,
        which is indicated as a black - or red negative numbers. Infantry units that are manhandling
        crewed weapons such as guns or large mortars instead have their movement lowered to the
        movement factor of the crewed weapon. This is indicated with a black filled circle.
      </p>
      <p>
        Leaders may not carry infantry weapons with a non-zero encumbrance, and the encumbrance of
        weapons they can carry is considered to be -1.
      </p>
      <p>
        There are three main kinds of movement, foot (as indicated by an undecorated number),
        tracked (as indicated by a circled number), and wheeled (as indicated by a white-filled
        circle). Crewed weapons being manhandled are considered to be moving on foot.
      </p>
      <p>
        Every type of terrain has a movement cost for moving into that terrain. Not all terrain is
        passable to all types of units. (E.g., vehicles can&apos;t move through buildings.) There
        are also certain terrain features that add additional cost, such as fences or streams. For
        more details, see the <a href={`/help/${helpIndexByName("Terrain").join(".")}`}>terrain</a>{" "}
        section.
      </p>
      <p>
        Roads are a special kind of terrain. Roads allow units to move into otherwise impassible
        terrain, and to otherwise ignore terrain movement cost. Wheeled vehicles only use one-half
        movement point to move along roads, all other units use one movement point. If a tracked or
        foot unit moves entirely along a road, it may move one additional hex. Paths are similar to
        roads, except only foot units can take advantage of them, and they don&apos;t give the same
        bonus of one additional hex.
      </p>
      <p>
        Elevation costs +1 movement when going uphill. There is no reduction for going downhill.
        Roads have no affect on this cost.
      </p>
      <p>
        If a unit can turn, the unit must pay the cost of the terrain to change directions, and may
        turn in any legal direction (e.g., a vehicle on a road in the woods can only point the
        vehicle in the direction of the road). If the there is a road, the cost is one movement
        point to turn, including for wheeled vehicles.
      </p>
      <p>
        If a vehicle has an armored turret, it may be freely reoriented as part of a unit&apos;s
        movement.
      </p>
      <p>
        When infantry units are moving in a group including a leader, the non-leaders may move one
        additional movement point. Infantry units moving in a group may drop units along the way,
        but they may not pick up any new infantry units to move with them. If the unit being dropped
        is a leader and the stack still moving no longer contains a leader, the leader bonus is lost
        for the remaining units.
      </p>
      <p>
        If a unit has a breakdown number, the moving player must roll 2d10 after moving, and if the
        total is less than or equal to the breakdown number, the unit is immobilized for the rest of
        the scenario.
      </p>
      <p>
        Units may not move into a hex occupied by an enemy unit. That requires{" "}
        <a href={`/help/${helpIndexByName("Assault Move").join(".")}`}>assault movement</a>. Units
        may not exceed stacking limits at any point while moving.
      </p>
      <p>
        Units are marked as activated after moving. Crewed weapons and transported units are as
        well. Infantry weapons are not. Already activated units may not move, nor may exhausted,
        pinned, or broken units. Tired units get two less movement points.
      </p>
      <h2>Additional Actions</h2>
      <p>
        Infantry units may pick up or drop infantry weapons for one movement point. If the weapon
        has an encumbrance movement, the infantry&apos;s movement is still reduced by that amount
        even after dropping the weapon. The encumbrance applies to units picking up weapons as well.
        If the infantry unit needs to spend more than the reduced amount to move and pick up the
        weapon, it may do so, but it may not make any additional moves.
      </p>
      <p>
        Infantry units (squads or teams, but not leaders) may man or unman a crewed weapon.
        Unmanning costs one point, but the total movement of the infantry is still the reduced
        movement of the crewed weapon for the rest of the movement (if any). Manning costs an
        infantry unit&apos;s entire movement, and both units must start in the same hex.
      </p>
      <p>
        Transports that are towing crewed weapons can pick them up or drop them off for one movement
        point. Anytime a crewed weapon is carried, it faces in the opposite direction of the vehicle
        transporting it, and maintains that facing when dropped. (So change the facing of the crewed
        weapon when loading it, or when the vehicle turns.)
      </p>
      <p>
        Infantry units (with or without infantry weapons) may be loaded on or unloaded from a
        vehicle that can transport them for one movement point (of the vehicle, the infantry&apos;s
        movement points are irrelevant for this).
      </p>
      <p>
        No unit may be picked up if it has already been activated or is exhausted, nor if it has
        been pinned or broken.  Except: broken (jammed) infantry weapons or crewed weapons may be picked
        up or manned (in fact would have to be to be repaired).
      </p>
      <p>
        Units may only be loaded (or manned or towed) or dropped (or unmanned or untowed) in the one
        turn, not both. Units may not &quot;pass&quot; infantry weapons to another unit, the
        infantry weapon must be dropped by the first unit and picked up by the second in separate
        actions.
      </p>
      <p>
        Units that are capable of laying smoke (i.e., smoke-capable infantry, not smoke-capable
        artillery and such that require a targeting roll) may lay smoke for two movement points in a
        neighboring hex, or one movement point in the current hex. The quality of the smoke is
        determined at the end of the move on the game server, ghost markers are used until the move
        is finished (as there are dice rolls involved, these moves cannot be undone, so the smoke
        isn&apos;t checked until the end of the move). To determine the smoke quality, a d10 is
        rolled, and the following table is used:
      </p>
      <table className="mb05em">
        <tbody>
          <tr>
            <td><strong>1-4</strong></td>
            <td>smoke hindrance 1</td>
          </tr>
          <tr>
            <td><strong>5-7</strong></td>
            <td>smoke hindrance 2</td>
          </tr>
          <tr>
            <td className="pr05em"><strong>8-9</strong></td>
            <td>smoke hindrance 3</td>
          </tr>
          <tr>
            <td><strong>10</strong></td>
            <td>smoke hindrance 4</td>
          </tr>
        </tbody>
      </table>
      <p>
        There are two &quot;movement&quot; actions that are not part of a normal movement:
        engineering units clearing obstacles, and digging in. As those require the entire turn
        (i.e., they exhaust units completely), they are part of{" "}
        <a href={`/help/${helpIndexByName("Assault Move").join(".")}`}>assault movement</a> instead.
      </p>
    </div>
  );
}
