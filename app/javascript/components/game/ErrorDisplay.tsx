import React from "react";
import { QuestionCircle, ShieldFillExclamation, ShieldFillX, XCircle } from "react-bootstrap-icons";
import UndoButton from "./controls/buttons/UndoButton";
import Game from "../../engine/Game";
import { helpIndexByName } from "../help/helpData";

interface ErrorDisplayProps {
  game: Game;
  type: string;
  message: string;
  section?: string;
  callBack: () => void;
}

export default function ErrorDisplay({ game, type, message, section, callBack }: ErrorDisplayProps ) {
  const intro = type === "stack" ? "warning: " : ""
  const icon = type === "stack" ? <ShieldFillExclamation /> : <ShieldFillX />
  const iconColor = type === "stack" ? "#B90" : "#C00"

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
        <div className="game-error-buttons">
          <div className="flex">
            <div className="flex-fill"></div>
            { type === "stack" ?
              <div className="mb025em">
                <button onClick={()=> window.open(`/help/${helpIndexByName(section ?? "Stacking").join(".")}`)}
                        className="custom-button nowrap">
                  <QuestionCircle />about { (section ?? "stacking").toLowerCase() }
                </button>
              </div> : "" }
            { type === "stack" ?
              <UndoButton game={game} callback={callBack} /> : "" }
            <div className="mb025em">
              <button onClick={callBack} className="custom-button nowrap">
                <XCircle />close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
