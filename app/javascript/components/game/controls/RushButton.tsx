import React, { FormEvent } from "react";
import Game from "../../../engine/Game";
import { MoveRushGlyph } from "../../utilities/buttons";

interface RushButtonProps {
  game: Game;
  callback: () => void;
}

export default function RushButton({ game, callback }: RushButtonProps) {
  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    game.startMove()
    callback()
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="mb025em">
        <button type="submit" className="custom-button nowrap">{MoveRushGlyph()}rush (2)</button>
      </div>
    </form>
  )
}
