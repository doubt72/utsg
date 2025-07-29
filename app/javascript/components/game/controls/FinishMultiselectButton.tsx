import React, { FormEvent } from "react";
import Game from "../../../engine/Game";
import { CheckSquare } from "react-bootstrap-icons";
import { AssaultMoveActionState, FireActionState, MoveActionState } from "../../../engine/control/mainActions";

interface FinishMultiselectButtonProps {
  game: Game;
  callback: () => void;
}

export default function FinishMultiselectButton({ game, callback }: FinishMultiselectButtonProps) {
  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    let action: MoveActionState | AssaultMoveActionState | FireActionState | undefined = game.gameState?.fire
    if (!action) { action = game.gameState?.move }
    if (!action) { action = game.gameState?.assault }
    if (action) { action.doneSelect = true }
    game.closeOverlay = true
    callback()
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="mb025em">
        <button type="submit" className="custom-button nowrap"><CheckSquare />end selection</button>
      </div>
    </form>
  )
}
