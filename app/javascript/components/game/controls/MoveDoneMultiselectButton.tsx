import React, { FormEvent } from "react";
import Game from "../../../engine/Game";
import { MoveGlyph } from "../../utilities/buttons";

interface MoveDoneMultiselectButtonProps {
  game: Game;
  callback: () => void;
}

export default function MoveDoneMultiselectButton({ game, callback }: MoveDoneMultiselectButtonProps) {
  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    const move = game.gameActionState?.move
    if (move) { move.doneSelect = true }
    game.closeOverlay = true
    callback()
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="mb025em">
        <button type="submit" className="custom-button nowrap">{MoveGlyph()}end selection</button>
      </div>
    </form>
  )
}
