import React, { FormEvent } from "react";
import Game from "../../../../engine/Game";
import { Dice6 } from "react-bootstrap-icons";

interface BreakdownButtonProps {
  game: Game;
  callback: () => void;
}

export default function BreakdownButton({ game, callback }: BreakdownButtonProps) {
  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    game.gameState?.finish()
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
