import React from "react";
import { subtitleName, titleName } from "../utilities/graphics";

export default function IntroSection() {
  return (
    <div>
      <h1>Introduction</h1>
        <div className="about-logo">
          <img src="/assets/logo-120.png" alt="Logo" />
          <div className="ml025em">
            <div className="about-name">{ titleName }<span>:</span></div>
            <div className="about-subname">{ subtitleName }</div>
          </div>
        </div>
        <p>
          This is the documentation for <strong>{ titleName }: { subtitleName }</strong>,
          both for the server interface and the game rules as implemented.
        </p>
        <p>
          The game itself is a hex-and-counter, small unit tactical
          wargame primarily meant to be suitable for engagements fought
          during the Second World War, using a simple system
          designed to model land combat across all major theaters and
          phases of the war, from the early fighting in the Far East or
          or even Spain to the closing battles in Germany and the
          Pacific.  The game engine supports both small infantry formations
          (squads and teams) and their support weapons, as well as individual vehicles
          (armored and otherwise) in semi-turn-based engagements, and is meant
          to strike a balance between historical authenticity and
          simplicity, but leaning toward simplicity and streamlined game play.
        </p>
        <p>
          The links in the table of contents can be used to navigate throughout
          the documentation, or use the link below to navigate to the next
          section.
        </p>
        <p>
          This server is a work-in-progress, Doug is still working on it.
        </p>
    </div>
  )
}
