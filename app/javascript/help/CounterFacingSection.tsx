import React from "react";
import { EyeFill, Stack } from "react-bootstrap-icons";

export default function CounterFacingSection() {
  return (
    <div>
      <h1>Counter Facing</h1>
      <p>
        Some units have <strong>facing</strong>, i.e., they are always pointed in some particular
        direction. This applies to vehicles and guns in particular, but not infantry or infantry
        weapons. The forward direction (or facing) of any unit is indicated by the direction the top
        of the counter, i.e., if the top of the counter points left, the unit&apos;s facing and
        forward arc is to the left. Some armored units have armored turrets, in which case the
        facing of the turret and the hull can be oriented independently; in this case the hull
        facing is indicated with a hull marker, and the facing of the turret is indicated with the
        counter itself, placed on top of the hull.
      </p>
      <div className="help-section-image">
        <img
          src="/assets/docs/facing.png"
          alt="forward facing arc on the hex map"
          style={{ height: 360 }}
        />
        <div className="help-section-image-caption">
          forward facing arc, as shown by the line-of-sight map overlay
        </div>
      </div>
      <p>
        Whenever the weapons with facing are firing, they must fire in the direction of the forward
        arc, as shown on the image here. The forward arc includes all the hexes that are between the
        lines, even if only partially (i.e., it includes all of the hexes that the lines pass
        through). If a unit is not in the forward arc of the hull of an un-turreted vehicle (or the
        forward arc of the hull if a sponsoned weapon), it cannot be targeted. The same applies to
        the forward arc of the turrets of turreted vehicles.
      </p>
      <p>
        Units without facing (i.e., infantry unit or infantry weapons) are unrestricted by firing
        arcs and can fire in any direction.
      </p>
      <p>
        Facing also applies to armored protection. If an attack comes from a unit in the forward arc
        of the targeted vehicle (or the targeted vehicle&apos;s turret if it hits the turret), it is
        considered to be hitting the forward armor and the forward armor factor is applied. To
        determine if it hits the rear of the vehicle, apply the same arc but in the opposite
        direction, i.e., project the arc from the rear of the vehicle (or turret). In the case where
        the firing unit is not in either of those arcs, it would be considered to be hitting the
        side, and side armor applies.
      </p>
      <p>
        Forward arcs can be seen on the map at any time by toggling the overlay button to show
        line-of-sight and mousing over unit counters — assuming the unit has a facing — see the Line
        of Sight section for more:
      </p>
      <div className="flex mb1em">
        <div className="ml1em"></div>
        <div className="custom-button normal-button">
          <Stack /> <span>overlay</span>
        </div>
        <div className="mt05em">/</div>
        <div className="custom-button normal-button">
          <EyeFill /> <span>overlay</span>
        </div>
        <div className="flex-fill"></div>
      </div>
    </div>
  );
}
