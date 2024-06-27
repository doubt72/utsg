import React, { useCallback, useEffect, useState } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { getAPI } from "../../utilities/network";
import GameMove, { GameMoveData } from "../../engine/GameMove";

interface MoveDisplayProps {
  gameId: number;
  callback: () => void;
  chatInput: boolean;
}

export default function MoveDisplay({ gameId, callback, chatInput}: MoveDisplayProps) {
  const [moves, setMoves] = useState<GameMoveData[]>([])

  const { sendJsonMessage, lastMessage, readyState } = useWebSocket(
    "ws://localhost:3000/cable"
  )

  const subscribe = useCallback(() => {
    sendJsonMessage({
      command: "subscribe",
      identifier: `{ "channel": "MoveChannel", "game_id": ${gameId} }`,
    })
  }, [])

  useEffect(() => {
    getAPI(`/api/v1/game_moves?game_id=${gameId}`, {
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
        callback()
      }
    }
  }, [lastMessage])

  const displayClass = "move-output move-output-logged-" + (chatInput ? "in" : "out")

  const moveList = (
    <div className={displayClass}>
      {
        [...moves].map((m: GameMoveData, i) => {
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
