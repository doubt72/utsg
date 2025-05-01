import React, { FormEvent } from "react";
import { ArrowCounterclockwise } from "react-bootstrap-icons";
import Game from "../../../engine/Game";

interface UndoButtonProps {
  game: Game;
}

export default function UndoButton({ game }: UndoButtonProps) {
  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    game.executeUndo()
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="mb025em">
        <button type="submit" className="custom-button nowrap"><ArrowCounterclockwise/>undo</button>
      </div>
    </form>
  )
}
