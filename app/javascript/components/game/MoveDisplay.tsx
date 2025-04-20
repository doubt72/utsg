import React, { useCallback, useEffect, useState } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { getAPI } from "../../utilities/network";
import GameMove, { GameMoveData } from "../../engine/GameMove";
import Game from "../../engine/Game";

interface MoveDisplayProps {
  game: Game | undefined;
  callback: () => void;
  chatInput: boolean;
}

export default function MoveDisplay({ game, callback, chatInput }: MoveDisplayProps) {
  const [moves, setMoves] = useState<GameMoveData[]>([])

  const { sendJsonMessage, lastMessage, readyState } = useWebSocket(
    "ws://localhost:3000/cable"
  )

  const subscribe = useCallback(() => {
    if (!game) { return }
    sendJsonMessage({
      command: "subscribe",
      identifier: `{ "channel": "MoveChannel", "game_id": ${game.id} }`,
    })
  }, [game])

  useEffect(() => {
    if (!game) { return }
    getAPI(`/api/v1/game_moves?game_id=${game.id}`, {
      ok: response => response.json().then(json => setMoves(json))
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
          // moves won't be loaded without game, so casting "undefined" to Game is okay
          const move = new GameMove(m, game as Game, i).moveClass
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
