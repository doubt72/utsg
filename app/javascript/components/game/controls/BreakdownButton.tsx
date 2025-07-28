import React, { FormEvent } from "react";
import Game from "../../../engine/Game";
import { Dice6 } from "react-bootstrap-icons";
import { finishBreakdown } from "../../../engine/control/mainActions";

interface BreakdownButtonProps {
  game: Game;
  callback: () => void;
}

export default function BreakdownButton({ game, callback }: BreakdownButtonProps) {
  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    finishBreakdown(game)
    callback()
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="mb025em">
        <button type="submit" className="custom-button nowrap"><Dice6 />check for breakdown</button>
      </div>
    </form>
  )
}
