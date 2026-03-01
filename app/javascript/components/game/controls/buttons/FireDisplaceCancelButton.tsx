import React, { FormEvent } from "react";
import Game from "../../../../engine/Game";
import { CancelGlyph } from "../../../utilities/buttons";

interface FireDisplaceCancelButtonProps {
  game: Game;
  callback: () => void;
}

export default function FireDisplaceCancelButton({ game, callback }: FireDisplaceCancelButtonProps) {
  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    game.fireDisplaceState.cancel()
    callback()
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="mb025em">
        <button type="submit" className="custom-button nowrap">
           { CancelGlyph() }cancel { game.fireDisplaceState.path.length > 1 ? "displacement" : "elimination" }
           </button>
      </div>
    </form>
  )
}
