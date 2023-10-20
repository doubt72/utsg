import React, { useEffect, useState } from "react";
import { getAPI } from "../utilities/network";
import GameListRow from "./GameListRow";
import { CaretDownFill, CaretUpFill } from "react-bootstrap-icons";

export default function GameList() {
  const [show, setShow] = useState({ tab: null, newPage: 0, activePage: 0, completPage: 0 })

  const [scroll, setScroll] = useState({
    newUp: false, newDown: false,
    activeUp: false, activeDown: false,
    completeUp: false, completeDown: false,
  })

  const [newGames, setNewGames] = useState([])
  const [activeGames, setActiveGames] = useState([])
  const [completedGames, setCompletedGames] = useState([])

  useEffect(() => {
    setScroll // TODO get past the linter temporarily
    if (show.tab === null) {
      if (localStorage.getItem("username")) {
        setTab(2)
      } else {
        setTab(0)
      }
      return
    }
    if (show.tab === 2) {
      getAPI("/api/v1/games?scope=needs_action", {
        ok: response => {
          response.json().then(json => {
            const list = json.data.length > 0 ? json.data : [{ empty: true }]
            setNewGames(list)
          })
        }
      })
      getAPI("/api/v1/games?scope=needs_move", {
        ok: response => {
          response.json().then(json => {
            const list = json.data.length > 0 ? json.data : [{ empty: true }]
            setActiveGames(list)
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
            const list = json.data.length > 0 ? json.data : [{ empty: true }]
            setNewGames(list)
          })
        }
      })
      params.scope = "active"
      urlParams = new URLSearchParams(params).toString()
      getAPI("/api/v1/games?" + urlParams, {
        ok: response => {
          response.json().then(json => {
            const list = json.data.length > 0 ? json.data : [{ empty: true }]
            setActiveGames(list)
          })
        }
      })
      params.scope = "complete"
      urlParams = new URLSearchParams(params).toString()
      getAPI("/api/v1/games?" + urlParams, {
        ok: response => {
          response.json().then(json => {
            const list = json.data.length > 0 ? json.data : [{ empty: true }]
            setCompletedGames(list)
          })
        }
      })
    }
  }, [show])

  const setTab = (tab) => {
    setShow({ tab: tab, newPage: 0, activePage: 0, completPage: 0 })
  }

  const tabClasses = (index) => {
    return `bold ${show.tab === index ? "green" : "red"} main-page-list-tab ` +
           `main-page-list-tab-${show.tab === index ? "" : "un"}selected`
  }

  const newGameUp = scroll.newUp ? <div><CaretUpFill /></div> :
                                   <div className="transparent"><CaretUpFill /></div>

  const newGameDown = scroll.newDown ? <div><CaretDownFill /></div> : ""

  const activeGameUp = scroll.activeUp ? <div><CaretUpFill /></div> :
                                         <div className="transparent"><CaretUpFill /></div>

  const activeGameDown = scroll.activeDown ? <div><CaretDownFill /></div> : ""

  const completeGameUp = scroll.completeUp ? <div><CaretUpFill /></div> :
                                             <div className="transparent"><CaretUpFill /></div>

  const completeGameDown = scroll.completeDown ? <div><CaretDownFill /></div> : ""

  return (
    <div className="main-page-list-container">
      <div className="main-page-list-tabs">
        { localStorage.getItem("username") ?
            <div className={tabClasses(2)} onClick={() => setTab(2)}>ready</div> : "" }
        { localStorage.getItem("username") ?
            <div className={tabClasses(1)} onClick={() => setTab(1)}>my games</div> : "" }
        <div className={tabClasses(0)} onClick={() => setTab(0)}>all games</div>
        <div className="flex-fill"></div>
      </div>
      <div className="main-page-list-contents">
        <div className={"bold green ml1em"}>new games</div>
        <div className="flex">
          <div className="flex-fill">{ newGames.map((g, i) => <GameListRow key={i} data={g} />) }</div>
          <div className="ml05em control-large">{newGameUp}{newGameDown}</div>
        </div>
        <div className={"bold green ml1em mt05em"}>active games</div>
        <div className="flex">
          <div className="flex-fill">{ activeGames.map((g, i) => <GameListRow key={i} data={g} />) }</div>
          <div className="ml05em control-large">{activeGameUp}{activeGameDown}</div>
        </div>
        { show.tab !== 2 ? <div className={"bold green ml1em mt05em"}>completed games</div> : "" }
        { show.tab !== 2 ? 
          <div className="flex">
            <div className="flex-fill">{ completedGames.map((g, i) => <GameListRow key={i} data={g} />) }</div>
          <div className="ml05em control-large">{completeGameUp}{completeGameDown}</div>
          </div> : "" }
      </div>
    </div>
  )
}