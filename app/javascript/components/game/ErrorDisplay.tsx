import React from "react";
import { ShieldFillExclamation, ShieldFillX, XCircle } from "react-bootstrap-icons";

interface ErrorDisplayProps {
  type: string;
  message: string;
  callBack: () => void;
}

export default function ErrorDisplay({ type, message, callBack }: ErrorDisplayProps ) {
  const intro = type === "warn" ? "warning: " : ""
  const icon = type === "warn" ? <ShieldFillExclamation /> : <ShieldFillX />
  const iconColor = type === "warn" ? "#B90" : "#C00"

  return (
    <div className="game-error">
      <div className="game-error-window">
        <div className="game-error-window-inner">
          <div className="game-error-icon" style={{ color: iconColor} }>
            {icon}
          </div>
          <div className="game-error-text">
            {intro}{message}
          </div>
        </div>
        <div onClick={callBack} className="custom-button game-error-button nowrap"><XCircle /> close</div>
      </div>
    </div>
  )
}