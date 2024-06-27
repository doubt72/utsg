import React, { useEffect, useState } from "react";
import GameListSection from "./GameListSection";

type GameDisplayType = {
  notStarted: string | JSX.Element;
  active: string | JSX.Element;
  complete: string | JSX.Element;
}

export default function GameList() {
  const user = localStorage.getItem("username") ?? undefined

  const [tab, setTab] = useState(user ? 0 : 2)
  const [games, setGames] = useState<GameDisplayType>({
    notStarted: "", active: "", complete: ""
  })

  useEffect(() => {
    if (tab === 0) {
      setGames({
        notStarted: <GameListSection key="00" scope="needs_action" user="" />,
        active: <GameListSection key="01" scope="needs_move" user="" />,
        complete: ""
      })
    } else if (tab === 1) {
      setGames({
        notStarted: <GameListSection key="10" scope="not_started" user={user} />,
        active: <GameListSection key="11" scope="active" user={user} />,
        complete: <GameListSection key="12" scope="complete" user={user} />
      })
    } else {
      setGames({
        notStarted: <GameListSection key="20" scope="not_started" user="" />,
        active: <GameListSection key="21" scope="active" user="" />,
        complete: <GameListSection key="22" scope="complete" user="" />
      })
    }
  }, [tab])

  const tabClasses = (index: number) => {
    return `bold ${tab === index ? "green" : "red"} main-page-list-tab ` +
           `main-page-list-tab-${tab === index ? "" : "un"}selected`
  }

  return (
    <div className="main-page-list-container">
      <div className="main-page-list-tabs">
        { localStorage.getItem("username") ?
            <div className={tabClasses(0)} onClick={() => setTab(0)}>ready</div> : "" }
        { localStorage.getItem("username") ?
            <div className={tabClasses(1)} onClick={() => setTab(1)}>my games</div> : "" }
        <div className={tabClasses(2)} onClick={() => setTab(2)}>all games</div>
        <div className="flex-fill"></div>
      </div>
      <div className="main-page-list-contents">
        <div className={"bold green ml1em"}>new games</div>
        {games.notStarted}
        <div className={"bold green ml1em mt05em"}>active games</div>
        {games.active}
        { tab !== 0 ? <div className={"bold green ml1em mt05em"}>completed games</div> : "" }
        {games.complete}
      </div>
    </div>
  )
}