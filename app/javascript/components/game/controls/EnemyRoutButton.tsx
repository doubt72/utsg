import React, { FormEvent } from "react";
import Game from "../../../engine/Game";
import { RoutGlyph } from "../../utilities/buttons";

interface EnemyRoutButtonProps {
  game: Game;
  callback: () => void;
}

export default function EnemyRoutButton({ game, callback }: EnemyRoutButtonProps) {
  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    game.rushing // just to do something with game
    callback()
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="mb025em">
        <button type="submit" className="custom-button nowrap">{RoutGlyph()}rout enemy (3)</button>
      </div>
    </form>
  )
}
