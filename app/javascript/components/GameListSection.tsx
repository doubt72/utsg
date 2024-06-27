import React, { useEffect, useState } from "react";
import { CaretDownFill, CaretUp, CaretUpFill } from "react-bootstrap-icons";
import { getAPI } from "../utilities/network";
import GameListRow from "./GameListRow";

interface GameListSectionProps {
  scope: string;
  user?: string;
}

export default function GameListSection({ scope, user}: GameListSectionProps) {
  const [page, setPage] = useState(0)
  const [reload, setReload] = useState(0)
  const [scroll, setScroll] = useState({ up: false, down: false })
  const [games, setGames] = useState([])

  useEffect(() => {
    const params: Record<string, string> = {
      scope: scope, page: page.toString()
    }
    if (user) {
      params.user = user
    }
    const urlParams = new URLSearchParams(params).toString()
    getAPI("/api/v1/games?" + urlParams, {
      ok: response => {
        response.json().then(json => {
          const list = json.data.length > 0 ? json.data : [{ empty: true }]
          setGames(list)
          setScroll({ up: json.page > 0, down: json.more })
          if (page > 0 && json.data.length < 1) {
            setPage(page - 1)
          }
        })
      }
    })
  }, [page, reload])

  const pollTime = 10000 // 10 seconds
  useEffect(() => {
    setInterval(() => {
      // TODO switch this to a cable, this could be a lot of requests
      setReload(r => r + 1)
    }, pollTime)
  }, [])

  const scrollUp = scroll.up ?
    <div onClick={() => setPage(page - 1)}><CaretUpFill /></div> :
    (scroll.down ? <div><CaretUp /></div> :
      <div className="transparent"><CaretUpFill /></div>)

  const scrollDown = scroll.down ?
    <div onClick={() => setPage(page + 1)}><CaretDownFill /></div> : ""

  return (
    <div className="flex">
      <div className="flex-fill">{ games.map((g, i) => <GameListRow key={i} data={g} />) }</div>
      <div className="ml05em control-large">{scrollUp}{scrollDown}</div>
    </div>
  )
}
