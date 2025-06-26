import React from "react";
import Header from "./Header";
import { AboutHelpButton, ReturnButton } from "./utilities/buttons";
import { subtitleName, titleName } from "../utilities/utilities";

export default function About() {
  return (
    <div>
      <Header hideAbout="true" />
      <div className="standard-body">
        <div className="about-about">
          <div className="about-logo">
            <img src="/assets/logo-120.png" alt="Logo" />
            <div className="ml025em">
              <div className="about-name">{ titleName }<span>:</span></div>
              <div className="about-subname">{ subtitleName }</div>
            </div>
          </div>
          <p>
            This is the <strong>{ titleName }: { subtitleName }</strong> server.
          </p>
          <p>
            <strong>{titleName}</strong> is a browser-based hex-and-counter wargame for simulating small
            unit tactical combat. It is intended to model land engagements of the Second World War, using
            a streamlined system designed to cover all major theaters and phases of the war, from China
            and Spain in the late 30&apos;s to the final battles in Germany and the Pacific. The system
            supports small infantry formations (squads and teams) and their support weapons, as well as
            individual vehicles (armored and otherwise) in semi-turn-based engagements, and is meant to
            strike a balance between historical authenticity and simplicity, though with the greater
            emphasis on simplicity.
          </p>
          <p>
            There are a selection of scenarios available.  To get started, head to
            the “Create New Game” link on the main page and explore the scenarios.
            Maybe try a hotseat game.  New content will be added over time,
            but scenarios are already playable and ready for testing.  [TODO: Okay, not
            really, but they should be whenever I turn on the production server.]
          </p>
          <p>This server is a work-in-progress, Doug is still working on it.</p>
          <div className="align-end">
            {AboutHelpButton()}<ReturnButton />
          </div>
        </div>
        <div className="about-about ml05em">
          <p>
            <strong>Code of Conduct</strong>
          </p>
          <p>
            <strong>1. Be Respectful</strong>: treat other players with courtesy.
            No insults, harrassment, or personal attacks.  Disagreements may happen,
            but keep it civil.  Being a jerk is not okay.
          </p>
          <p>
            <strong>2. No Hate or Bigotry</strong>: there&apos;s zero tolerance for racism,
            antisemitism, misogyny, homophobia, transphobia or any other forms of hate here
            (just because it isn&apos;t explicitly listed doesn&apos;t make it okay).
            This applies both to chat and usernames.
          </p>
          <p>
            <strong>3. Keep It Historical, Not Political</strong>: this game simulates historical
            military conflicts — many of which were fought for terrible reasons by regimes
            responsible for enormous harm. Discussion of the history is fine.  Political
            provocation is not.  Focus on the game play and be respectful when discussing the period.
          </p>
          <p>
            <strong>4. Stay on Topic</strong>: use the main chat for game-related discussion.
            Don&apos;t spam or derail it with off-topic commentary.  There are plenty of other
            places on the internet for that.  This doesn&apos;t apply to in-game chats — as those
            can only be seen by people watching the game, there&apos;s no real need to cut down
            on noise, so players can feel free to use them however they like (assuming the other
            rules here are observed, obviously).
          </p>
          <p>
            <strong>5. Report, Don&apos;t Escalate</strong>: If you see someone violating the code
            of conduct, don&apos;t engage — report it to the admins.  [TODO: Need to set up a link
            here.]
          </p>
          <p>
            Violations may result in warnings, suspensions, or bans depending on severity at the
            sole discretion of the management.
          </p>
        </div>
      </div>
    </div>
  )
}
