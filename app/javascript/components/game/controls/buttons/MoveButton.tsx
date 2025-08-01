import React, { FormEvent } from "react";
import Game from "../../../../engine/Game";
import { MoveGlyph } from "../../../utilities/buttons";
import MoveState from "../../../../engine/control/state/MoveState";

interface MoveButtonProps {
  game: Game;
  callback: () => void;
}

export default function MoveButton({ game, callback }: MoveButtonProps) {
  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    game.gameState = new MoveState(game)
    callback()
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="mb025em">
        <button type="submit" className="custom-button nowrap">{MoveGlyph()}move (2)</button>
      </div>
    </form>
  )
}
