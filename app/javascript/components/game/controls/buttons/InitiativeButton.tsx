import React, { FormEvent } from "react";
import Game from "../../../../engine/Game";
import { DiceGlyph } from "../../../utilities/buttons";

interface InitiativeButtonProps {
  game: Game;
  callback: () => void;
}

export default function InitiativeButton({ game, callback }: InitiativeButtonProps) {
  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    game.gameState?.finish()
    callback()
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="mb025em">
        <button type="submit" className="custom-button nowrap">{DiceGlyph()}initiative check</button>
      </div>
    </form>
  )
}
