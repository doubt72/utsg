import React, { FormEvent } from "react";
import Game from "../../../../engine/Game";
import { EliminateGlyph } from "../../../utilities/buttons";

interface FireDisplaceEliminateButtonProps {
  game: Game;
  callback: () => void;
}

export default function FireDisplaceEliminateButton({ game, callback }: FireDisplaceEliminateButtonProps) {
  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (game.fireDisplaceState.availableHexes.length > 0) {
      game.fireDisplaceState.remove = true
    } else {
      game.gameState?.finish
    }
    callback()
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="mb025em">
        <button type="submit" className="custom-button nowrap">{ EliminateGlyph() }eliminate unit</button>
      </div>
    </form>
  )
}
