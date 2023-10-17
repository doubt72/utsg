import React, { useCallback, useEffect, useState } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { getAPI } from "../../utilities/network";
import PropTypes from "prop-types"

export default function MoveDisplay(props) {
  const [moves, setMoves] = useState([])

  const { sendJsonMessage, lastMessage, readyState } = useWebSocket("ws://localhost:3000/cable")

  const subscribe = useCallback(() => {
    sendJsonMessage({
      command: "subscribe",
      identifier: `{ "channel": "MessageChannel", "game_id": ${props.gameId} }`,
    })
  })

  useEffect(() => {
    getAPI(`/api/v1/messages?game_id=${props.gameId}`, {
      ok: response => response.json().then(json => setMoves(json))
    })
  }, [])

  useEffect(() => {
    if (readyState === ReadyState.OPEN) {
      subscribe()
    }
  }, [readyState])

  useEffect(() => {
    if (lastMessage) {
      const msg = JSON.parse(lastMessage.data).message
      if (msg && msg.body) {
        setMoves([...moves, msg.body])
      }
    }
  }, [lastMessage])

  const displayClass = "move-output move-output-logged-" + (localStorage.getItem('username') ? "in" : "out")

  const moveList = (
    <div className={displayClass}>
      {
        [...moves].map((msg, i) => {
          const date = new Date(msg.created_at)
          if (new Date(Date.now() - 24 * 3600 * 1000) > date) {
            return ("")
          }
          const time = `${("0" + date.getHours()).slice (-2)}:` +
            `${("0" + date.getMinutes()).slice (-2)}:` +
            `${("0" + date.getSeconds()).slice (-2)}`
          return (
            <div key={i} className="move-output-record">
              <div className="move-output-date">{time}</div>
              <div className="move-output-message">
                <span className="move-output-username">{msg.user}</span>{msg.value}
              </div>
            </div>
          )
        }).reverse()
      }
    </div>
  )

  return (
    <div>
      { moveList }
    </div>
  )
}

MoveDisplay.propTypes = {
  gameId: PropTypes.number,
}
