import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import GameDisplay from "./GameDisplay";
import NoGameDisplay from "./NoGameDisplay";

export default function GameDisplayPage() {
  const { id } = useParams()
  const navigate = useNavigate();

  useEffect(() => {
    history.pushState(null, "", location.pathname)
    const handlePopState = () => { history.pushState(null, "", location.pathname) }
    window.addEventListener('popstate', handlePopState)
    return () => {
      window.removeEventListener("popstate", handlePopState)
    }
  }, [navigate, location])

  const [game, setGame] = useState<JSX.Element | undefined>()

  const softDesynced = () => {
    console.log("!!! reloading game !!!")
    setGame(<NoGameDisplay loadCallback={loadGame} />)
  }

  const loadGame = () => {
    setGame(<GameDisplay id={id} softDesynced={softDesynced} />)
  }

  useEffect(() => {
    if (localStorage.getItem("validationNeeded")) {
      navigate("/verify_account", { replace: true });
    }
  }, []);

  useEffect(() => {
    loadGame()
  }, [])

  return (
    <>
      { game }
    </>
  )
}
