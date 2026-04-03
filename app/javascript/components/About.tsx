import React, { useEffect } from "react";
import Header from "./Header";
import { AboutHelpButton, ContactButton, ReturnButton } from "./utilities/buttons";
import { subtitleNameStyle, titleNameStyle } from "./Utilities";
import { serverVersion, subtitleName, titleName } from "../utilities/utilities";
import { BugFill, ListColumnsReverse } from "react-bootstrap-icons";
import { useParams } from "react-router-dom";

export default function About() {
  const id = useParams().id

  useEffect(() => {
    if (!id) { return }
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => {
        element.style.opacity = "0.33"
      }, 800)
      setTimeout(() => {
        element.style.opacity = "1"
      }, 900)
      setTimeout(() => {
        element.style.opacity = "0.33"
      }, 1000)
      setTimeout(() => {
        element.style.opacity = "1"
      }, 1100)
    }
  }, [])

  return (
    <div>
      <Header hideAbout="true" />
      <div className="standard-body">
        <div className="about-about">
          <div className="about-logo">
            <img src="/assets/logo-120.png" alt="Logo" />
            <div className="ml025em">
              <div className="about-name">{titleName}</div>
              <div className="about-subname">{subtitleName}</div>
            </div>
          </div>
          <p>
            This is the {titleNameStyle}: {subtitleNameStyle}&#8201; server.
          </p>
          <p>
            {titleNameStyle} is a browser-based hex-and-counter wargame for simulating small unit
            tactical combat. It is intended to model land engagements of the Second World War, using
            a streamlined system designed to cover all major theaters and phases of the war, from
            China and Spain in the late 30&apos;s to the final battles in Germany and the Pacific.
            The system supports small infantry formations (squads and teams) and their support
            weapons, as well as individual vehicles (armored and otherwise) in semi-turn-based
            engagements, and is meant to strike a balance between historical authenticity and
            simplicity, though with the greater emphasis on simplicity.
          </p>
          <p>
            There are a selection of scenarios available. To get started, head to the “Create New
            Game” link on the main page and explore the scenarios. Maybe try a hotseat game. New
            content will be added over time.
          </p>
          <p><strong>Announcements</strong></p>
          <div id="a02042026" className="ml1em">
            <p>
              <strong>Note to Players</strong>
            </p>
            <p>
              <strong>2 Apr 2026</strong>: while the server is definitely under construction,
              do feel free to play games knowing that things may break,
              deploys will be frequent, and all the games <strong>will</strong> be
              deleted at some point when we&apos;re ready to flip the &quot;release&quot; switch.
              Games may also be deleted at other times if the archetecture changes enough to break
              old games (as has already happend).  Otherwise, old games may break in (probably) minor
              ways as things are fixed and polished.  Feedback is still welcomed and encouraged,
              be it about the UX or design, or if you find any bugs.  Note that a bunch of scenarios
              are listed as &quot;ready&quot; for convenience&apos; sake; many of them really aren&apos;t
              and probably should be considered to be in beta status at best.  The plan is to have
              them tested and balanced by the time the server itself is ready.
            </p>
          </div>
          <p>
            Server version <span className="red">{serverVersion}&#x3B1;</span>:
            currently a work in progress and probably always will be.
          </p>
          <div className="flex mt2em">
            <div className="flex-fill"></div>
            <div>{AboutHelpButton("docs")}</div>
            { localStorage.getItem("username") ?
              <div className="nowrap">
                <a className="custom-button" href="https://github.com/doubt72/utsg/issues">
                  <BugFill/>report an issue
                </a>
              </div> : "" }
            <div className="nowrap">
              <a className="custom-button" href="https://github.com/doubt72/utsg/blob/main/changelog.md">
                <ListColumnsReverse/>changelog
              </a>
            </div>
            <div><ReturnButton /></div>
          </div>
        </div>
        <div className="about-about ml05em">
          <p>
            <strong>Code of Conduct</strong>
          </p>
          <div className="ml1em">
            <p>
              <strong>1. Be Respectful</strong>: treat other players with courtesy. No insults,
              harrassment, or personal attacks. Disagreements may happen, but keep it civil. Being a
              jerk is not okay.
            </p>
            <p>
              <strong>2. No Hate or Bigotry</strong>: there&apos;s zero tolerance for racism,
              antisemitism, misogyny, homophobia, transphobia or any other forms of hate here (just
              because it isn&apos;t explicitly listed doesn&apos;t make it okay). This applies to
              chat, as well as game names and usernames.
            </p>
            <p>
              <strong>3. Keep It Historical, Not Political</strong>: this game simulates historical
              military conflicts — many of which were fought for terrible reasons by regimes
              responsible for enormous harm. Discussion of the history is fine. Political provocation
              is not. Focus on the game play and be respectful when discussing the period.
            </p>
            <p>
              <strong>4. Stay on Topic</strong>: use the main chat for game-related discussion.
              Don&apos;t spam or derail it with off-topic commentary. There are plenty of other places
              on the internet for that. This doesn&apos;t apply to in-game chats — as those can only
              be seen by people watching the game, there&apos;s no real need to cut down on noise, so
              players can feel free to use them however they like (assuming the other rules here are
              observed, obviously).
            </p>
            <p>
              <strong>5. Don&apos;t Abandon Games</strong>: when you join a game, commit to seeing it
              through. Dropping out without notice ruins the experience for everyone else. While games
              aren&apos;t considered officially abandoned by the server for seven days, be considerate
              and try not to push that limit. If something comes up and you can&apos;t continue, let
              your opponent know in the chat, and a resignation is acceptable. It&apos;s also fine to
              resign if the game seems lost and you don&apos;t want to keep playing. It&apos;s not
              fine to just disappear. If both players agree (preferably in advance) to resume play
              after a long break (even beyond a week), that&apos;s okay, just don&apos;t make a habit
              of it. Repeated abandonments will show up in your stats, and other players are
              within their rights to avoid you in future games, and the management reserves the right
              to take action.
            </p>
            <p>
              <strong>6. Report, Don&apos;t Escalate</strong>: If you see someone violating the code
              of conduct, don&apos;t engage — report it to the admins (use the button below).
            </p>
          </div>
          <p>
            Violations may result in warnings, suspensions, or bans depending on severity at the
            sole discretion of the management.
          </p>
          {}
          <div className="align-end mt2em">
            { localStorage.getItem("username") ? <ContactButton /> :
                "[You must be logged in for the feedback form to be accessible.]" }
          </div>
        </div>
      </div>
    </div>
  );
}
