import React, { FormEvent } from "react";
import Game from "../../../../engine/Game";
import { MoveRushGlyph } from "../../../utilities/buttons";

interface AssaultMoveFinishButtonProps {
  game: Game;
  callback: () => void;
}

export default function AssaultMoveFinishButton({ game, callback }: AssaultMoveFinishButtonProps) {
  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    game.gameState?.finish()
    callback()
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="mb025em">
        <button type="submit" className="custom-button nowrap">{MoveRushGlyph()}
          finish assault move
        </button>
      </div>
    </form>
  )
}
