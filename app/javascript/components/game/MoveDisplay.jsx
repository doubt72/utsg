import React, { useCallback, useEffect, useState } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import PropTypes from "prop-types"
import { GameMove } from "../../engine/gameMove";
import { getAPI } from "../../utilities/network";

export default function MoveDisplay(props) {
  const [moves, setMoves] = useState([])

  const { sendJsonMessage, lastMessage, readyState } = useWebSocket("ws://localhost:3000/cable")

  const subscribe = useCallback(() => {
    sendJsonMessage({
      command: "subscribe",
      identifier: `{ "channel": "MoveChannel", "game_id": ${props.gameId} }`,
    })
  })

  useEffect(() => {
    getAPI(`/api/v1/game_moves?game_id=${props.gameId}`, {
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
        props.callback()
      }
    }
  }, [lastMessage])

  const displayClass = "move-output move-output-logged-" + (props.chatInput ? "in" : "out")

  const moveList = (
    <div className={displayClass}>
      {
        [...moves].map((m, i) => {
          const move = new GameMove(m)
          return (
            <div key={i} className="move-output-record">
              <div className="move-output-date">{move.formattedDate}</div>
              <div className="move-output-message">
                <span className="move-output-username">{move.user}</span>{move.description}
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
  gameId: PropTypes.number.isRequired,
  callback: PropTypes.func.isRequired,
  chatInput: PropTypes.bool.isRequired,
}
