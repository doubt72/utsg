import React, { useCallback, useEffect, useState } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { getAPI, postAPI } from "../utilities/network";
import { ChatButton } from "./utilities/buttons";

export default function ChatDisplay() {
  const [message, setMessage] = useState("")
  const [chatMessages, setChatMessages] = useState([])

  const { sendJsonMessage, lastMessage, readyState } = useWebSocket("ws://localhost:3000/cable")

  const onChange = (value) => {
    setMessage(value)
  }

  const subscribe = useCallback(() => {
    sendJsonMessage({
      command: "subscribe",
      identifier: '{ "channel": "MessageChannel", "game_id": 0 }',
    })
  })

  useEffect(() => {
    getAPI("/api/v1/messages?game_id=0", {
      ok: response => response.json().then(json => { setChatMessages(json) })
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

  const onSubmit = (event) => {
    event.preventDefault()
    if (message === "") {
      return false
    } else {
      const body = { message: { value: message, game_id: 0 }}
      postAPI("/api/v1/messages", body, {
        ok: () => setMessage("")
      })
    }
  }

  let lastUser = ""
  let key = 0

  const chatMessageDispay = (
    <div className="chat-output">
      {
        [...chatMessages].map(msg => {
          const date = new Date(msg.created_at)
          if (new Date(Date.now() - 24 * 3600 * 1000) > date) {
            return ("")
          }
          const time = `${("0" + date.getHours()).slice (-2)}:` +
            `${("0" + date.getMinutes()).slice (-2)}:` +
            `${("0" + date.getSeconds()).slice (-2)}`
          const dateClass = msg.user === lastUser ? "chat-output-date-invisible" : "chat-output-date"
          const nameClass = msg.user === lastUser ? "chat-output-username-invisible" : "chat-output-username"
          if (msg.user !== lastUser) {
            lastUser = msg.user
          }
          return (
            <div key={key++} className="chat-output-record">
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

  const chatBox = (
    <form onSubmit={onSubmit} autoComplete="off">
      <div className="chat-entry">
        <input
          type="text"
          name="message"
          className="chat-input"
          maxLength={1000}
          value={message}
          placeholder="please keep chat messages relevant to game discussion"
          onChange={({ target }) => onChange(target.value)}
        />
        <ChatButton />
      </div>
    </form>
  )

  return (
    <div>
      { chatMessageDispay }
      { localStorage.getItem("username") ? chatBox : "" }
    </div>
  )
}
