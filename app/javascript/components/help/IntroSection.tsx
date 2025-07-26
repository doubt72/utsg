import React from "react";
import { subtitleNameStyle, titleNameStyle } from "../Utilities";
import { subtitleName, titleName } from "../../utilities/utilities";

export default function IntroSection() {
  return (
    <div>
      <h1>Introduction</h1>
      <div className="about-logo">
        <img src="/assets/logo-120.png" alt="Logo" />
        <div className="ml025em">
          <div className="about-name">
            {titleName}
          </div>
          <div className="about-subname">{subtitleName}</div>
        </div>
      </div>
      <p>
        Welcome to the documentation for{" "}
        <strong>
          {titleNameStyle}: {subtitleNameStyle}
        </strong>
        , covering both the server interface and the game rules as implemented.
      </p>
      <p>
        <strong>{titleNameStyle}</strong> is a browser-based hex-and-counter wargame for simulating small
        unit tactical combat. It is intended to model land engagements of the Second World War, using
        a streamlined system designed to cover all major theaters and phases of the war, from China
        or Spain in the late 30&apos;s to the final battles in Germany or the Pacific. The system
        supports small infantry formations (squads and teams) and their support weapons, as well as
        individual vehicles (armored and otherwise) in semi-turn-based engagements, and is meant to
        strike a balance between historical authenticity and simplicity, though with the greater
        emphasis on simplicity.
      </p>
      <p>
        The game system as implemented is meant to be suitable both for tabletop and online play.
        That is, the intent is to streamline some things to keep things moving for possibly
        asynchronous online play while maintaining the transparent logic of tabletop rules, i.e.,
        without depending on opaque internal logic or simulation sometimes found in hex-and-counter
        computer war games (not that there&apos;s anything wrong with that, this just isn&apos;t
        that sort of game).
      </p>
      <p>
        The links in the table of contents can be used to navigate throughout the documentation, or
        use the link below to navigate to the next section.
      </p>
      <p>This server is a work-in-progress, Doug is still working on it.</p>
      <p>These docs are even more in-progress.</p>
    </div>
  );
}
