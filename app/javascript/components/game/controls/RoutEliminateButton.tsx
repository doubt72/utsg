import React, { FormEvent } from "react";
import Game from "../../../engine/Game";
import { RoutGlyph } from "../../utilities/buttons";

interface RoutEliminateButtonProps {
  game: Game;
  callback: () => void;
}

export default function RoutEliminateButton({ game, callback }: RoutEliminateButtonProps) {
  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    game.finishRout()
    callback()
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="mb025em">
        <button type="submit" className="custom-button nowrap">{RoutGlyph()}eliminate unit</button>
      </div>
    </form>
  )
}
