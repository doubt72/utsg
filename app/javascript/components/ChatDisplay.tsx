import React, { useCallback, useEffect, useState } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { getAPI, postAPI } from "../utilities/network";
import { ChatButton } from "./utilities/buttons";

type ChatMessage = {
  user: string;
  created_at: string;
  value: string;
}

interface ChatDisplayProps {
  gameId: number;
  showInput: boolean;
}

export default function ChatDisplay({ gameId, showInput}: ChatDisplayProps) {
  const [message, setMessage] = useState("")
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])

  const { sendJsonMessage, lastMessage, readyState } = useWebSocket(
    "ws://localhost:3000/cable"
  )

  const onChange = (value: string) => {
    setMessage(value)
  }

  const subscribe = useCallback(() => {
    sendJsonMessage({
      command: "subscribe",
      identifier: `{ "channel": "MessageChannel", "game_id": ${gameId} }`,
    })
  }, [])

  useEffect(() => {
    getAPI(`/api/v1/messages?game_id=${gameId}`, {
      ok: response => response.json().then(json => setChatMessages(json))
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
        setChatMessages([...chatMessages, msg.body])
      }
    }
  }, [lastMessage])

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (message === "") {
      return false
    } else {
      const body = { message: { value: message, game_id: gameId }}
      postAPI("/api/v1/messages", body, {
        ok: () => setMessage("")
      })
    }
  }

  let lastUser = ""
  let lastTime: Date | undefined = undefined

  const outputClass = "chat-output " + (gameId === 0 ? "main-chat-output" : "game-chat-output")

  const formattedDate = (date: Date) => {
    return `${("0" + (date.getMonth() + 1)).slice (-2)}/` +
           `${("0" + date.getDate()).slice (-2)} ` +
           `${("0" + date.getHours()).slice (-2)}:` +
           `${("0" + date.getMinutes()).slice (-2)}`
  }

  const chatMessageDispay = (
    <div className={outputClass}>
      {
        [...chatMessages].map((msg, i) => {
          const date = new Date(msg.created_at)
          if (!lastTime) {
            lastTime = new Date(Date.now() - 24 * 3600 * 1000)
          }

          if (new Date(Date.now() - 24 * 3600 * 1000) > date && gameId === 0) {
            return ("")
          }
          let time = `${("0" + date.getHours()).slice (-2)}:` +
                     `${("0" + date.getMinutes()).slice (-2)}:` +
                     `${("0" + date.getSeconds()).slice (-2)}`
          if (gameId !== 0) {
            time = formattedDate(date)
          }
          const check = msg.user === lastUser &&
            lastTime.getTime() > (date.getTime() - 300 * 1000)
          const dateClass = check ? "chat-output-date-invisible" : "chat-output-date"
          const nameClass = check ? "chat-output-username-invisible" : "chat-output-username"
          if (msg.user !== lastUser) {
            lastUser = msg.user
          }
          lastTime = date
          return (
            <div key={i} className="chat-output-record">
              <div className={dateClass}>{time}</div>
              <div className="chat-output-message">
                <span className={nameClass}>{msg.user}</span>{msg.value}
              </div>
            </div>
          )
        }).reverse()
      }
    </div>
  )

  const chatInputMessage = gameId === 0 ? "please keep chat messages relevant to game discussion" :
                                                "chat for current game"

  const chatBox = (
    <form onSubmit={onSubmit} autoComplete="off">
      <div className="chat-entry">
        <input
          type="text"
          name="message"
          className="chat-input"
          maxLength={1000}
          value={message}
          placeholder={chatInputMessage}
          onChange={({ target }) => onChange(target.value)}
        />
        <ChatButton />
      </div>
    </form>
  )

  return (
    <div>
      { chatMessageDispay }
      { showInput ? chatBox : "" }
    </div>
  )
}
