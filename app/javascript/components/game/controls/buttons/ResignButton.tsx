import React, { FormEvent } from "react";
import { XCircle } from "react-bootstrap-icons";
import Game from "../../../../engine/Game";

interface ResignButtonProps {
  game: Game;
  callback: () => void;
}

export default function ResignButton({ game, callback }: ResignButtonProps) {
  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    game.increaseResignation()
    callback()
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="mb025em">
        <button type="submit" className="custom-button nowrap"><XCircle/>resign</button>
      </div>
    </form>
  )
}
