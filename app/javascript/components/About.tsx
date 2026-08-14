import React, { useEffect } from "react";
import Header from "./Header";
import { AboutHelpButton, ContactButton, ReturnButton } from "./utilities/buttons";
import { subtitleNameStyle, titleNameStyle } from "./Utilities";
import { serverVersion, subtitleName, titleName } from "../utilities/utilities";
import { BugFill, ListColumnsReverse } from "react-bootstrap-icons";
import { useLocation, useNavigate, useParams } from "react-router-dom";

export default function About() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    history.pushState(null, "", location.pathname)
    const handlePopState = () => { history.pushState(null, "", location.pathname) }
    window.addEventListener('popstate', handlePopState)
    return () => {
      window.removeEventListener("popstate", handlePopState)
    }
  }, [navigate, location])

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
          <p>
            If you&apos;re looking for a quick introduction to the game, scenario{" "}
            <strong>000</strong>: <em>A Simple Matter</em> is a simple infantry meeting engagement
            indended as a tutorial scenario, with no tanks or artillery or wires or mines, and no
            elevation or crazy weather or more fiddly rules to worry about. From there, there are
            lots of choices: in particular, pay attention to the map size and what units are
            included in the scenario descriptions. Note that playing as the attacker is much more
            difficult for beginners than defending, and that&apos;s true to a greater or lesser
            extent depending on the scenario.
          </p>
          <p>
            There is also a video{" "}
            <a className="regular" href="https://youtu.be/0wJj1YgMCVc">
              tutorial
            </a>{" "}
            available, as well as a couple playthroughs: an{" "}
            <a className="regular" href="https://youtu.be/iJUNHKPXRaw">
              infantry
            </a>{" "}
            scenario and an{" "}
            <a className="regular" href="https://youtu.be/KuXc-RpKwNk">
              armored
            </a>{" "}
            scenario. We plan to add a combined-arms scenario at some point soon.
          </p>
          <p>
            <strong>Recent Announcements:</strong>
          </p>
          <div id="a20260813" className="about-announcement">
            <p>
              <span className="about-announcement-header">More Progress</span>
            </p>
            <p>
              <strong>13 Aug 2026</strong>: It&apos;s been quite a while since the last
              announcement, almost two months. Part of that is just not getting around to adding
              anything here, part of that is the fact that no major changes (in terms of status)
              have happened, part of that was a (not-life-threatening but very annoying) health
              thing that was a major distraction for me.
            </p>
            <p>
              For the most part, the biggest changes have been in playtesting; the number of
              &quot;ready&quot; scenarios is approaching thirty now. Other than that, there have
              been quite a few bug fixes and (hopefully) improvements to the control flow, and even
              a new feature or two (most recently, the addition of tank crews). There was also a
              major purge of old games when that happened; given the small active user base of about
              2.5 people at that point (up to 4.5 people now!), it wasn&apos;t really worth making
              those changes backwards compatible, and the vast majority of deleted games were
              playtests by me.
            </p>
            <p>
              Probably the biggest thing that&apos;s still coming is the scenario editor (which is
              technically already available if you know where to look). At this point, though,
              it&apos;s not really integrated with the rest of the site (and it probably will never
              be particularly polished compared to the game itself).
            </p>
            <p>
              Anyway, while things are increasingly stable, particularly for the more fiddly rules
              in the more recently-playtested scenarios, things are still basically in beta, and
              feedback (as always) is still appreciated.
            </p>
          </div>
          <div id="a20260618" className="about-announcement">
            <p>
              <span className="about-announcement-header">Scenarios Ready</span>
            </p>
            <p>
              <strong>18 Jun 2026</strong>: We&apos;ve made a fair bit of progress in the last
              month.
            </p>
            <p>
              Lately the most significant effort has been in playtesting, and at this point almost
              twenty scenarios have been tested enough that we think they&apos;re actually ready for
              play. Most of these were already marked as &quot;ready&quot; on the new game page, but
              now they actually are, and a couple of beta scenarios have been tested and promoted.
            </p>
            <p>
              Still looking for feedback (again, for the UX, design, bugs, scenarios, or whatever).
              Any of the scenarios might still change (and old games of those scenarios might still
              be deleted if those changes are significant), though it&apos;s even less likely for
              the &quot;ready&quot; scenarios than it was before, and things seem like they might
              even be fine for async play (though that&apos;s only been lightly tested at this
              point). If you see anything odd (particularly games that seem stalled and/or produce
              duplicate turn notification emails), please let us know.
            </p>
            <p>
              Also... A tutorial and a couple of playthroughs are now available (see immediately
              above the announcements here).
            </p>
          </div>
          <div id="a24042026" className="about-announcement">
            <p>
              <span className="about-announcement-header">AHTF to Beta!</span>
            </p>
            <p>
              <strong>24 Apr 2026</strong>: A Hex Too Far is hereby officially declared to be out of
              alpha and into beta testing. It&apos;s time.
            </p>
            <p>
              While the server is still under active development, things should be a bit more stable
              now, with frequent (albeit not-quite-as-frequent) deploys. Some games will probably
              still be deleted from time to time (particularly if any of scenarios undergo any major
              changes), and while email turn notifications have been implemented and turned on, long
              async games are still not recommended.
            </p>
            <p>
              Feedback is still welcomed and encouraged (for the UX, design, bugs, whatever). Any of
              the scenarios might still change, though it&apos;s less likely now for
              &quot;ready&quot; scenarios than it was before.
            </p>
          </div>
          <div id="a02042026" className="about-announcement">
            <p>
              <span className="about-announcement-header">Note to Players</span>
            </p>
            <p>
              <strong>2 Apr 2026</strong>: while the server is definitely under construction, do
              feel free to play games knowing that things may break, deploys will be frequent, and
              all the games <strong>will</strong> be deleted at some point when we&apos;re ready to
              flip the &quot;release&quot; switch. Games may also be deleted at other times if the
              archetecture changes enough to break old games (as has already happend). Otherwise,
              old games may break in (probably) minor ways as things are fixed and polished.
            </p>
            <p>
              In other words, finishing games immediately should <em>mostly</em> be fine, but
              don&apos;t leave games sitting for too long, and async games are probably a bad idea
              (and move notifications haven&apos;t even been enabled yet).
            </p>
            <p>
              Feedback is still welcomed and encouraged, be it about the UX or design, or if you
              find any bugs. Note that a bunch of scenarios are listed as &quot;ready&quot; for
              convenience&apos; sake; many of them really aren&apos;t and probably should be
              considered to be in beta status at best. The plan is to have them tested and at least
              somewhat balanced by the time the server itself is ready.
            </p>
          </div>
          <p>
            Server version <span className="red">{serverVersion}&#x3B2;</span>: currently a work in
            progress and probably always will be.
          </p>
          <div className="flex mt2em">
            <div className="flex-fill"></div>
            <div>{AboutHelpButton("docs")}</div>
            {localStorage.getItem("username") ? (
              <div className="nowrap">
                <a className="custom-button" href="https://github.com/doubt72/utsg/issues">
                  <BugFill />
                  report an issue
                </a>
              </div>
            ) : (
              ""
            )}
            <div className="nowrap">
              <a
                className="custom-button"
                href="https://github.com/doubt72/utsg/blob/main/changelog.md"
              >
                <ListColumnsReverse />
                changelog
              </a>
            </div>
            <div>
              <ReturnButton />
            </div>
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
              responsible for enormous harm. Discussion of the history is fine. Political
              provocation is not. Focus on the game play and be respectful when discussing the
              period.
            </p>
            <p>
              <strong>4. Stay on Topic</strong>: use the main chat for game-related discussion.
              Don&apos;t spam or derail it with off-topic commentary. There are plenty of other
              places on the internet for that. This doesn&apos;t apply to in-game chats — as those
              can only be seen by people watching the game, there&apos;s no real need to cut down on
              noise, so players can feel free to use them however they like (assuming the other
              rules here are observed, obviously).
            </p>
            <p>
              <strong>5. Don&apos;t Abandon Games</strong>: when you join a game, commit to seeing
              it through. Dropping out without notice ruins the experience for everyone else. While
              games aren&apos;t considered officially abandoned by the server for seven days, be
              considerate and try not to push that limit. If something comes up and you can&apos;t
              continue, let your opponent know in the chat, and a resignation is acceptable.
              It&apos;s also fine to resign if the game seems lost and you don&apos;t want to keep
              playing. It&apos;s not fine to just disappear. If both players agree (preferably in
              advance) to resume play after a long break (even beyond a week), that&apos;s okay,
              just don&apos;t make a habit of it. Repeated abandonments will show up in your stats,
              and other players are within their rights to avoid you in future games, and the
              management reserves the right to take action.
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
            {localStorage.getItem("username") ? (
              <ContactButton />
            ) : (
              "[You must be logged in for the feedback form to be accessible.]"
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
