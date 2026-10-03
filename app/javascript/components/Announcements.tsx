import React from "react";
import Header from "./Header";
import { AboutButton } from "./utilities/buttons";

export default function Announcements() {
  return (
    <div>
      <Header />
      <div className="standard-body about-around">
        <div className="flex-fill"></div>
        <div className="about-previous">
          <p>
            <strong>Previous Announcements:</strong>
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
          <div className="flex mt2em">
            <div className="flex-fill"></div>
            <div>
              <AboutButton />
            </div>
          </div>
        </div>
        <div className="flex-fill"></div>
      </div>
    </div>
  );
}
