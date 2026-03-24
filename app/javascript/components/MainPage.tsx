import React, { useEffect } from "react";
import Header from "./Header";
import { useNavigate } from "react-router-dom";
import ChatDisplay from "./ChatDisplay";
import { CreateGameButton } from "./utilities/buttons";
import GameList from "./GameList";
import { titleNameStyle } from "./Utilities";

export default function MainPage() {
  const navigate = useNavigate();

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

  const loggedIn = !!localStorage.getItem("username");

  const classes =
    "main-page-announcements main-page-announcements-logged-" + (loggedIn ? "in" : "out");

  return (
    <div className="main-page">
      <Header />
      <div className="standard-body">
        <div className="chat-section">
          <ChatDisplay gameId={0} showInput={loggedIn} />
        </div>
        <div>
          <div className={classes}>
            <p>
              Welcome to the <strong>{titleNameStyle}</strong> server!  The server is currently
              in alpha as I shake things down, work out the bugs, and test the scenarios.  See
              the <a className="regular" href="/about">about</a> page for more information
              about the server or to report bugs.
            </p>
            {/* <p>
              Support the work (and/or my mild coffee addiction)
              on <a className="regular" href="https://www.patreon.com/cw/u43420358">Patreon</a> or
              on <a className="regular" href="https://ko-fi.com/doub72">Ko-fi</a> or
              maybe just <a className="regular" href="https://buymeacoffee.com/doubt72">Buy Me a Coffee</a>.
            </p> */}
            <p>
              <strong>Announcements:</strong></p>
            <p>
              Nothing to announce!  We&apos;re not quite open for business yet.
            </p>
          </div>
          {loggedIn ? newGameButton : ""}
        </div>
      </div>
      <GameList />
    </div>
  );
}
