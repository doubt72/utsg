import React, { FormEvent } from "react";
import Game from "../../../../engine/Game";
import { FireGlyph } from "../../../utilities/buttons";

interface FireFinishButtonProps {
  game: Game;
  callback: () => void;
}

export default function FireFinishButton({ game, callback }: FireFinishButtonProps) {
  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    game.gameState?.finish()
    callback()
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="mb025em">
        <button type="submit" className="custom-button nowrap">{FireGlyph()}finish fire</button>
      </div>
    </form>
  )
}
