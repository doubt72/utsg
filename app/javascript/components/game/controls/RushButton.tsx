import React, { FormEvent } from "react";
import Game from "../../../engine/Game";
import { MoveRushGlyph } from "../../utilities/buttons";
import MoveState from "../../../engine/control/state/MoveState";

interface RushButtonProps {
  game: Game;
  callback: () => void;
}

export default function RushButton({ game, callback }: RushButtonProps) {
  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    game.gameState = new MoveState(game)
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
