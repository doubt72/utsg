import React, { FormEvent } from "react";
import Game from "../../../engine/Game";
import { MoveRushGlyph } from "../../utilities/buttons";

interface AssaultMoveButtonProps {
  game: Game;
  callback: () => void;
}

export default function AssaultMoveButton({ game, callback }: AssaultMoveButtonProps) {
  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    game.rushing // just to do something with game
    callback()
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="mb025em">
        <button type="submit" className="custom-button nowrap">{MoveRushGlyph()}assault move (3)</button>
      </div>
    </form>
  )
}
