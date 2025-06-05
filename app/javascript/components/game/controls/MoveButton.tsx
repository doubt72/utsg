import React, { FormEvent } from "react";
import Game from "../../../engine/Game";
import { MoveGlyph } from "../../utilities/buttons";

interface MoveButtonProps {
  game: Game;
}

export default function MoveButton({ game }: MoveButtonProps) {
  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    game.startMove()
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="mb025em">
        <button type="submit" className="custom-button nowrap">{MoveGlyph()}move (2)</button>
      </div>
    </form>
  )
}
