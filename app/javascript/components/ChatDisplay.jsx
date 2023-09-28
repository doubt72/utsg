import React, { useCallback, useEffect, useState } from "react";
import { ChatText } from "react-bootstrap-icons";
import useWebSocket, { ReadyState } from "react-use-websocket";
import sanitize from "sanitize-html";
import { getAPI, postAPI } from "../helper";

export default () => {
  const [message, setMessage] = useState("")
  const [allMessages, setAllMessages] = useState([])
  const [diplayAllMessages, setDisplayAllMessages] = useState("")

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

  const updateAllMessages = () => {
    let display = ""
    let lastName = ""
    for (const rec of allMessages) {
      const date = new Date(rec.created_at)
      if (new Date(Date.now() - 24 * 3600 * 1000) > date) {
        continue
      }
      const time = `${("0" + date.getHours()).slice (-2)}:` +
        `${("0" + date.getMinutes()).slice (-2)}:` +
        `${("0" + date.getSeconds()).slice (-2)}`
      const name = sanitize(rec.username, { allowedTags: [], disallowedTagsMode: 'escape' })
      const msg = sanitize(rec.value, { allowedTags: [], disallowedTagsMode: 'escape'  })
      const dateClass = name === lastName ? "chat-output-date-invisible" : "chat-output-date"
      const nameClass = name === lastName ? "chat-output-username-invisible" : "chat-output-username"
      if (name !== lastName) {
        lastName = name
      }
      // display = `<div class="chat-output-record">${time}</div>` + display
      display = `
          <div class="chat-output-record">
            <div class="${dateClass}">${time}</div>
            <div class="chat-output-message"><span class="${nameClass}">${name}</span>${msg}</div>
          </div>` + display
    }
    setDisplayAllMessages(display)
  }

  useEffect(() => {
    getAPI("/api/v1/messages?game_id=0", {
      ok: response => response.json().then(json => { setAllMessages([...json]) })
    })
  }, [])

  useEffect(() => {
    updateAllMessages()
  }, [allMessages])

  useEffect(() => {
    if (readyState === ReadyState.OPEN) {
      subscribe()
    }
  }, [readyState])

  useEffect(() => {
    if (lastMessage) {
      const msg = JSON.parse(lastMessage.data).message
      if (msg && msg.body) {
        setAllMessages([...allMessages, msg.body])
      }
    }
  }, [lastMessage])

  const onSubmit = (event) => {
    event.preventDefault()
    if (message === "") {
      return false
    } else {
      body = { message: { value: message, game_id: 0 }}
      postAPI("/api/v1/messages", body, {
        ok: _response => setMessage("")
      })
    }
  }

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
        <button type="submit" className="custom-button nowrap">
          <ChatText />chat
        </button>
      </div>
    </form>
  )

  return (
    <div>
      <div className="chat-output" dangerouslySetInnerHTML={{__html: diplayAllMessages}} />
      { localStorage.getItem("username") ? chatBox : "" }
    </div>
  )
}
