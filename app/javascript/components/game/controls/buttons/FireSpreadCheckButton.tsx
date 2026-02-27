import React, { FormEvent } from "react";
import Game from "../../../../engine/Game";
import { DiceGlyph } from "../../../utilities/buttons";

interface FireSpreadCheckButtonProps {
  game: Game;
  callback: () => void;
}

export default function FireSpreadCheckButton({ game, callback }: FireSpreadCheckButtonProps) {
  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    game.gameState?.finish()
    callback()
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="mb025em">
        <button type="submit" className="custom-button nowrap">{DiceGlyph()}fire spread check</button>
      </div>
    </form>
  )
}
