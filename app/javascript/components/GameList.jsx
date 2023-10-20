import React, { useEffect, useState } from "react";
import { getAPI } from "../utilities/network";
import GameListRow from "./GameListRow";
import { CaretDownFill, CaretUp, CaretUpFill } from "react-bootstrap-icons";

export default function GameList() {
  const [show, setShow] = useState({ tab: null, newPage: 0, activePage: 0, completePage: 0 })
  const [current, setCurrent] = useState({ tab: null, newPage: 0, activePage: 0, completePage: 0 })

  const [scroll, setScroll] = useState({
    newUp: false, newDown: false,
    activeUp: false, activeDown: false,
    completeUp: false, completeDown: false,
  })

  const [newGames, setNewGames] = useState([])
  const [activeGames, setActiveGames] = useState([])
  const [completedGames, setCompletedGames] = useState([])

  useEffect(() => {
    if (show.tab === null) {
      if (localStorage.getItem("username")) {
        setTab(2)
      } else {
        setTab(0)
      }
      return
    }
    const newScroll = scroll
    if (show.tab === 2) {
      const params = { scope: "needs_action", page: show.newPage }
      let urlParams = new URLSearchParams(params).toString()
      if (show.tab !== current.tab || show.newPage !== current.newPage) {
        getAPI("/api/v1/games?" + urlParams, {
          ok: response => {
            response.json().then(json => {
              const list = json.data.length > 0 ? json.data : [{ empty: true }]
              newScroll.newUp = json.page > 0
              newScroll.newDown = json.more
              setNewGames(list)
            })
          }
        })
      }
      if (show.tab !== current.tab || show.activePage !== current.activePage) {
        params.scope = "needs_move"
        params.page = show.activePage
        urlParams = new URLSearchParams(params).toString()
        getAPI("/api/v1/games?" + urlParams, {
          ok: response => {
            response.json().then(json => {
              const list = json.data.length > 0 ? json.data : [{ empty: true }]
              newScroll.activeUp = json.page > 0
              newScroll.activeDown = json.more
              setActiveGames(list)
            })
          }
        })
      }
    } else {
      const params = { scope: "not_started", page: show.newPage }
      if (show.tab == 1) {
        params.user = localStorage.getItem("username")
      }
      let urlParams = new URLSearchParams(params).toString()
      if (show.tab !== current.tab || show.newPage !== current.newPage) {
        getAPI("/api/v1/games?" + urlParams, {
          ok: response => {
            response.json().then(json => {
              const list = json.data.length > 0 ? json.data : [{ empty: true }]
              newScroll.newUp = json.page > 0
              newScroll.newDown = json.more
              setNewGames(list)
            })
          }
        })
      }
      if (show.tab !== current.tab || show.activePage !== current.activePage) {
        params.scope = "active"
        params.page = show.activePage
        urlParams = new URLSearchParams(params).toString()
        getAPI("/api/v1/games?" + urlParams, {
          ok: response => {
            response.json().then(json => {
              const list = json.data.length > 0 ? json.data : [{ empty: true }]
              newScroll.activeUp = json.page > 0
              newScroll.activeDown = json.more
              setActiveGames(list)
            })
          }
        })
      }
      if (show.tab !== current.tab || show.completePage !== current.completePage) {
        params.scope = "complete"
        params.page = show.completePage
        urlParams = new URLSearchParams(params).toString()
        getAPI("/api/v1/games?" + urlParams, {
          ok: response => {
            response.json().then(json => {
              const list = json.data.length > 0 ? json.data : [{ empty: true }]
              newScroll.completeUp = json.page > 0
              newScroll.completeDown = json.more
              setCompletedGames(list)
            })
          }
        })
      }
    }
    setScroll(newScroll)
    setCurrent({
      tab: show.tab, newPage: show.newPage, activePage: show.activePage,
      completePage: show.completePage
    })
  }, [show])

  const setTab = (tab) => {
    setShow({ tab: tab, newPage: 0, activePage: 0, completePage: 0 })
  }

  const setNewPage = (page) => {
    setShow({ ...show, newPage: page})
  }

  const setActivePage = (page) => {
    setShow({ ...show, activePage: page})
  }

  const setCompletePage = (page) => {
    setShow({ ...show, completePage: page})
  }

  const tabClasses = (index) => {
    return `bold ${show.tab === index ? "green" : "red"} main-page-list-tab ` +
           `main-page-list-tab-${show.tab === index ? "" : "un"}selected`
  }

  const newGameUp = scroll.newUp ?
    <div onClick={() => setNewPage(show.newPage - 1)}><CaretUpFill /></div> :
    (scroll.newDown ? <div><CaretUp /></div> :
      <div className="transparent"><CaretUpFill /></div>)

  const newGameDown = scroll.newDown ?
    <div onClick={() => setNewPage(show.newPage + 1)}><CaretDownFill /></div> : ""

  const activeGameUp = scroll.activeUp ?
    <div onClick={() => setActivePage(show.newPage - 1)}><CaretUpFill /></div> :
    (scroll.activeDown ? <div><CaretUp /></div> :
      <div className="transparent"><CaretUpFill /></div>)

  const activeGameDown = scroll.activeDown ?
    <div onClick={() => setActivePage(show.newPage + 1)}><CaretDownFill /></div> : ""

  const completeGameUp = scroll.completeUp ?
    <div onClick={() => setCompletePage(show.newPage - 1)}><CaretUpFill /></div> :
    (scroll.completeDown ? <div><CaretUp /></div> :
      <div className="transparent"><CaretUpFill /></div>)

  const completeGameDown = scroll.completeDown ?
    <div onClick={() => setCompletePage(show.newPage + 1)}><CaretDownFill /></div> : ""

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