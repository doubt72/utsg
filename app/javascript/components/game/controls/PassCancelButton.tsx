import React, { FormEvent } from "react";
import Game from "../../../engine/Game";
import { CancelGlyph } from "../../utilities/buttons";

interface PassCancelButtonProps {
  game: Game;
  callback: () => void;
}

export default function PassCancelButton({ game, callback }: PassCancelButtonProps) {
  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    game.gameState = undefined
    callback()
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="mb025em">
        <button type="submit" className="custom-button nowrap">{ CancelGlyph() }cancel pass</button>
      </div>
    </form>
  )
}
