import React, { FormEvent } from "react";
import Game from "../../../engine/Game";
import { MoveGlyph } from "../../utilities/buttons";
import { finishMove } from "../../../engine/control/mainActions";
import { rushing } from "../../../engine/control/checks";

interface MoveFinishButtonProps {
  game: Game;
  callback: () => void;
}

export default function MoveFinishButton({ game, callback }: MoveFinishButtonProps) {
  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    finishMove(game)
    callback()
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="mb025em">
        <button type="submit" className="custom-button nowrap">{MoveGlyph()}
          finish { rushing(game) ? "rush" : "move" }
        </button>
      </div>
    </form>
  )
}
