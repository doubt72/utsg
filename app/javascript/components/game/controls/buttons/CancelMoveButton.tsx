import React, { FormEvent } from "react";
import Game from "../../../../engine/Game";
import { CancelGlyph } from "../../../utilities/buttons";

interface CancelMoveButtonProps {
  game: Game;
  callback: () => void;
}

export default function CancelMoveButton({ game, callback }: CancelMoveButtonProps) {
  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    game.moveState.unmove()
    callback()
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="mb025em">
        <button type="submit" className="custom-button nowrap">{CancelGlyph()} undo last move</button>
      </div>
    </form>
  )
}
