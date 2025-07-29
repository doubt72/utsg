import React, { FormEvent } from "react";
import Game from "../../../engine/Game";
import { CheckSquare } from "react-bootstrap-icons";

interface FinishRotationButtonProps {
  game: Game;
  callback: () => void;
}

export default function FinishRotationButton({ game, callback }: FinishRotationButtonProps) {
  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    const action = game.gameState?.fire
    if (action) { action.doneRotating = true }
    callback()
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="mb025em">
        <button type="submit" className="custom-button nowrap"><CheckSquare />end turret rotation</button>
      </div>
    </form>
  )
}
