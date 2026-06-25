import React from "react";
import { ArrowClockwise, ArrowCounterclockwise } from "react-bootstrap-icons";
import { CancelGlyph, MoveGlyph } from "../utilities/buttons";
import { helpLink } from "./helpData";
import { SectionProps } from "../game/HelpDisplay";

export default function MovementSection({ section }: SectionProps) {
  return (
    <div>
      <p>
        Movement is the action of moving a unit from one hex to another, or (if a unit rotates) the
        action of rotating in a hex, or performing other additional actions, or some combination of
        the above.
      </p>
      <p>
        Most units have inherent movement, but some units such as infantry weapons or crewed weapons
        must be carried, transported, or manhandled. Vehicles (unless transporting other units) move
        individually, but infantry units may move in groups. Each unit (which can be moved on its
        own) has a movement value, as marked on the bottom right of the unit&apos;s counter (see the
        section on {helpLink("Counters", "counters")} for more).
      </p>
      <h3>{section}.1. Types of Movement</h3>
      <p>
        There are three kinds of movement, foot (as indicated by an undecorated number), tracked (as
        indicated by a circled number), and wheeled (as indicated by a white-filled circle). Crewed
        weapons (indicated by a black-filled circle) being manhandled are considered to be moving on
        foot.
      </p>
      <h3>{section}.2. Terrain Effects</h3>
      <p>
        Every type of terrain has a movement cost for moving into that terrain. Not all terrain is
        passable to all types of units. (E.g., vehicles can&apos;t move through buildings.) There
        are also certain terrain features that add additional cost, such as fences or streams. For
        more details, see the {helpLink("Terrain", "terrain")} section. Units (with movement greater
        than zero) can always move at least one hex, even if the movement cost of the terrain cost
        exceeds the unit&apos;s total movement points.
      </p>
      <h3>{section}.3. Roads</h3>
      <p>
        Roads are a special kind of terrain. Roads allow units to move into otherwise impassible
        terrain, and to otherwise ignore terrain movement cost. Wheeled vehicles only use one-half
        movement point to move along roads, all other units use one movement point. If a tracked or
        foot unit moves entirely along a road, it may move one additional hex. Paths are similar to
        roads, except only foot units can take advantage of them, and they don&apos;t give the same
        bonus of one additional hex.
      </p>
      <h3>{section}.4. Elevation</h3>
      <p>
        Elevation costs +1 movement when going uphill. There is no movement bonus for going
        downhill. Roads have no affect on this cost.
      </p>
      <h3>{section}.5. Victory Point Hexes</h3>
      <p>
        Victory points hexes are captured by units moving into the hex. Leaders cannot capture
        victory point hexes by themselves, only infantry or vehicles can (crewed and infantry weapons
        also can&apos;t capture victory hexes, nor can broken units, but none of those can move by
        themselves in the first place).
      </p>
      <h3>{section}.6. Leader Bonus</h3>
      <p>
        When infantry units are moving in a group including a leader, the non-leaders may move one
        additional movement point, except: units that cannot otherwise move cannot apply the
        leadership bonus so still cannot move even with a leader. Infantry units moving in a group
        may drop units along the way, but they may not pick up any new infantry units to move with
        them. If the unit being dropped is a leader and the stack still moving no longer contains a
        leader, the leader bonus is lost for the remainder of the move.
      </p>
      <h3>{section}.7. Transport</h3>
      <p>
        Certain types of units can be carried by other units. Infantry units can carry infantry
        weapons such as machine guns, small mortars, flamethrowers, or other small weapons. Squads
        and teams can manhandle crewed units such as guns and large mortars. Certain vehicles can
        carry infantry units. Finally, certain vehicles (sometimes but not always the same vehicles)
        can tow crewed weapons. (See the section on {helpLink("Stacking", "stacking")} for how this
        is indicated in the game, and the {helpLink("Counters", "counter layout")} section for
        details of transport limits.)
      </p>
      <p>
        Infantry units such as squads, crews, and leaders that can carry infantry weapons have their
        movement reduced by the &quot;movement&quot; of those weapons, i.e., by their encumbrance,
        which is indicated by a black &quot;-&quot; (indicating no encumbrance) or red negative
        numbers. Infantry units that are manhandling crewed weapons such as guns or large mortars
        instead have their movement lowered to the movement factor of the crewed weapon. This is
        indicated with a black filled circle.
      </p>
      <p>
        Leaders may not carry infantry weapons with a non-zero encumbrance, and the encumbrance of
        weapons they can carry is always -2 instead of zero.
      </p>
      <h3>{section}.8. Breakdowns</h3>
      <p>
        After any move action, if a vehicle has a breakdown number, it makes a breakdown check.
        Breakdown checks are made immediately after moves but before the initiative check. To make a
        check, roll two ten-sided dice, adding the total together (2d10), and if the dice roll is
        equal or below that number, the vehicle is immobilized for the rest of the scenario.
      </p>
      <p>
        If a unit breaks down, all of the units it is carrying or towing are dropped.
      </p>
      <h3>{section}.9. Turning</h3>
      <p>
        If a unit has facing it can turn. The unit must pay the cost of the terrain to change
        directions, and may turn in any legal direction (e.g., a vehicle on a road in the woods can
        only point the vehicle in the direction of the road). If the there is a road, the cost is
        one movement point to turn, including for wheeled vehicles.
      </p>
      <h3>{section}.10. Turrets</h3>
      <p>
        If a vehicle has an armored turret, it may be freely reoriented as part of a unit&apos;s
        movement. Use the following button to toggle between that and regular turns:
      </p>
      <div className="flex mb1em">
        <div className="ml1em"></div>
        <div className="custom-button normal-button">
          <ArrowClockwise /> <span>rotating hull</span>
        </div>
        <div className="mt05em">/</div>
        <div className="custom-button normal-button">
          <ArrowClockwise /> <span>rotating turret</span>
        </div>
        <div className="flex-fill"></div>
      </div>
      <h3>{section}.11. Other Forbidden Moves</h3>
      <p>
        Besides terrain that&apos;s illegal for particular types of units to enter, units may not
        move into a hex occupied by an enemy unit. That requires{" "}
        {helpLink("Assault Move", "assault movement")}. Units also may not exceed stacking limits at
        any point while moving, not even &quot;temporarily&quot; when moving through hexes
        containing friendly units.
      </p>
      <h3>{section}.12. Status</h3>
      <p>
        Units are marked as activated after moving. Crewed weapons and transported units are as
        well. Already activated units may not move (they may only rush), nor may exhausted, pinned,
        or broken units. Tired units movement is half rounded down.
      </p>
      <h3>{section}.13. Server Controls</h3>
      <p>
        Once a move has started, the following buttons can be used to commit or abandon a move
        anytime during the movement action:
      </p>
      <div className="flex mb1em">
        <div className="ml1em"></div>
        <div className="custom-button normal-button">
          {MoveGlyph()} <span>finish move</span>
        </div>
        <div className="mt05em">/</div>
        <div className="custom-button normal-button">
          {CancelGlyph()} <span>cancel move</span>
        </div>
        <div className="flex-fill"></div>
      </div>
      <p>
        In addtion, the following button can be used to cancel the most recent part of the move:
      </p>
      <div className="flex mb1em">
        <div className="ml1em"></div>
        <div className="custom-button normal-button">
          <ArrowCounterclockwise /> <span>undo last move</span>
        </div>
        <div className="flex-fill"></div>
      </div>
    </div>
  );
}
