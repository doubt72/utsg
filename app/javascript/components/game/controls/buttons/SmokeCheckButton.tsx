import React, { FormEvent } from "react";
import Game from "../../../../engine/Game";
import { DiceGlyph } from "../../../utilities/buttons";

interface SmokeCheckButtonProps {
  game: Game;
  callback: () => void;
}

export default function SmokeCheckButton({ game, callback }: SmokeCheckButtonProps) {
  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    game.gameState?.finish()
    callback()
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="mb025em">
        <button type="submit" className="custom-button nowrap">{DiceGlyph()}smoke dissipation check</button>
      </div>
    </form>
  )
}
