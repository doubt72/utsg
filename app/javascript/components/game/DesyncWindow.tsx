import React from "react";
import { ShieldFillX, WrenchAdjustable } from "react-bootstrap-icons";

interface DesyncWindowProps {
  title: string;
  message: string;
}

export default function DesyncWindow({ title, message }: DesyncWindowProps ) {
  const callback = () => {
    window.location.reload()
  }

  return (
    <div className="game-notification">
      <div className="game-notification-window">
        <div className="game-notification-title">
          { title }
        </div>
        <div className="game-notification-window-inner">
          <div className="game-notification-icon" style={{ color: "#C00" } }>
            <ShieldFillX />
          </div>
          <div className="game-notification-text">
            { message }
          </div>
          <button onClick={() => callback()} className="custom-button game-notification-button nowrap">
            <WrenchAdjustable />attempt to reconnect
          </button>
        </div>
      </div>
    </div>
  )
}
