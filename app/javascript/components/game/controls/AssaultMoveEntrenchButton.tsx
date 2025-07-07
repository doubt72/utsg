import React, { FormEvent } from "react";
import Game from "../../../engine/Game";
import { ShieldFill } from "react-bootstrap-icons";

interface AssaultMoveEntrenchButtonProps {
  game: Game;
  callback: () => void;
}

export default function AssaultMoveEntrenchButton({ game, callback }: AssaultMoveEntrenchButtonProps) {
  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    game.assaultEntrench()
    callback()
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="mb025em">
        <button type="submit" className="custom-button nowrap"><ShieldFill />entrench</button>
      </div>
    </form>
  )
}
