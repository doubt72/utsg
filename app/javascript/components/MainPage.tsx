import React, { useEffect, useState } from "react";
import Header from "./Header";
import ChatDisplay from "./ChatDisplay";
import { CreateGameButton, ScenariosButton } from "./utilities/buttons";
import GameList from "./GameList";
import { titleNameStyle } from "./Utilities";
import { useNavigate } from "react-router-dom";

export default function MainPage() {
  const navigate = useNavigate();

  const [tab, setTab] = useState<number>(0)

  useEffect(() => {
    if (localStorage.getItem("validationNeeded")) {
      navigate("/verify_account", { replace: true });
    }
  }, []);

  const newGameButton = (
    <div className="main-page-start-game">
      <span className="red font11em">&gt; &gt; &gt; &gt; &gt;</span> <CreateGameButton />
    </div>
  );

  const seeScenariosButton = (
    <div className="main-page-start-game">
      <span className="red font11em">&gt; &gt; &gt; &gt; &gt;</span> <ScenariosButton />
    </div>
  );

  const loggedIn = !!localStorage.getItem("username");

  const tabClasses = (index: number) => {
    return `bold ${tab === index ? "green" : "red"} main-page-list-tab ` +
           `main-page-list-tab-${tab === index ? "" : "un"}selected`
  }

  return (
    <div className="main-page home-page">
      <Header />
      <div className="standard-body">
        <div className="main-page-welcome">
          <div className="main-page-list-tabs">
            <div className={tabClasses(0)} onClick={() => setTab(0)}>welcome</div>
            <div className={tabClasses(1)} onClick={() => setTab(1)}>chat</div>
            <div className="flex-fill"></div>
          </div>
          { tab === 0 ?
            <div className="main-page-welcome-contents">
              <a href="/assets/scenario-animation.gif">
                <img className="main-page-scenario-loop" src="/assets/scenario-animation.gif" alt="scenario loop" />
              </a>
              <p>
                Welcome to the <strong>{titleNameStyle}</strong> server!  The server is currently
                in beta as I continue to shake things down, work out the bugs, and test the scenarios.  See
                the <a className="regular" href="/about">about</a> page for more information
                about the server, the code of conduct, or to report bugs.
              </p>
              <p>
                Best with Chromium-based browsers; it should work with any modern browser, but
                rendering performance can vary significantly.
              </p>
            </div> :
            <div className={`main-page-chat-section${loggedIn ? "" : " main-page-chat-section-logged-out"}`}>
              <ChatDisplay gameId={0} showInput={loggedIn} desyncCallback={() => {}} />
            </div> }
        </div>
        <div>
          <div className="main-page-announcements">
            <p>
              <strong>Latest announcement</strong>: <a className="regular" href="/about/a20260618">
                Scenarios Ready
              </a>
            </p>
            <p>
              View a video <a className="regular" href="https://youtu.be/0wJj1YgMCVc">tutorial</a>,{" "}
              <a className="regular" href="https://youtu.be/iJUNHKPXRaw">video</a>{" "}
              <a className="regular" href="https://youtu.be/KuXc-RpKwNk">playthroughs</a> of the game, or{" "}
              check out the <a className="regular" href="/help">documentation</a>.
            </p>
            <p>
              Join us on <a className="regular" href="https://discord.gg/URDcFwNGA7">Discord</a>.
            </p>
            {/* <p>
              Support the work (and/or my mild coffee addiction)
              on <a className="regular" href="https://www.patreon.com/cw/u43420358">Patreon</a> or
              on <a className="regular" href="https://ko-fi.com/doub72">Ko-fi</a> or
              maybe just <a className="regular" href="https://buymeacoffee.com/doubt72">Buy Me a Coffee</a>.
            </p> */}
            { loggedIn ?
              <p>
                Create new game below to start.
              </p> :
              <p>
                Sign up (or sign in) above to start.
              </p> }
          </div>
          {loggedIn ? newGameButton : seeScenariosButton}
        </div>
      </div>
      <GameList />
    </div>
  );
}
