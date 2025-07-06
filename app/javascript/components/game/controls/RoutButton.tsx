import React, { FormEvent } from "react";
import Game from "../../../engine/Game";
import { RoutGlyph } from "../../utilities/buttons";

interface RoutButtonProps {
  game: Game;
  callback: () => void;
}

export default function RoutButton({ game, callback }: RoutButtonProps) {
  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    game.rushing // just to do something with game
    // game.executeUndo()
    callback()
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="mb025em">
        <button type="submit" className="custom-button nowrap">{RoutGlyph()}rout (1)</button>
      </div>
    </form>
  )
}
