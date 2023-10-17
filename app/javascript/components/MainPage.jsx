import React, { useEffect } from "react";
import Header from './Header'
import { useNavigate } from "react-router-dom";
import ChatDisplay from "./ChatDisplay";
import { CreateGameButton } from "./utilities/buttons";

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
          <ChatDisplay gameId={0} />
        </div>
        <div>
          <div className={classes}>
            <p>
              The UTSG server is still massively under construction.  If you're seeing this, you're
              probably just looking at the github repo, nothing is actually out there being hosted
              anywhere yet.

              There are, as yet, no announcements.
            </p>
          </div>
          { loggedIn ? newGameButton : "" }
        </div>
      </div>
    </div>
  )
}
