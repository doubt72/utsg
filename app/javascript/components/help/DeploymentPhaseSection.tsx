import React from "react";
import { helpIndexByName } from "./helpData";
import { Link } from "react-router-dom";

export const deploymentRulesSection = (phase: string) => {
  return (
    <>
      <p>
        {phase === "reinforcement"
          ? "If reinforcements are available, there will be "
          : "Each scenarion has "}
        specific {phase} deployment hexes for each player
        {phase === "reinforcement" ? " that has reinforcements" : ""}, usually on the side that the
        player is advancing from. Additionally, units and features can only be placed in legal
        locations for those counters. E.g., vehicles can only be placed in hexes that are passable
        to vehicles, and if they can only be move through a hex&apos;s terrain type along a road,
        they must be placed facing a direction the road travels.
      </p>
      {phase === "setup" ? (
        <p>
          Obstacle features such as mines and wire cannot be placed in victory hexes. Placing
          fortifications in such hexes is fine, however. Neither fortifications or obstacle features
          can be placed in the same hex as a building, forest, or other terrain that is impassible
          to vehicles.
        </p>
      ) : (
        ""
      )}
      <p>
        Valid deployment locations will be enforced by the server, and will be indicated on the
        deployment map as unshaded hexes.
      </p>
      <p>
        Finally, players should be aware of how stacking works when placing units so that units are
        loaded on vehicles or weapons are carried or operated by units as expected (though the
        deployment map will attempt to show valid options if possible, and will show a warning if a
        weapon has no operator); see the section on{" "}
        <Link to={`/help/${helpIndexByName("Stacking").join(".")}`}>stacking counters</Link> for more
        information.
      </p>
    </>
  );
};

export default function DeploymentPhaseSection() {
  return (
    <div>
      <h1>Deployment Phase</h1>
      <p>
        During the deployment phase, each player places any available reinforcement, initiative
        player first. If no reinforcements are available for the current turn, the phase is skipped
        for that player.
      </p>
      {deploymentRulesSection("reinforcement")}
    </div>
  );
}
