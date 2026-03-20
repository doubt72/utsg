import React from "react";
import { ExclamationCircle, XCircle } from "react-bootstrap-icons";

interface NotificationWindowProps {
  title: string;
  message: string;
  callBack: () => void;
}

export default function NotificationWindow({ title, message, callBack }: NotificationWindowProps ) {

  return (
    <div className="game-notification">
      <div className="game-notification-window">
        <div className="game-notification-title">
          { title }
        </div>
        <div className="game-notification-window-inner">
          <div className="game-notification-icon" style={{ color: "#B80" } }>
            <ExclamationCircle />
          </div>
          <div className="game-notification-text">
            { message }
          </div>
        </div>
        <button onClick={callBack} className="custom-button game-notification-button nowrap">
          <XCircle />close
        </button>
      </div>
    </div>
  )
}
