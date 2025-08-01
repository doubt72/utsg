import React, { FormEvent } from "react";
import Game from "../../../../engine/Game";
import { FireGlyph } from "../../../utilities/buttons";
import FireState from "../../../../engine/control/state/FireState";

interface ReactionFireButtonProps {
  game: Game;
  callback: () => void;
}

export default function ReactionFireButton({ game, callback }: ReactionFireButtonProps) {
  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    game.gameState = new FireState(game, true)
    callback()
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="mb025em">
        <button type="submit" className="custom-button nowrap">{FireGlyph()}reaction fire (2)</button>
      </div>
    </form>
  )
}
