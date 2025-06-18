import React, { useCallback, useEffect, useState } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import Game from "../../engine/Game";

interface ActionDisplayProps {
  game: Game;
  callback: (actionId?: number) => void;
  chatInput: boolean;
  collapse?: boolean;
}

export default function ActionDisplay({
  game, callback, chatInput, collapse = false
}: ActionDisplayProps) {
  const [divClass, setDivClass] = useState<string>("")

  const { sendJsonMessage, lastMessage, readyState } = useWebSocket(
    "ws://localhost:3000/cable"
  )

  const subscribe = useCallback(() => {
    sendJsonMessage({
      command: "subscribe",
      identifier: `{ "channel": "ActionChannel", "game_id": ${game.id} }`,
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

  useEffect(() => {
    setDivClass(
      collapse ? "action-output action-output-collapse" :
        ("action-output action-output-logged-" + (chatInput ? "in" : "out"))
    )
  }, [collapse])

  const actionList = (
    <div className={divClass}>
      {
        game.actions.map((action, i) => {
          return (
            <div key={i} className="action-output-record">
              <div className="action-output-date">{action.formattedDate}</div>
              <div className="action-output-message">
                <span className="action-output-username">{action.user}</span>{action.stringValue}
              </div>
            </div>
          )
        }).reverse()
      }
    </div>
  )

  return (
    <div>
      { actionList }
    </div>
  )
}
