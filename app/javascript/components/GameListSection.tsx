import React, { useEffect, useState } from "react";
import { CaretDownFill, CaretUp, CaretUpFill } from "react-bootstrap-icons";
import { getAPI } from "../utilities/network";
import GameListRow, { GameRowData } from "./GameListRow";

interface GameListSectionProps {
  scope: string;
  user?: string;
  queue: GameRowData[];
  shiftQueue: () => void;
}

export default function GameListSection({ scope, user, queue, shiftQueue }: GameListSectionProps) {
  const [page, setPage] = useState(0)
  const [scroll, setScroll] = useState({ up: false, down: false })
  const [games, setGames] = useState<GameRowData[]>([])
  const [update, setUpdate] = useState<number>(0)

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
  }, [page, update])

  useEffect(() => {
    if (queue.length < 1) { return }
    let check = false
    const record = queue[0]
    const currentUser = localStorage.getItem("username")
    shiftQueue()
    if (!user || user === record.player_one || user === record.player_two || user === record.owner) {
      if (scope === "not_started" && ["needs_player", "ready"].includes(record.state)) {
        check = true
      } else if (scope === "active" && record.state === "in_progress") {
        check = true
      } else if (scope === "complete" && record.state === "complete") {
        check = true
      } else if (scope === "needs_player_start" &&
          ((record.state === "ready" && record.owner === currentUser) ||
           (record.state === "needs_player" && record.owner !== currentUser)) ) {
        check = true
      } else if (scope === "needs_action" && record.current_player === currentUser &&
          record.state === "in_progress") {
        check = true
      } else {
        for (let i = 0; i < games.length; i++) {
          if (games[i].id === record.id) { check = true; break }
        }
      }
    }
    if (check) { setUpdate(s => s + 1)}
  }, [queue, queue.length])

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
