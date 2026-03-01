import React, { FormEvent } from "react";
import Game from "../../../../engine/Game";
import { EliminateGlyph, MoveGlyph } from "../../../utilities/buttons";

interface FireDisplaceConfirmButtonProps {
  game: Game;
  callback: () => void;
}

export default function FireDisplaceConfirmButton({ game, callback }: FireDisplaceConfirmButtonProps) {
  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    game.gameState?.finish()
    callback()
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="mb025em">
        <button type="submit" className="custom-button nowrap">
          {
            game.fireDisplaceState.path.length > 1 ? MoveGlyph() : EliminateGlyph()
          }confirm {
            game.fireDisplaceState.path.length > 1 ? "displacement" : "elimination"
          }
        </button>
      </div>
    </form>
  )
}
