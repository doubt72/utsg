import React, { FormEvent } from "react";
import Game from "../../../engine/Game";
import { MoveGlyph } from "../../utilities/buttons";

interface MoveFinishButtonProps {
  game: Game;
  callback: () => void;
}

export default function MoveFinishButton({ game, callback }: MoveFinishButtonProps) {
  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    game.finishMove()
    callback()
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="mb025em">
        <button type="submit" className="custom-button nowrap">{MoveGlyph()}
          finish { game.rushing ? "rush" : "move" }
        </button>
      </div>
    </form>
  )
}
