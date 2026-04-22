import React, { FormEvent } from "react";
import Game from "../../../../engine/Game";
import { ArrowClockwise } from "react-bootstrap-icons";

interface FinishDeployButtonProps {
  game: Game;
  callback: () => void;
}

export default function FinishDeployButton({ game, callback }: FinishDeployButtonProps) {
  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    game.gameState?.finish()
    callback()
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="mb025em">
        <button type="submit" className="custom-button nowrap"><ArrowClockwise/>finish deployment</button>
      </div>
    </form>
  )
}
