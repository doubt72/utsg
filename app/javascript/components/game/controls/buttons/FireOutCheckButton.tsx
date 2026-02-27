import React, { FormEvent } from "react";
import Game from "../../../../engine/Game";
import { DiceGlyph } from "../../../utilities/buttons";

interface FireOutCheckButtonProps {
  game: Game;
  callback: () => void;
}

export default function FireOutCheckButton({ game, callback }: FireOutCheckButtonProps) {
  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    game.gameState?.finish()
    callback()
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="mb025em">
        <button type="submit" className="custom-button nowrap">{DiceGlyph()}fire extinguish check</button>
      </div>
    </form>
  )
}
