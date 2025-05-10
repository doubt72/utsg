import React, { FormEvent } from "react";
import { ArrowClockwise } from "react-bootstrap-icons";
import Game from "../../../engine/Game";

interface PassButtonProps {
  game: Game;
}

export default function PassButton({ game }: PassButtonProps) {
  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    game.executePass()
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="mb025em">
        <button type="submit" className="custom-button nowrap"><ArrowClockwise/>pass (-1)</button>
      </div>
    </form>
  )
}
