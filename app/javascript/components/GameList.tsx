import React, { useCallback, useEffect, useState } from "react";
import GameListSection from "./GameListSection";
import { GameRowData } from "./GameListRow";
import useWebSocket, { ReadyState } from "react-use-websocket";

type GameDisplayType = {
  notStarted: string | JSX.Element;
  active: string | JSX.Element;
  complete: string | JSX.Element;
}

export default function GameList() {
  const user = localStorage.getItem("username") ?? undefined

  const host = window.location.host
  const protocol = host === "ahextoofar.games" ? "wss" : "ws"
  const { sendJsonMessage, lastMessage, readyState } = useWebSocket(
    `${protocol}://${host}/cable`
  )

  const subscribe = useCallback(() => {
    sendJsonMessage({
      command: "subscribe",
      identifier: `{ "channel": "GameChannel", "game_id": 0 }`,
    })
  }, [])

  useEffect(() => {
    if (readyState === ReadyState.OPEN) {
      subscribe()
    } else if ([ReadyState.CLOSED, ReadyState.CLOSING, ReadyState.UNINSTANTIATED].includes(readyState)) {
      console.log("game feed sync closed, reload page to continue getting updates")
    }
  }, [readyState])

  useEffect(() => {
    if (lastMessage) {
      const msg = JSON.parse(lastMessage.data).message
      if (msg && msg.body) {
        setQueue00(s => [...s, msg.body])
        setQueue01(s => [...s, msg.body])
        setQueue10(s => [...s, msg.body])
        setQueue11(s => [...s, msg.body])
        setQueue12(s => [...s, msg.body])
        setQueue20(s => [...s, msg.body])
        setQueue21(s => [...s, msg.body])
        setQueue22(s => [...s, msg.body])
      }
    }
  }, [lastMessage])

  const [tab, setTab] = useState(user ? 0 : 2)
  const [games, setGames] = useState<GameDisplayType>({
    notStarted: "", active: "", complete: ""
  })

  const [queue00, setQueue00] = useState<GameRowData[]>([])
  const [queue01, setQueue01] = useState<GameRowData[]>([])
  const [queue10, setQueue10] = useState<GameRowData[]>([])
  const [queue11, setQueue11] = useState<GameRowData[]>([])
  const [queue12, setQueue12] = useState<GameRowData[]>([])
  const [queue20, setQueue20] = useState<GameRowData[]>([])
  const [queue21, setQueue21] = useState<GameRowData[]>([])
  const [queue22, setQueue22] = useState<GameRowData[]>([])

  const shiftQueue00 = () => {
    setQueue00(s => s.slice(1))
  }
  const shiftQueue01 = () => {
    setQueue01(s => s.slice(1))
  }
  const shiftQueue10 = () => {
    setQueue10(s => s.slice(1))
  }
  const shiftQueue11 = () => {
    setQueue11(s => s.slice(1))
  }
  const shiftQueue12 = () => {
    setQueue12(s => s.slice(1))
  }
  const shiftQueue20 = () => {
    setQueue20(s => s.slice(1))
  }
  const shiftQueue21 = () => {
    setQueue21(s => s.slice(1))
  }
  const shiftQueue22 = () => {
    setQueue22(s => s.slice(1))
  }

  useEffect(() => {
    if (tab === 0) {
      setGames({
        notStarted: <GameListSection key="00" scope="needs_player_start" user=""
                                     queue={queue00} shiftQueue={shiftQueue00} />,
        active: <GameListSection key="01" scope="needs_action" user=""
                                 queue={queue01} shiftQueue={shiftQueue01} />,
        complete: ""
      })
    } else if (tab === 1) {
      setGames({
        notStarted: <GameListSection key="10" scope="not_started" user={user}
                                     queue={queue10} shiftQueue={shiftQueue10} />,
        active: <GameListSection key="11" scope="active" user={user}
                                 queue={queue11} shiftQueue={shiftQueue11} />,
        complete: <GameListSection key="12" scope="complete" user={user}
                                   queue={queue12} shiftQueue={shiftQueue12} />
      })
    } else {
      setGames({
        notStarted: <GameListSection key="20" scope="not_started" user=""
                                     queue={queue20} shiftQueue={shiftQueue20} />,
        active: <GameListSection key="21" scope="active" user=""
                                 queue={queue21} shiftQueue={shiftQueue21} />,
        complete: <GameListSection key="22" scope="complete" user=""
                                   queue={queue22} shiftQueue={shiftQueue22} />
      })
    }
  }, [tab, queue00, queue01, queue10, queue11, queue12, queue20, queue21, queue22])

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