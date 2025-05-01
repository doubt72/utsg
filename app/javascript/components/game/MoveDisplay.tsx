import React, { useCallback, useEffect } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import Game from "../../engine/Game";

interface MoveDisplayProps {
  game: Game;
  callback: (moveId?: number) => void;
  chatInput: boolean;
}

export default function MoveDisplay({ game, callback, chatInput }: MoveDisplayProps) {
  const { sendJsonMessage, lastMessage, readyState } = useWebSocket(
    "ws://localhost:3000/cable"
  )

  const subscribe = useCallback(() => {
    sendJsonMessage({
      command: "subscribe",
      identifier: `{ "channel": "MoveChannel", "game_id": ${game.id} }`,
    })
  }, [game])

  useEffect(() => {
    if (readyState === ReadyState.OPEN) {
      subscribe()
    }
  }, [readyState])

  useEffect(() => {
    if (lastMessage) {
      const msg = JSON.parse(lastMessage.data).message
      if (msg && msg.body) {
        if (msg.body.undone) {
          callback(msg.body.id)
        } else {
          callback()
        }
      }
    }
  }, [lastMessage])

  const displayClass = "move-output move-output-logged-" + (chatInput ? "in" : "out")

  const moveList = (
    <div className={displayClass}>
      {
        game.moves.map((move, i) => {
          return (
            <div key={i} className="move-output-record">
              <div className="move-output-date">{move.formattedDate}</div>
              <div className="move-output-message">
                <span className="move-output-username">{move.user}</span>{move.stringValue}
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
