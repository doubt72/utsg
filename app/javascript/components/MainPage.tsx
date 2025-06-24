import React, { useEffect } from "react";
import Header from './Header'
import { useNavigate } from "react-router-dom";
import ChatDisplay from "./ChatDisplay";
import { CreateGameButton } from "./utilities/buttons";
import GameList from "./GameList";

export default function MainPage() {
  const navigate = useNavigate()

  useEffect(() => {
    if (localStorage.getItem("validationNeeded")) {
      navigate("/verify_account", { replace: true })
    }
  }, [])

  const newGameButton = (
    <div className="main-page-start-game">
      <span className="red font11em">&gt; &gt; &gt; &gt; &gt;</span> <CreateGameButton />
    </div>
  )

  const loggedIn = !!localStorage.getItem('username')

  const classes = "main-page-announcements main-page-announcements-logged-" + (loggedIn ? "in" : "out")

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
              The <strong>One More Hex</strong> server is still massively under construction.  If you&apos;re seeing this, you&apos;re
              probably just looking at the github repo, nothing is actually out there being hosted
              anywhere yet.

              There are, as yet, no announcements.
            </p>
          </div>
          { loggedIn ? newGameButton : "" }
        </div>
      </div>
      <GameList />
    </div>
  )
}
