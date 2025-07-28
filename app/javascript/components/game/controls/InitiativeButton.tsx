import React, { FormEvent } from "react";
import Game from "../../../engine/Game";
import { Dice6 } from "react-bootstrap-icons";
import { finishInitiative } from "../../../engine/control/mainActions";

interface InitiativeButtonProps {
  game: Game;
  callback: () => void;
}

export default function InitiativeButton({ game, callback }: InitiativeButtonProps) {
  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    finishInitiative(game)
    callback()
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="mb025em">
        <button type="submit" className="custom-button nowrap"><Dice6 />initiative check</button>
      </div>
    </form>
  )
}
