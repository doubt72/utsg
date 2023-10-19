import React, { useEffect, useState } from "react";
import { getAPI } from "../utilities/network";
import GameListRow from "./GameListRow";

export default function GameList() {
  const [show, setShow] = useState({ tab: 0, newPage: 0, activePage: 0, completPage: 0 })

  const [newGames, setNewGames] = useState([])
  const [activeGames, setActiveGames] = useState([])
  const [completedGames, setCompletedGames] = useState([])

  useEffect(() => {
    if (show.tab === 2) {
      getAPI("/api/v1/games?scope=needs_action", {
        ok: response => {
          response.json().then(json => {
            setNewGames(json)
          })
        }
      })
      getAPI("/api/v1/games?scope=needs_move", {
        ok: response => {
          response.json().then(json => {
            setActiveGames(json)
          })
        }
      })
    } else {
      const params = { scope: "not_started" }
      if (show.tab == 1) {
        params.user = localStorage.getItem("username")
      }
      let urlParams = new URLSearchParams(params).toString()
      getAPI("/api/v1/games?" + urlParams, {
        ok: response => {
          response.json().then(json => {
            setNewGames(json)
          })
        }
      })
      params.scope = "active"
      urlParams = new URLSearchParams(params).toString()
      getAPI("/api/v1/games?" + urlParams, {
        ok: response => {
          response.json().then(json => {
            setActiveGames(json)
          })
        }
      })
      params.scope = "complete"
      urlParams = new URLSearchParams(params).toString()
      getAPI("/api/v1/games?" + urlParams, {
        ok: response => {
          response.json().then(json => {
            setCompletedGames(json)
          })
        }
      })
    }
  }, [show])

  const setTab = (tab) => {
    setShow({ tab: tab, newPage: 0, activePage: 0, completPage: 0 })
  }

  const tabClasses = (index) => {
    return `main-page-list-tab main-page-list-tab-${show.tab === index ? "" : "un"}selected`
  }

  return (
    <div className="main-page-list-container">
      <div className="main-page-list-tabs">
        <div className={tabClasses(0)} onClick={() => setTab(0)}>
          all games
        </div>
        { localStorage.getItem("username") ?
            <div className={tabClasses(1)} onClick={() => setTab(1)}>my games</div> : "" }
        { localStorage.getItem("username") ?
            <div className={tabClasses(2)} onClick={() => setTab(2)}>need action</div> : "" }
        <div className="flex-fill"></div>
      </div>
      <div className="main-page-list-contents">
        <div className="ml1em">new games</div>
        <div>{ newGames.map((g, i) => <GameListRow key={i} data={g} />) } </div>
        <div className="ml1em mt05em">active games</div>
        <div>{ activeGames.map((g, i) => <GameListRow key={i} data={g} />) }</div>
        { show.tab !== 2 ? <div className="ml1em mt05em">completed games</div> : "" }
        { show.tab !== 2 ? <div>{ completedGames.map((g, i) => <GameListRow key={i} data={g} />) }</div> : "" }
      </div>
    </div>
  )
}