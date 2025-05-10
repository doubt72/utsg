import React, { FormEvent } from "react";
import Game from "../../../engine/Game";
import { RoutGlyph } from "../../utilities/buttons";

interface RoutButtonProps {
  game: Game;
}

export default function RoutButton({ game }: RoutButtonProps) {
  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    game.executeUndo()
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="mb025em">
        <button type="submit" className="custom-button nowrap">{RoutGlyph()}rout (1)</button>
      </div>
    </form>
  )
}
