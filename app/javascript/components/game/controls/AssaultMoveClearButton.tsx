import React, { FormEvent } from "react";
import Game from "../../../engine/Game";
import { CircleSquare } from "react-bootstrap-icons";

interface AssaultMoveClearButtonProps {
  game: Game;
  callback: () => void;
}

export default function AssaultMoveClearButton({ game, callback }: AssaultMoveClearButtonProps) {
  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    game.assaultClear()
    callback()
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="mb025em">
        <button type="submit" className="custom-button nowrap"><CircleSquare />clear obstacle</button>
      </div>
    </form>
  )
}
