import React, { FormEvent } from "react";
import Game from "../../../../engine/Game";
import { CheckSquare } from "react-bootstrap-icons";
import { stateType } from "../../../../engine/control/state/BaseState";

interface FinishMultiselectButtonProps {
  game: Game;
  callback: () => void;
}

export default function FinishMultiselectButton({ game, callback }: FinishMultiselectButtonProps) {
  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (game.gameState?.type === stateType.Fire) { game.fireState.doneSelect = true }
    if (game.gameState?.type === stateType.Move) { game.moveState.doneSelect = true }
    if (game.gameState?.type === stateType.Assault) { game.assaultState.doneSelect = true }
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
