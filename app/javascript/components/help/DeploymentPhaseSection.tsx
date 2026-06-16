import React from "react";
import { helpLink } from "./helpData";
import { SectionProps } from "../game/HelpDisplay";
import { stackLimit } from "../../utilities/utilities";

export const deploymentRulesSection = (phase: string, section: string) => {
  return (
    <>
      <h3>{section}.1. Deployment Hexes</h3>
      <p>
        {phase === "reinforcement"
          ? "If reinforcements are available, there will be "
          : "Each scenarion has "}
        specific {phase} deployment hexes for each player
        {phase === "reinforcement" ? " that has reinforcements" : ""}, usually
        on the side that the player is defending or advancing from.
      </p>
      <h3>{section}.2. Placing Units</h3>
      <p>
        Units can only be placed in legal locations for those counters. E.g.,
        vehicles can only be placed in hexes that are passable to vehicles, and
        if they can only move through a hex&apos;s terrain type along a road,
        they must be placed facing a direction the road travels.  Placing a unit
        may not cause the stacking limit of { stackLimit } to be exceeded.
      </p>
      <p>
        Valid deployment locations will be enforced by the server, and will be
        indicated on the deployment map as unshaded hexes.
      </p>
      <p>
        Players should be aware of how stacking works when placing
        units so that units are loaded on vehicles or weapons are carried or
        operated by units as expected (though the deployment map will attempt to
        show valid options if possible — i.e., hexes that would result in no
        crew or operator are shaded red — and will show a warning if a weapon
        has no operator); see the section on{" "}
        {helpLink("Stacking", "stacking counters")} for more information.
      </p>
      <h3>{section}.3. Splitting Squads</h3>
      <p>
        Squads may be freely split into teams or reformed; squads are slightly
        more than the sum of their parts, the strength of a team is half of a squad
        rounded down, and they don&apos;t get any of the special combat bonuses or
        abilities of the full squad.
      </p>
      {phase === "setup" ? (
        <>
          <h3>{section}.4. Placing Features</h3>
          <p>
            Obstacle features such as mines and wire cannot be placed in victory
            hexes. Placing fortifications in such hexes is fine, however. Neither
            fortifications or obstacle features can be placed in the same hex as a
            building, forest, or other terrain that is impassible to vehicles.
            Fortifications also cannot be placed in streams, gullies, or trenches.
            Only one feature can be placed in any hex.
          </p>
        </>
      ) : (
        ""
      )}
    </>
  );
};

export default function DeploymentPhaseSection({ section }: SectionProps) {
  return (
    <div>
      <p>
        During the deployment phase, each player places any available
        reinforcement, initiative player first. If no reinforcements are
        available for the current turn, the phase is skipped for that player.
      </p>
      {deploymentRulesSection("reinforcement", section ?? "")}
    </div>
  );
}
