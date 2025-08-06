import React, { FormEvent } from "react";
import Game from "../../../../engine/Game";
import { DashSquare } from "react-bootstrap-icons";

interface CloseCombatReduceButtonProps {
  game: Game;
  callback: () => void;
}

export default function CloseCombatReduceButton({ game, callback }: CloseCombatReduceButtonProps) {
  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    game.closeCombatState.reduceUnit()
    callback()
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="mb025em">
        <button type="submit" className="custom-button nowrap"><DashSquare />reduce unit</button>
      </div>
    </form>
  )
}
