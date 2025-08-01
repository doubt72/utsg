import React, { FormEvent } from "react";
import Game from "../../../../engine/Game";
import { XLg } from "react-bootstrap-icons";

interface AssaultMoveClearButtonProps {
  game: Game;
  callback: () => void;
}

export default function AssaultMoveClearButton({ game, callback }: AssaultMoveClearButtonProps) {
  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    game.assaultState.clear()
    callback()
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="mb025em">
        <button type="submit" className="custom-button nowrap"><XLg />clear obstacle</button>
      </div>
    </form>
  )
}
