import React, { FormEvent } from "react";
import Game from "../../../../engine/Game";
import OverstackState from "../../../../engine/control/state/OverstackState";
import { EliminateGlyph } from "../../../utilities/buttons";

interface OverstackReduceButtonProps {
  game: Game;
  callback: () => void;
}

export default function OverstackReduceButton({ game, callback }: OverstackReduceButtonProps) {
  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    const state = game.gameState as OverstackState
    state.finish()
    callback()
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="mb025em">
        <button type="submit" className="custom-button nowrap">{ EliminateGlyph() }reduce</button>
      </div>
    </form>
  )
}
